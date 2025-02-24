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
    showChangelogBadge: () => void
}

export default function ChangelogModal({
    open,
    setOpen,
    showChangelogBadge,
}: ChangelogModalProps) {
    const { systemStyle } = StyleContextProvider()
    const [ loading, setLoading ] = useState<boolean>(true)
    const [ changelogList, setChangelogList ] = useState<Changelog[] | null>(null)
    const [ versionId, setVersionId ] = useState<number | null>(null)

    const checkToggleShowChangelogBadge = (_changelogList: Changelog[], _versionId: number) => {
        const thereIsNewPublishedVersion = _changelogList.filter(changelog => {
            return changelog.id > _versionId && changelog.published
        }).length > 0
        if (thereIsNewPublishedVersion) showChangelogBadge()
    }

    useEffect(() => {
        const fetchChangelog = async () => {
            await FirestoreDb.getChangelog()
                .then(response => {
                    setChangelogList(response)
                    response.map((changelog, i) => {
                        if (changelog.version === env.AppVersion()) {
                            setVersionId(response.length - i)
                            checkToggleShowChangelogBadge(response, response.length - i)
                        }
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

        if (changelogList && versionId) {
            return changelogList.map((changelog, i) =>
                <Box.Column
                    key={ i }
                    style={ styles.container }
                >
                    {
                        changelog.id === versionId
                            ? <CustomText size="s" isOpposite weight="thin">Versão deste software</CustomText>
                            : changelog.id > versionId
                                ? changelog.published
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
                                    : changelog.id > (versionId + 1)
                                        ? <CustomText size="s" isOpposite weight="bold" style={{ color: "red" }}>Versão Futura</CustomText>
                                        : <CustomText size="s" isOpposite weight="bold" style={{ color: "red" }}>Próxima Versão</CustomText>
                                : <></>
                    }
                    <Box.Column style={ styles.title }>
                        <CustomText
                            size="xl"
                            isOpposite
                            weight="bold"
                        >
                            { changelog.title }
                        </CustomText>
                        {
                            changelog.published
                                ? <Box.Row>
                                    <CustomText
                                        size="s"
                                        isOpposite
                                        weight="thin"
                                    >
                                        { `Versão ${ changelog.version } - ${ changelog.date }` }
                                    </CustomText>
                                </Box.Row>
                                : <Box.Column>
                                    <CustomText
                                        size="s"
                                        isOpposite
                                    >
                                        { `Versão ${ changelog.version }` }
                                    </CustomText>
                                    <CustomText
                                        size="s"
                                        isOpposite
                                        style={{ color: "orange" }}
                                    >
                                        { `Data esperada: ${ changelog.date }` }
                                    </CustomText>
                                </Box.Column>
                        }
                    </Box.Column>
                    <Box.Column>
                        {
                            changelog.description.map((description, i) => (
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
                            ? changelog.published && changelog.apk
                                ? <Box.Center style={ styles.btn }>
                                    <CustomButton
                                        title="Acessar APK"
                                        onPress={ () => Linking.openURL(changelog.apk!) }
                                        active={ !(changelog.apk === undefined || changelog.apk === "") }
                                        btnTextColor={ systemStyle.oppositeTextColor  }
                                    />
                                </Box.Center>
                                : <></>
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