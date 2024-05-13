import React from 'react';
import { StyleSheet, View,Text } from 'react-native';
import { BarChart } from "react-native-gifted-charts";

        
export default () => {
    const barData = [
        { value: 80, label: '9'  , frontColor: '#177AD5'},
        { value: 50, label: '10' },
        { value: 70, label: '11' },
        { value: 40, label: '12' },
        { value: 60, label: '13' },
        { value: 90, label: '14' },
        { value: 30, label: '15' },
        { value: 20, label: '16' },
        { value: 70, label: '17' },
        { value: 85, label: '18' }
      ];
      
    return (
        <View style = {styles.chart}>
            <Text style={{color:"white", fontWeight: "bold",marginBottom:10}}> 獼猴出現機率</Text>
            <BarChart
                barWidth={10}
                noOfSections={3}
                barBorderRadius={4}
                frontColor={"white"}
                data={barData}
                yAxisThickness={0}
                xAxisThickness={0}
                xAxisColor={'white'}
                yAxisTextStyle={{color: 'lightgray',fontWeight: 'bold'}}
                xAxisLabelTextStyle={{color: 'lightgray',fontWeight: 'bold'}}
                
            />
        </View>
    );
};

const styles = StyleSheet.create({
    chart:{
        backgroundColor: 'rgba(150, 150, 150, 0.7)',
        borderRadius : 20,
        margin : 5 ,
        paddingVertical : 15,
        paddingHorizontal : 10
    },
})