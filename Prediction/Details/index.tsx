import { StyleSheet, Text, TouchableOpacity, View, ImageBackground } from "react-native";
import React, { useState, useEffect } from "react";
import { detailData,getDetailData } from './function';
import { LineChart } from "react-native-gifted-charts";
import Ionicons from "react-native-vector-icons/Ionicons";

type Props = {
    route: {
        params: {
            title: string;
            category: string;
        };
    };
};
const locationImages = {
    "國研大樓和體育館": require("../../asset/backGround/國研大樓和體育館.png"),
    "教學區": require("../../asset/backGround/教學區.png"),
    "教學區西側": require("../../asset/backGround/教學區西側.png"),
    "武嶺": require("../../asset/backGround/武嶺.png"),
    "活動中心": require("../../asset/backGround/活動中心.png"),
    "海院": require("../../asset/backGround/海院.png"),
    "翠亨": require("../../asset/backGround/翠亨.png"),
    "電資大樓": require("../../asset/backGround/電資大樓.png"),
    "體育場和海提": require("../../asset/backGround/體育場和海提.png")
};
export default (props: Props) => {
    const title = props.route.params.title;
    const category = props.route.params.category;
    const image = locationImages[title as keyof typeof locationImages];
    const chartData = detailData.map(item => ({
        value: item.Number,
        label: item.Date_time
    }));
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState(chartData);
    //測試時將此註解拿掉即可
    // useEffect(()=>{getDetailData(title,
    //     (data:any)=>{
    //     const temp = data.map((item:any) => ({
    //             value: item.Number,
    //             label: item.Date_time
    //         }));
    //     setData(temp)
    //     })},[])

    return (loading ? (<Text>Loading</Text>)
        : (<ImageBackground style={{ flex: 1 }} source={image}>
            <View style={styles.container}>
                <View style={styles.title}>
                    <Text style={styles.titleText}>{title}</Text>
                    <Text style={styles.titleCategory}>{category}</Text>
                </View>
                <View style={styles.content}>
                    
                <View style={styles.chart}>
            <Text style={{ color: "white", fontWeight: "bold", marginBottom: 10 }}> 獼猴出現數量</Text>
            <LineChart
                noOfSections={4}
                data={data}
                color="rgb(84,219,234)"
                startFillColor={'rgb(84,219,234)'}
                endFillColor={'rgb(84,219,234)'}
                startOpacity={0.7}
                endOpacity={0.1}
                areaChart
                yAxisThickness={0}
                xAxisThickness={0}
                curved
                hideDataPoints
                yAxisTextStyle={{ color: 'lightgray', fontWeight: 'bold' }}
                xAxisLabelTextStyle={{ color: 'lightgray', fontWeight: 'bold' }}
                spacing={30}  // 調整這個值來縮小 x 軸標籤之間的距離
                width={330}
            />
        </View>
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
    titleCategory: {
        fontSize: 50,
        fontWeight: 'bold',
        textAlign: 'center',
        color: "white",
    },
    chart: {
        backgroundColor: 'rgba(150, 150, 150, 0.9)',
        borderRadius: 20,
        margin:5,
        paddingVertical: 15,

    },
})