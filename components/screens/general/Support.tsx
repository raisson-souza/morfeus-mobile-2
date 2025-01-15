import { AuthContextProvider } from "@/contexts/AuthContext"
import { Linking, StyleSheet, Text } from "react-native"
import Box from "@/components/base/Box"
import CustomButton from "@/components/customs/CustomButton"
import env from "@/config/env"
import ModalBox from "@/components/base/ModalBox"
import TextBold from "@/components/base/TextBold"

type SupportProps = {
    open: boolean
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export default function Support({
    open,
    setOpen,
}: SupportProps) {
    const { userInfo: { current: { name, id }}} = AuthContextProvider()
    const appVersion = env.AppVersion()

    const renderSubject = (type: "suggestion" | "review" | "bug"): string => {
        const userId = `${ name.toLowerCase().replaceAll(" ", "_") }#${ id }`
        switch (type) {
            case "suggestion":
                return `MORFEUS ${ appVersion }v - Sugestão / ${ userId }`
            case "review":
                return `MORFEUS ${ appVersion }v - Review / ${ userId }`
            case "bug":
                return `MORFEUS ${ appVersion }v - Bug / ${ userId }`
        }
    }

    const renderBody = (type: "suggestion" | "review" | "bug"): string => {
        switch (type) {
            case "suggestion":
                return "Descreva sua sugestão de implementação aqui."
            case "review":
                return "Mencione o que você deseja falar sobre na aplicação aqui."
            case "bug":
                return "Descreva e mostre em um anexo (se possível), o problema que você atualmente enfrenta."
        }
    }

    return (
        <ModalBox
            visible={ open }
            setVisible={ setOpen }
            title="Sugestões / Críticas / Bugs"
            description={
                <Box.Column style={ styles.container }>
                    <Box.Column style={ styles.textContainer }>
                        <Text style={ styles.text }>Em caso de sugestões de desenvolvimento, críticas quanto a funcionalidades ou aviso de bugs, utilize este local para seu relato</Text>
                        <Text style={ styles.text }>Se for relatar um bug, tire um print ou realize uma gravação de tela para o melhor relato de seu problema antes de prosseguir!</Text>
                    </Box.Column>
                    <CustomButton
                        title="Sugestão"
                        onPress={ () => Linking.openURL(`mailto:${ env.DevContact() }?subject=${ renderSubject("suggestion") }&body=${ renderBody("suggestion") }`) }
                        btnTextColor={ styles.text.color }
                    />
                    <CustomButton
                        title="Crítica"
                        onPress={ () => Linking.openURL(`mailto:${ env.DevContact() }?subject=${ renderSubject("review") }&body=${ renderBody("review") }`) }
                        btnTextColor={ styles.text.color }
                    />
                    <CustomButton
                        title="Bug"
                        onPress={ () => Linking.openURL(`mailto:${ env.DevContact() }?subject=${ renderSubject("bug") }&body=${ renderBody("bug") }`) }
                        btnTextColor={ styles.text.color }
                    />
                    <CustomButton
                        title="FECHAR"
                        onPress={ () => setOpen(false) }
                        btnTextColor={ styles.text.color }
                    />
                    <TextBold style={ styles.appVersionContainer }>Versão do software: { appVersion }</TextBold>
                </Box.Column>
            }
        />
    )
}

const styles = StyleSheet.create({
    container: {
        gap: 10,
    },
    textContainer: {
        gap: 5,
    },
    text: {
        color: "white",
        fontSize: 17,
    },
    appVersionContainer: {
        color: "white",
        fontSize: 15,
        alignSelf: "center",
    },
})