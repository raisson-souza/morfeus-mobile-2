import { SQLiteProvider } from "expo-sqlite"
import { Stack } from "expo-router"
import { StatusBar } from 'expo-status-bar'
import AuthContextComponent from "@/contexts/AuthContext"
import InitialContextComponent from "@/contexts/InitialContext"
import React from "react"
import SqliteDbManager from "@/db/database"
import SyncContextComponent from "@/contexts/SyncContext"

const StackScreensStyle = {
  /** Cor do header */
  headerStyle: { backgroundColor: "darkblue" },
  /** Cor do título do header */
  headerTintColor: "white",
}

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
              initialRouteName='(tabs)'
              screenOptions={ StackScreensStyle }
            >
              <Stack.Screen name='(tabs)' options={{ title: "Tabs", headerShown: false }} />
              <Stack.Screen name='post' options={{ title: "Post" }} />
              <Stack.Screen name='credits' options={{ title: "Créditos" }} />
            </Stack>
          </SyncContextComponent>
        </AuthContextComponent>
      </InitialContextComponent>
    </SQLiteProvider>
  )
}
