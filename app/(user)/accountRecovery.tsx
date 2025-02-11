import { Screen } from "@/components/base/Screen"
import { StyleSheet } from "react-native"
import { useRouter } from "expo-router"
import { useState } from "react"
import AccountRecoveryCodeVerification from "@/components/screens/user/accountRecovery/AccountRecoveryCodeVerification"
import AccountRecoveryEmailCompletion from "@/components/screens/user/accountRecovery/AccountRecoveryEmailCompletion"
import AccountRecoveryFinishProcess from "@/components/screens/user/accountRecovery/AccountRecoveryFinishProcess"
import Box from "@/components/base/Box"
import Loading from "@/components/base/Loading"

type AccountRecoverySteps = "email" | "code" | "finish"

export default function AccountRecovery() {
    const router = useRouter()
    const [ loading, setLoading ] = useState<boolean>(false)
    const [ email, setEmail ] = useState<string>("")
    const [ code, setCode ] = useState<string>("")
    const [ step, setStep ] = useState<AccountRecoverySteps>("email")

    const defineStep = () => {
        switch (step) {
            case "email":
                return <AccountRecoveryEmailCompletion
                    email={ email }
                    setEmail={ setEmail }
                    onSuccess={ () => setStep("code") }
                    onCancel={ () => router.navigate("/home")}
                    setLoading={ setLoading }
                />
            case "code":
                return <AccountRecoveryCodeVerification
                    code={ code }
                    setCode={ setCode }
                    onSuccess={ () => setStep("finish") }
                    onCancel={ () => router.navigate("/home")}
                    setLoading={ setLoading }
                />
            case "finish":
                return <AccountRecoveryFinishProcess
                    email={ email }
                    setEmail={ setEmail }
                    code={ code }
                    onSuccess={ () => router.navigate("/home") }
                    onCancel={ () => router.navigate("/home") }
                    setLoading={ setLoading }
                />
        }
    }

    return (
        <Screen flex>
            <Box.Column style={ styles.container }>
                {
                    loading
                        ? <Loading />
                        : defineStep()
                }
            </Box.Column>
        </Screen>
    )
}

const styles = StyleSheet.create({
    container: {
        width: "80%",
        gap: 10,
    },
})