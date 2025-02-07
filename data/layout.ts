import { StyleContextProvider } from "@/contexts/StyleContext"

export function GetTabStyle() {
    try {
        const { systemStyle } = StyleContextProvider()
        return {
            /** Cor de fundo da tab ativa */
            tabBarActiveBackgroundColor: systemStyle.secondary,
            /** Cor de fundo das tabs inativas */
            tabBarInactiveBackgroundColor: systemStyle.primary,
            /** Cor de título do header da tab atual */
            headerTintColor: systemStyle.headerTextColor,
            headerStyle: {
                /** Cor de fundo do header da tab atual */
                backgroundColor: systemStyle.headerBackgroundColor,
            },
            tabBarStyle: {
                /** Cor de fundo do footer */
                backgroundColor: systemStyle.footerBackgroundColor,
            },
            tabBarLabelStyle: {
                /** Cor do texto das tabs */
                color: systemStyle.footerTextColor,
                /** Tamanho do texto das tabs */
                fontSize: systemStyle.footerTextSize,
            },
        }
    }
    catch { return {} }
}

export function GetStackStyle() {
    try {
        const { systemStyle } = StyleContextProvider()
        return {
            /** Cor do header */
            headerStyle: {
                backgroundColor: systemStyle.headerBackgroundColor,
            },
            /** Cor do título do header */
            headerTintColor: systemStyle.headerTextColor,
        }
    }
    catch { // headerStyle e headerTintColor com valores mockados devido a ordem de renderização do primeiro layout
        return {
            headerStyle: {
                backgroundColor: "#00008B",
            },
            headerTintColor: "#fff",
        }
    }
}