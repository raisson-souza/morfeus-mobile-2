import { KeyboardTypeOptions, TextInput, View, TextInputProps, StyleSheet, StyleProp, TextStyle, DimensionValue } from "react-native"
import { StyleContextProvider } from "@/contexts/StyleContext"
import { useState } from "react"
import CustomText from "./CustomText"

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
}: CustomInputProps): JSX.Element {
    const { systemStyle } = StyleContextProvider()
    const [ onFocus, setOnFocus ] = useState<boolean>(false)

    const input = <TextInput
            defaultValue={ defaultValue }
            editable={ active }
            multiline
            keyboardType={ keyboardType }
            onChangeText={ (e) => onChange(e) }
            placeholder={ placeHolder }
            style={{
                borderWidth: 1,
                borderRadius: 30,
                width: width,
                borderColor: animationOnFocus
                    ? onFocus
                        ? systemStyle.primary
                        : systemStyle.btnOutlineColor
                    : systemStyle.btnOutlineColor,
                paddingVertical: 3,
                paddingHorizontal: 8,
                backgroundColor: systemStyle.oppositeTextColor,
                ...inputStyle as any,
            }}
            onFocus={ () => setOnFocus(true) }
            onBlur={ () => setOnFocus(false) }
            { ...innerProps }
        />

    if (label) {
        return (
            <View style={ styles.container }>
                <CustomText
                    style={{
                        fontSize: 14,
                        color: animationOnFocus
                            ? onFocus
                                ? systemStyle.styleName === "dark"
                                    ? systemStyle.secondary
                                    : systemStyle.primary
                                : systemStyle.textColor
                            : systemStyle.textColor,
                        ...labelStyle as any
                    }}
                >
                    { label }
                </CustomText>
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
})