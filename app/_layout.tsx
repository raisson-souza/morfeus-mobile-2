import { SQLiteProvider } from "expo-sqlite"
import { Stack } from "expo-router"
import { StatusBar } from 'expo-status-bar'
import AuthContextComponent from "@/contexts/AuthContext"
import InitialContextComponent from "@/contexts/InitialContext"
import LayoutStyles from "@/styles/layouts"
import React from "react"
import SqliteDbManager from "@/db/database"
import SyncContextComponent from "@/contexts/SyncContext"

export default function RootLayout() {
  return (
    <SQLiteProvider
      databaseName="database.db"
      onInit={ SqliteDbManager }
    >
      <InitialContextComponent>
        <StatusBar
          backgroundColor="darkblue"
          translucent={ false }
        />
        <AuthContextComponent>
          <SyncContextComponent>
            <Stack
              initialRouteName='index'
              screenOptions={ LayoutStyles.stack }
            >
              <Stack.Screen
                name='index'
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name='(tabs)'
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name='login'
                options={{ title: "Login" }}
              />
              <Stack.Screen
                name='registry'
                options={{ title: "Registre-se" }}
              />
            </Stack>
          </SyncContextComponent>
        </AuthContextComponent>
      </InitialContextComponent>
    </SQLiteProvider>
  )
}
