import { FileSystemContextProvider } from "@/contexts/FileSystemContext"
import { Screen } from "@/components/base/Screen"
import { StyleContextProvider } from "@/contexts/StyleContext"
import { StyleSheet } from "react-native"
import { useEffect, useState } from "react"
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

export default function UserDataExportScreen() {
    const { systemStyle } = StyleContextProvider()
    const { getFile } = FileSystemContextProvider()
    const [ loading, setLoading ] = useState<boolean>(true)
    const [ exportFileUri, setExportFileUri ] = useState<string | null>(null)
    const [ openDataExportModal, setOpenDataExportModal ] = useState<boolean>(false)

    const dateNow = new Date()
    const [ openStartDate, setOpenStartDate ] = useState<boolean>(false)
    const [ startDate, setStartDate ] = useState<Date>(dateNow)
    const [ openEndDate, setOpenEndDate ] = useState<boolean>(false)
    const [ endDate, setEndDate ] = useState<Date>(dateNow)
    const [ exportDataBtnActive, SetExportDataBtnActive ] = useState<boolean>(false)

    useEffect(() => {
        const fetchExportFile = async () => {
            const exportFile = await getFile("morfeusExport.json")
            if (exportFile.exists) setExportFileUri(exportFile.uri)
            setLoading(false)
        }
        fetchExportFile()
    }, [])

    // useEffect para resetar states

    const shareExportFile = () => {
        if (exportFileUri) {
            Sharing.shareAsync(exportFileUri, { dialogTitle:"Exportação de Dados do Morfeus" })
        }
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
                loading
                    ? <Loading />
                    : <>
                        {
                            exportFileUri
                                ? <CustomButton
                                    title="Acessar Exportação"
                                    onPress={ () => shareExportFile() }
                                />
                                : <CustomText>Nenhum arquivo de exportação encontrado.</CustomText>
                        }
                        { info() }
                        <ConfirmActionButton
                            btnTitle="Exportar Dados"
                            description="A seguir você configurará a exportação de seus dados, realize essa ação apenas quando necessário!"
                            onConfirm={ () => setOpenDataExportModal(true) }
                            closeOnConfirm={ false }
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
            defaultMonth={ startDate.getMonth() }
            defaultYear={ startDate.getFullYear() }
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
                            onPress={ () => {
                                console.log(`startDate ${ startDate } endDate ${ endDate }`)
                            }}
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