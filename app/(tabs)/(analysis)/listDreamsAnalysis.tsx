import { DateFormatter } from "@/utils/DateFormatter"
import { Screen } from "@/components/base/Screen"
import { StyleContextProvider } from "@/contexts/StyleContext"
import { StyleSheet } from "react-native"
import { useEffect, useState } from "react"
import { useRouter } from "expo-router"
import AnalysisService from "@/services/api/AnalysisService"
import Box from "@/components/base/Box"
import CustomButton from "@/components/customs/CustomButton"
import CustomText from "@/components/customs/CustomText"
import IconFontAwesome5 from "react-native-vector-icons/FontAwesome5"
import IconMaterialIcons from "react-native-vector-icons/MaterialIcons"
import Info from "@/components/base/Info"
import isNil from "@/utils/IsNill"
import Loading from "@/components/base/Loading"
import MonthExtractorHeader from "@/components/screens/general/MonthExtractorHeader"
import React from "react"

type DisableFetchActions = {
    get: boolean
    create: boolean
}

export default function ListDreamsAnalysisScreen() {
    const { systemStyle } = StyleContextProvider()
    const router = useRouter()
    const [ date, setDate ] = useState<Date>(DateFormatter.fixUTC(new Date().getTime()))
    const [ analysis, setAnalysis ] = useState<DreamAnalysisModel | null>(null)
    const [ loading, setLoading ] = useState<boolean>(true)
    const [ errorMessage, setErrorMessage ] = useState<string>("")
    const [ disableFetchActions, setDisableFetchActions ] = useState<DisableFetchActions>({
        get: false,
        create: false,
    })

    const fetchGetAnalysis = async (fetchDate?: Date) => {
        const response = await AnalysisService.GetDreamAnalysis({
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
        const response = await AnalysisService.CreateDreamAnalysis({
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
                    <CustomText>{ errorMessage }</CustomText>
                    <CustomButton
                        title="Buscar Análise"
                        onPress={ async () => {
                            setLoading(true)
                            fetchGetAnalysis()
                            setLoading(false)
                        }}
                        active={ !disableFetchActions.get }
                    />
                    <CustomButton
                        title="Criar Análise"
                        onPress={ async () => fetchCreateAnalysis() }
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
                    <CustomText weight="thin">{ msg }</CustomText>
                </Box.Row>
            )
        }

        const {
            mostPointOfViewOccurence,
            mostClimateOccurence,
            mostHourOccurence,
            mostDurationOccurence,
            mostLucidityLevelOccurence,
            mostDreamTypeOccurence,
            mostRealityLevelOccurenceOccurence,
            eroticDreamsAverage,
            tagPerDreamAverage,
            longestDreamTitle,
            updatedAt,
        } = analysis

        const renderMostPointOfViewOccurence = () => {
            switch (mostPointOfViewOccurence) {
                case 1:
                    return renderIndividualAnalysis(1, "Perspectiva: Primeira pessoa",  "user")
                case 2:
                    return renderIndividualAnalysis(2, "Perspectiva: Segunda pessoa", "user")
                case 3:
                    return renderIndividualAnalysis(3, "Perspectiva: Terceira pessoa", "user")
                default:
                    return renderIndividualAnalysis(1, "Perspectiva: Primeira pessoa", "user")
            }
        }

        const renderMostClimateOccurence = () => {
            if (mostClimateOccurence === "multiplos")
                return renderIndividualAnalysis(mostClimateOccurence, "Múltiplos climas", "cloud-sun-rain")
            else if (mostClimateOccurence === "outro")
                return renderIndividualAnalysis(mostClimateOccurence, "Outros climas", "cloud-sun-rain")
            else if (mostClimateOccurence === "indefinido")
                return renderIndividualAnalysis(mostClimateOccurence, "Clima indefinido", "cloud-sun-rain")
            else {
                const message = `Clima: ${ mostClimateOccurence.charAt(0).toUpperCase() }${ mostClimateOccurence.slice(1) }`
                return renderIndividualAnalysis(mostClimateOccurence, message, "cloud-sun-rain")
            }
        }

        const renderMostOccurencesAnalysis = () => {
            return (
                <Box.Column style={ styles.groupAnalysisContainer }>
                    <CustomText
                        weight="bold"
                        size="l"
                    >
                        Maiores ocorrências:
                    </CustomText>
                    { renderMostPointOfViewOccurence() }
                    { renderMostClimateOccurence() }
                    { renderIndividualAnalysis(mostHourOccurence, `Horário: ${ mostHourOccurence }`, "clock") }
                    { renderIndividualAnalysis(mostDurationOccurence, `Duração: ${ mostDurationOccurence }`, "hourglass") }
                    { renderIndividualAnalysis(mostLucidityLevelOccurence, `Nível de Lucidez: ${ mostLucidityLevelOccurence }`, "beer") }
                    { renderIndividualAnalysis(mostDreamTypeOccurence, `Tipo: ${ mostDreamTypeOccurence }`, "dot-circle") }
                    { renderIndividualAnalysis(mostRealityLevelOccurenceOccurence, `Nível de Realidade: ${ mostRealityLevelOccurenceOccurence }`, "check-circle") }
                </Box.Column>
            )
        }

        const renderAveragesAnalysis = () => {
            if (eroticDreamsAverage != 0 || tagPerDreamAverage != 0) {
                return (
                    <Box.Column style={ styles.groupAnalysisContainer }>
                        <CustomText
                            weight="bold"
                            size="l"
                        >
                            Médias:
                        </CustomText>
                        { renderIndividualAnalysis(eroticDreamsAverage, `Sonhos eróticos: ${ eroticDreamsAverage }%`, "18-up-rating", "materialIcons") }
                        { renderIndividualAnalysis(tagPerDreamAverage, `Tags por sonho: ${ tagPerDreamAverage }`, "tag") }
                    </Box.Column>
                )
            }
            return <></>

        }

        const renderSeveralsAnalysis = () => {
            if (!isNil(longestDreamTitle)) {
                return (
                    <Box.Column style={ styles.groupAnalysisContainer }>
                        <CustomText
                            weight="bold"
                            size="l"
                        >
                            Diversos:
                        </CustomText>
                        { renderIndividualAnalysis(longestDreamTitle, `Título mais longo: ${ longestDreamTitle }`, "title", "materialIcons") }
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

        // TODO: Futuramente, criar componentes genéricos externos para uso nas análises de ciclo de sono
        // e sonho (recriar externamente renderIndividualAnalysis e criar externamente por exemplo renderGroupAnalysis)

        return (
            <Box.Column style={ styles.analysisContainer }>
                <CustomText
                    size="xl"
                    weight="bold"
                >
                    Análises obtidas dos sonhos cadastrados no mês escolhido:
                </CustomText>
                { renderMostOccurencesAnalysis() }
                { renderAveragesAnalysis() }
                { renderSeveralsAnalysis() }
                { renderUpdatedAt() }
            </Box.Column>
        )
    }

    return (
        <Screen>
            <Box.Column style={ styles.container }>
                <MonthExtractorHeader
                    defaultDate={ date }
                    onChange={ async (e) => await updateDate(e) }
                    routerBtnRouterAction={ () => router.navigate("/(tabs)/(analysis)/analysisHome") }
                    firstCustomBtn={{
                        title: "Atualizar",
                        action: async () => await refreshAnalysis(),
                        active: !disableFetchActions.get || !disableFetchActions.create,
                    }}
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