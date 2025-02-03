import DefaultLoadingScreen from "@/components/screens/general/DefaultLoadingScreen"
import React, { createContext, useContext, useEffect, useRef, useState } from "react"

type InitialContextProps = {
    children: JSX.Element | JSX.Element[]
}

type InitialContext = {}

const InitialContext = createContext<InitialContext | null>(null)

/** Context especializado no tratamento / carregamento de dados iniciais da aplicação */
export default function InitialContextComponent({ children }: InitialContextProps) {
    const [ loading, setLoading ] = useState<boolean>(true)
    const initialLoadIntervalRef = useRef<NodeJS.Timeout | null>(null)

    useEffect(() => {
        const interval = setInterval(() => {
            setLoading(false)
            clearInterval(initialLoadIntervalRef.current!)
        }, 1000)
        initialLoadIntervalRef.current = interval
    }, [])

    if (loading) return <DefaultLoadingScreen />

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