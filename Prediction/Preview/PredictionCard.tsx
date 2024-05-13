import React from "react"
import { StyleSheet, Text,View ,ImageBackground, TouchableOpacity} from "react-native"

export default ({onPress,name,percentage}:any)=> {
    const image =
        percentage >= 60 ? require("../../asset/rain.png") :
        percentage >= 30 ? require("../../asset/cloud.png") :
        require("../../asset/sun.png");

    return( <View style={[styles.container]}>
        <TouchableOpacity style={{flex:1}} onPress={onPress}>
            <ImageBackground style = {styles.background} imageStyle={{ borderRadius: 6}} source={image}>
                <View style={styles.header}>
                    <Text style = {[styles.font,styles.title]}>{name}</Text>
                    <Text style = {[styles.font,styles.percentage]}>{percentage}%</Text>
                </View>
                <View style={styles.footer}>
                    <Text style={[styles.font]}>獼猴出現機率</Text>
                </View>
            </ImageBackground>
        </TouchableOpacity>
    </View>)
}


const styles = StyleSheet.create({
    container :{
        height: 120,
        marginTop: 10,
        marginHorizontal: 10,
    },
    background:{
        flex:1,
        resizeMode: "cover",
        borderRadius: 15,
        padding:10
    },
    header:{
        flexDirection: "row",
        flex:2.5,
        justifyContent: "space-between"
    },
    footer:{
        flex:1.5
    },
    font:{
        color: "white",
        fontWeight: "bold"
    },
    title:{
        fontSize: 25,
    },
    percentage:{
        fontSize: 25,
    }
})