import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Alert, ViewStyle,Platform,ScrollView } from 'react-native';
import Toast from 'react-native-toast-message';
import Seperator from './Seperator';
import Content from './Content';
import Footer from './Footer';
import Modal from './Modal';
const initialReport = {
  fraid: false,
  frequency: false,
  textInputValue: '0'
}

const showToast = (text1: string, text2: string) => {
  Toast.show({
    type: 'success',
    text1: text1,
    text2: text2,
    topOffset: 65
  });
}
type BodyType = {
  [key: string]: string | number | Blob | Boolean;
};

const createFormData = (photo:any, body: BodyType = {}) => {
  const data = new FormData();
  if (photo != null){
    data.append('photo', {
      name: photo.fileName,
      type: photo.type,
      uri: photo.path,
    });
  }
  Object.keys(body).forEach((key) => {
    const value = body[key];
    data.append(key, value.toString());
    
  });

  return data;
};

async function submit(data: any, success: any, fail: any) {
  try {
    const response = await fetch('http://172.20.10.2:4000/reportSubmit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    }).then(response => response.json());
    if (response.success == 1) {
      success();
    } else {
      Alert.alert("Submission failed.");
    }
  } catch (error) {
    console.error('Error sending data:', error);
  }
}

export default (props:any,{ theme }: any)=>{
  const [data, setData] = useState(initialReport);
  const [photo, setPhoto] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  useEffect(
    ()=>{
      if(props.route.params?.photo){
        setPhoto(props.route.params?.photo)
      }
    }
    ,[props.route.params?.photo])
  function submitButton() {
    const formData = createFormData(props.route.params?.photo,data);
    console.log(formData);
    setData(initialReport);
    props.navigation.pop();
    showToast('Submission Succeeded.', '')
  }

  const containerStyle: ViewStyle = {
    backgroundColor: theme === 'dark' ? '#1C1C1E' : 'white',
    paddingVertical: 20,
    paddingHorizontal: 20,
    height: 500,
    width: 300,
    alignSelf: 'center' // Explicitly set to a valid literal type
  };
  return (
    
      <View style={{ flex: 1 }}>
        <ScrollView>
          <Content data={data} setData={setData} uploadPicture={()=>{setModalVisible(true)}}/>
          <Seperator />
          <Footer submit={submitButton} photo={photo} />
          <Modal 
            ModalVisible={modalVisible} 
            theme={theme}
            camera={()=>{
              setModalVisible(false);
              props.navigation.push('Camera');
            }} 
            close={()=>{setModalVisible(false)}}/>
          </ScrollView>
      </View>
  );
}

