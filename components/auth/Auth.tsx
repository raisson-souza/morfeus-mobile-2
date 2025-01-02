import { AuthContextProvider } from "../../contexts/AuthContext"
import { router } from "expo-router"
import { useFocusEffect } from "@react-navigation/native"

type AuthProps = {
    children: JSX.Element | JSX.Element[]
}

export default function AuthRoute({ children }: AuthProps) {
    const { isLogged } = AuthContextProvider()

    useFocusEffect(() => {
        if (!isLogged) {
            router.navigate("/login")
        }
    })

    return children
}