import { GetStackStyle } from "@/data/layout"
import { Stack } from "expo-router"
import React from "react"

export default function RootLayout() {
    return (
        <Stack
            initialRouteName='user'
            screenOptions={ GetStackStyle() }
        >
            <Stack.Screen
                name='user'
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name='accountRecovery'
                options={{ title: "Recuperação de Conta" }}
            />
            <Stack.Screen
                name='userData'
                options={{ title: "Exportação e Importação de Dados" }}
            />
            <Stack.Screen
                name='userDataExport'
                options={{ title: "Exportação de Dados" }}
            />
            <Stack.Screen
                name='userDataImportSameOrigin'
                options={{ title: "Importação de Dados do Morfeus" }}
            />
        </Stack>
    )
}
