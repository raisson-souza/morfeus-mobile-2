import { Stack } from "expo-router"
import LayoutStyles from "@/styles/layouts"
import React from "react"

export default function RootLayout() {
  return (
    <Stack
      initialRouteName='index'
      screenOptions={ LayoutStyles.stack }
    >
      <Stack.Screen
        name='index'
        options={{ title: "Análises" }}
      />
      <Stack.Screen
        name='listDreamsAnalysis'
        options={{ title: "Análises de Sonho" }}
      />
      <Stack.Screen
        name='listSleepsAnalysis'
        options={{ title: "Análises de Ciclo de Sono" }}
      />
    </Stack>
  )
}
