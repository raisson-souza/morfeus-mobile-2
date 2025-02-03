import { CustomImage } from "@/components/customs/CustomImage"
import { Screen } from "@/components/base/Screen"
import { StyleSheet } from "react-native"
import Box from "@/components/base/Box"
import Loading from "@/components/base/Loading"

export default function DefaultLoadingScreen() {
    return (
        <Screen flex>
            <Box.Column style={ styles.container }>
                <CustomImage.Local filePathByRequire={ require('../../../assets/images/morfeus_logo.png') } />
                <Loading />
            </Box.Column>
        </Screen>
    )
}

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        gap: 15,
    },
})