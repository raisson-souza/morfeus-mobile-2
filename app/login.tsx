import { AuthContextProvider } from "@/contexts/AuthContext"
import { LoginForm } from "@/types/login"
import { loginValidator } from "@/validators/login"
import { Screen } from "@/components/base/Screen"
import { StyleSheet, Text, View } from "react-native"
import { useRouter } from "expo-router"
import { useState } from "react"
import AuthRedirect from "@/components/auth/AuthRedirect"
import Box from "@/components/base/Box"
import CustomButton from "@/components/customs/CustomButton"
import CustomInput from "@/components/customs/CustomInput"
import Loading from "@/components/base/Loading"
import React from "react"
import validatorErrorParser from "@/validators/base/validatorErrorParser"

export default function LoginScreen() {
    const router = useRouter()
    const [ credentials, setCredentials ] = useState<LoginForm>({ email: undefined, password: undefined })
    const [ loading, setLoading ] = useState<boolean>(false)
    const { login } = AuthContextProvider()

    const loginAction = async () => {
        const parsedLogin = loginValidator.safeParse(credentials)

        if (!parsedLogin.success) {
            const errorMessage = validatorErrorParser(parsedLogin.error)
            alert(errorMessage)
            return
        }

        setLoading(true)
        await login({
            email: parsedLogin.data.email,
            password: parsedLogin.data.password
        })
        setLoading(false)
    }

    return (
        <AuthRedirect>
            <Screen flex>
                <Box.Center style={ styles.container }>
                    <Text style={ styles.title }>Realize seu login</Text>
                    <Box.Column style={ styles.container }>
                        <CustomInput
                            label="Email"
                            placeHolder="usuario@email.com"
                            defaultValue={ credentials.email }
                            onChange={ (e) => setCredentials({ email: e, password: credentials.password }) }
                            innerProps={{
                                textContentType: "emailAddress"
                            }}
                            active={ !loading }
                        />
                        <CustomInput
                            label="Senha"
                            defaultValue={ credentials.password }
                            onChange={ (e) => setCredentials({ email: credentials.email, password: e }) }
                            active={ !loading }
                        />
                        {
                            loading
                                ? <Loading />
                                : <>
                                    <CustomButton title="Entrar" onPress={ loginAction } />
                                    <CustomButton title="Voltar" onPress={ () => router.navigate("/") } />
                                    <CustomButton title="Cadastre-se" onPress={ () => router.navigate("/registry") } />
                                </>
                        }
                    </Box.Column>
                </Box.Center>
            </Screen>
        </AuthRedirect>
    )
}

const styles = StyleSheet.create({
    title: {
        fontSize: 22,
    },
    container: {
        gap: 10,
    },
})