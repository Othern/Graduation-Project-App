import React from "react";
import {TouchableOpacity,View } from "react-native";
import Icon from 'react-native-vector-icons/MaterialIcons'

export default ({name,size,onPress}:any)=>{
    return (<View>
        <TouchableOpacity style={{padding:10}} onPress={onPress}>
            <Icon name={name} size={size} color={'#FFFFFF'}/>
        </TouchableOpacity>
    </View>)
}