import React, { useEffect, useState } from "react";
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
    return (
        <stack.Navigator>
            <stack.Screen name={'Overview'} options={{
                    header: (props) => <Header {...props} onPress={
                        () => {
                            processDailyReward(dailyReward, setdailyReward)
                        }} theme={theme} heart={dailyReward} />
                }}>
                {(props:any)=>(<Overview theme={theme}/>)}
            </stack.Screen>
                 

        </stack.Navigator>)
}