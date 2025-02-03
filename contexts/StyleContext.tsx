import { DarkStyle, LightStyle } from "@/data/style"
import { Style } from "@/types/style"
import { useSQLiteContext } from "expo-sqlite"
import DefaultLoadingScreen from "@/components/screens/general/DefaultLoadingScreen"
import React, { createContext, useContext, useEffect, useState } from "react"

type StyleContextProps = {
    children: JSX.Element | JSX.Element[]
}

type StyleContext = {
    style: Style
    switchStyle: (style: "dark" | "light") => Promise<void>
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

    if (loading) return <DefaultLoadingScreen />

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