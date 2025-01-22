import { DateFormatter } from "@/utils/DateFormatter"
import { DreamListedByUserType, ListDreamsByUserRequest } from "@/types/dream"
import { Picker } from "@react-native-picker/picker"
import { Screen } from "@/components/base/Screen"
import { StyleSheet, Switch, Text, View } from "react-native"
import { SyncContextProvider } from "@/contexts/SyncContext"
import { useEffect, useState } from "react"
import { useRouter } from "expo-router"
import Box from "@/components/base/Box"
import CustomButton from "@/components/customs/CustomButton"
import DreamListedByUser from "@/components/screens/dreams/DreamListedByUser"
import DreamService from "@/services/api/DreamService"
import Loading from "@/components/base/Loading"
import MonthExtractorHeader from "@/components/screens/general/MonthExtractorHeader"
import React from "react"
import SwitchNull from "@/components/customs/CustomSwitchNull"
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
        date: DateFormatter.forBackend.date(date.getTime())
    })
    const [ dreamsWithPersonalAnalysisNullSwitch, setDreamsWithPersonalAnalysisNullSwitch ] = useState<boolean>(listDreamsByUserForm.dreamEspecificCaracteristicsFilter.dreamsWithPersonalAnalysis ?? true)
    const [ dreamClimatesAmenoNullSwitch, setDreamClimatesAmenoNullSwitch ] = useState<boolean>(listDreamsByUserForm.dreamEspecificCaracteristicsFilter.dreamClimates.ameno ?? true)
    const [ dreamClimatesCalorNullSwitch, setDreamClimatesCalorNullSwitch ] = useState<boolean>(listDreamsByUserForm.dreamEspecificCaracteristicsFilter.dreamClimates.calor ?? true)
    const [ dreamClimatesGaroaNullSwitch, setDreamClimatesGaroaNullSwitch ] = useState<boolean>(listDreamsByUserForm.dreamEspecificCaracteristicsFilter.dreamClimates.garoa ?? true)
    const [ dreamClimatesChuvaNullSwitch, setDreamClimatesChuvaNullSwitch ] = useState<boolean>(listDreamsByUserForm.dreamEspecificCaracteristicsFilter.dreamClimates.chuva ?? true)
    const [ dreamClimatesTempestadeNullSwitch, setDreamClimatesTempestadeNullSwitch ] = useState<boolean>(listDreamsByUserForm.dreamEspecificCaracteristicsFilter.dreamClimates.tempestade ?? true)
    const [ dreamClimatesNevoaNullSwitch, setDreamClimatesNevoaNullSwitch ] = useState<boolean>(listDreamsByUserForm.dreamEspecificCaracteristicsFilter.dreamClimates.nevoa ?? true)
    const [ dreamClimatesNeveNullSwitch, setDreamClimatesNeveNullSwitch ] = useState<boolean>(listDreamsByUserForm.dreamEspecificCaracteristicsFilter.dreamClimates.neve ?? true)
    const [ dreamClimatesMultiplosNullSwitch, setDreamClimatesMultiplosNullSwitch ] = useState<boolean>(listDreamsByUserForm.dreamEspecificCaracteristicsFilter.dreamClimates.multiplos ?? true)
    const [ dreamClimatesOutroNullSwitch, setDreamClimatesOutroNullSwitch ] = useState<boolean>(listDreamsByUserForm.dreamEspecificCaracteristicsFilter.dreamClimates.outro ?? true)
    const [ dreamClimatesIndefinidoNullSwitch, setDreamClimatesIndefinidoNullSwitch ] = useState<boolean>(listDreamsByUserForm.dreamEspecificCaracteristicsFilter.dreamClimates.indefinido ?? true)

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
                    customActionBtnTitle="Criar Sonho"
                    customActionBtnAction={ () => router.navigate('/(tabs)/(dreams)/createDream') }
                    routerBtnRouterAction={ () => router.navigate('/(tabs)/(dreams)/dreamsHome') }
                />
                <Box.Row style={ styles.filterContainer }>
                    <TextBold style={ styles.filterMessage }>Filtragem de Sonhos</TextBold>
                </Box.Row>
                <Picker
                    selectedValue={ listDreamsByUserForm.dreamCaracteristicsFilter }
                    onValueChange={ (e) => setListDreamsByUserForm({
                        ...listDreamsByUserForm,
                        dreamCaracteristicsFilter: e
                    })}
                    style={ styles.picker }
                >
                    <Picker.Item label="Todos os Sonhos" value="all" />
                    <Picker.Item label="Todos os Sonhos (menos os ocultos)" value="allNotHidden" />
                    <Picker.Item label="Todos os Sonhos (menos os eróticos)" value="allNotErotic" />
                    <Picker.Item label="Todos os Sonhos (menos ocultos e eróticos)" value="allNotHiddenAndErotic" />
                    <Picker.Item label="Todos os Sonhos Ocultos" value="allHidden" />
                    <Picker.Item label="Todos os Sonhos Eróticos" value="allErotic" />
                </Picker>
                <Picker
                    selectedValue={ listDreamsByUserForm.dreamOriginFilter }
                    onValueChange={ (e) => setListDreamsByUserForm({
                        ...listDreamsByUserForm,
                        dreamOriginFilter: e
                    })}
                    style={ styles.picker }
                >
                    <Picker.Item label="Todas as Origens" value="all" />
                    <Picker.Item label="Sonhos Completos" value="completeDreams" />
                    <Picker.Item label="Sonhos Rápidos" value="fastDreams" />
                    <Picker.Item label="Sonhos Importados" value="importedDreams" />
                </Picker>
                <Box.Row style={ styles.filterNoEspecificyContainer }>
                    <Text>Sem Especificidades</Text>
                    <Switch
                        value={ listDreamsByUserForm.dreamEspecificCaracteristicsFilter.noEspecificy }
                        onValueChange={ (e) => setListDreamsByUserForm({
                            ...listDreamsByUserForm,
                            dreamEspecificCaracteristicsFilter: {
                                ...listDreamsByUserForm.dreamEspecificCaracteristicsFilter,
                                noEspecificy: e,
                            }
                        })}
                    />
                </Box.Row>
                {/* FILTROS ESPECÍFICOS */}
                {
                    listDreamsByUserForm.dreamEspecificCaracteristicsFilter.noEspecificy
                        ? <></>
                        : (
                            <Box.Column style={ styles.noEspecificyContainer }>
                                <Box.Column style={ styles.switches }>
                                    <SwitchNull
                                        label="Sonhos com Análise Pessoal"
                                        isSwitchNull={ dreamsWithPersonalAnalysisNullSwitch }
                                        setSwitchNull={ setDreamsWithPersonalAnalysisNullSwitch }
                                        switchValue={ listDreamsByUserForm.dreamEspecificCaracteristicsFilter.dreamsWithPersonalAnalysis }
                                        setSwitchValue={ (e) => setListDreamsByUserForm({
                                            ...listDreamsByUserForm,
                                            dreamEspecificCaracteristicsFilter: {
                                                ...listDreamsByUserForm.dreamEspecificCaracteristicsFilter,
                                                dreamsWithPersonalAnalysis: e,
                                            }
                                        })}
                                    />
                                    {/* CLIMAS */}
                                    <SwitchNull
                                        label="Clima Ameno"
                                        isSwitchNull={ dreamClimatesAmenoNullSwitch }
                                        setSwitchNull={ setDreamClimatesAmenoNullSwitch }
                                        switchValue={ listDreamsByUserForm.dreamEspecificCaracteristicsFilter.dreamClimates.ameno }
                                        setSwitchValue={ (e) =>
                                            setListDreamsByUserForm({
                                                ...listDreamsByUserForm,
                                                dreamEspecificCaracteristicsFilter: {
                                                    ...listDreamsByUserForm.dreamEspecificCaracteristicsFilter,
                                                    dreamClimates: {
                                                        ...listDreamsByUserForm.dreamEspecificCaracteristicsFilter.dreamClimates,
                                                        ameno: e
                                                    },
                                                }
                                            })
                                        }
                                    />
                                    <SwitchNull
                                        label="Clima Calor"
                                        isSwitchNull={ dreamClimatesCalorNullSwitch }
                                        setSwitchNull={ setDreamClimatesCalorNullSwitch }
                                        switchValue={ listDreamsByUserForm.dreamEspecificCaracteristicsFilter.dreamClimates.calor }
                                        setSwitchValue={ (e) =>
                                            setListDreamsByUserForm({
                                                ...listDreamsByUserForm,
                                                dreamEspecificCaracteristicsFilter: {
                                                    ...listDreamsByUserForm.dreamEspecificCaracteristicsFilter,
                                                    dreamClimates: {
                                                        ...listDreamsByUserForm.dreamEspecificCaracteristicsFilter.dreamClimates,
                                                        calor: e
                                                    },
                                                }
                                            })
                                        }
                                    />
                                    <SwitchNull
                                        label="Clima Garoa"
                                        isSwitchNull={ dreamClimatesGaroaNullSwitch }
                                        setSwitchNull={ setDreamClimatesGaroaNullSwitch }
                                        switchValue={ listDreamsByUserForm.dreamEspecificCaracteristicsFilter.dreamClimates.garoa }
                                        setSwitchValue={ (e) =>
                                            setListDreamsByUserForm({
                                                ...listDreamsByUserForm,
                                                dreamEspecificCaracteristicsFilter: {
                                                    ...listDreamsByUserForm.dreamEspecificCaracteristicsFilter,
                                                    dreamClimates: {
                                                        ...listDreamsByUserForm.dreamEspecificCaracteristicsFilter.dreamClimates,
                                                        garoa: e
                                                    },
                                                }
                                            })
                                        }
                                    />
                                    <SwitchNull
                                        label="Clima Chuva"
                                        isSwitchNull={ dreamClimatesChuvaNullSwitch }
                                        setSwitchNull={ setDreamClimatesChuvaNullSwitch }
                                        switchValue={ listDreamsByUserForm.dreamEspecificCaracteristicsFilter.dreamClimates.chuva }
                                        setSwitchValue={ (e) =>
                                            setListDreamsByUserForm({
                                                ...listDreamsByUserForm,
                                                dreamEspecificCaracteristicsFilter: {
                                                    ...listDreamsByUserForm.dreamEspecificCaracteristicsFilter,
                                                    dreamClimates: {
                                                        ...listDreamsByUserForm.dreamEspecificCaracteristicsFilter.dreamClimates,
                                                        chuva: e
                                                    },
                                                }
                                            })
                                        }
                                    />
                                    <SwitchNull
                                        label="Clima Tempestade"
                                        isSwitchNull={ dreamClimatesTempestadeNullSwitch }
                                        setSwitchNull={ setDreamClimatesTempestadeNullSwitch }
                                        switchValue={ listDreamsByUserForm.dreamEspecificCaracteristicsFilter.dreamClimates.tempestade }
                                        setSwitchValue={ (e) =>
                                            setListDreamsByUserForm({
                                                ...listDreamsByUserForm,
                                                dreamEspecificCaracteristicsFilter: {
                                                    ...listDreamsByUserForm.dreamEspecificCaracteristicsFilter,
                                                    dreamClimates: {
                                                        ...listDreamsByUserForm.dreamEspecificCaracteristicsFilter.dreamClimates,
                                                        tempestade: e
                                                    },
                                                }
                                            })
                                        }
                                    />
                                    <SwitchNull
                                        label="Clima Névoa"
                                        isSwitchNull={ dreamClimatesNevoaNullSwitch }
                                        setSwitchNull={ setDreamClimatesNevoaNullSwitch }
                                        switchValue={ listDreamsByUserForm.dreamEspecificCaracteristicsFilter.dreamClimates.nevoa }
                                        setSwitchValue={ (e) =>
                                            setListDreamsByUserForm({
                                                ...listDreamsByUserForm,
                                                dreamEspecificCaracteristicsFilter: {
                                                    ...listDreamsByUserForm.dreamEspecificCaracteristicsFilter,
                                                    dreamClimates: {
                                                        ...listDreamsByUserForm.dreamEspecificCaracteristicsFilter.dreamClimates,
                                                        nevoa: e
                                                    },
                                                }
                                            })
                                        }
                                    />
                                    <SwitchNull
                                        label="Clima Neve"
                                        isSwitchNull={ dreamClimatesNeveNullSwitch }
                                        setSwitchNull={ setDreamClimatesNeveNullSwitch }
                                        switchValue={ listDreamsByUserForm.dreamEspecificCaracteristicsFilter.dreamClimates.neve }
                                        setSwitchValue={ (e) =>
                                            setListDreamsByUserForm({
                                                ...listDreamsByUserForm,
                                                dreamEspecificCaracteristicsFilter: {
                                                    ...listDreamsByUserForm.dreamEspecificCaracteristicsFilter,
                                                    dreamClimates: {
                                                        ...listDreamsByUserForm.dreamEspecificCaracteristicsFilter.dreamClimates,
                                                        neve: e
                                                    },
                                                }
                                            })
                                        }
                                    />
                                    <SwitchNull
                                        label="Múltiplos Climas"
                                        isSwitchNull={ dreamClimatesMultiplosNullSwitch }
                                        setSwitchNull={ setDreamClimatesMultiplosNullSwitch }
                                        switchValue={ listDreamsByUserForm.dreamEspecificCaracteristicsFilter.dreamClimates.multiplos }
                                        setSwitchValue={ (e) =>
                                            setListDreamsByUserForm({
                                                ...listDreamsByUserForm,
                                                dreamEspecificCaracteristicsFilter: {
                                                    ...listDreamsByUserForm.dreamEspecificCaracteristicsFilter,
                                                    dreamClimates: {
                                                        ...listDreamsByUserForm.dreamEspecificCaracteristicsFilter.dreamClimates,
                                                        multiplos: e
                                                    },
                                                }
                                            })
                                        }
                                    />
                                    <SwitchNull
                                        label="Outro Clima"
                                        isSwitchNull={ dreamClimatesOutroNullSwitch }
                                        setSwitchNull={ setDreamClimatesOutroNullSwitch }
                                        switchValue={ listDreamsByUserForm.dreamEspecificCaracteristicsFilter.dreamClimates.outro }
                                        setSwitchValue={ (e) =>
                                            setListDreamsByUserForm({
                                                ...listDreamsByUserForm,
                                                dreamEspecificCaracteristicsFilter: {
                                                    ...listDreamsByUserForm.dreamEspecificCaracteristicsFilter,
                                                    dreamClimates: {
                                                        ...listDreamsByUserForm.dreamEspecificCaracteristicsFilter.dreamClimates,
                                                        outro: e
                                                    },
                                                }
                                            })
                                        }
                                    />
                                    <SwitchNull
                                        label="Clima Indefinido"
                                        isSwitchNull={ dreamClimatesIndefinidoNullSwitch }
                                        setSwitchNull={ setDreamClimatesIndefinidoNullSwitch }
                                        switchValue={ listDreamsByUserForm.dreamEspecificCaracteristicsFilter.dreamClimates.indefinido }
                                        setSwitchValue={ (e) =>
                                            setListDreamsByUserForm({
                                                ...listDreamsByUserForm,
                                                dreamEspecificCaracteristicsFilter: {
                                                    ...listDreamsByUserForm.dreamEspecificCaracteristicsFilter,
                                                    dreamClimates: {
                                                        ...listDreamsByUserForm.dreamEspecificCaracteristicsFilter.dreamClimates,
                                                        indefinido: e
                                                    },
                                                }
                                            })
                                        }
                                    />
                                </Box.Column>
                                {/* CLIMAS FIM */}
                                {/* PICKERS */}
                                <Picker
                                    selectedValue={ listDreamsByUserForm.dreamEspecificCaracteristicsFilter.dreamHourId }
                                    onValueChange={ (e) => setListDreamsByUserForm({
                                        ...listDreamsByUserForm,
                                        dreamEspecificCaracteristicsFilter: {
                                            ...listDreamsByUserForm.dreamEspecificCaracteristicsFilter,
                                            dreamHourId: e
                                        }
                                    })}
                                    style={ styles.pickerNoEspecificy }
                                >
                                    <Picker.Item label="Horário do Sonho..." value={ null } />
                                    <Picker.Item label="Amanhecer" value="1" />
                                    <Picker.Item label="Dia" value="2" />
                                    <Picker.Item label="Anoitecer" value="3" />
                                    <Picker.Item label="Noite" value="4" />
                                    <Picker.Item label="Indefinido" value="5" />
                                    <Picker.Item label="Múltiplos" value="6" />
                                </Picker>
                                <Picker
                                    selectedValue={ listDreamsByUserForm.dreamEspecificCaracteristicsFilter.dreamDurationId }
                                    onValueChange={ (e) => setListDreamsByUserForm({
                                        ...listDreamsByUserForm,
                                        dreamEspecificCaracteristicsFilter: {
                                            ...listDreamsByUserForm.dreamEspecificCaracteristicsFilter,
                                            dreamDurationId: e
                                        }
                                    })}
                                    style={ styles.pickerNoEspecificy }
                                >
                                    <Picker.Item label="Duração do Sonho..." value={ null } />
                                    <Picker.Item label="Instantâneo" value="1" />
                                    <Picker.Item label="Curto" value="2" />
                                    <Picker.Item label="Médio" value="3" />
                                    <Picker.Item label="Longo" value="4" />
                                </Picker>
                                <Picker
                                    selectedValue={ listDreamsByUserForm.dreamEspecificCaracteristicsFilter.dreamLucidityLevelId }
                                    onValueChange={ (e) => setListDreamsByUserForm({
                                        ...listDreamsByUserForm,
                                        dreamEspecificCaracteristicsFilter: {
                                            ...listDreamsByUserForm.dreamEspecificCaracteristicsFilter,
                                            dreamLucidityLevelId: e
                                        }
                                    })}
                                    style={ styles.pickerNoEspecificy }
                                >
                                    <Picker.Item label="Nível de Lucidez do Sonho..." value={ null } />
                                    <Picker.Item label="Não Lúcido" value="1" />
                                    <Picker.Item label="Parcialmente Lúcido" value="2" />
                                    <Picker.Item label="Lúcido" value="3" />
                                    <Picker.Item label="Indefinido" value="4" />
                                </Picker>
                                <Picker
                                    selectedValue={ listDreamsByUserForm.dreamEspecificCaracteristicsFilter.dreamTypeId }
                                    onValueChange={ (e) => setListDreamsByUserForm({
                                        ...listDreamsByUserForm,
                                        dreamEspecificCaracteristicsFilter: {
                                            ...listDreamsByUserForm.dreamEspecificCaracteristicsFilter,
                                            dreamTypeId: e
                                        }
                                    })}
                                    style={ styles.pickerNoEspecificy }
                                >
                                    <Picker.Item label="Tipo de Sonho..." value={ null } />
                                    <Picker.Item label="Sonho" value="1" />
                                    <Picker.Item label="Pesadelo" value="2" />
                                    <Picker.Item label="Indefinido" value="3" />
                                </Picker>
                                <Picker
                                    selectedValue={ listDreamsByUserForm.dreamEspecificCaracteristicsFilter.dreamRealityLevelId }
                                    onValueChange={ (e) => setListDreamsByUserForm({
                                        ...listDreamsByUserForm,
                                        dreamEspecificCaracteristicsFilter: {
                                            ...listDreamsByUserForm.dreamEspecificCaracteristicsFilter,
                                            dreamRealityLevelId: e
                                        }
                                    })}
                                    style={ styles.pickerNoEspecificy }
                                >
                                    <Picker.Item label="Nível de Realidade do Sonho..." value={ null } />
                                    <Picker.Item label="Irreal" value="1" />
                                    <Picker.Item label="Parcialmente Real" value="2" />
                                    <Picker.Item label="Real" value="3" />
                                </Picker>
                                <Picker
                                    selectedValue={ listDreamsByUserForm.dreamEspecificCaracteristicsFilter.dreamPointOfViewId }
                                    onValueChange={ (e) => setListDreamsByUserForm({
                                        ...listDreamsByUserForm,
                                        dreamEspecificCaracteristicsFilter: {
                                            ...listDreamsByUserForm.dreamEspecificCaracteristicsFilter,
                                            dreamPointOfViewId: e
                                        }
                                    })}
                                    style={ styles.pickerNoEspecificy }
                                >
                                    <Picker.Item label="Perspectiva..." value={ null } />
                                    <Picker.Item label="Primeira Pessoa" value="1" />
                                    <Picker.Item label="Segunda Pessoa" value="2" />
                                    <Picker.Item label="Terceira Pessoa" value="3" />
                                </Picker>
                                {/* PICKER FIM */}
                            </Box.Column>
                        )
                }
                {/* FILTROS ESPECÍFICOS FIM */}
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
        borderBottomWidth: 1,
    },
    filterMessage: {
        fontSize: 20,
    },
    noEspecificyContainer: {
        width: "100%",
    },
    switches: {
        gap: 10,
    },
    picker: {
        width: "100%",
    },
    pickerNoEspecificy: {
        width: "90%",
    },
    filterNoEspecificyContainer: {
        justifyContent: "center",
        alignItems: "center",
        gap: 5,
    },
    dreamsListTitle: {
        fontSize: 18,
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
    createDreamBtn: {
        paddingTop: 10,
    },
})