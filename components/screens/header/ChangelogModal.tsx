import { StyleSheet, Text } from "react-native"
import Box from "@/components/base/Box"
import Carousel from "@/components/base/Carousel"
import CHANGELOG from "@/data/changelog"
import TextBold from "@/components/base/TextBold"

type ChangelogModalProps = {
    open: boolean
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export default function ChangelogModal({
    open,
    setOpen,
}: ChangelogModalProps) {
    const logs = CHANGELOG.map((changelog, i) => (
        <Box.Column
            key={ i }
            style={{
                ...styles.log,
                paddingBottom: i % 2 === 0 // Gap extra artificial entre logs
                    ? 10
                    : 0
            }}
        >
            <Box.Column>
                <TextBold style={{ ...styles.text, ...styles.title }}>
                    { changelog.title }
                </TextBold>
                <Box.Row>
                    <Text style={{ ...styles.text, ...styles.description }}>
                        { `Versão ${ changelog.version } - ${ changelog.date }` }
                    </Text>
                </Box.Row>
            </Box.Column>
            <Box.Column>
                {
                    changelog.description.map((description, i) => (
                        <Text
                            key={ i }
                            style={{ ...styles.text, ...styles.description }}
                        >
                            { `- ${ description };` }
                        </Text>
                    ))
                }
            </Box.Column>
        </Box.Column>
    ))

    return <Carousel
        limit={ 1 }
        components={ logs }
        visible={ open }
        setVisible={ setOpen }
        title="Changelog"
    />
}

const styles = StyleSheet.create({
    container: {
        gap: 10,
    },
    text: {
        color: "white"
    },
    log: {
        gap: 5,
        flexWrap: "wrap"
    },
    title: {
        fontSize: 18,
    },
    description: {
        fontSize: 16,
    }
})