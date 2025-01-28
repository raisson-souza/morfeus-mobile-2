import { Linking, StyleSheet } from "react-native"
import Box from "@/components/base/Box"
import CustomButton from "@/components/customs/CustomButton"
import env from "@/config/env"
import ModalBox from "@/components/base/ModalBox"
import TextBold from "@/components/base/TextBold"

type AppInfoProps = {
    open: boolean
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export default function AppInfo({
    open,
    setOpen,
}: AppInfoProps) {
    return <ModalBox
        visible={ open }
        setVisible={ setOpen }
        title="Informações sobre a aplicação"
        description={
            <Box.Column style={ styles.container }>
                <CustomButton
                    title="FECHAR"
                    onPress={ () => setOpen(false) }
                    btnTextColor={ styles.text.color }
                />
                <Box.Column style={ styles.developerContainer }>
                    <TextBold style={ styles.text }>Versão { env.AppVersion() }</TextBold>
                    <TextBold style={ styles.developerText }>Desenvolvido por Raisson Souza</TextBold>
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
    developerText: {
        fontSize: 16,
        color: "white",
    },
    text: {
        color: "white",
        fontSize: 20,
        textAlign: "center",
    },
})