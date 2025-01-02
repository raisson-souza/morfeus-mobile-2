import { CustomImage } from "@/components/customs/CustomImage"
import { Screen } from "@/components/base/Screen"
import { StyleSheet } from "react-native"
import { useRouter } from "expo-router"
import Box from "@/components/base/Box"
import CustomButton from "@/components/customs/CustomButton"

export default function SleepsIndexScreen() {
    const router = useRouter()

    return (
        <Screen>
            <Box.Column style={ styles.container }>
                <CustomImage.Local
                    filePathByRequire={ require("../../../assets/images/sleeps_background.jpg") }
                    style={ styles.image }
                />
                <Box.Column style={ styles.btns }>
                    <CustomButton
                        title="Listagem de Ciclos de Sono"
                        onPress={ () => router.navigate("/(tabs)/(sleeps)/sleepsList") }
                    />
                    <CustomButton
                        title="Criar Ciclo de Sono"
                        onPress={ () => router.navigate("/(tabs)/(sleeps)/createSleep") }
                    />
                </Box.Column>
            </Box.Column>
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
        gap: 15,
    },
})