import { CreateDreamModel } from "@/types/dream"
import { Picker } from "@react-native-picker/picker"
import { StyleContextProvider } from "@/contexts/StyleContext"
import { StyleSheet } from "react-native"
import { useEffect, useState } from "react"
import { useNavigation } from "expo-router"
import Box from "@/components/base/Box"
import CustomButton from "@/components/customs/CustomButton"
import CustomInput from "@/components/customs/CustomInput"
import CustomSwitch from "@/components/customs/CustomSwitch"
import CustomText from "@/components/customs/CustomText"
import Info from "@/components/base/Info"

type CreateCompleteDream = {
    dream: CreateDreamModel
    onChange: (e: CreateDreamModel) => void
    isLocked: boolean
}

export default function CreateCompleteDream({
    dream,
    onChange,
    isLocked,
}: CreateCompleteDream) {
    const { systemStyle } = StyleContextProvider()
    const navigation = useNavigation()
    const [ tag, setTag ] = useState<string>("")

    useEffect(() => {
        return navigation.addListener("blur", () => {
            setTag("")
        })
    }, [])

    const appendTag = () => {
        if (tag.trim() === "") return
        const sameTagInDreamTags = dream.tags.filter(dreamTag => dreamTag === tag)
        if (sameTagInDreamTags.length === 0) {
            onChange({
                ...dream,
                tags: [...dream.tags, tag]
            })
            setTag("")
            return
        }
        alert("Tag já adicionada.")
    }

    const removeTag = (tagToRemove: string) => {
        const tagIndexToRemove = dream.tags.findIndex(tagName => tagName === tagToRemove)
        if (tagIndexToRemove === -1) return
        const dreamTags = dream.tags
        dreamTags.splice(tagIndexToRemove, 1)
        onChange({
            ...dream,
            tags: dreamTags
        })
    }

    return (
        <Box.Column style={ styles.container }>
            <CustomInput
                label="Título"
                onChange={ (e) => onChange({ ...dream, title: e }) }
                width="100%"
                defaultValue={ dream.title }
                active={ !isLocked }
            />
            <CustomInput
                label="Descrição"
                onChange={ (e) => onChange({ ...dream, description: e }) }
                width="100%"
                defaultValue={ dream.description }
                active={ !isLocked }
            />
            <Box.Column>
                <Info
                    infoDescription="Primeira pessoa?"
                    modalTitle="PERSPECTIVA DE UM SONHO"
                    modalDescription={[
                        "Você estava e era você no sonho? Você se via nele? Seu sonho contava uma história sua ou de outro? Defina aqui a perspectiva de seu sonho.",
                    ]}
                    type="question"
                />
                <Picker
                    selectedValue={ dream.dreamPointOfViewId }
                    onValueChange={ (e) => onChange({
                        ...dream,
                        dreamPointOfViewId: e
                    })}
                    style={{
                        ...styles.picker,
                        color: systemStyle.textColor,
                    }}
                    enabled={ !isLocked }
                >
                    <Picker.Item label="Primeira Pessoa" value="1" />
                    <Picker.Item label="Segunda Pessoa" value="2" />
                    <Picker.Item label="Terceira Pessoa" value="3" />
                </Picker>
            </Box.Column>
            <Info
                infoDescription="Climas em um sonho?"
                modalTitle="Clima de um Sonho"
                modalDescription={[
                    "Tinha uma tempestade em seu sonho? Defina aqui os climas presentes em seu sonho.",
                ]}
                type="question"
            />
            <CustomSwitch
                label="Clima Ameno"
                value={ dream.climate.ameno }
                onChange={ (e) => onChange({
                    ...dream,
                    climate: {
                        ...dream.climate,
                        ameno: e,
                        multiplos: false,
                        outro: false,
                        indefinido: false,
                    },
                })}
            />
            <CustomSwitch
                label="Clima Calor"
                value={ dream.climate.calor }
                onChange={ (e) => onChange({
                    ...dream,
                    climate: {
                        ...dream.climate,
                        calor: e,
                        multiplos: false,
                        outro: false,
                        indefinido: false,
                    },
                })}
            />
            <CustomSwitch
                label="Clima Garoa"
                value={ dream.climate.garoa }
                onChange={ (e) => onChange({
                    ...dream,
                    climate: {
                        ...dream.climate,
                        garoa: e,
                        multiplos: false,
                        outro: false,
                        indefinido: false,
                    },
                })}
            />
            <CustomSwitch
                label="Clima Chuva"
                value={ dream.climate.chuva }
                onChange={ (e) => onChange({
                    ...dream,
                    climate: {
                        ...dream.climate,
                        chuva: e,
                        multiplos: false,
                        outro: false,
                        indefinido: false,
                    },
                })}
            />
            <CustomSwitch
                label="Clima Tempestade"
                value={ dream.climate.tempestade }
                onChange={ (e) => onChange({
                    ...dream,
                    climate: {
                        ...dream.climate,
                        tempestade: e,
                        multiplos: false,
                        outro: false,
                        indefinido: false,
                    },
                })}
            />
            <CustomSwitch
                label="Clima Névoa"
                value={ dream.climate.nevoa }
                onChange={ (e) => onChange({
                    ...dream,
                    climate: {
                        ...dream.climate,
                        nevoa: e,
                        multiplos: false,
                        outro: false,
                        indefinido: false,
                    },
                })}
            />
            <CustomSwitch
                label="Clima Neve"
                value={ dream.climate.neve }
                onChange={ (e) => onChange({
                    ...dream,
                    climate: {
                        ...dream.climate,
                        neve: e,
                        multiplos: false,
                        outro: false,
                        indefinido: false,
                    },
                })}
            />
            <CustomSwitch
                label="Clima Múltiplos"
                value={ dream.climate.multiplos }
                onChange={ (e) => onChange({
                    ...dream,
                    climate: {
                        ameno: false,
                        calor: false,
                        garoa: false,
                        chuva: false,
                        tempestade: false,
                        nevoa: false,
                        neve: false,
                        multiplos: e,
                        outro: false,
                        indefinido: false,
                    },
                })}
            />
            <CustomSwitch
                label="Clima Outro"
                value={ dream.climate.outro }
                onChange={ (e) => onChange({
                    ...dream,
                    climate: {
                        ameno: false,
                        calor: false,
                        garoa: false,
                        chuva: false,
                        tempestade: false,
                        nevoa: false,
                        neve: false,
                        multiplos: false,
                        outro: e,
                        indefinido: false,
                    },
                })}
            />
            <CustomSwitch
                label="Clima Indefinido"
                value={ dream.climate.indefinido }
                onChange={ (e) => onChange({
                    ...dream,
                    climate: {
                        ameno: false,
                        calor: false,
                        garoa: false,
                        chuva: false,
                        tempestade: false,
                        nevoa: false,
                        neve: false,
                        multiplos: false,
                        outro: false,
                        indefinido: e,
                    },
                })}
            />
            <Info
                infoDescription="Horário de um sonho?"
                modalTitle="HORÁRIOS DE UM SONHO"
                modalDescription={[
                    "Seu sonho se passou de manhã? Defina o horário dele aqui.",
                ]}
                type="question"
            />
            <Picker
                selectedValue={ dream.dreamHourId }
                onValueChange={ (e) => onChange({
                    ...dream,
                    dreamHourId: e,
                })}
                style={{
                    ...styles.picker,
                    color: systemStyle.textColor,
                }}
                enabled={ !isLocked }
            >
                <Picker.Item label="Amanhecer" value="1" />
                <Picker.Item label="Dia" value="2" />
                <Picker.Item label="Anoitecer" value="3" />
                <Picker.Item label="Noite" value="4" />
                <Picker.Item label="Indefinido" value="5" />
                <Picker.Item label="Múltiplos" value="6" />
            </Picker>
            <Info
                infoDescription="Duração de um sonho?"
                modalTitle="DURAÇÃO DE UM SONHO"
                modalDescription={[
                    "Seu sonho pareceu tão longo quanto um episódio de uma série ou foi curto como um flash? Defina a duração dele aqui.",
                ]}
                type="question"
            />
            <Picker
                selectedValue={ dream.dreamDurationId }
                onValueChange={ (e) => onChange({
                    ...dream,
                    dreamDurationId: e,
                })}
                style={{
                    ...styles.picker,
                    color: systemStyle.textColor,
                }}
                enabled={ !isLocked }
            >
                <Picker.Item label="Instantâneo" value="1" />
                <Picker.Item label="Curto" value="2" />
                <Picker.Item label="Médio" value="3" />
                <Picker.Item label="Longo" value="4" />
            </Picker>
            <Info
                infoDescription="Nível de lucidez de um sonho?"
                modalTitle="LUCIDEZ DE UM SONHO"
                modalDescription={[
                    "Você tinha noção de que estava em um sonho ou ao menos sabia quem eram as pessoas em seu sonho? Defina o seu nível de lucidez no sonho aqui.",
                ]}
                type="question"
            />
            <Picker
                selectedValue={ dream.dreamLucidityLevelId }
                onValueChange={ (e) => onChange({
                    ...dream,
                    dreamLucidityLevelId: e,
                })}
                style={{
                    ...styles.picker,
                    color: systemStyle.textColor,
                }}
                enabled={ !isLocked }
            >
                <Picker.Item label="Não Lúcido" value="1" />
                <Picker.Item label="Parcialmente Lúcido" value="2" />
                <Picker.Item label="Lúcido" value="3" />
                <Picker.Item label="Indefinido" value="4" />
            </Picker>
            <Info
                infoDescription="Tipo de sonho?"
                modalTitle="TIPO DE SONHO"
                modalDescription={[
                    "Seu sonho foi assustador ou não? Define se teve um sonho ou um pesadelo.",
                ]}
                type="question"
            />
            <Picker
                selectedValue={ dream.dreamTypeId }
                onValueChange={ (e) => onChange({
                    ...dream,
                    dreamTypeId: e,
                })}
                style={{
                    ...styles.picker,
                    color: systemStyle.textColor,
                }}
                enabled={ !isLocked }
            >
                <Picker.Item label="Sonho" value="1" />
                <Picker.Item label="Pesadelo" value="2" />
                <Picker.Item label="Indefinido" value="3" />
            </Picker>
            <Info
                infoDescription="Nível de realidade de um sonho?"
                modalTitle="REALIDADE DE UM SONHO"
                modalDescription={[
                    "Voou mais alto que um avião? Defina aqui o nível de realidade de seu sonho.",
                ]}
                type="question"
            />
            <Picker
                selectedValue={ dream.dreamRealityLevelId }
                onValueChange={ (e) => onChange({
                    ...dream,
                    dreamRealityLevelId: e,
                })}
                style={{
                    ...styles.picker,
                    color: systemStyle.textColor,
                }}
                enabled={ !isLocked }
            >
                <Picker.Item label="Irreal" value="1" />
                <Picker.Item label="Parcialmente Real" value="2" />
                <Picker.Item label="Real" value="3" />
            </Picker>
            <Box.Row style={ styles.infoContainer }>
                <Info
                    modalTitle="SONHO ERÓTICO"
                    modalDescription={[
                        "Seu sonho conteve conteúdo sexual? Se sim, marque essa opção, esse sonho não será mostrado com os outros na listagem, fique tranquilo!",
                    ]}
                />
                <CustomSwitch
                    label="Sonho Erótico"
                    value={ dream.eroticDream }
                    onChange={ (e) => { onChange({
                        ...dream,
                        eroticDream: e,
                    })}}
                />
            </Box.Row>
            <Box.Row style={ styles.infoContainer }>
                <Info
                    modalTitle="SONHO OCULTO"
                    modalDescription={[
                        "Assunto delicado? Pessoas indesejadas no sonho? Se sim, marque essa opção, esse sonho não será mostrado com os outros na listagem, fique tranquilo!",
                    ]}
                />
                <CustomSwitch
                    label="Sonho Oculto"
                    value={ dream.hiddenDream }
                    onChange={ (e) => { onChange({
                        ...dream,
                        hiddenDream: e,
                    })}}
                />
            </Box.Row>
            <Info
                infoDescription="Análise pessoal?"
                modalTitle="ANÁLISE PESSOAL"
                modalDescription={[
                    "Seu sonho faz sentido? Há uma mensagem oculta de seu subconsciente? Defina aqui (se quiser) uma interpretação pessoal de seu sonho.",
                ]}
                type="question"
            />
            <CustomInput
                label="Análise Pessoal"
                onChange={ (e) => onChange({ ...dream, personalAnalysis: e }) }
                defaultValue={ dream.personalAnalysis ?? undefined }
                width="100%"
                active={ !isLocked }
            />
            <Box.Column style={ styles.tagContainer }>
                <Box.Column style={ styles.tagContainerActions }>
                    <Info
                        infoDescription="Tag de um sonho?"
                        modalTitle="TAG DE SONHO"
                        modalDescription={[
                            "Quantas vezes você já sonhou com aquela pessoa ou aquele lugar? mencione-o aqui em uma tag e adicione!",
                            "Você pode sonhar com isso de novo e essas ocorrências serão mapeadas, adicione quantas tags achar necessário sobre seu sonho. Exemplo: Cachorro, Casa, Mãe, Evento...",
                            `É possível filtrar sonhos por TAGs, portanto, você pode encontrar todos os sonhos em que "${ dream.tags[0] ? dream.tags[0].toLowerCase() : "cachorro" }" aparece.`,
                        ]}
                        type="question"
                    />
                    <CustomInput
                        label="TAG"
                        onChange={ (e) => setTag(e.toUpperCase().trim()) }
                        innerProps={{ value: tag }}
                        width="100%"
                        active={ !isLocked }
                    />
                    <CustomButton
                        title="Adicionar TAG"
                        onPress={ appendTag }
                        active={ !isLocked && tag != "" }
                    />
                </Box.Column>
                {
                    dream.tags.length > 0
                        ? <Box.Row
                            style={{
                                ...styles.tagsContainer,
                                backgroundColor: systemStyle.secondary,
                            }}
                        >
                            {
                                dream.tags.map((tag, i) => {
                                    return <CustomText
                                        key={ i }
                                        onPress={ () => removeTag(tag) }
                                        weight="bold"
                                        isOpposite
                                    >
                                        { tag }
                                    </CustomText>
                                })
                            }
                        </Box.Row>
                        : <></>
                }
            </Box.Column>
        </Box.Column>
    )
}

const styles = StyleSheet.create({
    container: {
        gap: 10,
    },
    picker: {
        width: "60%",
    },
    tagContainer: {
        gap: 5,
    },
    tagContainerActions: {
        gap: 10,
    },
    tagsContainer: {
        columnGap: 10,
        flexWrap: "wrap",
        padding: 10,
        borderRadius: 10,
    },
    infoContainer: {
        alignItems: 'center',
        gap: 5,
    },
})