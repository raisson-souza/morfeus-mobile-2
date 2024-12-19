import { Switch, Text, View, StyleSheet, SwitchProps, StyleProp, TextStyle } from "react-native"

type CustomSwitchProps = {
    label: string
    labelStyle?: StyleProp<TextStyle>
    value: boolean
    onChange: (e: boolean) => any
    innerProps?: SwitchProps
}

export default function CustomSwitch({ label, labelStyle = {}, value, onChange, innerProps }: CustomSwitchProps) {
    return (
        <View style={ styles.switch }>
            <Text style={ labelStyle }>{ label }</Text>
            <Switch
                value={ value }
                onValueChange={ (e) => onChange(e) }
                { ...innerProps }
            />
        </View>
    )
}

const styles = StyleSheet.create({
    switch: {
        display: "flex",
        flexDirection: "row",
        gap: 5,
        alignItems: "center",
    },
})