import { Link } from "expo-router"
import { Screen } from "@/components/base/Screen"
import Box from "@/components/base/Box"
import TextBold from "@/components/base/TextBold"

export default function IndexScreen() {
    return (
        <Screen>
            <Box.Column>
                <TextBold>TELA HOME</TextBold>
                <Link href={{ pathname: "/credits" }}>Tela de Créditos</Link>
            </Box.Column>
        </Screen>
    )
}