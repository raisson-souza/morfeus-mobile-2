import { CustomImage } from "@/components/customs/CustomImage"
import { StyleSheet } from "react-native"
import Box from "@/components/base/Box"
import CustomButton from "@/components/customs/CustomButton"

type BtnType = {
    title: string
    action: () => void
}

type DefaultHomeScreenProps = {
    imagePathByRequire: any
    btns: BtnType[]
    overrideChildren?: JSX.Element
}

export default function DefaultHomeScreen({
    imagePathByRequire,
    btns,
    overrideChildren,
} : DefaultHomeScreenProps) {
    const children = overrideChildren
        ? overrideChildren
        : btns.map((btn, i) =>
            <CustomButton
                key={ i }
                title={ btn.title }
                onPress={ () => btn.action() }
            />
        )

    return <Box.Column style={ styles.container }>
        <CustomImage.Local
            filePathByRequire={ imagePathByRequire }
            style={ styles.image }
        />
        <Box.Column style={ styles.childrenContainer }>
            { children }
        </Box.Column>
    </Box.Column>
}

const styles = StyleSheet.create({
    container: {
        width: "100%",
        gap: 10,
    },
    image: {
        resizeMode: "cover",
        width: "100%",
        height: 150,
        borderRadius: 10,
    },
    childrenContainer: {
        gap: 15,
    },
})