import { DateFormatter } from "@/utils/DateFormatter"
import { StyleSheet } from "react-native"
import Box from "@/components/base/Box"
import DatePickerShow from "@/components/date/DatePickerShow"
import React from "react"
import TextBold from "@/components/base/TextBold"
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
    return (
        <Box.Row style={ styles.container }>
            <Box.Column style={ styles.sleepCyclePeriod }>
                <TextBold>Horário de dormir</TextBold>
                <DatePickerShow
                    date={ sleepStart }
                    onChange={ (e) => onChange("start", DateFormatter.persistDateOrTime(e, sleepStart)) }
                />
                <TimePickerShow
                    time={ sleepStart }
                    onChange={ (e) => onChange("start", DateFormatter.persistDateOrTime(sleepStart, e)) }
                />
            </Box.Column>
            <Box.Column style={ styles.sleepCyclePeriod }>
                <TextBold>Horário de acordar</TextBold>
                <DatePickerShow
                    date={ sleepEnd }
                    onChange={ (e) => onChange("end", DateFormatter.persistDateOrTime(e, sleepEnd)) }
                />
                <TimePickerShow
                    time={ sleepEnd }
                    onChange={ (e) => onChange("end", DateFormatter.persistDateOrTime(sleepEnd, e)) }
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
})