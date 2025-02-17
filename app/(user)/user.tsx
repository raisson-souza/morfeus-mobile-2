import { AuthContextProvider } from "@/contexts/AuthContext"
import { Screen } from "@/components/base/Screen"
import { StyleSheet } from "react-native"
import { useEffect, useState } from "react"
import { useNavigation, useRouter } from "expo-router"
import { UserPresentationModel } from "@/types/user"
import Box from "@/components/base/Box"
import CustomButton from "@/components/customs/CustomButton"
import CustomInput from "@/components/customs/CustomInput"
import CustomText from "@/components/customs/CustomText"
import Loading from "@/components/base/Loading"
import UserDataDeletionConfirmation from "@/components/screens/user/UserDataDeletionConfirmation"
import UserService from "@/services/api/UserService"

export default function User() {
    const router = useRouter()
    const navigation = useNavigation()
    const [ loading, setLoading ] = useState<boolean>(false)
    const [ updating, setUpdating ] = useState<boolean>(false)
    const [ allowUpdate, setAllowUpdate ] = useState<boolean>(false)
    const { userInfo, login } = AuthContextProvider()
    const [ userData, setUserData ] = useState<UserPresentationModel>({
        id: userInfo.current.id,
        email: userInfo.current.email,
        fullName: userInfo.current.name,
        password: userInfo.current.password,
    })
    const [ showUserDataDeletionModal, setShowUserDataDeletionModal ] = useState<boolean>(false)

    const updateUser = async () => {
        setLoading(true)
        await UserService.Update({
            fullName: userData.fullName,
            email: userData.email,
            password: userData.password,
        })
            .then(async (response) => {
                if (response.Success) {
                    alert(response.Data)
                    await login({
                        email: userData.email,
                        password: userData.password,
                    })
                    return
                }
                alert(response.ErrorMessage)
            })
            .finally(() => setLoading(false))
    }

    useEffect(() => {
        return navigation.addListener("blur", () => {
            setUpdating(false)
            setAllowUpdate(false)
            resetUserData()
            setShowUserDataDeletionModal(false)
        })
    }, [])

    const resetUserData = () => {
        setUserData({
            id: userInfo.current.id,
            email: userInfo.current.email,
            fullName: userInfo.current.name,
            password: userInfo.current.password,
        })
    }

    return (
        <Screen flex>
            {
                showUserDataDeletionModal
                    ? <UserDataDeletionConfirmation isOpen={ showUserDataDeletionModal } />
                    : <></>
            }
            {
                loading
                    ? <Loading />
                    : <Box.Column style={ styles.container }>
                        <Box.Column style={ styles.header }>
                            <CustomText
                                size="xl"
                                weight="bold"
                            >
                                Informações do Usuário
                            </CustomText>
                            <CustomButton
                                title={ updating ? "Cancelar edição" : "Editar" }
                                onPress={ () => {
                                    if (updating) {
                                        setUpdating(false)
                                        resetUserData()
                                    }
                                    else setUpdating(true)
                                }}
                                btnColor={ updating ? "red" : "orange" }
                                btnTextColor={ updating ? "red" : "orange" }
                                btnWidth="90%"
                            />
                        </Box.Column>
                        <Box.Column style={ styles.userInfoContainer }>
                            {
                                updating
                                    ? <>
                                        <CustomInput
                                            label="Nome"
                                            defaultValue={ userData.fullName }
                                            onChange={ (e) => {
                                                setUserData({ ...userData, fullName: e })
                                                if (!allowUpdate) setAllowUpdate(true)
                                            }}
                                            width={ styles.userInfoContainer.width }
                                        />
                                        <CustomInput
                                            label="Email"
                                            defaultValue={ userData.email }
                                            onChange={ (e) => {
                                                setUserData({ ...userData, email: e })
                                                if (!allowUpdate) setAllowUpdate(true)
                                            }}
                                            width={ styles.userInfoContainer.width }
                                        />
                                        <CustomInput
                                            label="Senha"
                                            defaultValue={ userData.password }
                                            onChange={ (e) => {
                                                setUserData({ ...userData, password: e })
                                                if (!allowUpdate) setAllowUpdate(true)
                                            }}
                                            width={ styles.userInfoContainer.width }
                                        />
                                        <CustomButton
                                            title="Salvar"
                                            onPress={ async () => await updateUser() }
                                            active={ allowUpdate }
                                        />
                                    </>
                                    : <>
                                        <Box.Row style={ styles.userInfoIndividualContainer }>
                                            <CustomText
                                                weight="bold"
                                                size="l"
                                            >
                                                Nome:
                                            </CustomText>
                                            <CustomText weight="thin">
                                                { userData.fullName }
                                            </CustomText>
                                        </Box.Row>
                                        <Box.Row style={ styles.userInfoIndividualContainer }>
                                            <CustomText
                                                weight="bold"
                                                size="l"
                                            >
                                                Email:
                                            </CustomText>
                                            <CustomText weight="thin">
                                                { userData.email }
                                            </CustomText>
                                        </Box.Row>
                                    </>
                            }
                        </Box.Column>
                        <Box.Center style={ styles.goBackBtn }>
                            <CustomButton
                                title="Voltar"
                                onPress={ () => router.navigate("/(tabs)/home") }
                                btnWidth="90%"
                            />
                        </Box.Center>
                        <Box.Center style={ styles.userDataActionsBtns }>
                            <CustomButton
                                title="Exportação e Importação"
                                onPress={ () => router.navigate("/(user)/userData") }
                                btnWidth="100%"
                            />
                            <CustomButton
                                title="Excluir Dados"
                                onPress={ () => setShowUserDataDeletionModal(true) }
                                btnWidth="100%"
                                btnColor="red"
                                btnTextColor="red"
                            />
                        </Box.Center>
                    </Box.Column>
            }
        </Screen>
    )
}

const styles = StyleSheet.create({
    container: {
        gap: 10,
        width: "80%",
        alignItems: "center",
    },
    header: {
        gap: 5,
        alignItems: "center",
        width: "100%",
    },
    goBackBtn: {
        width: "100%",
    },
    userInfoIndividualContainer: {
        alignItems: "center",
        gap: 5,
    },
    userInfoContainer: {
        alignSelf: "flex-start",
        gap: 10,
        width: "100%",
    },
    userDataActionsBtns: {
        width: "100%",
        paddingTop: 30,
        gap: 10,
    },
})