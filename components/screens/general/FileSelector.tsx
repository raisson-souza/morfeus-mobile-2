import { DocumentPickerAsset } from "expo-document-picker"
import { StyleSheet } from "react-native"
import { useState } from "react"
import * as DocumentPicker from 'expo-document-picker'
import Box from "@/components/base/Box"
import CustomButton from "@/components/customs/CustomButton"
import CustomText from "@/components/customs/CustomText"

type FileSelectorProps = {
    onChange: (e: DocumentPickerAsset | null) => void
    fileType: string
}

export default function FileSelector({
    onChange,
    fileType,
}: FileSelectorProps) {
    const [ file, setFile ] = useState<DocumentPickerAsset | null>(null)

    const pickFile = async () => {
            try {
                const result = await DocumentPicker.getDocumentAsync({
                    type: fileType,
                    multiple: false,
                })

                if (result.canceled) return

                setFile(result.assets[0])
                onChange(result.assets[0])
            } catch { }
        }

    const removeFile = () => {
        setFile(null)
        onChange(null)
    }

    return <Box.Column style={ styles.container }>
        <CustomText weight="thin">
            {
                file
                    ? `Arquivo selecionado: ${ file.name }`
                    : "Nenhum Arquivo Selecionado"
            }
        </CustomText>
        <CustomButton
            title={ file ? "Alterar Arquivo" : "Selecionar Arquivo" }
            onPress={ () => pickFile() }
            important
            btnWidth="100%"
        />
        <CustomButton
            title={ "Remover Arquivo" }
            onPress={ () => removeFile() }
            active={ file != null }
            btnColor="red"
            btnTextColor="red"
            btnWidth="100%"
        />
    </Box.Column>
}

const styles = StyleSheet.create({
    container: {
        width: "100%",
        alignItems: "center",
        gap: 10,
    },
})