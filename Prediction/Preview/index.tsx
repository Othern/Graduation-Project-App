import React, { useEffect, useState } from "react";
import { StyleSheet, ImageBackground, TouchableOpacity, FlatList, View ,Text} from "react-native";
import { Card, Paragraph,ProgressBar } from 'react-native-paper';
import { getPreviewlData, previewData } from "./function";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
const locationImages:{ [key: string]: any } = {
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
const PredictionCard = ({ onPress, location, category }: any) => {
    const image = locationImages[location]

    // 根據 category 設置進度條的值和顏色
    const getProgressValue = (category: string) => {
        switch (category) {
            case '少量': return { value: 0.33, color: 'green' };
            case '中量': return { value: 0.66, color: 'orange' };
            case '大量': return { value: 1, color: 'red' };
            default: return { value: 0, color: 'grey' };
        }
    };

    const { value, color } = getProgressValue(category);

    return (
        <TouchableOpacity style={{ flex: 1 }} onPress={onPress} activeOpacity={1}>
            <Card style={[styles.container]}>
                <ImageBackground style={[styles.background]} imageStyle={{ borderRadius: 6 }} source={image}>
                    <Card.Title 
                        title={location} 
                        titleStyle={[styles.font, styles.title, styles.header]} 
                        right={() => (
                            <View style={{ width: 100, marginRight: 10 }}>
                                <Text style={[styles.font, styles.category, styles.header, { textAlign: 'center', marginTop: 5 }]}>
                                    {category}
                                </Text>
                            </View>
                        )}
                    />
                    <Card.Content style={{flexDirection:"row", alignItems:"center",justifyContent:"space-between"}}>
                        <Paragraph style={[styles.font]}>獼猴出現數量</Paragraph>
                        <ProgressBar progress={value} color={color} style={{ height: 10,width: 100, borderRadius: 5 }} />
                    </Card.Content>
                </ImageBackground>
            </Card>
        </TouchableOpacity>
    );
};





export default (props: any) => {
    const handlePress = (screenName: string, params: any) => {
        props.navigation.push(screenName, params);
    };
    const [data, setData] = useState(previewData)
    //測試時將此註解拿掉即可
    // useEffect(() => {
    //     getPreviewlData((pd: any) => { setData(pd) })

    // }, [])

    return (
        <>
            <FlatList data={data}
                renderItem={({ item, index }) => {
                    return (
                        <PredictionCard
                            key={index}
                            location={item.Location}
                            category={item.Category}
                            props={props}
                            onPress={() => handlePress("Details", { title: item.Location, category: item.Category })}
                        />
                    )
                }}
            />





        </>
    )
}

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
        paddingRight: 8,
        paddingBottom: 5
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
    },
    category: {
        fontSize: 30,

    },
    header: {
        paddingTop: 5
    }
})