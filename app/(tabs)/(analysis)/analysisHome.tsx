import { CustomImage } from "@/components/customs/CustomImage"
import { Screen } from "@/components/base/Screen"
import { StyleSheet } from "react-native"
import { SyncContextProvider } from "@/contexts/SyncContext"
import { useRouter, useNavigation } from "expo-router"
import Box from "@/components/base/Box"
import CustomButton from "@/components/customs/CustomButton"
import HELPERS from "@/data/helpers"
import Info from "@/components/base/Info"
import React, { useEffect, useState } from "react"
import TextBold from "@/components/base/TextBold"

export default function AnalysisIndexScreen() {
    const router = useRouter()
    const navigation = useNavigation()
    const { checkIsConnected } = SyncContextProvider()
    const [ isConnected, setIsConnected ] = useState<boolean>(checkIsConnected())
    
    useEffect(() => {
        return navigation.addListener("focus", () => {
            setIsConnected(checkIsConnected())
        })
    }, [])

    return (
        <Screen>
            <Box.Center style={ styles.container }>
                <CustomImage.Local
                    filePathByRequire={ require("../../../assets/images/analysis_background.jpg") }
                    style={ styles.image }
                />
                {
                    isConnected
                        ?
                            <Box.Column style={ styles.btns }>
                                <Info
                                    infoDescription={ HELPERS.analysis.infoDescription }
                                    modalTitle={ HELPERS.analysis.modalTitle }
                                    modalDescription={ HELPERS.analysis.modalDescription }
                                    type="question"
                                />
                                <CustomButton
                                    title="Análises de Sonhos"
                                    onPress={ () => router.navigate("/(tabs)/(analysis)/listDreamsAnalysis")}
                                />
                                <CustomButton
                                    title="Análises de Ciclo de Sono"
                                    onPress={ () => router.navigate("/(tabs)/(analysis)/listSleepsAnalysis")}
                                />
                            </Box.Column>
                        : <TextBold style={ styles.offlineText }>As funcionalidades de análise não estão disponíveis offline, conecte-se a internet!</TextBold>
                }
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
        height: 150,
        borderRadius: 10,
    },
    btns: {
        gap: 10,
    },
    offlineText: {
        textAlign: "center",
    }
})