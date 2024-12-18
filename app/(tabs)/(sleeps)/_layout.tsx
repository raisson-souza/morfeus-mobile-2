import { Stack } from "expo-router"
import LayoutStyles from "@/styles/layouts"
import React from "react"

export default function RootLayout() {
  return (
    <Stack
      initialRouteName='sleepsList'
      screenOptions={ LayoutStyles.stack }
    >
      <Stack.Screen
        name='index'
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
  )
}
