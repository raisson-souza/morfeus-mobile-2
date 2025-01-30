import { DateFormatter } from "@/utils/DateFormatter"
import { DreamListedByUserType } from "@/types/dream"
import { Text, Pressable, StyleSheet, StyleProp, ViewStyle } from "react-native"
import { useRouter } from "expo-router"
import Box from "@/components/base/Box"
import IconEntypo from "react-native-vector-icons/Entypo"
import React, { useState } from "react"

type DreamListedByUserProps = {
    dream: DreamListedByUserType
    showDate?: boolean
    titleSize?: number
    containerStyle?: StyleProp<ViewStyle>
    sleepId?: number
    redirectToTag?: boolean
    isHiddenOrErotic?: boolean
}

export default function DreamListedByUser({
    dream,
    showDate = true,
    titleSize = 30,
    containerStyle = {},
    sleepId = undefined,
    redirectToTag = true,
    isHiddenOrErotic = false,
}: DreamListedByUserProps) {
    const [ showDream, setShowDream ] = useState<boolean>(!isHiddenOrErotic)
    const router = useRouter()

    const treatDate = () => {
        const dateFormatted = DateFormatter.removeTime(dream.date).split("-")
        return `${ dateFormatted[2] }-${ dateFormatted[1] }-${ dateFormatted[0][2] }${ dateFormatted[0][3] }`
    }
    const treatedDate = treatDate()

    const onDreamDatePress = () => {
        if (sleepId)
            router.navigate({ pathname: "/(tabs)/(sleeps)/getSleep", params: { id: sleepId }})
    }

    const onDreamTagPress = (title: string, id: number) => {
        if (redirectToTag)
            router.navigate({ pathname: "/getTag", params: { title: title, id: id } })
    }

    if (!showDream) {
        return (
            <Box.Row
                style={ styles.hiddenOrEroticDreamContainer}
                onPress={ () => setShowDream(true) }
            >
                <IconEntypo name="eye-with-line" size={ 20 } />
                <Text>( sonho oculto ou erótico )</Text>
            </Box.Row>
        )
    }

    return (
        <Box.Column style={{ ...styles.container, ...containerStyle as any }}>
            <Pressable onPress={ () => router.navigate({ pathname: "/getDream", params: { id: dream.id, sleepDate: treatedDate } }) }>
                <Text style={{
                    ...styles.title,
                    fontSize: titleSize
                }}>{ dream.title }</Text>
            </Pressable>
            {
                showDate
                    ?
                        <Pressable onPress={ () => onDreamDatePress() }>
                            <Text style={ styles.dateText }>{ treatedDate }</Text>
                        </Pressable>
                    : <></>
            }
            <Box.Row style={ styles.tags }>
                {
                    dream.tags.map((tag, i) => (
                        <Pressable
                            onPress={ () => onDreamTagPress(tag.title, tag.id) }
                            key={ i }
                        >
                            <Text>{ tag.title }</Text>
                        </Pressable>
                    ))
                }
            </Box.Row>
        </Box.Column>
    )
}

const styles = StyleSheet.create({
    container: {
    },
    title: {
        fontWeight: "bold",
    },
    dateText: {
        fontSize: 20,
        fontWeight: "100",
    },
    tags: {
        gap: 10,
    },
    hiddenOrEroticDreamContainer: {
        gap: 3,
    },
})