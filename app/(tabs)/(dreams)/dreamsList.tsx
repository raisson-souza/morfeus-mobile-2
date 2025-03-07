import { DateFormatter } from "@/utils/DateFormatter"
import { DreamListedByUserType, ListDreamsByUserRequest } from "@/types/dream"
import { Screen } from "@/components/base/Screen"
import { StyleContextProvider } from "@/contexts/StyleContext"
import { StyleSheet, View } from "react-native"
import { SyncContextProvider } from "@/contexts/SyncContext"
import { useEffect, useState } from "react"
import { useRouter } from "expo-router"
import { useSQLiteContext } from "expo-sqlite"
import Box from "@/components/base/Box"
import CustomButton from "@/components/customs/CustomButton"
import CustomText from "@/components/customs/CustomText"
import DreamListedByUser from "@/components/screens/dreams/DreamListedByUser"
import DreamService from "@/services/api/DreamService"
import DreamServiceOffline from "@/services/offline/DreamServiceOffline"
import DreamsListEspecificFilters from "@/components/screens/dreams/DreamsListEspecificFilters"
import DreamsListObjectiveFilters from "@/components/screens/dreams/DreamsListObjetiveFilters"
import Loading from "@/components/base/Loading"
import MonthExtractorHeader from "@/components/screens/general/MonthExtractorHeader"
import React from "react"

export default function DreamsList() {
    const db = useSQLiteContext()
    const { systemStyle } = StyleContextProvider()
    const router = useRouter()
    const [ loading, setLoading ] = useState<boolean>(true)
    const [ syncing, setSyncing ] = useState<boolean>(false)
    const [ dreamList, setDreamList ] = useState<DreamListedByUserType[] | null>(null)
    const { checkIsConnected, syncCloudData } = SyncContextProvider()
    const [ date, setDate ] = useState<Date>(new Date())
    const [ listDreamsByUserForm, setListDreamsByUserForm ] = useState<ListDreamsByUserRequest>({
        dreamOriginFilter: "all",
        dreamCaracteristicsFilter: "allNotHiddenAndErotic",
        dreamEspecificCaracteristicsFilter: {
            noEspecificy: true,
            dreamsWithPersonalAnalysis: null,
            dreamClimates: {
                ameno: null,
                calor: null,
                garoa: null,
                chuva: null,
                tempestade: null,
                nevoa: null,
                neve: null,
                multiplos: null,
                outro: null,
                indefinido: null,
            },
            dreamHourId: null,
            dreamDurationId: null,
            dreamLucidityLevelId: null,
            dreamTypeId: null,
            dreamRealityLevelId: null,
            dreamPointOfViewId: null,
        },
        date: DateFormatter.forBackend.date(date.getTime()),
    })

    const fetchDreams = async (newDate?: Date) => {
        setLoading(true)
        setDreamList(null)
        if (checkIsConnected()) {
            await DreamService.ListByUser({
                ...listDreamsByUserForm,
                date: newDate
                    ? DateFormatter.forBackend.date(newDate.getTime())
                    : DateFormatter.forBackend.date(date.getTime())
            })
                .then(response => {
                    if (response.Success) {
                        setDreamList(response.Data)
                        return
                    }
                    alert(response.ErrorMessage)
                })
        }
        else {
            setDreamList(await DreamServiceOffline.List(db, {
                ...listDreamsByUserForm,
                date: newDate
                    ? DateFormatter.forBackend.date(newDate.getTime())
                    : DateFormatter.forBackend.date(date.getTime())
            }))
        }
        setLoading(false)
    }

    useEffect(() => {
        fetchDreams()
    }, [listDreamsByUserForm])

    const changeMonth = async (newDate: Date) => {
        setDate(newDate)
        await fetchDreams(newDate)
    }

    const syncProcess = async (date: Date): Promise<void> => {
        setSyncing(true)
        await syncCloudData(date)
        setSyncing(false)
    }

    const renderDreamList = () => {
        if (dreamList) {
            if (dreamList.length > 0) {
                return syncing
                    ? <Loading />
                    : <>
                        <Box.Column style={ styles.dreamsListContainer }>
                            {
                                dreamList.map((dream, i) => (
                                    <Box.Center style={ styles.dreamOuterContainer } key={ i }>
                                        <View
                                            style={{
                                                ...styles.dreamSeparator,
                                                borderTopColor: systemStyle.iconColor,
                                            }}
                                        ></View>
                                        <DreamListedByUser
                                            dream={ dream }
                                            containerStyle={ styles.dreamContainer }
                                            useSync
                                        />
                                    </Box.Center>
                                ))
                            }
                        </Box.Column>
                        {
                            dreamList.length >= 10
                                ? <CustomButton
                                    title="Criar Sonho"
                                    onPress={ () => router.navigate("/createDream") }
                                />
                                : <></>
                        }
                    </>
            }
            return <CustomText>Nenhum sonho encontrado.</CustomText>
        }
        return <CustomText>Houve um erro ao buscar os sonhos.</CustomText>
    }

    return (
        <Screen>
            <Box.Center style={ styles.container }>
                <MonthExtractorHeader
                    defaultDate={ date }
                    onChange={ async (e) => await changeMonth(e) }
                    routerBtnRouterAction={ () => router.navigate('/(tabs)/(dreams)/dreamsHome') }
                    firstCustomBtn={{
                        title: "Criar Sonho",
                        action: () => router.navigate('/(tabs)/(dreams)/createDream'),
                        active: !syncing,
                    }}
                    secondCustomBtn={{
                        title: "Atualizar",
                        action: async () => await fetchDreams(),
                        active: !syncing,
                    }}
                    syncButton={{
                        onSync: async () => await syncProcess(date),
                        syncing: syncing,
                    }}
                />
                {
                    dreamList
                        ? (
                            <Box.Column
                                style={{
                                    ...styles.filterContainer,
                                    backgroundColor: systemStyle.quaternary,
                                }}
                            >
                                <CustomText weight="bold">Filtragem de Sonhos</CustomText>
                                <DreamsListObjectiveFilters
                                    listDreamsByUserForm={ listDreamsByUserForm }
                                    setListDreamsByUserForm={ setListDreamsByUserForm }
                                />
                                {
                                    checkIsConnected()
                                        ? <DreamsListEspecificFilters
                                            listDreamsByUserForm={ listDreamsByUserForm }
                                            setListDreamsByUserForm={ setListDreamsByUserForm }
                                        />
                                        : <></>
                                }
                            </Box.Column>
                        )
                        : <></>
                }
                {
                    loading
                        ? <Loading onlyLoading={ false } text="Buscando sonhos..." />
                        : renderDreamList()
                }
            </Box.Center>
        </Screen>
    )
}

const styles = StyleSheet.create({
    container: {
        width: "100%",
        gap: 10,
    },
    filterContainer: {
        width: "100%",
        padding: 10,
        borderRadius: 10,
    },
    
    dreamsListContainer: {
        alignSelf: "flex-start",
        width: "100%",
        gap: 15,
    },
    dreamSeparator: {
        width: "100%",
        borderTopWidth: 1,
    },
    dreamContainer: {
        alignSelf: "flex-start",
    },
    dreamOuterContainer: {
        alignSelf: "flex-start",
        width: "100%",
    },
})