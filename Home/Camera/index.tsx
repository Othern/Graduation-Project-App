import { useCameraDevice,useCameraPermission,Camera } from "react-native-vision-camera";
import { useEffect } from "react";
import { StyleSheet } from "react-native";
import { BottomTabView } from "@react-navigation/bottom-tabs";

function App() {
  const device = useCameraDevice('back'); // front, external, back camera
  const { hasPermission,requestPermission } = useCameraPermission()

 useEffect(()=>{
	if(!hasPermission){
		requestPermission();
	}
},[hasPermission])
if (!hasPermission) return <></> 
if (device == null) return <> </>
  return (
    <>
    
    <Camera
      style={StyleSheet.absoluteFill}
      device={device}
      isActive={true}
    />
    </>
  )
}


export default App;