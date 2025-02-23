import { StyleContextProvider } from "@/contexts/StyleContext"
import { StyleSheet } from "react-native"
import { useSQLiteContext } from "expo-sqlite"
import Box from "@/components/base/Box"
import CustomButton from "@/components/customs/CustomButton"
import CustomText from "@/components/customs/CustomText"
import IconEntypo from "react-native-vector-icons/Entypo"
import ModalBox from "@/components/base/ModalBox"
import React, { useState } from "react"

type TutorialModalProps = {
    open: boolean
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
    dbRecord: boolean
    canOutsideClick?: boolean
}

// Existe um ajuste mockado neste arquivo para contornar um possível incidente de softlock

export default function TutorialModal({
    open,
    setOpen,
    dbRecord,
    canOutsideClick = false,
}: TutorialModalProps) {
    const db = useSQLiteContext()

    const onLastPageAction = async () => {
        if (dbRecord) await db.runAsync('UPDATE PARAMS SET tutorial_read = 1');
    }

    const renderComponent = (title: string, description: string[], i: number) => {
        return <Box.Column key={ i }>
            <CustomText isOpposite>{ `${ title }:` }</CustomText>
            <>
                {
                    description.map((_description, i) => (
                        <CustomText
                            key={ i }
                            size="s"
                            isOpposite
                        >{ `${ _description  }.` }</CustomText>
                    ))
                }
            </>
        </Box.Column>
    }

    const components = [
        renderComponent(
            "Sobre o Aplicativo",
            [
                "Morfeus é uma aplicação que realiza o controle do ciclo do sono, gerenciamento de sonhos e geração de estatísticas como forma de prover autoconhecimento ao utilizador",
                "Morfeus = filho de “Hipnos”, é o deus do sono e a personificação dos sonhos segundo a mitologia grega",
            ],
            1,
        ),
        renderComponent(
            '"Helpers"',
            [
                "Ao utilizar a aplicação, você poderá encontrar alguns ícones de infomação ou questionamento seguidos ou não de frases ou perguntas, pressione-os para que um modal com explicações sobre aquele contexto surja para você",
                "Sempre que não entender alguma funcionalidade ou opção, procure por um helper",
            ],
            2,
        ),
        renderComponent(
            "Sonhos",
            [
                "Em Morfeus você poderá cadastrar seus sonhos e diversas informações sobre eles",
                "Todo sonho pertence a um único ciclo de sono, portanto, ao cadastrar um sonho você deverá definir a qual ciclo de sono já registrado por você ele pertence, ou, poderá criar junto do sonho um ciclo de sono para ele",
                'Você pode encontrar todas as funcionalidades relacionadas aos sonhos na aba "SONHOS"',
            ],
            3,
        ),
        renderComponent(
            "Ciclos de Sono",
            [
                "Em Morfeus você poderá cadastrar todos os períodos de sono que teve, sejam durante o dia ou a noite, assim como outras informações sobre eles",
                'Nesta aplicação, todo ciclo de sono que ocorre entre 18:00 até 23:59 e 00:00 até 12:00 horas torna-se um ciclo de sono "da noite anterior", portanto, sua data será do dia anterior para fins de organização',
                "Se você dormiu ontem as 21 horas e acordou hoje às 7 horas, seu ciclo de sono é noturno e tem a data definida como ontem, pois se refere a noite anterior",
                "Se você dormiu hoje entre 13 e 14 horas, seu ciclo de sono é diurno e tem a data definida como hoje, pois ocorreu durante o dia de hoje",
                'Você pode encontrar todas as funcionalidades relacionadas aos ciclos de sono na aba "CICLOS DE SONO"',
            ],
            4,
        ),
        renderComponent(
            "Análises",
            [
                "Em Morfeus seus registros de sonhos e ciclos de sono geram estatísticas mensais que podem ser criadas, atualizadas e acessadas quando quiser!",
                'Você pode encontrar todas as funcionalidades relacionadas a análises na aba "ANÁLISES"',
            ],
            5,
        ),
    ]

    return <CustomCarousel
        visible={ open }
        setVisible={ setOpen }
        title="Bem vindo ao Morfeus!"
        components={ components }
        onLastPageAction={ onLastPageAction }
        canOutsideClick={ canOutsideClick }
    />
}

