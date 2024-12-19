import { Text, StyleSheet } from "react-native"
import { useState } from "react"
import Box from "./Box"
import IconEvilIcons from "react-native-vector-icons/EvilIcons"
import IconFeather from "react-native-vector-icons/Feather"
import ModalBox from "./ModalBox"
import React from "react"

type InfoProps = {
    type?: "error" | "warn" | "success" | "info" | "question"
    infoDescription?: string
    modalTitle: string
    modalDescription: string[] | JSX.Element[]
    overrideInfoColor?: string
    iconSize?: number
}

export default function Info({
    type = "info",
    infoDescription,
    modalTitle,
    modalDescription,
    overrideInfoColor,
    iconSize = 20,
}: InfoProps) {
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
                                size={ iconSize }
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
                                size={ iconSize }
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
                            <Text
                                style={{
                                    color: overrideInfoColor
                                        ? overrideInfoColor
                                        : renderColor()
                                }}
                                onPress={ () => setOpen(true) }
                            >
                                { infoDescription }
                            </Text>
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
    },
})