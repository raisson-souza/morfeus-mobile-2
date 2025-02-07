import { CreateCompleteDreamModel, DreamNoSleepDateKnownPeriods } from "@/types/dream"
import { DateTime } from "luxon"
import { Picker } from "@react-native-picker/picker"
import { StyleContextProvider } from "@/contexts/StyleContext"
import { StyleSheet } from "react-native"
import { useEffect } from "react"
import Box from "@/components/base/Box"
import CustomText from "@/components/customs/CustomText"
import DatePickerShow from "@/components/date/DatePickerShow"

type SleepExtractionByDateProps = {
    setDate: React.Dispatch<React.SetStateAction<CreateCompleteDreamModel>>
    date: CreateCompleteDreamModel
    defaultDate: DateTime<true>
}

export default function SleepExtractionByDate({
    date,
    setDate,
    defaultDate,
}: SleepExtractionByDateProps) {
    const { systemStyle } = StyleContextProvider()
    const sleepDate = date.dreamNoSleepDateKnown?.date ?? defaultDate.toJSDate()
    const sleepPeriod = date.dreamNoSleepDateKnown?.period ?? "morning"

    useEffect(() => {
        setDate({
            ...date,
            dreamNoSleepDateKnown: {
                date: sleepDate,
                period: sleepPeriod,
            }
        })
    }, [])

    return (
        <Box.Column style={ styles.container }>
            <CustomText isOpposite>Defina a data do ciclo de sono referente</CustomText>
            <DatePickerShow
                date={ sleepDate }
                onChange={ (e) => {
                    setDate({
                        ...date,
                        dreamNoSleepDateKnown: {
                            period: sleepPeriod,
                            date: e,
                        }
                    })
                }}
                iconColor={ systemStyle.oppositeIconColor }
                textStyle={{
                    color: systemStyle.oppositeTextColor,
                }}
            />
            <CustomText isOpposite>Defina o período do ciclo de sono</CustomText>
            <Picker
                selectedValue={ sleepPeriod }
                onValueChange={ (e) => {
                    setDate({
                        ...date,
                        dreamNoSleepDateKnown: {
                            date: sleepDate,
                            period: e as DreamNoSleepDateKnownPeriods,
                        }
                    })
                }}
                style={{
                    color: systemStyle.oppositeIconColor,
                }}
            >
                <Picker.Item label="Manhã" value="morning" />
                <Picker.Item label="Tarde" value="afternoon" />
                <Picker.Item label="Noite" value="night" />
            </Picker>
        </Box.Column>
    )
}

const styles = StyleSheet.create({
    container: {
        gap: 10,
    },
})