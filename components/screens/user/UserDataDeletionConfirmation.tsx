import { AuthContextProvider } from "@/contexts/AuthContext"
import { useEffect, useState } from "react"
import { useNavigation } from "expo-router"
import ModalActionConfirm from "@/components/base/ModalActionConfirm"
import UserService from "@/services/api/UserService"

type UserDataDeletionConfirmationProps = {
    isOpen: boolean
}

export default function UserDataDeletionConfirmation({
    isOpen,
}: UserDataDeletionConfirmationProps) {
    const navigation = useNavigation()
    const { logoff } = AuthContextProvider()
    const [ firstConfirmationOpen, setFirstConfirmationOpen ]  = useState<boolean>(isOpen)
    const [ secondConfirmationOpen, setSecondConfirmationOpen ]  = useState<boolean>(false)
    const [ finalConfirmationOpen, setFinalConfirmationOpen ]  = useState<boolean>(false)

    useEffect(() => {
        return navigation.addListener("blur", () => {
            setFinalConfirmationOpen(true)
            setSecondConfirmationOpen(false)
            setFinalConfirmationOpen(false)
        })
    }, [])

    const cancelDataDeletion = () => {
        setFirstConfirmationOpen(false)
        setSecondConfirmationOpen(false)
        setFinalConfirmationOpen(false)
    }

    const confirmDataDeletion = async () => {
        await UserService.DataDeletion()
            .then(async (response) => {
                if (response.Success) {
                    alert(response.Data)
                    await logoff()
                    return
                }
                alert(response.ErrorMessage)
            })
    }

    return <>
        <ModalActionConfirm 
            isOpen={ firstConfirmationOpen }
            setIsOpen={ setFirstConfirmationOpen }
            title="Excluir meus dados em Morfeus?"
            description={[
                "Você está prestes a excluir todos os seus dados armazenados em Morfeus, incluindo informações sobre ciclos de sono, sonhos e análises. Após a exclusão, não será possível recuperá-los. Deseja continuar?",
            ]}
            onChange={ (e) => {
                if (e) {
                    setSecondConfirmationOpen(true)
                    setFirstConfirmationOpen(false)
                }
                else cancelDataDeletion()
            }}
        />
        <ModalActionConfirm 
            isOpen={ secondConfirmationOpen }
            setIsOpen={ setSecondConfirmationOpen }
            title="Realmente excluir meus dados em Morfeus?"
            description={[
                "Você está prestes a EXCLUIR todos os SEUS dados em Morfeus. Após a exclusão, não será possível recuperá-los. Realmente deseja continuar?",
            ]}
            onChange={ (e) => {
                if (e) {
                    setFinalConfirmationOpen(true)
                    setSecondConfirmationOpen(false)
                }
                else cancelDataDeletion()
            }}
        />
        <ModalActionConfirm 
            isOpen={ finalConfirmationOpen }
            setIsOpen={ setFinalConfirmationOpen }
            title="Todos os meus dados em Morfeus serão eliminados!"
            description={[
                "Esta é sua última confirmação: todos os seus dados serão excluídos permanentemente, incluindo registros de sono, sonhos e análises. Esta ação não pode ser desfeita. Continuar com a exclusão?",
            ]}
            onChange={ async (e) => {
                if (e) await confirmDataDeletion()
                cancelDataDeletion()
            }}
        />
    </>
}