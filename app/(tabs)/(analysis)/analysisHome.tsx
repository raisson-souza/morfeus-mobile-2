import { CustomImage } from "@/components/customs/CustomImage"
import { Screen } from "@/components/base/Screen"
import { StyleSheet } from "react-native"
import Auth from "@/components/auth/Auth"
import Box from "@/components/base/Box"

export default function AnalysisIndexScreen() {
    return (
        <Auth>
            <Screen>
                <Box.Center style={ styles.container }>
                    <CustomImage.Local
                        filePathByRequire={ require("../../../assets/images/analysis_background.jpg") }
                        style={ styles.image }
                    />
                </Box.Center>
            </Screen>
        </Auth>
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