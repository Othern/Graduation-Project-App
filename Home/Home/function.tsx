import {PermissionsAndroid} from 'react-native';

export async function requestGeolocationPermission() {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: 'Location Permission',
        message: 'This app needs access to your location.',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      },
    );
  } catch (err) {
    console.warn(err);
  }
}
// const data = [
//   {
//     name: '威爾希斯咖啡',
//     longitude: 120.2661326,
//     latitude: 22.6261283,
//     quantity: 1,
//     time: '2024-06-14 07:57:27',
//   },
//   {
//     name: '國研停車場',
//     longitude: 120.2660711,
//     latitude: 22.6242157,
//     quantity: 1,
//     time: '2024-06-14 07:50:27',
//   },
//   {
//     name: '理工一道',
//     longitude: 120.2666379,
//     latitude: 22.6263989,
//     quantity: 2,
//     time: '2024-06-14 07:51:27',
//   },
//   {
//     name: '武四',
//     longitude: 120.2643484,
//     latitude: 22.6301555,
//     quantity: 3,
//     time: '2024-06-14 07:57:27',
//   },
// ];
type DATA = {
  name: string,
  longitude: number,
  latitude: number,
  quantity: number,
  time: string,
};

// data
export const Data: DATA[] = [];
