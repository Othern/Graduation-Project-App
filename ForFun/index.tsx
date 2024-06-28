import React, { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import Overview from './Overview'
import Header from './Header';
import { processDailyReward,initDailyRewardStatus,initHearts } from "./function";
const stack = createStackNavigator();
export default (theme: any) => {
    const [dailyReward, setdailyReward] = useState(true);
    const [hearts, setHearts] = useState(0);
    const init = async()=>{
        const status = await initDailyRewardStatus();
        const heart = await initHearts();
        if(status != undefined){
            setdailyReward(status);
        } 
        if(heart){
            setHearts(heart);
        } 
    };
    useEffect(()=>{init()},[]);
    console.log(hearts)
    return (
        <stack.Navigator>
            <stack.Screen name={'Overview'} component={Overview}
                options={{
                    header: (props) => <Header {...props} onPress={
                        () => {
                            processDailyReward(dailyReward, setdailyReward)
                        }} theme={theme} heart={dailyReward} />
                }} />

        </stack.Navigator>)
}