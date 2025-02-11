import { useEffect, useState } from "react"
import { useRouter } from "expo-router"
import Box from "@/components/base/Box"
import CustomButton from "@/components/customs/CustomButton"
import CustomInput from "@/components/customs/CustomInput"
import CustomText from "@/components/customs/CustomText"
import UserService from "@/services/api/UserService"

type AccountRecoveryFinishProcessProps = {
    setLoading: React.Dispatch<React.SetStateAction<boolean>>
    onSuccess: () => void
    onCancel: () => void
    email: string
    setEmail: React.Dispatch<React.SetStateAction<string>>
    code: string
}

export default function AccountRecoveryFinishProcess({
    setLoading,
    email,
    setEmail,
    code,
    onSuccess,
    onCancel,
}: AccountRecoveryFinishProcessProps) {
    const router = useRouter()
    const [ password, setPassword ] = useState<string>("")
    const [ repeatPassword, setRepeatPassword ] = useState<string>("")

    useEffect(() => {
        if (email === "") {
            try {
                let newEmail = atob(code)
                if (newEmail === "") newEmail = "x"
                setEmail(newEmail)
            }
            catch {
                alert("Ocorreu um erro ao recuperar a conta, por favor, tente novamente.")
                router.navigate("/(tabs)/home")
            }
        }
    }, [])

    const onSuccessAction = async () => {
        if (repeatPassword != password) {
            alert("As senhas devem ser iguais.")
            return
        }
        setLoading(true)
        await UserService.FinishAccountRecovery({
            code: code,
            email: email,
            password: password,
        })
            .then(response => {
                if (response.Success) {
                    onSuccess()
                    return
                }
                alert(response.ErrorMessage)
            })
            .finally(() => setLoading(false))
    }

    return <>
        <CustomText>
            Defina uma nova senha para sua conta
        </CustomText>
        <Box.Column>
            <CustomInput
                label="Senha"
                defaultValue={ password }
                onChange={ (e) => setPassword(e) }
                width="100%"
            />
            <CustomInput
                label="Repita a senha"
                defaultValue={ repeatPassword }
                onChange={ (e) => setRepeatPassword(e) }
                width="100%"
            />
        </Box.Column>
        <CustomButton
            title="Salvar"
            onPress={ async () => await onSuccessAction() }
            active={ password != "" && repeatPassword != "" }
            important
        />
        <CustomButton
            title="Cancelar Recuperação"
            btnColor="orange"
            btnTextColor="orange"
            onPress={ () => onCancel() }
        />
    </>
}