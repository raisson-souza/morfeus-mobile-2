import { StyleSheet } from "react-native"
import Box from "@/components/base/Box"
import env from "@/config/env"
import React from "react"
import TextBold from "@/components/base/TextBold"

export default function StagingHeader(): JSX.Element {
    return (
        <Box.Row style={ styles.container }>
            <TextBold style={ styles.text }>STAGING MORFEUS { env.AppVersion() }</TextBold>
        </Box.Row>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "darkblue",
        paddingTop: 30,
        justifyContent: "center",
    },
    text: {
        color: "red",
        fontSize: 15,
        alignSelf: "center",
    },
})