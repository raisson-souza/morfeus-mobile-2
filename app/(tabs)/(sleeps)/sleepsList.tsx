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
import MonthExtractor from "@/components/screens/general/MonthExtractor"
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

    if (loading) {
        return (
            <Screen>
                <Loading text="Buscando ciclos de sono..." />
            </Screen>
        )
    }

    const renderSleepsCycles = () => {
        if (sleeps) {
            if (sleeps.length > 0) {
                return (
                    <Box.Column style={ styles.sleepsCycleList }>
                        {
                            sleeps.map((sleepCycle, i) => {
                                return <SleepListedByUser sleepCycle={ sleepCycle } key={ i } />
                            })
                        }
                    </Box.Column>
                )
            }
            return <TextBold style={ styles.noSleepCycleFound }>Nenhum Ciclo de Sono encontrado.</TextBold>
        }
        return <></>
    }

    return (
        <Screen>
            <Box.Column style={ styles.container }>
                {
                    sleeps
                        ? (
                            <>
                                <Box.Row style={ styles.header }>
                                    <MonthExtractor
                                        initialDate={ date }
                                        onChange={ async (e) => {
                                            setDate(e)
                                        }}
                                    />
                                    <Box.Column style={ styles.headerMoreOptions }>
                                        <CustomButton
                                            title="Ver Mais"
                                            onPress={ () => router.navigate('/(tabs)/(sleeps)/sleepsHome') }
                                        />
                                        <CustomButton
                                            title="Criar Ciclo de Sono"
                                            onPress={ () => router.navigate('/(tabs)/(sleeps)/createSleep') }
                                        />
                                    </Box.Column>
                                </Box.Row>
                                { renderSleepsCycles() }
                                {
                                    sleeps.length >= 10
                                        ?  (
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
                        : <TextBold style={ styles.errorSleepCycle }>{ `Houve um erro ao buscar os ciclos de sono: ${ errorMessage }` }</TextBold>
                }
            </Box.Column>
        </Screen>
    )
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
    },
    header: {
        width: "100%",
        justifyContent: "space-between",
    },
    headerMoreOptions: {
        gap: 10,
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
})