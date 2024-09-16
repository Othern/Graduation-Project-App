import React, { useState } from 'react';
import { View, StyleSheet, Alert, ViewStyle } from 'react-native';
import { Portal, Modal } from 'react-native-paper';
import Toast from 'react-native-toast-message';
import Header from './Header';
import Seperator from './Seperator';
import Content from './Content';
import Footer from './Footer';

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
async function submit(data:any,success: any,fail: any) {
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

function ReportModal({ modalVisible, setModalVisible, theme }: any) {
  const [data, setData] = useState(initialReport);

  function closeButton() {
    setModalVisible(!modalVisible);
    setData(initialReport);
  }

  function submitButton() {
    setModalVisible(!modalVisible);
    if(data.textInputValue == initialReport.textInputValue){
      Alert.alert("請輸入大約獼猴數量.");
    }
    else{
      setData(initialReport);
      showToast('Submission Succeeded.', '')
    }
    
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
    <Portal>
      <Modal visible={modalVisible} onDismiss={() => { setModalVisible(!modalVisible) }} contentContainerStyle={containerStyle}>
        <View style={{ flex: 1 }}>
          <Header />
          <Seperator />
          <Content data={data} setData={setData} />
          <Seperator />
          <Footer submit={submitButton} close={closeButton} />
        </View>
      </Modal>
    </Portal>
  );
}

export default ReportModal;




const styles = StyleSheet.create({

})