type CustomCarouselProps = {
    visible: boolean
    setVisible: React.Dispatch<React.SetStateAction<boolean>>
    components: JSX.Element[]
    title?: string
    onLastPageAction: () => void
    canOutsideClick?: boolean
}

function CustomCarousel({
    visible,
    setVisible,
    components,
    title,
    onLastPageAction,
    canOutsideClick = false,
}: CustomCarouselProps) {
    const { systemStyle } = StyleContextProvider()
    const [ page, setPage ] = useState<number>(1)
    const finalPage = Math.ceil(components.length / 1)
    const [ reachedFinalPage, setReachedFinalPage ] = useState<boolean>(page === finalPage)

    if (!visible) return <></>

    const renderComponents = () => {
        const initialIndex = ((page - 1) * 1)
        return components.slice(initialIndex, initialIndex + 1)
    }

    const onPrevious = () => {
        if (page === 1) return
        setPage(page - 1)
    }

    const onNext = () => {
        if (page === finalPage) return
        setPage(page + 1)
        // ATIVA O UPDATE NO BANCO CASO PRIMEIRO ACESSO POIS ESSA TELA É GRANDE DEMAIS E PODE TRAVAR USUÁRIOS COM CELULAR PEQUENO
        // NECESSITA DE AJUSTE SE A ORDEM DAS PÁGINAS FOR ALTERADA
        if (page + 1 === 4) onLastPageAction()
        if (page + 1 === finalPage) {
            setReachedFinalPage(true)
            onLastPageAction()
        }
    }

    const onClose = () => {
        setVisible(false)
    }

    const renderRemainingPages = () => {
        if (finalPage >= 6) return <></>

        const dots: JSX.Element[] = []
        for (let i = 0; i < finalPage; i++) {
            dots.push(
                <IconEntypo
                    name="dot-single"
                    size={
                        page === (i + 1)
                            ? systemStyle.extraLargeIconSize
                            : systemStyle.smallIconSize
                    }
                    color={ systemStyle.oppositeIconColor }
                    key={ i }
                />
            )
        }
        return (
            <Box.Row style={ styles.pagesDots }>
                { dots }
            </Box.Row>
        )
    }

    return (
        <ModalBox
            visible={ visible }
            setVisible={ setVisible }
            title={ title }
            description={
                <Box.Column
                    style={{
                        backgroundColor: systemStyle.primary,
                    }}
                >
                    { renderComponents() as any }
                    { renderRemainingPages() }
                    <Box.Row style={{
                        ...styles.btns,
                        justifyContent: reachedFinalPage
                            ? "space-between"
                            : "center",
                    }}>
                        {
                            reachedFinalPage
                                ? <>
                                    <CustomButton
                                        btnTextColor="white"
                                        title="Anterior"
                                        onPress={ () => onPrevious() }
                                        active={ page != 1 }
                                    />
                                    <CustomButton
                                        btnTextColor="white"
                                        title="Fechar"
                                        onPress={ () => onClose() }
                                    />
                                </>
                                : <></>
                        }
                        <CustomButton
                            btnTextColor={ systemStyle.oppositeTextColor }
                            title="Próximo"
                            onPress={ () => onNext() }
                            active={ page != finalPage }
                        />
                    </Box.Row>
                </Box.Column>
            }
        />
    )
}

const styles = StyleSheet.create({
    container: {
        width: "100%",
        borderRadius: 15,
    },
    btns: {
        width: "100%",
    },
    pagesDots: {
        alignSelf: "center",
        alignItems: "center",
    },
    tutorialText: {
        textAlign: "justify",
    },
})