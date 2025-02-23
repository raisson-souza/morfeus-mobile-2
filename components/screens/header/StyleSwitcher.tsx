import { StyleContextProvider } from "@/contexts/StyleContext"
import { StyleSheet } from "react-native"
import { useState } from "react"
import Box from "@/components/base/Box"
import CustomSwitch from "@/components/customs/CustomSwitch"
import CustomText from "@/components/customs/CustomText"

export default function StyleSwitcher() {
    const { systemStyle, switchSystemStyle } = StyleContextProvider()
    const [ styleName, setStyle ] = useState<"dark" | "light">(systemStyle.styleName === "default"
        ? "light"
        : systemStyle.styleName === "light"
            ? "light"
            : "dark"
    )

    const switchStyleAction = async (e: boolean) => {
        setStyle(e ? "dark" : "light")
        await switchSystemStyle(e ? "dark" : "light")
    }

    return (
        <Box.Column
            style={{
                ...styles.container,
                backgroundColor: systemStyle.terciary,
            }}
        >
            <Box.Column>
                <CustomText
                    isOpposite
                    size="s"
                    weight="bold"
                >Estilo do Morfeus</CustomText>
            </Box.Column>
            <Box.Row style={ styles.switch }>
                <CustomText
                    isOpposite
                    size="s"
                    weight="thin"
                >Claro</CustomText>
                <CustomSwitch
                    label=""
                    value={ styleName === "light" ? false : true }
                    onChange={ async (e) => await switchStyleAction(e) }
                />
                <CustomText
                    isOpposite
                    size="s"
                    weight="thin"
                    style={{ paddingLeft: 15 }}
                >Escuro</CustomText>
            </Box.Row>
        </Box.Column>
    )
}

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        padding: 10,
        borderRadius: 15,
    },
    switch: {
        alignItems: "center",
    },
})