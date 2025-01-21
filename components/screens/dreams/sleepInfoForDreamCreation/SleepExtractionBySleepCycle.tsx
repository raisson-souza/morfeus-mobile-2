import { DateFormatter } from "@/utils/DateFormatter"
import { ListedSleepForDreamCreation } from "@/types/sleeps"
import { PaginationConfig } from "@/types/pagination"
import { Pressable, StyleSheet, Text } from "react-native"
import { useEffect, useState } from "react"
import Box from "@/components/base/Box"
import CustomButton from "@/components/customs/CustomButton"
import Datagrid from "@/components/base/Datagrid"
import Loading from "@/components/base/Loading"
import ModalBox from "@/components/base/ModalBox"
import React from "react"
import SleepService from "@/services/api/SleepService"
import TextBold from "@/components/base/TextBold"

type SleepExtractionBySleepCycleProps = {
    sleepId: number | null
    setSleepId: React.Dispatch<React.SetStateAction<number | null>>
}

export default function SleepExtractionBySleepCycle({ sleepId, setSleepId }: SleepExtractionBySleepCycleProps) {
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
        setSleepId(sleep.id)
        setSelectedSleep(sleep)
    }

    const renderDatagrid = (): JSX.Element => {
        if (!sleeps || !pagination) {
            return <TextBold style={ styles.text }>Nenhum ciclo de sono encontrado</TextBold>
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
                                <TextBold
                                    style={{
                                        ...styles.sleepCycleText, 
                                        ...styles.text,
                                        color: sleepId === sleep.id
                                            ? "royalblue"
                                            : "white",
                                    }}
                                >
                                    Ciclo de sono
                                </TextBold>
                                <TextBold
                                    style={{
                                        ...styles.sleepCycleText,
                                        ...styles.text,
                                        color: sleepId === sleep.id
                                            ? "royalblue"
                                            : "white",
                                    }}
                                >
                                    { sleep.date }
                                </TextBold>
                            </Box.Row>
                            <Box.Row style={ styles.sleepCycleContainer }>
                                <Text
                                    style={{
                                        ...styles.text,
                                        color: sleepId === sleep.id
                                            ? "royalblue"
                                            : "white",
                                    }}
                                >
                                    { DateFormatter.removeDate(sleep.sleepStart) }
                                </Text>
                                <Text
                                    style={{
                                        ...styles.text,
                                        color: sleepId === sleep.id
                                            ? "royalblue"
                                            : "white",
                                    }}
                                >
                                    { DateFormatter.removeDate(sleep.sleepEnd) }
                                </Text>
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
                        btnTextColor="white"
                    />
                </Box.Center>
            )
        }
    }

    if (loading) {
        return <Loading
            onlyLoading={ false }
            text="Buscando ciclos de sono..."
            textColor="white"
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
                        selectedSleep
                            ? <>
                                <Text style={ styles.text }>
                                    Início do sono: { DateFormatter.removeTime(selectedSleep.sleepStart) } { DateFormatter.removeDate(selectedSleep.sleepStart) }
                                </Text>
                                <Text style={ styles.text }>
                                    Fim do sono: { DateFormatter.removeTime(selectedSleep.sleepEnd) } { DateFormatter.removeDate(selectedSleep.sleepEnd) }
                                </Text>
                            </>
                            : <TextBold style={ styles.text }>Nenhum ciclo de sono selecionado.</TextBold>
                    }
                    <CustomButton
                        title="Selecione um Ciclo de Sono"
                        onPress={ () => setIsOpen(true) }
                        btnTextColor="white"
                    />
                </>
            )
        }
        else {
            return <Text style={ styles.text }>Nenhum ciclo de sono encontrado, por favor, utilize outra opção acima.</Text>
        }
    }
    else {
        return <Loading
            onlyLoading={ false }
            text="Buscando ciclos de sono..."
            textColor="white"
        />
    }
}

const styles = StyleSheet.create({
    text: {
        color: "white",
    },
    sleepCycleContainer: {
        gap: 5,
    },
    sleepCycleText: {
        fontSize: 20,
    },
    datagridContainer: {
        gap: 10,
    },
})