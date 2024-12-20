import { CustomImage } from "@/components/customs/CustomImage"
import { Screen } from "@/components/base/Screen"
import { StyleSheet } from "react-native"
import { useRouter } from "expo-router"
import Box from "@/components/base/Box"
import CustomButton from "@/components/customs/CustomButton"
import FutureDevelopmentButton from "@/components/utils/FutureDevelopmentButton"

export default function DreamsIndexScreen() {
    const router = useRouter()

    return (
        <Screen>
            <Box.Center style={ styles.container }>
                <CustomImage.Local
                    filePathByRequire={ require("../../../assets/images/dreams_background.jpg") }
                    style={ styles.image }
                />
                <Box.Column style={ styles.btns }>
                    <CustomButton
                        title="Listagem de Sonhos"
                        onPress={ () => router.navigate("/dreamsList") }
                    />
                    <CustomButton
                        title="Criar Sonho"
                        onPress={ () => router.navigate("/createDream") }
                    />
                    <FutureDevelopmentButton btnTitle="Criar Sonho Rápido"/>
                    {/* <CustomButton
                        title="Criar Sonho Rápido"
                        onPress={ () => router.navigate("/createFastDream") }
                    /> */}
                    <FutureDevelopmentButton btnTitle="Importar Sonhos"/>
                    {/* <CustomButton
                        title="Importar Sonhos"
                        onPress={ () => router.navigate("/importDreams") }
                    /> */}
                    <FutureDevelopmentButton btnTitle="Exportar Sonhos"/>
                    {/* <CustomButton
                        title="Exportar Sonhos"
                        onPress={ () => router.navigate("/exportDreams") }
                    /> */}
                </Box.Column>
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
        gap: 15,
    },
})