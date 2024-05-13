import React from "react";
import { StyleSheet, Text, View, ScrollView } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Preview from "./Preview";
import Details from "./Details";
import HeaderRight from '../Tab/headerRight';
import HeaderTitle from "./HeaderTitle";
const Stack = createNativeStackNavigator();

export default () => {
    return (<Stack.Navigator initialRouteName="Preview" screenOptions={
        {
            headerStyle: {
                backgroundColor: '#FFA500',
            },
            headerTintColor: '#FFFFFF',
        }} >
        <Stack.Screen name="Preview" component={Preview} options={{
            headerTitle: () => <HeaderTitle name={'Preview'} />,
        }} />
        <Stack.Screen name="Details" component={Details} options={{
            headerTitle: () => <HeaderTitle name={"Details"} />,
        }} />
    </Stack.Navigator>
    )
}


const styles = StyleSheet.create({
    predict: {

    }
})


