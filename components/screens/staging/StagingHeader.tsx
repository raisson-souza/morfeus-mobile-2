import { BACKEND_URL } from "@/app/_layout"
import { StyleSheet } from "react-native"
import Box from "@/components/base/Box"
import CustomInput from "@/components/customs/CustomInput"
import Draggable from 'react-native-draggable'
import env from "@/config/env"
import ModalBox from "@/components/base/ModalBox"
import React, { useState } from "react"
import TextBold from "@/components/base/TextBold"

export default function StagingHeader(): JSX.Element {
    const [ openModal, setOpenModal ] = useState<boolean>(false)
    const [ backendUrl, setBackendUrl ] = useState<string>(BACKEND_URL.url)

    const changeBackendUrl = (newUrl: string) => {
        setBackendUrl(newUrl)
        BACKEND_URL.url = newUrl
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
                            <CustomInput
                                onChange={ (e) => changeBackendUrl(e) }
                                defaultValue={ backendUrl }
                                inputStyle={{ color: styles.modalText.color }}
                            />
                        </Box.Column>
                    </Box.Column>
                }
            />
            <Draggable
                x={ 5 }
                y={ 80 }
                renderColor='red'
                renderText='?'
                isCircle
                onPressIn={ () => setOpenModal(true) }
            />
            <TextBold style={ styles.headerText }>STAGING MORFEUS { env.AppVersion() }</TextBold>
        </Box.Row>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "darkblue",
        paddingTop: 20,
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