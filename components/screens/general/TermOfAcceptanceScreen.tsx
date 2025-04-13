import { useSQLiteContext } from "expo-sqlite"
import MessageScreen from "@/components/customs/MessageScreen"

type TermOfAcceptanceScreenProps = {
    setAsReaded: () => void
}

export default function TermOfAcceptanceScreen({
    setAsReaded,
}: TermOfAcceptanceScreenProps) {
    const db = useSQLiteContext()

    const onConfirm = async () => {
        await db.runAsync('UPDATE PARAMS SET term_of_acceptance_read = 1')
        setAsReaded()
    }

    return <MessageScreen
        title="Termo de Aceite do Morfeus"
        description={[
            "Bem-vindo ao Morfeus. Ao utilizar este aplicativo, você concorda com os seguintes termos:",
            "O aplicativo é destinado exclusivamente para uso pessoal.",
            "Você pode registrar seus sonhos e sua rotina de sono.",
            "Não é permitida a cópia, modificação, distribuição ou revenda deste aplicativo, de seu código-fonte ou de qualquer conteúdo relacionado. Qualquer tentativa de engenharia reversa, descompilação ou extração de informações é proibida.",
            "Você é responsável pelo conteúdo que adiciona ao aplicativo.",
            "Morfeus é uma ferramenta de registro pessoal e não substitui qualquer orientação médica ou psicológica.",
            "O desenvolvedor não se responsabiliza por qualquer dano ou perda resultante do uso do aplicativo.",
            "Ao continuar usando o aplicativo, você confirma que leu e aceita os termos de uso.",
        ]}
        onConfirm={onConfirm}
        type="confirm"
        footerMsg="Para utilizar esse aplicativo é necessário aceitar esses termos"
    />
}