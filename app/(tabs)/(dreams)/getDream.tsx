import { DreamModel } from "@/types/dream"
import { Pressable, StyleSheet } from "react-native"
import { Screen } from "@/components/base/Screen"
import { StyleContextProvider } from "@/contexts/StyleContext"
import { SyncContextProvider } from "@/contexts/SyncContext"
import { TagModel } from "@/types/tag"
import { useEffect, useState } from "react"
import { useLocalSearchParams, useRouter } from "expo-router"
import { useSQLiteContext } from "expo-sqlite"
import Box from "@/components/base/Box"
import ConfirmRecordDeletion from "@/components/screens/general/ConfirmRecordDeletion"
import CustomButton from "@/components/customs/CustomButton"
import CustomText from "@/components/customs/CustomText"
import DreamsDb from "@/db/dreamsDb"
import DreamService from "@/services/api/DreamService"
import IconEntypo from "react-native-vector-icons/Entypo"
import IconFontisto from "react-native-vector-icons/Fontisto"
import IconFoundation from "react-native-vector-icons/Foundation"
import IconIon from "react-native-vector-icons/Ionicons"
import Info from "@/components/base/Info"
import Loading from "@/components/base/Loading"
import React from "react"
import ShareDreamModal from "@/components/screens/dreams/ShareDreamModal"
import ShowTags from "@/components/screens/dreams/ShowTags"
import TagService from "@/services/api/TagService"

type GetDreamParams = {
    id: string
    sleepDate: string
}

