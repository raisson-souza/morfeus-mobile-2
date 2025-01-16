import { CustomImage } from "@/components/customs/CustomImage"
import { Screen } from "../components/base/Screen"
import { StyleSheet } from "react-native"
import { View } from "react-native"
import React, { createContext, useContext, useEffect, useState } from "react"

type InitialContextProps = {
    children: JSX.Element | JSX.Element[]
}

type InitialContext = {}

const InitialContext = createContext<InitialContext | null>(null)

/** Context especializado no tratamento / carregamento de dados iniciais da aplicação */
export default function InitialContextComponent({ children }: InitialContextProps) {
    const [ loading, setLoading ] = useState<boolean>(true)

    useEffect(() => {
        const interval = setInterval(() => {
            setLoading(false)
        }, 1000)
        return () => {
            clearInterval(interval)
        }
    }, [])

    if (loading) {
        return (
            <Screen flex>
                <View style={ styles.logo }>
                    <CustomImage.Local filePathByRequire={ require('../assets/images/morfeus_logo.png') } />
                </View>
            </Screen>
        )
    }

    return (
        <InitialContext.Provider value={{}}>
            { children }
        </InitialContext.Provider>
    )
}

export function InitialContextProvider() {
    const context = useContext(InitialContext)
    if (!context) throw new Error("InitialContext chamado fora do provider.")
    return context
}

const styles = StyleSheet.create({
    logo: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: 5,
    },
})