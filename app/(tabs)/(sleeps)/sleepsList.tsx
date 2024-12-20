import { Link } from "expo-router"
import { Screen } from "@/components/base/Screen"
import { StyleSheet } from "react-native"
import Box from "@/components/base/Box"
import TextBold from "@/components/base/TextBold"

export default function SleepsListScreen() {
    return (
        <Screen>
            <Box.Column>
                <TextBold>SleepsListScreen</TextBold>
                <Link href={"/sleepsHome"}>Home</Link>
            </Box.Column>
        </Screen>
    )
}

const styles = StyleSheet.create({
})