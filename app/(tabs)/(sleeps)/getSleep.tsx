import { DateFormatter } from "@/utils/DateFormatter"
import { ListedDreamBySleepCycle } from "@/types/dream"
import { Screen } from "@/components/base/Screen"
import { SleepHumorType } from "@/types/sleepHumor"
import { SleepModel } from "@/types/sleeps"
import { StyleSheet, Text } from "react-native"
import { SyncContextProvider } from "@/contexts/SyncContext"
import { useEffect, useState } from "react"
import { useLocalSearchParams, useRouter } from "expo-router"
import BiologicalOccurencesInfoModal from "@/components/screens/sleeps/biologicalOccurencesInfoModal"
import Box from "@/components/base/Box"
import ConfirmRecordDeletion from "@/components/screens/general/ConfirmRecordDeletion"
import CustomButton from "@/components/customs/CustomButton"
import DreamListedByUser from "@/components/screens/dreams/DreamListedByUser"
import DreamService from "@/services/api/DreamService"
import IconFeather from "react-native-vector-icons/Feather"
import IconFontisto from "react-native-vector-icons/Fontisto"
import IconMaterialIcons from "react-native-vector-icons/MaterialIcons"
import Info from "@/components/base/Info"
import isNil from "@/utils/IsNill"
import Loading from "@/components/base/Loading"
import React from "react"
import SleepService from "@/services/api/SleepService"
import TextBold from "@/components/base/TextBold"

type GetSleepCycleParams = {
    id: string
}

