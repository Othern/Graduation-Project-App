import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Alert, ViewStyle, Platform, ScrollView } from 'react-native';
import Toast from 'react-native-toast-message';
import { Asset, launchImageLibrary } from 'react-native-image-picker';
import Seperator from './Seperator';
import Content from './Content';
import Footer from './Footer';
import Modal from './Modal';
const initialReport = {
  fraid: false,
  frequency: false,
  textInputValue: '0',
  photo: {}
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
  [key: string] : any };


const createFormData = (body: BodyType={}) => {
  const data = new FormData();
  Object.keys(body).forEach((key) => {
    const value = body[key];
    if(key == 'photo'){
      data.append(key,{name: value?.fileName,
                        type: value?.type,
                        uri: value?.uri});
      
    }
    else
      data.append(key, value.toString());

  });
  return data;
};

async function submit(data: any, success= ()=>{}, fail= ()=>{}) {
  try {
    const response = await fetch('http://192.168.102.99:4000/reportSubmit', {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      body: data
    }).then(response => response.json());
    if (response.success == 1) {
      success();
    } else {
      fail();
      Alert.alert("Submission failed.");
    }
  } catch (error) {
    console.error('Error sending data:', error);
  }
}

export default (props: any, { theme }: any) => {
  const [data, setData] = useState(initialReport);
  const [photo, setPhoto] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const ShowImageLibrary = async () => {
    await launchImageLibrary({ mediaType: 'photo' }, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');

      } else if (response.errorMessage) {
        console.log('Image picker error: ', response.errorMessage);

      } else {
        let image = response.assets?.[0];
        if (image?.uri == undefined) {
          setPhoto(null);
          setData((prev) => ({ ...prev }))
        }
        else {
          setData((prev) => ({ ...prev, photo: image }));
          setPhoto(image?.uri);
        }
      }
    });
  }
  useEffect(
    () => {
      if (props.route.params?.photo) {
        let photo = props.route.params?.photo
        setPhoto(photo?.path)
        setData({ ...data, photo: 
          { fileName : photo.path.split('/').pop(),
            type : "image/jpeg",
            uri : photo.path
          } })
      }
    }
    , [props.route.params?.photo])
  const submitButton = () => {
    const formData = createFormData(data);
    submit(formData);
    
    setData(initialReport);
    props.navigation.pop();
    showToast('Submission Succeeded.', '')
  }
  return (

    <View style={{ flex: 1 }}>
      <ScrollView>
        <Content data={data} setData={setData} uploadPicture={() => { setModalVisible(true) }} />
        <Seperator />
        <Footer submit={submitButton} photo={photo} />
        <Modal
          ModalVisible={modalVisible}
          theme={theme}
          camera={() => {
            setModalVisible(false);
            props.navigation.push('Camera');
          }}
          gallery={() => {
            ShowImageLibrary();
            setModalVisible(false);

          }}
          close={() => { setModalVisible(false) }} />
      </ScrollView>
    </View>
  );
}

