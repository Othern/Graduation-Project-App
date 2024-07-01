import { Modal, Portal, Text } from "react-native-paper";
import { View, StyleSheet, Pressable, useColorScheme } from "react-native";

import Icon from "react-native-vector-icons/AntDesign";
const Button = ({styles,name,icon,onPress}:any) => {
    return (<Pressable style={styles.pressable} onPress={onPress}>
                <Icon name={icon} size={25} />
                <Text style={styles.text}>{name}</Text>
            </Pressable >)
}

export default ({ ModalVisible,close,camera,gallery }: any) => {
    const theme = useColorScheme();
    const styles = theme === 'light' ? lightModeStyles : darkModeStyles;
    return (
        <Portal>
            <Modal visible={ModalVisible} contentContainerStyle={styles.container} onDismiss={close}>
                <Text style={styles.title}>上傳圖片</Text>
                <Pressable style={styles.close} onPress={close}><Icon name={'close'} size={20}/></Pressable>
                <View style={styles.buttonContainer}>
                    <Button name={'camera'} icon={'camera'} styles = {styles} onPress={camera}/>
                    <Button name={'gallery'} icon={'picture'} styles = {styles} onPress={gallery}/>
                    
                </View>
            </Modal>
        </Portal>)
}

const darkModeStyles = StyleSheet.create({
    container: {
        backgroundColor: '#252428',
        alignSelf: 'center',
        height: 200,
        width: 350,
        padding: 0,
        borderRadius: 20,

    },
    title:{
        alignSelf: 'center',
        fontSize: 25,
        marginBottom: 30,
        
        fontWeight: 'bold'
    },
    text:{
        color:'white'
    },
    buttonContainer:{
        
        flexDirection: 'row',
        //alignItems: 'center',
        justifyContent: 'space-evenly'
    },
    pressable: {
        backgroundColor: '#616063',
        padding: 7,
        borderRadius: 5,
        alignItems: 'center'
    },
    close:{
        position : 'absolute',
        top: 20,
        right: 20,
        width: 20
    }
})

const lightModeStyles = StyleSheet.create({
    container: {
        backgroundColor: '#FFFFFF',  
        alignSelf: 'center',
        height: 200,
        width: 350,
        padding: 0,
        borderRadius: 20,
    },
    title: {
        alignSelf: 'center',
        fontSize: 25,
        marginBottom: 30,
        fontWeight: 'bold',
    },
    text:{
        color:'#656565'
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
    },
    pressable: {
        backgroundColor: '#DDDDDD',  
        padding: 7,
        borderRadius: 5,
        alignItems: 'center',
    },
    close: {
        position: 'absolute',
        top: 20,
        right: 20,
        width: 20,
    }
});
