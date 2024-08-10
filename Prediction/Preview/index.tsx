import React, {useEffect, useState,useCallback} from 'react';
import {
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  FlatList,
  View,
  Text,
  useColorScheme,
  RefreshControl,
} from 'react-native';
import {useIsFocused} from '@react-navigation/native';
import {ProgressBar} from 'react-native-paper';
import {getPreviewlData, previewData} from './function';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
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

const PredictionCard = ({onPress, location, category}: any) => {
  let image;
  try {
    image = locationImages[location];
  } catch {
    image = require('../../asset/backGround/stadiumAndSeawall.png');
  }
  const theme = useColorScheme();
  // 根據 category 設置進度條的值和顏色
  const getProgressValue = (category: string) => {
    switch (category) {
      case '少量':
        return {value: 0.33, color: 'green'};
      case '中量':
        return {value: 0.66, color: 'orange'};
      case '大量':
        return {value: 1, color: 'red'};
      default:
        return {value: 0, color: 'grey'};
    }
  };

  const {value, color} = getProgressValue(category);
  const descriptionFontColor = theme === 'dark' ? 'white' : 'gray';
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={1}>
      <ImageBackground
        style={[styles.background]}
        imageStyle={{borderTopLeftRadius: 15, borderBottomLeftRadius: 15}}
        source={image}>
        <View
          style={{
            height: '100%',
            width: '100%',
            backgroundColor: 'rgba(56, 48, 48, 0.4)',
            padding: 10,
            borderTopLeftRadius: 15,
            borderBottomLeftRadius: 15,
          }}>
          <Text style={{color: 'white', fontWeight: 'bold', fontSize: 23}}>
            {location}
          </Text>
          <Text
            style={{
              position: 'absolute',
              bottom: 5,
              left: 10,
              color: 'white',
              fontWeight: 'bold',
              fontSize: 15,
              marginBottom: 10,
            }}>
            獼猴出現數量
          </Text>
        </View>
      </ImageBackground>
      <View
        style={[
          styles.description,
          {backgroundColor: theme === 'dark' ? '#1C1C1E' : 'white'},
        ]}>
        <Text
          style={[
            {
              textAlign: 'center',
              marginBottom: 25,
              color: descriptionFontColor,
              fontWeight: '800',
              fontSize: 25,
            },
          ]}>
          {category}
        </Text>

        <ProgressBar
          progress={value}
          color={color}
          style={{height: 10, width: 100, borderRadius: 5}}
        />
      </View>
    </TouchableOpacity>
  );
};

export default (props: any) => {
  const theme = useColorScheme();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [data, setData] = useState(previewData);
  const isFocused = useIsFocused();
  const handlePress = (screenName: string, params: any) => {
    props.navigation.push(screenName, params);
  };
  //測試時將此註解拿掉即可
  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      await getPreviewlData((pd: any) => { setData(pd) });
    } catch (error) {
      console.error('Error fetching new data:', error);
    } finally {
      setIsRefreshing(false);
    }
  }, []);
  useEffect(() => {
    if (isFocused) {
      try {
        getPreviewlData((pd: any) => { setData(pd) });
      } catch (error) {
        console.error('Error fetching preview data', error);}
    }
  }, [isFocused, handleRefresh]);
  return (
    <FlatList
      data={data}
      renderItem={({item, index}) => {
        return (
          <PredictionCard
            key={index}
            location={item.Location}
            category={item.Category}
            props={props}
            onPress={() =>
              handlePress('Details', {
                title: item.Location,
                category: item.Category,
              })
            }
          />
        );
      }}
      refreshControl={<RefreshControl
        refreshing={isRefreshing}
        onRefresh={handleRefresh}
        tintColor={theme === 'dark' ? 'white' : 'black'}
      />}
      ListEmptyComponent={
        <View
          style={{alignItems: 'center', justifyContent: 'center', flex: 1, marginTop: 20}}>
          <Text style={{fontSize: 18, fontWeight: 'bold'}}>
            目前沒有預測資訊，請稍候試試
          </Text>
        </View>
      }
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: 100,
    marginTop: 10,
    marginHorizontal: 8,
    flexDirection: 'row',
    elevation: 10,
  },
  background: {
    flex: 2.2,
    resizeMode: 'cover',
    borderTopLeftRadius: 15,
    borderBottomLeftRadius: 15,
  },
  description: {
    flex: 1,
    width: 100,
    marginRight: 10,
    borderTopRightRadius: 15,
    borderBottomRightRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
