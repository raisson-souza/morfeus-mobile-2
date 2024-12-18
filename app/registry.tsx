import { AuthContextProvider } from "@/contexts/AuthContext"
import { RegistryForm } from "@/types/registry"
import { registryValidator } from "@/validators/registry"
import { Screen } from "@/components/base/Screen"
import { StyleSheet, Text } from "react-native"
import { useRouter } from "expo-router"
import { useState } from "react"
import AuthRedirect from "@/components/auth/AuthRedirect"
import Box from "@/components/base/Box"
import CustomButton from "@/components/customs/CustomButton"
import CustomInput from "@/components/customs/CustomInput"
import Loading from "@/components/base/Loading"
import React from "react"
import validatorErrorParser from "@/validators/base/validatorErrorParser"

export default function RegistryScreen() {
    const router = useRouter()
    const [ credentials, setCredentials ] = useState<RegistryForm>({
        fullName: undefined,
        email: undefined,
        password: undefined,
        passwordRepeat: undefined,
    })
    const [ loading, setLoading ] = useState<boolean>(false)
    const { registry } = AuthContextProvider()

    const registryAction = async () => {
        const parsedRegistry = registryValidator.safeParse(credentials)

        if (!parsedRegistry.success) {
            const errorMessage = validatorErrorParser(parsedRegistry.error)
            alert(errorMessage)
            return
        }

        setLoading(true)
        await registry({
            fullName: parsedRegistry.data.fullName,
            email: parsedRegistry.data.email,
            password: parsedRegistry.data.password
        })
        setLoading(false)
    }

    return (
        <AuthRedirect>
            <Screen>
                <Box.Center style={ styles.container }>
                    <Text style={ styles.title }>Cadastre-se em Morfeus</Text>
                    <Box.Column style={ styles.gap }>
                        <CustomInput
                            label="Nome"
                            placeHolder="Fulano"
                            defaultValue={ credentials.fullName }
                            onChange={ (e) => setCredentials({ fullName: e, email: credentials.email, password: credentials.password, passwordRepeat: credentials.passwordRepeat }) }
                        />
                        <CustomInput
                            label="Email"
                            placeHolder="usuario@email.com"
                            defaultValue={ credentials.email }
                            onChange={ (e) => setCredentials({ fullName: credentials.fullName, email: e, password: credentials.password, passwordRepeat: credentials.passwordRepeat }) }
                            innerProps={{
                                textContentType: "emailAddress"
                            }}
                        />
                        <CustomInput
                            label="Senha"
                            defaultValue={ credentials.password }
                            onChange={ (e) => setCredentials({ fullName: credentials.fullName, email: credentials.email, password: e, passwordRepeat: credentials.passwordRepeat }) }
                        />
                        <CustomInput
                            label="Repita a senha"
                            defaultValue={ credentials.passwordRepeat }
                            onChange={ (e) => setCredentials({ fullName: credentials.fullName, email: credentials.email, password: credentials.password, passwordRepeat: e }) }
                        />
                    </Box.Column>
                    <Box.Column style={ styles.gap }>
                        {
                            loading
                                ? <Loading />
                                : <>
                                    <CustomButton title="Cadastrar-se" onPress={ registryAction } />
                                    <CustomButton title="Voltar" onPress={ () => router.navigate("/") } />
                                    <CustomButton title="Já tem uma conta?" onPress={ () => router.navigate("/login") } />
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
        gap: 15,
    },
    gap: {
        gap: 10,
    },
})