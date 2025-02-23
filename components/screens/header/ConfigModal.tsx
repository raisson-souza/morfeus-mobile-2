import { AuthContextProvider } from "@/contexts/AuthContext"
import { StyleContextProvider } from "@/contexts/StyleContext"
import { StyleSheet } from "react-native"
import { useRouter } from "expo-router"
import { useState } from "react"
import AppInfo from "./AppInfo"
import Box from "@/components/base/Box"
import ConfirmActionButton from "../general/ConfirmActionButton"
import CustomButton from "@/components/customs/CustomButton"
import CustomModal from "@/components/customs/CustomModal"
import StyleSwitcher from "./StyleSwitcher"
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
    const { systemStyle } = StyleContextProvider()
    const router = useRouter()
    const { logoff } = AuthContextProvider()
    const [ openSuggestionsModal, setOpenSuggestionsModal ] = useState<boolean>(false)
    const [ openAppInfoModal, setOpenAppInfoModal ] = useState<boolean>(false)
    const [ tutorialModalOpen, setTutorialModalOpen ] = useState<boolean>(false)

    const logoffAction = async () => {
        await logoff()
        router.navigate("/")
    }

    const btnWidth = 200

    return (
        <CustomModal
            visible={ open }
            setVisible={ setOpen }
        >
            <Box.Center
                style={{
                    ...styles.modal,
                    backgroundColor: systemStyle.primary,
                }}
            >
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
                    btnTextColor={ systemStyle.oppositeTextColor }
                    btnWidth={ btnWidth }
                />
                <CustomButton
                    title="INFORMAÇÕES"
                    onPress={ () => setOpenAppInfoModal(true) }
                    btnTextColor={ systemStyle.oppositeTextColor }
                    btnWidth={ btnWidth }
                />
                <CustomButton
                    title="TUTORIAL"
                    onPress={ () => setTutorialModalOpen(true) }
                    btnTextColor={ systemStyle.oppositeTextColor }
                    btnWidth={ btnWidth }
                />
                <ConfirmActionButton
                    btnTitle="SAIR DA CONTA"
                    description="Ao sair da conta, registros não sincronizados e o arquivo de exportação serão eliminados, você deverá fazer login novamente, tem certeza?"
                    onConfirm={ () => logoffAction() }
                    btnColor={{ text: "red", border: "red" }}
                    btnWidth={ btnWidth }
                />
                <CustomButton
                    title="FECHAR"
                    onPress={ () => setOpen(false) }
                    btnTextColor={ systemStyle.oppositeTextColor }
                    btnWidth={ btnWidth }
                />
                <StyleSwitcher />
            </Box.Center>
        </CustomModal>
    )
}

const styles = StyleSheet.create({
    modal: {
        width: "100%",
        padding: 20,
        borderRadius: 15,
        gap: 10,
    },
})