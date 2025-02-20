import { Alert, StyleSheet } from "react-native"
import { Screen } from "@/components/base/Screen"
import { useRouter } from "expo-router"
import { useState } from "react"
import * as DocumentPicker from 'expo-document-picker'
import Box from "@/components/base/Box"
import ConfirmActionButton from "@/components/screens/general/ConfirmActionButton"
import CustomButton from "@/components/customs/CustomButton"
import CustomText from "@/components/customs/CustomText"
import HELPERS from "@/data/helpers"
import Info from "@/components/base/Info"
import Loading from "@/components/base/Loading"
import UserService from "@/services/api/UserService"

export default function UserDataImportSameOriginScreen() {
    const router = useRouter()
    const [ loading, setLoading ] = useState<boolean>(false)
    const [ selectedFile, setSelectedFile ] = useState<DocumentPicker.DocumentPickerAsset | null>(null)

    const importData = async () => {
        if (!selectedFile) {
            Alert.alert("Arquivo de Importação não Encontrado", "Por favor, informe um arquivo para realizar a importação.")
            return
        }

        setLoading(true)
        await UserService.ImportUserData({
            isSameOriginImport: true,
            dreamsPath: null,
            file: {
                name: selectedFile.name,
                type: selectedFile.mimeType ?? "",
                uri: selectedFile.uri,
            }
        })
            .then(response => {
                if (response.Success) {
                    Alert.alert("Sucesso", response.Data)
                    return
                }

                Alert.alert("Falha na Importação", response.ErrorMessage)
            })
            .finally(() => setLoading(false))
    }

    const pickFile = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: 'application/json',
                multiple: false,
            })

            if (result.canceled) return

            setSelectedFile(result.assets[0])
        } catch (error) {
            console.error(error)
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
                        <CustomText
                            style={ styles.fileText }
                            weight="thin"
                        >
                            {
                                selectedFile
                                    ? `Arquivo selecionado: ${ selectedFile.name }`
                                    : "Nenhum Arquivo Selecionado"
                            }
                        </CustomText>
                        {
                            selectedFile
                                ? <ConfirmActionButton
                                    btnTitle="Realizar Importação"
                                    description="A importação levará alguns minutos para ser completada, você receberá um email com o resultado e possíveis problemas ocorridos durante a importação, verifique o email cadastrado, continuar?"
                                    onConfirm={ async () => await importData() }
                                    btnWidth="90%"
                                />
                                : <></>
                        }
                        <CustomButton
                            title={ selectedFile ? "Trocar Arquivo" : "Selecionar Arquivo" }
                            onPress={ () => pickFile() }
                            important
                            btnWidth="80%"
                        />
                        <CustomButton
                            title={ "Remover Arquivo" }
                            onPress={ () => setSelectedFile(null) }
                            active={ selectedFile != null }
                            btnColor="red"
                            btnTextColor="red"
                            btnWidth="80%"
                        />
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
    fileText: {
        marginVertical: 10,
    },
})