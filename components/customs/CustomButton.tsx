import {
    DimensionValue,
    Pressable,
    PressableProps,
    TextStyle,
    TouchableHighlight,
    TouchableHighlightProps,
    TouchableOpacity,
    TouchableOpacityProps,
    View,
} from "react-native"
import { StyleContextProvider } from "@/contexts/StyleContext"
import CustomText from "./CustomText"

export type CustomButtonProps = {
    /** Título do botão */
    title: string
    /** Ação realizada após clique no botão */
    onPress: () => any
    /** Animação de clique no botão */
    btnAnimation?: "none" | "opacity" | "highlight" 
    /** Botão ativo */
    active?: boolean
    /** Cor de fundo do botão */
    btnColor?: string
    /** Cor do texto do botão */
    btnTextColor?: string
    /** Largura do botão */
    btnWidth?: DimensionValue
    /** Altura do botão */
    btnHeight?: DimensionValue
    /** Estilo do texto */
    titleStyle?: {
        fontWeight: TextStyle["fontWeight"]
        fontSize: number
    }
    /** Propriedades do botão (irão sobrepor as outras) */
    innerProps?: PressableProps | TouchableHighlightProps | TouchableOpacityProps
    /** Botão com destaque (fundo) */
    important?: boolean
    /** Override CSS para botão importante */
    importantOverride?: {
        color: string
        textColor: string
        textColorInactive: string
    }
}

/** Componente customizado para botão */
export default function CustomButton({
    title,
    onPress,
    btnAnimation = "opacity",
    active = true,
    btnColor,
    btnTextColor,
    btnWidth = "auto",
    btnHeight = "auto",
    titleStyle,
    innerProps = {},
    important = false,
    importantOverride,
}: CustomButtonProps) {
    const { systemStyle } = StyleContextProvider()
    btnColor = btnColor ? btnColor : systemStyle.btnOutlineColor
    btnTextColor = btnTextColor ? btnTextColor : systemStyle.textColor
    titleStyle = titleStyle
        ? titleStyle
        : {
            fontSize: systemStyle.normalTextSize,
            fontWeight: "400",
        }
    importantOverride = importantOverride
        ? importantOverride
        : {
            color: systemStyle.primary,
            textColor: systemStyle.oppositeTextColor,
            textColorInactive: systemStyle.inactiveTextColor,
        }

    const btnStyle: any = {
        width: btnWidth,
        height: btnHeight,
        borderRadius: 30,
        borderWidth: 1,
        borderColor: active
            ? important
                ? importantOverride.color
                : btnColor
            : systemStyle.inactiveIconColor,
        borderStyle: "solid",
        justifyContent: "center",
        alignItems: "center",
        padding: 3,
    }

    if (important) btnStyle["backgroundColor"] = importantOverride.color

    const btnText = <View pointerEvents="none">
        <CustomText
            style={{
                color: important
                    ? active
                        ? importantOverride.textColor
                        : importantOverride.textColorInactive
                    : btnTextColor,
                fontWeight: titleStyle.fontWeight,
                fontSize: titleStyle.fontSize,
                padding: 5,
            }}
        >
            { title }
        </CustomText>
    </View>

    if (btnAnimation === "highlight") {
        return (
            <TouchableHighlight
                style={ btnStyle }
                disabled={ !active }
                onPress={ async () => { await onPress() }}
                { ...innerProps as any }
            >
                { btnText }
            </TouchableHighlight>
        )
    }

    if (btnAnimation === "opacity") {
        return (
            <TouchableOpacity
                style={ btnStyle }
                disabled={ !active }
                onPress={ async () => { await onPress() }}
                { ...innerProps as any }
            >
                { btnText }
            </TouchableOpacity>
        )
    }

    return (
        <Pressable
            style={ btnStyle }
            disabled={ !active }
            onPress={ async () => { await onPress() } }
            { ...innerProps as any }
        >
            { btnText }
        </Pressable>
    )
}