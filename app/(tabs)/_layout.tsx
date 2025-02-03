import { GetTabStyle } from "@/data/layout"
import { Tabs } from "expo-router"
import AuthRoute from "@/components/auth/Auth"
import IconIonicons from "react-native-vector-icons/Ionicons"

export default function RootLayout() {
    return (
        <AuthRoute>
            <Tabs
                initialRouteName='home'
                screenOptions={ GetTabStyle() }
            >
                <Tabs.Screen
                    name='home'
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
        </AuthRoute>
    )
}