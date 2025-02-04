import { Text, Switch, StyleSheet } from "react-native"
import Box from "../base/Box"
import CustomButton from "./CustomButton"
import React, { useState } from "react"

type SwitchNullProps = {
    /** Nome do switch */
    label: string
    /** Nome do botão de anulação do switch */
    btnTitle?: string
    /** Valor do switch */
    switchValue: any
    /** Set State do valor do switch */
    setSwitchValue: (value: any) => void
}

export default function SwitchNull({
    label,
    btnTitle,
    switchValue,
    setSwitchValue,
}: SwitchNullProps) {
    const [ isNull, setIsNull ] = useState<boolean>(true)

    return (
        <Box.Column style={ styles.container }>
            <Box.Row style={ styles.row }>
                <CustomButton
                    title={
                        btnTitle
                            ? btnTitle
                            : isNull
                                ? "Habilitar"
                                : "Desabilitar"
                    }
                    onPress={ () => {
                        setIsNull(!isNull)
                        // Caso anulação do switch, o valor do switch é nulo
                        if (!isNull) setSwitchValue(null)
                    }}
                />
                <Text>{ label }</Text>
            </Box.Row>
            {
                isNull
                    ? <></>
                    : <Switch
                        value={ switchValue! }
                        onValueChange={ (e) => setSwitchValue(e) }
                    />
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