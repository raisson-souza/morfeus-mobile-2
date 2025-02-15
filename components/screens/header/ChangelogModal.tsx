import { Changelog } from "@/data/changelog"
import { Linking, StyleSheet } from "react-native"
import { StyleContextProvider } from "@/contexts/StyleContext"
import { useEffect, useState } from "react"
import Box from "@/components/base/Box"
import Carousel from "@/components/base/Carousel"
import CustomButton from "@/components/customs/CustomButton"
import CustomText from "@/components/customs/CustomText"
import env from "@/config/env"
import FirestoreDb from "@/services/firebase/FirestoreDb"
import Info from "@/components/base/Info"
import Loading from "@/components/base/Loading"

type ChangelogModalProps = {
    open: boolean
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export default function ChangelogModal({
    open,
    setOpen,
}: ChangelogModalProps) {
    const { systemStyle } = StyleContextProvider()
    const [ loading, setLoading ] = useState<boolean>(true)
    const [ changelog, setChangelog ] = useState<Changelog[] | null>(null)
    const [ versionId, setVersionId ] = useState<number | null>(null)

    useEffect(() => {
        const fetchChangelog = async () => {
            await FirestoreDb.getChangelog()
                .then(response => {
                    setChangelog(response)
                    response.map((_changelog, i) => {
                        if (_changelog.version === env.AppVersion()) setVersionId(response.length - i)
                    })
                })
                .finally(() => setLoading(false))
        }
        fetchChangelog()
    }, [])

    const loadingComponent = <Box.Center style={ styles.loading } key={ 1 }>
        <Loading loadingColor="white" />
    </Box.Center>

    const renderComponents = () => {
        if (loading) return [loadingComponent]

        if (changelog && versionId) {
            return changelog.map((_changelog, i) =>
                <Box.Column
                    key={ i }
                    style={ styles.container }
                >
                    {
                        _changelog.id > versionId
                            ? <Info
                                overrideInfoColor="red"
                                infoDescription="Nova Versão"
                                modalTitle="Nova Versão"
                                modalDescription={[
                                    env.Environment() === "testing"
                                        ? 'Faça o download da nova versão através do botão "Acessar APK".'
                                        : "Atualize seu aplicativo na Play Store."
                                ]}
                                type="warn"
                            />
                            : _changelog.id == versionId
                                ? <CustomText size="s" isOpposite weight="thin">Versão deste software</CustomText>
                                : <></>
                    }
                    <Box.Column style={ styles.title }>
                        <CustomText
                            size="xl"
                            isOpposite
                            weight="bold"
                        >
                            { _changelog.title }
                        </CustomText>
                        <Box.Row>
                            <CustomText
                                size="s"
                                isOpposite
                                weight="thin"
                            >
                                { `Versão ${ _changelog.version } - ${ _changelog.date }` }
                            </CustomText>
                        </Box.Row>
                    </Box.Column>
                    <Box.Column>
                        {
                            _changelog.description.map((description, i) => (
                                <CustomText
                                    key={ i }
                                    isOpposite
                                >
                                    { `- ${ description };` }
                                </CustomText>
                            ))
                        }
                    </Box.Column>
                    {
                        env.Environment() === "testing"
                            ? <Box.Center style={ styles.btn }>
                                <CustomButton
                                    title="Acessar APK"
                                    onPress={ () => Linking.openURL(_changelog.apk!) }
                                    active={ !(_changelog.apk === undefined || _changelog.apk === "") }
                                    btnTextColor={ systemStyle.oppositeTextColor  }
                                />
                            </Box.Center>
                            : <></>
                    }
                    <Box.Center style={ styles.margin }><></></Box.Center>
                </Box.Column>
            )
        }

        return [loadingComponent]
    }

    return <Carousel
        limit={ 1 }
        components={ renderComponents() }
        visible={ open }
        setVisible={ setOpen }
        title="Changelog"
    />
}

const styles = StyleSheet.create({
    container: {
        gap: 5,
        flexWrap: "wrap",
    },
    title: {
        gap: 3,
    },
    btn: {
        width: "100%",
        padding: 5,
    },
    loading: {
        margin: 10,
    },
    margin: {
        marginBottom: 5,
    },
})