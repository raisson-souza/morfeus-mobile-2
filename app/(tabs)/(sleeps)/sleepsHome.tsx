import { Screen } from "@/components/base/Screen"
import { useRouter } from "expo-router"
import DefaultHomeScreen from "@/components/screens/general/DefaultHomeScreen"

export default function SleepsIndexScreen() {
    const router = useRouter()

    return (
        <Screen>
            <DefaultHomeScreen
                imagePathByRequire={ require("../../../assets/images/sleeps_background.jpg") }
                btns={[
                    {
                        title: "Listagem de Ciclos de Sono",
                        action: () => router.navigate("/(tabs)/(sleeps)/sleepsList"),
                    },
                    {
                        title: "Criar Ciclo de Sono",
                        action: () => router.navigate("/(tabs)/(sleeps)/createSleep"),
                    },
                ]}
            />
        </Screen>
    )
}