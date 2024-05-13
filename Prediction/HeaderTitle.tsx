import React from "react";
import { StyleSheet, Text, View } from "react-native";


export default ({ name }: any) => {
    return (<View>
        <Text style={{ fontSize: 25, fontWeight: 'bold', color: '#FFFFFF' }}>{name}</Text>
    </View>)
}

