import { StyleContextProvider } from "@/contexts/StyleContext"
import { StyleSheet } from "react-native"
import Box from "@/components/base/Box"
import CustomButton from "@/components/customs/CustomButton"
import CustomText from "@/components/customs/CustomText"
import env from "@/config/env"
import ModalBox from "@/components/base/ModalBox"

type AppInfoProps = {
    open: boolean
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export default function AppInfo({
    open,
    setOpen,
}: AppInfoProps) {
    const { systemStyle } = StyleContextProvider()

    return <ModalBox
        visible={ open }
        setVisible={ setOpen }
        title="Informações sobre a aplicação"
        description={
            <Box.Column style={ styles.container }>
                <CustomButton
                    title="FECHAR"
                    onPress={ () => setOpen(false) }
                    btnTextColor={ systemStyle.oppositeTextColor }
                />
                <Box.Column style={ styles.developerContainer }>
                    <CustomText
                        style={ styles.text }
                        isOpposite
                        weight="thin"
                    >{ `Versão ${ env.AppVersion() }` }</CustomText>
                    <CustomText
                        isOpposite
                        weight="thin"
                    >Desenvolvido por Raisson Souza</CustomText>
                </Box.Column>
            </Box.Column>
        }
    />
}

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        gap: 10,
    },
    developerContainer: {
        alignItems: "center",
    },
    text: {
        textAlign: "center",
    },
})