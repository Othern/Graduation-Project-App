import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ImageBackground,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {detailData, getDetailData} from './function';
import {LineChart} from 'react-native-gifted-charts';
import Ionicons from 'react-native-vector-icons/Ionicons';

const locationImages: {[key: string]: any} = {
  國研大樓和體育館: require('../../asset/backGround/researchBuildingAndGym.png'),
  教學區: require('../../asset/backGround/teachingArea.png'),
  教學區西側: require('../../asset/backGround/teachingAreaWestSide.png'),
  武嶺: require('../../asset/backGround/Wuling.png'),
  活動中心: require('../../asset/backGround/activityCenter.png'),
  海院: require('../../asset/backGround/oceanCollege.png'),
  翠亨: require('../../asset/backGround/Cuiheng.png'),
  電資大樓: require('../../asset/backGround/electricalAndComputerEngineeringBuilding.png'),
  體育場和海堤: require('../../asset/backGround/stadiumAndSeawall.png'),
  文學院和藝術學院: require('../../asset/backGround/collegeOfLiteratureAndArts.png'), 
};
export default (props: any) => {
  const title = props.route.params.title;
  const category = props.route.params.category;
  let image;
  try {
    image = locationImages[title as keyof typeof locationImages];
  } catch {
    image = require('../../asset/backGround/stadiumAndSeawall.png');
  }
  const chartData = detailData.map(item => ({
    value: item.Number,
    label: item.Date_time,
  }));
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(chartData);
  const graphTitle = '今日獼猴預測出現數量'
  //測試時將此註解拿掉即可
  useEffect(()=>{getDetailData(title,
      (data:any)=>{
      const temp = data.map((item:any) => ({
              value: item.Number,
              label: item.Date_time
          }));
      setData(temp)
      })},[])

  return loading ? (
    <Text>Loading</Text>
  ) : (
    <ImageBackground style={{flex: 1}} source={image}>
      <View
        style={{
          height: '100%',
          width: '100%',
          backgroundColor: 'rgba(56, 48, 48, 0.2)',
          paddingBottom: 5,
          paddingRight: 8,
        }}>
        <View style={styles.container}>
          <View style={styles.title}>
            <Text style={styles.titleText}>{title}</Text>
            <Text style={styles.titleCategory}>{category}</Text>
          </View>
          <View style={styles.content}>
            <View style={styles.chart}>
              <Text
                style={{
                  color: 'white',
                  fontWeight: 'bold',
                  marginBottom: 10,
                  marginLeft: 10,
                }}>
                {graphTitle}
              </Text>
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
                yAxisTextStyle={{color: 'lightgray', fontWeight: 'bold'}}
                xAxisLabelTextStyle={{color: 'lightgray', fontWeight: 'bold'}}
                spacing={30} // 調整這個值來縮小 x 軸標籤之間的距離
                width={320}
              />
            </View>
          </View>
          <View style={styles.footer}></View>
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    flex: 1,
  },
  title: {
    flex: 1,
    padding: 20,
  },
  content: {
    flex: 2.5,
  },
  footer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  titleText: {
    fontSize: 25,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'white',
  },
  titleCategory: {
    fontSize: 50,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'white',
  },
  chart: {
    backgroundColor: 'rgba(150, 150, 150, 0.75)',
    borderRadius: 20,
    
    
  },
});
