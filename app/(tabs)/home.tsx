import { AuthContextProvider } from "@/contexts/AuthContext"
import { CustomImage } from "@/components/customs/CustomImage"
import { Screen } from "@/components/base/Screen"
import { StyleSheet, Text } from "react-native"
import { useRouter } from "expo-router"
import Box from "@/components/base/Box"
import CustomButton from "@/components/customs/CustomButton"
import FutureDevelopmentButton from "@/components/utils/FutureDevelopmentButton"
import React from "react"
import SimpleSleep from "@/components/screens/home/SimpleSleep"

export default function IndexScreen() {
    const router = useRouter()
    const { userInfo: { current: userInfo } } = AuthContextProvider()

    return (
        <Screen>
            <Box.Center style={ styles.container }>
                <Text style={ styles.welcome }>Bem vindo de volta, { userInfo.name }!</Text>
                <CustomImage.Local
                    filePathByRequire={ require("../../assets/images/home_background.jpg") }
                    style={ styles.image }
                />
                <SimpleSleep />
                <CustomButton
                    title="Criar Sonho"
                    onPress={ () => router.navigate("/createDream") }
                />
                <FutureDevelopmentButton btnTitle="Criar Sonho Rápido"/>
                <CustomButton
                    title="Criar Ciclo de Sono"
                    onPress={ () => router.navigate("/createSleep") }
                />
            </Box.Center>
        </Screen>
    )
}

const styles = StyleSheet.create({
    container: {
        width: "100%",
        gap: 10,
    },
    image: {
        resizeMode: "cover",
        width: "100%",
        height: 200,
        borderRadius: 10,
    },
    welcome: {
        fontSize: 20,
        fontWeight: "bold",
    },
})