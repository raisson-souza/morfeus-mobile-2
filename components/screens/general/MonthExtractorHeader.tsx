import { StyleSheet } from "react-native"
import Box from "@/components/base/Box"
import CustomButton from "@/components/customs/CustomButton"
import MonthExtractor, { MonthExtractorProps } from "./MonthExtractor"
import React from "react"

type MonthExtractorHeaderProps = {
    monthExtractorProps: MonthExtractorProps
    routerBtnRouterAction: () => void
    firstCustomActionBtnTitle: string
    firstCustomActionBtnAction: () => void
    isFirstCustomActionBtnActive?: boolean
    secondCustomActionBtnTitle?: string
    secondCustomActionBtnAction?: () => void
    isSecondCustomActionBtnActive?: boolean
}

export default function MonthExtractorHeader({
    monthExtractorProps,
    routerBtnRouterAction,
    firstCustomActionBtnTitle,
    firstCustomActionBtnAction,
    isFirstCustomActionBtnActive = true,
    secondCustomActionBtnTitle,
    secondCustomActionBtnAction = () => {},
    isSecondCustomActionBtnActive = true
}: MonthExtractorHeaderProps) {
    return (
        <Box.Row style={ styles.container }>
            <MonthExtractor { ...monthExtractorProps } />
            <Box.Column style={ styles.btns }>
                <CustomButton
                    title="Ver Mais"
                    onPress={ () => routerBtnRouterAction() }
                />
                {
                    secondCustomActionBtnTitle
                        ? <CustomButton
                            title={ secondCustomActionBtnTitle }
                            onPress={ () => secondCustomActionBtnAction() }
                            active={ isSecondCustomActionBtnActive }
                        />
                        : <></>
                }
                <CustomButton
                    title={ firstCustomActionBtnTitle }
                    onPress={ () => firstCustomActionBtnAction() }
                    active={ isFirstCustomActionBtnActive }
                    important
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