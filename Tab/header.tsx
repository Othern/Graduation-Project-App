import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Icon from 'react-native-vector-icons/MaterialIcons'
import { Appbar } from "react-native-paper";
import { getHeaderTitle } from '@react-navigation/elements';

const fontColor = '#E7F5F3';
export default ({route, options,back,navigation, theme,onPress }: any) => {
    const title = getHeaderTitle(options, route.name);
    return (
        <Appbar.Header style={{backgroundColor: theme === "dark"  ? "#1C1C1E" : "#F0C750"}}>
            <Appbar.Content
                title={title}
                titleStyle={{ fontSize: 25, fontWeight: 'bold', color: fontColor }} />
            <Appbar.Action
                icon={() => (<Icon name={"notification-add"} size={25} color={fontColor} />)}
                onPress={onPress} />
        </Appbar.Header>
    )
}            


