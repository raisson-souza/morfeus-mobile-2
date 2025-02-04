import { ListDreamsByUserRequest } from "@/types/dream"
import { Picker } from "@react-native-picker/picker"
import { StyleSheet, Switch } from "react-native"
import Box from "@/components/base/Box"
import CustomText from "@/components/customs/CustomText"
import React from "react"
import SwitchNull from "@/components/customs/CustomSwitchNull"

type DreamsListEspecificFiltersProps = {
    listDreamsByUserForm: ListDreamsByUserRequest
    setListDreamsByUserForm: React.Dispatch<React.SetStateAction<ListDreamsByUserRequest>>
}

export default function DreamsListEspecificFilters({
    listDreamsByUserForm,
    setListDreamsByUserForm,
}: DreamsListEspecificFiltersProps) {
    return (
        <Box.Column style={ styles.container }>
            <Box.Row style={ styles.filterNoEspecificyContainer }>
                <CustomText size="s">Sem Especificidades</CustomText>
                <Switch
                    value={ listDreamsByUserForm.dreamEspecificCaracteristicsFilter.noEspecificy }
                    onValueChange={ (e) => setListDreamsByUserForm({
                        ...listDreamsByUserForm,
                        dreamEspecificCaracteristicsFilter: {
                            ...listDreamsByUserForm.dreamEspecificCaracteristicsFilter,
                            noEspecificy: e,
                        },
                    })}
                />
            </Box.Row>
            {
                listDreamsByUserForm.dreamEspecificCaracteristicsFilter.noEspecificy
                    ? <></>
                    : (
                        <Box.Column style={ styles.noEspecificyContainer }>
                            <Box.Column style={ styles.switches }>
                                <SwitchNull
                                    label="Sonhos com Análise Pessoal"
                                    switchValue={ listDreamsByUserForm.dreamEspecificCaracteristicsFilter.dreamsWithPersonalAnalysis }
                                    setSwitchValue={ (e) => setListDreamsByUserForm({
                                        ...listDreamsByUserForm,
                                        dreamEspecificCaracteristicsFilter: {
                                            ...listDreamsByUserForm.dreamEspecificCaracteristicsFilter,
                                            dreamsWithPersonalAnalysis: e,
                                        },
                                    })}
                                />
                                <SwitchNull
                                    label="Clima Ameno"
                                    switchValue={ listDreamsByUserForm.dreamEspecificCaracteristicsFilter.dreamClimates.ameno }
                                    setSwitchValue={ (e) =>
                                        setListDreamsByUserForm({
                                            ...listDreamsByUserForm,
                                            dreamEspecificCaracteristicsFilter: {
                                                ...listDreamsByUserForm.dreamEspecificCaracteristicsFilter,
                                                dreamClimates: {
                                                    ...listDreamsByUserForm.dreamEspecificCaracteristicsFilter.dreamClimates,
                                                    ameno: e,
                                                },
                                            },
                                        })
                                    }
                                />
                                <SwitchNull
                                    label="Clima Calor"
                                    switchValue={ listDreamsByUserForm.dreamEspecificCaracteristicsFilter.dreamClimates.calor }
                                    setSwitchValue={ (e) =>
                                        setListDreamsByUserForm({
                                            ...listDreamsByUserForm,
                                            dreamEspecificCaracteristicsFilter: {
                                                ...listDreamsByUserForm.dreamEspecificCaracteristicsFilter,
                                                dreamClimates: {
                                                    ...listDreamsByUserForm.dreamEspecificCaracteristicsFilter.dreamClimates,
                                                    calor: e,
                                                },
                                            },
                                        })
                                    }
                                />
                                <SwitchNull
                                    label="Clima Garoa"
                                    switchValue={ listDreamsByUserForm.dreamEspecificCaracteristicsFilter.dreamClimates.garoa }
                                    setSwitchValue={ (e) =>
                                        setListDreamsByUserForm({
                                            ...listDreamsByUserForm,
                                            dreamEspecificCaracteristicsFilter: {
                                                ...listDreamsByUserForm.dreamEspecificCaracteristicsFilter,
                                                dreamClimates: {
                                                    ...listDreamsByUserForm.dreamEspecificCaracteristicsFilter.dreamClimates,
                                                    garoa: e,
                                                },
                                            },
                                        })
                                    }
                                />
                                <SwitchNull
                                    label="Clima Chuva"
                                    switchValue={ listDreamsByUserForm.dreamEspecificCaracteristicsFilter.dreamClimates.chuva }
                                    setSwitchValue={ (e) =>
                                        setListDreamsByUserForm({
                                            ...listDreamsByUserForm,
                                            dreamEspecificCaracteristicsFilter: {
                                                ...listDreamsByUserForm.dreamEspecificCaracteristicsFilter,
                                                dreamClimates: {
                                                    ...listDreamsByUserForm.dreamEspecificCaracteristicsFilter.dreamClimates,
                                                    chuva: e,
                                                },
                                            },
                                        })
                                    }
                                />
                                <SwitchNull
                                    label="Clima Tempestade"
                                    switchValue={ listDreamsByUserForm.dreamEspecificCaracteristicsFilter.dreamClimates.tempestade }
                                    setSwitchValue={ (e) =>
                                        setListDreamsByUserForm({
                                            ...listDreamsByUserForm,
                                            dreamEspecificCaracteristicsFilter: {
                                                ...listDreamsByUserForm.dreamEspecificCaracteristicsFilter,
                                                dreamClimates: {
                                                    ...listDreamsByUserForm.dreamEspecificCaracteristicsFilter.dreamClimates,
                                                    tempestade: e,
                                                },
                                            },
                                        })
                                    }
                                />
                                <SwitchNull
                                    label="Clima Névoa"
                                    switchValue={ listDreamsByUserForm.dreamEspecificCaracteristicsFilter.dreamClimates.nevoa }
                                    setSwitchValue={ (e) =>
                                        setListDreamsByUserForm({
                                            ...listDreamsByUserForm,
                                            dreamEspecificCaracteristicsFilter: {
                                                ...listDreamsByUserForm.dreamEspecificCaracteristicsFilter,
                                                dreamClimates: {
                                                    ...listDreamsByUserForm.dreamEspecificCaracteristicsFilter.dreamClimates,
                                                    nevoa: e,
                                                },
                                            },
                                        })
                                    }
                                />
                                <SwitchNull
                                    label="Clima Neve"
                                    switchValue={ listDreamsByUserForm.dreamEspecificCaracteristicsFilter.dreamClimates.neve }
                                    setSwitchValue={ (e) =>
                                        setListDreamsByUserForm({
                                            ...listDreamsByUserForm,
                                            dreamEspecificCaracteristicsFilter: {
                                                ...listDreamsByUserForm.dreamEspecificCaracteristicsFilter,
                                                dreamClimates: {
                                                    ...listDreamsByUserForm.dreamEspecificCaracteristicsFilter.dreamClimates,
                                                    neve: e,
                                                },
                                            },
                                        })
                                    }
                                />
                                <SwitchNull
                                    label="Múltiplos Climas"
                                    switchValue={ listDreamsByUserForm.dreamEspecificCaracteristicsFilter.dreamClimates.multiplos }
                                    setSwitchValue={ (e) =>
                                        setListDreamsByUserForm({
                                            ...listDreamsByUserForm,
                                            dreamEspecificCaracteristicsFilter: {
                                                ...listDreamsByUserForm.dreamEspecificCaracteristicsFilter,
                                                dreamClimates: {
                                                    ...listDreamsByUserForm.dreamEspecificCaracteristicsFilter.dreamClimates,
                                                    multiplos: e,
                                                },
                                            },
                                        })
                                    }
                                />
                                <SwitchNull
                                    label="Outro Clima"
                                    switchValue={ listDreamsByUserForm.dreamEspecificCaracteristicsFilter.dreamClimates.outro }
                                    setSwitchValue={ (e) =>
                                        setListDreamsByUserForm({
                                            ...listDreamsByUserForm,
                                            dreamEspecificCaracteristicsFilter: {
                                                ...listDreamsByUserForm.dreamEspecificCaracteristicsFilter,
                                                dreamClimates: {
                                                    ...listDreamsByUserForm.dreamEspecificCaracteristicsFilter.dreamClimates,
                                                    outro: e,
                                                },
                                            },
                                        })
                                    }
                                />
                                <SwitchNull
                                    label="Clima Indefinido"
                                    switchValue={ listDreamsByUserForm.dreamEspecificCaracteristicsFilter.dreamClimates.indefinido }
                                    setSwitchValue={ (e) =>
                                        setListDreamsByUserForm({
                                            ...listDreamsByUserForm,
                                            dreamEspecificCaracteristicsFilter: {
                                                ...listDreamsByUserForm.dreamEspecificCaracteristicsFilter,
                                                dreamClimates: {
                                                    ...listDreamsByUserForm.dreamEspecificCaracteristicsFilter.dreamClimates,
                                                    indefinido: e,
                                                },
                                            },
                                        })
                                    }
                                />
                            </Box.Column>
                            <Box.Column style={ styles.pickers }>
                                <Picker
                                    selectedValue={ listDreamsByUserForm.dreamEspecificCaracteristicsFilter.dreamHourId }
                                    onValueChange={ (e) => setListDreamsByUserForm({
                                        ...listDreamsByUserForm,
                                        dreamEspecificCaracteristicsFilter: {
                                            ...listDreamsByUserForm.dreamEspecificCaracteristicsFilter,
                                            dreamHourId: e,
                                        },
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
                                            dreamDurationId: e,
                                        },
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
                                            dreamLucidityLevelId: e,
                                        },
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
                                            dreamTypeId: e,
                                        },
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
                                            dreamRealityLevelId: e,
                                        },
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
                                            dreamPointOfViewId: e,
                                        },
                                    })}
                                    style={ styles.pickerNoEspecificy }
                                >
                                    <Picker.Item label="Perspectiva..." value={ null } />
                                    <Picker.Item label="Primeira Pessoa" value="1" />
                                    <Picker.Item label="Segunda Pessoa" value="2" />
                                    <Picker.Item label="Terceira Pessoa" value="3" />
                                </Picker>
                            </Box.Column>
                        </Box.Column>
                    )
            }
        </Box.Column>
    )
}

const styles = StyleSheet.create({
    container: {
        width: "100%",
    },
    noEspecificyContainer: {
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
    switches: {
        gap: 10,
    },
    pickers: {
        gap: 10,
    },
})