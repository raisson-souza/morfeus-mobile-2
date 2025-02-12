import { SleepHumorType } from "@/types/sleepHumor"
import { StyleSheet } from "react-native"
import { useState } from "react"
import Box from "@/components/base/Box"
import CustomSwitch from "@/components/customs/CustomSwitch"
import CustomText from "@/components/customs/CustomText"
import React from "react"

type HumorsFormProps = {
    title: string
    value: SleepHumorType
    onChange: (e: SleepHumorType) => void
}

export default function HumorsForm({
    title,
    value,
    onChange,
}: HumorsFormProps) {
    const [ open, setOpen ] = useState<boolean>(false)

    return (
        <Box.Column>
            <Box.Row style={ styles.switcherBtn }>
                <CustomSwitch
                    value={ open }
                    label=""
                    onChange={ (e) => setOpen(e) }
                />
                <CustomText
                    weight="bold"
                    size="s"
                    onPress={ () => setOpen(!open) }
                >
                    { title }
                </CustomText>
            </Box.Row>
            {
                open
                    ? <Box.Column style={ styles.switchesBox }>
                        <CustomSwitch
                            value={ value.calm }
                            label="Calma"
                            onChange={ (e) => onChange({ ...value, undefinedHumor: false, calm: e })}
                        />
                        <CustomSwitch
                            value={ value.drowsiness }
                            label="Preguiça"
                            onChange={ (e) => onChange({ ...value, undefinedHumor: false, drowsiness: e })}
                        />
                        <CustomSwitch
                            value={ value.tiredness }
                            label="Cansaço"
                            onChange={ (e) => onChange({ ...value, undefinedHumor: false, tiredness: e })}
                        />
                        <CustomSwitch
                            value={ value.anxiety }
                            label="Ansiedade"
                            onChange={ (e) => onChange({ ...value, undefinedHumor: false, anxiety: e })}
                        />
                        <CustomSwitch
                            value={ value.happiness }
                            label="Felicidade"
                            onChange={ (e) => onChange({ ...value, undefinedHumor: false, happiness: e })}
                        />
                        <CustomSwitch
                            value={ value.fear }
                            label="Medo"
                            onChange={ (e) => onChange({ ...value, undefinedHumor: false, fear: e })}
                        />
                        <CustomSwitch
                            value={ value.sadness }
                            label="Tristeza"
                            onChange={ (e) => onChange({ ...value, undefinedHumor: false, sadness: e })}
                        />
                        <CustomSwitch
                            value={ value.other }
                            label="Outro"
                            onChange={ (e) => onChange({ ...value, undefinedHumor: false, other: e })}
                        />
                        <CustomSwitch
                            value={ value.undefinedHumor }
                            label="Indefinido"
                            onChange={ (e) =>
                                onChange({
                                    calm: false,
                                    drowsiness: false,
                                    tiredness: false,
                                    anxiety: false,
                                    happiness: false,
                                    fear: false,
                                    sadness: false,
                                    other: false,
                                    undefinedHumor: e
                                })
                            }
                        />
                    </Box.Column>
                    : <></>
            }
        </Box.Column>
    )
}

const styles = StyleSheet.create({
    switchesBox: {
        paddingLeft: 20,
    },
    switcherBtn: {
        alignItems: "center",
    },
})