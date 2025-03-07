import { DateFormatter } from "@/utils/DateFormatter"
import { Screen } from "@/components/base/Screen"
import { SleepListedByUserType } from "@/types/sleeps"
import { StyleSheet } from "react-native"
import { SyncContextProvider } from "@/contexts/SyncContext"
import { useEffect, useState } from "react"
import { useRouter } from "expo-router"
import { useSQLiteContext } from "expo-sqlite"
import Box from "@/components/base/Box"
import CustomButton from "@/components/customs/CustomButton"
import CustomText from "@/components/customs/CustomText"
import Loading from "@/components/base/Loading"
import MonthExtractorHeader from "@/components/screens/general/MonthExtractorHeader"
import React from "react"
import SleepListedByUser from "@/components/screens/sleeps/SleepListedByUser"
import SleepService from "@/services/api/SleepService"
import SleepServiceOffline from "@/services/offline/SleepServiceOffline"

export default function SleepsListScreen() {
    const db = useSQLiteContext()
    const router = useRouter()
    const [ loading, setLoading ] = useState<boolean>(true)
    const [ sleeps, setSleeps ] = useState<SleepListedByUserType[] | null>(null)
    const [ errorMessage, setErrorMessage ] = useState<string>("")
    const { checkIsConnected, syncCloudData } = SyncContextProvider()
    const [ date, setDate ] = useState<Date>(new Date)
    const [ syncing, setSyncing ] = useState<boolean>(false)

    const fetchSleeps = async () => {
        setLoading(true)
        setSleeps(null)
        if (checkIsConnected()) {
            await SleepService.ListByUser({ date: DateFormatter.forBackend.date(date.getTime()) })
                .then(response => {
                    if (response.Success) {
                        setSleeps(response.Data)
                    }
                    else {
                        setErrorMessage(response.ErrorMessage ?? "")
                    }
                })
        }
        else {
            setSleeps(await SleepServiceOffline.List(db, { date: DateFormatter.forBackend.date(date.getTime()) }))
        }
        setLoading(false)
    }

    useEffect(() => {
        fetchSleeps()
    }, [date])

    const syncProcess = async (date: Date): Promise<void> => {
        setSyncing(true)
        await syncCloudData(date)
        setSyncing(false)
    }

    const renderSleepsCycles = () => {
        if (sleeps) {
            if (sleeps.length > 0) {
                return syncing
                    ? <Loading />
                    : <>
                        <Box.Column style={ styles.sleepsCycleList }>
                            { sleeps.map((sleepCycle, i) => <SleepListedByUser sleepCycle={ sleepCycle } key={ i } useSync />) }
                        </Box.Column>
                        {
                            sleeps.length >= 10
                                ? (
                                    <Box.Column style={ styles.createSleepCycleBtn }>
                                        <CustomButton
                                            title="Criar Ciclo de Sono"
                                            onPress={ () => router.navigate('/(tabs)/(sleeps)/createSleep') }
                                        />
                                    </Box.Column>
                                )
                                : <></>
                        }
                    </>
            }
            return <CustomText style={ styles.noSleepCycleFound }>Nenhum Ciclo de Sono encontrado.</CustomText>
        }
        return <CustomText style={ styles.errorSleepCycle }>{ `Houve um erro ao buscar os ciclos de sono: ${ errorMessage }` }</CustomText>
    }

    return (
        <Screen>
            <Box.Column style={ styles.container }>
                <MonthExtractorHeader
                    defaultDate={ date }
                    onChange={ (e) => setDate(e) }
                    routerBtnRouterAction={ () => router.navigate('/(tabs)/(sleeps)/sleepsHome') }
                    firstCustomBtn={{
                        title: "Criar Sono",
                        action: () => router.navigate('/(tabs)/(sleeps)/createSleep'),
                        active: !syncing,
                    }}
                    secondCustomBtn={{
                        title: "Atualizar",
                        action: async () => await fetchSleeps(),
                        active: !syncing,
                    }}
                    syncButton={{
                        onSync: async () => await syncProcess(date),
                        syncing: syncing,
                    }}
                />
                { 
                    loading
                        ? (
                            <Box.Row style={ styles.loading }>
                                <Loading onlyLoading={ false } text="Buscando ciclos de sono..." />
                            </Box.Row>
                        )
                        : renderSleepsCycles()
                }
            </Box.Column>
        </Screen>
    )
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
    },
    sleepsCycleList: {
        paddingTop: 5,
        width: '100%',
    },
    noSleepCycleFound: {
        alignSelf: "center",
        paddingTop: 30,
    },
    errorSleepCycle: {
        alignSelf: "center",
        paddingTop: 10,
    },
    createSleepCycleBtn: {
        paddingTop: 10,
    },
    loading: {
        alignSelf: "center",
        paddingTop: 10,
    },
})