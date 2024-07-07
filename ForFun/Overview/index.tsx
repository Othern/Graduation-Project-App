import React, { useState, useEffect } from "react";
import { Platform, Animated, ScrollView, View } from "react-native";
import { initDailyRewardStatus, initHearts, processDailyReward } from "../function";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import Icon from 'react-native-vector-icons/Ionicons';
import CustomTabBar from "./tabBar";
import Cute from './Cute';
import Funny from './Funny';
import Recent from './Recent';
import Header from "./Header";

//Upload ~~~~~~~~~~~~~For Testing~~~~~~~~~~~~~~~~~~~~~~~~~~~~
import { Pressable } from "react-native";
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

const Tab = createMaterialTopTabNavigator();

export default ({ theme, props }: any) => {
    const scrollY = new Animated.Value(0);
    const diffClamp = Animated.diffClamp(scrollY, 0, 40);
    const translateHeader = diffClamp.interpolate({
        inputRange: [0, 40],
        outputRange: [0, -40],
    });
    const translateTabBar = diffClamp.interpolate({
        inputRange: [0, 40],
        outputRange: [0, -40],
    });

    const [dailyReward, setdailyReward] = useState(true);
    const [hearts, setHearts] = useState(0);
    const init = async () => {
        const status = await initDailyRewardStatus();
        const heart = await initHearts();
        if (status != undefined) {
            setdailyReward(status);
        }
        if (heart) {
            setHearts(heart);
        }
    };
    useEffect(() => { init() }, []);
    return (
        <>
            <Header
                onPress={() => {
                    processDailyReward(dailyReward, setdailyReward)
                }}
                theme={theme}
                heart={dailyReward}
                translateY={translateHeader}
            />
            <Tab.Navigator
                screenOptions={({ route }: any) => CustomTabBar({ theme, route, translateTabBar })}
            >
                <Tab.Screen name="Recent">
                    {(props: any) => { return <Recent scrollY={scrollY} /> }}
                </Tab.Screen>
                <Tab.Screen name="Cute">
                    {(props: any) => { return <Recent scrollY={scrollY} /> }}
                </Tab.Screen>
                <Tab.Screen name="Funny">
                    {(props: any) => { return <Recent scrollY={scrollY} /> }}
                </Tab.Screen>
            </Tab.Navigator>

            {/* Upload ~~~~~~~~~~~~~~~~~~~For Testing~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
            < Pressable style={{
                position: 'absolute',
                right: 20,
                bottom: 20,
                backgroundColor: 'white',
                width: 60,
                height: 60,
                borderRadius: 30,
                justifyContent: 'center',
                alignItems: 'center',
                elevation: 8,
            }} onPress={() => props.navigation.push('ForFunUpload')}>
                <Icon name="add-outline" size={40} color="black" aria-label="上傳" />
            </Pressable >
            {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
        </>
    );
};
