import { StyleContextProvider } from "@/contexts/StyleContext"
import { StyleSheet } from "react-native"
import { useState } from "react"
import Box from "../base/Box"
import CustomButton from "../customs/CustomButton"
import CustomModal from "../customs/CustomModal"
import CustomText from "../customs/CustomText"
import React from "react"

type FutureDevelopmentButtonProps = {
    btnTitle: string
}

export default function FutureDevelopmentButton({
    btnTitle,
}: FutureDevelopmentButtonProps) {
    const { systemStyle } = StyleContextProvider()
    const [ open, setOpen ] = useState<boolean>(false)

    return <>
            <CustomModal
                visible={ open }
                setVisible={ setOpen }
                blurBackground
            >
                <Box.Center
                    style={{
                        ...styles.container,
                        backgroundColor: systemStyle.primary,
                    }}
                >
                    <CustomText
                        style={ styles.text }
                        isOpposite
                    >
                        Essa funcionalidade não está pronta para uso ainda, aguarde em novas atualizações do aplicativo!
                    </CustomText>
                </Box.Center>
            </CustomModal>
            <CustomButton
                title={ btnTitle }
                onPress={ () => setOpen(true) }
            />
    </>
}

const styles = StyleSheet.create({
    container: {
        width: "80%",
        padding: 15,
        borderRadius: 30,
    },
    text: {
        textAlign: "center",
    },
})