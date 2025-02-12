import { DateFormatter } from "@/utils/DateFormatter"
import { SleepListedByUserType } from "@/types/sleeps"
import { StyleContextProvider } from "@/contexts/StyleContext"
import { StyleSheet } from "react-native"
import { useRouter } from "expo-router"
import Box from "@/components/base/Box"
import CustomText from "@/components/customs/CustomText"
import IconFeather from "react-native-vector-icons/Feather"
import React from "react"

type SleepListedByUserProps = {
    sleepCycle: SleepListedByUserType
}

export default function SleepListedByUser({
    sleepCycle,
}: SleepListedByUserProps) {
    const { systemStyle } = StyleContextProvider()
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

    return (
        <Box.Row
            style={{
                ...styles.container,
                borderTopColor: systemStyle.textColor,
            }}
            onPress={ () => router.navigate({
                pathname: "/(tabs)/(sleeps)/getSleep",
                params: { "id": sleepCycle.id },
            }) }
        >
            <Box.Column
                style={{
                    ...styles.dayContainer,
                    width: "30%",
                }}
            >
                <Box.Row style={ styles.dayIconContainer }>
                    { renderIsNightSleep() }
                    <CustomText weight="bold">{ fixedDate }</CustomText>
                </Box.Row>
            </Box.Column>
            <Box.Column
                style={{
                    ...styles.sleepTimesContainer,
                    width: "40%",
                }}
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
            <Box.Center
                style={{
                    width: "33%",
                }}
            >
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
        padding: 3,
    },
    dayContainer: {
        alignItems: "center",
    },
    dayIconContainer: {
        gap: 5,
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
