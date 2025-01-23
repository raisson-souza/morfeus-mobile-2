import { DateFormatter } from "@/utils/DateFormatter"
import { DreamListedByUserType, ListDreamsByUserRequest } from "@/types/dream"
import { Screen } from "@/components/base/Screen"
import { StyleSheet, Text, View } from "react-native"
import { SyncContextProvider } from "@/contexts/SyncContext"
import { useEffect, useState } from "react"
import { useRouter } from "expo-router"
import Box from "@/components/base/Box"
import CustomButton from "@/components/customs/CustomButton"
import DreamListedByUser from "@/components/screens/dreams/DreamListedByUser"
import DreamService from "@/services/api/DreamService"
import DreamsListEspecificFilters from "@/components/screens/dreams/DreamsListEspecificFilters"
import DreamsListObjectiveFilters from "@/components/screens/dreams/DreamsListObjetiveFilters"
import Loading from "@/components/base/Loading"
import MonthExtractorHeader from "@/components/screens/general/MonthExtractorHeader"
import React from "react"
import TextBold from "@/components/base/TextBold"

export default function DreamsList() {
    const router = useRouter()
    const [ dreamList, setDreamList ] = useState<DreamListedByUserType[] | null>(null)
    const { isConnectedRef: { current: isOnline }} = SyncContextProvider()
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
        await DreamService.ListByUser(isOnline, {
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

    useEffect(() => {
        fetchDreams()
    }, [listDreamsByUserForm])

    const changeMonth = async (newDate: Date) => {
        setDreamList(null)
        setDate(newDate)
        await fetchDreams(newDate)
    }

    const renderDreamList = () => {
        if (dreamList) {
            if (dreamList.length > 0) {
                return (
                    <Box.Column style={ styles.dreamsListContainer }>
                        {
                            dreamList.map((dream, i) => (
                                <Box.Center style={ styles.dreamOuterContainer } key={ i }>
                                    <View style={ styles.dreamSeparator }></View>
                                    <DreamListedByUser
                                        dream={ dream }
                                        containerStyle={ styles.dreamContainer }
                                    />
                                </Box.Center>
                            ))
                        }
                    </Box.Column>
                )
            }
            return <Text>Nenhum sonho encontrado.</Text>
        }
        return <Loading onlyLoading={ false } text="Buscando sonhos..." />
    }

    const renderCreateDreamBtn = () => {
        if (dreamList) {
            if (dreamList.length > 10) {
                return <CustomButton
                    title="Criar Sonho"
                    onPress={ () => router.navigate("/createDream") }
                />
            }
        }
        return <></>
    }

    return (
        <Screen>
            <Box.Center style={ styles.container }>
                <MonthExtractorHeader
                    monthExtractorProps={{
                        initialDate: date,
                        onChange: async (e) => { await changeMonth(e) },
                    }}
                    firstCustomActionBtnTitle="Criar Sonho"
                    firstCustomActionBtnAction={ () => router.navigate('/(tabs)/(dreams)/createDream') }
                    routerBtnRouterAction={ () => router.navigate('/(tabs)/(dreams)/dreamsHome') }
                    secondCustomActionBtnTitle="Atualizar"
                    secondCustomActionBtnAction={ async () => {
                        setDreamList(null)
                        await fetchDreams()
                    }}
                />
                {
                    dreamList
                        ? (
                            <Box.Column style={ styles.filterContainer }>
                                <TextBold style={ styles.filterMessage }>Filtragem de Sonhos</TextBold>
                                <DreamsListObjectiveFilters
                                    listDreamsByUserForm={ listDreamsByUserForm }
                                    setListDreamsByUserForm={ setListDreamsByUserForm }
                                />
                                <DreamsListEspecificFilters
                                    listDreamsByUserForm={ listDreamsByUserForm }
                                    setListDreamsByUserForm={ setListDreamsByUserForm }
                                />
                            </Box.Column>
                        )
                        : <></>
                }
                { renderDreamList() }
                { renderCreateDreamBtn() }
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
        backgroundColor: "lightgray",
        width: "100%",
        padding: 10,
        borderRadius: 10,
    },
    filterMessage: {
        fontSize: 20,
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