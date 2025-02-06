import { DateFormatter } from "@/utils/DateFormatter"
import { StyleContextProvider } from "@/contexts/StyleContext"
import { StyleSheet } from "react-native"
import Box from "@/components/base/Box"
import CustomText from "@/components/customs/CustomText"
import DatePickerShow from "@/components/date/DatePickerShow"
import React from "react"
import TimePickerShow from "@/components/date/TimePickerShow"

type SleepCycleHoursFormProps = {
    sleepStart: Date
    sleepEnd: Date
    onChange: (period: "start" | "end", e: Date) => void
}

export default function SleepCycleHoursForm({
    sleepStart,
    sleepEnd,
    onChange,
}: SleepCycleHoursFormProps) {
    const { systemStyle } = StyleContextProvider()

    return (
        <Box.Row style={ styles.container }>
            <Box.Column style={ styles.sleepCyclePeriod }>
                <CustomText
                    style={ styles.textContainer }
                    weight="bold"
                >Horário de dormir</CustomText>
                <DatePickerShow
                    date={ sleepStart }
                    onChange={ (e) => onChange("start", DateFormatter.persistDateOrTime(e, sleepStart)) }
                    iconColor={ systemStyle.iconColor }
                />
                <TimePickerShow
                    time={ sleepStart }
                    onChange={ (e) => onChange("start", DateFormatter.persistDateOrTime(sleepStart, e)) }
                    iconColor={ systemStyle.iconColor }
                />
            </Box.Column>
            <Box.Column style={ styles.sleepCyclePeriod }>
                <CustomText
                    style={ styles.textContainer }
                    weight="bold"
                >Horário de acordar</CustomText>
                <DatePickerShow
                    date={ sleepEnd }
                    onChange={ (e) => onChange("end", DateFormatter.persistDateOrTime(e, sleepEnd)) }
                    iconColor={ systemStyle.iconColor }
                />
                <TimePickerShow
                    time={ sleepEnd }
                    onChange={ (e) => onChange("end", DateFormatter.persistDateOrTime(sleepEnd, e)) }
                    iconColor={ systemStyle.iconColor }
                />
            </Box.Column>
        </Box.Row>
    )
}

const styles = StyleSheet.create({
    container: {
        justifyContent: "space-evenly",
    },
    sleepCyclePeriod: {
        alignItems: "center",
    },
    textContainer: {
        paddingBottom: 5,
    }
})