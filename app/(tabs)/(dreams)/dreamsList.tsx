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
    const [ dreamsList, setDreamsList ] = useState<DreamListedByUserType[] | null>(null)
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

    useEffect(() => {
        const fetchDreams = async () => {
            await DreamService.ListByUser(isOnline, listDreamsByUserForm)
            .then(response => {
                if (response.Success) {
                    setDreamsList(response.Data)
                    return
                }
                alert(response.ErrorMessage)
            })
        }
        fetchDreams()
    }, [listDreamsByUserForm, date])

    // TODO: validar comportamento da busca

    return (
        <Screen>
            <Box.Center style={ styles.container }>
                <MonthExtractorHeader
                    monthExtractorProps={{
                        initialDate: date,
                        onChange: (e) => { setDate(e) },
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
                                { /** //TODO: style para centralizar e estilizar o switch */ }
                                <SwitchNull
                                    label="Sonhos com Análise Pessoal"
                                    btnTitle={ dreamsWithPersonalAnalysisNullSwitch ? "Habilitar" : "Desabilitar" }
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
                                <Box.Column>
                                    {/** // TODO: VALIDAR O USO DO SwitchNull */}
                                    <Box.Column>
                                        <Text>Clima Amenos</Text>
                                        <CustomButton
                                            title={ dreamClimatesAmenoNullSwitch ? "Habilitar" : "Desabilitar" }
                                            onPress={ () => setDreamClimatesAmenoNullSwitch(!dreamClimatesAmenoNullSwitch) }
                                        />
                                        {
                                            dreamClimatesAmenoNullSwitch
                                                ? <></>
                                                : (
                                                    <Switch
                                                        value={ listDreamsByUserForm.dreamEspecificCaracteristicsFilter.dreamClimates.ameno! }
                                                        onValueChange={ (e) => setListDreamsByUserForm({
                                                            ...listDreamsByUserForm,
                                                            dreamEspecificCaracteristicsFilter: {
                                                                ...listDreamsByUserForm.dreamEspecificCaracteristicsFilter,
                                                                dreamClimates: {
                                                                    ...listDreamsByUserForm.dreamEspecificCaracteristicsFilter.dreamClimates,
                                                                    ameno: e
                                                                },
                                                            }
                                                        })}
                                                    />
                                                )
                                        }
                                    </Box.Column>
                                    <Box.Column>
                                        <Text>Clima Calor</Text>
                                        <CustomButton
                                            title={ dreamClimatesCalorNullSwitch ? "Habilitar" : "Desabilitar" }
                                            onPress={ () => setDreamClimatesCalorNullSwitch(!dreamClimatesCalorNullSwitch) }
                                        />
                                        {
                                            dreamClimatesCalorNullSwitch
                                                ? <></>
                                                : (
                                                    <Switch
                                                        value={ listDreamsByUserForm.dreamEspecificCaracteristicsFilter.dreamClimates.calor! }
                                                        onValueChange={ (e) => setListDreamsByUserForm({
                                                            ...listDreamsByUserForm,
                                                            dreamEspecificCaracteristicsFilter: {
                                                                ...listDreamsByUserForm.dreamEspecificCaracteristicsFilter,
                                                                dreamClimates: {
                                                                    ...listDreamsByUserForm.dreamEspecificCaracteristicsFilter.dreamClimates,
                                                                    calor: e
                                                                },
                                                            }
                                                        })}
                                                    />
                                                )
                                        }
                                    </Box.Column>
                                    <Box.Column>
                                        <Text>Clima Garoa</Text>
                                        <CustomButton
                                            title={ dreamClimatesGaroaNullSwitch ? "Habilitar" : "Desabilitar" }
                                            onPress={ () => setDreamClimatesGaroaNullSwitch(!dreamClimatesGaroaNullSwitch) }
                                        />
                                        {
                                            dreamClimatesGaroaNullSwitch
                                                ? <></>
                                                : (
                                                    <Switch
                                                        value={ listDreamsByUserForm.dreamEspecificCaracteristicsFilter.dreamClimates.garoa! }
                                                        onValueChange={ (e) => setListDreamsByUserForm({
                                                            ...listDreamsByUserForm,
                                                            dreamEspecificCaracteristicsFilter: {
                                                                ...listDreamsByUserForm.dreamEspecificCaracteristicsFilter,
                                                                dreamClimates: {
                                                                    ...listDreamsByUserForm.dreamEspecificCaracteristicsFilter.dreamClimates,
                                                                    garoa: e
                                                                },
                                                            }
                                                        })}
                                                    />
                                                )
                                        }
                                    </Box.Column>
                                    <Box.Column>
                                        <Text>Clima Chuva</Text>
                                        <CustomButton
                                            title={ dreamClimatesChuvaNullSwitch ? "Habilitar" : "Desabilitar" }
                                            onPress={ () => setDreamClimatesChuvaNullSwitch(!dreamClimatesChuvaNullSwitch) }
                                        />
                                        {
                                            dreamClimatesChuvaNullSwitch
                                                ? <></>
                                                : (
                                                    <Switch
                                                        value={ listDreamsByUserForm.dreamEspecificCaracteristicsFilter.dreamClimates.chuva! }
                                                        onValueChange={ (e) => setListDreamsByUserForm({
                                                            ...listDreamsByUserForm,
                                                            dreamEspecificCaracteristicsFilter: {
                                                                ...listDreamsByUserForm.dreamEspecificCaracteristicsFilter,
                                                                dreamClimates: {
                                                                    ...listDreamsByUserForm.dreamEspecificCaracteristicsFilter.dreamClimates,
                                                                    chuva: e
                                                                },
                                                            }
                                                        })}
                                                    />
                                                )
                                        }
                                    </Box.Column>
                                    <Box.Column>
                                        <Text>Clima Tempestade</Text>
                                        <CustomButton
                                            title={ dreamClimatesTempestadeNullSwitch ? "Habilitar" : "Desabilitar" }
                                            onPress={ () => setDreamClimatesTempestadeNullSwitch(!dreamClimatesTempestadeNullSwitch) }
                                        />
                                        {
                                            dreamClimatesTempestadeNullSwitch
                                                ? <></>
                                                : (
                                                    <Switch
                                                        value={ listDreamsByUserForm.dreamEspecificCaracteristicsFilter.dreamClimates.tempestade! }
                                                        onValueChange={ (e) => setListDreamsByUserForm({
                                                            ...listDreamsByUserForm,
                                                            dreamEspecificCaracteristicsFilter: {
                                                                ...listDreamsByUserForm.dreamEspecificCaracteristicsFilter,
                                                                dreamClimates: {
                                                                    ...listDreamsByUserForm.dreamEspecificCaracteristicsFilter.dreamClimates,
                                                                    tempestade: e
                                                                },
                                                            }
                                                        })}
                                                    />
                                                )
                                        }
                                    </Box.Column>
                                    <Box.Column>
                                        <Text>Clima Nevoa</Text>
                                        <CustomButton
                                            title={ dreamClimatesNevoaNullSwitch ? "Habilitar" : "Desabilitar" }
                                            onPress={ () => setDreamClimatesNevoaNullSwitch(!dreamClimatesNevoaNullSwitch) }
                                        />
                                        {
                                            dreamClimatesNevoaNullSwitch
                                                ? <></>
                                                : (
                                                    <Switch
                                                        value={ listDreamsByUserForm.dreamEspecificCaracteristicsFilter.dreamClimates.nevoa! }
                                                        onValueChange={ (e) => setListDreamsByUserForm({
                                                            ...listDreamsByUserForm,
                                                            dreamEspecificCaracteristicsFilter: {
                                                                ...listDreamsByUserForm.dreamEspecificCaracteristicsFilter,
                                                                dreamClimates: {
                                                                    ...listDreamsByUserForm.dreamEspecificCaracteristicsFilter.dreamClimates,
                                                                    nevoa: e
                                                                },
                                                            }
                                                        })}
                                                    />
                                                )
                                        }
                                    </Box.Column>
                                    <Box.Column>
                                        <Text>Clima Neve</Text>
                                        <CustomButton
                                            title={ dreamClimatesNeveNullSwitch ? "Habilitar" : "Desabilitar" }
                                            onPress={ () => setDreamClimatesNeveNullSwitch(!dreamClimatesNeveNullSwitch) }
                                        />
                                        {
                                            dreamClimatesNeveNullSwitch
                                                ? <></>
                                                : (
                                                    <Switch
                                                        value={ listDreamsByUserForm.dreamEspecificCaracteristicsFilter.dreamClimates.neve! }
                                                        onValueChange={ (e) => setListDreamsByUserForm({
                                                            ...listDreamsByUserForm,
                                                            dreamEspecificCaracteristicsFilter: {
                                                                ...listDreamsByUserForm.dreamEspecificCaracteristicsFilter,
                                                                dreamClimates: {
                                                                    ...listDreamsByUserForm.dreamEspecificCaracteristicsFilter.dreamClimates,
                                                                    neve: e
                                                                },
                                                            }
                                                        })}
                                                    />
                                                )
                                        }
                                    </Box.Column>
                                    <Box.Column>
                                        <Text>Múltiplos Climas</Text>
                                        <CustomButton
                                            title={ dreamClimatesMultiplosNullSwitch ? "Habilitar" : "Desabilitar" }
                                            onPress={ () => setDreamClimatesMultiplosNullSwitch(!dreamClimatesMultiplosNullSwitch) }
                                        />
                                        {
                                            dreamClimatesMultiplosNullSwitch
                                                ? <></>
                                                : (
                                                    <Switch
                                                        value={ listDreamsByUserForm.dreamEspecificCaracteristicsFilter.dreamClimates.multiplos! }
                                                        onValueChange={ (e) => setListDreamsByUserForm({
                                                            ...listDreamsByUserForm,
                                                            dreamEspecificCaracteristicsFilter: {
                                                                ...listDreamsByUserForm.dreamEspecificCaracteristicsFilter,
                                                                dreamClimates: {
                                                                    ...listDreamsByUserForm.dreamEspecificCaracteristicsFilter.dreamClimates,
                                                                    multiplos: e
                                                                },
                                                            }
                                                        })}
                                                    />
                                                )
                                        }
                                    </Box.Column>
                                    <Box.Column>
                                        <Text>Outro Clima</Text>
                                        <CustomButton
                                            title={ dreamClimatesOutroNullSwitch ? "Habilitar" : "Desabilitar" }
                                            onPress={ () => setDreamClimatesOutroNullSwitch(!dreamClimatesOutroNullSwitch) }
                                        />
                                        {
                                            dreamClimatesOutroNullSwitch
                                                ? <></>
                                                : (
                                                    <Switch
                                                        value={ listDreamsByUserForm.dreamEspecificCaracteristicsFilter.dreamClimates.outro! }
                                                        onValueChange={ (e) => setListDreamsByUserForm({
                                                            ...listDreamsByUserForm,
                                                            dreamEspecificCaracteristicsFilter: {
                                                                ...listDreamsByUserForm.dreamEspecificCaracteristicsFilter,
                                                                dreamClimates: {
                                                                    ...listDreamsByUserForm.dreamEspecificCaracteristicsFilter.dreamClimates,
                                                                    outro: e
                                                                },
                                                            }
                                                        })}
                                                    />
                                                )
                                        }
                                    </Box.Column>
                                    <Box.Column>
                                        <Text>Clima Indefinido</Text>
                                        <CustomButton
                                            title={ dreamClimatesIndefinidoNullSwitch ? "Habilitar" : "Desabilitar" }
                                            onPress={ () => setDreamClimatesIndefinidoNullSwitch(!dreamClimatesIndefinidoNullSwitch) }
                                        />
                                        {
                                            dreamClimatesIndefinidoNullSwitch
                                                ? <></>
                                                : (
                                                    <Switch
                                                        value={ listDreamsByUserForm.dreamEspecificCaracteristicsFilter.dreamClimates.indefinido! }
                                                        onValueChange={ (e) => setListDreamsByUserForm({
                                                            ...listDreamsByUserForm,
                                                            dreamEspecificCaracteristicsFilter: {
                                                                ...listDreamsByUserForm.dreamEspecificCaracteristicsFilter,
                                                                dreamClimates: {
                                                                    ...listDreamsByUserForm.dreamEspecificCaracteristicsFilter.dreamClimates,
                                                                    indefinido: e
                                                                },
                                                            }
                                                        })}
                                                    />
                                                )
                                        }
                                    </Box.Column>
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
                <TextBold style={ styles.dreamsListTitle }>Sonhos Encontrados</TextBold>
                {
                    dreamsList
                        ? dreamsList.length > 0
                            ? (
                                <Box.Column style={ styles.dreamsListContainer }>
                                    {
                                        dreamsList.map((dream, i) => (
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
                            : <Text>Nenhum sonho encontrado.</Text>
                        : <Loading onlyLoading={ false } text="Buscando sonhos..." />
                }
                <CustomButton
                    title="Criar Sonho"
                    onPress={ () => router.navigate("/createDream") }
                />
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