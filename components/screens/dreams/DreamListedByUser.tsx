import { DateFormatter } from "@/utils/DateFormatter"
import { DreamListedByUserType } from "@/types/dream"
import { StyleContextProvider } from "@/contexts/StyleContext"
import { StyleSheet, StyleProp, ViewStyle } from "react-native"
import { useRouter } from "expo-router"
import Box from "@/components/base/Box"
import CustomText from "@/components/customs/CustomText"
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
    titleSize,
    containerStyle = {},
    sleepId = undefined,
    redirectToTag = true,
    isHiddenOrErotic = false,
}: DreamListedByUserProps) {
    const { systemStyle } = StyleContextProvider()
    titleSize = titleSize ? titleSize : systemStyle.largeTextSize

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
                <IconEntypo name="eye-with-line" size={ systemStyle.normalIconSize } color={ systemStyle.iconColor } />
                <CustomText>( sonho oculto ou erótico )</CustomText>
            </Box.Row>
        )
    }

    return (
        <Box.Column style={{ ...containerStyle as any }}>
            <CustomText
                onPress={ () => router.navigate({ pathname: "/getDream", params: { id: dream.id, sleepDate: treatedDate } }) }
                size="xxl"
                weight="bold"
            >
                { dream.title }
            </CustomText>
            {
                showDate
                    ? <CustomText
                        onPress={ () => onDreamDatePress() }
                        weight="thin"
                    >
                        { treatedDate }
                    </CustomText>
                    : <></>
            }
            <Box.Row style={ styles.tags }>
                {
                    dream.tags.map((tag, i) => (
                        <CustomText
                            onPress={ () => onDreamTagPress(tag.title, tag.id) }
                            key={ i }
                        >
                            { tag.title }
                        </CustomText>
                    ))
                }
            </Box.Row>
        </Box.Column>
    )
}

const styles = StyleSheet.create({
    tags: {
        columnGap: 10,
        flexWrap: "wrap",
    },
    hiddenOrEroticDreamContainer: {
        gap: 10,
        alignItems: "center",
    },
})