import { Text, StyleSheet } from "react-native"
import { useState } from "react"
import Box from "./Box"
import IconEvilIcons from "react-native-vector-icons/EvilIcons"
import IconFeather from "react-native-vector-icons/Feather"
import ModalBox from "./ModalBox"
import React from "react"
import { StyleContextProvider } from "@/contexts/StyleContext"
import CustomText from "../customs/CustomText"

type InfoProps = {
    type?: "error" | "warn" | "success" | "info" | "question"
    infoDescription?: string
    modalTitle: string
    modalDescription: string[] | JSX.Element[]
    overrideInfoColor?: string
}

export default function Info({
    type = "info",
    infoDescription,
    modalTitle,
    modalDescription,
    overrideInfoColor,
}: InfoProps) {
    const { systemStyle } = StyleContextProvider()
    const [ open, setOpen ] = useState<boolean>(false)

    const renderColor = () => {
        switch (type) {
            case "info": return "black"
            case "warn": return "yellow"
            case "error": return "red"
            case "success": return "green"
            case "question": return "black"
            default: return "black"
        }
    }

    return (
        <>
            <ModalBox
                title={ modalTitle }
                description={ modalDescription }
                visible={ open }
                setVisible={ setOpen }
                animationType="slide"
                blurBackground
            />
            <Box.Row style={ styles.infoContainer }>
                {
                    type === "question"
                        ? (
                            <IconEvilIcons
                                name="question"
                                size={ systemStyle.largeIconSize }
                                color={
                                    overrideInfoColor
                                        ? overrideInfoColor
                                        : renderColor()
                                }
                                onPress={ () => setOpen(true) }
                            />
                        )
                        : (
                            <IconFeather
                                name="info"
                                size={ systemStyle.normalIconSize }
                                color={
                                    overrideInfoColor
                                        ? overrideInfoColor
                                        : renderColor()
                                }
                                onPress={ () => setOpen(true) }
                            />
                        )
                }
                {
                    infoDescription
                        ? (
                            <CustomText
                                style={{
                                    color: overrideInfoColor
                                        ? overrideInfoColor
                                        : renderColor()
                                }}
                                onPress={ () => setOpen(true) }
                            >
                                { infoDescription }
                            </CustomText>
                        )
                        : <></>
                }
                
            </Box.Row>
        </>
    )
}

const styles = StyleSheet.create({
    infoContainer: {
        gap: 5,
        alignItems: 'center',
    },
})