import { StyleSheet, Text, TouchableOpacity,View ,ImageBackground} from "react-native";
import Chart from "./Chart";
import Ionicons from "react-native-vector-icons/Ionicons";


export default (props:any)=>{
    const title = props.route.params.title;
    const percentage = props.route.params.percentage;
    const image =
        percentage >= 60 ? require("../../asset/rain.png") :
        percentage >= 30 ? require("../../asset/cloud.png") :
        require("../../asset/sun.png");
    const handlePress = (screenName: string,params:any) => {
        props.navigation.push(screenName,params);
      };
    return( <ImageBackground style={{flex:1}} source={image}>
                <View style={styles.container}>
                    <View style={styles.title}>
                        <Text style={styles.titleText}>{title}</Text>
                        <Text style={styles.titlePercentage}>{percentage}%</Text>
                    </View>
                    <View style={styles.content}>
                            <Chart/>
                    </View>
                    <View style={styles.footer}>
                    </View>
                </View>
            </ImageBackground>
)
}

const styles = StyleSheet.create({
    container:{
        flexDirection : "column",
        flex: 1
    },
    title:{
        flex: 1 ,
        padding : 20
    },
    content:{
        flex: 2.5,
        
    },
    footer:{
        flex: 1 ,
        flexDirection : "row",
        justifyContent : "center"
    },
    titleText :{
        fontSize : 25,
        fontWeight: 'bold',
        textAlign: 'center',
        color: "white",
    },
    titlePercentage : {
        fontSize : 60,
        fontWeight: 'bold',
        textAlign: 'center',
        color: "white",
    },
})