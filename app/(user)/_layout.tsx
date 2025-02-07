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
                name='accountRestoration'
                options={{ title: "Restauração de Conta" }}
            />
        </Stack>
    )
}
