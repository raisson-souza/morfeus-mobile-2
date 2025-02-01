import { AuthContextProvider } from "@/contexts/AuthContext"
import { StyleSheet } from "react-native"
import { useRouter } from "expo-router"
import { useState } from "react"
import AppInfo from "./AppInfo"
import Box from "@/components/base/Box"
import CustomButton from "@/components/customs/CustomButton"
import CustomModal from "@/components/customs/CustomModal"
import Support from "./Support"
import TutorialModal from "../general/TutorialModal"

type ConfigModalProps = {
    open: boolean
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export default function ConfigModal({
    open,
    setOpen,
}: ConfigModalProps) {
    const router = useRouter()
    const { logoff } = AuthContextProvider()
    const [ openSuggestionsModal, setOpenSuggestionsModal ] = useState<boolean>(false)
    const [ openAppInfoModal, setOpenAppInfoModal ] = useState<boolean>(false)
    const [ tutorialModalOpen, setTutorialModalOpen ] = useState<boolean>(false)

    const logoffAction = async () => {
        await logoff()
        router.navigate("/")
    }

    return (
        <CustomModal
            visible={ open }
            setVisible={ setOpen }
        >
            <Box.Center style={ styles.modal }>
                <TutorialModal 
                    open={ tutorialModalOpen }
                    setOpen={ setTutorialModalOpen }
                    dbRecord={ false }
                    canOutsideClick={ true }
                />
                <Support
                    open={ openSuggestionsModal }
                    setOpen={ setOpenSuggestionsModal }
                />
                <AppInfo
                    open={ openAppInfoModal }
                    setOpen={ setOpenAppInfoModal }
                />
                <CustomButton
                    title="SUPORTE"
                    onPress={ () => setOpenSuggestionsModal(true) }
                    btnTextColor="white"
                />
                <CustomButton
                    title="INFORMAÇÕES"
                    onPress={ () => setOpenAppInfoModal(true) }
                    btnTextColor="white"
                />
                <CustomButton
                    title="TUTORIAL"
                    onPress={ () => setTutorialModalOpen(true) }
                    btnTextColor="white"
                />
                <CustomButton
                    title="SAIR DA CONTA"
                    onPress={ () => logoffAction() }
                    btnTextColor="white"
                />
                <CustomButton
                    title="FECHAR"
                    onPress={ () => setOpen(false) }
                    btnTextColor="white"
                />
            </Box.Center>
        </CustomModal>
    )
}

const styles = StyleSheet.create({
    modal: {
        backgroundColor: "darkblue",
        padding: 30,
        borderRadius: 15,
        gap: 10,
    },
})