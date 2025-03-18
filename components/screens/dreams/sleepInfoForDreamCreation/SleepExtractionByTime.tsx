import { CreateCompleteDreamModel } from "@/types/dream"
import { DateFormatter } from "@/utils/DateFormatter"
import { DateTime } from "luxon"
import { StyleContextProvider } from "@/contexts/StyleContext"
import { StyleSheet } from "react-native"
import { useEffect, useState } from "react"
import Box from "@/components/base/Box"
import CustomSwitch from "@/components/customs/CustomSwitch"
import CustomText from "@/components/customs/CustomText"
import DatePickerShow from "@/components/date/DatePickerShow"
import TimePickerShow from "@/components/date/TimePickerShow"

type SleepExtractionByTimeProps = {
    setDate: React.Dispatch<React.SetStateAction<CreateCompleteDreamModel>>
    date: CreateCompleteDreamModel
    defaultDate: DateTime<true>
}

export default function SleepExtractionByTime({
    date,
    setDate,
    defaultDate,
}: SleepExtractionByTimeProps) {
    const { systemStyle } = StyleContextProvider()
    const [ isSleepStartYesterday, setIsSleepStartYesterday ] = useState<boolean>(false)
    const parsedDefaultDate = DateFormatter.fixUTC(defaultDate.toMillis())

    const sleepDate = date.dreamNoSleepTimeKnown?.date ?? parsedDefaultDate
    const sleepStart = date.dreamNoSleepTimeKnown?.sleepStart ?? parsedDefaultDate
    const sleepEnd = date.dreamNoSleepTimeKnown?.sleepEnd ?? parsedDefaultDate

    useEffect(() => {
        setDate({
            ...date,
            dreamNoSleepTimeKnown: {
                date: sleepDate,
                sleepStart: sleepStart,
                sleepEnd: sleepEnd,
            }
        })
    }, [])

    return (
        <Box.Column style={ styles.container }>
            <CustomSwitch
                label="Dormiu no dia anterior?"
                onChange={ (e) => setIsSleepStartYesterday(e) }
                value={ isSleepStartYesterday }
                labelStyle={{ color: systemStyle.oppositeIconColor }}
            />
            <CustomText isOpposite weight="bold">Data referente ao ciclo de sono</CustomText>
            <DatePickerShow
                date={ sleepDate }
                onChange={ (e) => {
                    setDate({
                        ...date,
                        dreamNoSleepTimeKnown: {
                            date: e,
                            sleepStart: sleepStart,
                            sleepEnd: sleepEnd,
                        }
                    })
                }}
                textStyle={{
                    color: systemStyle.oppositeTextColor,
                }}
                iconColor={ systemStyle.oppositeIconColor }
            />
            <CustomText isOpposite weight="bold">Horário de dormir</CustomText>
            <TimePickerShow
                time={ sleepStart }
                onChange={ (e) => {
                    const newTime = DateTime.fromJSDate(e)
                    const newSleepStart = isSleepStartYesterday
                        ? DateTime.fromMillis(defaultDate.toMillis()).set({ hour: newTime.hour, minute: newTime.minute, second: newTime.second }).minus({ day: 1 })
                        : DateTime.fromMillis(defaultDate.toMillis()).set({ hour: newTime.hour, minute: newTime.minute, second: newTime.second })
                    setDate({
                        ...date,
                        dreamNoSleepTimeKnown: {
                            date: sleepDate,
                            sleepStart: newSleepStart.toJSDate(),
                            sleepEnd: sleepEnd,
                        }
                    })
                }}
                textStyle={{
                    color: systemStyle.oppositeTextColor
                }}
                iconColor={ systemStyle.oppositeIconColor }
            />
            <CustomText isOpposite weight="bold">Horário de acordar</CustomText>
            <TimePickerShow
                time={ sleepEnd }
                onChange={ (e) => {
                    const newTime = DateTime.fromJSDate(e)
                    const newSleepEnd = DateTime.fromMillis(defaultDate.toMillis()).set({ hour: newTime.hour, minute: newTime.minute, second: newTime.second })
                    setDate({
                        ...date,
                        dreamNoSleepTimeKnown: {
                            date: sleepDate,
                            sleepStart: sleepStart,
                            sleepEnd: newSleepEnd.toJSDate(),
                        }
                    })
                }}
                textStyle={{
                    color: systemStyle.oppositeTextColor,
                }}
                iconColor={ systemStyle.oppositeIconColor }
            />
        </Box.Column>
    )
}

const styles = StyleSheet.create({
    container: {
        gap: 10,
    },
})