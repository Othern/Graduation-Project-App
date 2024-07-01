import React from "react";
import Icon from 'react-native-vector-icons/AntDesign'
import { Appbar } from "react-native-paper";
import { Animated } from "react-native";
const fontColor = '#E7F5F3';
export default ({ theme, onPress, heart, translateY }: any) => {
    return (
        <Animated.View style={{ transform: [{translateY: translateY}],
        position: 'absolute',
        top: 0,
        right: 0,
        left: 0,
        elevation: 4,
        zIndex: 1,}}
        >
            <Appbar.Header style={{ backgroundColor: theme === "dark" ? "#1C1C1E" : "#F0C750" ,height:40 }}>
                <Appbar.Content
                    title={'ForFun'}
                    titleStyle={{ fontSize: 25, fontWeight: 'bold', color: fontColor }} />
                <Appbar.Action
                    icon={() => (<Icon name={"heart"} size={23} color={heart ? '#B62619' : '#E7F5F3'} />)}
                    onPress={onPress} />
            </Appbar.Header>
        </Animated.View>
    )
}  