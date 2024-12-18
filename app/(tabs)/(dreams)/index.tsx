import { Screen } from "@/components/base/Screen"
import AuthRoute from "@/components/auth/Auth"
import Box from "@/components/base/Box"
import TextBold from "@/components/base/TextBold"

export default function DreamsIndexScreen() {
    return (
        <AuthRoute>
            <Screen>
                <Box.Column>
                    <TextBold>DreamsIndexScreen</TextBold>
                </Box.Column>
            </Screen>
        </AuthRoute>
    )
}