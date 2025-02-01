import { AuthContextProvider } from "@/contexts/AuthContext"
import { CustomImage } from "@/components/customs/CustomImage"
import { Screen } from "@/components/base/Screen"
import { StyleSheet, Text } from "react-native"
import { useRouter } from "expo-router"
import Box from "@/components/base/Box"
import CustomButton from "@/components/customs/CustomButton"
import React, { useState } from "react"
import TutorialEnclosure from "@/components/screens/enclosures/TutorialEnclosure"
import TutorialModal from "@/components/screens/general/TutorialModal"

export default function InfoScreen() {
    const router = useRouter()
    const { isLogged, logoff } = AuthContextProvider()
    const [ tutorialModalOpen, setTutorialModalOpen ] = useState<boolean>(false)
    const btnWidth = 150

    return (
        <TutorialEnclosure openTutorialAction={ () => setTutorialModalOpen(true) }>
            <Screen flex>
                <TutorialModal
                    open={ tutorialModalOpen }
                    setOpen={ setTutorialModalOpen }
                    dbRecord
                />
                <Box.Center style={ styles.container }>
                    <CustomImage.Local
                        filePathByRequire={ require("../assets/images/morfeus_logo.png") }
                    />
                    <Text style={ styles.description }>Uma aplicação que realiza o controle do ciclo do sono e gerenciamento de sonhos.</Text>
                    <Box.Column style={ styles.btns }>
                        {
                            isLogged
                                ? <>
                                    <CustomButton btnWidth={ btnWidth } title="Entrar" onPress={ () => router.navigate("/home") } important />
                                    <CustomButton btnWidth={ btnWidth } title="Sair" onPress={ async () => await logoff() } />
                                </>
                                : <>
                                    <CustomButton btnWidth={ btnWidth } title="Login" onPress={ () => router.navigate("/login") } important />
                                    <CustomButton btnWidth={ btnWidth } title="Cadastre-se" onPress={ () => router.navigate("/registry") } />
                                </>
                        }
                    </Box.Column>
                </Box.Center>
            </Screen>
        </TutorialEnclosure>
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
    btns: {
        gap: 10,
    },
})