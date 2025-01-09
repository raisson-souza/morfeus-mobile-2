import { DefaultDreamClimate } from "@/types/dreamClimate"
import { DreamInSleepCycleModel } from "@/types/sleeps"
import { StyleSheet } from "react-native"
import { useId, useState } from "react"
import AppendDream from "./AppendDream"
import Box from "@/components/base/Box"
import CustomButton from "@/components/customs/CustomButton"
import IconAntDesign from "react-native-vector-icons/AntDesign"
import React from "react"
import TextBold from "@/components/base/TextBold"

export type DreamInSleepCycleModelListed = {
    open: boolean
    id: number
} & DreamInSleepCycleModel

type DreamAppenderProps = {
    onChange: (dreams: DreamInSleepCycleModelListed[]) => void
}

export default function DreamAppender({
    onChange,
}: DreamAppenderProps) {
    const [ dreams, setDreams ] = useState<DreamInSleepCycleModelListed[]>([])
    const [ creatingDream, setCreatingDream ] = useState<boolean>(false)
    const [ newDream, setNewDream ] = useState<DreamInSleepCycleModelListed | null>(null)
    const getNewDreamModel = (): DreamInSleepCycleModelListed => {
        return {
            id: new Date().getTime(),
            open: false,
            title: "",
            description: "",
            dreamPointOfViewId: 1,
            climate: DefaultDreamClimate,
            dreamHourId: 1,
            dreamDurationId: 1,
            dreamLucidityLevelId: 1,
            dreamTypeId: 1,
            dreamRealityLevelId: 1,
            eroticDream: false,
            hiddenDream: false,
            personalAnalysis: undefined,
            tags: [],
        }
    }

    const cancelDream = () => {
        setCreatingDream(false)
        setNewDream(null)
    }

    const saveDream = () => {
        setCreatingDream(false)
        const newDreamsList = [ ...dreams, newDream! ]
        setDreams(newDreamsList)
        onChange(newDreamsList)
        setNewDream(null)
    }

    const removeDream = (dreamId: number) => {
        setCreatingDream(false)
        const dreamList = [...dreams]
        const i = dreamList.findIndex(dream => {
            return dream.id === dreamId
        })
        dreamList.splice(i)
        setDreams(dreamList)
        setNewDream(null)
    }

    const addNewDream = () => {
        setNewDream(getNewDreamModel())
        setCreatingDream(true)
    }

    const openDream = (dreamId: number) => {
        const dreamList = [...dreams]
        const dreamInteractionIndex = dreamList.findIndex(_dream => {
            return _dream.id === dreamId
        })
        dreamList[dreamInteractionIndex].open = !dreamList[dreamInteractionIndex].open
        setDreams(dreamList)
    }

    if (dreams.length === 0 && !creatingDream) {
        return (
            <CustomButton
                title="Adicionar um Sonho"
                onPress={ () => setCreatingDream(true) }
            />
        )
    }

    if (dreams.length === 0 && creatingDream) {
        return (
            <Box.Column style={ styles.firstDreamContainer }>
                <TextBold>Cadastro de Sonho</TextBold>
                <AppendDream
                    dream={ newDream ? newDream : getNewDreamModel() }
                    onChange={ (e) => { setNewDream(e) }}
                />
                <CustomButton
                    title="Cancelar Sonho"
                    onPress={ () => cancelDream() }
                />
                <CustomButton
                    title="Salvar Sonho"
                    onPress={ () => saveDream() }
                />
            </Box.Column>
        )
    }

    // TODO: Correção na edição de sonho já salvo

    return (
        <Box.Column style={ styles.container }>
            <Box.Column style={ styles.dreamList }>
                {
                    dreams.map((dream, i) => (
                        <Box.Column
                            style={ styles.dream }
                            key={ i }
                        >
                            <Box.Row onPress={ () => openDream(dream.id) }>
                                <IconAntDesign name={ dream.open ? "down" : "right" } size={ 20 } />
                                <TextBold>{ `Sonho ${ i + 1 } - ${ dream.title }` }</TextBold>
                            </Box.Row>
                            {
                                dream.open
                                    ? <AppendDream
                                        dream={ dream }
                                        onChange={ (e) => setNewDream(e) }
                                    />
                                    : <></>
                            }
                            <CustomButton
                                title="Excluir Sonho"
                                onPress={ () => removeDream(dream.id) }
                            />
                        </Box.Column>
                    ))
                }
            </Box.Column>
            {
                creatingDream
                    ? (
                        <Box.Column style={ styles.anotherDreamContainer }>
                            <TextBold>Cadastrando novo sonho</TextBold>
                            <AppendDream
                                dream={ newDream! }
                                onChange={ (e) => setNewDream(e) }
                            />
                            <CustomButton
                                title="Cancelar Sonho"
                                onPress={ () => cancelDream() }
                            />
                            <CustomButton
                                title="Salvar Sonho"
                                onPress={ () => saveDream() }
                            />
                        </Box.Column>
                    )
                    : <></>
            }
            {
                dreams.length < 3 && !creatingDream
                    ? <CustomButton
                        title="Adicionar Novo Sonho"
                        onPress={ () => addNewDream() }
                    />
                    : <></>
            }
        </Box.Column>
    )
}

const styles = StyleSheet.create({
    firstDreamContainer: {
        gap: 5,
    },
    container: {
        gap: 5,
    },
    dreamList: {
        gap: 5,
    },
    dream: {
        gap: 3,
    },
    anotherDreamContainer: {
        gap: 5,
    },
})