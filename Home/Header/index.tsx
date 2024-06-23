import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import Entypo from 'react-native-vector-icons/Entypo'
import { Appbar } from "react-native-paper";
import { getHeaderTitle } from '@react-navigation/elements';
import Home from "./Home";
import Report from "./Report";
import Camera from "./Camera";
const fontColor = '#E7F5F3';
export default ({ route, options, back, navigation, theme, push }: any) => {
    let title = getHeaderTitle(options, route.name);
    title = title != 'Map' ? title : 'Home';
    return (
        <Appbar.Header style={{ backgroundColor: theme === "dark" ? "#1C1C1E" : "#F0C750" }} >
            {title != 'Home' && <Appbar.Action onPress={navigation.goBack}
                    icon={() => (<Entypo name={"cross"} size={25} color={fontColor} />)}
                    color={fontColor} /> }

            {title == 'Home' ?
                <Home title={title} push={() => { push('Report') }}/>
            : title == 'Report' ?
                <Report title={title} push={() => { push('Camera') }}/>
            : <Camera/>
            }

        </Appbar.Header>
    )
}

