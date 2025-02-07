import { Text, StyleSheet } from "react-native"
import Box from "./Box"
import CustomButton from "../customs/CustomButton"
import CustomModal from "../customs/CustomModal"
import React from "react"
import { StyleContextProvider } from "@/contexts/StyleContext"
import CustomText from "../customs/CustomText"

type ModalActionConfirmProps = {
    title?: string
    description?: string | string[]
    isOpen: boolean
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
    onChange: (e: boolean) => void
}

export default function ModalActionConfirm({ title = "Deseja Continuar?", description, isOpen, setIsOpen, onChange }: ModalActionConfirmProps) {
    const { systemStyle } = StyleContextProvider()

    const renderDescription = (): JSX.Element => {
        if (description instanceof Array) {
            return <>
                {
                    description.map((_description, i) =>
                        <CustomText
                            isOpposite
                            key={ i }
                        >
                            { _description }
                        </CustomText>
                    )
                }
            </>
        }
        else if (description === undefined) {
            return <></>
        }
        return <Text
            style={{
                color: systemStyle.oppositeTextColor,
                fontSize: systemStyle.normalTextSize,
            }}
        >
            { description }
        </Text>
    }

    return (
        <CustomModal
            visible={ isOpen }
            setVisible={ setIsOpen }
            canOutsideClickClose={ false }
        >
            <Box.Column style={{
                ...styles.container,
                backgroundColor: systemStyle.primary,
            }}>
                <Box.Row style={{
                    ...styles.modalTitleContainer,
                    borderBottomColor: systemStyle.oppositeTextColor,
                }}>
                    <CustomText isOpposite>{ title }</CustomText>
                </Box.Row>
                <Box.Column>
                    { renderDescription() }
                </Box.Column>
                <Box.Row style={ styles.modalBtnsContainer }>
                    <CustomButton
                        title="Confirmar"
                        onPress={ () => { onChange(true); setIsOpen(false) } }
                        btnTextColor={ systemStyle.oppositeTextColor }
                        btnColor="green"
                    />
                    <CustomButton
                        title="Cancelar"
                        onPress={ () => { onChange(false); setIsOpen(false) } }
                        btnTextColor={ systemStyle.oppositeTextColor }
                        btnColor="red"
                    />
                </Box.Row>
            </Box.Column>
        </CustomModal>
    )
}

const styles = StyleSheet.create({
    container: {
        width: "80%",
        gap: 10,
        padding: 10,
        borderRadius: 15,
    },
    modalTitleContainer: {
        borderBottomWidth: 1,
        paddingBottom: 5,
    },
    modalBtnsContainer: {
        justifyContent: "space-around",
        alignItems: "center",
        paddingVertical: 10,
    },
})