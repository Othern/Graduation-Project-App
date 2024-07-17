import React from "react";
import { StyleSheet } from "react-native";
import { createStackNavigator } from '@react-navigation/stack';
import Header from "./Header";
import Preview from "./Preview";
import Details from "./Details";

const Stack = createStackNavigator();

export default ({ onPress, theme }: any) => {
    return (
        <Stack.Navigator 
            initialRouteName="Preview" 
            screenOptions={{
                header: (props) => <Header {...props} onPress={onPress} theme={theme} />
            }}
        >
            <Stack.Screen name="Preview" component={Preview} />
            <Stack.Screen name="Details" component={Details} />
        </Stack.Navigator>
    );
};

const styles = StyleSheet.create({
    predict: {}
});



