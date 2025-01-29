type HelperType = {
    modalTitle: string
    infoDescription: string
    modalDescription: string[]
}

type HelperListType = {
    createDream: HelperType
    createSleepCycle: HelperType
    analysis: HelperType
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
            "Ao acessar as análises de ciclos de sono ou sonhos, todos os seus registros do mês selecionado são reúnidos e estatísticas interessantes sobre eles são geradas.",
        ],
    },
}

export default HELPERS