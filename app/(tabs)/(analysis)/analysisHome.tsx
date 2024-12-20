import { CustomImage } from "@/components/customs/CustomImage"
import { Screen } from "@/components/base/Screen"
import { StyleSheet } from "react-native"
import { SyncContextProvider } from "@/contexts/SyncContext"
import { useRouter } from "expo-router"
import Auth from "@/components/auth/Auth"
import Box from "@/components/base/Box"
import CustomButton from "@/components/customs/CustomButton"
import React from "react"

export default function AnalysisIndexScreen() {
    const router = useRouter()
    const { checkIsConnected } = SyncContextProvider()

    return (
        <Auth>
            <Screen>
                <Box.Center style={ styles.container }>
                    <CustomImage.Local
                        filePathByRequire={ require("../../../assets/images/analysis_background.jpg") }
                        style={ styles.image }
                    />
                    {
                        checkIsConnected()
                            ?
                                <Box.Column style={ styles.btns }>
                                    <CustomButton
                                        title="Análises de Sonhos"
                                        onPress={ () => router.navigate("/(tabs)/(analysis)/listDreamsAnalysis")}
                                    />
                                    <CustomButton
                                        title="Análises de Ciclo de Sono"
                                        onPress={ () => router.navigate("/(tabs)/(analysis)/listSleepsAnalysis")}
                                    />
                                </Box.Column>
                            : <></>
                    }
                </Box.Center>
            </Screen>
        </Auth>
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
        height: 150,
        borderRadius: 10,
    },
    btns: {
        gap: 10,
    },
})