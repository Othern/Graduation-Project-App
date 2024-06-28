import React from "react";
import Icon from 'react-native-vector-icons/AntDesign'
import { Appbar } from "react-native-paper";
import { getHeaderTitle } from '@react-navigation/elements';
const fontColor = '#E7F5F3';
export default ({ route, options, theme, onPress, heart }: any) => {
    const name = getHeaderTitle(options, route.name);
    const title = name == "Overview" ? "Forfun" : name;
    return (
        <Appbar.Header style={{ backgroundColor: theme['theme'] === "dark" ? "#1C1C1E" : "#F0C750" }}>
            <Appbar.Content
                title={title}
                titleStyle={{ fontSize: 25, fontWeight: 'bold', color: fontColor }} />
            <Appbar.Action
                icon={() => (<Icon name={"heart"} size={23} color={heart ? '#B62619' : '#E7F5F3'} />)}
                onPress={onPress} />
        </Appbar.Header>
    )
}  