import React, { useState ,useEffect} from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from 'react-native-vector-icons/Ionicons';
import { NavigationContainer, useFocusEffect, useNavigation } from "@react-navigation/native";
import ForFun from '../ForFun'
import Prediction from '../Prediction'
import Home from "../Home";
import Header from "./header";
import Report from '../Report';
import { StyleSheet } from "react-native";
import { DefaultTheme,DarkTheme } from "@react-navigation/native";


const Tab = createBottomTabNavigator();
export default ({theme}: any) => {
    const [modalVisible, setModalVisible] = useState(false);
    return (
        <>
            <Report modalVisible={modalVisible} setModalVisible={setModalVisible} theme={theme}/>
            <NavigationContainer theme={theme === 'dark' ? DarkTheme: DefaultTheme}>
                <Tab.Navigator initialRouteName="Home" 
                    screenOptions={{
                        header: (props)=> <Header {...props} onPress={() => setModalVisible(true)} theme={theme}/>
                    }}>
                    <Tab.Screen name="Home" component={Home}
                        options={{
                            tabBarIcon: ({ color, size }) => (
                                <Ionicons name="home" color={color} size={size} />
                            ),
                        }} />
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
                            ),}} >
                            {()=> 
                                (<Prediction onPress={() => setModalVisible(true)} theme={theme}/>)
                            }
                    </Tab.Screen>
                </Tab.Navigator>
            </NavigationContainer>
        </>
    )
}

