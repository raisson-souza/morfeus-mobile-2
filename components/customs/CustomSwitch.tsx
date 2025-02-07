import { Switch, StyleSheet, SwitchProps, StyleProp, TextStyle } from "react-native"
import Box from "../base/Box"
import CustomText from "./CustomText"

type CustomSwitchProps = {
    label: string
    labelStyle?: StyleProp<TextStyle>
    value: boolean
    onChange: (e: boolean) => any
    innerProps?: SwitchProps
}

export default function CustomSwitch({
    label,
    labelStyle = {},
    value,
    onChange,
    innerProps,
}: CustomSwitchProps) {
    return <Box.Row style={ styles.switch }>
        <CustomText style={ labelStyle }>{ label }</CustomText>
        <Switch
            value={ value }
            onValueChange={ (e) => onChange(e) }
            { ...innerProps }
        />
    </Box.Row>
}

const styles = StyleSheet.create({
    switch: {
        display: "flex",
        flexDirection: "row",
        gap: 5,
        alignItems: "center",
    },
})