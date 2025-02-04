import { DateTime } from "luxon"
import { Pressable, StyleSheet } from "react-native"
import { StyleContextProvider } from "@/contexts/StyleContext"
import { useState } from "react"
import AntDesignIcons from "react-native-vector-icons/AntDesign"
import Box from "../base/Box"
import CustomButton from "./CustomButton"
import CustomModal from "./CustomModal"
import CustomText from "./CustomText"
import MonthParser from "@/utils/MonthParser"

type MonthYearExtractorProps = {
    open: boolean
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
    onChange: (date: Date, month: number, year: number) => void
    defaultMonth?: number
    minMonth?: number
    maxMonth?: number
    defaultYear?: number
    minYear?: number
    maxYear?: number
}

type MonthYearExtractorDateType = {
    date: Date
    month: number
    year: number
}

export default function MonthYearExtractor({
    open,
    setOpen,
    onChange,
    defaultMonth = new Date().getMonth() + 1,
    minMonth = 1,
    maxMonth = 12,
    defaultYear = new Date().getFullYear(),
    minYear = 1900,
    maxYear,
}: MonthYearExtractorProps) {
    const { systemStyle } = StyleContextProvider()
    const parseDate = (month: number, year: number) => DateTime.now().set({ year: year, month: month, day: 10 }).toJSDate()

    const [ date, setDate ] = useState<MonthYearExtractorDateType>({
        date: parseDate(defaultMonth, defaultYear),
        month: defaultMonth <= minMonth
            ? minMonth
            : defaultMonth,
        year: defaultYear,
    })

    const renderMonths = () => {
        const months: JSX.Element[] = []

        for (let i = 1; i <= 12; i++) {
            const isChosenMonth = i === date.month
            const isAllowedMonth = !(i < minMonth || i > maxMonth)
            months.push(
                <Pressable
                    key={ i }
                    onPress={ () => {
                        if (isAllowedMonth) setDate({ ...date, month: i, date: parseDate(i, date.year) })
                    }}
                    style={{
                        ...styles.month,
                        backgroundColor: isAllowedMonth ? systemStyle.secondary : "gray",
                        borderWidth: isChosenMonth ? 1 : 0,
                        borderColor: isChosenMonth ? systemStyle.oppositeIconColor : systemStyle.iconColor,
                        margin: isChosenMonth ? 0 : 1,
                    }}
                >
                    <CustomText
                        weight="bold"
                        isOpposite
                        onPress={ () => {
                            if (isAllowedMonth) setDate({ ...date, month: i, date: parseDate(i, date.year) })
                        }}
                    >
                        { MonthParser(i) }
                    </CustomText>
                </Pressable>
            )
        }

        return months
    }

    const advanceYear = (newYear: number) => {
        if (maxYear) {
            if (newYear <= maxYear)
                setDate({ ...date, year: newYear, date: parseDate(date.month, newYear) })
        }
        else {
            setDate({ ...date, year: newYear, date: parseDate(date.month, newYear) })
        }
    }

    const retreatYear = (newYear: number) => {
        if (newYear >= minYear)
            setDate({ ...date, year: newYear, date: parseDate(date.month, newYear) })
    }

    return <CustomModal
        visible={ open }
        setVisible={ setOpen }
        canOutsideClickClose={ false }
    >
        <Box.Column style={{
            ...styles.container,
            backgroundColor: systemStyle.primary
        }}>
            <Box.Row style={ styles.monthContainer }>
                { renderMonths() }
            </Box.Row>
            <Box.Row style={ styles.yearContainer }>
                <AntDesignIcons
                    name="left"
                    size={ systemStyle.extraLargeIconSize }
                    color={ date.year === minYear ? "gray" : "white" }
                    onPress={ () => retreatYear(date.year - 1)}
                />
                <CustomText
                    weight="bold"
                    isOpposite
                >
                    { date.year }
                </CustomText>
                <AntDesignIcons
                    name="right"
                    size={ systemStyle.extraLargeIconSize }
                    color={ 
                        maxYear
                            ? date.year === maxYear
                                ? systemStyle.inactiveIconColor
                                : systemStyle.oppositeIconColor
                            : systemStyle.oppositeIconColor
                    }
                    onPress={ () => advanceYear(date.year + 1)}
                />
            </Box.Row>
            <Box.Row style={ styles.btnsContainer }>
                <CustomButton
                    title="CANCELAR"
                    onPress={ () => setOpen(false) }
                    btnWidth={ 120 }
                    btnTextColor={ systemStyle.oppositeTextColor }
                    titleStyle={{
                        fontWeight: "300",
                        fontSize: systemStyle.normalTextSize,
                    }}
                />
                <CustomButton
                    title="OK"
                    onPress={ () => {
                        onChange(date.date, date.month, date.year)
                        setOpen(false)
                    }}
                    btnWidth={ 120 }
                    btnTextColor={ systemStyle.oppositeTextColor }
                    titleStyle={{
                        fontWeight: "300",
                        fontSize: systemStyle.normalTextSize,
                    }}
                />
            </Box.Row>
        </Box.Column>
    </CustomModal>
}

const styles = StyleSheet.create({
    container: {
        width: "80%",
        padding: 10,
        borderRadius: 15,
        alignItems: "center",
        gap: 20,
    },
    yearContainer: {
        alignItems: "center",
        gap: 20,
    },
    monthContainer: {
        alignItems: "center",
        flexWrap: "wrap",
        gap: 10,
        width: "100%",
    },
    month: {
        padding: 5,
        borderRadius: 10,
        width: 120,
        alignItems: "center",
    },
    btnsContainer: {
        width: "100%",
        gap: 20,
    },
})