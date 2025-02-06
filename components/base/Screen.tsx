import { DefaultStyle } from "@/data/style"
import { StyleContextProvider } from "@/contexts/StyleContext"
import { StyleSheet, ScrollView, StyleProp, ViewStyle } from "react-native"

type ScreenProps = {
    children: JSX.Element[] | JSX.Element
    flex?: boolean
    compStyle?: StyleProp<ViewStyle>
}

/** Componente padrão de tela */
export const Screen: React.FC<ScreenProps> = ({
    children,
    flex = false,
    compStyle = {},
}) => {
    const systemStyle = GetSystemStyle()

    const flexStyle = flex
        ? {
            justifyContent: 'center',
            alignItems: 'center',
        }
        : {
            justifyContent: 'flex-start',
            alignItems: 'center',
        }

    return (
        <ScrollView
            contentContainerStyle={{
                ...styles.container,
                ...flexStyle,
                ...compStyle as any,
                backgroundColor: systemStyle.backgroundColor,
                flexGrow: 1,
            }}
        >
            { children }
        </ScrollView>
    )
}

const GetSystemStyle = () => {
    try {
        const { systemStyle } = StyleContextProvider()
        return systemStyle
    }
    catch {
        return DefaultStyle
    }
}

const styles = StyleSheet.create({
    container: {
        display: "flex",
        flexDirection: "column",
        width: "100%",
        padding: 10,
    },
})