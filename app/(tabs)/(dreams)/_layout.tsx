import { Stack } from "expo-router"
import React from "react"
import AuthRoute from "@/components/auth/Auth"
import { GetStackStyle } from "@/data/layout"

export default function RootLayout() {
  return (
    <AuthRoute>
      <Stack
        initialRouteName='dreamsList'
        screenOptions={ GetStackStyle() }
      >
        <Stack.Screen
          name='dreamsHome'
          options={{ title: "Sonhos" }}
        />
        <Stack.Screen
          name='createDream'
          options={{ title: "Criar Sonho" }} />
        <Stack.Screen
          name='createFastDream'
          options={{ title: "Criar Sonho Rápido" }} />
        <Stack.Screen
          name='dreamsList'
          options={{ title: "Listagem de Sonhos" }} />
        <Stack.Screen
          name='exportDreams'
          options={{ title: "Exportar Sonhos" }} />
        <Stack.Screen
          name='getDream'
          options={{ title: "Sonho" }} />
        <Stack.Screen
          name='getTag'
          options={{ title: "Tag de Sonho" }} />
        <Stack.Screen
          name='importDreams'
          options={{ title: "Importar Sonhos" }} />
        <Stack.Screen
          name='updateDream'
          options={{ title: "Atualizar Sonho" }} />
      </Stack>
    </AuthRoute>
  )
}
