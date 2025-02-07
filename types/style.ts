export type Style = {
    styleName: "default" | "dark" | "light"

    backgroundColor: string

    loadingColor: string

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
    quaternary: string

    extraSmallTextSize: number
    smallTextSize: number
    normalTextSize: number
    largeTextSize: number
    extraLargeTextSize: number
    xXLargeTextSize: number

    extraSmallIconSize: number
    smallIconSize: number
    normalIconSize: number
    largeIconSize: number
    extraLargeIconSize: number
    xXLargeIconSize: number
}