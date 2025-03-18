import { DateFormatter } from "@/utils/DateFormatter"
import { Screen } from "@/components/base/Screen"
import { Alert, StyleSheet } from "react-native"
import { SyncContextProvider } from "@/contexts/SyncContext"
import { UpdateSleepCycleModel } from "@/types/sleeps"
import { useEffect, useState } from "react"
import { useLocalSearchParams, useRouter } from "expo-router"
import BiologicalOccurencesForm from "@/components/screens/sleeps/BiologicalOccurencesForm"
import Box from "@/components/base/Box"
import CustomButton from "@/components/customs/CustomButton"
import CustomText from "@/components/customs/CustomText"
import HumorsForm from "@/components/screens/sleeps/HumorsForm"
import Loading from "@/components/base/Loading"
import React from "react"
import SleepCycleHoursForm from "@/components/screens/sleeps/SleepCycleHoursForm"
import SleepService from "@/services/api/SleepService"

type UpdateSleepParams = {
    id: string
}

export default function UpdateSleepScreen() {
    const router = useRouter()
    const { id } = useLocalSearchParams<UpdateSleepParams>()
    const { checkIsConnected } = SyncContextProvider()
    const [ loading, setLoading ] = useState<boolean>(true)
    const [ sleep, setSleep ] = useState<UpdateSleepCycleModel | null>(null)
    const [ errorOnFetch, setErrorOnFetch ] = useState<boolean>(false)

    const fetchSleep = async () => {
        await SleepService.GetSleep(checkIsConnected(), { id: Number.parseInt(id) })
            .then(response => {
                if (response.Success) {
                    setSleep({
                        id: Number.parseInt(id),
                        sleepStart: DateFormatter.fixUTC(new Date(response.Data.sleepStart).getTime()),
                        sleepEnd: DateFormatter.fixUTC(new Date(response.Data.sleepEnd).getTime()),
                        wakeUpHumor: response.Data.wakeUpHumor,
                        layDownHumor: response.Data.layDownHumor,
                        biologicalOccurences: response.Data.biologicalOccurences,
                        dreams: [],
                    })
                    return
                }
                setErrorOnFetch(true)
                Alert.alert("Erro ao buscar ciclo de sono", response.ErrorMessage)
            })
            .finally(() => setLoading(false))
    }

    const updateSleep = async () => {
        await SleepService.Update(checkIsConnected(), {
            id: Number.parseInt(id),
            sleep: {
                sleepStart: DateFormatter.forBackend.timestamp(sleep!.sleepStart.getTime()),
                sleepEnd: DateFormatter.forBackend.timestamp(sleep!.sleepEnd.getTime()),
                wakeUpHumor: sleep!.wakeUpHumor,
                layDownHumor: sleep!.layDownHumor,
                biologicalOccurences: sleep!.biologicalOccurences,
                dreams: [],
            },
        })
            .then(response => {
                if (response.Success) {
                    Alert.alert(response.Data)
                    router.navigate({ pathname: "/(tabs)/(sleeps)/getSleep", params: { id: sleep?.id }})
                    return
                }
                Alert.alert("Erro ao atualizar ciclo de sono", response.ErrorMessage)
            })
    }

    useEffect(() => {
        fetchSleep()
    }, [])

    const renderSleepCycle = () => {
        if (loading)
            return <Loading text="Buscando ciclo de sono..." onlyLoading={ false } />
        
        if (errorOnFetch)
            return <CustomText weight="bold">Ocorreu um erro ao buscar o ciclo de sono</CustomText>

        return <>
            <SleepCycleHoursForm
                sleepStart={ sleep!.sleepStart }
                sleepEnd={ sleep!.sleepEnd }
                onChange={ (type, e) => setSleep({
                    ...sleep!,
                    sleepStart: type === "start" ? e : sleep!.sleepStart,
                    sleepEnd: type === "end" ? e : sleep!.sleepEnd,
                })}
            />
            <HumorsForm
                title="Humores ao dormir"
                value={ sleep!.layDownHumor }
                onChange={ (e) => setSleep({
                    ...sleep!,
                    layDownHumor: e,
                })}
            />
            <HumorsForm
                title="Humores ao acordar"
                value={ sleep!.wakeUpHumor }
                onChange={ (e) => setSleep({
                    ...sleep!,
                    wakeUpHumor: e,
                })}
            />
            <BiologicalOccurencesForm
                value={ sleep!.biologicalOccurences }
                onChange={ (e) => setSleep({
                    ...sleep!,
                    biologicalOccurences: e,
                })}
            />
            <CustomButton
                title="Atualizar"
                onPress={ async () => await updateSleep() }
                important
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
        gap: 5,
    },
    btns: {
        gap: 5,
        paddingTop: 15,
    },
})