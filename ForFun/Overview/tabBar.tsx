import React from 'react';
import { Platform, ViewStyle, Animated } from 'react-native';
import { MaterialTopTabNavigationOptions } from '@react-navigation/material-top-tabs';
import Icon from 'react-native-vector-icons/Ionicons';

interface CustomTabBarProps {
    theme: 'dark' | 'light';
    route: {
        name: string;
    };
    translateTabBar: any;
}

const CustomTabBar = ({ theme, route,translateTabBar  }: CustomTabBarProps): MaterialTopTabNavigationOptions => ({
    tabBarStyle: {
        width: '100%',
        alignSelf: 'center',
        
        position:'absolute',
        top:40,
        elevation: 4,
        
        zIndex:1,
        transform: [{translateY: translateTabBar }],
        backgroundColor: theme === "dark" ? "#1C1C1E" : "#F0C750",
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.8,
                shadowRadius: 2,
            },
            android: {
                elevation: 4,
            },
        }),
    },
    tabBarIndicatorStyle: {
        backgroundColor: 'white',
        position: 'absolute',
        zIndex: -1,
    } as ViewStyle,
    tabBarItemStyle: {
        flexDirection: 'row', 
        alignItems: 'center',
    },
    tabBarLabelStyle: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    tabBarActiveTintColor: 'white' ,
    tabBarInactiveTintColor: 'white',
    tabBarIcon: ({ color }) => {
        let iconName: string = 'happy';
        let iconColor: string = color;

        if (color === '#FFBF00' || color === 'white') {
            if (route.name === 'Recent') {
                iconName = 'time';
                iconColor = 'blue';
            } else if (route.name === 'Cute') {
                iconName = 'heart';
                iconColor = 'red';
            } else if (route.name === 'Funny') {
                iconName = 'happy';
                iconColor = 'orange';
            }
        } else {
            if (route.name === 'Recent') {
                iconName = 'time';
            } else if (route.name === 'Cute') {
                iconName = 'heart';
            } else if (route.name === 'Funny') {
                iconName = 'happy';
            }
        }

        return <Icon name={iconName} size={20} color={iconColor} />;
    },
});

export default CustomTabBar;

