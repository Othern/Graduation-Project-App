import { View,TouchableOpacity,StyleSheet} from "react-native";
import { Text,TextInput } from "react-native-paper";
import Icon from 'react-native-vector-icons/MaterialIcons';

function CheckBox({ size = 30, color = 'gray', onPress, selected, value }: any) {
    return (
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
function createNumberArray(maxNumber: number) {
    // 使用 Array.from() 方法创建一个由给定数字范围内的数字组成的数组
    // Array.from() 方法接受一个类似数组的对象或可迭代对象，并返回一个新的、浅拷贝的数组实例
    // 第一个参数是要创建的数组的长度，第二个参数是一个映射函数，用来对数组的每个元素进行处理，这里我们只需要数组的索引加 1
    return Array.from({ length: maxNumber }, (_, index) => index + 1);
  }
  function CheckBoxSets({ number = 1, onPress, selected }: any) {
    return (<View style={styles.checkBoxSets}>
      {createNumberArray(number).map((item, key) => {
        return (
          <CheckBox onPress={onPress} selected={selected} value={""} key={key} />
        )
      })}
    </View>)
  }
  function CheckElement({ title = "數量:", onPress, selected }: any) {
    return (<View style={styles.element}>
      <View style={styles.checkSetsTitle}>
        <Text style={styles.elementText}>{title}</Text>
      </View>
      <CheckBoxSets onPress={onPress} selected={selected} />
    </View>)
  }


export default ({data,setData}:any) =>{
    return (<View style={styles.content}>
        <CheckElement title="是否經常遇到" onPress={() => setData((prevState:any) => ({ ...prevState, frequency: !data.frequency }))} selected={data.frequency} />
        <CheckElement title="是否會感到恐懼" onPress={() => setData((prevState:any) => ({ ...prevState, fraid: !data.fraid }))} selected={data.fraid} />
        <View style={styles.element}>
        <Text style={styles.elementText}>獼猴數量</Text>
        <TextInput 
          cursorColor='black'
          activeOutlineColor = '#4A4A4A'
          keyboardType='numeric' 
          mode={"outlined"} 
          maxLength={40} 
          style={styles.textInputSection}
          outlineColor="#4A4A4A"
          onChangeText={(value) => setData((prevState:any) => ({ ...prevState, textInputValue: value }))} />
        </View> 
        </View>)
}

const styles = StyleSheet.create({
    content: {
        flex: 5,
        flexDirection: 'column',
        
        
        
      },
    checkSetsTitle: {
    },
    checkBoxSets: {
      flexDirection: 'row',
    },
    checkBox: {
      flexDirection: 'row',
      alignItems: 'center'
    },
    textInputSection: {
        height: 35,
        width: 50,
        backgroundColor: '#4A4A4A',
      },
    element: {
        flex:1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 10
    
      },
      elementText:{
        fontSize: 18
      }
})