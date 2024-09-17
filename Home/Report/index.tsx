import React, { useEffect, useState } from 'react';
import { View, ScrollView,useColorScheme } from 'react-native';
import Seperator from './Seperator';
import Content from './Content';
import Footer from './Footer';
import Modal from './Modal';
import { submit, createFormData, showToast,ShowImageLibrary } from './function';
const initialReport = {
  fraid: false,
  frequency: 'always',
  textInputValue: '0',
  photo: {}
}

export default (props: any,  ) => {
  const [data, setData] = useState(initialReport);
  const [photo, setPhoto] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const theme = useColorScheme();
  const successSelected = (image:any)=>{
    setData((prev) => ({ ...prev, photo: image }));
    setPhoto(image?.uri);
  }
  const failSelected = ()=>{
    setPhoto(null);
    setData((prev) => ({ ...prev }))
  }
  useEffect(
    () => {
      if (props.route.params?.photo) {
        let photo = props.route.params?.photo
        setPhoto(photo?.path)
        setData({
          ...data, photo:
          {
            fileName: photo.path.split('/').pop(),
            type: "image/jpeg",
            uri: photo.path
          }
        })
      }
      
    }
    , [props.route.params?.photo])
  const submitClicked = async() => {
    const formData = await createFormData(data);
    await submit(formData);
    setData(initialReport);
    props.navigation.pop();
    showToast('Submission Succeeded.', '')
  }
  return (

    <View style={{ flex: 1 ,padding:40}}>
      <ScrollView>
        <Content data={data} theme={theme} setData={setData} uploadPicture={() => { setModalVisible(true) }} />
        <Seperator />
        <Footer submit={submitClicked} photo={photo} />
        <Modal
          ModalVisible={modalVisible}
          theme={theme}
          camera={() => {
            setModalVisible(false);
            props.navigation.push('Camera');
          }}
          gallery={() => {
            ShowImageLibrary(successSelected,failSelected);
            setModalVisible(false);

          }}
          close={() => { setModalVisible(false) }} />
      </ScrollView>
    </View>
  );
}

