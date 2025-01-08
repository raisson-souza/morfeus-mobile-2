import { DefaultDreamClimate } from "@/types/dreamClimate"
import { DreamInSleepCycleModel } from "@/types/sleeps"
import { useId, useState } from "react"
import AppendDream from "./AppendDream"
import Box from "@/components/base/Box"
import CustomButton from "@/components/customs/CustomButton"
import IconAntDesign from "react-native-vector-icons/AntDesign"
import React from "react"
import TextBold from "@/components/base/TextBold"

export type DreamInSleepCycleModelListed = {
    open: boolean
    id: string
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
    const newDreamModel: DreamInSleepCycleModelListed = {
        id: useId(),
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

    const cancelDream = () => {
        setCreatingDream(false)
        setNewDream(null)
    }

    const saveDream = () => {
        const newDreamsList = [ ...dreams, newDream! ]
        setDreams(newDreamsList)
        onChange(newDreamsList)
        setNewDream(null)
    }

    const removeDream = (dreamId: string) => {
        const dreamList = [...dreams]
        const i = dreamList.findIndex(dream => {
            return dream.id === dreamId
        })
        dreamList.splice(i)
        setDreams(dreamList)
        setNewDream(null)
    }

    const addNewDream = () => {
        setNewDream(newDreamModel)
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
            <Box.Column>
                <AppendDream
                    dream={ newDream ? newDream : newDreamModel }
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
        <Box.Column>
            <Box.Column>
                {
                    dreams.map((dream, i) => (
                        <Box.Column key={ i }>
                            <Box.Row
                                onPress={ () => {
                                    const dreamList = [...dreams]
                                    const dreamInteractionIndex = dreamList.findIndex(_dream => {
                                        return dream.id === dream.id
                                    })
                                    dreamList[dreamInteractionIndex].open = !dreamList[dreamInteractionIndex].open
                                    setDreams(dreamList)
                                }}
                            >
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
                dreams.length < 3
                    ? <CustomButton
                        title="Adicionar Novo Sonho"
                        onPress={ () => addNewDream() }
                    />
                    : <></>
            }
        </Box.Column>
    )
}