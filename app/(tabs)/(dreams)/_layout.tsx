import { Stack } from "expo-router"
import LayoutStyles from "@/styles/layouts"
import React from "react"

export default function RootLayout() {
  return (
    <Stack
      initialRouteName='dreamsList'
      screenOptions={ LayoutStyles.stack }
    >
      <Stack.Screen
        name='index' />
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
  )
}
