import React, { useState, useEffect } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from 'react-native-vector-icons/Ionicons';
import { NavigationContainer, getFocusedRouteNameFromRoute, } from "@react-navigation/native";
import ForFun from '../ForFun'
import Prediction from '../Prediction'
import Home from "../Home";
import Header from "./header";
import Report from '../Report';


const Tab = createBottomTabNavigator();
export default ({ theme }: any) => {
    const [modalVisible, setModalVisible] = useState(false);
    return (
        <>
            <Report modalVisible={modalVisible} setModalVisible={setModalVisible} theme={theme} />

            <Tab.Navigator initialRouteName="Home"
                screenOptions={{
                    header: (props) => <Header {...props} onPress={() => setModalVisible(true)} theme={theme} />
                }}>
                <Tab.Screen name="Home"
                    options={
                        ({ route }) => ({
                            tabBarStyle: ((route) => {
                                const routeName = getFocusedRouteNameFromRoute(route) ?? ""
                                if (routeName == 'Report' || routeName == 'Camera' || routeName == 'Preview') {
                                    return { display: "none" }
                                }
                                return
                            })(route),
                            tabBarIcon: ({ color, size }) => (
                                <Ionicons name="home" color={color} size={size} />
                            ),
                            headerShown: false
                        })
                    } >
                    {() => <Home theme={theme} />}
                </Tab.Screen>
                <Tab.Screen name="ForFun" component={ForFun}
                    options={{
                        tabBarIcon: ({ color, size }) => (
                            <Ionicons name="game-controller" color={color} size={size} />
                        ),
                    }} />
                <Tab.Screen name="Predict"
                    options={{
                        headerShown: false,
                        tabBarIcon: ({ color, size }) => (
                            <Ionicons name="flask-sharp" color={color} size={size} />
                        ),
                    }} >
                    {() =>
                        (<Prediction onPress={() => setModalVisible(true)} theme={theme} />)
                    }
                </Tab.Screen>
            </Tab.Navigator>

        </>
    )
}

