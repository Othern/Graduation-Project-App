import { Pressable, Image, StyleSheet } from "react-native"
import  Octicons from "react-native-vector-icons/Octicons"

export default (props: any) => {
  const photo = props.route.params.photo;
  const send = ()=>{
    props.navigation.navigate({
      name: 'Report',
      params:{'photo': photo},
      merge: true
    });
  }
  return <>
    <Image source={{ uri: photo.path }} style={StyleSheet.absoluteFill} />
    <Pressable style={styles.submit} onPress={send}>
      <Octicons name="paper-airplane" style={styles.icon} size={30} color={'gray'} />
    </Pressable>
  </>
}

const styles = StyleSheet.create({
  submit: {
    position: 'absolute',
    height: 50,
    width: 50,

    justifyContent: 'center',
    bottom: 20,
    right: 20,
    borderRadius: 40,
    backgroundColor: 'white'
  },
  icon: {

    position: 'absolute',
    right: 8

  }

});




