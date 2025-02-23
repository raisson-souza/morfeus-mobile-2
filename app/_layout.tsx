import { GetStackStyle } from "@/data/layout"
import { SQLiteProvider } from "expo-sqlite"
import { Stack } from "expo-router"
import { StatusBar } from 'expo-status-bar'
import AuthContextComponent from "@/contexts/AuthContext"
import FileSystemContextComponent from "@/contexts/FileSystemContext"
import InitialContextComponent from "@/contexts/InitialContext"
import React from "react"
import SqliteDbManager from "@/db/database"
import StyleContextComponent from "@/contexts/StyleContext"
import SyncContextComponent from "@/contexts/SyncContext"

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
          <FileSystemContextComponent>
            <AuthContextComponent>
              <SyncContextComponent>
                <Stack
                  initialRouteName='index'
                  screenOptions={ GetStackStyle() }
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
                  <Stack.Screen
                    name='(user)'
                    options={{ headerShown: false }}
                  />
                </Stack>
              </SyncContextComponent>
            </AuthContextComponent>
          </FileSystemContextComponent>
        </InitialContextComponent>
      </StyleContextComponent>
    </SQLiteProvider>
  )
}
