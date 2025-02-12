import { DreamModel } from "@/types/dream"
import { Screen } from "@/components/base/Screen"
import { StyleSheet } from "react-native"
import { SyncContextProvider } from "@/contexts/SyncContext"
import { useEffect, useState } from "react"
import { useLocalSearchParams, useRouter } from "expo-router"
import Box from "@/components/base/Box"
import CustomButton from "@/components/customs/CustomButton"
import CustomText from "@/components/customs/CustomText"
import DreamListedByUser from "@/components/screens/dreams/DreamListedByUser"
import Loading from "@/components/base/Loading"
import TagService from "@/services/api/TagService"

type GetTagParams = {
    id: string
    title: string
}

export default function GetTagScreen() {
    const router = useRouter()
    const { id, title } = useLocalSearchParams<GetTagParams>()
    const { checkIsConnected } = SyncContextProvider()
    const [ dreams, setDreams ] = useState<DreamModel[] | null>(null)
    const [ errorMessage, setErrorMessage ] = useState<string | null>(null)

    useEffect(() => {
        const fetchTag = async () => {
            await TagService.ListDreamsByTag(checkIsConnected(), { tagId: Number.parseInt(id) })
                .then(response => {
                    if (response.Success) {
                        setDreams(response.Data)
                        return
                    }
                    setErrorMessage(response.ErrorMessage ?? "")
                })
        }
        fetchTag()
    }, [])

    return (
        <Screen>
            <Box.Center style={ styles.container }>
                <CustomText
                    size="xl"
                    weight="bold"
                    selectable
                >
                    { `TAG ${ title }` }
                </CustomText>
                {
                    dreams
                        ? dreams.length > 0
                            ? (
                                <Box.Column style={ styles.dreamContainer }>
                                    <CustomText size="l">SONHOS:</CustomText>
                                    <Box.Column style={ styles.dreamsContainer }>
                                        {
                                            dreams.map((dream, i) =>
                                                <DreamListedByUser
                                                    dream={{
                                                        id: dream.id,
                                                        title: dream.title,
                                                        date: "",
                                                        tags: [],
                                                    }}
                                                    showDate={ false }
                                                    titleSize={ 23 }
                                                    sleepId={ dream.sleepId }
                                                    isHiddenOrErotic={ dream.hiddenDream || dream.eroticDream }
                                                    key={ i }
                                                />
                                            )
                                        }
                                    </Box.Column>
                                </Box.Column>
                            )
                            : <CustomText>Nenhum sono encontrado.</CustomText>
                        : errorMessage
                            ? (
                                <Box.Column>
                                    <CustomText>{ `Houve um erro ao buscar os sonhos da tag ${ title }:` }</CustomText>
                                    <CustomText>{ errorMessage }</CustomText>
                                </Box.Column>
                            )
                            : <Loading onlyLoading={ false } text="Buscando Sonhos..." />
                }
                <CustomButton
                    title="Voltar"
                    onPress={ () => router.back() }
                />
            </Box.Center>
        </Screen>
    )
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        gap: 15,
    },
    dreamContainer: {
        width: '100%',
    },
    dreamsContainer: {
        paddingLeft: 20,
        gap: 10,
    },
})