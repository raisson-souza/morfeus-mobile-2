import { CreateSleepCycleModel } from "@/types/sleeps"
import { createSleepCycleValidator } from "@/validators/sleeps"
import { DateFormatter } from "@/utils/DateFormatter"
import { DefaultBiologicalOccurences } from "@/types/biologicalOccurences"
import { DefaultSleepHumor } from "@/types/sleepHumor"
import { Screen } from "@/components/base/Screen"
import { StyleSheet } from "react-native"
import { SyncContextProvider } from "@/contexts/SyncContext"
import { useCustomBackHandler } from "@/hooks/useHardwareBackPress"
import { useEffect, useRef, useState } from "react"
import { useNavigation, useRouter } from "expo-router"
import BiologicalOccurencesForm from "@/components/screens/sleeps/BiologicalOccurencesForm"
import Box from "@/components/base/Box"
import ConfirmActionButton from "@/components/screens/general/ConfirmActionButton"
import CustomButton from "@/components/customs/CustomButton"
import DreamAppender from "@/components/screens/sleeps/DreamAppender"
import HELPERS from "@/data/helpers"
import HumorsForm from "@/components/screens/sleeps/HumorsForm"
import Info from "@/components/base/Info"
import React from "react"
import SleepCycleHoursForm from "@/components/screens/sleeps/SleepCycleHoursForm"
import SleepService from "@/services/api/SleepService"
import validatorErrorParser from "@/validators/base/validatorErrorParser"

const defaultSleepCycleModel: CreateSleepCycleModel = {
    sleepStart: DateFormatter.fixUTC(new Date().getTime()),
    sleepEnd: DateFormatter.fixUTC(new Date().getTime()),
    wakeUpHumor: DefaultSleepHumor,
    layDownHumor: DefaultSleepHumor,
    biologicalOccurences: DefaultBiologicalOccurences,
    dreams: [],
}

export default function CreateSleepScreen() {
    const router = useRouter()
    const navigation = useNavigation()
    const { checkIsConnected } = SyncContextProvider()
    const [ sleepCycleModel, setSleepCycleModel ] = useState<CreateSleepCycleModel>(defaultSleepCycleModel)
    const [ isHoursPending, setIsHoursPending ] = useState<boolean>(true)
    const [ canCreateSleepCycle, setCanCreateSleepCycle ] = useState<boolean>(true)
    const sleepCycleCreationActionsRef = useRef<number>(0)
    const [ canExit, setCanExit ] = useState<boolean>(true)

    useEffect(() => {
        return navigation.addListener("blur", () => {
            sleepCycleCreationActionsRef.current = 0
            setSleepCycleModel(defaultSleepCycleModel)
            setCanCreateSleepCycle(true)
            setCanExit(true)
        })
    }, [])

    useCustomBackHandler({
        canExit: canExit,
    })

    const increaseSleepCycleCreationActions = () => {
        sleepCycleCreationActionsRef.current += 1
        if (sleepCycleCreationActionsRef.current === 2) {
            setIsHoursPending(false)
            setCanExit(false)
        }
    }

    const createSleepCycle = async () => {
        const parsedSleepCycleModel = createSleepCycleValidator.safeParse(sleepCycleModel)

        if (!parsedSleepCycleModel.success) {
            const errorMessage = validatorErrorParser(parsedSleepCycleModel.error)
            alert(errorMessage)
            return
        }

        const response = await SleepService.Create(checkIsConnected(),
            {
                sleepStart: DateFormatter.forBackend.timestamp(sleepCycleModel.sleepStart.getTime()),
                sleepEnd: DateFormatter.forBackend.timestamp(sleepCycleModel.sleepEnd.getTime()),
                wakeUpHumor: sleepCycleModel.wakeUpHumor,
                layDownHumor: sleepCycleModel.layDownHumor,
                biologicalOccurences: sleepCycleModel.biologicalOccurences,
                dreams: sleepCycleModel.dreams,
            }
        )

        if (response.Success) {
            alert("Ciclo de sono criado com sucesso.")
            router.navigate("/(tabs)/(sleeps)/sleepsList")
            return
        }

        alert(response.ErrorMessage)
    }

    return (
        <Screen>
            <Box.Column style={ styles.container }>
                <Info
                    infoDescription={ HELPERS.createSleepCycle.infoDescription }
                    modalTitle={ HELPERS.createSleepCycle.modalTitle }
                    modalDescription={ HELPERS.createSleepCycle.modalDescription }
                    type="question"
                />
                <SleepCycleHoursForm
                    sleepStart={ sleepCycleModel.sleepStart }
                    sleepEnd={ sleepCycleModel.sleepEnd }
                    onChange={ (type, e) => {
                        setSleepCycleModel({
                            ...sleepCycleModel,
                            sleepStart: type === "start" ? e : sleepCycleModel.sleepStart,
                            sleepEnd: type === "end" ? e : sleepCycleModel.sleepEnd,
                        })
                        increaseSleepCycleCreationActions()
                    }}
                />
                <HumorsForm
                    title="Humores ao dormir"
                    value={ sleepCycleModel.layDownHumor }
                    onChange={ (e) => {
                        setSleepCycleModel({
                            ...sleepCycleModel,
                            layDownHumor: e,
                        })
                        setCanExit(false)
                    }}
                />
                <HumorsForm
                    title="Humores ao acordar"
                    value={ sleepCycleModel.wakeUpHumor }
                    onChange={ (e) => {
                        setSleepCycleModel({
                            ...sleepCycleModel,
                            wakeUpHumor: e,
                        })
                        setCanExit(false)
                    }}
                />
                <BiologicalOccurencesForm
                    value={ sleepCycleModel.biologicalOccurences }
                    onChange={ (e) => {
                        setSleepCycleModel({
                            ...sleepCycleModel,
                            biologicalOccurences: e,
                        })
                        setCanExit(false)
                    }}
                />
                <Box.Column>
                    <Info
                        infoDescription="Cadastro de sonhos"
                        modalTitle="Cadastrar um sonho ao cadastrar um ciclo de sono"
                        modalDescription={[
                            "Durante o cadastro de um ciclo de sono você pode cadastrar até 3 sonhos.",
                            "Caso desejável, você pode cadastrar um 4° sonho neste mesmo ciclo de sono na aba de SONHOS.",
                            "É possível editar e excluir os sonhos cadastrados aqui após o salvamento na aba de SONHOS."
                        ]}
                    />
                    <DreamAppender
                        onChange={ (e, isCreatingDream) => {
                            setCanCreateSleepCycle(!isCreatingDream)
                            setSleepCycleModel({ ...sleepCycleModel, dreams: e })
                            setCanExit(false)
                        }}
                    />
                </Box.Column>
                <Box.Column style={ styles.btns }>
                    <CustomButton
                        title="Criar Ciclo de Sono"
                        onPress={ () => createSleepCycle() }
                        active={ canCreateSleepCycle && !isHoursPending }
                        important
                    />
                    {
                        canExit
                            ? <CustomButton
                                title="Voltar"
                                onPress={ () => router.back() }
                            />
                            : <ConfirmActionButton
                                btnTitle="Cancelar Ciclo de Sono"
                                description="Certeza que deseja cancelar esse ciclo de sono?"
                                onConfirm={ () => router.back() }
                                btnColor={{ text: "red", border: "red" }}
                            />
                    }
                </Box.Column>
            </Box.Column>
        </Screen>
    )
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        gap: 5,
    },
    btns: {
        gap: 5,
        paddingTop: 15,
    },
})