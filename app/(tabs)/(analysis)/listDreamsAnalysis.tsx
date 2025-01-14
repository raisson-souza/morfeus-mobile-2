import { DateFormatter } from "@/utils/DateFormatter"
import { Screen } from "@/components/base/Screen"
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
import MonthExtractor from "@/components/screens/general/MonthExtractor"
import React from "react"
import TextBold from "@/components/base/TextBold"

export default function ListDreamsAnalysisScreen() {
    const router = useRouter()
    const [ date, setDate ] = useState<Date>(DateFormatter.fixUTC(new Date().getTime()))
    const [ analysis, setAnalysis ] = useState<DreamAnalysisModel | null>(null)
    const [ loading, setLoading ] = useState<boolean>(true)
    const [ errorMessage, setErrorMessage ] = useState<string>("")

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
        }
    }

    const fetchCreateAnalysis = async () => {
        setLoading(true)
        const response = await AnalysisService.CreateDreamAnalysis({
            date: DateFormatter.forBackend.date(date.getTime())
        })

        if (response.Success)
            await fetchGetAnalysis()
        else
            setErrorMessage(response.ErrorMessage ?? "")

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
    }

    const refreshAnalysis = async () => {
        setLoading(true)
        setAnalysis(null)
        await fetchCreateAnalysis()
        setLoading(false)
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
                            fetchGetAnalysis()
                            setLoading(false)
                        }}
                    />
                    <CustomButton
                        title="Criar Análise"
                        onPress={ async () => fetchCreateAnalysis() }
                    />
                </Box.Column>
            )
        }

        const _renderIconMessage = (
            iconName: string,
            msg: string,
            iconLib: "fontAwesome5" | "materialIcons" = "fontAwesome5"
        ) => {
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

        const renderMostPointOfViewOccurence = () => {
            switch (analysis!.mostPointOfViewOccurence) {
                case 1:
                    return _renderIconMessage("user", "Perspectiva: Primeira pessoa")
                case 2:
                    return _renderIconMessage("user", "Perspectiva: Segunda pessoa")
                case 3:
                    return _renderIconMessage("user", "Perspectiva: Terceira pessoa")
                default:
                    return _renderIconMessage("user", "Perspectiva: Primeira pessoa")
            }
        }

        const renderMostClimateOccurence = () => {
            if (analysis!.mostClimateOccurence === "multiplos")
                return _renderIconMessage("cloud-sun-rain", "Múltiplos climas")
            else if (analysis!.mostClimateOccurence === "outro")
                return _renderIconMessage("cloud-sun-rain", "Outros climas")
            else if (analysis!.mostClimateOccurence === "indefinido")
                return _renderIconMessage("cloud-sun-rain", "Clima indefinido")
            else {
                const message = `${ analysis!.mostClimateOccurence.charAt(0).toUpperCase() }${ analysis!.mostClimateOccurence.slice(1) }`
                return _renderIconMessage("cloud-sun-rain", `Clima: ${ message }`)
            }
        }

        const renderMostHourOccurence = () => {
            return _renderIconMessage("clock", `Horário: ${ analysis!.mostHourOccurence }`)
        }

        const renderMostDurationOccurence = () => {
            return _renderIconMessage("hourglass", `Duração: ${ analysis!.mostDurationOccurence }`)
        }

        const renderMostLucidityLevelOccurence = () => {
            return _renderIconMessage("beer", `Nível de Lucidez: ${ analysis!.mostLucidityLevelOccurence }`)
        }

        const renderMostDreamTypeOccurence = () => {
            return _renderIconMessage("dot-circle", `Tipo: ${ analysis!.mostDreamTypeOccurence }`)
        }

        const renderMostRealityLevelOccurenceOccurence = () => {
            return _renderIconMessage("check-circle", `Nível de Realidade: ${ analysis!.mostRealityLevelOccurenceOccurence }`)
        }

        const renderEroticDreamsAverage = () => {
            return _renderIconMessage("18-up-rating", `Sonhos eróticos: ${ analysis!.eroticDreamsAverage }`, "materialIcons")
        }

        const renderTagPerDreamAverage = () => {
            return _renderIconMessage("tag", `Tags por sonho: ${ analysis!.tagPerDreamAverage }`)
        }

        const renderLongestDreamTitle = () => {
            return _renderIconMessage("title", `Título mais longo: ${ analysis!.longestDreamTitle }`, "materialIcons")
        }

        const renderUpdatedAt = () => {
            if (analysis.updatedAt)
                return <TextBold>Última atualização da análise: { analysis!.updatedAt }</TextBold>
            return <></>
        }

        return (
            <Box.Column style={ styles.analysisContainer }>
                <TextBold>Análises obtidas dos sonhos cadastrados no mês escolhido:</TextBold>
                <Box.Column style={ styles.groupAnalysisContainer }>
                    <TextBold>Maiores ocorrências:</TextBold>
                    { renderMostPointOfViewOccurence() }
                    { renderMostClimateOccurence() }
                    { renderMostHourOccurence() }
                    { renderMostDurationOccurence() }
                    { renderMostLucidityLevelOccurence() }
                    { renderMostDreamTypeOccurence() }
                    { renderMostRealityLevelOccurenceOccurence() }
                </Box.Column>
                <Box.Column style={ styles.groupAnalysisContainer }>
                    <TextBold>Médias:</TextBold>
                    { renderEroticDreamsAverage() }
                    { renderTagPerDreamAverage() }
                </Box.Column>
                <Box.Column style={ styles.groupAnalysisContainer }>
                    <TextBold>Diversos:</TextBold>
                    { renderLongestDreamTitle() }
                </Box.Column>
                { renderUpdatedAt() }
            </Box.Column>
        )
    }

    // TODO: Componente de Header com MonthExtractor, botão de ação customizada e botão de navegação.

    return (
        <Screen>
            <Box.Column style={ styles.container }>
                <Box.Row style={ styles.header }>
                    <MonthExtractor
                        initialDate={ date }
                        onChange={ async (e) => await updateDate(e) }
                    />
                    <Box.Column>
                        <CustomButton
                            title="Voltar"
                            onPress={ () => router.navigate("/(tabs)/(analysis)/analysisHome") }
                        />
                        <CustomButton
                            title="Atualizar"
                            onPress={ async () => await refreshAnalysis() }
                        />
                    </Box.Column>
                </Box.Row>
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
    header: {
        width: "100%",
        justifyContent: 'space-between',
        alignItems: "center",
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