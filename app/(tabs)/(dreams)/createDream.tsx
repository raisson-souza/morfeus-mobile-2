import { CreateCompleteDreamModel, CreateDreamModel } from "@/types/dream"
import { DateFormatter } from "@/utils/DateFormatter"
import { Screen } from "@/components/base/Screen"
import { StyleSheet } from "react-native"
import { SyncContextProvider } from "@/contexts/SyncContext"
import { useRouter } from "expo-router"
import { useState } from "react"
import Auth from "@/components/auth/Auth"
import Box from "@/components/base/Box"
import CreateCompleteDream from "@/components/screens/dreams/CreateCompleteDream"
import CustomButton from "@/components/customs/CustomButton"
import DefineDreamSleep from "@/components/screens/dreams/DefineDreamSleep"
import DreamService from "@/services/api/DreamService"
import Info from "@/components/base/Info"
import Loading from "@/components/base/Loading"
import TextBold from "@/components/base/TextBold"

export default function CreateDreamScreen() {
    const router = useRouter()
    const { isConnectedRef: { current: isOnline }} = SyncContextProvider()
    const [ dreamModel, setDreamModel ] = useState<CreateDreamModel>({
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
    })
    const [ completeDreamModel, setCompleteDreamModel ] = useState<CreateCompleteDreamModel>({
        dreamNoSleepDateKnown: null,
        dreamNoSleepTimeKnown: null,
    })
    const [ sleepId, setSleepId ] = useState<number | null>(null)
    const [ loading, setLoading ] = useState<boolean>(false)

    const createDream = async () => {
        setLoading(true)
        await DreamService.Create(isOnline, {
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
        <Auth>
            <Screen>
                <Box.Column style={ styles.container }>
                    <TextBold style={ styles.dreamDateText }>Defina a data de seu sonho</TextBold>
                    <DefineDreamSleep
                        date={ completeDreamModel }
                        setDate={ setCompleteDreamModel }
                        sleepId={ sleepId }
                        setSleepId={ setSleepId }
                    />
                    <CreateCompleteDream
                        dream={ dreamModel }
                        setDream={ setDreamModel }
                    />
                    <Info
                        infoDescription="Sua noite de sono"
                        modalTitle="NOITE DE SONO"
                        modalDescription={[
                            "Agora você está cadastrando um sonho completo, mas durante a noite na qual esse sonho ocorreu você suou? dormiu cansado?",
                            "Não esqueça de preencher essas informações editando a noite de sono que será criada para você ao salvar esse sonho!"
                        ]}
                    />
                    <CustomButton
                        title="Criar Sonho"
                        onPress={ () => createDream() }
                    />
                    {
                        loading
                            ? <Loading onlyLoading={ false } text="Criando Sonho..." />
                            : <CustomButton
                                title="Voltar"
                                onPress={ () => {
                                    if (router.canGoBack())
                                        router.back()
                                    else
                                        router.navigate("/")
                                }}
                            />
                    }
                </Box.Column>
            </Screen>
        </Auth>
    )
}

const styles = StyleSheet.create({
    container: {
        width: "100%",
        gap: 10,
    },
    dreamDateText: {
        fontSize: 18,
    },
})