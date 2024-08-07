import {Text, Button} from 'react-native-paper';
import {StyleSheet, View, Pressable} from 'react-native';
import MapView, {Marker, Callout} from 'react-native-maps';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import {useState, useEffect} from 'react';
import {MultiSelect} from 'react-native-element-dropdown';
import {requestGeolocationPermission} from './function';
const data = [
  {
    name: '威爾希斯咖啡',
    longitude: 120.2661326,
    latitude: 22.6261283,
    quantity: 1,
    time: '2024-06-14 07:57:27',
  },
  {
    name: '國研停車場',
    longitude: 120.2660711,
    latitude: 22.6242157,
    quantity: 1,
    time: '2024-06-14 07:50:27',
  },
  {
    name: '理工一道',
    longitude: 120.2666379,
    latitude: 22.6263989,
    quantity: 2,
    time: '2024-06-14 07:51:27',
  },
  {
    name: '武四',
    longitude: 120.2643484,
    latitude: 22.6301555,
    quantity: 3,
    time: '2024-06-14 07:57:27',
  },
];
const list = [
  {label: '預測數量', value: 'PD'},
  {label: '當前數量', value: 'RT'},
];

export default () => {
  const [selected, setSelected] = useState(['RT', 'PD']);
  const [loading, setLoading] = useState(true);
  const [RTData, setRTData] = useState(data);
  const [PDData, setPDData] = useState(data);
  const [refreshInterval, setRefreshInterval] = useState(60000); // 每分鐘更新一次地圖資訊
  
  // 要使用Networking 取消quote，並要改成你的url
  const getData = async () => {
    const PDUrl = 'http://192.168.50.213:5000//api/data/getRealTimeData'; //請更改為預測的API
    try {
      const response = await fetch(PDUrl).then(response => response.json());
      setPDData(response);
      setLoading(false);
    } catch (error) {
      console.error(error);
    }
    const RTUrl = 'http://192.168.50.213:5000//api/data/getRealTimeData';
    try {
      const response = await fetch(RTUrl).then(response => response.json());
      setRTData(response);
      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  };
  // useEffect(() => {
  //   const interval = setInterval(async () => {
  //     await getData();
  //   }, refreshInterval);
  
  //   return () => clearInterval(interval);
  // }, [refreshInterval]);
  //NetWorking to get detail data
  requestGeolocationPermission();
  const renderItem = (item: any) => {
    const color = item.value == 'PD' ? 'green' : 'red';
    return (
      <View style={styles.item}>
        <View style={{flexDirection: 'row'}}>
          <FontAwesome6
            color={color}
            name="location-dot"
            size={16}
            style={{marginRight: 5, marginTop: 2}}
          />
          <Text style={styles.itemText}>{item.label}</Text>
        </View>
        {selected.includes(item.value) && (
          <AntDesign
            color="black"
            name="Safety"
            size={20}
            style={{position: 'absolute', right: 10}}
          />
        )}
      </View>
    );
  };
  //提供後端串接後使用 return (loading?<Text>loading...</Text>:
  return (
    <>
      <MapView
        style={styles.map}
        initialRegion={{
          longitude: 120.2661326,
          latitude: 22.6261283,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
        showsUserLocation={true}>
        {selected.includes('RT') && (
          <>
            {RTData.map((item, key) => (
              <Marker
                coordinate={{
                  longitude: item.longitude,
                  latitude: item.latitude,
                }}
                key={key}
                pinColor="red">
                <Callout style={styles.callout}>
                  <View style={styles.callout}>
                    <Text style={styles.text}>獼猴數量:{item.quantity}</Text>
                  </View>
                </Callout>
              </Marker>
            ))}
          </>
        )}

        {selected.includes('PD') && (
          // 未來使用將 - 0.001 拿掉即可
          <>
            {PDData.map((item, key) => (
              <Marker
                coordinate={{
                  longitude: item.longitude - 0.001,
                  latitude: item.latitude,
                }}
                key={key}
                pinColor="green">
                <Callout style={styles.callout}>
                  <View style={styles.callout}>
                    <Text style={styles.text}>獼猴數量:{item.quantity}</Text>
                  </View>
                </Callout>
              </Marker>
            ))}
          </>
        )}
      </MapView>
      <MultiSelect
        style={styles.dropdown}
        placeholderStyle={{
          color: 'black',
          alignSelf: 'center',
          justifyContent: 'center',
        }}
        data={list}
        labelField="label"
        valueField="value"
        placeholder="顯示項目"
        value={selected}
        onChange={item => {
          setSelected(item);
        }}
        renderItem={renderItem}
      />
    </>
  );
};

const styles = StyleSheet.create({
  map: {
    height: '100%',
    width: '100%',
  },
  dropdown: {
    position: 'absolute',
    left: 10,
    top: 10,
    backgroundColor: '#F2F2F2',
    borderRadius: 10,
    borderBottomColor: 'gray',
    borderBottomWidth: 0.5,
    width: 140,
    paddingHorizontal: 10,
    padding: 5,
  },
  callout: {
    padding: 3,
  },
  text: {
    color: 'black',
  },

  item: {
    height: 40,
    backgroundColor: 'white',
    alignItems: 'center',

    flexDirection: 'row',
    paddingHorizontal: 10,
  },
  itemText: {
    color: 'black',
    fontWeight: '100',
  },
});
