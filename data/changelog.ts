type Update = {
    version: string
    date: string
    title: string
    description: string[]
}

const CHANGELOG: Update[] = [
    {
        version: "1.2.0",
        date: "25/01/2025",
        title: "Exclusão e Edição de Registros",
        description: [
            "Implementada exclusão e edição de registros",
            "Listagem de sonhos ao visualizar um ciclo de sono",
        ],
    },
    {
        version: "1.1.0",
        date: "24/01/2025",
        title: "Changelog e Melhorias",
        description: [
            "Correção de bugs",
            "Melhorias de interface",
            "Implementado changelog",
        ],
    },
    {
        version: "1.0.0",
        date: "21/01/2025",
        title: "Aplicação Base",
        description: [
            "Aplicação base para testes internos",
        ],
    },
]

export default CHANGELOG