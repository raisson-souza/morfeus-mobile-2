import { StyleSheet } from "react-native"
import Box from "@/components/base/Box"
import CustomButton from "@/components/customs/CustomButton"
import MonthExtractor, { MonthExtractorProps } from "./MonthExtractor"

type MonthExtractorHeaderProps = {
    monthExtractorProps: MonthExtractorProps
    customActionBtnTitle: string
    customActionBtnAction: () => void
    routerBtnRouterAction: () => void
}

export default function MonthExtractorHeader({
    monthExtractorProps,
    customActionBtnTitle: actionBtnTitle,
    customActionBtnAction: actionBtnAction,
    routerBtnRouterAction: moreActionsBtnRouterAction,
}: MonthExtractorHeaderProps) {
    return (
        <Box.Row style={ styles.container }>
            <MonthExtractor { ...monthExtractorProps } />
            <Box.Column style={ styles.btns }>
                <CustomButton
                    title="Ver Mais"
                    onPress={ () => moreActionsBtnRouterAction() }
                />
                <CustomButton
                    title={ actionBtnTitle }
                    onPress={ () => actionBtnAction() }
                />
            </Box.Column>
        </Box.Row>
    )
}

const styles = StyleSheet.create({
    container: {
        width: "100%",
        justifyContent: 'space-between',
        alignItems: "center",
    },
    btns: {
        gap: 5,
    },
})