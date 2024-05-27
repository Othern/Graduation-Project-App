import { useCameraDevice, useCameraPermission, Camera, PhotoFile } from "react-native-vision-camera";
import { useCallback, useEffect, useRef, useState } from "react";
import { StyleSheet, Pressable, View, Image, Text } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import Ionicon from "react-native-vector-icons/Ionicons";


export default (props: any) => {
  const device = useCameraDevice('back');
  const { hasPermission, requestPermission } = useCameraPermission();
  const [isActive, setIsActive] = useState(false);
  const [selected, setSelected] = useState(false);
  const [photo, setPhoto] = useState<PhotoFile>();

  const camera = useRef<Camera>(null);

  useEffect(() => {
    if (!hasPermission) {
      requestPermission();
    }
  }, [hasPermission]);

  useFocusEffect(
    useCallback(() => {
      setIsActive(true);
      return () => {
        setIsActive(false);
      }
    }, [])
  );

  const onTakePicturePressed = async () => {
    setSelected(true);
    try {
      const tempPhoto = await camera.current?.takePhoto({
        flash: 'off',
      });
      if (tempPhoto) {
        const photo = {...tempPhoto,path:`file://${tempPhoto.path}`};
        props.navigation.push('Preview',{'photo':photo})
      }
      setSelected(false);
    } catch (error) {
      console.error("Error taking photo:", error);
    }
    
    

  };

  if (!hasPermission) return <Text>Requesting camera permission...</Text>;
  if (device == null) return <Text>No camera device found</Text>;

  return (
    <>
      {device && hasPermission && (
        <Camera
          ref={camera}
          style={StyleSheet.absoluteFill}
          device={device}
          isActive={isActive}
          photo={true}
          onError={(error) => {
            console.error("Camera error:", error);
          }}
        />
      )}

      <Pressable onPress={onTakePicturePressed} style={styles.click}>
        <Ionicon name={selected ? 'radio-button-on' : "radio-button-off"} size={80} />
      </Pressable>
    </>

  );
};

const styles = StyleSheet.create({
  click: {
    position: 'absolute',
    alignSelf: 'center',
    bottom: 20
  },
  image: {
    position: 'absolute',
    height: 80,
    width: 80,
    bottom: 20,
    left: 20,
    borderRadius: 20,
    borderWidth: 6,
    borderColor: 'white',
    backgroundColor: 'gray',
  },
});




