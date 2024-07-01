import React, { useEffect, useState, useRef } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { Animated } from "react-native";
import Overview from './Overview'
import Header from './Overview/Header';
import { processDailyReward, initDailyRewardStatus, initHearts } from "./function";
const stack = createStackNavigator();
export default ({ theme }: any) => {
    return (
        <stack.Navigator>
            <stack.Screen name={'Overview'} options={{
                header: () => { return null }
            }}>
                {(props: any) => (
                    <Overview theme={theme}/>
                        
                )}
            </stack.Screen>


        </stack.Navigator>)
}