import { DateFormatter } from "@/utils/DateFormatter"
import { Screen } from "@/components/base/Screen"
import { SleepAnalysisModel } from "@/types/sleepAnalysis"
import { StyleSheet } from "react-native"
import { useEffect, useState } from "react"
import { useRouter } from "expo-router"
import AnalysisService from "@/services/api/AnalysisService"
import Box from "@/components/base/Box"
import CustomButton from "@/components/customs/CustomButton"
import IconFontAwesome5 from "react-native-vector-icons/FontAwesome5"
import IconMaterialIcons from "react-native-vector-icons/MaterialIcons"
import Info from "@/components/base/Info"
import Loading from "@/components/base/Loading"
import MonthExtractorHeader from "@/components/screens/general/MonthExtractorHeader"
import React from "react"
import SleepHumorTranslator from "@/utils/SleepHumorTranslator"
import TextBold from "@/components/base/TextBold"

type DisableFetchActions = {
    get: boolean
    create: boolean
}

export default function ListSleepsAnalysisScreen() {
    const router = useRouter()
    const [ date, setDate ] = useState<Date>(DateFormatter.fixUTC(new Date().getTime()))
    const [ analysis, setAnalysis ] = useState<SleepAnalysisModel | null>(null)
    const [ loading, setLoading ] = useState<boolean>(true)
    const [ errorMessage, setErrorMessage ] = useState<string>("")
    const [ disableFetchActions, setDisableFetchActions ] = useState<DisableFetchActions>({
        get: false,
        create: false,
    })

    const fetchGetAnalysis = async (fetchDate?: Date) => {
        const response = await AnalysisService.GetSleepAnalysis({
            date: DateFormatter.forBackend.date(fetchDate?.getTime() ?? date.getTime())
        })

        if (response.Success) {
            setAnalysis(response.Data)
        }
        else {
            if (response.Status === 404)
                setErrorMessage("Não há análise criada para este mês, crie uma.")
            else
                setErrorMessage(response.ErrorMessage ?? "")
            setDisableFetchActions({ get: true, create: disableFetchActions.create })
        }
    }

    const fetchCreateAnalysis = async () => {
        setLoading(true)
        const response = await AnalysisService.CreateSleepAnalysis({
            date: DateFormatter.forBackend.date(date.getTime())
        })

        if (response.Success)
            await fetchGetAnalysis()
        else {
            setErrorMessage(response.ErrorMessage ?? "")
            setDisableFetchActions({ get: disableFetchActions.get, create: true })
        }

        setLoading(false)
    }

    useEffect(() => {
        fetchGetAnalysis()
        setLoading(false)
    }, [])

    const updateDate = async (newDate: Date) => {
        setLoading(true)
        setAnalysis(null)
        setDate(newDate)
        await fetchGetAnalysis(newDate)
        setLoading(false)
        setDisableFetchActions({ get: false, create: false })
    }

    const refreshAnalysis = async () => {
        setLoading(true)
        setAnalysis(null)
        await fetchCreateAnalysis()
        setLoading(false)
        setDisableFetchActions({ get: false, create: false })
    }

    const renderAnalysis = () => {
        if (!analysis) {
            return (
                <Box.Column style={ styles.analysisContainer }>
                    <TextBold>{ errorMessage }</TextBold>
                    <CustomButton
                        title="Buscar Análise"
                        onPress={ async () => {
                            setLoading(true)
                            await fetchGetAnalysis()
                            setLoading(false)
                        }}
                        active={ !disableFetchActions.get }
                    />
                    <CustomButton
                        title="Criar Análise"
                        onPress={ async () => {
                            setLoading(true)
                            await fetchCreateAnalysis()
                            setLoading(false)
                        }}
                        active={ !disableFetchActions.create }
                    />
                </Box.Column>
            )
        }

        const renderIndividualAnalysis = (
            info: string | number | null,
            msg: string,
            iconName: string,
            iconLib: "fontAwesome5" | "materialIcons" = "fontAwesome5",
        ) => {
            if (info === null) return <></>

            if (typeof info === "number") {
                if (info === 0) return <></>
            }

            if (typeof info === "string") {
                if (info === "null" || info === "0" || info === "0.00")
                    return <></>
            }

            return (
                <Box.Row style={ styles.individualAnalysis }>
                    {
                        iconLib === "fontAwesome5"
                            ? <IconFontAwesome5 name={ iconName } size={ 20 } />
                            : <IconMaterialIcons name={ iconName } size={ 20 } />
                    }
                    <TextBold>{ msg }</TextBold>
                </Box.Row>
            )
        }

        const {
            dreamsCount,
            goodWakeUpHumorPercentage,
            badWakeUpHumorPercentage,
            goodLayDownHumorPercentage,
            badLayDownHumorPercentage,
            mostFrequentWakeUpHumor,
            leastFrequentWakeUpHumor,
            mostFrequentLayDownHumor,
            leastFrequentLayDownHumor,
            mostFrequentBiologicalOccurence,
            leastFrequentBiologicalOccurence,
            mostSleepDuration,
            leastSleepDuration,
            averageDreamPerSleep,
            sleepDurationAverage,
            mostDreamsPerSleepDate,
            updatedAt,
        } = analysis

        const renderGeneralStatisticsAnalysis = () => {
            if (dreamsCount != 0 || mostSleepDuration != 0 || leastSleepDuration != 0 || averageDreamPerSleep != 0 || sleepDurationAverage != 0) {
                return (
                    <Box.Column style={ styles.groupAnalysisContainer }>
                        <TextBold>Estatísticas gerais:</TextBold>
                        { renderIndividualAnalysis(dreamsCount, `Quantidade de sonhos: ${ dreamsCount }`, "cloud-meatball") }
                        { renderIndividualAnalysis(mostSleepDuration, `Maior duração de sono: ${ mostSleepDuration } horas`, "cloud") }
                        { renderIndividualAnalysis(leastSleepDuration, `Menor duração de sono: ${ leastSleepDuration } horas`, "cloud") }
                        { renderIndividualAnalysis(averageDreamPerSleep, `Média de sonho por ciclo de sono: ${ averageDreamPerSleep }`, "cloud-moon") }
                        { renderIndividualAnalysis(sleepDurationAverage, `Média de tempo de sono: ${ sleepDurationAverage } horas`, "bed") }
                    </Box.Column>
                )
            }
            return <></>
        }

        const renderHumorPercentagesAnalysis = () => {
            if (goodWakeUpHumorPercentage != 0 || badWakeUpHumorPercentage != 0 || goodLayDownHumorPercentage != 0 ||badLayDownHumorPercentage != 0) {
                return (
                    <Box.Column style={ styles.groupAnalysisContainer }>
                        <TextBold>Porcentagens sobre humores:</TextBold>
                        { renderIndividualAnalysis(goodWakeUpHumorPercentage, `Bom humor ao acordar: ${ goodWakeUpHumorPercentage }%`, "mood", "materialIcons") }
                        { renderIndividualAnalysis(badWakeUpHumorPercentage, `Mau humor ao acordar: ${ badWakeUpHumorPercentage }%`, "mood-bad", "materialIcons") }
                        { renderIndividualAnalysis(goodLayDownHumorPercentage, `Bom humor ao dormir: ${ goodLayDownHumorPercentage }%`, "mood", "materialIcons") }
                        { renderIndividualAnalysis(badLayDownHumorPercentage, `Mau humor ao dormir: ${ badLayDownHumorPercentage }%`, "mood-bad", "materialIcons") }
                    </Box.Column>
                )
            }
            return <></>
        }

        const renderHumorFrequencesAnalysis = () => {
            if (mostFrequentWakeUpHumor || leastFrequentWakeUpHumor || mostFrequentLayDownHumor || leastFrequentLayDownHumor) {
                return (
                    <Box.Column style={ styles.groupAnalysisContainer }>
                        <TextBold>Frequência de humores:</TextBold>
                        { renderIndividualAnalysis(mostFrequentWakeUpHumor, `Humor ao acordar mais frequente: ${ SleepHumorTranslator(mostFrequentWakeUpHumor) }`, "sun") }
                        { renderIndividualAnalysis(leastFrequentWakeUpHumor, `Humor ao acordar menos frequente: ${ SleepHumorTranslator(leastFrequentWakeUpHumor) }`, "sun") }
                        { renderIndividualAnalysis(mostFrequentLayDownHumor, `Humor ao dormir mais frequente: ${ SleepHumorTranslator(mostFrequentLayDownHumor) }`, "moon") }
                        { renderIndividualAnalysis(leastFrequentLayDownHumor, `Humor ao dormir menos frequente: ${ SleepHumorTranslator(leastFrequentLayDownHumor) }`, "moon") }
                    </Box.Column>
                )
            }
            return <></>
        }

        const renderBiologicalOccurencesFrequencesAnalysis = () => {
            if (mostFrequentBiologicalOccurence || leastFrequentBiologicalOccurence) {
                return (
                    <Box.Column style={ styles.groupAnalysisContainer }>
                        <TextBold>Frequência sobre ocorrências biológicas:</TextBold>
                        { renderIndividualAnalysis(mostFrequentBiologicalOccurence, `Ocorrência biológica mais frequente: ${ mostFrequentBiologicalOccurence }`, "health-and-safety", "materialIcons") }
                        { renderIndividualAnalysis(leastFrequentBiologicalOccurence, `Ocorrência biológica menos frequente: ${ leastFrequentBiologicalOccurence }`, "health-and-safety", "materialIcons") }
                    </Box.Column>
                )
            }
            return <></>
        }

        const renderOtherStatistcisAnalysis = () => {
            if (mostDreamsPerSleepDate) {
                return (
                    <Box.Column style={ styles.groupAnalysisContainer }>
                        <TextBold>Estatísticas diversas:</TextBold>
                        { renderIndividualAnalysis(mostDreamsPerSleepDate, `Data do ciclo de sono com maior ocorrência de sonhos: ${ mostDreamsPerSleepDate }`, "calendar-day") }
                    </Box.Column>
                )
            }
            return <></>
        }

        const renderUpdatedAt = () => {
            return updatedAt === null
                ? <></>
                : (
                    <Box.Row>
                        { renderIndividualAnalysis(1, `Análise última vez atualizada: ${ DateFormatter.removeTime(updatedAt as any) }`, "calendar-day") }
                    </Box.Row>
                )
        }

        return (
            <Box.Column style={ styles.analysisContainer }>
                <TextBold>Análises obtidas dos ciclos de sono cadastrados no mês escolhido:</TextBold>
                { renderGeneralStatisticsAnalysis() }
                { renderHumorPercentagesAnalysis() }
                { renderHumorFrequencesAnalysis() }
                { renderBiologicalOccurencesFrequencesAnalysis() }
                { renderOtherStatistcisAnalysis() }
                { renderUpdatedAt() }
            </Box.Column>
        )
    }

    return (
        <Screen>
            <Box.Column style={ styles.container }>
                <MonthExtractorHeader
                    monthExtractorProps={{
                        initialDate: date,
                        onChange: async (e) => await updateDate(e),
                    }}
                    customActionBtnTitle="Atualizar"
                    customActionBtnAction={ async () => await refreshAnalysis() }
                    isCustomActionBtnActive={ !disableFetchActions.get || !disableFetchActions.create }
                    routerBtnRouterAction={ () => router.navigate("/(tabs)/(analysis)/analysisHome") }
                />
                {
                    loading
                        ? <Loading onlyLoading={ false } text="Buscando análise de sonhos..." />
                        : renderAnalysis()
                }
                <Info
                    type="warn"
                    overrideInfoColor="black"
                    infoDescription="Mais análises?"
                    modalTitle="Novas Análises"
                    modalDescription={[
                        "Se desejar, dê sugestões de estatísticas ou outros dados que você considera relevante em uma análise de sonhos.",
                        "Realize sua sugestão no local apropriado na aplicação.",
                    ]}
                />
            </Box.Column>
        </Screen>
    )
}

const styles = StyleSheet.create({
    container: {
        width: "100%",
        gap: 15,
    },
    analysisContainer: {
        gap: 10,
    },
    groupAnalysisContainer: {
        gap: 3,
    },
    individualAnalysis: {
        paddingLeft: 10,
        gap: 5,
        alignItems: "center",
    },
})