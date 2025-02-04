import { DateFormatter } from "@/utils/DateFormatter"
import { ListedSleepForDreamCreation } from "@/types/sleeps"
import { PaginationConfig } from "@/types/pagination"
import { Pressable, StyleSheet, Text } from "react-native"
import { StyleContextProvider } from "@/contexts/StyleContext"
import { useEffect, useState } from "react"
import Box from "@/components/base/Box"
import CustomButton from "@/components/customs/CustomButton"
import CustomText from "@/components/customs/CustomText"
import Datagrid from "@/components/base/Datagrid"
import Loading from "@/components/base/Loading"
import ModalBox from "@/components/base/ModalBox"
import React from "react"
import SleepService from "@/services/api/SleepService"
import TextBold from "@/components/base/TextBold"

type SleepExtractionBySleepCycleProps = {
    sleepId: number | null
    onChange: (sleepId: number | null, sleep: ListedSleepForDreamCreation | null) => void
    textColor?: string
    showSleep?: boolean
}

export default function SleepExtractionBySleepCycle({
    sleepId,
    onChange,
    textColor,
    showSleep = true,
}: SleepExtractionBySleepCycleProps) {
    const { systemStyle } = StyleContextProvider()
    textColor = textColor ? textColor : systemStyle.oppositeTextColor

    const [ sleeps, setSleeps ] = useState<ListedSleepForDreamCreation[] | null>(null)
    const [ selectedSleep, setSelectedSleep ] = useState<ListedSleepForDreamCreation | null>(null)
    const [ pagination, setPagination ] = useState<PaginationConfig>({
        page: 1,
        limit: 5,
    })
    const [ loading, setLoading ] = useState<boolean>(true)
    const [ isOpen, setIsOpen ] = useState<boolean>(false)

    const fetchSleeps = async (newPagination?: PaginationConfig) => {
        setLoading(true)
        await SleepService.ListSleepsForDreamCreation({
            pageNumber: newPagination
                ? newPagination.page
                : pagination.page
        })
            .then(response => {
                if (response.Success) {
                    setSleeps(response.Data.data)
                    setPagination({
                        page: response.Data.meta.currentPage,
                        limit: 5,
                        meta: { ...response.Data.meta },
                    })
                }
                else {
                    alert(response.ErrorMessage)
                }
                setLoading(false)
            })
    }

    useEffect(() => {
        if (!sleeps)
            fetchSleeps()
    }, [])

    const selectSleepCycle = (sleep: ListedSleepForDreamCreation) => {
        if (selectedSleep) {
            if (selectedSleep.id === sleep.id) {
                onChange(null, null)
                setSelectedSleep(null)
                return
            }
        }
        onChange(sleep.id, sleep)
        setSelectedSleep(sleep)
    }

    const renderDatagrid = (): JSX.Element => {
        if (!sleeps || !pagination) {
            return <CustomText
                style={ styles.centerDefaultMessage }
                isOpposite
            >Nenhum ciclo de sono encontrado</CustomText>
        }
        else {
            const onSelectSleepCycle = (sleep: ListedSleepForDreamCreation) => {
                selectSleepCycle(sleep)
                setIsOpen(false)
            }

            const datagridRows = sleeps.map((sleep, i) => (
                <Pressable
                    key={ i }
                    onPress={ () => onSelectSleepCycle(sleep) }
                >
                    <Box.Row>
                        <Box.Column>
                            <Box.Row style={ styles.sleepCycleContainer }>
                                <CustomText
                                    style={{
                                        color: sleepId === sleep.id
                                            ? systemStyle.secondary
                                            : systemStyle.oppositeTextColor,
                                    }}
                                >
                                    Ciclo de sono
                                </CustomText>
                                <CustomText
                                    style={{
                                        color: sleepId === sleep.id
                                            ? systemStyle.secondary
                                            : systemStyle.oppositeTextColor,
                                    }}
                                >
                                    { sleep.date as unknown as string }
                                </CustomText>
                            </Box.Row>
                            <Box.Row style={ styles.sleepCycleContainer }>
                                <CustomText
                                    style={{
                                        color: sleepId === sleep.id
                                            ? systemStyle.secondary
                                            : systemStyle.oppositeTextColor,
                                    }}
                                >
                                    { DateFormatter.removeDate(sleep.sleepStart) }
                                </CustomText>
                                <CustomText
                                    style={{
                                        color: sleepId === sleep.id
                                            ? systemStyle.secondary
                                            : systemStyle.oppositeTextColor,
                                    }}
                                >
                                    { DateFormatter.removeDate(sleep.sleepEnd) }
                                </CustomText>
                            </Box.Row>
                        </Box.Column>
                    </Box.Row>
                </Pressable>
            ))

            return (
                <Box.Center style={ styles.datagridContainer }>
                    <Datagrid
                        rows={ datagridRows }
                        pagination={ pagination }
                        onChange={ async (e) => await fetchSleeps(e) }
                        showOrderByDirection={ false }
                        showOrderBy={ false }
                        showLimit={ false }
                    />
                    <CustomButton
                        title="Fechar"
                        onPress={ () => setIsOpen(false) }
                        btnTextColor={ systemStyle.oppositeTextColor }
                    />
                </Box.Center>
            )
        }
    }

    if (loading) {
        return <Loading
            onlyLoading={ false }
            text="Buscando ciclos de sono..."
            textColor={ textColor }
        />
    }
    else if (sleeps) {
        if (sleeps.length > 0) {
            return (
                <>
                    <ModalBox
                        title="Selecione um Ciclo de Sono"
                        visible={ isOpen }
                        setVisible={ setIsOpen }
                        description={ renderDatagrid() }
                        alignDescriptionInCenter={ false }
                    />
                    {
                        showSleep
                            ? selectedSleep
                                ? <Box.Column style={ styles.centerSelectedSleepSycle }>
                                    <Text style={{ color: textColor }}>
                                        Início do sono: { DateFormatter.removeTime(selectedSleep.sleepStart) } { DateFormatter.removeDate(selectedSleep.sleepStart) }
                                    </Text>
                                    <Text style={{ color: textColor }}>
                                        Fim do sono: { DateFormatter.removeTime(selectedSleep.sleepEnd) } { DateFormatter.removeDate(selectedSleep.sleepEnd) }
                                    </Text>
                                </Box.Column>
                                : <TextBold style={{ color: textColor, ...styles.centerDefaultMessage }}>Nenhum ciclo de sono selecionado.</TextBold>
                            : <></>
                    }
                    <CustomButton
                        title="Selecione um Ciclo de Sono"
                        onPress={ () => setIsOpen(true) }
                        btnTextColor={ textColor }
                    />
                </>
            )
        }
        else {
            return <Text style={{ color: textColor, ...styles.centerDefaultMessage }}>Nenhum ciclo de sono encontrado, por favor, utilize outra opção acima.</Text>
        }
    }
    else {
        return <Loading
            onlyLoading={ false }
            text="Buscando ciclos de sono..."
            textColor={ textColor }
        />
    }
}

const styles = StyleSheet.create({
    sleepCycleContainer: {
        gap: 5,
    },
    datagridContainer: {
        gap: 10,
    },
    centerDefaultMessage: {
        alignSelf: "center",
        paddingBottom: 5,
    },
    centerSelectedSleepSycle: {
        alignItems: "center",
        paddingBottom: 5,
    },
})