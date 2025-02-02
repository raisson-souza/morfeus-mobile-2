import { DateTime } from "luxon"
import { Pressable, StyleSheet } from "react-native"
import { useState } from "react"
import AntDesignIcons from "react-native-vector-icons/AntDesign"
import Box from "../base/Box"
import CustomButton from "./CustomButton"
import CustomModal from "./CustomModal"
import MonthParser from "@/utils/MonthParser"
import TextBold from "../base/TextBold"

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
                        backgroundColor: isAllowedMonth ? styles.month.backgroundColor : "gray",
                        borderWidth: isChosenMonth ? 1 : 0,
                        borderColor: isChosenMonth ? "white" : "black",
                        margin: isChosenMonth ? 0 : 1,
                    }}
                >
                    <TextBold style={ styles.monthText }>{ MonthParser(i) }</TextBold>
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
        <Box.Column style={ styles.container }>
            <Box.Row style={ styles.monthContainer }>
                    { renderMonths() }
            </Box.Row>
            <Box.Row style={ styles.yearContainer }>
                <AntDesignIcons
                    name="left"
                    size={ 50 }
                    color={ date.year === minYear ? "gray" : "white" }
                    onPress={ () => retreatYear(date.year - 1)}
                />
                <TextBold style={ styles.yearText }>
                    { date.year }
                </TextBold>
                <AntDesignIcons
                    name="right"
                    size={ 50 }
                    color={ 
                        maxYear
                            ? date.year === maxYear
                                ? "gray" : "white"
                            : "white"
                    }
                    onPress={ () => advanceYear(date.year + 1)}
                />
            </Box.Row>
            <Box.Row style={ styles.btnsContainer }>
                <CustomButton
                    title="CANCELAR"
                    onPress={ () => setOpen(false) }
                    btnTextColor="white"
                />
                <CustomButton
                    title="OK"
                    onPress={ () => {
                        onChange(date.date, date.month, date.year)
                        setOpen(false)
                    }}
                    btnTextColor="white"
                    btnWidth={ 100 }
                />
            </Box.Row>
        </Box.Column>
    </CustomModal>
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "darkblue",
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
    yearText: {
        fontSize: 20,
        color: "white",
    },
    monthText: {
        fontSize: 18,
        color: "white",
    },
    month: {
        backgroundColor: "blue",
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