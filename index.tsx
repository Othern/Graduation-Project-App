
import React,{createContext} from "react";
import { useColorScheme } from "react-native";
import ToastMessage from './toastMessage';
import { PaperProvider } from 'react-native-paper';
import Tab from "./Tab";
import 'react-native-gesture-handler'

export default function(){
  const theme = useColorScheme();
    return (
    <PaperProvider>
      <Tab theme= {theme}/>
      <ToastMessage theme={theme}/>
    </PaperProvider >
    )
}