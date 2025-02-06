import { ActivityIndicator, Text, View } from "react-native"
import { DefaultStyle } from "@/data/style"
import { StyleContextProvider } from "@/contexts/StyleContext"
import React from "react"

type LoadingProps = {
    onlyLoading?: boolean
    text?: string
    textColor?: string
}

/** Componente de loading padrão para a aplicação */
export default function Loading({
    onlyLoading = true,
    text = "Carregando...",
    textColor = "black",
}: LoadingProps) {
    const systemStyle = GetSystemStyle()

    return (
        <View>
            <ActivityIndicator
                color={ systemStyle.loadingColor }
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