import { StyleSheet } from "react-native"
import Box from "@/components/base/Box"
import DatePicker from "@/components/customs/DatePicker"
import MonthParser from "@/utils/MonthParser"
import TextBold from "@/components/base/TextBold"

export type MonthExtractorProps = {
    initialDate: Date
    onChange: (date: Date) => void
}

export default function MonthExtractor({
    initialDate,
    onChange,
}: MonthExtractorProps) {
    return (
        <Box.Center style={ styles.container }>
            <Box.Row style={ styles.dateTextContainer }>
                <TextBold style={ styles.dateText }>
                    { MonthParser(initialDate.getMonth() + 1) }
                </TextBold>
                <TextBold style={ styles.dateText }>
                    { initialDate.getFullYear() }
                </TextBold>
            </Box.Row>
            <DatePicker
                date={ initialDate }
                onChange={ (e) => onChange(e) }
                buttonProps={{
                    title: "Selecione um mês",
                    onPress: () => {}
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