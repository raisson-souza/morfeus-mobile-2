import { createContext, useContext, useEffect, useRef, useState } from "react"
import { LocalStorage, LocalStorageCredentials } from "@/utils/LocalStorage"
import { LoginRequest } from "@/types/login"
import { RegistryRequest } from "@/types/registry"
import { Screen } from "../components/base/Screen"
import { UserDataLocalStorage } from "@/types/user"
import { useRouter } from "expo-router"
import AuthService from "@/services/api/AuthService"
import InternetInfo from "@/utils/InternetInfo"
import Loading from "../components/base/Loading"
import UserService from "@/services/api/UserService"

type AuthContextProps = {
    children: JSX.Element | JSX.Element[]
}

type AuthContext = {
    isLogged: boolean
    /** Usando com o hook useTransition, pode não realizar um refresh no componente se necessário */
    setIsLogged: React.Dispatch<React.SetStateAction<boolean>>
    /** Função de login */
    login: (credentials: LoginRequest) => Promise<void>
    /** Função de cadastro */
    registry: (credentials: RegistryRequest) => Promise<void>
    /** Função de logoff */
    logoff: () => Promise<void>
    /** Informações do usuário em memória */
    userInfo: React.MutableRefObject<UserDataLocalStorage>
}

const AuthContext = createContext<AuthContext | null>(null)

/** Context de autenticação, realiza o refresh do token de autenticação e valida credenciais no localStorage */
export default function AuthContextComponent({ children }: AuthContextProps) {
    const router = useRouter()
    const [ loading, setLoading ] = useState<boolean>(true)
    const [ isLogged, setIsLogged ] = useState<boolean>(false)
    const userInfo = useRef<UserDataLocalStorage>({
        id: 0,
        name: "",
        email: "",
        password: "",
    })
    const refreshInterval = useRef<NodeJS.Timeout | null>(null)

    useEffect(() => {
        if (!isLogged)
            manageAuth()
    }, [])

    const login = async (credentials: LoginRequest) => {
        const loginResponse = await AuthService.Login({
            email: credentials.email,
            password: credentials.password
        })

        if (loginResponse.Success) {
            await LocalStorage.login(
                {
                    token: loginResponse.Data.token,
                    tokenExpirationDateMilis: loginResponse.Data.expirationDateMilis
                },
                {
                    email: credentials.email,
                    password: credentials.password
                }
            )

            const getUserResponse = await UserService.GetUser(loginResponse.Data.userId)

            if (getUserResponse.Success) {
                userInfo.current = {
                    id: loginResponse.Data.userId,
                    name: getUserResponse.Data.fullName,
                    email: getUserResponse.Data.email,
                    password: credentials.password,
                }

                await LocalStorage.userInfo.set({
                    id: getUserResponse.Data.id,
                    name: getUserResponse.Data.fullName,
                })
            }
            else {
                userInfo.current = {
                    id: loginResponse.Data.userId,
                    name: "",
                    email: credentials.email,
                    password: credentials.password,
                }
            }

            setIsLogged(true)
            router.navigate("/home")
            await refreshTokenIntervalAction(credentials)
            return
        }

        alert(loginResponse.ErrorMessage)
    }

    const registry = async (credentials: RegistryRequest) => {
        const registryResponse = await AuthService.Registry({
            fullName: credentials.fullName,
            email: credentials.email,
            password: credentials.password
        })

        if (registryResponse.Success) {
            router.navigate("/login")
            return
        }

        alert(registryResponse.ErrorMessage)
    }

    const logoff = async () => {
        clearInterval(refreshInterval.current!)
        refreshInterval.current = null
        setLoading(true)
        await LocalStorage.logoff()
        setIsLogged(false)
        setLoading(false)
    }

    const manageAuth = async () => {
        const loginCredentials = await LocalStorage.loginCredentials.get()
        const tokenInfo = await LocalStorage.tokenInfo.get()
        let tokenExpirationMilis = 0
        let loggedIn = false

        // Há token
        if (tokenInfo) {
            const nowSeconds = new Date().getTime() / 1000
            // Token válido
            if (nowSeconds < tokenInfo.tokenExpirationDateMilis) {
                loggedIn = true

                const tokenExpirationDiff = tokenInfo.tokenExpirationDateMilis - nowSeconds
                // Se o tempo de expiração for maior que um minuto, o refresh será feito
                // quando 75% do tempo de expiração for atingido, se não,  imediatamente
                tokenExpirationMilis = tokenExpirationDiff >= 60
                    ? tokenExpirationDiff * 0.75
                    : 1
            }
            // Token inválido
            else {
                // Verifica conexão
                const hasInternetConnection = await InternetInfo()
                    .then(internetInfo => { return internetInfo?.isConnected ?? false })

                // Caso token inválido e sem internet, login offline
                if (!hasInternetConnection) loggedIn = true
            }
        }
        // Há credenciais e o usuário continua não logado
        if (loginCredentials && !loggedIn) {
            const { isLogged } = await refreshToken(loginCredentials)
            loggedIn = isLogged
        }

        if (
            (tokenInfo || loginCredentials) &&
            loggedIn
        ) {
            const userInfoLocalStorage = await LocalStorage.userInfo.get()
            userInfo.current = {
                id: userInfoLocalStorage?.id ?? 0,
                name: userInfoLocalStorage?.name ?? "",
                email: loginCredentials?.email ?? "",
                password: loginCredentials?.password ?? "",
            }
            setIsLogged(true)
        }

        if (tokenExpirationMilis != 0) {
            // Timeout para refresh quando token com tempo de expiração incerta
            setTimeout(async () => {
                await refreshToken(loginCredentials!)

                // Interval quando token com expiração conhecida
                await refreshTokenIntervalAction(loginCredentials!)

            }, tokenExpirationMilis * 1000)
        }

        setLoading(false)
    }

    const refreshToken = async (loginCredentials: LocalStorageCredentials ): Promise<{ isLogged: boolean }> => {
        const loginResponse = await AuthService.Login({
            email: loginCredentials.email,
            password: loginCredentials.password
        })

        if (loginResponse.Success) {
            await LocalStorage.login(
                {
                    token: loginResponse.Data.token,
                    tokenExpirationDateMilis: loginResponse.Data.expirationDateMilis
                },
                {
                    email: loginCredentials.email,
                    password: loginCredentials.password
                }
            )
            return {
                isLogged: true,
            }
        }

        return {
            isLogged: false,
        }
    }

    const refreshTokenIntervalAction = async (loginCredentials: LocalStorageCredentials) => {
        const _refreshInterval = setInterval(async () => {
            await refreshToken(loginCredentials!)
        }, 1800000) // <- 30 minutos
        refreshInterval.current = _refreshInterval
    }

    if (loading) {
        return (
            <Screen flex>
                <Loading onlyLoading={ false } />
            </Screen>
        )
    }

    return (
        <AuthContext.Provider value={{
            isLogged,
            setIsLogged,
            login,
            registry,
            logoff,
            userInfo,
        }}>
            { children }
        </AuthContext.Provider>
    )
}

export function AuthContextProvider() {
    const context = useContext(AuthContext)
    if (!context) throw new Error("AuthContext chamado fora do provider.")
    return context
}