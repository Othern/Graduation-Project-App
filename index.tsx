import React,{createContext} from "react";
import { StyleSheet } from "react-native";
import ToastMessage from './toastMessage';
import { MD3LightTheme as DefaultTheme,PaperProvider } from 'react-native-paper';
import Tab from "./Tab";
const theme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      primary: 'tomato',
      secondary: 'yellow',
    },
  };
export default function(){
    return (
    <PaperProvider theme={theme}>
      <Tab/>
      <ToastMessage/>
    </PaperProvider>
    )
}