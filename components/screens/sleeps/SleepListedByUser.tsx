import { DateFormatter } from "@/utils/DateFormatter"
import { SleepListedByUserType } from "@/types/sleeps"
import { StyleSheet, Text } from "react-native"
import { useRouter } from "expo-router"
import Box from "@/components/base/Box"
import IconFeather from "react-native-vector-icons/Feather"
import React from "react"
import TextBold from "@/components/base/TextBold"

type SleepListedByUserProps = {
    sleepCycle: SleepListedByUserType
}

export default function SleepListedByUser({
    sleepCycle,
}: SleepListedByUserProps) {
    const router = useRouter()

    const fixDate = () => {
        const splitedFormattedDate = DateFormatter
            .removeTime(sleepCycle.date)
            .split("-")
        return `${ splitedFormattedDate[2] }-${ splitedFormattedDate[1] }`
    }
    const fixedDate = fixDate()

    const renderTime = (time: string) => {
        const date = DateFormatter.fixUTC(new Date(time).getTime())
        return DateFormatter.removeDate(date.toISOString())
    }

    const renderIsNightSleep = () => {
        return sleepCycle.isNightSleep
            ? <IconFeather name="moon" size={ 20 } />
            : <IconFeather name="sun" size={ 20 } />
    }

    const renderSleepTime = () => {
        return sleepCycle.sleepTime != 0
            ? <Text>{ `${ sleepCycle.sleepTime } horas` }</Text>
            : <></>
    }

    return (
        <Box.Row style={ styles.container }>
            <Box.Column
                onPress={ () => router.navigate({
                    pathname: "/(tabs)/(sleeps)/getSleep",
                    params: { "id": sleepCycle.id },
                }) }
                style={ styles.dayContainer }
            >
                <Box.Row style={ styles.dayIconContainer }>
                    { renderIsNightSleep() }
                    <TextBold>{ fixedDate }</TextBold>
                </Box.Row>
            </Box.Column>
            <Box.Column style={ styles.sleepTimesContainer }>
                <Box.Row style={ styles.sleepTimeContainer }>
                    <IconFeather name={ "sunset" } size={ 22 } />
                    <Text>{ renderTime(sleepCycle.sleepStart) }</Text>
                </Box.Row>
                <Box.Row style={ styles.sleepTimeContainer }>
                    <IconFeather name={ "sunrise" } size={ 22 } />
                    <Text>{ renderTime(sleepCycle.sleepEnd) }</Text>
                </Box.Row>
            </Box.Column>
            { renderSleepTime() }
        </Box.Row>
    )
}

const styles = StyleSheet.create({
    container: {
        borderTopWidth: 1,
        width: '100%',
        justifyContent: "space-around",
        alignItems: "center",
        padding: 3,
    },
    dayContainer: {
        alignItems: "center",
    },
    dayIconContainer: {
        gap: 3,
    },
    sleepTimesContainer: {
        gap: 5,
    },
    sleepTimeContainer: {
        alignItems: "center",
        gap: 5,
    },
})
