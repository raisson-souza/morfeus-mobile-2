import { StyleSheet } from "react-native"
import Box from "@/components/base/Box"
import Carousel from "@/components/base/Carousel"
import CHANGELOG from "@/data/changelog"
import CustomText from "@/components/customs/CustomText"

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
                <CustomText
                    size="xl"
                    isOpposite
                    weight="bold"
                >
                    { changelog.title }
                </CustomText>
                <Box.Row>
                    <CustomText
                        size="s"
                        isOpposite
                        weight="thin"
                    >
                        { `Versão ${ changelog.version } - ${ changelog.date }` }
                    </CustomText>
                </Box.Row>
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
    log: {
        gap: 5,
        flexWrap: "wrap",
        paddingBottom: 10,
    },
})