export default function GetSleepScreen() {
    const router = useRouter()
    const { checkIsConnected } = SyncContextProvider()
    const { id } = useLocalSearchParams<GetSleepCycleParams>()
    const [ sleep, setSleep ] = useState<SleepModel | null>(null)
    const [ loading, setLoading ] = useState<boolean>(true)
    const [ errorMessage, setErrorMessage ] = useState<string>("")
    const [ openBiologicalOccurencesInfo, setOpenBiologicalOccurencesInfo ] = useState<boolean>(false)
    const [ loadingSleepDreams, setLoadingSleepDreams ] = useState<boolean>(true)
    const [ sleepDreams, setSleepDreams ] = useState<ListedDreamBySleepCycle[]>([])

    const fetchSleep = async () => {
        await SleepService.GetSleep(checkIsConnected(), { id: Number.parseInt(id) })
            .then(response => {
                if (response.Success) {
                    setSleep(response.Data)
                    return
                }
                setErrorMessage(response.ErrorMessage ?? "")
            })
            .finally(() => setLoading(false))
    }

    const fetchSleepDreams = async () => {
        await DreamService.ListBySleep(checkIsConnected(), { sleepId: Number.parseInt(id) })
            .then(response => {
                if (response.Success) setSleepDreams(response.Data)
            })
            .finally(() => setLoadingSleepDreams(false))
    }

    const deleteSleepCycleAction = async () => {
        setLoading(true)
        await SleepService.DeleteSleep(checkIsConnected(), { id: sleep!.id })
            .then(response => {
                if (response.Success) {
                    alert(response.Data)
                    router.navigate("/(tabs)/(sleeps)/sleepsList")
                    return
                }
                setLoading(false)
                alert(response.ErrorMessage)
            })
    }

    useEffect(() => {
        fetchSleep().then(async () => await fetchSleepDreams())
    }, [])

    const formatDate = (date: string) => {
        return {
            date: DateFormatter.removeTime(date),
            time: DateFormatter.removeDate(date),
        }
    }

    const renderSleepTime = (): JSX.Element => {
        if (isNil(sleep!.sleepTime) || sleep!.sleepTime == 0)
            return <></>
        else {
            const fixedSleepTime = Number.parseFloat(sleep!.sleepTime.toFixed(2))
            return (
                <Box.Row style={ styles.gap }>
                    <IconFeather name="clock" size={ 19 } color="white" />
                    <TextBold style={{ color: "white" }}>{ `${ fixedSleepTime } horas de sono` }</TextBold>
                </Box.Row>
            )
        }
    }

    const renderIsNightSleep = (): JSX.Element => {
        if (sleep!.isNightSleep)
            return (
                <Box.Row style={{ ...styles.gap, ...styles.center }}>
                    <IconFontisto name="night-clear" size={ 20 } />
                    <TextBold>Sono Noturno</TextBold>
                </Box.Row>
            )
        else
            return <></>
    }

    const extractHumors = (humor: SleepHumorType): string[] => {
        const humors: string[] = []
        if (humor.anxiety) humors.push("ansiedade")
        if (humor.calm) humors.push("calmaria")
        if (humor.drowsiness) humors.push("sonolência")
        if (humor.fear) humors.push("medo")
        if (humor.happiness) humors.push("felicidade")
        if (humor.other) humors.push("outro")
        if (humor.sadness) humors.push("tristeza")
        if (humor.tiredness) humors.push("cansaço")
        if (humor.undefinedHumor) humors.push("indefinido")
        return humors
    }

    const renderHumors = (isWakeUpHumor: boolean, humors: string[]) => {
        const sleepPeriod = isWakeUpHumor ? "acordar-se" : "deitar-se"
        const humorsStr = humors.length === 0
            ? `Nenhum humor definido ao ${ sleepPeriod }.`
            : humors.length === 1 && humors[0] === "indefinido"
                ? `Humor indefinido ao ${ sleepPeriod }.`
                : `Humores ao ${ sleepPeriod }:`

        return (
            <Box.Row style={ styles.humorsAndBiologicalOccurencesContainer }>
                <IconFeather name={ isWakeUpHumor ? "sunrise" : "sunset"} size={ 22 } />
                {
                    humors.length > 1
                        ? <>
                            <TextBold>{ humorsStr }</TextBold>
                            <Text>{ humors.join(", ") }</Text>
                        </>
                        : <TextBold>{ humorsStr }</TextBold>
                }
            </Box.Row>
        )
    }

    const renderBiologicalOccurences = () => {
        const biologicalOccurences: string[] = []
        if (sleep!.biologicalOccurences.sudorese) biologicalOccurences.push("sudorese")
        if (sleep!.biologicalOccurences.bruxismo) biologicalOccurences.push("bruxismo")
        if (sleep!.biologicalOccurences.apneiaDoSono) biologicalOccurences.push("apnéia do sono")
        if (sleep!.biologicalOccurences.ronco) biologicalOccurences.push("ronco")
        if (sleep!.biologicalOccurences.movimentosPeriodicosDosMembros) biologicalOccurences.push("movimentos periódicos dos membros")
        if (sleep!.biologicalOccurences.despertaresParciais) biologicalOccurences.push("despertares parciais")
        if (sleep!.biologicalOccurences.refluxoGastroesofagico) biologicalOccurences.push("refluxo gastroesofágico")
        if (sleep!.biologicalOccurences.sialorreia) biologicalOccurences.push("sialorreia")
        if (sleep!.biologicalOccurences.arritmias) biologicalOccurences.push("arritmias")
        if (sleep!.biologicalOccurences.mioclonia) biologicalOccurences.push("mioclonia")
        if (sleep!.biologicalOccurences.parassonia) biologicalOccurences.push("parassonia")
        if (sleep!.biologicalOccurences.epistaxe) biologicalOccurences.push("epistaxe")
        if (sleep!.biologicalOccurences.miccaoInvoluntaria) biologicalOccurences.push("micção involuntária")
        if (sleep!.biologicalOccurences.evacuacaoInvoluntaria) biologicalOccurences.push("evacuação involuntária")
        if (sleep!.biologicalOccurences.polucao) biologicalOccurences.push("polução")

        return biologicalOccurences.length === 0
            ? <Box.Row style={ styles.humorsAndBiologicalOccurencesContainer }>
                <IconMaterialIcons name="health-and-safety" size={ 22 } />
                <TextBold>Nenhuma ocorrência biológica registrada.</TextBold>
            </Box.Row>
            : <Box.Row style={ styles.humorsAndBiologicalOccurencesContainer }>
                <IconMaterialIcons name="health-and-safety" size={ 22 } />
                <TextBold>Ocorrências Biológicas:</TextBold>
                <Text>{ biologicalOccurences.join(", ") }</Text>
            </Box.Row>
    }

    const renderDreams = () => {
        if (loadingSleepDreams)
            return <Loading text="Buscando sonhos deste ciclo de sono..." onlyLoading={ false } />

        return (
            <Box.Column>
                {
                    sleepDreams.length === 0
                        ? <Text style={ styles.dreamsOfSleepCycleText }>Nenhum sonho cadastrado neste ciclo de sono.</Text>
                        : <>
                            <TextBold style={ styles.dreamsOfSleepCycleText }>Sonhos deste ciclo de sono:</TextBold>
                            <Box.Column style={ styles.sleepDreamsContainer }>
                                {
                                    sleepDreams.map((dream, i) =>
                                        <DreamListedByUser
                                            key={ i }
                                            dream={{
                                                date: sleep!.date,
                                                id: dream.id,
                                                tags: dream.tags.map(dreamTag => { return {"id": 0, "title": dreamTag} }),
                                                title: dream.title,
                                            }}
                                            sleepId={ sleep!.id }
                                            showDate={ false }
                                            redirectToTag={ false }
                                            titleSize={ 25 }
                                            isHiddenOrErotic={ dream.isHiddenOrErotic }
                                        />
                                    )
                                }
                            </Box.Column>
                        </>
                }
            </Box.Column>
        )
    }

    const renderSleepCycle = () => {
        if (loading)
            return <Loading text="Buscando ciclo de sono..." onlyLoading={ false } />

        if (errorMessage != "")
            return <Box.Column style={ styles.errorOnFetchSleep }>
                <Text>{ errorMessage }</Text>
                <CustomButton
                    title="Voltar"
                    onPress={ () => router.navigate("/(tabs)/(sleeps)/sleepsList") }
                />
            </Box.Column>

        const sleepStartFormatted = formatDate(sleep!.sleepStart)
        const sleepEndFormatted = formatDate(sleep!.sleepEnd)
        const wakeUpHumors = extractHumors(sleep!.wakeUpHumor)
        const layDownHumors = extractHumors(sleep!.layDownHumor)
        const wakeUpHumorsRendered = renderHumors(true, wakeUpHumors)
        const layDownHumorsRendered = renderHumors(false, layDownHumors)

        return <>
            { renderIsNightSleep() }
            <Box.Column style={{ ...styles.dateContainer, ...styles.center }}>
                <Info
                    infoDescription={ `Data referente ${ sleep!.date }` }
                    type="question"
                    modalTitle="Data do Sono"
                    modalDescription={[
                        "Se você iniciou seu sono ontem ou hoje até 12hrs, seu ciclo de sono se refere a ontem.",
                        "Se não, se refere ao dia de hoje.",
                        "Essa regra foi aplicada ao ciclo de sono visualizado agora.",
                    ]}
                    overrideInfoColor="white"
                    iconSize={ 22 }
                />
                { renderSleepTime() }
            </Box.Column>
            <Box.Column>
                <Box.Row style={ styles.gap }>
                    <TextBold>{ `Início:` }</TextBold>
                    <TextBold>{ sleepStartFormatted.date }</TextBold>
                    <TextBold>{ sleepStartFormatted.time }</TextBold>
                </Box.Row>
                <Box.Row style={ styles.gap }>
                    <TextBold>{ `Fim:   ` }</TextBold>
                    <TextBold>{ sleepEndFormatted.date }</TextBold>
                    <TextBold>{ sleepEndFormatted.time }</TextBold>
                </Box.Row>
            </Box.Column>
            { layDownHumorsRendered }
            { wakeUpHumorsRendered }
            { renderBiologicalOccurences() }
            <CustomButton
                title="Mais informações sobre ocorrências biológicas"
                onPress={ () => setOpenBiologicalOccurencesInfo(true) }
                titleStyle={{
                    fontSize: styles.biologicalOccurencesInfoBtn.fontSize,
                    fontWeight: "light",
                }}
            />
            <BiologicalOccurencesInfoModal
                visible={ openBiologicalOccurencesInfo }
                setVisible={ setOpenBiologicalOccurencesInfo }
            />
            { renderDreams() }
            <ConfirmRecordDeletion deletionAction={ async () => await deleteSleepCycleAction() } />
            <CustomButton
                title="Editar"
                onPress={ () => router.navigate({ pathname: "/(tabs)/(sleeps)/updateSleep", params: { id: sleep?.id }})}
                btnColor="orange"
                btnTextColor="orange"
            />
        </>
    }

    return (
        <Screen>
            <Box.Column style={ styles.container }>
                { renderSleepCycle() }
                <CustomButton
                    title="Voltar"
                    onPress={ () => router.navigate("/(tabs)/(sleeps)/sleepsList") }
                />
            </Box.Column>
        </Screen>
    )
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        gap: 10,
    },
    center: {
        alignItems: "center",
        justifyContent: "center",
    },
    dateContainer: {
        backgroundColor: "royalblue",
        padding: 10,
        borderRadius: 15,
        gap: 5,
        marginBottom: 10,
    },
    gap: {
        gap: 5,
    },
    humorsAndBiologicalOccurencesContainer: {
        flexWrap: "wrap",
        gap: 5,
    },
    biologicalOccurencesInfoBtn: {
        fontSize: 13,
    },
    errorOnFetchSleep: {
        gap: 15,
    },
    dreamsOfSleepCycleText: {
        alignSelf: "center",
        textAlign: "center",
        fontSize: 20,
    },
    sleepDreamsContainer: {
        paddingTop: 5,
        gap: 5,
    },
})