import { Alert, Modal, StyleSheet, TouchableOpacity, Text, Pressable, View, TextInput  } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'
import React, { useState } from "react";

function Button({onPress,title,color}:any){
  return(
    <Pressable
              style={[styles.button,{backgroundColor: color}]}
              onPress={onPress}>
              <Text style={[styles.textStyle]}>{title}</Text>
    </Pressable>
  )
}
function CheckBox({size = 30,color = 'gray',onPress,selected,value}: any){
  return(
    <TouchableOpacity style={[styles.checkBox]} onPress={onPress}>
                <Text>{value}</Text>
                <Icon
                  size={size}
                  color={color}
                  name={selected ? 'check-box' : 'check-box-outline-blank'}
                />
                
    </TouchableOpacity>
  )
}
function createNumberArray(maxNumber:number) {
  // 使用 Array.from() 方法创建一个由给定数字范围内的数字组成的数组
  // Array.from() 方法接受一个类似数组的对象或可迭代对象，并返回一个新的、浅拷贝的数组实例
  // 第一个参数是要创建的数组的长度，第二个参数是一个映射函数，用来对数组的每个元素进行处理，这里我们只需要数组的索引加 1
  return Array.from({ length: maxNumber }, (_, index) => index + 1);
}
function CheckBoxSets({number=1,onPress,selected}:any){
  return(<View style={styles.checkBoxSets}>
          {createNumberArray(number).map((item,key)=>{return(
            <CheckBox onPress={onPress} selected={selected} value={""} key={key}/>
          )})}
        </View>)
}
function CheckElement({title="數量:", onPress,selected}:any){
  return(<View style={styles.notificationElement}>
    <View style={styles.checkSetsTitle}>
      <Text>{title}</Text>
    </View>
    <CheckBoxSets onPress={onPress} selected={selected}/>
  </View>)
}
function Seperator(){
  return ( <View style = {styles.Separator}/>)
}
async function submit(data:any) {
  try {
    const response = await fetch('your-flask-server-url', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    if (response.ok) {
      console.log('Data sent successfully');
      // Handle successful response if needed
    } else {
      console.error('Failed to send data');
      // Handle failure if needed
    }
  } catch (error) {
    console.error('Error sending data:', error);
    // Handle error if needed
  }
}

function ReportModal({ modalVisible, setModalVisible }: any) {

  const [data, setData] = useState({
    fraid: false,
    frequency: false,
    textInputValue: ''
  });
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}


      onRequestClose={() => {
        Alert.alert('Modal has been closed.');
        setModalVisible(!modalVisible);
      }}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalHeaderText}>獼猴通報</Text>
          </View>
          <Seperator/>
          <View style={styles.modalContent}>
            <CheckElement title="是否經常遇到" onPress ={() => setData(prevState => ({ ...prevState, frequency: !data.frequency}))} selected={data.frequency}/>
            <CheckElement title="是否會感到恐懼" onPress ={() =>  setData(prevState => ({ ...prevState, fraid: !data.fraid}))} selected={data.fraid}/>
            <View style={styles.notificationElement}>
              <Text>獼猴數量</Text>
              <View style={styles.textInputSection}>
                <TextInput keyboardType='numeric'  maxLength={40} style={{fontSize:15, textAlign:'center'}} onChangeText={(value) =>  setData(prevState => ({ ...prevState, textInputValue: value}))} />
              </View>
            </View>
          </View>
          <Seperator/>
          <View style={styles.modalFooter}>
            <Button color={'#2196F3'} onPress = {() => setModalVisible(!modalVisible)} title={"關閉通報"}/>
            
            <Button color={'#FF5733'} onPress = {() => {data.frequency && data.fraid? Alert.alert(data.textInputValue):Alert.alert("Fail","Fail")} } title={"發送通報"}/>
   
          </View>
        </View>
      </View>
    </Modal>
  );
}
//<Button color={'#FF5733'} onPress = {submit(data)} title={"發送通報"}/>
//         
export default ReportModal;



const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,

    shadowColor: '#000',
    height: 500,
    width: 350,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 10,
  },
  Separator: {
    marginTop: 8,
    marginBottom:8,
    borderBottomColor: '#737373',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  button: {
    //height: 40,
    borderRadius: 20,
    paddingHorizontal: 10,
    justifyContent: 'center',
  },

  
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalHeader: {
    flex: 1,
    borderRadius: 20,
  },
  modalHeaderText:{
    fontSize: 30,
    fontWeight: "bold"
  },
  modalContent: {
    flex: 5,
    justifyContent:'center',
    //justifyContent: "center"
  },
  modalFooter:{
    flex: 1,
    paddingTop: 10,
    flexDirection: "row",
    justifyContent: 'space-evenly'
  },
  notificationElement: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20

  },
  textInputSection:{
    height: 40,
    width: 45,
    backgroundColor: '#f2f2f2',
    borderRadius: 10,
    
  },
  checkSetsTitle:{
    
  },
  checkBoxSets: {
    
    flexDirection: 'row',
    
  },
  checkBox: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  
})

