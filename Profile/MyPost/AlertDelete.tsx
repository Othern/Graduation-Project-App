import React from 'react';
import { View, Text, StyleSheet ,Pressable} from 'react-native';
import { Portal, Modal } from 'react-native-paper';
import { useColorScheme } from 'react-native';

interface DeleteWarningModalProps {
  showDeleteWarning: boolean;
  setShowDeleteWarning: React.Dispatch<React.SetStateAction<boolean>>;
  onConfirmDelete: () => void;
}

export default ({ showDeleteWarning, setShowDeleteWarning,onConfirmDelete  }: DeleteWarningModalProps) => {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';

  const styles = StyleSheet.create({
    modalContent: {
      backgroundColor: isDarkMode ? '#333' : 'white',
      padding: 20,
      margin: 20,
      borderRadius: 10,
    },
    text: {
      fontSize: 18,
      textAlign: 'center',
      color: isDarkMode ? 'white' : 'black',
    },
    PressableContainer: {
      marginTop: 10,
      flexDirection: 'row',
      alignItems: 'center',
      height:50,
      
    },
  });

  return (
    <Portal>
      <Modal
        visible={showDeleteWarning}
        onDismiss={() => setShowDeleteWarning(false)}
        contentContainerStyle={styles.modalContent}
      >
        <View>
          <Text style={styles.text}>是否確定刪除此文章？</Text>
          <View style={styles.PressableContainer}>
            <Pressable
              
              onPress={() => setShowDeleteWarning(false)}
              style={{ flex:1 ,borderRightWidth:0.1}}
            >
              <Text style={styles.text}>取消</Text>
            </Pressable>
            <Pressable
              style={{ flex:1 ,}}
              onPress={() => {
                onConfirmDelete()
                setShowDeleteWarning(false);
              }}
            >
              <Text style={styles.text}>確定</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </Portal>
  );
};
