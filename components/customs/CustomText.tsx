import { StyleContextProvider } from "@/contexts/StyleContext"
import { StyleProp, Text, TextStyle } from "react-native"

interface CustomTextProps {
    children: string
    _style?: StyleProp<TextStyle>
    size?: "s" | "m" | "l" | "xl"
    isOpposite?: boolean
    weight?: "thin" | "normal" | "bold"
}

const CustomText: React.FC<CustomTextProps> = ({
    children,
    _style = {},
    size = "m",
    isOpposite = false,
    weight = "normal",
}) => {
    const { style } = StyleContextProvider()

    const defineTextSize = () => {
        switch (size) {
            case "s": return style.smallTextSize
            case "m": return style.normalTextSize
            case "l": return style.largeTextSize
            case "xl": return style.smallTextSize
        }
    }

    const defineTextWeight = () => {
        switch (weight) {
            case "thin": return 300
            case "normal": return 400
            case "bold": return 500
        }
    }

    return (
        <Text style={{
            ..._style as any,
            color: isOpposite ? style.oppositeTextColor : style.textColor,
            fontSize: defineTextSize(),
            fontWeight: defineTextWeight(),
        }}>
            { children }
        </Text>
    )
}

export default CustomText