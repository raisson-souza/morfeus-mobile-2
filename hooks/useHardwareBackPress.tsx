import { Alert, BackHandler } from "react-native"
import { useFocusEffect } from "@react-navigation/native"
import { useRouter } from "expo-router"

type BackHandlerOptions = {
    canExit: boolean
    message?: string
    onConfirm?: () => void
    onCancel?: () => void
}

export function useCustomBackHandler({
    canExit,
    message = "Deseja realmente sair? Os dados atuais serão perdidos.",
    onConfirm,
    onCancel,
}: BackHandlerOptions) {
    const router = useRouter()

    const handleBackPress = () => {
        if (!canExit) {
            Alert.alert(
                "Atenção!",
                message,
                [
                    {
                        text: "CANCELAR",
                        onPress: onCancel || (() => null),
                    },
                    {
                        text: "SIM",
                        onPress: onConfirm || (() => router.back()),
                    },
                ],
                { cancelable: true }
            )
        }
        else {
            router.back()
        }
        return true
    }

    useFocusEffect(() => {
        BackHandler.addEventListener("hardwareBackPress", handleBackPress)
        return () => BackHandler.removeEventListener("hardwareBackPress", handleBackPress)
    })
}