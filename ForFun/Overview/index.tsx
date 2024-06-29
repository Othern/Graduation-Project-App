import React from "react";
import { Platform } from "react-native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import Icon from 'react-native-vector-icons/Ionicons';
import Cute from './Cute';
import Funny from './Funny';
import Recent from './Recent';

const Tab = createMaterialTopTabNavigator();

export default (theme:any) => {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarStyle: {
                    width: 340,
                    alignSelf: 'center',
                    borderRadius: 40,
                    margin: 12,
                    backgroundColor: theme['theme']['theme']=='dark'? '#1C1C1E' :'#A6A6A7',
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
                    height: '100%',
                    borderRadius: 40
                },
                tabBarItemStyle: { flexDirection:'row',alignItems:'center' ,
                    ...Platform.select({
                        ios: {
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.8,
                            shadowRadius: 2,
                        },
                        android: {
                            elevation: 10,
                        },
                    }),
                },
                tabBarLabelStyle: {
                    fontSize: 14,
                    fontWeight: 'bold'
                },
                
                tabBarActiveTintColor:  theme['theme']['theme']=='dark'? 'black' :'#FFBF00',
                tabBarInactiveTintColor: 'white',
                tabBarIcon: ({ color, size }:any) => {
                    let iconName;
                    if (route.name === 'Recent') {
                        iconName = 'time';
                    } else if (route.name === 'Cute') {
                        iconName = 'heart';
                    } else if (route.name === 'Funny') {
                        iconName = 'happy';
                    }
                    return <Icon name={iconName ? iconName: 'happy'} size={20} color={color} />;
                },
            })}
        >
            <Tab.Screen name="Recent" component={Recent} />
            <Tab.Screen name="Cute" component={Cute} />
            <Tab.Screen name="Funny" component={Funny} />
        </Tab.Navigator>
    );
};
