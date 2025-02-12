import { StyleSheet } from "react-native"
import Box from "./Box"
import CustomModal, { CustomModalProps } from "../customs/CustomModal"
import React from "react"
import CustomText from "../customs/CustomText"
import { StyleContextProvider } from "@/contexts/StyleContext"

type ModalBoxProps = Omit<CustomModalProps, "children"> & {
    title?: string
    description: string[] | JSX.Element[] | JSX.Element
    children?: JSX.Element
    alignDescriptionInCenter?: boolean
}

export default function ModalBox({
    title,
    description,
    children,
    alignDescriptionInCenter = true,
    ...customModalProps
}: ModalBoxProps) {
    const { systemStyle } = StyleContextProvider()
    const renderModalContent = (): JSX.Element => {
        if (description instanceof Array) {
            if (description.length === 0)
                return <></>
            if (typeof description[0] === "string") {
                return (
                    <Box.Column style={ styles.contentContainer }>
                        {
                            (description as string[]).map((text, i) => <CustomText key={ i } isOpposite>{ text }</CustomText>)
                        }
                    </Box.Column>
                )
            }
            else {
                return (
                    <Box.Column style={ styles.contentContainer }>
                        { description as JSX.Element[] }
                    </Box.Column>
                )
            }
        }
        else {
            return (
                <Box.Column style={ styles.contentContainer }>
                    { description }
                </Box.Column>
            )
        }
    }

    return (
        <>
            <CustomModal { ...customModalProps }>
                <Box.Column style={{
                    ...styles.container,
                    alignItems: alignDescriptionInCenter ? "center" : "flex-start",
                    backgroundColor: systemStyle.primary,
                }}>
                    {
                        title
                            ? <>
                                <Box.Row style={{
                                    ...styles.titleContainer,
                                    borderBottomColor: systemStyle.oppositeTextColor,
                                }}>
                                    <CustomText
                                        style={ styles.titleText }
                                        size="l"
                                        isOpposite
                                    >
                                        { title }
                                    </CustomText>
                                </Box.Row>
                                { renderModalContent() }
                            </>
                            : renderModalContent()
                    }
                </Box.Column>
            </CustomModal>
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        width: "80%",
        gap: 10,
        padding: 10,
        borderRadius: 15,
    },
    titleContainer: {
        paddingBottom: 5,
        borderBottomWidth: 1,
    },
    contentContainer: {
        gap: 5,
    },
    titleText: {
        width: "100%",
    },
})