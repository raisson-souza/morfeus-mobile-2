import { CustomImage } from "@/components/customs/CustomImage"
import { Screen } from "@/components/base/Screen"
import { StyleSheet } from "react-native"
import Box from "@/components/base/Box"
import Loading from "@/components/base/Loading"

type DefaultLoadingScreenProps = {
    message?: string
}

export default function DefaultLoadingScreen({ message }: DefaultLoadingScreenProps) {
    return (
        <Screen flex>
            <Box.Column style={ styles.container }>
                <CustomImage.Local filePathByRequire={ require('../../../assets/images/morfeus_logo.png') } />
                <Loading onlyLoading={ message ? false : true } text={ message } />
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