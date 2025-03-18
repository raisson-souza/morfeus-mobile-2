import { BACKEND_URL, ORIGINAL_BACKEND_URL } from "@/app/_layout"
import { StyleContextProvider } from "@/contexts/StyleContext"
import { StyleSheet } from "react-native"
import Box from "@/components/base/Box"
import CustomButton from "@/components/customs/CustomButton"
import CustomInput from "@/components/customs/CustomInput"
import CustomText from "@/components/customs/CustomText"
import Draggable from 'react-native-draggable'
import env from "@/config/env"
import IconFeather from "react-native-vector-icons/Feather"
import ModalBox from "@/components/base/ModalBox"
import React, { useState } from "react"

export default function StagingHeader(): JSX.Element {
    const { systemStyle } = StyleContextProvider()
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
        <Box.Row
            style={{
                ...styles.container,
                backgroundColor: systemStyle.headerBackgroundColor,
            }}
        >
            <ModalBox
                visible={ openModal }
                setVisible={ setOpenModal }
                title="Configurações do Ambiente Staging"
                description={
                    <Box.Column>
                        <Box.Column style={ styles.modalGroups }>
                            <CustomText isOpposite>URL do backend</CustomText>
                            {
                                lockOriginalBackendUrl
                                    ? <CustomButton
                                        title="Alterar"
                                        onPress={ () => unlockOriginalBackendUrl() }
                                        btnTextColor={ systemStyle.oppositeTextColor }
                                    />
                                    : <>
                                        <CustomInput
                                            onChange={ (e) => changeBackendUrl(e) }
                                            defaultValue={ backendUrl }
                                        />
                                        <CustomButton
                                            title="Restaurar"
                                            onPress={ () => restoreOriginalBackendUrl() }
                                            btnTextColor={ systemStyle.oppositeTextColor }
                                        />
                                    </>
                            }
                            <CustomText
                                style={ styles.stagingInfoText }
                                isOpposite
                                size="s"
                                weight="thin"
                            >
                                Atenção usuário: este é o ambiente de staging do Morfeus, destinado a testes de novas funcionalidades. Por isso, erros inesperados ou interrupções no serviço podem acontecer. Peço que não cadastre informações pessoais ou sensíveis neste ambiente. Este software está sendo compartilhado exclusivamente com pessoas autorizadas para fins de testes internos. Agradeço por não compartilhar o acesso sem permissão. Se encontrar algum problema ou tiver sugestões, entre em contato diretamente com o desenvolvedor ou utilize o espaço de suporte. Sua ajuda é essencial para melhorar o Morfeus! Obrigado por participar!
                            </CustomText>
                        </Box.Column>
                    </Box.Column>
                }
            />
            <Draggable
                x={ 5 }
                y={ 5 }
                isCircle
                renderColor='red'
                onShortPressRelease={ () => setOpenModal(true) }
            >
                <IconFeather
                    name="alert-circle"
                    color="white"
                    size={ 50 }
                />
            </Draggable>
            <CustomText
                style={{
                    ...styles.headerText,
                    color: "red",
                }}
                weight="bold"
            >
                { `STAGING MORFEUS ${ env.AppVersion() }` }
            </CustomText>
        </Box.Row>
    )
}

const styles = StyleSheet.create({
    container: {
        justifyContent: "center",
    },
    headerText: {
        color: "red",
        alignSelf: "center",
    },
    modalGroups: {
        gap: 5,
    },
    stagingInfoText: {
        textAlign: "justify",
    },
})