import React from "react";
import { useColorScheme } from "react-native";
import ToastMessage from './toastMessage';
import { PaperProvider } from 'react-native-paper';
import Tab from "./Tab";
import LoginAssociate from "./Login";
import 'react-native-gesture-handler'
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer,DefaultTheme,DarkTheme } from "@react-navigation/native";


const LoginStack = createStackNavigator();
export default function(){
  const theme = useColorScheme();
    return (
    <PaperProvider>
      <NavigationContainer theme={theme === 'dark' ? DarkTheme: DefaultTheme}>
      
        <LoginStack.Navigator>
          <LoginStack.Screen component={LoginAssociate} name="login" options={{headerShown:false}}/>
          <LoginStack.Screen  name="tab" options={{headerShown:false}}>
              {(props)=>(<Tab theme= {theme}/> )}
          </LoginStack.Screen>
        </LoginStack.Navigator>
        <ToastMessage theme={theme}/>
      </NavigationContainer>
    </PaperProvider >
    )
}