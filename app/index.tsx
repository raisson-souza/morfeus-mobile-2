import { AuthContextProvider } from "@/contexts/AuthContext"
import { CustomImage } from "@/components/customs/CustomImage"
import { Screen } from "@/components/base/Screen"
import { StyleSheet, Text } from "react-native"
import { useRouter } from "expo-router"
import Box from "@/components/base/Box"
import CustomButton from "@/components/customs/CustomButton"
import React from "react"

export default function InfoScreen() {
    const router = useRouter()
    const authContext = AuthContextProvider()
    const btnWidth = 150

    return (
        <Screen>
            <Box.Center style={ styles.container }>
                <CustomImage.Local
                    filePathByRequire={ require("../assets/images/morfeus_logo.png") }
                />
                <Text style={ styles.description }>Uma aplicação que realiza o controle do ciclo do sono e gerenciamento de sonhos.</Text>
                {
                    authContext.isLogged
                        ? (
                            <>
                                <CustomButton btnWidth={ btnWidth } title="Entrar" onPress={ () => router.navigate("/home") } />
                            </>
                        )
                        : (
                            <Box.Column style={ styles.notLogged }>
                                <CustomButton btnWidth={ btnWidth } title="Cadastre-se" onPress={ () => router.navigate("/registry") } />
                                <CustomButton btnWidth={ btnWidth } title="Login" onPress={ () => router.navigate("/login") } />
                            </Box.Column>
                        )
                }
            </Box.Center>
        </Screen>
    )
}

const styles = StyleSheet.create({
    container: {
        gap: 10,
    },
    description: {
        textAlign: "center",
    },
    title: {
        fontSize: 25,
        fontWeight: "bold",
    },
    notLogged: {
        gap: 10,
    },
})