import { Screen } from "@/components/base/Screen"
import AuthRoute from "@/components/auth/Auth"
import Box from "@/components/base/Box"
import TextBold from "@/components/base/TextBold"

export default function CreateFastDream() {
    return (
        <AuthRoute>
            <Screen>
                <Box.Column>
                    <TextBold>CreateFastDream</TextBold>
                </Box.Column>
            </Screen>
        </AuthRoute>
    )
}