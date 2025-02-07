import { GetStackStyle } from "@/data/layout"
import { SQLiteProvider } from "expo-sqlite"
import { Stack } from "expo-router"
import { StatusBar } from 'expo-status-bar'
import AuthContextComponent from "@/contexts/AuthContext"
import env from "@/config/env"
import InitialContextComponent from "@/contexts/InitialContext"
import React from "react"
import SqliteDbManager from "@/db/database"
import StagingHeader from "@/components/screens/staging/StagingHeader"
import StyleContextComponent from "@/contexts/StyleContext"
import SyncContextComponent from "@/contexts/SyncContext"

const BACKEND_URL = { url: env.BackendUrl() }
const ORIGINAL_BACKEND_URL = env.BackendUrl()
export { BACKEND_URL, ORIGINAL_BACKEND_URL }

export default function RootLayout() {
  return (
    <SQLiteProvider
      databaseName="database.db"
      onInit={ SqliteDbManager }
    >
      <StyleContextComponent>
        <InitialContextComponent>
        <StatusBar
          backgroundColor="darkblue"
          translucent={ false }
        />
          <AuthContextComponent>
            <SyncContextComponent>
              <Stack
                initialRouteName='index'
                screenOptions={{
                  ...GetStackStyle(),
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
      </StyleContextComponent>
    </SQLiteProvider>
  )
}
