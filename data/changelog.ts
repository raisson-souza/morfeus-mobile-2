export type Changelog = {
    version: string
    date: string
    title: string
    description: string[]
    apk?: string
    published: boolean
    id: number
}

const CHANGELOG: Changelog[] = [
    {
        version: "1.10.0",
        date: "25/02/2025",
        title: "Importação de Sonhos Externos",
        description: [
            "Importação de sonhos de origem externa",
            "Correção de bugs",
            "Melhorias de interface",
        ],
        apk: undefined,
        published: true,
        id: 13,
    },
    {
        version: "1.9.1",
        date: "21/02/2025",
        title: "Incidente na listagem de sonhos de uma tag",
        description: [
            "Corrigida falha de segurança ao acessar listagem de sonhos de uma tag e poder visualizar títulos de sonhos de outros usuários",
        ],
        apk: undefined,
        published: true,
        id: 12,
    },
    {
        version: "1.9.0",
        date: "21/02/2025",
        title: "Importação de Registros do Morfeus",
        description: [
            "Importação de registros de mesma origem",
        ],
        apk: undefined,
        published: true,
        id: 11,
    },
    {
        version: "1.8.0",
        date: "18/02/2025",
        title: "Exportação de Registros",
        description: [
            "Exportação de registros",
            "Ajustes no changelog",
        ],
        apk: undefined,
        published: true,
        id: 10,
    },
    {
        version: "1.7.0",
        date: "15/02/2025",
        title: "Atualização do Changelog",
        description: [
            "Atualização do Changelog",
        ],
        apk: undefined,
        published: true,
        id: 9,
    },
    {
        version: "1.6.0",
        date: "13/02/2025",
        title: "Compartilhamento de Sonhos",
        description: [
            "Implementado compartilhamento de sonhos",
            "Interface de visualização de sonho melhorada",
        ],
        apk: undefined,
        published: true,
        id: 8,
    },
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
        apk: undefined,
        published: true,
        id: 7,
    },
    {
        version: "1.4.0",
        date: "07/02/2025",
        title: "Estilo",
        description: [
            "Tema escuro",
            "Melhorias de interface",
        ],
        apk: undefined,
        published: true,
        id: 6,
    },
    {
        version: "1.3.0",
        date: "01/02/2025",
        title: "Tutorial",
        description: [
            "Implementado tutorial de uso da aplicação",
        ],
        apk: undefined,
        published: true,
        id: 5,
    },
    {
        version: "1.2.1",
        date: "31/01/2025",
        title: "Ícone da Aplicação",
        description: [
            "Ajuste do ícone e imagens da aplicação",
            "Correção de bugs",
        ],
        apk: undefined,
        published: true,
        id: 4,
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
        apk: undefined,
        published: true,
        id: 3,
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
        apk: undefined,
        published: true,
        id: 2,
    },
    {
        version: "1.0.0",
        date: "21/01/2025",
        title: "Aplicação Base",
        description: [
            "Aplicação base para testes internos",
        ],
        apk: undefined,
        published: true,
        id: 1,
    },
]

export default CHANGELOG