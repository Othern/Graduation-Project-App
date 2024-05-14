import { StyleSheet, Text, TouchableOpacity, View, ImageBackground } from "react-native";
import React, { useState, useEffect } from "react";
import Chart from "./Chart";
import Ionicons from "react-native-vector-icons/Ionicons";
import { err } from "react-native-svg";

export default (props: any) => {
    const title = props.route.params.title;
    const percentage = props.route.params.percentage;

    const image =
        percentage >= 60 ? require("../../asset/rain.png") :
            percentage >= 30 ? require("../../asset/cloud.png") :
                require("../../asset/sun.png");

    // 要使用Networking loading 改為true
    const [loading, setLoading] = useState(false);
    const [detailData, setdetailData] = useState({ barData: [] });

    /* 要使用Networking 取消quote，並要改成你的url
    const url = "http://172.20.10.2:4000//api/data/getDetail";
    const getDetailData = async () => {
        try {
            const response = await fetch(url)
                .then(response => response.json())
            setdetailData(response)
            setLoading(false);
        }
        catch (error) {
            console.error(error)
        }
    }
    useEffect(() => { getDetailData() }, [])
     NetWorking to get detail data*/

    return (loading ? (<Text>Loading</Text>)
        : (<ImageBackground style={{ flex: 1 }} source={image}>
            <View style={styles.container}>
                <View style={styles.title}>
                    <Text style={styles.titleText}>{title}</Text>
                    <Text style={styles.titlePercentage}>{percentage}%</Text>
                </View>
                <View style={styles.content}>
                    <Chart data={detailData.barData} />
                </View>
                <View style={styles.footer}>
                </View>
            </View>
        </ImageBackground>)
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "column",
        flex: 1
    },
    title: {
        flex: 1,
        padding: 20
    },
    content: {
        flex: 2.5,

    },
    footer: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "center"
    },
    titleText: {
        fontSize: 25,
        fontWeight: 'bold',
        textAlign: 'center',
        color: "white",
    },
    titlePercentage: {
        fontSize: 60,
        fontWeight: 'bold',
        textAlign: 'center',
        color: "white",
    },
})