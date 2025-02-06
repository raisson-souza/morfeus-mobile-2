import { Style } from "@/types/style"

const defaultStyle: Style = {
    styleName: "default",
    backgroundColor: "#fff",
    headerBackgroundColor: "#00008B",
    headerTextColor: "#fff",
    footerBackgroundColor: "#00008B",
    footerSelectedTabBackgroundColor: "#4169E1",
    btnImportantBackgroundColor: "#00008B",
    footerIconColor: "#fff",
    footerTextColor: "#fff",
    textColor: "#000",
    inactiveTextColor: "#808080",
    oppositeTextColor: "#fff",
    iconColor: "#000",
    inactiveIconColor: "#808080",
    oppositeIconColor: "#fff",
    btnOutlineColor: "#38B4E1",
    btnBackgroundColor: "#fff",
    primary: "#00008B",
    secondary: "#4169E1",
    terciary: "#12518E",
    quaternary: "#d3d3d3",

    headerTextSize: 23,
    footerTextSize: 23,

    extraSmallTextSize: 14,
    smallTextSize: 16,
    normalTextSize: 18,
    largeTextSize: 20,
    extraLargeTextSize: 22,
    xXLargeTextSize: 30,

    extraSmallIconSize: 15,
    smallIconSize: 20,
    normalIconSize: 25,
    largeIconSize: 30,
    extraLargeIconSize: 35,
    xXLargeIconSize: 40,
}

const DarkStyle: Style = {
    ...defaultStyle,
    styleName: "dark",

    backgroundColor: "#fff",

    headerBackgroundColor: "#00008B",
    headerTextColor: "#fff",

    footerBackgroundColor: "#00008B",
    footerSelectedTabBackgroundColor: "#4169E1",
    footerIconColor: "#fff",
    footerTextColor: "#fff",

    btnImportantBackgroundColor: "#00008B",
    btnOutlineColor: "#38B4E1",
    btnBackgroundColor: "#fff",

    textColor: "#000",
    inactiveTextColor: "#808080",
    oppositeTextColor: "#fff",

    iconColor: "#000",
    inactiveIconColor: "#808080",
    oppositeIconColor: "#fff",

    primary: "#00008B",
    secondary: "#4169E1",
    terciary: "#12518E",
    quaternary: "#d3d3d3",
}

const LightStyle: Style = {
    ...defaultStyle,
    styleName: "light",

    backgroundColor: "#fff", // branco

    headerBackgroundColor: "#00008B", // darkblue
    headerTextColor: "#fff", // branco

    footerBackgroundColor: "#00008B", // darkblue
    footerSelectedTabBackgroundColor: "#4169E1", // royalblue
    footerIconColor: "#fff", // branco
    footerTextColor: "#fff", // branco

    btnImportantBackgroundColor: "#00008B", // darkblue
    btnOutlineColor: "#38B4E1", // lightblue
    btnBackgroundColor: "#fff", // branco

    textColor: "#000", // black
    inactiveTextColor: "#808080", // gray
    oppositeTextColor: "#fff", // branco

    iconColor: "#000", // black
    inactiveIconColor: "#808080", // gray
    oppositeIconColor: "#fff", // branco

    primary: "#00008B", // darkblue
    secondary: "#4169E1", // royalblue
    terciary: "#12518E", // outro azul escuro
    quaternary: "#d3d3d3", // lightgray
}

export { LightStyle, DarkStyle }