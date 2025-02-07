import { Stack } from "expo-router"
import AuthRoute from "@/components/auth/Auth"
import React from "react"
import { GetStackStyle } from "@/data/layout"

export default function RootLayout() {
  return (
    <AuthRoute>
      <Stack
        initialRouteName='analysisHome'
        screenOptions={ GetStackStyle() }
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
