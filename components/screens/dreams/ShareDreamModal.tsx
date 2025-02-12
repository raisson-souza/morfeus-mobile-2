import { Picker } from "@react-native-picker/picker"
import { StyleContextProvider } from "@/contexts/StyleContext"
import { StyleSheet } from "react-native"
import { useState } from "react"
import Box from "@/components/base/Box"
import CustomButton from "@/components/customs/CustomButton"
import CustomSwitch from "@/components/customs/CustomSwitch"
import CustomText from "@/components/customs/CustomText"
import ModalBox from "@/components/base/ModalBox"
import ShareDream, { ShareDreamDreamInfoType, ShareDreamSleepCycleInfoType } from "@/utils/ShareDream"

type ShareDreamModalProps = {
    open: boolean
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
    dreamInfo: {
        title?: string
        description: string
        characteristics?: { title: string; description: string }[]
    }
    tags?: string[]
    personalAnalysis?: string
    sleepId?: number
}

export default function ShareDreamModal ({
    open,
    setOpen,
    dreamInfo,
    tags,
    personalAnalysis,
    sleepId,
}: ShareDreamModalProps) {
    const { systemStyle } = StyleContextProvider()
    const [ dreamInfoType, setDreamInfoType ] = useState<ShareDreamDreamInfoType>("complete")
    const [ sleepCycleInfoType, setSleepCycleInfoType ] = useState<ShareDreamSleepCycleInfoType>("date")
    const [ showTags, setShowTags ] = useState<boolean>(false)
    const [ showPersonalAnalysis, setShowPersonalAnalysis ] = useState<boolean>(false)

    return <ModalBox
        visible={ open }
        setVisible={ setOpen }
        title="Compartilhar Sonho"
        description={
            <Box.Column style={ styles.container }>
                <CustomText isOpposite weight="bold">Selecione as informações do sonho na qual deseja compartilhar.</CustomText>
                <Box.Column>
                    <CustomText isOpposite>Informações sobre o sonho.</CustomText>
                    <Picker
                        selectedValue={ dreamInfoType }
                        onValueChange={ (e) => setDreamInfoType(e) }
                        style={{
                            ...styles.picker,
                            color: systemStyle.oppositeTextColor,
                        }}
                    >
                        <Picker.Item label="Sonho Completo" value="complete" />
                        <Picker.Item label="Título e Descrição" value="titleAndDescription" />
                        <Picker.Item label="Descrição" value="description" />
                    </Picker>
                </Box.Column>
                <Box.Column>
                    <CustomText isOpposite>Informações sobre o ciclo de sono referente.</CustomText>
                    <Picker
                        selectedValue={ sleepCycleInfoType }
                        onValueChange={ (e) => setSleepCycleInfoType(e) }
                        style={{
                            ...styles.picker,
                            color: systemStyle.oppositeTextColor,
                        }}
                    >
                        <Picker.Item label="Sono Completo" value="complete" />
                        <Picker.Item label="Data" value="date" />
                        <Picker.Item label="Nenhuma Informação" value="nothing" />
                    </Picker>
                </Box.Column>
                <CustomSwitch
                    label="Compartilhar tags?"
                    value={ showTags }
                    onChange={ (e) => setShowTags(e) }
                    labelStyle={{ color: systemStyle.oppositeTextColor }}
                />
                <CustomSwitch
                    label="Compartilhar análise pessoal?"
                    value={ showPersonalAnalysis }
                    onChange={ (e) => setShowPersonalAnalysis(e) }
                    labelStyle={{ color: systemStyle.oppositeTextColor }}
                />
                <CustomButton
                    title="Compartilhar"
                    btnColor={ systemStyle.oppositeTextColor }
                    btnTextColor={ systemStyle.oppositeTextColor }
                    onPress={ async () => await ShareDream({
                        dreamInfoType: dreamInfoType,
                        dreamInfo: dreamInfo,
                        personalAnalysis: showPersonalAnalysis ? personalAnalysis : undefined,
                        tags: showTags ? tags : undefined,
                        sleepCycleInfoType: sleepCycleInfoType,
                        sleepId: sleepId,
                    })}
                />
                <CustomButton
                    title="Cancelar"
                    btnColor="red"
                    btnTextColor="red"
                    onPress={ () => setOpen(false) }
                />
            </Box.Column>
        }
    />
}

const styles = StyleSheet.create({
    container: {
        gap: 10,
    },
    picker: {
        width: "100%",
    },
})