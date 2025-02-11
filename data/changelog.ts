type Update = {
    version: string
    date: string
    title: string
    description: string[]
}

const CHANGELOG: Update[] = [
    {
        version: "1.5.0",
        date: "12/02/2025",
        title: "Ações do Usuário",
        description: [
            "Visualização de informações da conta",
            "Edição de dados do usuário",
            "Exclusão de dados",
            "Recuperação de conta",
        ],
    },
    {
        version: "1.4.0",
        date: "07/02/2025",
        title: "Estilo",
        description: [
            "Tema escuro",
            "Melhorias de interface",
        ],
    },
    {
        version: "1.3.0",
        date: "01/02/2025",
        title: "Tutorial",
        description: [
            "Implementado tutorial de uso da aplicação",
        ],
    },
    {
        version: "1.2.1",
        date: "31/01/2025",
        title: "Ícone da Aplicação",
        description: [
            "Ajuste do ícone e imagens da aplicação",
            "Correção de bugs",
        ],
    },
    {
        version: "1.2.0",
        date: "30/01/2025",
        title: "Exclusão e Edição de Registros",
        description: [
            "Implementada exclusão e edição de registros",
            "Listagem de sonhos ao visualizar um ciclo de sono",
            "Melhorias de interface e comportamento",
        ],
    },
    {
        version: "1.1.0",
        date: "24/01/2025",
        title: "Changelog e Melhorias",
        description: [
            "Implementado changelog",
            "Correção de bugs",
            "Melhorias de interface",
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