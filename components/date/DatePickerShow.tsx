import { DateFormatter } from "../../utils/DateFormatter"
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker"
import { StyleContextProvider } from "@/contexts/StyleContext"
import { StyleProp, TextStyle, StyleSheet } from "react-native"
import Box from "../base/Box"
import CustomText from "../customs/CustomText"
import IconIonicons from "react-native-vector-icons/Ionicons"

type DatePickerShowProps = {
    date: Date
    onChange: (e : Date) => void
    textStyle?: StyleProp<TextStyle>
    iconSize?: number
    iconColor?: string
}

export default function DatePickerShow({
    date,
    onChange,
    textStyle,
    iconSize,
    iconColor,
}: DatePickerShowProps) {
    const { systemStyle } = StyleContextProvider()
    iconSize = iconSize ? iconSize : systemStyle.normalIconSize
    iconColor = iconColor ? iconColor : systemStyle.iconColor

    const openDatePicker = () => {
        DateTimePickerAndroid.open({
            value: date,
            onChange: (event, newDate) => {
                if (event.type === "set") {
                    if (newDate) {
                        if (newDate.getTime() === date.getTime()) return
                        onChange(newDate)
                    }
                }
            },
            mode: "date",
            is24Hour: true,
            timeZoneName: "America/Sao_Paulo",
        })
    }

    return (
        <Box.Row style={ styles.container }>
            <CustomText
                style={ textStyle }
                onPress={ () => openDatePicker() }
            >
                { DateFormatter.removeTime(date.toISOString()) }
            </CustomText>
            <IconIonicons
                name="calendar-outline"
                size={ iconSize }
                color={ iconColor }
                onPress={ () => openDatePicker() }
            />
        </Box.Row>
    )
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        gap: 5,
    },
})