import { View,StyleSheet } from "react-native";
import { Text,Button } from "react-native-paper";

function ModalButton({ onPress, title, color }: any) {
    return (
      <Button
        style={[styles.button, { backgroundColor: color }]}
        onPress={onPress}>
        <Text style={[styles.textStyle]}>{title}</Text>
      </Button>
    )
  }
export default ({close,submit}:any) => {
    return (
        <View style={styles.modalFooter}>
            <ModalButton 
                color={'#2196F3'} 
                onPress={close} 
                title={"關閉通報"} />
            <ModalButton
                color={'#FF5733'}
                onPress={submit}
                title={"發送通報"} />
        </View>)
}

const styles = StyleSheet.create({
    modalFooter: {
        flex: 0.8,
        paddingTop: 10,
        flexDirection: "row",
        justifyContent: 'space-evenly'
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
})