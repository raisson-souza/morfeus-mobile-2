import { AuthContextProvider } from "@/contexts/AuthContext"
import { CustomImage } from "@/components/customs/CustomImage"
import { Screen } from "@/components/base/Screen"
import { StyleSheet } from "react-native"
import { useRouter } from "expo-router"
import Box from "@/components/base/Box"
import CustomButton from "@/components/customs/CustomButton"
import CustomText from "@/components/customs/CustomText"
import React, { useState } from "react"
import TutorialEnclosure from "@/components/screens/enclosures/TutorialEnclosure"
import TutorialModal from "@/components/screens/general/TutorialModal"
import { useSQLiteContext } from "expo-sqlite" // TESTE

export default function InfoScreen() {
    const db = useSQLiteContext()
    const router = useRouter()
    const { isLogged } = AuthContextProvider()
    const [ tutorialModalOpen, setTutorialModalOpen ] = useState<boolean>(false)
    const btnWidth = 150

    return (
        <TutorialEnclosure openTutorialAction={ () => setTutorialModalOpen(true) }>
            <Screen flex>
                {/* // TESTE */}
                <CustomButton btnWidth={ btnWidth } title="dreams" onPress={ async () => { await db.execAsync("DROM TABLE dreams") } } important />
                <CustomButton btnWidth={ btnWidth } title="dream TRUNC" onPress={ async () => { await db.execAsync("DELETE FROM dreams") } } important />
                <CustomButton btnWidth={ btnWidth } title="sleeps" onPress={ async () => { await db.execAsync("DROM TABLE sleeps") } } important />
                <CustomButton btnWidth={ btnWidth } title="sleeps TRUNC" onPress={ async () => { await db.execAsync("DELETE FROM sleeps") } } important />
                {/* // TESTE */}
                <TutorialModal
                    open={ tutorialModalOpen }
                    setOpen={ setTutorialModalOpen }
                    dbRecord
                />
                <Box.Center style={ styles.container }>
                    <CustomImage.Local
                        filePathByRequire={ require("../assets/images/morfeus_logo.png") }
                    />
                    <CustomText
                        weight="thin"
                        style={ styles.description }
                    >Uma aplicação que realiza o controle do ciclo do sono e gerenciamento de sonhos.</CustomText>
                    <Box.Column style={ styles.btns }>
                        {
                            isLogged
                                ? <CustomButton btnWidth={ btnWidth } title="Entrar" onPress={ () => router.navigate("/home") } important />
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
    btns: {
        gap: 10,
    },
})