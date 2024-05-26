import { View, TouchableOpacity, StyleSheet } from "react-native";
import { Button, Text, TextInput } from "react-native-paper";
import { useState } from "react";
import Icon from 'react-native-vector-icons/MaterialIcons';

function CheckBox({ size = 30, color = 'gray', onPress, selected, value }: any) {
  return (
    <TouchableOpacity style={[commonStyles.checkBox]} onPress={onPress}>
      <Text>{value}</Text>
      <Icon
        size={size}
        color={color}
        name={selected ? 'check-box' : 'check-box-outline-blank'}
      />

    </TouchableOpacity>
  )
}
function createNumberArray(maxNumber: number) {
  // 使用 Array.from() 方法创建一个由给定数字范围内的数字组成的数组
  // Array.from() 方法接受一个类似数组的对象或可迭代对象，并返回一个新的、浅拷贝的数组实例
  // 第一个参数是要创建的数组的长度，第二个参数是一个映射函数，用来对数组的每个元素进行处理，这里我们只需要数组的索引加 1
  return Array.from({ length: maxNumber }, (_, index) => index + 1);
}
function CheckBoxSets({ number = 1, onPress, selected,styles }: any) {
  return (<View style={commonStyles.checkBoxSets}>
    {createNumberArray(number).map((item, key) => {
      return (
        <CheckBox onPress={onPress} selected={selected} value={""} key={key} />
      )
    })}
  </View>)
}
function CheckElement({ title = "數量:", onPress, selected,styles }: any) {
  return (<View style={styles.element}>
    <View style={commonStyles.checkSetsTitle}>
      <Text style={styles.elementText}>{title}</Text>
    </View>
    <CheckBoxSets onPress={onPress} selected={selected} />
  </View>)
}


export default ({ data, setData,uploadPicture,theme }: any) => {
  const styles = theme === 'light' ? lightModeMergedStyles:darkModeMergedStyles ;
  return (
    <View style={styles.content}>
      <CheckElement title="是否經常遇到" onPress={() => setData((prevState: any) => ({ ...prevState, frequency: !data.frequency }))} selected={data.frequency} styles ={styles}/>
      <CheckElement title="是否會感到恐懼" onPress={() => setData((prevState: any) => ({ ...prevState, fraid: !data.fraid }))} selected={data.fraid} styles ={styles}/>
      <View style={styles.element}>
        <Text style={styles.elementText}>獼猴數量</Text>
        <TextInput
          cursorColor='black'
          activeOutlineColor='#1B1B1D'
          keyboardType='numeric'
          mode={"outlined"}
          maxLength={3}
          style={styles.textInputSection}
          outlineColor="#1B1B1D"
          onChangeText={(value) => setData((prevState: any) => ({ ...prevState, textInputValue: value }))} />
      </View>
      <View style={styles.element}>
        <Text style={styles.elementText}>上傳獼猴照片</Text>
        <Button style={styles.button} onPress={uploadPicture}><Text style={{fontWeight: 'bold', color:'white'}}>選擇</Text></Button>
      </View>
    </View>)
}
// 通用樣式
const commonStyles = StyleSheet.create({
  content: {
    flex: 5,
    flexDirection: 'column',
  },
  checkSetsTitle: {
    // 保持空白，讓不同模式定義自己的字體顏色
  },
  checkBoxSets: {
    flexDirection: 'row',
  },
  checkBox: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textInputSection: {
    height: 35,
    width: 50,
  },
  element: {
    height: 80,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  elementText: {
    fontSize: 18,
  },
  button: {
    borderRadius: 10,
    backgroundColor: '#007AFF',
  },
});

// Dark mode特定樣式
const darkModeStyles = StyleSheet.create({
  textInputSection: {
    backgroundColor: '#1B1B1D',
    borderColor: '#333333',
  },
  element: {
    backgroundColor: '#252428',
    borderColor: '#333333',
  },
  elementText: {
    color: '#FFFFFF',
  },
  button: {
  },
});

// Light mode特定樣式
const lightModeStyles = StyleSheet.create({
  textInputSection: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E0E0E0',
  },
  element: {
    backgroundColor: '#F8F8F8',
    borderColor: '#E0E0E0',
  },
  elementText: {
    color: '#333333',
  },
  button: {
  },
});

// 合併樣式
const darkModeMergedStyles = StyleSheet.create({
  ...darkModeStyles,
  ...commonStyles,
  
});

const lightModeMergedStyles = StyleSheet.create({
  ...lightModeStyles,
  ...commonStyles,
});


