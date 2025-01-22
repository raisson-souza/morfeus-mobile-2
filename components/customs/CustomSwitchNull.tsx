import { Text, Switch, StyleSheet } from "react-native"
import Box from "../base/Box"
import CustomButton from "./CustomButton"
import React from "react"

type SwitchNullProps = {
    /** Nome do switch */
    label: string
    /** Nome do botão de anulação do switch */
    btnTitle?: string
    /** O valor do switch é nulo (não é falso ou verdadeiro) */
    isSwitchNull: boolean
    /** Set State para se o valor do switch é nulo */
    setSwitchNull: React.Dispatch<React.SetStateAction<boolean>>
    /** Valor do switch */
    switchValue: any
    /** Set State do valor do switch */
    setSwitchValue: (value: any) => void
}

export default function SwitchNull({ // TODO: Implementar state interno para controlar controlador nulo
    label,
    btnTitle,
    isSwitchNull,
    setSwitchNull,
    switchValue,
    setSwitchValue,
}: SwitchNullProps) {
    return (
        <Box.Column style={ styles.container }>
            <Box.Row style={ styles.row }>
                <CustomButton
                    title={
                        btnTitle
                            ? btnTitle
                            : isSwitchNull
                                ? "Habilitar"
                                : "Desabilitar"
                    }
                    onPress={ () => {
                        setSwitchNull(!isSwitchNull)
                        // Caso anulação do switch, o valor do switch é nulo
                        if (!isSwitchNull) setSwitchValue(null)
                    }}
                />
                <Text>{ label }</Text>
            </Box.Row>
            {
                isSwitchNull
                    ? <></>
                    : (
                        <Switch
                            value={ switchValue! }
                            onValueChange={ (e) => setSwitchValue(e) }
                        />
                    )
            }
        </Box.Column>
    )
}

const styles = StyleSheet.create({
    container: {
        alignItems: "flex-start",
    },
    row: {
        alignItems: 'center',
        gap: 5,
    },
})