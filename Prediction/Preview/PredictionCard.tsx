import React from "react";
import { StyleSheet, ImageBackground, TouchableOpacity } from "react-native";
import { Card, Title,Paragraph } from 'react-native-paper';

export default ({ onPress, name, percentage }: any) => {
    const image =
        percentage >= 60 ? require("../../asset/rain.png") :
            percentage >= 30 ? require("../../asset/cloud.png") :
                require("../../asset/sun.png");

    return (
        <TouchableOpacity style={{ flex: 1 }} onPress={onPress} activeOpacity={1}>

            <Card style={[styles.container]}>
                <ImageBackground style={[styles.background]} imageStyle={{ borderRadius: 6 }} source={image}>
                    <Card.Title title={name} titleStyle={[styles.font, styles.title,styles.header]} right={
                        () => <Title style={[styles.font, styles.percentage,styles.header]}>{percentage}%</Title>
                    }  />
                    <Card.Content>
                        <Paragraph style={[styles.font]}>獼猴出現機率</Paragraph>
                    </Card.Content>
                </ImageBackground>
            </Card>

        </TouchableOpacity>
    )
}
//

const styles = StyleSheet.create({
    container: {
        //height: 120,
        marginTop: 10,
        marginHorizontal: 8,

    },
    background: {
        flex: 1,
        resizeMode: "cover",
        borderRadius: 15,
        padding: 3
    },
    footer: {
        flex: 1.5
    },
    font: {
        color: "white",
        fontWeight: "bold"
    },
    title: {
        fontSize: 25,
        paddingTop: 5
    },
    percentage: {
        fontSize: 35,
        
    },
    header: {
        paddingTop: 5
    }
})