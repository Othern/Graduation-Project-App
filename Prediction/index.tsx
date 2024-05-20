import React from "react";
import { StyleSheet, Text, View, ScrollView } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Header from "../Tab/header";
import Preview from "./Preview";
import Details from "./Details";

const Stack = createNativeStackNavigator();

export default ({onPress,theme}:any) => {
    return (<Stack.Navigator initialRouteName="Preview" screenOptions={
        {
            header: (props) => <Header {...props} onPress={onPress} theme={theme}/>
        }} >
        <Stack.Screen name="Preview" component={Preview}  />
        <Stack.Screen name="Details" component={Details}  />
    </Stack.Navigator>
    )
}


const styles = StyleSheet.create({
    predict: {

    }
})


