import { useSQLiteContext } from "expo-sqlite"
import MessageScreen from "@/components/customs/MessageScreen"

type PrivacyPolicyScreenProps = {
    setAsReaded: () => void
}

export default function PrivacyPolicyScreen({
    setAsReaded,
}: PrivacyPolicyScreenProps) {
    const db = useSQLiteContext()

    const onConfirm = async () => {
        await db.runAsync('UPDATE PARAMS SET privacy_policy_read = 1')
        setAsReaded()
    }

    return <MessageScreen
        title="Política de privacidade do Morfeus"
        description={[
            "Morfeus respeita sua privacidade e protege seus dados.",
            "O aplicativo coleta as seguintes informações fornecidas por você:",
            "- nome;",
            "- e-mail;",
            "- rotina de sono para acompanhamento e estatísticas;",
            "- descrições dos sonhos.",
            "Os dados são utilizados exclusivamente para salvar seu histórico de sonhos e melhorar a experiência do usuário.",
            "Seus dados não são vendidos nem compartilhados com terceiros. O desenvolvedor pode acessar informações anonimizadas para melhorias do aplicativo.",
            "As informações são armazenadas de forma segura e protegidas contra acessos não autorizados.",
            'Você pode solicitar a exclusão dos seus dados a qualquer momento na seção "Seus Dados" na tela inicial.',
            "Ao continuar usando o aplicativo, você confirma que leu e aceita a política de privacidade.",
        ]}
        onConfirm={onConfirm}
        type="confirm"
        footerMsg="Para utilizar esse aplicativo é necessário aceitar esses termos"
    />
}