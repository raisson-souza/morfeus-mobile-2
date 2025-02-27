import { AuthContextProvider } from "@/contexts/AuthContext"
import { CustomImage } from "@/components/customs/CustomImage"
import { Screen } from "@/components/base/Screen"
import { StyleSheet } from "react-native"
import { SyncContextProvider } from "@/contexts/SyncContext"
import { useNavigation, useRouter } from "expo-router"
import Box from "@/components/base/Box"
import CustomButton from "@/components/customs/CustomButton"
import CustomText from "@/components/customs/CustomText"
import React, { useEffect, useState } from "react"
import SimpleSleep from "@/components/screens/home/SimpleSleep"

export default function IndexScreen() {
    const router = useRouter()
    const navigation = useNavigation()
    const { userInfo: { current: userInfo } } = AuthContextProvider()
    const { checkIsConnected } = SyncContextProvider()
    const [ isConnected, setIsConnected ] = useState<boolean>(checkIsConnected())

    useEffect(() => {
        return navigation.addListener("focus", () => {
            setIsConnected(checkIsConnected())
        })
    }, [])

    return (
        <Screen>
            <Box.Center style={ styles.container }>
                <Box.Column style={ styles.welcomeContainer }>
                    <CustomText
                        weight="thin"
                        size="l"
                    >
                        { `Bem vindo de volta, ${ userInfo.name }!` }
                    </CustomText>
                    {
                        isConnected
                            ? <CustomButton
                                title="Seus Dados"
                                onPress={ () => router.navigate("/(user)/user") }
                                important
                                btnWidth="50%"
                            />
                            : <CustomText style={ styles.internetContainer }>Você está offline, nem todos os recursos estarão disponíveis!</CustomText>
                    }
                </Box.Column>
                <CustomImage.Local
                    filePathByRequire={ require("../../assets/images/home_background.jpg") }
                    style={ styles.image }
                />
                {
                    isConnected
                        ? <SimpleSleep />
                        : <></>
                }
                <CustomButton
                    title="Criar Sonho"
                    onPress={ () => router.navigate("/createDream") }
                    btnWidth="65%"
                />
                <CustomButton
                    title="Criar Ciclo de Sono"
                    onPress={ () => router.navigate("/createSleep") }
                    btnWidth="65%"
                />
            </Box.Center>
        </Screen>
    )
}

const styles = StyleSheet.create({
    container: {
        width: "100%",
        gap: 10,
    },
    internetContainer: {
        textAlign: "center",
    },
    image: {
        resizeMode: "cover",
        width: "100%",
        height: 200,
        borderRadius: 10,
    },
    welcomeContainer: {
        alignItems: "center",
        width: "100%",
        gap: 5,
    },
})