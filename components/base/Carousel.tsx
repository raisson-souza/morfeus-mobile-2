import { StyleSheet } from "react-native"
import Box from "./Box"
import CustomButton from "../customs/CustomButton"
import IconEntypo from "react-native-vector-icons/Entypo"
import ModalBox from "./ModalBox"
import React, { useState } from "react"

type CarouselProps = {
    visible: boolean
    setVisible: React.Dispatch<React.SetStateAction<boolean>>
    components: JSX.Element[]
    limit?: number
    title?: string
}

export default function Carousel({
    visible,
    setVisible,
    components,
    limit = 5,
    title,
}: CarouselProps) {
    const [ page, setPage ] = useState<number>(1)
    const finalPage = Math.ceil(components.length / limit)

    if (!visible) return <></>

    const renderComponents = () => {
        const initialIndex = ((page - 1) * limit)
        return components.slice(initialIndex, initialIndex + limit)
    }

    const onPrevious = () => {
        if (page === 1) return
        setPage(page - 1)
    }

    const onNext = () => {
        if (page === finalPage) return
        setPage(page + 1)
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
                    size={ page === (i + 1) ? 35 : 20 }
                    color="white"
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
                <Box.Column style={ styles.container }>
                    { renderComponents() as any }
                    { renderRemainingPages() }
                    <Box.Row style={ styles.btns }>
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
                        <CustomButton
                            btnTextColor="white"
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
        backgroundColor: "darkblue",
        width: "80%",
        gap: 10,
        padding: 10,
        borderRadius: 15,
    },
    btns: {
        width: "100%",
        justifyContent: "space-between",
    },
    pagesDots: {
        alignSelf: "center",
        alignItems: "center",
    },
})