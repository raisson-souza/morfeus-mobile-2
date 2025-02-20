import { Screen } from "@/components/base/Screen"
import { StyleSheet } from "react-native"
import { useRouter } from "expo-router"
import Box from "@/components/base/Box"
import CustomButton from "@/components/customs/CustomButton"
import FutureDevelopmentButton from "@/components/utils/FutureDevelopmentButton"

export default function UserDataScreen() {
    const router = useRouter()

    return <Screen flex>
        <Box.Column style={ styles.container }>
            <CustomButton
                title="Exportar Dados"
                onPress={ () => router.navigate("/(user)/userDataExport") }
            />
            <CustomButton
                title="Importar Dados do Morfeus"
                onPress={ () => router.navigate("/(user)/userDataImportSameOrigin") }
            />
            <FutureDevelopmentButton
                btnTitle="Importar Dados Externos"
            />
            <CustomButton
                title="Voltar"
                onPress={ () => router.back() }
                important
            />
        </Box.Column>
    </Screen>
}

const styles = StyleSheet.create({
    container: {
        width: "90%",
        gap: 10,
    },
})