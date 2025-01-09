import { CreateSleepCycleModel } from "@/types/sleeps"
import { createSleepCycleValidator } from "@/validators/sleeps"
import { DateFormatter } from "@/utils/DateFormatter"
import { DefaultBiologicalOccurences } from "@/types/biologicalOccurences"
import { DefaultSleepHumor } from "@/types/sleepHumor"
import { Screen } from "@/components/base/Screen"
import { StyleSheet } from "react-native"
import { SyncContextProvider } from "@/contexts/SyncContext"
import { useRouter } from "expo-router"
import { useState } from "react"
import BiologicalOccurencesInfoModal from "@/components/screens/sleeps/biologicalOccurencesInfoModal"
import Box from "@/components/base/Box"
import CustomButton from "@/components/customs/CustomButton"
import CustomSwitch from "@/components/customs/CustomSwitch"
import DatePickerShow from "@/components/date/DatePickerShow"
import DreamAppender from "@/components/screens/sleeps/DreamAppender"
import Info from "@/components/base/Info"
import React from "react"
import SleepService from "@/services/api/SleepService"
import TextBold from "@/components/base/TextBold"
import TimePickerShow from "@/components/date/TimePickerShow"
import validatorErrorParser from "@/validators/base/validatorErrorParser"

export default function CreateSleepScreen() {
    const router = useRouter()
    const { checkIsConnected } = SyncContextProvider()
    const [ sleepCycleModel, setSleepCycleModel ] = useState<CreateSleepCycleModel>({
        sleepStart: DateFormatter.fixUTC(new Date().getTime()),
        sleepEnd: DateFormatter.fixUTC(new Date().getTime()),
        wakeUpHumor: DefaultSleepHumor,
        layDownHumor: DefaultSleepHumor,
        biologicalOccurences: DefaultBiologicalOccurences,
        dreams: [],
    })
    const [ showLayDownHumors, setShowLayDownHumors ] = useState<boolean>(false)
    const [ showWakeUpHumors, setShowWakeUpHumors ] = useState<boolean>(false)
    const [ showBiologicalOccurences, setShowBiologicalOccurences ] = useState<boolean>(false)
    const [ openBiologicalOccurencesInfoModal, setOpenBiologicalOccurencesInfoModal ] = useState<boolean>(false)

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
                <Box.Row style={ styles.sleepTimeContainer }>
                    <Box.Column style={ styles.sleepTimeIndividualContainer }>
                        <TextBold>Horário de dormir</TextBold>
                        <DatePickerShow date={ sleepCycleModel.sleepStart } onChange={ (e) => { setSleepCycleModel({ ...sleepCycleModel, sleepStart: e })}} />
                        <TimePickerShow time={ sleepCycleModel.sleepStart } onChange={ (e) => { setSleepCycleModel({ ...sleepCycleModel, sleepStart: e })}} />
                    </Box.Column>
                    <Box.Column style={ styles.sleepTimeIndividualContainer }>
                        <TextBold>Horário de acordar</TextBold>
                        <DatePickerShow date={ sleepCycleModel.sleepEnd } onChange={ (e) => { setSleepCycleModel({ ...sleepCycleModel, sleepEnd: e })}} />
                        <TimePickerShow time={ sleepCycleModel.sleepEnd } onChange={ (e) => { setSleepCycleModel({ ...sleepCycleModel, sleepEnd: e })}} />
                    </Box.Column>
                </Box.Row>
                <Box.Column>
                    <Box.Row style={ styles.centerShowSwitches }>
                        <CustomSwitch
                            value={ showLayDownHumors }
                            label=""
                            onChange={ (e) => setShowLayDownHumors(e) }
                        />
                        <TextBold>Humores ao dormir</TextBold>
                    </Box.Row>
                    {
                        showLayDownHumors
                            ? <>
                                <Box.Column style={ styles.switches }>
                                    <CustomSwitch
                                        value={ sleepCycleModel.layDownHumor.calm }
                                        label="Calma"
                                        onChange={ (e) => setSleepCycleModel({ ...sleepCycleModel, layDownHumor: { ...sleepCycleModel.layDownHumor, undefinedHumor: false, calm: e }})}
                                    />
                                    <CustomSwitch
                                        value={ sleepCycleModel.layDownHumor.drowsiness }
                                        label="Preguiça"
                                        onChange={ (e) => setSleepCycleModel({ ...sleepCycleModel, layDownHumor: { ...sleepCycleModel.layDownHumor, undefinedHumor: false, drowsiness: e }})}
                                    />
                                    <CustomSwitch
                                        value={ sleepCycleModel.layDownHumor.tiredness }
                                        label="Cansaço"
                                        onChange={ (e) => setSleepCycleModel({ ...sleepCycleModel, layDownHumor: { ...sleepCycleModel.layDownHumor, undefinedHumor: false, tiredness: e }})}
                                    />
                                    <CustomSwitch
                                        value={ sleepCycleModel.layDownHumor.anxiety }
                                        label="Ansiedade"
                                        onChange={ (e) => setSleepCycleModel({ ...sleepCycleModel, layDownHumor: { ...sleepCycleModel.layDownHumor, undefinedHumor: false, anxiety: e }})}
                                    />
                                    <CustomSwitch
                                        value={ sleepCycleModel.layDownHumor.happiness }
                                        label="Felicidade"
                                        onChange={ (e) => setSleepCycleModel({ ...sleepCycleModel, layDownHumor: { ...sleepCycleModel.layDownHumor, undefinedHumor: false, happiness: e }})}
                                    />
                                    <CustomSwitch
                                        value={ sleepCycleModel.layDownHumor.fear }
                                        label="Medo"
                                        onChange={ (e) => setSleepCycleModel({ ...sleepCycleModel, layDownHumor: { ...sleepCycleModel.layDownHumor, undefinedHumor: false, fear: e }})}
                                    />
                                    <CustomSwitch
                                        value={ sleepCycleModel.layDownHumor.sadness }
                                        label="Tristeza"
                                        onChange={ (e) => setSleepCycleModel({ ...sleepCycleModel, layDownHumor: { ...sleepCycleModel.layDownHumor, undefinedHumor: false, sadness: e }})}
                                    />
                                    <CustomSwitch
                                        value={ sleepCycleModel.layDownHumor.other }
                                        label="Outro"
                                        onChange={ (e) => setSleepCycleModel({ ...sleepCycleModel, layDownHumor: { ...sleepCycleModel.layDownHumor, undefinedHumor: false, other: e }})}
                                    />
                                    <CustomSwitch
                                        value={ sleepCycleModel.layDownHumor.undefinedHumor }
                                        label="Indefinido"
                                        onChange={ (e) =>
                                            setSleepCycleModel({
                                                ...sleepCycleModel,
                                                layDownHumor: {
                                                    calm: false,
                                                    drowsiness: false,
                                                    tiredness: false,
                                                    anxiety: false,
                                                    happiness: false,
                                                    fear: false,
                                                    sadness: false,
                                                    other: false,
                                                    undefinedHumor: e
                                                }
                                            })
                                        }
                                    />
                                </Box.Column>
                            </>
                            : <></>
                    }
                </Box.Column>
                <Box.Column>
                    <Box.Row style={ styles.centerShowSwitches }>
                        <CustomSwitch
                            value={ showWakeUpHumors }
                            label=""
                            onChange={ (e) => setShowWakeUpHumors(e) }
                        />
                        <TextBold>Humores ao acordar</TextBold>
                    </Box.Row>
                    {
                        showWakeUpHumors
                            ? <>
                                <Box.Column style={ styles.switches }>
                                    <CustomSwitch
                                        value={ sleepCycleModel.wakeUpHumor.calm }
                                        label="Calma"
                                        onChange={ (e) => setSleepCycleModel({ ...sleepCycleModel, wakeUpHumor: { ...sleepCycleModel.wakeUpHumor, undefinedHumor: false, calm: e }})}
                                    />
                                    <CustomSwitch
                                        value={ sleepCycleModel.wakeUpHumor.drowsiness }
                                        label="Preguiça"
                                        onChange={ (e) => setSleepCycleModel({ ...sleepCycleModel, wakeUpHumor: { ...sleepCycleModel.wakeUpHumor, undefinedHumor: false, drowsiness: e }})}
                                    />
                                    <CustomSwitch
                                        value={ sleepCycleModel.wakeUpHumor.tiredness }
                                        label="Cansaço"
                                        onChange={ (e) => setSleepCycleModel({ ...sleepCycleModel, wakeUpHumor: { ...sleepCycleModel.wakeUpHumor, undefinedHumor: false, tiredness: e }})}
                                    />
                                    <CustomSwitch
                                        value={ sleepCycleModel.wakeUpHumor.anxiety }
                                        label="Ansiedade"
                                        onChange={ (e) => setSleepCycleModel({ ...sleepCycleModel, wakeUpHumor: { ...sleepCycleModel.wakeUpHumor, undefinedHumor: false, anxiety: e }})}
                                    />
                                    <CustomSwitch
                                        value={ sleepCycleModel.wakeUpHumor.happiness }
                                        label="Felicidade"
                                        onChange={ (e) => setSleepCycleModel({ ...sleepCycleModel, wakeUpHumor: { ...sleepCycleModel.wakeUpHumor, undefinedHumor: false, happiness: e }})}
                                    />
                                    <CustomSwitch
                                        value={ sleepCycleModel.wakeUpHumor.fear }
                                        label="Medo"
                                        onChange={ (e) => setSleepCycleModel({ ...sleepCycleModel, wakeUpHumor: { ...sleepCycleModel.wakeUpHumor, undefinedHumor: false, fear: e }})}
                                    />
                                    <CustomSwitch
                                        value={ sleepCycleModel.wakeUpHumor.sadness }
                                        label="Tristeza"
                                        onChange={ (e) => setSleepCycleModel({ ...sleepCycleModel, wakeUpHumor: { ...sleepCycleModel.wakeUpHumor, undefinedHumor: false, sadness: e }})}
                                    />
                                    <CustomSwitch
                                        value={ sleepCycleModel.wakeUpHumor.other }
                                        label="Outro"
                                        onChange={ (e) => setSleepCycleModel({ ...sleepCycleModel, wakeUpHumor: { ...sleepCycleModel.wakeUpHumor, undefinedHumor: false, other: e }})}
                                    />
                                    <CustomSwitch
                                        value={ sleepCycleModel.wakeUpHumor.undefinedHumor }
                                        label="Indefinido"
                                        onChange={ (e) =>
                                            setSleepCycleModel({
                                                ...sleepCycleModel,
                                                wakeUpHumor: {
                                                    calm: false,
                                                    drowsiness: false,
                                                    tiredness: false,
                                                    anxiety: false,
                                                    happiness: false,
                                                    fear: false,
                                                    sadness: false,
                                                    other: false,
                                                    undefinedHumor: e
                                                }
                                            })
                                        }
                                    />
                                </Box.Column>
                            </>
                            : <></>
                    }
                </Box.Column>
                <Box.Column>
                    <Box.Row style={ styles.centerShowSwitches }>
                        <CustomSwitch
                            value={ showBiologicalOccurences }
                            label=""
                            onChange={ (e) => setShowBiologicalOccurences(e) }
                        />
                        <TextBold>Ocorrências biológicas durante o sono</TextBold>
                    </Box.Row>
                    {
                        showBiologicalOccurences
                            ? <>
                                <CustomButton
                                    title="Informações sobre ocorrências biológicas"
                                    onPress={ () => setOpenBiologicalOccurencesInfoModal(true) }
                                />
                                <BiologicalOccurencesInfoModal
                                    visible={ openBiologicalOccurencesInfoModal }
                                    setVisible={ setOpenBiologicalOccurencesInfoModal }
                                />
                                <Box.Column style={ styles.switches }>
                                    <CustomSwitch
                                        value={ sleepCycleModel.biologicalOccurences.sudorese }
                                        label="Sudorese"
                                        onChange={ (e) => setSleepCycleModel({ ...sleepCycleModel, biologicalOccurences: { ...sleepCycleModel.biologicalOccurences, sudorese: e }})}
                                    />
                                    <CustomSwitch
                                        value={ sleepCycleModel.biologicalOccurences.bruxismo }
                                        label="Bruxismo"
                                        onChange={ (e) => setSleepCycleModel({ ...sleepCycleModel, biologicalOccurences: { ...sleepCycleModel.biologicalOccurences, bruxismo: e }})}
                                    />
                                    <CustomSwitch
                                        value={ sleepCycleModel.biologicalOccurences.apneiaDoSono }
                                        label="Apnéia do Sono"
                                        onChange={ (e) => setSleepCycleModel({ ...sleepCycleModel, biologicalOccurences: { ...sleepCycleModel.biologicalOccurences, apneiaDoSono: e }})}
                                    />
                                    <CustomSwitch
                                        value={ sleepCycleModel.biologicalOccurences.ronco }
                                        label="Ronco"
                                        onChange={ (e) => setSleepCycleModel({ ...sleepCycleModel, biologicalOccurences: { ...sleepCycleModel.biologicalOccurences, ronco: e }})}
                                    />
                                    <CustomSwitch
                                        value={ sleepCycleModel.biologicalOccurences.movimentosPeriodicosDosMembros }
                                        label="Movimentos Periódicos dos Membros"
                                        onChange={ (e) => setSleepCycleModel({ ...sleepCycleModel, biologicalOccurences: { ...sleepCycleModel.biologicalOccurences, movimentosPeriodicosDosMembros: e }})}
                                    />
                                    <CustomSwitch
                                        value={ sleepCycleModel.biologicalOccurences.despertaresParciais }
                                        label="Despertares Parciais"
                                        onChange={ (e) => setSleepCycleModel({ ...sleepCycleModel, biologicalOccurences: { ...sleepCycleModel.biologicalOccurences, despertaresParciais: e }})}
                                    />
                                    <CustomSwitch
                                        value={ sleepCycleModel.biologicalOccurences.refluxoGastroesofagico }
                                        label="Refluxo Gastroesofágico"
                                        onChange={ (e) => setSleepCycleModel({ ...sleepCycleModel, biologicalOccurences: { ...sleepCycleModel.biologicalOccurences, refluxoGastroesofagico: e }})}
                                    />
                                    <CustomSwitch
                                        value={ sleepCycleModel.biologicalOccurences.sialorreia }
                                        label="Sialorréia"
                                        onChange={ (e) => setSleepCycleModel({ ...sleepCycleModel, biologicalOccurences: { ...sleepCycleModel.biologicalOccurences, sialorreia: e }})}
                                    />
                                    <CustomSwitch
                                        value={ sleepCycleModel.biologicalOccurences.arritmias }
                                        label="Arritmias"
                                        onChange={ (e) => setSleepCycleModel({ ...sleepCycleModel, biologicalOccurences: { ...sleepCycleModel.biologicalOccurences, arritmias: e }})}
                                    />
                                    <CustomSwitch
                                        value={ sleepCycleModel.biologicalOccurences.mioclonia }
                                        label="Mioclonia"
                                        onChange={ (e) => setSleepCycleModel({ ...sleepCycleModel, biologicalOccurences: { ...sleepCycleModel.biologicalOccurences, mioclonia: e }})}
                                    />
                                    <CustomSwitch
                                        value={ sleepCycleModel.biologicalOccurences.parassonia }
                                        label="Parassonia"
                                        onChange={ (e) => setSleepCycleModel({ ...sleepCycleModel, biologicalOccurences: { ...sleepCycleModel.biologicalOccurences, parassonia: e }})}
                                    />
                                    <CustomSwitch
                                        value={ sleepCycleModel.biologicalOccurences.epistaxe }
                                        label="Epistaxe"
                                        onChange={ (e) => setSleepCycleModel({ ...sleepCycleModel, biologicalOccurences: { ...sleepCycleModel.biologicalOccurences, epistaxe: e }})}
                                    />
                                    <CustomSwitch
                                        value={ sleepCycleModel.biologicalOccurences.miccaoInvoluntaria }
                                        label="Micção Involuntária"
                                        onChange={ (e) => setSleepCycleModel({ ...sleepCycleModel, biologicalOccurences: { ...sleepCycleModel.biologicalOccurences, miccaoInvoluntaria: e }})}
                                    />
                                    <CustomSwitch
                                        value={ sleepCycleModel.biologicalOccurences.evacuacaoInvoluntaria }
                                        label="Evacuação Involuntária"
                                        onChange={ (e) => setSleepCycleModel({ ...sleepCycleModel, biologicalOccurences: { ...sleepCycleModel.biologicalOccurences, evacuacaoInvoluntaria: e }})}
                                    />
                                    <CustomSwitch
                                        value={ sleepCycleModel.biologicalOccurences.polucao }
                                        label="Polução Noturna"
                                        onChange={ (e) => setSleepCycleModel({ ...sleepCycleModel, biologicalOccurences: { ...sleepCycleModel.biologicalOccurences, polucao: e }})}
                                    />
                                </Box.Column>
                            </>
                            : <></>
                    }
                </Box.Column>
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
                        onChange={ (e) => setSleepCycleModel({ ...sleepCycleModel, dreams: e }) }
                    />
                </Box.Column>
                <Box.Column style={ styles.btns }>
                    <CustomButton
                        title="Criar Ciclo de Sono"
                        onPress={ () => createSleepCycle() }
                    />
                    <CustomButton
                        title="Voltar"
                        onPress={ () => router.navigate("/(tabs)/(sleeps)/sleepsList") }
                    />
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
    sleepTimeContainer: {
        justifyContent: "space-evenly",
    },
    sleepTimeIndividualContainer: {
        alignItems: "center",
    },
    centerShowSwitches: {
        alignItems: "center",
    },
    switches: {
        paddingLeft: 20,
    },
    btns: {
        gap: 5,
        paddingTop: 15,
    },
})