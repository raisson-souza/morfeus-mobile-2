import { AuthContextProvider } from "../../contexts/AuthContext"
import { Text, StyleSheet, Pressable } from "react-native"
import { useRouter } from "expo-router"
import { useState } from "react"
import AppInfo from "../screens/general/AppInfo"
import Box from "./Box"
import CustomButton from "../customs/CustomButton"
import CustomModal from "../customs/CustomModal"
import Icon from "react-native-vector-icons/Ionicons"
import React from "react"
import Support from "../screens/general/Support"

type HeaderProps = {
}

export default function Header({}: HeaderProps): JSX.Element {
    const router = useRouter()
    const { logoff, isLogged } = AuthContextProvider()
    const [ modalOpen, setModalOpen ] = useState<boolean>(false)
    const [ openSuggestionsModal, setOpenSuggestionsModal ] = useState<boolean>(false)
    const [ openAppInfoModal, setOpenAppInfoModal ] = useState<boolean>(false)

    const logoffAction = async () => {
        await logoff()
        router.navigate("/")
    }

    if (!isLogged)
        return <></>

    return (
        <Box.Row style={ styles.container }>
            <CustomModal
                visible={ modalOpen }
                setVisible={ setModalOpen }
            >
                <Box.Center style={ styles.modal }>
                    <Support
                        open={ openSuggestionsModal }
                        setOpen={ setOpenSuggestionsModal }
                    />
                    <AppInfo
                        open={ openAppInfoModal }
                        setOpen={ setOpenAppInfoModal }
                    />
                    <CustomButton
                        title="SUPORTE"
                        onPress={ () => setOpenSuggestionsModal(true) }
                        btnTextColor="white"
                    />
                    <CustomButton
                        title="INFORMAÇÕES"
                        onPress={ () => setOpenAppInfoModal(true) }
                        btnTextColor="white"
                    />
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
        paddingBottom: 3,
        paddingHorizontal: 10,
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
        backgroundColor: "darkblue",
        padding: 30,
        borderRadius: 15,
        gap: 10,
    },
})