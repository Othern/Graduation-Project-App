import { PermissionsAndroid } from 'react-native';

export async function requestGeolocationPermission() {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
            title: "Location Permission",
            message: "This app needs access to your location.",
            buttonNeutral: "Ask Me Later",
            buttonNegative: "Cancel",
            buttonPositive: "OK"
        }
        );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log("You can use the geolocation")
      } else {
        console.log("Geolocation permission denied")
      }
    } catch (err) {
      console.warn(err)
    }
  }
  


