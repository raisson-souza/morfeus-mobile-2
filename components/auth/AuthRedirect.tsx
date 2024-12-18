import { AuthContextProvider } from "../../contexts/AuthContext"
import { router } from "expo-router"
import { useEffect } from "react"

type AuthRedirectProps = {
    children: JSX.Element | JSX.Element[]
}

/**
 * Componente responsável pelo controle de rotas não autenticadas  
 * Realiza redirecionamento para a tela inicial
 * */
export default function AuthRedirect({ children }: AuthRedirectProps) {
    const { isLogged } = AuthContextProvider()

    useEffect(() => {
        if (isLogged) router.navigate("/(tabs)")
    }, [])

    return children
}