import { Text, StyleSheet } from "react-native"
import Box from "./Box"
import CustomButton from "../customs/CustomButton"
import CustomModal from "../customs/CustomModal"
import React from "react"

type ModalActionConfirmProps = {
    title?: string
    description?: string | string[]
    isOpen: boolean
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
    onChange: (e: boolean) => void
}

export default function ModalActionConfirm({ title = "Deseja Continuar?", description, isOpen, setIsOpen, onChange }: ModalActionConfirmProps) {
    const renderDescription = (): JSX.Element => {
        if (description instanceof Array) {
            return <>
                {
                    description.map((_description, i) => (<Text style={ styles.modalDescription } key={ i }>{ _description }</Text>))
                }
            </>
        }
        else if (description === undefined) {
            return <></>
        }
        return <Text style={ styles.modalDescription }>{ description }</Text>
    }

    return (
        <CustomModal
            visible={ isOpen }
            setVisible={ setIsOpen }
            canOutsideClickClose={ false }
        >
            <Box.Column style={ styles.container }>
                <Box.Row style={ styles.modalTitleContainer }>
                    <Text style={ styles.modalTitle }>{ title }</Text>
                </Box.Row>
                <Box.Column>
                    { renderDescription() }
                </Box.Column>
                <Box.Row style={ styles.modalBtnsContainer }>
                    <CustomButton
                        title="Confirmar"
                        onPress={ () => { onChange(true); setIsOpen(false) } }
                        btnTextColor="white"
                        btnColor="green"
                    />
                    <CustomButton
                        title="Cancelar"
                        onPress={ () => { onChange(false); setIsOpen(false) } }
                        btnTextColor="white"
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
        backgroundColor: "darkblue",
        gap: 10,
        padding: 10,
        borderRadius: 15,
    },
    modalTitleContainer: {
        borderBottomWidth: 1,
        borderBottomColor: "white",
    },
    modalTitle: {
        color: "white",
        fontSize: 22,
    },
    modalDescription: {
        color: "white",
        fontSize: 18,
    },
    modalBtnsContainer: {
        justifyContent: "space-around",
        alignItems: "center",
        paddingVertical: 10,
    },
})