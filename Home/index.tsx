import React, {useState} from 'react';
import { createStackNavigator,TransitionSpecs, CardStyleInterpolators } from '@react-navigation/stack';
import Report from './Report';
import Home from './Home';
import Header from './Header';
import Camera from './Camera';
import Preview from './Preview';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';



const Stack = createStackNavigator();
const App = ({theme}:any) => {
  //console.log(result);
  return (
    <Stack.Navigator screenOptions={{
        header: (props) => <Header {...props} push ={props.navigation.push} theme={theme}/>,
        
        gestureEnabled: true,
        gestureDirection: 'vertical',
        transitionSpec: {
          open: TransitionSpecs.TransitionIOSSpec,
          close: TransitionSpecs.TransitionIOSSpec,
        },
        cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
        
    }} >

      <Stack.Screen name= 'Map' component={Home} />
      <Stack.Screen name='Report'component={Report} />
      <Stack.Screen name='Camera'component={Camera} />
      <Stack.Screen name='Preview' component={Preview}/>
    </Stack.Navigator>
  );
};

export default App;