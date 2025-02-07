import { Stack } from "expo-router"
import AuthRoute from "@/components/auth/Auth"
import React from "react"
import { GetStackStyle } from "@/data/layout"

export default function RootLayout() {
  return (
    <AuthRoute>
      <Stack
        initialRouteName='sleepsList'
        screenOptions={ GetStackStyle() }
      >
        <Stack.Screen
          name='sleepsHome'
          options={{ title: "Ciclos de Sono" }}
        />
        <Stack.Screen
          name='createSleep'
          options={{ title: "Criar Ciclo de Sono" }}
        />
        <Stack.Screen
          name='getSleep'
          options={{ title: "Ciclo de Sono" }}
        />
        <Stack.Screen
          name='sleepsList'
          options={{ title: "Listagem de Sonos" }}
        />
        <Stack.Screen
          name='updateSleep'
          options={{ title: "Atualizar Sono" }}
        />
      </Stack>
    </AuthRoute>
  )
}
