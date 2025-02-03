export type Style = {
    styleName: "default" | "dark" | "light"

    backgroundColor: string

    headerBackgroundColor: string
    headerTextSize: number

    footerBackgroundColor: string
    footerSelectedTabBackgroundColor: string
    footerIconColor: string
    footerTextColor: string
    footerTextSize: number

    textColor: string
    oppositeTextColor: string

    iconColor: string
    oppositeIconColor: string

    btnOutlineColor: string
    btnBackgroundColor: string
    btnImportantBackgroundColor: string

    primary: string
    secondary: string
    terciary: string

    smallTextSize: number
    normalTextSize: number
    largeTextSize: number
    extraLargeTextSize: number

    smallIconSize: number
    normalIconSize: number
    largeIconSize: number
    extraLargeIconSize: number
}