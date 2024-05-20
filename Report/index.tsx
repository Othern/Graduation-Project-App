import { Alert, StyleSheet, TouchableOpacity, Pressable, View, } from 'react-native';
import { Portal, Modal, Text, Paragraph, TextInput, Button } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons'
import React, { useState } from "react";
import Seperator from './Seperator';
import Header from './Header';
import Toast from 'react-native-toast-message';
import Content from './Content';
import Footer from './Footer';

function ReportModal({ modalVisible, setModalVisible }: any) {
  const initialReport = {
    fraid: false,
    frequency: false,
    textInputValue: '0'
  }
  const showToast = (text1: string, text2: string) => {
    Toast.show({
      type: 'success',
      text1: text1,
      text2: text2
    });
  }
  const [data, setData] = useState(initialReport);
  // 做後端串接使用，url要改
  async function submit() {
    try {
      const response = await fetch('http://172.20.10.2:4000' + '/reportSubmit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      }).then(response => response.json());
      if (response.success == 1) {
        setModalVisible(!modalVisible);
        setData(initialReport);
        showToast('Submition Succeeded.', '');
      }
      else Alert.alert("Submition failed.");

    } catch (error) {
      console.error('Error sending data:', error);
    }
  }
  function closeButton() {
    setModalVisible(!modalVisible);
    setData(initialReport);
  }
  function submitButton() {
    setModalVisible(!modalVisible);
    setData(initialReport);
    showToast('Submission Succeeded.', '')
  }
  const containerStyle = { backgroundColor: 'white', paddingVertical: 20, paddingHorizontal: 20, height: 500 };
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
// submit 後端串接後可以改
// <Button color={'#FF5733'} onPress = {submit} title={"發送通報"}/>
// <Button color={'#FF5733'} onPress={() => { data.frequency && data.fraid ? Alert.alert(data.textInputValue) : Alert.alert("Fail", "Fail") }} title={"發送通報"} />

export default ReportModal;



const styles = StyleSheet.create({

})