export default function GetDreamScreen() {
    const { systemStyle } = StyleContextProvider()
    const { checkIsConnected } = SyncContextProvider()
    const db = useSQLiteContext()
    const router = useRouter()
    const { id, sleepDate } = useLocalSearchParams<GetDreamParams>()
    const [ dream, setDream ] = useState<DreamModel | null>(null)
    const [ tags, setTags ] = useState<TagModel[] | null>(null)
    const [ loading, setLoading ] = useState<boolean>(true)
    const [ errorMessage, setErrorMessage ] = useState<string>("")
    const [ openShareDreamModal, setOpenShareDreamModal ] = useState<boolean>(false)

    useEffect(() => {
        const fetchDream = async () => {
            if (checkIsConnected()) {
                await DreamService.GetDream({ id: Number.parseInt(id) })
                    .then(response => {
                        if (response.Success) {
                            setDream(response.Data)
                            return
                        }
                        setErrorMessage(response.ErrorMessage ?? "")
                    })
            }
            else {
                await DreamsDb.Get(db, Number.parseInt(id))
                    .then(result => {
                        if (result) {
                            setDream(result)
                            setTags(result.dreamTags.map(dreamTag => {
                                return {
                                    id: 0,
                                    title: dreamTag,
                                }
                            }))
                            return
                        }
                        setErrorMessage("Sonho não encontrado.")
                    })
            }
            setLoading(false)
        }
        const fetchTags = async () => {
            if (checkIsConnected()) {
                await TagService.ListByDream(checkIsConnected(), { dreamId: Number.parseInt(id) })
                    .then(response => {
                        if (response.Success) {
                            setTags(response.Data)
                            return
                        }
                        setTags([])
                    })
            }
        }
        fetchDream()
        fetchTags()
    }, [])

    const renderDreamPointOfView = () => {
        switch (dream?.dreamPointOfViewId) {
            case 1: return "primeira"
            case 2: return "segunda"
            case 3: return "terceira"
            default: return "primeira"
        }
    }

    const renderDreamOrigin = () => {
        switch (dream?.dreamOriginId) {
            case 1: return "Sonho criado manualmente"
            case 2: return "Sonho rápido"
            case 3: return "Sonho importado"
            default: return "Sonho criado manualmente"
        }
    }

    const renderClimates = () => {
        let climates = ""
        if (dream?.climate.ameno) climates += "Ameno; "
        if (dream?.climate.calor) climates += "Calor; "
        if (dream?.climate.garoa) climates += "Garoa; "
        if (dream?.climate.chuva) climates += "Chuva; "
        if (dream?.climate.tempestade) climates += "Tempestade; "
        if (dream?.climate.nevoa) climates += "Nevoa; "
        if (dream?.climate.neve) climates += "Neve; "
        if (dream?.climate.multiplos) climates += "Múltiplos; "
        if (dream?.climate.outro) climates += "Outro; "
        if (dream?.climate.indefinido) climates += "Indefinido; "
        if (climates === "") return "Nenhum clima definido"
        return climates
    }

    const renderHour = () => {
        switch (dream?.dreamHourId) {
            case 1: return "Amanhecer"
            case 2: return "Manhã / Tarde"
            case 3: return "Anoitecer"
            case 4: return "Noite"
            case 5: return "Indefinido"
            case 6: return "Múltiplos horários"
            default: return "Amanhecer"
        }
    }

    const renderDuration = () => {
        switch (dream?.dreamDurationId) {
            case 1: return "Instantâneo"
            case 2: return "Curto"
            case 3: return "Médio"
            case 4: return "Longo"
            default: return "Instantâneo"
        }
    }

    const renderLucidityLevel = () => {
        switch (dream?.dreamLucidityLevelId) {
            case 1: return "Não lúcido"
            case 2: return "Parcialmente lúcido"
            case 3: return "Lúcido"
            case 4: return "Indefinido"
            default: return "Não lúcido"
        }
    }

    const renderRealityLevel = () => {
        switch (dream?.dreamRealityLevelId) {
            case 1: return "Irreal"
            case 2: return "Parcialmente real"
            case 3: return "Real"
            default: return "Irreal"
        }
    }

    const renderDreamUpperInfo = () => {
        return <Box.Column style={ styles.dreamUpperInfoContainer }>
            {
                dream!.hiddenDream
                    ? <Box.Row style={ styles.iconAndMessageStyle }>
                        <IconIon
                            name="alert-circle-sharp"
                            color={ systemStyle.iconColor }
                            size={ systemStyle.normalIconSize }
                        />
                        <CustomText>SONHO OCULTO</CustomText>
                    </Box.Row>
                    : <></>
            }
            {
                dream!.dreamTypeId === 2
                    ? <Box.Row style={ styles.iconAndMessageStyle }>
                        <IconIon
                            name="alert-circle-sharp"
                            color={ systemStyle.iconColor }
                            size={ systemStyle.normalIconSize } />
                        <CustomText>PESADELO</CustomText>
                    </Box.Row>
                    : <></>
            }
            {
                dream!.eroticDream
                    ? <Box.Row style={ styles.iconAndMessageStyle }>
                        <IconIon
                            name="alert-circle-sharp"
                            color={ systemStyle.iconColor }
                            size={ systemStyle.normalIconSize } />
                        <CustomText>SONHO ERÓTICO</CustomText>
                    </Box.Row>
                    : <></>
            }
        </Box.Column>
    }

    const renderDreamDate = () => {
        if (sleepDate === "undefined-undefined-undefinedundefined") return <></>
        return (
            <Pressable onPress={ () => { router.navigate({ pathname: "/(tabs)/(sleeps)/getSleep", params: { id: dream!.sleepId }}) } }>
                <CustomText
                    size="l"
                    weight="thin"
                >
                    { sleepDate }
                </CustomText>
            </Pressable>
        )
    }

    const mountDreamCharacteristicsForSharing = () => {
        return [
            { title: "Climas", description: renderClimates() },
            { title: "Perspectiva", description: renderDreamPointOfView() },
            { title: "Horário", description: renderHour() },
            { title: "Duração", description: renderDuration() },
            { title: "Nível de Lucidez", description: renderLucidityLevel() },
            { title: "Nível de Realidade", description: renderRealityLevel() },
        ]
    }

    const renderButtons = () => {
        return <Box.Column style={ styles.btns }>
            <Box.Row style={ styles.goBackAndUpdateBtnsContainer }>
                <ConfirmRecordDeletion
                    btnWidth="50%"
                    deletionAction={ async () => {
                        setLoading(true)
                        await DreamService.DeleteDream({ id: dream!.id })
                            .then((response) => {
                                if (response.Success) {
                                    alert(response.Data)
                                    router.navigate("/(tabs)/(dreams)/dreamsList")
                                    return
                                }
                                setLoading(false)
                                alert(response.ErrorMessage)
                            })
                    }}
                />
                <CustomButton
                    title="Editar"
                    btnColor="orange"
                    btnTextColor="orange"
                    btnWidth="50%"
                    onPress={ () => router.navigate({ pathname: "/updateDream", params: { id: id, sleepDate: sleepDate } }) }
                />
            </Box.Row>
            <CustomButton
                title="Compartilhar"
                onPress={ () => setOpenShareDreamModal(true) }
                important
            />
            <ShareDreamModal
                open={ openShareDreamModal }
                setOpen={ setOpenShareDreamModal }
                dreamInfo={{
                    title: dream!.title,
                    description: dream!.description,
                    characteristics: mountDreamCharacteristicsForSharing(),
                }}
                personalAnalysis={ dream?.personalAnalysis ?? undefined }
                tags={ tags ? tags.map(tag => tag.title) : [] }
                sleepId={ dream!.sleepId }
            />
        </Box.Column>
    }

    const tagInfo = tags
        ? tags.length > 0
            ? `Lembra de quando sonhou com ${ tags[0].title }? Selecione essa tag abaixo (ou outra) e visualize os sonhos na qual ela também está presente!`
            : "Seu sonho não tem tags, não sonhou com nada relevante em específico? Tags reúnem sonhos com ocorridos em comum, edite esse sonho e adicione tags, ou visualize outro que possua, experimente!"
        : "Seu sonho não tem tags, não sonhou com nada relevante em específico? Tags reúnem sonhos com ocorridos em comum, edite esse sonho e adicione tags, ou visualize outro que possua, experimente!"

    return (
        <Screen>
            <Box.Column style={ styles.container }>
                {
                    loading
                        ? <Loading onlyLoading={ false } text="Buscando Sonho..." />
                        : dream
                            ? (
                                <Box.Column style={ styles.dreamContainer }>
                                    <Box.Column>
                                        { renderDreamUpperInfo() }
                                        <Box.Row style={ styles.dreamTitleTextContainer }>
                                            <CustomText
                                                size="xxl"
                                                weight="bold"
                                                style={ styles.dreamTitleText }
                                                selectable
                                            >
                                                { dream.title }
                                            </CustomText>
                                        </Box.Row>
                                        { renderDreamDate() }
                                    </Box.Column>
                                    <CustomText
                                        weight="thin"
                                        style={{
                                            ...styles.dreamDescription,
                                            backgroundColor: systemStyle.quaternary,
                                        }}
                                        selectable
                                    >
                                        { dream.description }
                                    </CustomText>
                                    {
                                        dream.personalAnalysis && dream.personalAnalysis != "null"
                                            ? (
                                                <Box.Column
                                                    style={{
                                                        ...styles.personalAnalysisContainer,
                                                        backgroundColor: systemStyle.quaternary,
                                                    }}
                                                >
                                                    <Box.Row style={ styles.iconAndMessageStyle }>
                                                        <IconIon
                                                            name="person-outline"
                                                            color={ systemStyle.iconColor }
                                                            size={ systemStyle.normalIconSize }
                                                        />
                                                        <CustomText size="l">
                                                            Análise Pessoal
                                                        </CustomText>
                                                    </Box.Row>
                                                    <CustomText weight="thin" selectable>
                                                        { dream.personalAnalysis }
                                                    </CustomText>
                                                </Box.Column>
                                            )
                                            : <></>
                                    }
                                    {
                                        tags
                                            ? <>
                                                <Info
                                                    infoDescription="Tags do Sonho"
                                                    modalTitle="MAPEAMENTO DE TAGS"
                                                    modalDescription={ [tagInfo] }
                                                />
                                                <ShowTags
                                                    tags={
                                                        tags.map(tag => {
                                                            return { id: tag.id, title: tag.title, quantity: 0 }
                                                        }
                                                    )}
                                                />
                                            </>
                                            : <Loading onlyLoading={ false } text="Buscando Tags...." />
                                    }
                                    <Box.Column
                                        style={{
                                            ...styles.dreamCharacteristicsContainer,
                                            backgroundColor: systemStyle.terciary
                                        }}
                                    >
                                        <Box.Row style={ styles.iconAndMessageStyle }>
                                            <IconIon
                                                name="rainy-sharp"
                                                color={ systemStyle.oppositeIconColor }
                                                size={ systemStyle.normalIconSize }
                                            />
                                            <Box.Row style={ styles.dreamClimates }>
                                                <CustomText weight="bold" isOpposite>{ `Climas: ` }</CustomText>
                                                <CustomText weight="thin" isOpposite>{ renderClimates() }</CustomText>
                                            </Box.Row>
                                        </Box.Row>
                                        <Box.Row style={ styles.iconAndMessageStyle }>
                                            <IconIon
                                                name="game-controller"
                                                color={ systemStyle.oppositeIconColor }
                                                size={ systemStyle.normalIconSize }
                                            />
                                            <CustomText weight="bold" isOpposite>{ `Sonho em ${ renderDreamPointOfView() } pessoa` }</CustomText>
                                        </Box.Row>
                                        <Box.Row style={ styles.iconAndMessageStyle }>
                                            <IconFontisto
                                                name="clock"
                                                color={ systemStyle.oppositeIconColor }
                                                size={ systemStyle.normalIconSize }
                                            />
                                            <Box.Row>
                                                <CustomText weight="bold" isOpposite>Horário: </CustomText>
                                                <CustomText weight="thin" isOpposite>{ renderHour() }</CustomText>
                                            </Box.Row>
                                        </Box.Row>
                                        <Box.Row style={ styles.iconAndMessageStyle }>
                                            <IconIon
                                                name="timer"
                                                color={ systemStyle.oppositeIconColor }
                                                size={ systemStyle.normalIconSize }
                                            />
                                            <Box.Row>
                                                <CustomText weight="bold" isOpposite>Duração: </CustomText>
                                                <CustomText weight="thin" isOpposite>{ renderDuration() }</CustomText>
                                            </Box.Row>
                                        </Box.Row>
                                        <Box.Row style={ styles.iconAndMessageStyle }>
                                            <IconEntypo
                                                name="drink"
                                                color={ systemStyle.oppositeIconColor }
                                                size={ systemStyle.normalIconSize }
                                            />
                                            <Box.Row>
                                                <CustomText weight="bold" isOpposite>Nível de Lucidez: </CustomText>
                                                <CustomText weight="thin" isOpposite>{ renderLucidityLevel() }</CustomText>
                                            </Box.Row>
                                        </Box.Row>
                                        <Box.Row style={ styles.iconAndMessageStyle }>
                                            <IconFoundation
                                                name="magnifying-glass"
                                                color={ systemStyle.oppositeIconColor }
                                                size={ systemStyle.normalIconSize }
                                            />
                                            <Box.Row>
                                                <CustomText weight="bold" isOpposite>Nível de Realidade: </CustomText>
                                                <CustomText weight="thin" isOpposite>{ renderRealityLevel() }</CustomText>
                                            </Box.Row>
                                        </Box.Row>
                                        <Box.Row style={ styles.iconAndMessageStyle }>
                                            <IconIon
                                                name="information-circle"
                                                color={ systemStyle.oppositeIconColor }
                                                size={ systemStyle.normalIconSize }
                                            />
                                            <CustomText weight="thin" size="s"  isOpposite>{ renderDreamOrigin() }</CustomText>
                                        </Box.Row>
                                    </Box.Column>
                                    { renderButtons() }
                                </Box.Column>
                            )
                            : (
                                <Box.Column style={ styles.errorOnFetchDream }>
                                    <CustomText>{ errorMessage }</CustomText>
                                </Box.Column>
                            )
                }
                <CustomButton
                    title="Voltar"
                    onPress={ () => router.navigate("/(tabs)/(dreams)/dreamsList") }
                />
            </Box.Column>
        </Screen>
    )
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        gap: 5,
    },
    dreamContainer: {
        width: "100%",
        gap: 10,
    },
    iconAndMessageStyle: {
        gap: 5,
        alignItems: "center",
    },
    dreamUpperInfoContainer: {
        gap: 3,
    },
    dreamTitleText: {
        flexWrap: "wrap",
    },
    dreamTitleTextContainer: {
        gap: 15,
        alignItems: "center",
        flexWrap: "wrap",
    },
    dreamDescription: {
        padding: 10,
        borderRadius: 15,
    },
    personalAnalysisContainer: {
        padding: 10,
        gap: 10,
        borderRadius: 15,
    },
    errorOnFetchDream: {
        paddingBottom: 15,
    },
    dreamCharacteristicsContainer: {
        gap: 5,
        padding: 10,
        borderRadius: 15,
    },
    dreamClimates: {
        flexWrap: "wrap",
    },
    btns: {
        width: "100%",
        gap: 5,
    },
    goBackAndUpdateBtnsContainer: {
        width: "100%",
        justifyContent: "space-between",
    },
})