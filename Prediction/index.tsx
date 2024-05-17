import React from "react";
import { StyleSheet, Text, View, ScrollView } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Preview from "./Preview";
import Details from "./Details";

const Stack = createNativeStackNavigator();

export default ({previewTitle,detailsTitle,headerRight}:any) => {
    return (<Stack.Navigator initialRouteName="Preview" screenOptions={
        {
            headerStyle: {
                backgroundColor: '#FFA500',
            },
            headerTintColor: '#FFFFFF',
            headerRight: headerRight
        }} >
        <Stack.Screen name="Preview" component={Preview} options={{
            headerTitle: previewTitle
        }} />
        <Stack.Screen name="Details" component={Details} options={{
            headerTitle: detailsTitle
        }} />
    </Stack.Navigator>
    )
}


const styles = StyleSheet.create({
    predict: {

    }
})


