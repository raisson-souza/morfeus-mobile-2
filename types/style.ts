export type Style = {
    styleName: "default" | "dark" | "light"

    backgroundColor: string

    headerBackgroundColor: string
    headerTextColor: string
    headerTextSize: number

    footerBackgroundColor: string
    footerSelectedTabBackgroundColor: string
    footerIconColor: string
    footerTextColor: string
    footerTextSize: number

    textColor: string
    inactiveTextColor: string
    oppositeTextColor: string

    iconColor: string
    inactiveIconColor: string
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

    extraSmallIconSize: number
    smallIconSize: number
    normalIconSize: number
    largeIconSize: number
    extraLargeIconSize: number
}