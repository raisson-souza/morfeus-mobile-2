import { CreateCompleteDreamModel } from "@/types/dream"
import { DateFormatter } from "@/utils/DateFormatter"
import { StyleSheet } from "react-native"
import { useState } from "react"
import Box from "@/components/base/Box"
import CustomButton from "@/components/customs/CustomButton"
import Info from "@/components/base/Info"
import SleepExtractionByDate from "./sleepInfoForDreamCreation/SleepExtractionByDate"
import SleepExtractionBySleepCycle from "./sleepInfoForDreamCreation/SleepExtractionBySleepCycle"
import SleepExtractionByTime from "./sleepInfoForDreamCreation/SleepExtractionByTime"

type DefineDreamSleepProps = {
    date: CreateCompleteDreamModel
    setDate: React.Dispatch<React.SetStateAction<CreateCompleteDreamModel>>
    sleepId: number | null
    setSleepId: React.Dispatch<React.SetStateAction<number | null>>
}

export default function DefineDreamSleep({ date, setDate, sleepId, setSleepId }: DefineDreamSleepProps) {
    const [ sleepExtractionType, setSleepExtractionType ] = useState<"sleep" | "date" | "time">("sleep")
    const defaultDate = DateFormatter.luxon.now().set({ hour: 0, second: 0, minute: 0, millisecond: 0 })

    const switchSleepExtraction = () => {
        if (sleepExtractionType === "sleep") {
            setSleepId(null)
            setDate({
                ...date,
                dreamNoSleepTimeKnown: null,
            })
            setSleepExtractionType("date")
        }
        else if (sleepExtractionType === "date") {
            setSleepId(null)
            setDate({
                ...date,
                dreamNoSleepDateKnown: null,
            })
            setSleepExtractionType("time")
        }
        else {
            setSleepExtractionType("sleep")
        }
    }

    const renderSleepExtraction = () => {
        switch (sleepExtractionType) {
            case "sleep":
                return <SleepExtractionBySleepCycle sleepId={ sleepId } setSleepId={ setSleepId }/>
            case "date":
                return <SleepExtractionByDate date={ date } setDate={ setDate } defaultDate={ defaultDate } />
            case "time":
                return <SleepExtractionByTime date={ date } setDate={ setDate } defaultDate={ defaultDate } />
            default:
                return <SleepExtractionBySleepCycle sleepId={ sleepId } setSleepId={ setSleepId }/>
        }
    }

    return (
        <Box.Column style={ styles.container }>
            <Box.Row style={ styles.sleepCycleExtractionQuestionContainer }>
                <Info
                    modalTitle="Data do Sonho"
                    modalDescription={[
                        "Defina a data de ocorreência de seu sonho.",
                        "A) Selecione um ciclo de sono já cadastrado como sono de seu sonho;",
                        "B) Determine uma data e período do ciclo de sono na qual o sonho ocorreu;",
                        "C) Determine uma data e horários do ciclo de sono na qual o sonho ocorreu;",
                    ]}
                    overrideInfoColor="white"
                    type="question"
                    iconSize={ 30 }
                />
                <CustomButton
                    title={
                        sleepExtractionType === "sleep"
                            ? "Eu sei em qual sono meu sonho ocorreu"
                            : sleepExtractionType === "date"
                                ? "Eu sei em qual data meu sonho ocorreu"
                                : "Eu sei em qual horário meu sonho ocorreu"
                    }
                    btnTextColor="white"
                    onPress={ () => switchSleepExtraction() }
                />
            </Box.Row>
            <Box.Column>
                { renderSleepExtraction() }
            </Box.Column>
        </Box.Column>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "royalblue",
        padding: 10,
        gap: 10,
        borderRadius: 15,
    },
    sleepCycleExtractionQuestionContainer: {
        justifyContent: "center",
        alignItems: "center",
        gap: 5,
    },
})