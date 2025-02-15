import { ActivityIndicator, Text, View } from "react-native"
import { DefaultStyle } from "@/data/style"
import { StyleContextProvider } from "@/contexts/StyleContext"
import React from "react"

type LoadingProps = {
    onlyLoading?: boolean
    text?: string
    textColor?: string
    loadingColor?: string
}

/** Componente de loading padrão para a aplicação */
export default function Loading({
    onlyLoading = true,
    text = "Carregando...",
    textColor,
    loadingColor,
}: LoadingProps) {
    const systemStyle = GetSystemStyle()
    textColor = textColor ? textColor : systemStyle.textColor
    loadingColor = loadingColor ? loadingColor : systemStyle.loadingColor

    return (
        <View>
            <ActivityIndicator
                color={ loadingColor }
                size={ systemStyle.extraLargeIconSize }
            />
            {
                onlyLoading
                    ? <></>
                    : <Text style={{ color: textColor }}>{ text }</Text>
            }
        </View>
    )
}

const GetSystemStyle = () => {
    try {
        const { systemStyle } = StyleContextProvider()
        return systemStyle
    }
    catch {
        return DefaultStyle
    }
}