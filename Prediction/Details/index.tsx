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
  const [selectedDataPoint, setSelectedDataPoint] = useState<{value: number, label: string} | null>(null);
  const graphTitle = '今日獼猴預測出現數量'
  //測試時將此註解拿掉即可
  useEffect(()=>{getDetailData(title,
      (data:any)=>{
      const temp = data.map((item:any) => ({
              value: item.Number,
              label: item.Date_time,
              onPress: () => setSelectedDataPoint({value: item.Number, label: item.Date_time}),
          }));
      setData(temp);
      
      })},[])
      const renderTooltip = () => {
        if (!selectedDataPoint) return null;
        
        return (
          <View style={styles.tooltip}>
            <View style={styles.tooltipHeader}>
              <Text style={styles.tooltipHeaderText}>詳細資訊</Text>
              <TouchableOpacity 
                onPress={() => setSelectedDataPoint(null)}
                style={styles.closeButton}
              >
                <Text style={styles.closeButtonText}>×</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.tooltipContent}>
              <Text style={styles.tooltipText}>
                時間: {selectedDataPoint.label}
              </Text>
              <Text style={styles.tooltipText}>
                數量: {selectedDataPoint.value}
              </Text>
            </View>
          </View>
        );
      };
    
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
                dataPointsHeight={18}
                dataPointsWidth={18}
                dataPointsColor="rgb(84,219,234)"
                yAxisThickness={0}
                xAxisThickness={0}
                curved
                yAxisTextStyle={{color: 'lightgray', fontWeight: 'bold'}}
                xAxisLabelTextStyle={{color: 'lightgray', fontWeight: 'bold'}}
                spacing={30} // 調整這個值來縮小 x 軸標籤之間的距離
                width={320}
              />
              {renderTooltip()}
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
  tooltip: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(150, 150, 150, 0.9)',
    borderRadius: 10,
    overflow: 'hidden',
    width: 150,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  tooltipHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(150, 150, 150, 0.9)',
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.3)',
  },
  tooltipHeaderText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  tooltipContent: {
    padding: 8,
  },
  tooltipText: {
    color: 'white',
    fontSize: 12,
    marginVertical: 2,
  },
  closeButton: {
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
