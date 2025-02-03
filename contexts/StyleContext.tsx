import { CustomImage } from "@/components/customs/CustomImage"
import { DarkStyle, LightStyle } from "@/data/style"
import { Screen } from "../components/base/Screen"
import { Style } from "@/types/style"
import { StyleSheet } from "react-native"
import { useSQLiteContext } from "expo-sqlite"
import { View } from "react-native"
import React, { createContext, useContext, useEffect, useState } from "react"

type StyleContextProps = {
    children: JSX.Element | JSX.Element[]
}

type StyleContext = {
    style: Style
    switchStyle: (style: "dark" | "light") => void
}

const StyleContext = createContext<StyleContext | null>(null)

/** Context especializado na definição do estilo da aplicação */
export default function StyleContextComponent({ children }: StyleContextProps) {
    const db = useSQLiteContext()
    const [ loading, setLoading ] = useState<boolean>(true)
    const [ style, setStyle ] = useState<Style>(DarkStyle)

    const fetchStyle = async () => {
        await db.getFirstAsync<{ is_dark_style: number }>('SELECT is_dark_style FROM PARAMS')
            .then(result => {
                if (result) {
                    switchStyle(result.is_dark_style ? "dark" : "light")
                    setLoading(false)
                }
            })
    }

    useEffect(() => {
        fetchStyle()
    }, [])

    const switchStyle = async (_style: "dark" | "light") => {
        await db.runAsync(`UPDATE PARAMS SET is_dark_style = ${ _style === "dark" ? "1" : "0" }`)
        setStyle(_style === "dark" ? DarkStyle : LightStyle)
    }

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
        <StyleContext.Provider value={{
            style,
            switchStyle,
        }}>
            { children }
        </StyleContext.Provider>
    )
}

export function StyleContextProvider() {
    const context = useContext(StyleContext)
    if (!context) throw new Error("StyleContext chamado fora do provider.")
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