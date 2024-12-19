import { DreamModel } from "@/types/dream"
import { Pressable, StyleSheet, Text, View } from "react-native"
import { Screen } from "@/components/base/Screen"
import { SyncContextProvider } from "@/contexts/SyncContext"
import { TagModel } from "@/types/tag"
import { useEffect, useState } from "react"
import { useLocalSearchParams, useRouter } from "expo-router"
import Auth from "@/components/auth/Auth"
import Box from "@/components/base/Box"
import CustomButton from "@/components/customs/CustomButton"
import DreamService from "@/services/api/DreamService"
import IconEntypo from "react-native-vector-icons/Entypo"
import IconFontisto from "react-native-vector-icons/Fontisto"
import IconFoundation from "react-native-vector-icons/Foundation"
import IconIon from "react-native-vector-icons/Ionicons"
import Info from "@/components/base/Info"
import Loading from "@/components/base/Loading"
import React from "react"
import TagService from "@/services/api/TagService"

type GetDreamParams = {
    id: string
    sleepDate: string
}

export default function GetDreamScreen() {
    const router = useRouter()
    const { id, sleepDate } = useLocalSearchParams<GetDreamParams>()
    const { isConnectedRef: { current: isOnline }} = SyncContextProvider()
    const [ dream, setDream ] = useState<DreamModel | null>(null)
    const [ tags, setTags ] = useState<TagModel[] | null>(null)
    const [ loading, setLoading ] = useState<boolean>(true)
    const [ errorMessage, setErrorMessage ] = useState<string>("")

    useEffect(() => {
        const fetchDream = async () => {
            await DreamService.GetDream(isOnline, { id: Number.parseInt(id) })
                .then(response => {
                    if (response.Success) {
                        setDream(response.Data)
                        return
                    }
                    setErrorMessage(response.ErrorMessage ?? "")
                })
                .finally(() => {
                    setLoading(false)
                })
        }
        const fetchTags = async () => {
            await TagService.ListByDream(isOnline, { dreamId: Number.parseInt(id) })
                .then(response => {
                    if (response.Success) {
                        setTags(response.Data)
                        return
                    }
                    setTags([])
                })
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

    const tagInfo = tags
        ? tags.length > 0
            ? `Lembra de quando sonhou com ${ tags[0].title }? Selecione essa tag abaixo (ou outra) e visualize os sonhos na qual ela também está presente!`
            : "Seu sonho não tem tags, não sonhou com nada relevante em específico? Tags reúnem sonhos com ocorridos em comum, edite esse sonho e adicione tags, ou visualize outro que possua, experimente!"
        : "Seu sonho não tem tags, não sonhou com nada relevante em específico? Tags reúnem sonhos com ocorridos em comum, edite esse sonho e adicione tags, ou visualize outro que possua, experimente!"

    return (
        <Auth>
            <Screen>
                <Box.Column style={ styles.container }>
                    {
                        loading
                            ? <Loading onlyLoading={ false } text="Buscando Sonho..." />
                            : dream
                                ? (
                                    <Box.Column style={ styles.dreamContainer }>
                                        {
                                            dream.hiddenDream
                                                ? <View>
                                                    <IconIon name="alert-circle-sharp" color="black" size={ 20 } />
                                                    <Text>Esse sonho é oculto</Text>
                                                </View>
                                                : <></>
                                        }
                                        {
                                            dream.dreamTypeId === 2
                                                ? <Text>Pesadelo</Text>
                                                : <></>
                                        }
                                        <Box.Column>
                                            {
                                                dream.eroticDream
                                                    ? (
                                                        <Box.Row style={ styles.iconAndMessageStyle }>
                                                            <IconIon name="alert-circle-sharp" color="black" size={ 20 } />
                                                            <Text>Sonho erótico</Text>
                                                        </Box.Row>
                                                    )
                                                    : <></>
                                            }
                                            <Box.Row style={ styles.dreamTitleTextContainer }>
                                                <Text style={ styles.dreamTitleText }>{ dream.title }</Text>
                                                <Pressable onPress={ () => router.navigate({ pathname: "/updateDream", params: { id: id, sleepDate: sleepDate } }) }>
                                                    <IconIon name="pencil-sharp" color="black" size={ 30 } />
                                                </Pressable>
                                            </Box.Row>
                                            <Text style={ styles.dreamTitleDateText }>{ sleepDate }</Text>
                                        </Box.Column>
                                        <Text style={ styles.dreamDescription }>{ dream.description }</Text>
                                        <Box.Column style={ styles.tagsContainer }>
                                            <Box.Row style={ styles.tagsInfoContainer }>
                                                <Info
                                                    modalTitle="MAPEAMENTO DE TAGS"
                                                    modalDescription={ [...tagInfo] }
                                                    overrideInfoColor="white"
                                                />
                                                <Text style={ styles.tagContainerTitle }>TAGS</Text>
                                            </Box.Row>
                                            <Box.Row style={ styles.tags }>
                                                {
                                                    tags
                                                        ? tags.length > 0
                                                            ? tags.map((tag, i) => (
                                                                <Pressable
                                                                    onPress={ () => router.navigate({ pathname: "/getTag", params: { title: tag.title, id: tag.id } }) }
                                                                    key={ i }
                                                                >
                                                                    <Text style={ styles.tagText }>{ tag.title }</Text>
                                                                </Pressable>
                                                            ))
                                                            : <Text style={ styles.tagText }>Não há tags</Text>
                                                        : <Loading onlyLoading={ false } text="Buscando Tags...." />
                                                }
                                            </Box.Row>
                                        </Box.Column>
                                        <View>
                                            {
                                                dream.personalAnalysis
                                                    ? (
                                                        <Box.Column style={ styles.personalAnalysisContainer }>
                                                            <Box.Row style={ styles.iconAndMessageStyle }>
                                                                <IconIon name="person-outline" color="black" size={ 20 } />
                                                                <Text style={ styles.personalAnalysisText }>Análise pessoal:</Text>
                                                            </Box.Row>
                                                            <Text style={ styles.personalAnalysisText }>{ dream.personalAnalysis }</Text>
                                                        </Box.Column>
                                                    )
                                                    : <></>
                                            }
                                            <Box.Row style={ styles.iconAndMessageStyle }>
                                                <IconIon name="rainy-sharp" color="black" size={ 20 } />
                                                <Box.Row>
                                                    <Text style={ styles.boldText }>Climas: </Text>
                                                    <Text>{ renderClimates() }</Text>
                                                </Box.Row>
                                            </Box.Row>
                                            <Box.Row style={ styles.iconAndMessageStyle }>
                                                <IconIon name="game-controller" color="black" size={ 20 } />
                                                <Text style={ styles.boldText }>Sonho em { renderDreamPointOfView() } pessoa</Text>
                                            </Box.Row>
                                            <Box.Row style={ styles.iconAndMessageStyle }>
                                                <IconFontisto name="clock" color="black" size={ 20 } />
                                                <Box.Row>
                                                    <Text style={ styles.boldText }>Horário: </Text>
                                                    <Text>{ renderHour() }</Text>
                                                </Box.Row>
                                            </Box.Row>
                                            <Box.Row style={ styles.iconAndMessageStyle }>
                                                <IconIon name="timer" color="black" size={ 20 } />
                                                <Box.Row>
                                                    <Text style={ styles.boldText }>Duração: </Text>
                                                    <Text>{ renderDuration() }</Text>
                                                </Box.Row>
                                            </Box.Row>
                                            <Box.Row style={ styles.iconAndMessageStyle }>
                                                <IconEntypo name="drink" color="black" size={ 20 } />
                                                <Box.Row>
                                                    <Text style={ styles.boldText }>Nível de Lucidez: </Text>
                                                    <Text>{ renderLucidityLevel() }</Text>
                                                </Box.Row>
                                            </Box.Row>
                                            <Box.Row style={ styles.iconAndMessageStyle }>
                                                <IconFoundation name="magnifying-glass" color="black" size={ 20 } />
                                                <Box.Row>
                                                    <Text style={ styles.boldText }>Nível de Realidade: </Text>
                                                    <Text>{ renderRealityLevel() }</Text>
                                                </Box.Row>
                                            </Box.Row>
                                            <Box.Row style={ styles.iconAndMessageStyle }>
                                                <IconIon name="information-circle" color="black" size={ 20 } />
                                                <Text style={ styles.boldText }>{ renderDreamOrigin() }</Text>
                                            </Box.Row>
                                        </View>
                                    </Box.Column>
                                )
                                : <>
                                    <Text>Houve um problema ao buscar o sonho:</Text>
                                    <Text>{ errorMessage }</Text>
                                </>
                    }
                    <CustomButton
                        title="Voltar"
                        onPress={ () => {
                            if (router.canGoBack())
                                router.back()
                            else
                                router.navigate("/dreamsHome")
                        }}
                    />
                </Box.Column>
            </Screen>
        </Auth>
    )
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
    },
    dreamContainer: {
        gap: 5,
    },
    iconAndMessageStyle: {
        gap: 3,
        alignItems: "center",
    },
    dreamTitleText: {
        fontSize: 35,
    },
    dreamTitleTextContainer: {
        gap: 15,
        alignItems: "center",
    },
    dreamTitleDateText: {
        fontSize: 18,
    },
    dreamDescription: {
        fontSize: 20,
        paddingTop: 10,
        paddingBottom: 10,
    },
    tagsContainer: {
        paddingTop: 10,
        paddingHorizontal: 20,
        paddingBottom: 20,
        borderRadius: 15,
        backgroundColor: "royalblue",
    },
    tags: {
        flexWrap: "wrap",
        gap: 10,
    },
    tagContainerTitle: {
        fontWeight: "bold",
        fontSize: 25,
        color: "white",
    },
    tagText: {
        fontSize: 22,
        color: "white",
    },
    personalAnalysisContainer: {
        paddingVertical: 10,
    },
    personalAnalysisText: {
        fontSize: 20,
    },
    boldText: {
        fontWeight: "bold",
    },
    tagsInfoContainer: {
        alignItems: "center",
        paddingBottom: 10,
        gap: 5,
    },
})