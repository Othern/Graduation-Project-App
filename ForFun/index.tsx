import React, { useEffect, useState, useRef } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { Animated } from "react-native";
import Overview from './Overview'
import Header from './Overview/Header';
import { processDailyReward, initDailyRewardStatus, initHearts } from "./function";

// Upload~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
import Upload from "./Upload"
//also props parameter in overview
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


const stack = createStackNavigator();
export default ({ theme }: any) => {
    return (
        <stack.Navigator>
            <stack.Screen name={'Overview'} options={{
                header: () => { return null }
            }}>
                {(props: any) => (
                    <Overview theme={theme} props={props} />

                )}
            </stack.Screen>

            {/* Upload ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
            <stack.Screen name={'ForFunUpload'} options={{
                header: () => { return null }
            }}>
                {(props: any) => (
                    <Upload theme={theme} props={props} />
                )}
            </stack.Screen>
            {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}

        </stack.Navigator>)
}