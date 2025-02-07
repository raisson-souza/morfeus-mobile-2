import { Screen } from "@/components/base/Screen"
import { useRouter } from "expo-router"
import DefaultHomeScreen from "@/components/screens/general/DefaultHomeScreen"

export default function DreamsIndexScreen() {
    const router = useRouter()

    return (
        <Screen>
            <DefaultHomeScreen
                imagePathByRequire={ require("../../../assets/images/dreams_background.jpg") }
                btns={[
                    {
                        title: "Listagem de Sonhos",
                        action: () => router.navigate("/(tabs)/(dreams)/dreamsList"),
                    },
                    {
                        title: "Criar Sonho",
                        action: () => router.navigate("/(tabs)/(dreams)/createDream"),
                    },
                ]}
            />
        </Screen>
    )
}