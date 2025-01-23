import { KeyboardTypeOptions, TextInput, View, TextInputProps, StyleSheet, Text, StyleProp, TextStyle, DimensionValue } from "react-native"
import { useState } from "react"
import Box from "../base/Box"
import IconFeather from "react-native-vector-icons/Feather"
import React from "react"

type CustomInputProps = {
    /** Label do campo */
    label?: string
    labelStyle?: StyleProp<TextStyle>
    placeHolder?: string
    active?: boolean
    defaultValue?: string
    /** Propriedades do TextInput (irão sobrepor todas as outras) */
    innerProps?: TextInputProps
    inputStyle?: StyleProp<TextStyle>
    /** Tipo de teclado do input */
    keyboardType?: KeyboardTypeOptions
    onChange?: (e: string) => any
    width?: DimensionValue
    /** Pinta a label e a borda do input quando em foco */
    animationOnFocus?: boolean
    animationOnFocusStyle?: {
        color: string
    }
    isPassword?: boolean
}

type ControlValue = {
    password: string
    original: string
}

/** Componente customizado para input */
export default function CustomInput({
    label = undefined,
    labelStyle = {},
    placeHolder = undefined,
    active = true,
    defaultValue = undefined,
    innerProps = {},
    inputStyle = {},
    keyboardType = "ascii-capable",
    onChange = (_: string) => {},
    width = 150,
    animationOnFocus = true,
    animationOnFocusStyle = {
        color: "darkblue",
    },
    isPassword = false,
}: CustomInputProps): JSX.Element {
    const [ onFocus, setOnFocus ] = useState<boolean>(false)
    const [ valueControl, setValueControl ] = useState<ControlValue>({
        original: defaultValue ?? "",
        password: (defaultValue ?? "").replace(/./g, "*"),
    })
    const [ isPasswordHidden, setIsPasswordHidden ] = useState<boolean>(true)

    const onChangeAction = (e: string) => {
        const passwordValue = e
        setValueControl({
            original: e,
            password: passwordValue.replace(/./g, "*")
        })
        onChange(e)
    }

    const renderValue = () => {
        if (isPassword)
            return isPasswordHidden ? valueControl.password : valueControl.original
        return defaultValue
    }

    const input = <>
        <Box.Row style={ styles.inputContainer }>
            <TextInput
                defaultValue={ renderValue() }
                editable={ active }
                multiline
                keyboardType={ keyboardType }
                onChangeText={ (e) => { onChangeAction(e) } }
                placeholder={ placeHolder }
                style={{
                    borderWidth: 1,
                    borderRadius: 30,
                    width: width,
                    borderColor: animationOnFocus
                        ? onFocus ? animationOnFocusStyle.color : '#38B4E1'
                        : '#38B4E1',
                    paddingVertical: 3,
                    paddingHorizontal: 8,
                    ...inputStyle as any,
                }}
                onFocus={ () => { setOnFocus(true) } }
                onBlur={ () => { setOnFocus(false) } }
                { ...innerProps }
            />
            {
                isPassword
                    ? isPasswordHidden
                        ? <IconFeather name="eye" size={ 20 } onPress={ () => setIsPasswordHidden(false) } />
                        : <IconFeather name="eye-off" size={ 20 } onPress={ () => setIsPasswordHidden(true) } />
                    : <></>
            }
        </Box.Row>
    </>

    if (label) {
        return (
            <View style={ styles.container }>
                <Text style={{
                    fontSize: 14,
                    color: animationOnFocus
                        ? onFocus ? animationOnFocusStyle.color : 'black'
                        : 'black',
                    ...labelStyle as any
                }}>{ label }</Text>
                { input }
            </View>
        )
    }

    return input
}

const styles = StyleSheet.create({
    container: {
        display: "flex",
    },
    inputContainer: {
        alignItems: "center",
        gap: 5,
    },
})