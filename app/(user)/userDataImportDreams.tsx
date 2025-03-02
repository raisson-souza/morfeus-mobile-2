import { Alert, StyleSheet } from "react-native"
import { ImportFileType } from "./userDataImportSameOrigin"
import { Screen } from "@/components/base/Screen"
import { useRouter } from "expo-router"
import { useState } from "react"
import * as FileSystem from 'expo-file-system'
import Box from "@/components/base/Box"
import ConfirmActionButton from "@/components/screens/general/ConfirmActionButton"
import CustomButton from "@/components/customs/CustomButton"
import CustomInput from "@/components/customs/CustomInput"
import CustomText from "@/components/customs/CustomText"
import FileSelector from "@/components/screens/general/FileSelector"
import HELPERS from "@/data/helpers"
import Info from "@/components/base/Info"
import Loading from "@/components/base/Loading"
import UserService from "@/services/api/UserService"

export default function UserDataImportDreamsScreen() {
    const router = useRouter()
    const [ loading, setLoading ] = useState<boolean>(false)
    const [ file, setFile ] = useState<ImportFileType | null>(null)
    const [ dreamsPath, setDreamsPath ] = useState<string[]>([])
    const [ newDreamPath, setNewDreamPath ] = useState<string | null>(null)

    const importData = async () => {
        setLoading(true)
        try {
            if (!file) {
                Alert.alert("Arquivo de Importação não Encontrado", "Por favor, informe um arquivo para realizar a importação.")
                return
            }

            if (dreamsPath.length === 0) {
                Alert.alert("Caminho para a Chave dos Sonhos", "Por favor, informe o caminho para a chave dos sonhos de seu arquivo de importação.")
                return
            }

            const fileContent = await FileSystem.readAsStringAsync(file.uri, { encoding: FileSystem.EncodingType.UTF8 })
            const formattedDreamsPath = dreamsPath.join("/")

            await UserService.ImportUserData({
                isSameOriginImport: false,
                dreamsPath: formattedDreamsPath,
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

    const addDreamPath = () => {
        if (newDreamPath) {
            if (newDreamPath.trim() != "") {
                setDreamsPath([ ...dreamsPath, newDreamPath?.replaceAll("/", "")])
                setNewDreamPath(null)
            }
        }
    }

    const removeDreamPath = (dreamPathId: number) => {
        const newDreamsPath = [ ...dreamsPath ]
        newDreamsPath.splice(dreamPathId, 1)
        setDreamsPath(newDreamsPath)
    }

    return <Screen flex>
        <Box.Column style={ styles.container }>
            {
                loading
                    ? <Loading text="Realizando Importação..." onlyLoading={ false } />
                    : <>
                        <Info { ...HELPERS.importDataExternal } />
                        <FileSelector
                            fileType="application/json"
                            onChange={ (e) => setFile(e) }
                        />
                        <Info { ...HELPERS.importDataExternalDreamsPath } />
                        <Box.Row style={ styles.dreamsPathContainer }>
                            <>
                                <CustomText weight="bold">{ dreamsPath.length > 0 ? `{` : "{ }" }</CustomText>
                                {
                                    dreamsPath.map((dreamPath, i) =>
                                        <Box.Center
                                            key={ i }
                                            onPress={ () => removeDreamPath(i) }
                                        >
                                            <CustomText weight="bold">{ `"${ dreamPath }" :${ i < dreamsPath.length - 1 ? " {" : " [ ]" }` }</CustomText>
                                        </Box.Center>
                                    )
                                }
                                <CustomText weight="bold">{ String(" }").repeat(dreamsPath.length) }</CustomText>
                            </>
                        </Box.Row>
                        <Box.Column style={ styles.dreamsPathDefinerContainer }>
                            {
                                dreamsPath.length > 0
                                    ? <CustomText weight="thin" size="s">Pressione uma chave para excluí-la</CustomText>
                                    : <></>
                            }
                            <CustomInput
                                label="Chave"
                                placeHolder="dreams"
                                defaultValue={ newDreamPath ?? "" }
                                onChange={ (e) => setNewDreamPath(e) }
                            />
                            <CustomButton
                                title="Adicionar Chave"
                                onPress={ () => addDreamPath() }
                                active={ newDreamPath != null && newDreamPath.trim() != "" }
                                btnWidth="100%"
                            />
                        </Box.Column>
                        <ConfirmActionButton
                            btnTitle="Realizar Importação"
                            description="A importação levará alguns minutos para ser completada, você receberá um email com o resultado e possíveis problemas ocorridos durante a importação, verifique o email cadastrado, continuar?"
                            onConfirm={ async () => await importData() }
                            isActive={ file != null && dreamsPath.length > 0 }
                            btnWidth="90%"
                        />
                        <CustomButton
                            title={ "Voltar" }
                            onPress={ () => router.back() }
                            btnWidth="90%"
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
        width: "80%",
    },
    dreamsPathContainer: {
        gap: 5,
        width: "100%",
        justifyContent: "center",
        flexWrap: "wrap",
    },
    dreamsPathDefinerContainer: {
        width: "100%",
        alignItems: "center",
        gap: 10,
    },
})