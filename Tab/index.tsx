import React, { useState } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from 'react-native-vector-icons/Ionicons';
import { NavigationContainer, useFocusEffect, useNavigation } from "@react-navigation/native";
import Report from '../Report'
import ForFun from '../ForFun'
import Prediction from '../Prediction'
import Home from "../Home";
import HeaderTitle from "./headerTitle";
import HeaderRight from './headerRight';
import ReportModal from './reportModal';
import { StyleSheet } from "react-native";



const Tab = createBottomTabNavigator();
export default () => {
    const [modalVisible, setModalVisible] = useState(false);
    return (
        <>
            <ReportModal modalVisible={modalVisible} setModalVisible={setModalVisible} />
            <NavigationContainer>
                <Tab.Navigator initialRouteName="Predict" screenOptions={
                    {
                        headerStyle: {
                            backgroundColor: '#FFA500',
                        }
                    }
                }>
                    <Tab.Screen name="Home" component={Home}
                        options={{
                            tabBarIcon: ({ color, size }) => (
                                <Ionicons name="home" color={color} size={size} />
                            ),
                            headerTitle: () => <HeaderTitle name={'Home'} />,
                            headerRight: () => <HeaderRight name={"notification-add"} size={25} onPress={() => setModalVisible(true)} />,
                        }} />
                    <Tab.Screen name="ForFun" component={ForFun}
                        options={{
                            tabBarIcon: ({ color, size }) => (
                                <Ionicons name="game-controller" color={color} size={size} />
                            ),

                            headerTitle: () => <HeaderTitle name={'Forfun'} />,
                            headerRight: () => <HeaderRight name={"notification-add"} size={25} onPress={() => setModalVisible(true)} />

                        }} />
                    <Tab.Screen name="Predict" component={Prediction}
                        options={{
                            headerShown: false,
                            tabBarIcon: ({ color, size }) => (
                                <Ionicons name="flask-sharp" color={color} size={size} />
                            ),
                        }} />
                </Tab.Navigator>
            </NavigationContainer>
        </>
    )
}

/**
 <Tab.Screen name="Report" component={Report}
                        options={{
                            tabBarIcon: ({ color, size }) => (
                                <Ionicons name="notifications" color={color} size={size} />
                            ),
                            headerStyle: {
                                backgroundColor: '#FFA500',
                                
                              },
                            headerTitle: () => <HeaderTitle name={'Report'} />,
                            headerRight: () => <HeaderRight name={"notification-add"} size={25} onPress={() => setModalVisible(true)}/>

                        }} />
*/

