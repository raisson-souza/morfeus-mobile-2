import { StyleSheet } from "react-native"
import Box from "@/components/base/Box"
import CustomText from "./CustomText"
import DatePicker from "@/components/customs/DatePicker"
import MonthParser from "@/utils/MonthParser"

export type MonthExtractorProps = {
    initialDate: Date
    onChange: (date: Date) => void
}

/** **DEPRECATED** */
export default function MonthExtractor({
    initialDate,
    onChange,
}: MonthExtractorProps) {
    return (
        <Box.Center style={ styles.container }>
            <Box.Row style={ styles.dateTextContainer }>
                <CustomText
                    style={ styles.dateText }
                    weight="bold"
                >
                    { MonthParser(initialDate.getMonth() + 1) }
                </CustomText>
                <CustomText
                    style={ styles.dateText }
                    weight="bold"
                >
                    { initialDate.getFullYear() }
                </CustomText>
            </Box.Row>
            <DatePicker
                date={ initialDate }
                onChange={ (e) => onChange(e) }
                buttonProps={{
                    title: "Selecione um mês",
                    onPress: () => {},
                }}
            />
        </Box.Center>
    )
}

const styles = StyleSheet.create({
    container: {
        gap: 5,
    },
    dateTextContainer: {
        gap: 5,
    },
    dateText: {
        fontSize: 20,
    },
})