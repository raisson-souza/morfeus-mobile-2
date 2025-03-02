import { Alert, StyleSheet } from "react-native"
import { Screen } from "@/components/base/Screen"
import { useRouter } from "expo-router"
import { useState } from "react"
import * as FileSystem from 'expo-file-system'
import Box from "@/components/base/Box"
import ConfirmActionButton from "@/components/screens/general/ConfirmActionButton"
import CustomButton from "@/components/customs/CustomButton"
import FileSelector from "@/components/screens/general/FileSelector"
import HELPERS from "@/data/helpers"
import Info from "@/components/base/Info"
import Loading from "@/components/base/Loading"
import UserService from "@/services/api/UserService"

export type ImportFileType = {
    name: string
    uri: string
}

export default function UserDataImportSameOriginScreen() {
    const router = useRouter()
    const [ loading, setLoading ] = useState<boolean>(false)
    const [ file, setFile ] = useState<ImportFileType | null>(null)

    const importData = async () => {
        setLoading(true)
        try {
            if (!file) {
                Alert.alert("Arquivo de Importação não Encontrado", "Por favor, informe um arquivo para realizar a importação.")
                return
            }
            const fileContent = await FileSystem.readAsStringAsync(file.uri, { encoding: FileSystem.EncodingType.UTF8 })
            await UserService.ImportUserData({
                isSameOriginImport: true,
                dreamsPath: null,
                fileContent: fileContent,
                sendEmailOnFinish: true,
            })
                .then(response => {
                    if (response.Success) {
                        Alert.alert("Sucesso", response.Data)
                        setFile(null)
                        router.navigate("/(tabs)/home")
                        return
                    }
                    Alert.alert("Falha na Importação", response.ErrorMessage)
                })
        }
        catch { }
        finally {
            setLoading(false)
        }
    }

    return <Screen flex>
        <Box.Column style={ styles.container }>
            {
                loading
                    ? <Loading text="Realizando Importação..." onlyLoading={ false } />
                    : <>
                        <Info
                            infoDescription={ HELPERS.importDataSameOrigin.infoDescription }
                            modalTitle={ HELPERS.importDataSameOrigin.modalTitle }
                            modalDescription={ HELPERS.importDataSameOrigin.modalDescription }
                        />
                        <FileSelector
                            fileType="application/json"
                            onChange={ (e) => setFile(e) }
                        />
                        {
                            file
                                ? <ConfirmActionButton
                                    btnTitle="Realizar Importação"
                                    description="A importação levará alguns minutos para ser completada, você receberá um email com o resultado e possíveis problemas ocorridos durante a importação, verifique o email cadastrado, continuar?"
                                    onConfirm={ async () => await importData() }
                                    btnWidth="80%"
                                />
                                : <></>
                        }
                        <CustomButton
                            title={ "Voltar" }
                            onPress={ () => router.back() }
                            btnWidth="80%"
                        />
                    </>
            }
        </Box.Column>
    </Screen>
}

const styles = StyleSheet.create({
    container: {
        gap: 10,
        alignItems: 'center',
        width: "100%",
    },
})