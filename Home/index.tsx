import React, {useState} from 'react';
import { createStackNavigator,TransitionSpecs, CardStyleInterpolators } from '@react-navigation/stack';
import Report from './Report';
import Home from './Home';
import Header from './Header';
import Camera from './Camera';
import Preview from './Preview';



const HomeStack = createStackNavigator();
const App = ({theme}:any) => {
  return (
    <HomeStack.Navigator screenOptions={{
        header: (props) => <Header {...props} push ={props.navigation.push} theme={theme}/>,
        
        gestureEnabled: true,
        gestureDirection: 'vertical',
        transitionSpec: {
          open: TransitionSpecs.TransitionIOSSpec,
          close: TransitionSpecs.TransitionIOSSpec,
        },
        cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
        
    }} >

      <HomeStack.Screen name= 'Map' component={Home} />
      <HomeStack.Screen name='Report'component={Report} />
      <HomeStack.Screen name='Camera'component={Camera} />
      <HomeStack.Screen name='Preview' component={Preview}/>
    </HomeStack.Navigator>
  );
};

export default App;