import { Link } from "expo-router"
import { Screen } from "@/components/base/Screen"
import Box from "@/components/base/Box"
import TextBold from "@/components/base/TextBold"

export default function CreditsScreen() {
    return (
        <Screen>
            <Box.Column>
                <TextBold>TELA DE CRÉDITOS</TextBold>
                <Link href={{ pathname: "/" }}>Home</Link>
            </Box.Column>
        </Screen>
    )
}