import { StyleContextProvider } from "@/contexts/StyleContext"
import { StyleProp, Text, TextStyle } from "react-native"

interface CustomTextProps {
    children: string | number
    style?: StyleProp<TextStyle>
    size?: "s" | "m" | "l" | "xl" | "xxl"
    isOpposite?: boolean
    weight?: "thin" | "normal" | "bold"
    onPress?: () => void
    selectable?: boolean
}

const CustomText: React.FC<CustomTextProps> = ({
    children,
    style = {},
    size = "m",
    isOpposite = false,
    weight = "normal",
    onPress,
    selectable = false,
}) => {
    const { systemStyle } = StyleContextProvider()

    const defineTextSize = () => {
        switch (size) {
            case "s": return systemStyle.smallTextSize
            case "m": return systemStyle.normalTextSize
            case "l": return systemStyle.largeTextSize
            case "xl": return systemStyle.extraLargeTextSize
            case "xxl": return systemStyle.xXLargeTextSize
        }
    }

    const defineTextWeight = () => {
        switch (weight) {
            case "thin": return 300
            case "normal": return 400
            case "bold": return 700
        }
    }

    return (
        <Text
            style={{
                color: isOpposite ? systemStyle.oppositeTextColor : systemStyle.textColor,
                fontSize: defineTextSize(),
                fontWeight: defineTextWeight(),
                ...style as any,
            }}
            onPress={ () => onPress ? onPress() : {} }
            selectable={ selectable }
        >
            { children }
        </Text>
    )
}

export default CustomText