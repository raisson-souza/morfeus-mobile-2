import { StyleSheet, Text } from "react-native"
import Box from "@/components/base/Box"
import Carousel from "@/components/base/Carousel"
import IconFontAwesome from "react-native-vector-icons/FontAwesome"
import IconFontAwesome5 from "react-native-vector-icons/FontAwesome5"
import IconFontAwesome6 from "react-native-vector-icons/FontAwesome6"
import IconFontisto from "react-native-vector-icons/Fontisto"
import IconIonicons from "react-native-vector-icons/Ionicons"
import IconMaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"
import IconMaterialIcons from "react-native-vector-icons/MaterialIcons"
import React, { useId } from "react"
import TextBold from "@/components/base/TextBold"

type BiologicalOccurencesInfoModalProps = {
    visible: boolean
    setVisible: React.Dispatch<React.SetStateAction<boolean>>
}

export default function BiologicalOccurencesInfoModal({
    visible,
    setVisible,
}: BiologicalOccurencesInfoModalProps) {
    const biologicalOccurenceInfoIconWrapper = (icon: JSX.Element, title: string, description: string) => {
        return (
            <Box.Row
                style={ styles.iconWrapper }
                key={ useId() }
            >
                { icon }
                <TextBold style={ styles.iconWrapperText }>{ `${ title }:` }</TextBold>
                <Text style={ styles.iconWrapperText }>{ description }</Text>
            </Box.Row>
        )
    }

    const biologicalOccurencesInfo = [
        biologicalOccurenceInfoIconWrapper(
            <IconFontAwesome5 name="hand-holding-water" color="white" />,
            "Sudorese",
            biologicalOccurencesDescriptions.sudorese
        ),
        biologicalOccurenceInfoIconWrapper(
            <IconFontAwesome5 name="teeth" color="white" />,
            "Bruxismo",
            biologicalOccurencesDescriptions.bruxismo
        ),
        biologicalOccurenceInfoIconWrapper(
            <IconFontAwesome5 name="lungs" color="white" />,
            "Apnéia do Sono",
            biologicalOccurencesDescriptions.apneiaDoSono
        ),
        biologicalOccurenceInfoIconWrapper(
            <IconFontisto name="open-mouth" color="white" />,
            "Ronco",
            biologicalOccurencesDescriptions.ronco
        ),
        biologicalOccurenceInfoIconWrapper(
            <IconIonicons name="body" color="white" />,
            "Movimento Periódico dos Membros",
            biologicalOccurencesDescriptions.movimentosPeriodicosDosMembros
        ),
        biologicalOccurenceInfoIconWrapper(
            <IconIonicons name="alarm" color="white" />,
            "Despertares Parciais",
            biologicalOccurencesDescriptions.despertaresParciais
        ),
        biologicalOccurenceInfoIconWrapper(
            <IconMaterialCommunityIcons name="water-alert" color="white" />,
            "Refluxo Gastroesofágico",
            biologicalOccurencesDescriptions.refluxoGastroesofagico
        ),
        biologicalOccurenceInfoIconWrapper(
            <IconFontAwesome6 name="glass-water" color="white" />,
            "Sialorréia",
            biologicalOccurencesDescriptions.sialorreia
        ),
        biologicalOccurenceInfoIconWrapper(
            <IconFontAwesome name="heartbeat" color="white" />,
            "Arritmias",
            biologicalOccurencesDescriptions.arritmias
        ),
        biologicalOccurenceInfoIconWrapper(
            <IconMaterialIcons name="sports-gymnastics" color="white" />,
            "Mioclonia",
            biologicalOccurencesDescriptions.mioclonia
        ),
        biologicalOccurenceInfoIconWrapper(
            <IconFontisto name="confused" color="white" />,
            "Parassonia",
            biologicalOccurencesDescriptions.parassonia
        ),
        biologicalOccurenceInfoIconWrapper(
            <IconFontisto name="blood-drop" color="white" />,
            "Epistaxe",
            biologicalOccurencesDescriptions.epistaxe
        ),
        biologicalOccurenceInfoIconWrapper(
            <IconMaterialCommunityIcons name="toilet" color="white" />,
            "Micção Involuntária",
            biologicalOccurencesDescriptions.miccaoInvoluntaria
        ),
        biologicalOccurenceInfoIconWrapper(
            <IconMaterialCommunityIcons name="toilet" color="white" />,
            "Evacuação Involuntária",
            biologicalOccurencesDescriptions.evacuacaoInvoluntaria
        ),
        biologicalOccurenceInfoIconWrapper(
            <Text style={ styles.iconWrapperText }>+18</Text>,
            "Polução Noturna",
            biologicalOccurencesDescriptions.polucao
        ),
    ]

    return <Carousel
        components={ biologicalOccurencesInfo }
        visible={ visible }
        setVisible={ setVisible }
        limit={ 3 }
    />
}

const styles = StyleSheet.create({
    iconWrapper: {
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 5,
    },
    iconWrapperText: {
        color: 'white',
    },
})

const biologicalOccurencesDescriptions = {
    sudorese: "Produção excessiva de suor, geralmente como resposta ao calor, estresse ou condições médicas.",
    bruxismo: "Ato involuntário de ranger ou apertar os dentes, geralmente durante o sono.",
    apneiaDoSono: "Distúrbio caracterizado por pausas na respiração ou respiração superficial durante o sono.",
    ronco: "Ruído produzido pela vibração das vias aéreas superiores durante a respiração enquanto se dorme.",
    movimentosPeriodicosDosMembros: "Contrações involuntárias repetitivas das pernas ou braços durante o sono.",
    despertaresParciais: "Episódios em que a pessoa fica parcialmente acordada durante o sono, frequentemente sem lembrar-se.",
    refluxoGastroesofagico: "Retorno do conteúdo ácido do estômago para o esôfago, podendo causar azia e desconforto.",
    sialorreia: "Excesso de salivação, comum durante o sono ou em condições neurológicas.",
    arritmias: "Alterações no ritmo cardíaco, podendo ser mais rápido, mais lento ou irregular.",
    mioclonia: "Contrações musculares breves e involuntárias, que podem ocorrer ao adormecer ou durante o sono.",
    parassonia: "Conjunto de comportamentos ou eventos anormais que ocorrem durante o sono, como sonambulismo ou terrores noturnos.",
    epistaxe: "Sangramento nasal, frequentemente causado por traumas ou alterações na mucosa nasal.",
    miccaoInvoluntaria: "Liberação não controlada de urina, comumente conhecida como enurese.",
    evacuacaoInvoluntaria: "Perda do controle sobre os movimentos intestinais, levando à liberação acidental de fezes.",
    polucao: "Ejaculação involuntária que ocorre durante o sono, geralmente associada a sonhos eróticos.",
}