import { DateFormatter } from "@/utils/DateFormatter"
import { ListedDreamBySleepCycle } from "@/types/dream"
import { DateTime } from "luxon"
import { Screen } from "@/components/base/Screen"
import { SleepHumorType } from "@/types/sleepHumor"
import { SleepModel } from "@/types/sleeps"
import { StyleContextProvider } from "@/contexts/StyleContext"
import { Alert, StyleSheet } from "react-native"
import { SyncContextProvider } from "@/contexts/SyncContext"
import { useEffect, useState } from "react"
import { useLocalSearchParams, useRouter } from "expo-router"
import BiologicalOccurencesInfoModal from "@/components/screens/sleeps/biologicalOccurencesInfoModal"
import Box from "@/components/base/Box"
import ConfirmRecordDeletion from "@/components/screens/general/ConfirmRecordDeletion"
import CustomButton from "@/components/customs/CustomButton"
import CustomText from "@/components/customs/CustomText"
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
import WeekDayParser from "@/utils/WeekDayParser"

type GetSleepCycleParams = {
    id: string
}

export default function GetSleepScreen() {
    const { systemStyle } = StyleContextProvider()
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
                    Alert.alert(response.Data)
                    router.navigate("/(tabs)/(sleeps)/sleepsList")
                    return
                }
                setLoading(false)
                Alert.alert("Erro ao deletar ciclo de sono", response.ErrorMessage)
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
                <Box.Row style={ styles.sleepHoursContainer }>
                    <IconFeather
                        name="clock"
                        size={ systemStyle.normalIconSize }
                        color={ systemStyle.oppositeIconColor }
                    />
                    <CustomText
                        isOpposite
                        size="s"
                        weight="thin"
                    >
                        { `${ fixedSleepTime } horas de sono` }
                    </CustomText>
                </Box.Row>
            )
        }
    }

    const renderIsNightSleep = (): JSX.Element => {
        if (sleep!.isNightSleep)
            return (
                <Box.Row style={{ ...styles.gap, ...styles.center }}>
                    <IconFontisto
                        name="night-clear"
                        size={ systemStyle.normalIconSize }
                        color={ systemStyle.iconColor }
                    />
                    <CustomText
                        weight="thin"
                    >
                        Sono Noturno
                    </CustomText>
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
            <Box.Row
                style={{
                    ...styles.humorsAndBiologicalOccurencesContainer,
                    ...styles.sleepCharacteristicsContainer,
                    backgroundColor: systemStyle.terciary,
                }}
            >
                <IconFeather
                    name={ isWakeUpHumor ? "sunrise" : "sunset"}
                    size={ systemStyle.normalIconSize }
                    color={ systemStyle.oppositeIconColor }
                />
                {
                    humors.length > 1
                        ? <>
                            <CustomText
                                size="s"
                                weight="bold"
                                isOpposite
                            >
                                { humorsStr }
                            </CustomText>
                            <CustomText
                                size="s"
                                weight="thin"
                                isOpposite
                            >
                                { humors.join(", ") }
                            </CustomText>
                        </>
                        : <CustomText
                            size="s"
                            weight="thin"
                            isOpposite
                        >
                            { humorsStr }
                        </CustomText>
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
            ? <Box.Row
                style={{
                    ...styles.humorsAndBiologicalOccurencesContainer,
                    ...styles.sleepCharacteristicsContainer,
                    backgroundColor: systemStyle.terciary,
                }}
            >
                <IconMaterialIcons
                    name="health-and-safety"
                    size={ systemStyle.normalIconSize }
                    color={ systemStyle.oppositeIconColor }
                />
                <CustomText isOpposite>Nenhuma ocorrência biológica registrada.</CustomText>
            </Box.Row>
            : <Box.Row
                style={{
                    ...styles.humorsAndBiologicalOccurencesContainer,
                    ...styles.sleepCharacteristicsContainer,
                    backgroundColor: systemStyle.terciary,
                }}
            >
                <IconMaterialIcons
                    name="health-and-safety"
                    size={ systemStyle.normalIconSize }
                    color={ systemStyle.oppositeIconColor }
                />
                <CustomText
                    size="s"
                    weight="bold"
                    isOpposite
                >
                    Ocorrências Biológicas:
                </CustomText>
                <CustomText
                    weight="thin"
                    size="s"
                    isOpposite
                >
                    { biologicalOccurences.join(", ") }
                </CustomText>
            </Box.Row>
    }

    const renderDreams = () => {
        if (loadingSleepDreams)
            return <Loading text="Buscando sonhos deste ciclo de sono..." onlyLoading={ false } />

        return (
            <Box.Column>
                {
                    sleepDreams.length === 0
                        ? <CustomText
                            weight="thin"
                            style={ styles.dreamsOfSleepCycleText }
                        >
                            Nenhum sonho cadastrado neste ciclo de sono.
                        </CustomText>
                        : <>
                            <CustomText style={ styles.dreamsOfSleepCycleText }>Sonhos deste ciclo de sono:</CustomText>
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
                <CustomText>{ errorMessage }</CustomText>
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

        const renderWeekDay = () => {
            try {
                const weekDay = DateTime.fromISO(sleep!.date).weekday
                return WeekDayParser(weekDay, true)
            }
            catch {
                return "Data referente"
            }
        }

        return <>
            { renderIsNightSleep() }
            <Box.Column
                style={{
                    ...styles.dateContainer,
                    ...styles.center,
                    backgroundColor: systemStyle.secondary
                }}
            >
                <Info
                    infoDescription={ `${ renderWeekDay() } ${ sleep!.date }` }
                    type="question"
                    modalTitle="Data do Sono"
                    modalDescription={[
                        "Se você iniciou seu sono ontem ou hoje até 12hrs, seu ciclo de sono se refere a ontem.",
                        "Se não, se refere ao dia de hoje.",
                        "Essa regra foi aplicada ao ciclo de sono visualizado agora.",
                    ]}
                    overrideInfoColor={ systemStyle.oppositeIconColor}
                />
                { renderSleepTime() }
            </Box.Column>
            <Box.Column>
                <Box.Row style={{ ...styles.gap, ...styles.sleepPeriodIndividualContainer }}>
                    <CustomText
                        size="s"
                        weight="bold"
                    >
                        { `Início:` }
                    </CustomText>
                    <CustomText weight="thin" selectable>
                        { sleepStartFormatted.date }
                    </CustomText>
                    <CustomText weight="thin" selectable>
                        { sleepStartFormatted.time }
                    </CustomText>
                </Box.Row>
                <Box.Row style={{ ...styles.gap, ...styles.sleepPeriodIndividualContainer }}>
                    <CustomText
                        size="s"
                        weight="bold"
                    >
                        { `Fim:   ` }
                    </CustomText>
                    <CustomText weight="thin" selectable>
                        { sleepEndFormatted.date }
                    </CustomText>
                    <CustomText weight="thin" selectable>
                        { sleepEndFormatted.time }
                    </CustomText>
                </Box.Row>
            </Box.Column>
            { layDownHumorsRendered }
            { wakeUpHumorsRendered }
            { renderBiologicalOccurences() }
            <CustomButton
                title="Mais informações sobre ocorrências biológicas"
                onPress={ () => setOpenBiologicalOccurencesInfo(true) }
                titleStyle={{
                    fontSize: systemStyle.normalTextSize,
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
        alignItems: "center",
    },
    errorOnFetchSleep: {
        gap: 15,
    },
    dreamsOfSleepCycleText: {
        alignSelf: "center",
        textAlign: "center",
    },
    sleepDreamsContainer: {
        paddingTop: 5,
        gap: 5,
    },
    sleepHoursContainer: {
        gap: 10,
        alignItems: "center",
    },
    sleepPeriodIndividualContainer: {
        alignItems: "center",
    },
    sleepCharacteristicsContainer: {
        padding: 10,
        borderRadius: 15,
    },
})