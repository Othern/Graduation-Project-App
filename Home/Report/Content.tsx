import { View, TouchableOpacity,StyleSheet, TextStyle, ViewStyle, ImageStyle} from "react-native";
import { Button, Text, TextInput } from "react-native-paper";
import { useState } from "react";
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Dropdown } from 'react-native-element-dropdown';
import AntDesign from 'react-native-vector-icons/AntDesign';

const selectList = [
  { label: '總是', value: 'always' },
  { label: '常常', value: 'often' },
  { label: '有時', value: 'sometimes' },
  { label: '偶爾', value: 'seldom' },
];

export default ({ data, setData, uploadPicture, theme }: any) => {
  const styles = theme === 'light' ? lightModeMergedStyles:darkModeMergedStyles;
  const [select, setSelect] = useState('always')
  const renderItem = (item:any) => {
    return (
      <View style={styles.item}>
        <Text style={styles.textItem}>{item.label}</Text>
        {item.value === select && (
          <AntDesign
            style={styles.icon}
            name="checkcircleo"
            size={18}
          />
        )}
      </View>
    );
  };
  return (
    <View style={styles.content}>
      <View style={styles.element}>
        <Text style={styles.elementText}>遇見頻率</Text>
        <Dropdown
          style={styles.dropdown}
          selectedTextStyle={styles.selectedTextStyle}
          containerStyle ={styles.containerStyle}
          data={selectList}
          maxHeight={300}
          labelField="label"
          valueField="value"
          value={select}
          onChange={item => {
            setSelect(item.value);
            setData((prevState: any) => ({ ...prevState, frequency: item.value }))
            
          }}
          renderLeftIcon={() => (
            <AntDesign
              style={styles.icon}
              name="checkcircleo"
              size={18}
            />
          )}
          renderItem={renderItem}
        />
      </View>
      <View style={styles.element}>
        <Text style={styles.elementText}>獼猴數量</Text>
        <TextInput
          cursorColor='#007AFF'
          activeOutlineColor='#007AFF'
          keyboardType='numeric'
          mode={"outlined"}
          maxLength={3}
          style={styles.textInputSection}
          
          onChangeText={(value) => setData((prevState: any) => ({ ...prevState, textInputValue: value }))} />
           
      </View>
      <View style={styles.element}>
        <Text style={styles.elementText}>上傳獼猴照片</Text>
        <Button style={styles.button} onPress={uploadPicture}><Text style={{ fontWeight: 'bold', color: 'white' }}>選擇</Text></Button>
      </View>
    </View>)
}

// 通用樣式
const commonStyles:any = StyleSheet.create({
  content: {
    flex: 5,
    flexDirection: 'column',
  },
  textInputSection: {
    height: 40,
    width: 90,
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
  dropdown: {
    width: 110,
    borderRadius: 12,
    paddingHorizontal: 7,
    paddingVertical:5,
  },
  icon: {
    marginLeft: 5,
  },
  containerStyle:{
    overflow: 'hidden',
    backgroundColor: 'rgba(52, 52, 52, 0.8)',
    borderRadius: 12,
    borderWidth: 0,
    
  },
  item: {
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#1D1D1D',
    alignItems: 'center',
    
  },
  textItem: {
    fontWeight: '100',
    flex: 1,
    fontSize: 16,
    
  },
  selectedTextStyle: {
    fontSize: 16,
    marginBottom: 4,
    textAlign: 'center',
    

  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
});

// Dark mode特定樣式
const darkModeStyles = StyleSheet.create({
  textInputSection: {
    backgroundColor: '#1B1B1D',
    borderColor: '#333333',
  },
  dropdown: {
    
    backgroundColor: '#1D1D1D',
  },
  containerStyle:{
    backgroundColor: 'gray',
  },
  item: {
    backgroundColor: '#1D1D1D',
  },
  selectedTextStyle: {
    
    color:'white'
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
  icon: {
    color: 'white'
  },
});

// Light mode特定樣式
const lightModeStyles = StyleSheet.create({
  textInputSection: {
    backgroundColor: '#F1F3F4',
    borderColor: '#333333',
  },
  dropdown: {
    backgroundColor: 'white',
      borderRadius: 12,
      padding: 12,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.2,
      shadowRadius: 1.41,
      elevation: 2,
  },
  containerStyle:{
    backgroundColor: 'gray',
  },
  item: {
    backgroundColor: 'white',
  },
  selectedTextStyle: {
    color:'black'
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
  icon: {
    color: 'black'
  },
});
// 合併樣式
const createMergedStyles = (modeStyles:any) => {
  return {
    ...commonStyles,
    ...Object.keys(commonStyles).reduce((acc:any, key) => {
      acc[key] = { ...commonStyles[key], ...modeStyles[key] };
      return acc;
    }, {}),
  };
};

const darkModeMergedStyles = createMergedStyles(darkModeStyles);
const lightModeMergedStyles = createMergedStyles(lightModeStyles);



