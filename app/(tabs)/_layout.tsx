import { Tabs } from "expo-router"
import Header from "@/components/base/Header"
import IconIonicons from "react-native-vector-icons/Ionicons"
import LayoutStyles from "@/styles/layouts"

export default function RootLayout() {
    return (
        <Tabs
            initialRouteName='index'
            screenOptions={{
                ...LayoutStyles.tabs,
                header: ({ navigation }) => {
                    return <Header navigateTo={ (route) => navigation.navigate(route) } />
                },
            }}
        >
            <Tabs.Screen
                name='index'
                options={{
                    tabBarLabel: "Home",
                    tabBarIcon: ({ size }) => (<IconIonicons name="home-outline" color="white" size={ size } />),
                }}
            />
            <Tabs.Screen
                name='(dreams)'
                options={{
                    title: "Sonhos",
                    headerShown: false,
                    tabBarIcon: ({ size }) => (<IconIonicons name="cloudy-outline" color="white" size={ size } />),
                }}
            />
            <Tabs.Screen
                name='(sleeps)'
                options={{
                    title: "Ciclos de Sono",
                    headerShown: false,
                    tabBarIcon: ({ size }) => (<IconIonicons name="moon-outline" color="white" size={ size } />),
                }}
            />
            <Tabs.Screen
                name='(analysis)'
                options={{
                    title: "Análises",
                    headerShown: false,
                    tabBarIcon: ({ size }) => (<IconIonicons name="bar-chart-outline" color="white" size={ size } />),
                }}
            />
        </Tabs>
    )
}