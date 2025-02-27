import { Screen } from "@/components/base/Screen"
import { StyleSheet } from "react-native"
import { SyncContextProvider } from "@/contexts/SyncContext"
import { useRouter, useNavigation } from "expo-router"
import Box from "@/components/base/Box"
import CustomText from "@/components/customs/CustomText"
import DefaultHomeScreen from "@/components/screens/general/DefaultHomeScreen"
import HELPERS from "@/data/helpers"
import Info from "@/components/base/Info"
import React, { useEffect, useState } from "react"

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

    const btns = [
        {
            title: "Análises de Sonhos",
            action: () => router.navigate("/(tabs)/(analysis)/listDreamsAnalysis"),
        },
        {
            title: "Análises de Ciclo de Sono",
            action: () => router.navigate("/(tabs)/(analysis)/listSleepsAnalysis"),
        },
    ]

    return (
        <Screen>
            <DefaultHomeScreen
                imagePathByRequire={ require("../../../assets/images/analysis_background.jpg") }
                btns={ isConnected ? btns : [] }
                overrideChildren={
                    isConnected
                        ? undefined
                        : <CustomText
                            style={ styles.offlineText }
                            size="s"
                            weight="bold"
                        >
                            As funcionalidades de análise não estão disponíveis offline, conecte-se a internet!
                        </CustomText>
                }
            />
            <Box.Center style={ styles.infoContainer }>
                {
                    isConnected
                        ? <Info
                            infoDescription={ HELPERS.analysis.infoDescription }
                            modalTitle={ HELPERS.analysis.modalTitle }
                            modalDescription={ HELPERS.analysis.modalDescription }
                            type="question"
                        />
                        : <></>
                }
            </Box.Center>
        </Screen>
    )
}

const styles = StyleSheet.create({
    offlineText: {
        textAlign: "center",
    },
    infoContainer: {
        paddingTop: 20,
    },
})