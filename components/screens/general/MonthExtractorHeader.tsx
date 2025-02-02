import { StyleSheet } from "react-native"
import Box from "@/components/base/Box"
import CustomButton from "@/components/customs/CustomButton"
import MonthParser from "@/utils/MonthParser"
import MonthYearExtractor from "@/components/customs/MonthYearExtractor"
import React, { useState } from "react"
import TextBold from "@/components/base/TextBold"

type MonthExtractorHeaderProps = {
    onChange: (e: Date) => void
    defaultDate: Date
    routerBtnRouterAction: () => void
    firstCustomActionBtnTitle: string
    firstCustomActionBtnAction: () => void
    isFirstCustomActionBtnActive?: boolean
    secondCustomActionBtnTitle?: string
    secondCustomActionBtnAction?: () => void
    isSecondCustomActionBtnActive?: boolean
}

export default function MonthExtractorHeader({
    onChange,
    defaultDate,
    routerBtnRouterAction,
    firstCustomActionBtnTitle,
    firstCustomActionBtnAction,
    isFirstCustomActionBtnActive = true,
    secondCustomActionBtnTitle,
    secondCustomActionBtnAction = () => {},
    isSecondCustomActionBtnActive = true,
}: MonthExtractorHeaderProps) {
    const [ open, setOpen ] = useState<boolean>(false)

    return (
        <Box.Row style={ styles.container }>
            <MonthYearExtractor
                open={ open }
                setOpen={ setOpen }
                defaultMonth={ defaultDate.getMonth() + 1 }
                defaultYear={ defaultDate.getFullYear()} 
                onChange={ (e) => onChange(e) }
            />
            <Box.Column style={ styles.dateContainer }>
                <TextBold style={ styles.dateText }>
                    { `${ MonthParser(defaultDate.getMonth() + 1) } ${ defaultDate.getFullYear() }` }
                </TextBold>
                <CustomButton
                    title="Selecionar Mês"
                    onPress={ () => setOpen(true) }
                />
            </Box.Column>
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
        justifyContent: 'space-around',
        alignItems: "center",
    },
    btns: {
        gap: 5,
        width: "45%",
    },
    dateContainer: {
        gap: 5,
    },
    dateText: {
        fontSize: 20,
    },
})