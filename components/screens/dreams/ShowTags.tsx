import Box from "@/components/base/Box"
import CustomText from "@/components/customs/CustomText"
import { StyleContextProvider } from "@/contexts/StyleContext"
import { useRouter } from "expo-router"
import { StyleSheet } from "react-native"

type ShowTag = {
    id?: number
    title: string
    quantity?: number
}

type ShowTagsProps = {
    tags: ShowTag[]
}

export default function ShowTags({
    tags,
}: ShowTagsProps) {
    const { systemStyle } = StyleContextProvider()
    const router = useRouter()

    const smallestTagSize = tags.reduce((smallerTagSize, currentTag) => {
        return currentTag.quantity ?? 0 < smallerTagSize
            ? currentTag.quantity ?? 0
            : smallerTagSize
    }, tags[0].quantity ?? 0)

    const biggestTagSize = tags.reduce((smallerTagSize, currentTag) => {
        return currentTag.quantity ?? 0 > smallerTagSize
            ? currentTag.quantity ?? 0
            : smallerTagSize
    }, tags[0].quantity ?? 0)

    const mediumTagSize = (smallestTagSize + biggestTagSize) / 2

    const averageTagsSizeSetter = () => {
        if (smallestTagSize === 0 && biggestTagSize === 0) return 0

        const tagSizeDiff = biggestTagSize - mediumTagSize

        if (tagSizeDiff >= 10) return 5
        if (tagSizeDiff >= 7) return 4
        if (tagSizeDiff >= 5) return 3
        if (tagSizeDiff >= 3) return 2
        else return 0
    }
    const tagSizeDiffGap = averageTagsSizeSetter()

    const defineTagSize = (tagSize?: number) => {
        if (tagSize) {
            if (tagSize === smallestTagSize) return "s"
            if (tagSize > smallestTagSize && tagSize < (mediumTagSize - tagSizeDiffGap)) return "m"
            if (tagSize >= (mediumTagSize - tagSizeDiffGap) && tagSize <= (mediumTagSize + tagSizeDiffGap)) return "l"
            if (tagSize >= (mediumTagSize - tagSizeDiffGap) && tagSize < biggestTagSize) return "xl"
            else return "xxl"
        }
        return "m"
    }

    const onTagPress = (tagTitle: string, tagId?: number) => {
        if (tagId) router.navigate({ pathname: "/(tabs)/(dreams)/getTag", params: { "id": tagId, "title": tagTitle }})
    }

    return <Box.Row
        style={{
            ...styles.container,
            backgroundColor: systemStyle.secondary
        }}
    >
        {
            tags.length > 0
                ? tags.map((tag, i) =>
                    <Box.Center
                        key={ i }
                        onPress={ () => onTagPress(tag.title, tag.id) }
                    >
                        <CustomText
                            size={ defineTagSize(tag.quantity) }
                            weight="bold"
                            isOpposite
                        >
                            { tag.title }
                        </CustomText>
                    </Box.Center>
                )
                : <CustomText>Não há Tags</CustomText>
        }
    </Box.Row>
}

const styles = StyleSheet.create({
    container: {
        width: "100%",
        justifyContent: "center",
        padding: 10,
        borderRadius: 15,
        flexWrap: "wrap",
        gap: 5,
    },
})