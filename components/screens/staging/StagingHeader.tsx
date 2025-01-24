import { BACKEND_URL, ORIGINAL_BACKEND_URL } from "@/app/_layout"
import { StyleSheet, Text } from "react-native"
import Box from "@/components/base/Box"
import CustomButton from "@/components/customs/CustomButton"
import CustomInput from "@/components/customs/CustomInput"
import Draggable from 'react-native-draggable'
import env from "@/config/env"
import ModalBox from "@/components/base/ModalBox"
import React, { useState } from "react"
import TextBold from "@/components/base/TextBold"

export default function StagingHeader(): JSX.Element {
    const [ openModal, setOpenModal ] = useState<boolean>(false)
    const [ backendUrl, setBackendUrl ] = useState<string>(BACKEND_URL.url)
    const [ lockOriginalBackendUrl, setLockOriginalBackendUrl ] = useState<boolean>(true)

    const changeBackendUrl = (newUrl: string) => {
        setBackendUrl(newUrl)
        BACKEND_URL.url = newUrl
    }

    const unlockOriginalBackendUrl = () => {
        changeBackendUrl("https://")
        setLockOriginalBackendUrl(false)
    }

    const restoreOriginalBackendUrl = () => {
        changeBackendUrl(ORIGINAL_BACKEND_URL)
        setLockOriginalBackendUrl(true)
    }

    return (
        <Box.Row style={ styles.container }>
            <ModalBox
                visible={ openModal }
                setVisible={ setOpenModal }
                title="Configurações do Ambiente Staging"
                description={
                    <Box.Column>
                        <Box.Column style={ styles.modalGroups }>
                            <TextBold style={ styles.modalText }>URL do backend</TextBold>
                            {
                                lockOriginalBackendUrl
                                    ? <CustomButton
                                        title="Alterar"
                                        onPress={ () => unlockOriginalBackendUrl() }
                                        btnTextColor={ styles.modalText.color }
                                    />
                                    : <>
                                        <CustomInput
                                            onChange={ (e) => changeBackendUrl(e) }
                                            defaultValue={ backendUrl }
                                            inputStyle={{ color: styles.modalText.color }}
                                        />
                                        <CustomButton
                                            title="Restaurar"
                                            onPress={ () => restoreOriginalBackendUrl() }
                                            btnTextColor={ styles.modalText.color }
                                        />
                                    </>
                            }
                            <Text style={ styles.modalText }>
                                Isso é um ambiente para testes de novas funcionalidades da aplicação, podem ocorrer erros imprevistos. Não cadastre aqui informações pessoais ou sensíveis.
                            </Text>
                        </Box.Column>
                    </Box.Column>
                }
            />
            <Draggable
                x={ 5 }
                y={ 0 }
                maxY={ 300 }
                renderColor='red'
                renderText='?'
                isCircle
                onShortPressRelease={ () => setOpenModal(true) }
            />
            <TextBold style={ styles.headerText }>STAGING MORFEUS { env.AppVersion() }</TextBold>
        </Box.Row>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "darkblue",
        justifyContent: "center",
    },
    headerText: {
        color: "red",
        fontSize: 15,
        alignSelf: "center",
    },
    modalText: {
        color: "white",
    },
    modalGroups: {
        gap: 5,
    },
})