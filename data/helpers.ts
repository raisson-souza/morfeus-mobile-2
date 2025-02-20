type HelperType = {
    modalTitle: string
    infoDescription: string
    modalDescription: string[]
}

type HelperListType = {
    createDream: HelperType
    createSleepCycle: HelperType
    analysis: HelperType
    exportData: HelperType
    importDataSameOrigin: HelperType
}

const HELPERS: HelperListType = {
    createDream: {
        modalTitle: "Criar um Sonho",
        infoDescription: "Como criar um sonho?",
        modalDescription: [
            "Data: todo sonho acontece em um ciclo de sono, defina o seu selecionando um sono já cadastrado, informando o dia e período do sono ou os horários do mesmo.",
            "Título: se pudesse resumir seu sonho em uma palavra ou frase, qual seria?",
            "Descrição: realize o relato completo de seu sonho.",
            "Outras características: acesse os 'helpers' para cada opção solicitada no cadastro para compreender as informações solicitadas.",
        ],
    },
    createSleepCycle: {
        modalTitle: "Criar um Ciclo de Sono",
        infoDescription: "Como criar um ciclo de sono?",
        modalDescription: [
            "Horário de dormir: defina o dia e o horário em que você dormiu.",
            "Horário de acordar: defina o dia e horário em que você acordou.",
            "Humores ao dormir e acordar: selecione, caso lembre, os humores que teve quando dormiu e acordou.",
            "Ocorrências biológicas: selecione os ocorridos listados que lhe acometeram durante o período que dormiu.",
        ],
    },
    analysis: {
        modalTitle: "Análises de Ciclos de Sono e Sonhos",
        infoDescription: "Análises?",
        modalDescription: [
            "Ao acessar as análises de ciclos de sono ou sonhos, todos os seus registros do mês selecionado são reunidos e estatísticas interessantes sobre eles são geradas.",
        ],
    },
    exportData: {
        modalTitle: "Exportação de Dados",
        infoDescription: "Exportação de Dados",
        modalDescription: [
            "Com a exportação de dados, todos os seus registros dentro de um intervalo especificado de 1 ano serão agregados em um arquivo JSON.",
            "Você poderá realizar o download deste arquivo para manter seus dados como backup, extração de seus registros para uso pessoal ou importação em um novo ambiente do Morfeus (caso necessário).",
            "Você pode gerar apenas uma exportação por vez, então deverá sempre baixar sua exportação antes de solicitar uma nova caso possua registros feitos além de um período de 1 ano.",
            "Em caso de dúvidas, entre em contato através do suporte na tela inicial.",
        ],
    },
    importDataSameOrigin: {
        modalTitle: "Importação de Dados do Morfeus",
        infoDescription: "Importação de Dados do Morfeus",
        modalDescription: [
            "Se você possui dados cadastrados em outra conta ou precisa importar dados de outro ambiente Morfeus, utilize a importação de dados do Morfeus para obter de volta tudo que você cadastrou anteriormente.",
            "Para realizar essa importação é necessário realizar uma exportação de dados previamente e estar em posse do arquivo JSON gerado!",
        ],
    },
}

export default HELPERS