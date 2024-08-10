import Geolocation from 'react-native-geolocation-service';
import AsyncStorage from '@react-native-async-storage/async-storage';
import data from '../config.json'
const URL = data['URl']
const getUserData = async (key: string) => {
  try {
    // 获取存储的UserData
    const userDataString = await AsyncStorage.getItem('UserData');

    if (userDataString !== null) {
      // 解析字符串为对象
      const userData = JSON.parse(userDataString);
      const result = userData[key];
      return result;
    } else {
      console.log('UserData not found');
      return null;
    }
  } catch (error) {
    console.error('Failed to retrieve or parse UserData:', error);
    return null;
  }
};
export default async () => {
  const email = await getUserData('email');
  // 建立watchID以讓傳送地理資訊能在登出(清除使用者資料/Email)時被停止(clearWatch)
  const watchID = Geolocation.watchPosition(
    async position => {
      console.log(position);
      if (email) {
        try {
          const response = await fetch(URL+'locationSubmit', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({'email':email,'latitude':position.coords.latitude,'longitude':position.coords.longitude}),
          }).then(response => response.json());
        } catch (error) {
          console.error('Error sending data:', error);
        }
      }
      else {
        console.log('Email not found, not sending location.');
        Geolocation.clearWatch(watchID);
        return;
      }
    },
    error => {
      console.log(error);
    },
    {
      enableHighAccuracy: true,
      distanceFilter: 10, // 當與原本距離差多少公尺時通報
      interval: 5000, // 時間間隔為5秒
      fastestInterval: 2000, // 至少要差兩秒才會通報
    },
  );
};
