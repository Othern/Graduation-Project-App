
import { Text } from "react-native-paper";
import { View,StyleSheet } from "react-native";

export default()=>{
    return(<View style={styles.modalHeader}>
        <Text style={styles.modalHeaderText}>獼猴通報</Text>
        </View>)

}

const styles = StyleSheet.create({
    modalHeader: {
        flex: 1,
        flexDirection: 'row',
      },
      modalHeaderText: {
        fontSize: 30,
        
        fontWeight: "bold"
      },
})