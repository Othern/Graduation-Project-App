import React  from "react";
import { useColorScheme } from "react-native";
import ToastMessage from './toastMessage';
import { PaperProvider } from 'react-native-paper';
import Tab from "./Tab";
import LoginAssociate from "./Login";
import 'react-native-gesture-handler'
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer,DefaultTheme,DarkTheme } from "@react-navigation/native";
import messaging from '@react-native-firebase/messaging';
import { Notify } from "./Notification/function";
import { useEffect } from "react";

messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('Background message handled:', remoteMessage);
});
const LoginStack = createStackNavigator();
export default function(){
  const theme = useColorScheme();
  useEffect(Notify,[]);
    return (
    <PaperProvider>
      <NavigationContainer theme={theme === 'dark' ? DarkTheme: DefaultTheme}>
      
        <LoginStack.Navigator>
          <LoginStack.Screen component={LoginAssociate} name="login" options={{headerShown:false}}/>
          <LoginStack.Screen  name="tab" options={{header:()=>(null)}}>
              {(props)=>(<Tab theme= {theme}/> )}
          </LoginStack.Screen>
        </LoginStack.Navigator>
        <ToastMessage theme={theme}/>
      </NavigationContainer>
    </PaperProvider >
    )
}