import { Screen } from "../base/Screen"
import { StyleContextProvider } from "@/contexts/StyleContext"
import { StyleSheet } from "react-native"
import Box from "../base/Box"
import CustomButton from "./CustomButton"
import CustomText from "./CustomText"

type MessageScreenProps = {
    title: string
    description: string[]
    type: "info" | "confirm"
    footerMsg?: string
    onConfirm: () => void
}

export default function MessageScreen({
    title,
    description,
    type,
    footerMsg,
    onConfirm,
}: MessageScreenProps) {
    const { systemStyle } = StyleContextProvider()
    return <Screen>
        <Box.Column style={{
            ...styles.container,
            backgroundColor: systemStyle.secondary,
        }}>
            <CustomText style={{
                ...styles.title,
                color: systemStyle.oppositeTextColor,
            }}>
                { title }
            </CustomText>
            <Box.Column style={ styles.descriptionContainer }>
                {
                    description.map((desc, i) => (
                        <CustomText
                            key={ i }
                            style={{
                                ...styles.description,
                                color: systemStyle.oppositeTextColor,
                            }}
                        >
                            { desc }
                        </CustomText>
                    ))
                }
            </Box.Column>
            <Box.Row style={ styles.btnsContainer }>
                {
                    type === "info"
                        ? <CustomButton
                            title="OK"
                            btnTextColor={ systemStyle.oppositeTextColor }
                            onPress={() => onConfirm()}
                            btnWidth="50%"
                            important
                        />
                        : <CustomButton
                            title="ACEITO"
                            btnTextColor={ systemStyle.oppositeTextColor }
                            onPress={() => onConfirm()}
                            btnWidth="50%"
                            important
                        />
                }
            </Box.Row>
            { footerMsg ? <CustomText style={{ ...styles.footerMsg, color: systemStyle.oppositeTextColor, }}>{ footerMsg }</CustomText> : <></> }
        </Box.Column>
    </Screen>
}

const styles = StyleSheet.create({
    container: {
        padding: 10,
        gap: 10,
        borderRadius: 10,
    },
    title: {
        fontSize: 20,
        fontWeight: "bold",
    },
    descriptionContainer: {
        gap: 5,
    },
    description: {
        fontSize: 16,
        textAlign: "justify",
    },
    btnsContainer: {
        alignSelf: "center",
        marginTop: 10,
    },
    footerMsg: {
        fontSize: 14,
        alignSelf: "center",
        textAlign: "center",
    },
})