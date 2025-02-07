import { AuthContextProvider } from "../../contexts/AuthContext"
import { StyleContextProvider } from "@/contexts/StyleContext"
import { StyleSheet, Pressable } from "react-native"
import { useState } from "react"
import Box from "./Box"
import ChangelogModal from "../screens/header/ChangelogModal"
import ConfigModal from "../screens/header/ConfigModal"
import CustomText from "../customs/CustomText"
import IconIon from "react-native-vector-icons/Ionicons"
import IconMaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"
import React from "react"

type HeaderProps = { }

export default function Header({}: HeaderProps): JSX.Element {
    const { systemStyle } = StyleContextProvider()
    const { isLogged } = AuthContextProvider()
    const [ openChangelogModal, setOpenChangelogModal ] = useState<boolean>(false)
    // const [ openNotificationsModal, setOpenNotificationsModal ] = useState<boolean>(false)
    const [ openConfigModal, setOpenConfigModal ] = useState<boolean>(false)

    if (!isLogged)
        return <></>

    return (
        <Box.Row style={{
            ...styles.container,
            backgroundColor: systemStyle.headerBackgroundColor,
        }}>
            <ChangelogModal
                open={ openChangelogModal }
                setOpen={ setOpenChangelogModal }
            />
            <ConfigModal
                open={ openConfigModal }
                setOpen={ setOpenConfigModal }
            />
            <Box.Row style={ styles.logo }>
                <IconIon
                    name="moon-outline"
                    color={ systemStyle.headerTextColor }
                    size={ systemStyle.largeIconSize }
                />
                <CustomText
                    style={{
                        color: systemStyle.headerTextColor,
                        fontSize: systemStyle.headerTextSize,
                    }}
                    weight="bold"
                >
                    Morfeus
                </CustomText>
            </Box.Row>
            <Box.Row style={ styles.icons }>
                <Pressable onPress={ () => setOpenChangelogModal(true) }>
                    <IconIon
                        name="megaphone"
                        size={ systemStyle.largeIconSize }
                        color={ systemStyle.headerTextColor }
                    />
                </Pressable>
                <Pressable onPress={ () => {} }>
                    <IconMaterialCommunityIcons
                        name="bell"
                        size={ systemStyle.largeIconSize }
                        color={ systemStyle.headerTextColor }
                    />
                </Pressable>
                <Pressable onPress={ () => setOpenConfigModal(true) }>
                    <IconIon
                        name="menu"
                        size={ systemStyle.extraLargeIconSize }
                        color={ systemStyle.headerTextColor }
                    />
                </Pressable>
            </Box.Row>
        </Box.Row>
    )
}

const styles = StyleSheet.create({
    container: {
        justifyContent: "space-between",
        paddingVertical: 5,
        paddingHorizontal: 10,
    },
    logo: {
        justifyContent: "center",
        alignItems: "center",
        gap: 5,
    },
    icons: {
        alignItems: "center",
        gap: 15,
    },
})