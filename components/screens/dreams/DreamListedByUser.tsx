import { DateFormatter } from "@/utils/DateFormatter"
import { DreamListedByUserType } from "@/types/dream"
import { Text, Pressable, StyleSheet, StyleProp, ViewStyle } from "react-native"
import { useRouter } from "expo-router"
import Box from "@/components/base/Box"
import React from "react"

type DreamListedByUserProps = {
    dream: DreamListedByUserType
    showDate?: boolean
    titleSize?: number
    containerStyle?: StyleProp<ViewStyle>
}

export default function DreamListedByUser({ dream, showDate = true, titleSize = 30, containerStyle = {} }: DreamListedByUserProps) {
    const router = useRouter()

    const treatDate = () => {
        const dateFormatted = DateFormatter.removeTime(dream.date).split("-")
        return `${ dateFormatted[2] }-${ dateFormatted[1] }-${ dateFormatted[0][2] }${ dateFormatted[0][3] }`
    }
    const treatedDate = treatDate()

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
                        <Pressable
                            onPress={ () => router.navigate({ pathname: "/(tabs)/(sleeps)/getSleep", params: { date: dream.date }})}
                        >
                            <Text style={ styles.dateText }>{ treatedDate }</Text>
                        </Pressable>
                    : <></>
            }
            <Box.Row style={ styles.tags }>
                {
                    dream.tags.map((tag, i) => (
                        <Pressable
                            onPress={ () => router.navigate({ pathname: "/getTag", params: { title: tag.title, id: tag.id } }) }
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
})