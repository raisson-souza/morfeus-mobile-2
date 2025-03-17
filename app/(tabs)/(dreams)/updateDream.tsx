import { DateFormatter } from "@/utils/DateFormatter"
import { ListedSleepForDreamCreation } from "@/types/sleeps"
import { Screen } from "@/components/base/Screen"
import { Alert, StyleSheet } from "react-native"
import { SyncContextProvider } from "@/contexts/SyncContext"
import { UpdateDreamModel } from "@/types/dream"
import { useEffect, useState } from "react"
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router"
import Box from "@/components/base/Box"
import CreateCompleteDream from "@/components/screens/dreams/CreateCompleteDream"
import CustomButton from "@/components/customs/CustomButton"
import CustomText from "@/components/customs/CustomText"
import DreamService from "@/services/api/DreamService"
import Loading from "@/components/base/Loading"
import React from "react"
import SleepExtractionBySleepCycle from "@/components/screens/dreams/sleepInfoForDreamCreation/SleepExtractionBySleepCycle"
import SleepService from "@/services/api/SleepService"
import TagService from "@/services/api/TagService"

type UpdateDreamParams = {
    id: string
}

export default function UpdateDreamScreen() {
    const navigation = useNavigation()
    const router = useRouter()
    const { checkIsConnected } = SyncContextProvider()
    const { id } = useLocalSearchParams<UpdateDreamParams>()
    const [ dream, setDream ] = useState<UpdateDreamModel | null>(null)
    const [ tags, setTags ] = useState<string[]>([])
    const [ sleepInfo, setSleepInfo ] = useState<ListedSleepForDreamCreation | null>(null)
    const [ changeSleepCycle, setChangeSleepCycle ] = useState<boolean>(false)
    const [ loading, setLoading ] = useState<boolean>(true)
    const [ errorOnFetch, setErrorOnFetch ] = useState<boolean>(false)

    const fetchDream = async () => {
        await DreamService.GetDream(checkIsConnected(), { id: Number.parseInt(id) })
            .then(async (response) => {
                if (response.Success) {
                    setDream({
                        ...response.Data,
                        tags: [],
                    })
                    await fetchSleep(response.Data.sleepId)
                    return
                }
                setErrorOnFetch(true)
                Alert.alert("Erro ao buscar sonho", response.ErrorMessage)
            })
    }

    const fetchTags = async () => {
        await TagService.ListByDream(checkIsConnected(), { dreamId: Number.parseInt(id) })
            .then(response => {
                if (response.Success) {
                    setTags(response.Data.map(tag => tag.title))
                    return
                }
                setTags([])
            })
    }

    const fetchSleep = async (sleepId: number) => {
        await SleepService.GetSleep(checkIsConnected(), { id: sleepId })
            .then(response => {
                if (response.Success) {
                    setSleepInfo({
                        id: response.Data.id,
                        date: new Date(response.Data.date),
                        sleepStart: response.Data.sleepStart,
                        sleepEnd: response.Data.sleepEnd,
                    })
                    return
                }
                setErrorOnFetch(true)
                Alert.alert("Erro ao buscar ciclo de sono referente", response.ErrorMessage)
            })
            .finally(() => setLoading(false))
    }

    const updateDream = async () => {
        setLoading(true)
        await DreamService.Update(checkIsConnected(), {
            ...dream!,
            tags: tags,
        })
            .then(response => {
                if (response.Success) {
                    Alert.alert(response.Data)
                    router.navigate({ pathname: "/(tabs)/(dreams)/getDream", params: { id: dream!.id }})
                }
                else {
                    setErrorOnFetch(true)
                    Alert.alert("Erro ao atualizar sonho", response.ErrorMessage)
                }
                setLoading(false)
            })
    }

    useEffect(() => {
        fetchDream()
        fetchTags()
        return navigation.addListener("blur", () => {
            setLoading(true)
            setDream(null)
            setTags([])
            setChangeSleepCycle(false)
            setSleepInfo(null)
            setErrorOnFetch(false)
        })
    }, [])

    const renderDream = () => {
        if (loading)
            return <Loading text="Buscando Sonho..." onlyLoading={ false } />

        if (errorOnFetch)
            return <CustomText>Ocorreu um erro ao buscar o sonho.</CustomText>

        if (dream && sleepInfo) {
            return <>
                <Box.Column>
                    <Box.Row style={ styles.dreamSleepCycle }>
                        <CustomText weight="bold">{ `Início do sono: ` }</CustomText>
                        <CustomText weight="thin">{ `${ DateFormatter.removeTime(sleepInfo.sleepStart) } ${ DateFormatter.removeDate(sleepInfo.sleepStart) }` }</CustomText>
                    </Box.Row>
                    <Box.Row style={ styles.dreamSleepCycle }>
                        <CustomText weight="bold">{ `Fim do sono: ` }</CustomText>
                        <CustomText weight="thin">{ `${ DateFormatter.removeTime(sleepInfo.sleepEnd) } ${ DateFormatter.removeDate(sleepInfo.sleepEnd) }` }</CustomText>
                    </Box.Row>
                </Box.Column>
                {
                    changeSleepCycle
                        ? (
                            <SleepExtractionBySleepCycle
                                sleepId={ dream.sleepId }
                                onChange={ async (sleepId, sleep) => {
                                    setDream({ ...dream, sleepId: sleepId })
                                    setSleepInfo(sleep)
                                }}
                                textColor="black"
                                showSleep={ false }
                            />
                        )
                        : (
                            <CustomButton
                                title="Alterar ciclo de sono"
                                onPress={ () => setChangeSleepCycle(true) }
                            />
                        )
                }
                <CreateCompleteDream
                    dream={{
                        ...dream,
                        tags: tags,
                    }}
                    onChange={ (e) => {
                        setDream({ ...dream, ...e })
                        setTags(e.tags)
                    }}
                    isLocked={ loading }
                />
                <CustomButton
                    title="Salvar"
                    onPress={ async () => await updateDream() }
                    important
                />
            </>
        }
        else return <Loading text="Buscando Sonho..." onlyLoading={ false } />
    }

    return (
        <Screen>
            <Box.Column style={ styles.container }>
                { renderDream() }
                <CustomButton
                    title="Voltar"
                    onPress={ () => {
                        if (dream) router.navigate({ pathname: "/(tabs)/(dreams)/getDream", params: { id: dream.id }})
                        else router.navigate("/(tabs)/(dreams)/dreamsList")
                    }}
                />
            </Box.Column>
        </Screen>
    )
}

const styles = StyleSheet.create({
    container: {
        width: "100%",
        gap: 10,
    },
    dreamSleepCycle: {
        alignItems: "center",
    }
})