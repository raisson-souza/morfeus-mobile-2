import { DateFormatter } from "@/utils/DateFormatter"
import { DateTime } from "luxon"
import { SleepListedByUserType } from "@/types/sleeps"
import { StyleContextProvider } from "@/contexts/StyleContext"
import { StyleSheet } from "react-native"
import { useRouter } from "expo-router"
import { useSQLiteContext } from "expo-sqlite"
import Box from "@/components/base/Box"
import CustomText from "@/components/customs/CustomText"
import IconFeather from "react-native-vector-icons/Feather"
import IconMaterialIcons from "react-native-vector-icons/MaterialIcons"
import React, { useEffect, useState } from "react"
import SleepServiceOffline from "@/services/offline/SleepServiceOffline"
import WeekDayParser from "@/utils/WeekDayParser"

type SleepListedByUserProps = {
    sleepCycle: SleepListedByUserType
    useSync?: boolean
}

export default function SleepListedByUser({
    sleepCycle,
    useSync = false,
}: SleepListedByUserProps) {
    const db = useSQLiteContext()
    const router = useRouter()
    const { systemStyle } = StyleContextProvider()
    const [ synchronizedRecord, setSynchronizedRecord ] = useState<boolean>(false)

    const checkSynchronizedRecord = async () => {
        if (useSync) {
            await SleepServiceOffline.CheckIsSynchronized(db, sleepCycle.id)
                .then(result => setSynchronizedRecord(result))
        }
    }

    useEffect(() => { checkSynchronizedRecord() })

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
            ? <IconFeather
                name="moon"
                size={ systemStyle.normalIconSize }
                color={ systemStyle.iconColor }
            />
            : <IconFeather
                name="sun"
                size={ systemStyle.normalIconSize }
                color={ systemStyle.iconColor }
            />
    }

    const renderSleepTime = () => {
        const fixedSleepTime = Number.parseFloat(sleepCycle.sleepTime.toFixed(2))
        return fixedSleepTime != 0
            ? <CustomText size="s">{ `${ fixedSleepTime } ${ fixedSleepTime === 1 ? "hora" : "horas" }` }</CustomText>
            : <CustomText size="s">-----</CustomText>
    }

    const redirectToSleepCycle = () => {
        router.navigate({
            pathname: "/(tabs)/(sleeps)/getSleep",
            params: { "id": sleepCycle.id },
        })
    }

    const renderWeekDay = (): string | null => {
        try {
            const weekDay = DateTime.fromISO(sleepCycle.date).weekday
            return WeekDayParser(weekDay, true)
        }
        catch { return null }
    }
    const weekDay = renderWeekDay()

    return (
        <Box.Row
            style={{
                ...styles.container,
                borderTopColor: systemStyle.textColor,
            }}
        >
            <Box.Column
                style={{
                    ...styles.dayContainer,
                    width: "35%",
                }}
                onPress={ () => redirectToSleepCycle() }
            >
                <Box.Row style={ styles.dayIconContainer }>
                    {
                        useSync
                            ? synchronizedRecord
                                ? <></>
                                :<IconMaterialIcons
                                    name="sync-problem"
                                    color="red"
                                    size={ systemStyle.largeIconSize }
                                />
                            : <></>
                    }
                    { renderIsNightSleep() }
                    <CustomText weight="bold">{ fixedDate }</CustomText>
                </Box.Row>
                {
                    weekDay
                        ? <CustomText size="s" weight="thin">{ weekDay }</CustomText>
                        : <></>
                }
            </Box.Column>
            <Box.Column
                style={{
                    ...styles.sleepTimesContainer,
                    width: "40%",
                }}
                onPress={ () => redirectToSleepCycle() }
            >
                <Box.Row style={ styles.sleepTimeContainer }>
                    <IconFeather
                        name={ "sunset" }
                        size={ systemStyle.smallIconSize }
                        color={ systemStyle.iconColor }
                    />
                    <CustomText size="s">{ renderTime(sleepCycle.sleepStart) }</CustomText>
                </Box.Row>
                <Box.Row style={ styles.sleepTimeContainer }>
                    <IconFeather
                        name={ "sunrise" }
                        size={ systemStyle.smallIconSize }
                        color={ systemStyle.iconColor }
                    />
                    <CustomText size="s">{ renderTime(sleepCycle.sleepEnd) }</CustomText>
                </Box.Row>
            </Box.Column>
            <Box.Center style={{ width: "25%" }}>
                { renderSleepTime() }
            </Box.Center>
        </Box.Row>
    )
}

const styles = StyleSheet.create({
    container: {
        borderTopWidth: 1,
        width: '100%',
        justifyContent: "space-around",
        alignItems: "center",
        padding: 5,
    },
    dayContainer: {
        alignItems: "center",
    },
    dayIconContainer: {
        gap: 5,
        alignItems: "center",
    },
    sleepTimesContainer: {
        alignItems: "center",
        gap: 5,
    },
    sleepTimeContainer: {
        alignItems: "center",
        gap: 5,
    },
})
