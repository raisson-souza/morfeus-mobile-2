import { StyleContextProvider } from "@/contexts/StyleContext"
import { StyleProp, Text, TextStyle } from "react-native"

interface CustomTextProps {
    children: string
    style?: StyleProp<TextStyle>
    size?: "s" | "m" | "l" | "xl"
    isOpposite?: boolean
    weight?: "thin" | "normal" | "bold"
}

const CustomText: React.FC<CustomTextProps> = ({
    children,
    style = {},
    size = "m",
    isOpposite = false,
    weight = "normal",
}) => {
    const { systemStyle } = StyleContextProvider()

    const defineTextSize = () => {
        switch (size) {
            case "s": return systemStyle.smallTextSize
            case "m": return systemStyle.normalTextSize
            case "l": return systemStyle.largeTextSize
            case "xl": return systemStyle.smallTextSize
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
            ...style as any,
            color: isOpposite ? systemStyle.oppositeTextColor : systemStyle.textColor,
            fontSize: defineTextSize(),
            fontWeight: defineTextWeight(),
        }}>
            { children }
        </Text>
    )
}

export default CustomText