import { StyleContextProvider } from "@/contexts/StyleContext"
import { StyleSheet } from "react-native"
import { useState } from "react"
import Box from "@/components/base/Box"
import CustomSwitch from "@/components/customs/CustomSwitch"
import CustomText from "@/components/customs/CustomText"

export default function StyleSwitcher() {
    const { style, switchStyle } = StyleContextProvider()
    const [ styleName, setStyle ] = useState<"dark" | "light">(style.styleName === "default"
        ? "light"
        : style.styleName === "light"
            ? "light"
            : "dark"
    )

    const switchStyleAction = async (e: boolean) => {
        setStyle(e ? "dark" : "light")
        await switchStyle(e ? "dark" : "light")
    }

    return (
        <Box.Column style={ styles.container }>
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
                    _style={{ paddingLeft: 15 }}
                >Escuro</CustomText>
            </Box.Row>
        </Box.Column>
    )
}

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
    },
    switch: {
        alignItems: "center",
    }
})