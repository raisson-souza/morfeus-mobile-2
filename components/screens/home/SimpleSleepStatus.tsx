import { Pressable, StyleSheet } from "react-native"
import { StyleContextProvider } from "@/contexts/StyleContext"
import { useState } from "react"
import Box from "@/components/base/Box"
import CustomButton from "@/components/customs/CustomButton"
import IconAntDesign from "react-native-vector-icons/AntDesign"
import ModalActionConfirm from "@/components/base/ModalActionConfirm"
import ModalBox from "@/components/base/ModalBox"
import React from "react"

type SimpleSleepStatusProps = {
    isOk: boolean
    resetSimpleSleep: () => void
    fetchSimpleSleep: () => Promise<void>
    setLoading: React.Dispatch<React.SetStateAction<boolean>>
}

export default function SimpleSleepStatus({
    isOk,
    resetSimpleSleep,
    fetchSimpleSleep,
    setLoading,
}: SimpleSleepStatusProps) {
    const { systemStyle } = StyleContextProvider()
    const [ isActionModalOpen, setIsActionModalOpen ] = useState<boolean>(false)
    const [ isInfoModalOpen, setIsInfoModalOpen ] = useState<boolean>(false)

    const handleResetConfirmation = (reset: boolean) => {
        if (!reset) return
        resetSimpleSleep()
    }

    const refreshSimpleSleep = async () => {
        setLoading(true)
        await fetchSimpleSleep()
    }

    return (
        <>
            <ModalBox
                title={ isOk ? "Sono Simples salvo" : "Sono Simples não salvo" }
                visible={ isInfoModalOpen }
                setVisible={ setIsInfoModalOpen }
                description={
                    isOk
                            ? ["Seu sono simples foi salvo com sucesso, edite se necessário!"]
                            : [
                                "Seu sono simples ainda não foi salvo!",
                                "Se está criando-o pela primeira vez, troque as datas.",
                                "Se já trocou alguma data e o aviso persiste, seu sono pode estar em conflito com outro, troque novamente.",
                                "Não se preocupe com esse aviso, você não precisa criar outro sono simples se não quiser!",
                            ]
                }
            />
            <ModalActionConfirm
                description={[
                    "Ao criar um novo sono simples, o anterior permanecerá salvo, mas não poderá ser editado por aqui.",
                    "Para editar o sono anterior, procure-o na listagem de sonos ou cancele a criação do próximo sono simples.",
                ]}
                isOpen={ isActionModalOpen }
                setIsOpen={ setIsActionModalOpen }
                onChange={ (e) => handleResetConfirmation(e) }
            />
            <Box.Column style={ styles.infoSimpleSleep }>
                {
                    isOk
                        ? <CustomButton title="Cadastrar novo sono simples" onPress={ () => setIsActionModalOpen(true) } />
                        : <CustomButton title="Não cadastrar novo sono simples" onPress={ async () => { await fetchSimpleSleep() } } />
                }
                <Box.Row style={ styles.infoSimpleSleepStatusContainer }>
                    {
                        isOk
                            ? <Pressable onPress={ () => setIsInfoModalOpen(true) }>
                                <IconAntDesign
                                    name="checkcircle"
                                    color="green"
                                    size={ systemStyle.normalIconSize }
                                />
                            </Pressable>
                            : <Pressable onPress={ () => setIsInfoModalOpen(true) }>
                                <IconAntDesign
                                    name="closecircle"
                                    color="red"
                                    size={ systemStyle.normalIconSize }
                                />
                            </Pressable>
                    }
                    <Pressable onPress={ async () => { await refreshSimpleSleep() } }>
                        <IconAntDesign
                            name="reload1"
                            color={ systemStyle.iconColor }
                            size={ systemStyle.normalIconSize }
                        />
                    </Pressable>
                </Box.Row>
            </Box.Column>
        </>
    )
}

const styles = StyleSheet.create({
    infoModalContainer: {
        padding: 10,
        backgroundColor: "royalblue",
        width: "75%",
        gap: 5,
    },
    infoModalText: {
        fontSize: 19,
        color: "white",
    },
    infoSimpleSleep: {
        alignItems: "center",
        justifyContent: "center",
        gap: 10,
        paddingTop: 5,
    },
    infoSimpleSleepStatusContainer: {
        gap: 10,
    },
})