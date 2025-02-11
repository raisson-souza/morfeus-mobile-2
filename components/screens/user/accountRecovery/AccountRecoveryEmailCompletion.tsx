import CustomButton from "@/components/customs/CustomButton"
import CustomInput from "@/components/customs/CustomInput"
import CustomText from "@/components/customs/CustomText"
import UserService from "@/services/api/UserService"

type AccountRecoveryEmailCompletionProps = {
    setLoading: React.Dispatch<React.SetStateAction<boolean>>
    onSuccess: () => void
    onCancel: () => void
    email: string
    setEmail: React.Dispatch<React.SetStateAction<string>>
}

export default function AccountRecoveryEmailCompletion({
    setLoading,
    email,
    setEmail,
    onSuccess,
    onCancel,
}: AccountRecoveryEmailCompletionProps) {
    const onSuccessAction = async () => {
        setLoading(true)
        await UserService.CreateAccountRecovery({
            email: email,
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

    const hasCodeAction = () => {
        if (email != "") setEmail("")
        onSuccess()
    }

    return <>
        <CustomText>
            Informe o email utilizado na conta que deseja recuperar
        </CustomText>
        <CustomInput
            label="Email"
            defaultValue={ email }
            onChange={ (e) => setEmail(e) }
            width="100%"
        />
        <CustomButton
            title="Enviar"
            onPress={ async () => await onSuccessAction() }
            active={ email != "" }
            btnWidth="100%"
            important
        />
        <CustomButton
            title="Já possui um código?"
            onPress={ () => hasCodeAction() }
            btnWidth="100%"
        />
        <CustomButton
            title="Voltar"
            onPress={ () => onCancel() }
            btnWidth="100%"
        />
    </>
}