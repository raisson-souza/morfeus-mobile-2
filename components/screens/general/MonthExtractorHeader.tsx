import { StyleSheet } from "react-native"
import Box from "@/components/base/Box"
import CustomButton from "@/components/customs/CustomButton"
import CustomText from "@/components/customs/CustomText"
import MonthParser from "@/utils/MonthParser"
import MonthYearExtractor from "@/components/customs/MonthYearExtractor"
import React, { useState } from "react"

type CustomBtn = {
    title: string
    active: boolean
    action: () => void
}

type MonthExtractorHeaderProps = {
    onChange: (e: Date) => void
    defaultDate: Date
    routerBtnRouterAction: () => void
    firstCustomBtn: CustomBtn
    secondCustomBtn?: CustomBtn
}

export default function MonthExtractorHeader({
    onChange,
    defaultDate,
    routerBtnRouterAction,
    firstCustomBtn,
    secondCustomBtn,
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
                <CustomText weight="bold">
                    { `${ MonthParser(defaultDate.getMonth() + 1) } ${ defaultDate.getFullYear() }` }
                </CustomText>
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
                    secondCustomBtn
                        ? <CustomButton
                            title={ secondCustomBtn.title }
                            onPress={ () => secondCustomBtn.action() }
                            active={ secondCustomBtn.active }
                        />
                        : <></>
                }
                <CustomButton
                    title={ firstCustomBtn.title }
                    onPress={ () => firstCustomBtn.action() }
                    active={ firstCustomBtn.active }
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
        alignItems: "center",
    },
})