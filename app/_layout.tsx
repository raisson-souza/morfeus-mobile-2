import { SQLiteProvider } from "expo-sqlite"
import { Stack } from "expo-router"
import { StatusBar } from 'expo-status-bar'
import AuthContextComponent from "@/contexts/AuthContext"
import InitialContextComponent from "@/contexts/InitialContext"
import LayoutStyles from "@/styles/layouts"
import React from "react"
import SqliteDbManager from "@/db/database"
import StagingHeader from "@/components/screens/staging/StagingHeader"
import SyncContextComponent from "@/contexts/SyncContext"

export default function RootLayout() {
  return (
    <SQLiteProvider
      databaseName="database.db"
      onInit={ SqliteDbManager }
    >
      <InitialContextComponent>
        <StatusBar />
        <AuthContextComponent>
          <SyncContextComponent>
            <Stack
              initialRouteName='index'
              screenOptions={{
                ...LayoutStyles.stack,
                header: () => <StagingHeader />,
              }}
            >
              <Stack.Screen
                name='index'
                options={{ headerShown: true /** alterado para true devido StagingHeader */ }}
              />
              <Stack.Screen
                name='(tabs)'
                options={{ headerShown: true /** alterado para true devido StagingHeader */ }}
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
