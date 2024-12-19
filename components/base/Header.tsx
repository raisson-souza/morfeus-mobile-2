import { AuthContextProvider } from "../../contexts/AuthContext"
import { Text, StyleSheet, Pressable } from "react-native"
import { useState } from "react"
import Box from "./Box"
import CustomButton from "../customs/CustomButton"
import CustomModal from "../customs/CustomModal"
import Icon from "react-native-vector-icons/Ionicons"
import React from "react"

type HeaderProps = {
    navigateTo: (route: string) => void
}

export default function Header({ navigateTo }: HeaderProps): JSX.Element {
    const [ modalOpen, setModalOpen ] = useState<boolean>(false)
    const { logoff, isLogged } = AuthContextProvider()

    const logoffAction = async () => {
        await logoff()
        navigateTo("/")
    }

    if (!isLogged) {
        return <></>
    }

    return (
        <Box.Row style={ styles.container }>
            <CustomModal
                visible={ modalOpen }
                setVisible={ setModalOpen }
            >
                <Box.Center style={ styles.modal }>
                    <CustomButton
                        title="SAIR DA CONTA"
                        onPress={ () => logoffAction() }
                        btnTextColor="white"
                    />
                    <CustomButton
                        title="FECHAR"
                        onPress={ () => setModalOpen(false) }
                        btnTextColor="white"
                    />
                </Box.Center>
            </CustomModal>
            <Box.Row style={ styles.logo }>
                <Icon name="moon-outline" color="white" size={ 25 } />
                <Text style={ styles.logoText }>Morfeus</Text>
            </Box.Row>
            <Pressable onPress={ () => setModalOpen(true) }>
                <Icon name="menu" size={ 40 } color="white" />
            </Pressable>
        </Box.Row>
    )
}

const styles = StyleSheet.create({
    container: {
        justifyContent: "space-between",
        backgroundColor: "darkblue",
        paddingTop: 30,
        paddingBottom: 5,
        paddingHorizontal: 10,
        borderBottomWidth: 1,
        borderBottomColor: "black",
    },
    logo: {
        justifyContent: "center",
        alignItems: "center",
        gap: 5,
    },
    logoText: {
        color: "white",
        fontSize: 20,
        fontWeight: "bold",
    },
    modal: {
        backgroundColor: "royalblue",
        padding: 30,
        borderRadius: 15,
        gap: 10,
    },
})