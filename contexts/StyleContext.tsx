import { DarkStyle, LightStyle } from "@/data/style"
import { Style } from "@/types/style"
import { useSQLiteContext } from "expo-sqlite"
import DefaultLoadingScreen from "@/components/screens/general/DefaultLoadingScreen"
import React, { createContext, useContext, useEffect, useState } from "react"

type StyleContextProps = {
    children: JSX.Element | JSX.Element[]
}

type StyleContext = {
    systemStyle: Style
    switchSystemStyle: (style: "dark" | "light") => Promise<void>
}

const StyleContext = createContext<StyleContext | null>(null)

/** Context especializado na definição do estilo da aplicação */
export default function StyleContextComponent({ children }: StyleContextProps) {
    const db = useSQLiteContext()
    const [ loading, setLoading ] = useState<boolean>(true)
    const [ systemStyle, setSystemStyle ] = useState<Style>(LightStyle)

    const fetchStyle = async () => {
        await db.getFirstAsync<{ is_dark_style: number }>('SELECT is_dark_style FROM PARAMS')
            .then(result => {
                if (result) {
                    switchSystemStyle(result.is_dark_style ? "dark" : "light")
                    setLoading(false)
                }
            })
    }

    useEffect(() => {
        fetchStyle()
    }, [])

    const switchSystemStyle = async (_style: "dark" | "light") => {
        await db.runAsync(`UPDATE PARAMS SET is_dark_style = ${ _style === "dark" ? "1" : "0" }`)
        setSystemStyle(_style === "dark" ? DarkStyle : LightStyle)
    }

    if (loading) return <DefaultLoadingScreen />

    return (
        <StyleContext.Provider value={{
            systemStyle,
            switchSystemStyle,
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