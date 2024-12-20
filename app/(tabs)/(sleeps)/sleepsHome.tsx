import { CustomImage } from "@/components/customs/CustomImage"
import { Screen } from "@/components/base/Screen"
import { StyleSheet } from "react-native"
import Box from "@/components/base/Box"

export default function SleepsIndexScreen() {
    return (
        <Screen>
            <Box.Column style={ styles.container }>
                <CustomImage.Local
                    filePathByRequire={ require("../../../assets/images/sleeps_background.jpg") }
                    style={ styles.image }
                />
            </Box.Column>
        </Screen>
    )
}

const styles = StyleSheet.create({
    container: {
        width: "100%",
        gap: 10,
    },
    image: {
        resizeMode: "cover",
        width: "100%",
        height: 150,
        borderRadius: 10,
    },
})