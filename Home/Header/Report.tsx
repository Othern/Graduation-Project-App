import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import Entypo from 'react-native-vector-icons/Entypo'
import { Appbar } from "react-native-paper";
import { getHeaderTitle } from '@react-navigation/elements';

const fontColor = '#E7F5F3';
export default ({ title, push }: any) => {
    
    return (    
        <>
        <Appbar.Content
            title={title}
            titleStyle={{ fontSize: 25, fontWeight: 'bold', color: fontColor}} />
    </>
    )
}