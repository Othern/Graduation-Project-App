import React, {useState} from 'react';
import { createStackNavigator,TransitionSpecs, CardStyleInterpolators } from '@react-navigation/stack';
import Report from './Report';
import Home from './Home';
import Header from './Header';
import Camera from './Camera';



const Stack = createStackNavigator();
const App = ({theme}:any) => {
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
      <Stack.Screen name='Report'component={Report}/>
      <Stack.Screen name='Camera'component={Camera} />
    </Stack.Navigator>
  );
};

export default App;