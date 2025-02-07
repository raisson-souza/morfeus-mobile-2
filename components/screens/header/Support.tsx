import { AuthContextProvider } from "@/contexts/AuthContext"
import { Linking, StyleSheet } from "react-native"
import { StyleContextProvider } from "@/contexts/StyleContext"
import Box from "@/components/base/Box"
import CustomButton from "@/components/customs/CustomButton"
import CustomText from "@/components/customs/CustomText"
import env from "@/config/env"
import ModalBox from "@/components/base/ModalBox"

type SupportProps = {
    open: boolean
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export default function Support({
    open,
    setOpen,
}: SupportProps) {
    const { systemStyle } = StyleContextProvider()
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
                        <CustomText
                            isOpposite
                            size="s"
                        >Em caso de sugestões de desenvolvimento, críticas quanto a funcionalidades ou aviso de bugs, utilize este local para seu relato</CustomText>
                        <CustomText
                            isOpposite
                            size="s"
                        >Se for relatar um bug, tire um print ou realize uma gravação de tela para o melhor relato de seu problema antes de prosseguir!</CustomText>
                    </Box.Column>
                    <CustomButton
                        title="Sugestão"
                        onPress={ () => Linking.openURL(`mailto:${ env.DevContact() }?subject=${ renderSubject("suggestion") }&body=${ renderBody("suggestion") }`) }
                        btnTextColor={ systemStyle.oppositeTextColor }
                    />
                    <CustomButton
                        title="Crítica"
                        onPress={ () => Linking.openURL(`mailto:${ env.DevContact() }?subject=${ renderSubject("review") }&body=${ renderBody("review") }`) }
                        btnTextColor={ systemStyle.oppositeTextColor }
                    />
                    <CustomButton
                        title="Bug"
                        onPress={ () => Linking.openURL(`mailto:${ env.DevContact() }?subject=${ renderSubject("bug") }&body=${ renderBody("bug") }`) }
                        btnTextColor={ systemStyle.oppositeTextColor }
                    />
                    <CustomButton
                        title="FECHAR"
                        onPress={ () => setOpen(false) }
                        btnTextColor={ systemStyle.oppositeTextColor }
                    />
                    <CustomText
                        style={ styles.appVersionContainer }
                        isOpposite
                        size="s"
                        weight="thin"
                    >{ `Versão do software: ${ appVersion }` }</CustomText>
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
    appVersionContainer: {
        alignSelf: "center",
    },
})