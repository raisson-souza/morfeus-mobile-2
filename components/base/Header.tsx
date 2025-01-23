import { AuthContextProvider } from "../../contexts/AuthContext"
import { Text, StyleSheet, Pressable } from "react-native"
import { useState } from "react"
import Box from "./Box"
import ChangelogModal from "../screens/header/ChangelogModal"
import ConfigModal from "../screens/header/ConfigModal"
import IconIon from "react-native-vector-icons/Ionicons"
import IconMaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"
import React from "react"

type HeaderProps = {
}

export default function Header({}: HeaderProps): JSX.Element {
    const { isLogged } = AuthContextProvider()
    const [ openChangelogModal, setOpenChangelogModal ] = useState<boolean>(false)
    // const [ openNotificationsModal, setOpenNotificationsModal ] = useState<boolean>(false)
    const [ openConfigModal, setOpenConfigModal ] = useState<boolean>(false)

    if (!isLogged)
        return <></>

    return (
        <Box.Row style={ styles.container }>
            <ChangelogModal
                open={ openChangelogModal }
                setOpen={ setOpenChangelogModal }
            />
            <ConfigModal
                open={ openConfigModal }
                setOpen={ setOpenConfigModal }
            />
            <Box.Row style={ styles.logo }>
                <IconIon name="moon-outline" color="white" size={ 25 } />
                <Text style={ styles.logoText }>Morfeus</Text>
            </Box.Row>
            <Box.Row style={ styles.icons }>
                <Pressable onPress={ () => setOpenChangelogModal(true) }>
                    <IconIon name="megaphone" size={ 25 } color="white" />
                </Pressable>
                <Pressable onPress={ () => {} }>
                    <IconMaterialCommunityIcons name="bell" size={ 25 } color="white" />
                </Pressable>
                <Pressable onPress={ () => setOpenConfigModal(true) }>
                    <IconIon name="menu" size={ 40 } color="white" />
                </Pressable>
            </Box.Row>
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
    icons: {
        alignItems: "center",
        gap: 15,
    },
})