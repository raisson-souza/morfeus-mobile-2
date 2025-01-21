import { PaginationConfig } from "@/types/pagination"
import { Picker } from "@react-native-picker/picker"
import { StyleSheet, Text } from "react-native"
import AntDesignIcons from "react-native-vector-icons/AntDesign"
import Box from "./Box"
import CustomInput from "../customs/CustomInput"
import React from "react"
import TextBold from "./TextBold"

type DatagridProps = {
    rows: JSX.Element[]
    showLimit?: boolean
    showOrderBy?: boolean
    showOrderByDirection?: boolean
    pagination: PaginationConfig
    onChange: (pagination: PaginationConfig) => void
}

export default function Datagrid({
    rows,
    showLimit = false,
    showOrderBy = false,
    showOrderByDirection = false,
    pagination,
    onChange,
}: DatagridProps) {
    const renderPage = () => {
        const canAdvancePage = pagination.meta
            ? !(pagination.meta.lastPage === pagination.page)
            : true
        const canRewindPage = !(pagination.page === 1)

        return (
            <Box.Row style={ styles.page }>
                <AntDesignIcons
                    name="left"
                    size={ 30 }
                    color={ canRewindPage ? styles.text.color : "gray" }
                    onPress={ () => canRewindPage ? handlePage(pagination.page - 1) : {} }
                />
                <TextBold
                    style={{ ...styles.text, ...styles.pageText }}
                >
                    { pagination.page }
                </TextBold>
                <AntDesignIcons
                    name="right"
                    size={ 30 }
                    color={ canAdvancePage ? styles.text.color : "gray" }
                    onPress={ () => canAdvancePage ? handlePage(pagination.page + 1) : {} }
                />
            </Box.Row>
        )
    }

    const handlePage = (page: number) => {
        if (Number.isNaN(page)) return
        if (page <= 0) return
        const newPagination = {
            ...pagination,
            page: page,
        }
        onChange(newPagination)
    }

    const handleLimit = (limit: 5 | 10 | 20 | 50 | 100) => {
        const newPagination = {
            ...pagination,
            limit: limit,
        }
        onChange(newPagination)
    }

    const handleOrderBy = (column: string) => {
        const newPagination = {
            ...pagination,
            orderBy: column,
        }
        onChange(newPagination)
    }

    const handleOrderByDirection = (direction: "asc" | "desc") => {
        const newPagination = {
            ...pagination,
            orderByDirection: direction,
        }
        onChange(newPagination)
    }

    return (
        <Box.Column style={ styles.container }>
            {
                showLimit || showOrderBy || showOrderByDirection
                    ? (
                        <Box.Column style={ styles.paginationContainer }>
                            {
                                showLimit
                                    ? (
                                        <>
                                            <Text style={ styles.text }>Itens por página</Text>
                                            <Picker
                                                selectedValue={ pagination.limit }
                                                onValueChange={ (e) => {
                                                    handleLimit(e as 5 | 10 | 20 | 50 | 100)
                                                }}
                                                style={{ color:"white", width: 150 }}
                                            >
                                                <Picker.Item label="5" value="5" />
                                                <Picker.Item label="10" value="10" />
                                                <Picker.Item label="20" value="20" />
                                                <Picker.Item label="50" value="50" />
                                                <Picker.Item label="100" value="100" />
                                            </Picker>
                                        </>
                                    )
                                    : <></>
                            }
                            {
                                showOrderBy
                                    ? (
                                        <CustomInput
                                            label="Ordenar por"
                                            labelStyle={ styles.text }
                                            inputStyle={ styles.text }
                                            keyboardType="ascii-capable"
                                            defaultValue={ pagination.orderBy }
                                            onChange={ (e) =>
                                                handleOrderBy(e)
                                            }
                                        />
                                    )
                                    : <></>
                            }
                            {
                                showOrderByDirection
                                    ? (
                                        <>
                                            <Text style={ styles.text }>Direção da ordenação</Text>
                                            <Picker
                                                selectedValue={ pagination.orderByDirection === "asc" ? 1 : 2 }
                                                onValueChange={ (e) => {
                                                    handleOrderByDirection(e === 1 ? "asc" : "desc")
                                                }}
                                                style={{ color:"white", width: 150 }}
                                            >
                                                <Picker.Item label="asc" value={ 1 } />
                                                <Picker.Item label="desc" value={ 2 } />
                                            </Picker>
                                        </>
                                    )
                                    : <></>
                            }
                        </Box.Column>
                    )
                    : <></>
            }
            <Box.Column style={ styles.rowsContainer }>
                { rows }
            </Box.Column>
            { renderPage() }
        </Box.Column>
    )
}

const styles = StyleSheet.create({
    container: {
        gap: 10,
    },
    paginationContainer: {
        gap: 10,
        borderBottomWidth: 1,
        borderBottomColor: "white",
    },
    text: {
        color: "white"
    },
    rowsContainer: {
        gap: 10,
    },
    page: {
        alignItems: "center",
        alignSelf: "center",
        gap: 20,
    },
    pageText: {
        fontSize: 25,
    },
})