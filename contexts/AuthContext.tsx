import { createContext, useContext, useEffect, useRef, useState } from "react"
import { LocalStorage } from "@/utils/LocalStorage"
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

    useEffect(() => {
        const manageAuth = async () => {
            const loginCredentials = await LocalStorage.loginCredentials.get()
            const tokenInfo = await LocalStorage.tokenInfo.get()
            let loggedIn = false

            // Verificamos se há token ativo ainda válido
            if (tokenInfo) {
                if ((new Date().getTime() / 1000) < tokenInfo.tokenExpirationDateMilis) {
                    loggedIn = true
                }
                else {
                    // Verifica conexão com internet, caso não haja, usuário está offline
                    const hasInternetConnection = await InternetInfo()
                        .then(internetInfo => { return internetInfo?.isConnected ?? false })

                    if (!hasInternetConnection) loggedIn = true
                }
            }
            // Caso não haja token válido, é realizado login se houver credenciais
            else if (loginCredentials) {
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
                    loggedIn = true
                }
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

            setLoading(false)
        }
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
        setLoading(true)
        await LocalStorage.logoff()
        setIsLogged(false)
        setLoading(false)
    }

    if (loading) {
        return (
            <Screen>
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