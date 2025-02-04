import React from "react"
import { ActivityIndicator, Text, View } from "react-native"

type LoadingProps = {
    onlyLoading?: boolean
    text?: string
    textColor?: string
}

// ESSE COMPONENTE NÃO PUXA O ESTILO GLOBAL DEVIDO A SUA ORDEM DE RENDERIZAÇÃO

/** Componente de loading padrão para a aplicação */
export default function Loading({
    onlyLoading = true,
    text = "Carregando...",
    textColor = "black",
}: LoadingProps) {
    return (
        <View>
            <ActivityIndicator
                color="darkblue"
                size="large"
            />
            {
                onlyLoading
                    ? <></>
                    : <Text style={{ color: textColor }}>{ text }</Text>
            }
        </View>
    )
}