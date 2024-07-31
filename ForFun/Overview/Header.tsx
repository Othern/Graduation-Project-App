import React from "react";
import Icon from 'react-native-vector-icons/AntDesign'
import { Appbar } from "react-native-paper";
import { Animated, Image } from "react-native";
const fontColor = '#E7F5F3';
const emptyBanana = '../../asset/emptyBanana.png'
const fullBanana = '../../asset/fullBanana.png'
export default ({ theme, onPress, onPressRank, onPressTitle, heart, translateY }: any) => {
    return (
        <Animated.View style={{
            transform: [{ translateY: translateY }],
            position: 'absolute',
            top: 0,
            right: 0,
            left: 0,
            elevation: 4,
            zIndex: 1,
        }}
        >
            <Appbar.Header style={{ backgroundColor: theme === "dark" ? "#1C1C1E" : "#F0C750", height: 40 }}>
                <Appbar.Content
                    title={'ForFun'}
                    titleStyle={{ fontSize: 25, fontWeight: 'bold', color: fontColor }} />

                {/* For Showing Top Three Ranking in the Past @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@*/}
                <Appbar.Action
                    size={29}
                    icon='podium-gold'
                    color={'white'}
                    onPress={onPressRank} />
                {/* For Change User Title */}
                <Appbar.Action
                    size={29}
                    icon='trophy'
                    color={'white'}
                    onPress={onPressTitle} />
                {/* @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ */}

                <Appbar.Action
                    icon={() => (<Image source={!heart ? require(emptyBanana) : require(fullBanana)}
                        style={{ height: 28, width: 28, marginRight: 10 }}
                        tintColor={theme == 'light' && !heart ? 'white' : !heart ? 'white' : undefined} />)}
                    onPress={onPress} />


            </Appbar.Header>
        </Animated.View>
    )
}  