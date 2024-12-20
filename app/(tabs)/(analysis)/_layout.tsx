import { Stack } from "expo-router"
import AuthRoute from "@/components/auth/Auth"
import LayoutStyles from "@/styles/layouts"
import React from "react"

export default function RootLayout() {
  return (
    <AuthRoute>
      <Stack
        initialRouteName='analysisHome'
        screenOptions={ LayoutStyles.stack }
      >
        <Stack.Screen
          name='analysisHome'
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
    </AuthRoute>
  )
}
