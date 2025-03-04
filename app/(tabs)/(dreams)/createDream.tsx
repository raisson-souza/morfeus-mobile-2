import { CreateCompleteDreamModel, CreateDreamModel } from "@/types/dream"
import { DateFormatter } from "@/utils/DateFormatter"
import { Screen } from "@/components/base/Screen"
import { StyleSheet } from "react-native"
import { SyncContextProvider } from "@/contexts/SyncContext"
import { useCustomBackHandler } from "@/hooks/useHardwareBackPress"
import { useEffect, useState } from "react"
import { useNavigation, useRouter } from "expo-router"
import Box from "@/components/base/Box"
import ConfirmActionButton from "@/components/screens/general/ConfirmActionButton"
import CreateCompleteDream from "@/components/screens/dreams/CreateCompleteDream"
import CustomButton from "@/components/customs/CustomButton"
import CustomText from "@/components/customs/CustomText"
import DefineDreamSleep from "@/components/screens/dreams/DefineDreamSleep"
import DreamService from "@/services/api/DreamService"
import HELPERS from "@/data/helpers"
import Info from "@/components/base/Info"
import Loading from "@/components/base/Loading"

const defaultDreamModel: CreateDreamModel = {
    title: "",
    description: "",
    dreamPointOfViewId: 1,
    climate: {
        ameno: false,
        calor: false,
        garoa: false,
        chuva: false,
        tempestade: false,
        nevoa: false,
        neve: false,
        multiplos: false,
        outro: false,
        indefinido: false,
    },
    dreamHourId: 2,
    dreamDurationId: 2,
    dreamLucidityLevelId: 1,
    dreamTypeId: 1,
    dreamRealityLevelId: 1,
    eroticDream: false,
    hiddenDream: false,
    personalAnalysis: null,
    tags: [],
    sleepId: null,
}

export default function CreateDreamScreen() {
    const router = useRouter()
    const navigation = useNavigation()
    const { checkIsConnected } = SyncContextProvider()
    const [ dreamModel, setDreamModel ] = useState<CreateDreamModel>(defaultDreamModel)
    const [ completeDreamModel, setCompleteDreamModel ] = useState<CreateCompleteDreamModel>({
        dreamNoSleepDateKnown: null,
        dreamNoSleepTimeKnown: null,
    })
    const [ sleepId, setSleepId ] = useState<number | null>(null)
    const [ loading, setLoading ] = useState<boolean>(false)
    const [ canExit, setCanExit] = useState<boolean>(true)

    useEffect(() => {
        return navigation.addListener("blur", () => {
            setDreamModel(defaultDreamModel)
            setCompleteDreamModel({
                dreamNoSleepDateKnown: null,
                dreamNoSleepTimeKnown: null,
            })
            setSleepId(null)
            setCanExit(true)
        })
    }, [])

    useCustomBackHandler({
        canExit: canExit,
    })

    const createDream = async () => {
        setLoading(true)
        await DreamService.Create({
            ...dreamModel,
            sleepId: sleepId,
            dreamNoSleepDateKnown: completeDreamModel.dreamNoSleepDateKnown
                ? {
                    date: DateFormatter.forBackend.date(completeDreamModel.dreamNoSleepDateKnown.date.getTime()),
                    period: completeDreamModel.dreamNoSleepDateKnown.period
                }
                : null,
            dreamNoSleepTimeKnown: completeDreamModel.dreamNoSleepTimeKnown
                ? {
                    date: DateFormatter.forBackend.date(completeDreamModel.dreamNoSleepTimeKnown.date.getTime()),
                    sleepStart: DateFormatter.forBackend.timestamp(completeDreamModel.dreamNoSleepTimeKnown.sleepStart.getTime()),
                    sleepEnd: DateFormatter.forBackend.timestamp(completeDreamModel.dreamNoSleepTimeKnown.sleepEnd.getTime()),
                }
                : null,
        })
        .then(response => {
            if (response.Success) {
                alert(response.Data)
                router.navigate("/dreamsList")
                return
            }
            setLoading(false)
            alert(response.ErrorMessage)
        })
    }

    return (
        <Screen>
            <Box.Column style={ styles.container }>
                <Info
                    infoDescription={ HELPERS.createDream.infoDescription }
                    modalTitle={ HELPERS.createDream.modalTitle }
                    modalDescription={ HELPERS.createDream.modalDescription }
                    type="question"
                />
                <CustomText
                    weight="bold"
                >
                    Defina a data de seu sonho
                </CustomText>
                <DefineDreamSleep
                    date={ completeDreamModel }
                    setDate={ setCompleteDreamModel }
                    sleepId={ sleepId }
                    setSleepId={ setSleepId }
                />
                <CreateCompleteDream
                    dream={ dreamModel }
                    onChange={ (e) => {
                        setDreamModel(e)
                        setCanExit(false)
                    }}
                    isLocked={ loading }
                />
                <Info
                    infoDescription="Sua noite de sono"
                    modalTitle="NOITE DE SONO"
                    modalDescription={[
                        "Agora você está cadastrando um sonho completo, mas durante a noite na qual esse sonho ocorreu você suou? dormiu cansado?",
                        "Não esqueça de preencher essas informações editando a noite de sono que será criada para você ao salvar esse sonho!"
                    ]}
                />
                {
                    loading
                        ? <Box.Column style={ styles.loading }>
                            <Loading onlyLoading={ false } text="Criando Sonho..." />
                        </Box.Column>
                        : <CustomButton
                            title="Criar Sonho"
                            onPress={ () => createDream() }
                            important
                        />
                }
                {
                    canExit
                        ? <CustomButton
                            title={ canExit ? "Voltar" : "Cancelar Sonho" }
                            onPress={ () => router.back() }
                            active={ !loading }
                        />
                        : <ConfirmActionButton
                            btnTitle="Cancelar Sonho"
                            description="Certeza que deseja cancelar esse sonho?"
                            onConfirm={ () => router.back() }
                            btnColor={{ text: "red", border: "red" }}
                        />
                }
                
            </Box.Column>
        </Screen>
    )
}

const styles = StyleSheet.create({
    container: {
        width: "100%",
        gap: 10,
    },
    loading: {
        alignSelf: "center",
    },
})