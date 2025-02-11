import CustomButton from "@/components/customs/CustomButton"
import CustomInput from "@/components/customs/CustomInput"
import CustomText from "@/components/customs/CustomText"
import UserService from "@/services/api/UserService"

type AccountRecoveryCodeVerificationProps = {
    setLoading: React.Dispatch<React.SetStateAction<boolean>>
    onSuccess: () => void
    onCancel: () => void
    code: string
    setCode: React.Dispatch<React.SetStateAction<string>>
}

export default function AccountRecoveryCodeVerification({
    setLoading,
    code,
    setCode,
    onSuccess,
    onCancel,
}: AccountRecoveryCodeVerificationProps) {
    const onSuccessAction = async () => {
        setLoading(true)
        await UserService.CheckAccountRecovery({
            code: code,
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
            Um código foi enviado para o email anteriormente informado, por favor, acesse este email e informe o código no campo abaixo
        </CustomText>
        <CustomText>
            O código expirará em 10 minutos
        </CustomText>
        <CustomInput
            label="Código"
            defaultValue={ code }
            onChange={ (e) => setCode(e) }
            width="100%"
        />
        <CustomButton
            title="Verificar"
            onPress={ async () => await onSuccessAction() }
            active={ code != "" }
            important
        />
        <CustomButton
            title="Cancelar"
            btnColor="red"
            btnTextColor="red"
            onPress={ () => onCancel() }
        />
    </>
}