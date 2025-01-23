import { DateFormatter } from "@/utils/DateFormatter"
import { Screen } from "@/components/base/Screen"
import { SleepListedByUserType } from "@/types/sleeps"
import { StyleSheet } from "react-native"
import { SyncContextProvider } from "@/contexts/SyncContext"
import { useEffect, useState } from "react"
import { useRouter } from "expo-router"
import Box from "@/components/base/Box"
import CustomButton from "@/components/customs/CustomButton"
import Loading from "@/components/base/Loading"
import MonthExtractorHeader from "@/components/screens/general/MonthExtractorHeader"
import React from "react"
import SleepListedByUser from "@/components/screens/sleeps/SleepListedByUser"
import SleepService from "@/services/api/SleepService"
import TextBold from "@/components/base/TextBold"

export default function SleepsListScreen() {
    const router = useRouter()
    const [ loading, setLoading ] = useState<boolean>(true)
    const [ sleeps, setSleeps ] = useState<SleepListedByUserType[] | null>(null)
    const [ errorMessage, setErrorMessage ] = useState<string>("")
    const { isConnectedRef: { current: isOnline }} = SyncContextProvider()
    const [ date, setDate ] = useState<Date>(new Date)

    const fetchSleeps = async () => {
        setLoading(true)
        setSleeps(null)
        await SleepService.ListByUser(isOnline, {
            date: DateFormatter.forBackend.date(date.getTime())
        })
            .then(response => {
                if (response.Success) {
                    setSleeps(response.Data)
                }
                else {
                    setErrorMessage(response.ErrorMessage ?? "")
                }
                setLoading(false)
            })
    }

    useEffect(() => {
        fetchSleeps()
    }, [date])

    const renderSleepsCycles = () => {
        if (sleeps) {
            if (sleeps.length > 0) {
                return (
                    <>
                        <Box.Column style={ styles.sleepsCycleList }>
                            {
                                sleeps.map((sleepCycle, i) => {
                                    return <SleepListedByUser sleepCycle={ sleepCycle } key={ i } />
                                })
                            }
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
                )
            }
            return <TextBold style={ styles.noSleepCycleFound }>Nenhum Ciclo de Sono encontrado.</TextBold>
        }
        return <TextBold style={ styles.errorSleepCycle }>{ `Houve um erro ao buscar os ciclos de sono: ${ errorMessage }` }</TextBold>
    }

    return (
        <Screen>
            <Box.Column style={ styles.container }>
                <MonthExtractorHeader
                    monthExtractorProps={{
                        initialDate: date,
                        onChange: (e) => { setDate(e) },
                    }}
                    firstCustomActionBtnTitle="Criar Ciclo de Sono"
                    firstCustomActionBtnAction={ () => router.navigate('/(tabs)/(sleeps)/createSleep') }
                    routerBtnRouterAction={ () => router.navigate('/(tabs)/(sleeps)/sleepsHome') }
                    secondCustomActionBtnTitle="Atualizar"
                    secondCustomActionBtnAction={ async () => await fetchSleeps() }
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