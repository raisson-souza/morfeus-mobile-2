import { Alert, StyleSheet } from "react-native"
import { DateFormatter } from "@/utils/DateFormatter"
import { FileSystemContextProvider } from "@/contexts/FileSystemContext"
import { Screen } from "@/components/base/Screen"
import { StyleContextProvider } from "@/contexts/StyleContext"
import { useEffect, useState } from "react"
import { useRouter } from "expo-router"
import * as Sharing from 'expo-sharing'
import Box from "@/components/base/Box"
import ConfirmActionButton from "@/components/screens/general/ConfirmActionButton"
import CustomButton from "@/components/customs/CustomButton"
import CustomText from "@/components/customs/CustomText"
import HELPERS from "@/data/helpers"
import Info from "@/components/base/Info"
import Loading from "@/components/base/Loading"
import ModalBox from "@/components/base/ModalBox"
import MonthParser from "@/utils/MonthParser"
import MonthYearExtractor from "@/components/customs/MonthYearExtractor"
import UserService from "@/services/api/UserService"

export const EXPORT_USER_DATA_FILE_NAME = "exportacao_de_dados_usuario_morfeus.json"

export default function UserDataExportScreen() {
    const router = useRouter()
    const { systemStyle } = StyleContextProvider()
    const { getFile, createFile, deleteFile } = FileSystemContextProvider()
    const [ loading, setLoading ] = useState<boolean>(true)
    const [ exporting, setExporting ] = useState<boolean>(false)
    const [ exportFileUri, setExportFileUri ] = useState<string | null>(null)
    const [ openDataExportModal, setOpenDataExportModal ] = useState<boolean>(false)

    const dateNow = new Date()
    const [ openStartDate, setOpenStartDate ] = useState<boolean>(false)
    const [ startDate, setStartDate ] = useState<Date>(dateNow)
    const [ openEndDate, setOpenEndDate ] = useState<boolean>(false)
    const [ endDate, setEndDate ] = useState<Date>(dateNow)
    const [ exportDataBtnActive, SetExportDataBtnActive ] = useState<boolean>(false)

    const fetchExportFile = async () => {
        const exportFile = await getFile(EXPORT_USER_DATA_FILE_NAME)
        if (exportFile.exists) setExportFileUri(exportFile.uri)
    }

    useEffect(() => {
        fetchExportFile().finally(() => setLoading(false))
    }, [])

    const exportUserData = async () => {
        setOpenDataExportModal(false)
        setExporting(true)
        await UserService.ExportUserData({
            startDate: DateFormatter.forBackend.date(startDate.getTime()),
            endDate: DateFormatter.forBackend.date(endDate.getTime()),
        })
            .then(async (response) => {
                if (response.Success) {
                    await createFile(EXPORT_USER_DATA_FILE_NAME, JSON.stringify(response.Data))
                    await fetchExportFile()
                    return
                }

                Alert.alert("Erro na Exportação", response.ErrorMessage)
            })
            .finally(() => setExporting(false))
    }

    const shareExportFile = () => {
        if (exportFileUri) {
            Sharing.shareAsync(exportFileUri, { dialogTitle:"Exportação de Dados do Morfeus" })
        }
    }

    const deleteExportFile = async () => {
        await deleteFile(EXPORT_USER_DATA_FILE_NAME)
        setExportFileUri(null)
    }

    const info = (isOpposite: boolean = false) => <Info
        modalTitle={ HELPERS.exportData.modalTitle }
        modalDescription={ HELPERS.exportData.modalDescription }
        infoDescription={ HELPERS.exportData.infoDescription }
        overrideInfoColor={ isOpposite ? systemStyle.oppositeTextColor : undefined }
    />

    return <Screen flex>
        <Box.Column style={ styles.container }>
            {
                loading || exporting
                    ? <Loading
                        text={
                            exporting
                                ? "Realizando exportação de dados, isso pode levar alguns instantes..."
                                : "Buscando exportação anterior..."
                        }
                        onlyLoading={ false }
                    />
                    : <>
                        { info() }
                        {
                            exportFileUri
                                ? <>
                                    <CustomButton
                                        title="Baixar Exportação"
                                        onPress={ () => shareExportFile() }
                                        important
                                    />
                                    <ConfirmActionButton
                                        btnTitle="Excluir Exportação"
                                        description="Os dados exportados armazenados em seu dispositivo serão eliminados, você ainda pode baixá-los ou realizar uma nova exportação que irá sobrescrevê-los, tem certeza que deseja excluí-los?"
                                        onConfirm={ async () => deleteExportFile() }
                                        closeOnConfirm={ false }
                                        btnColor={{ text: "red", border: "red" }}
                                    />
                                </>
                                : <CustomText weight="thin">Nenhum arquivo de exportação encontrado.</CustomText>
                        }
                        <ConfirmActionButton
                            btnTitle="Exportar Dados"
                            description={
                                exportFileUri
                                    ? "Ao realizar uma nova exportação de dados, a exportação antiga será sobrescrita, por favor, faça o download dela antes de prosseguir!"
                                    : "A seguir você configurará a exportação de seus dados, realize essa ação apenas quando necessário!"
                            }
                            onConfirm={ () => setOpenDataExportModal(true) }
                            closeOnConfirm={ false }
                        />
                        <CustomButton
                            title="Voltar"
                            onPress={ () => router.back() }
                        />
                    </>
            }
        </Box.Column>
        <MonthYearExtractor
            open={ openStartDate }
            setOpen={ setOpenStartDate }
            onChange={ (date) => {
                if (!exportDataBtnActive) SetExportDataBtnActive(true)
                setStartDate(date)
            }}
            defaultMonth={ startDate.getMonth() + 1 }
            defaultYear={ startDate.getFullYear() }
            maxYear={ dateNow.getFullYear() }
        />
        <MonthYearExtractor
            open={ openEndDate }
            setOpen={ setOpenEndDate }
            onChange={ (date) => {
                if (!exportDataBtnActive) SetExportDataBtnActive(true)
                setEndDate(date)
            }}
            defaultMonth={ endDate.getMonth() + 1 }
            defaultYear={ endDate.getFullYear() }
            maxYear={ dateNow.getFullYear() }
        />
        <ModalBox
            visible={ openDataExportModal }
            setVisible={ setOpenDataExportModal }
            title="Configuração de Exportação de Dados"
            description={
                <Box.Column style={ styles.dataExportModal }>
                    { info(true) }
                    <Box.Column style={ styles.dataExportModalGroup }>
                        <CustomText isOpposite>
                            Determine o mês INICIAL para a exportação de dados
                        </CustomText>
                        <CustomButton
                            title={ `${ MonthParser(startDate.getMonth() + 1) } - ${ startDate.getFullYear() } ` }
                            onPress={ () => setOpenStartDate(true) }
                            btnTextColor={ systemStyle.oppositeTextColor }
                        />
                    </Box.Column>
                    <Box.Column style={ styles.dataExportModalGroup }>
                        <CustomText isOpposite>
                            Determine o mês FINAL para a exportação de dados
                        </CustomText>
                        <CustomButton
                            title={ `${ MonthParser(endDate.getMonth() + 1) } - ${ endDate.getFullYear() } ` }
                            onPress={ () => setOpenEndDate(true) }
                            btnTextColor={ systemStyle.oppositeTextColor }
                        />
                    </Box.Column>
                    <Box.Column style={ styles.exportDataBtn }>
                        <CustomButton
                            title="Exportar Dados"
                            onPress={ async () => await exportUserData() }
                            active={ exportDataBtnActive }
                            btnTextColor={ exportDataBtnActive ? "orange" : systemStyle.inactiveTextColor }
                            btnColor={ exportDataBtnActive ? "orange" : systemStyle.inactiveTextColor }
                        />
                        <CustomButton
                            title="Fechar"
                            onPress={ () => setOpenDataExportModal(false) }
                            btnTextColor={ systemStyle.oppositeTextColor }
                        />
                    </Box.Column>
                </Box.Column>
            }
        />
    </Screen>
}

const styles = StyleSheet.create({
    container: {
        width: "90%",
        gap: 10,
    },
    dataExportModal: {
        gap: 10,
    },
    dataExportModalGroup: {
        gap: 5,
    },
    exportDataBtn: {
        marginTop: 20,
        gap: 5,
    },
})