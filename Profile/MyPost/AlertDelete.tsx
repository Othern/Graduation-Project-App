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
      marginBottom: 20,
      textAlign: 'center',
      color: isDarkMode ? 'white' : 'black',
    },
    PressableContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      alignItems: 'center',
      height:40
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
              style={{ marginRight: 10 }}
            >
              <Text>取消</Text>
            </Pressable>
            <Pressable
    
              onPress={() => {
                onConfirmDelete()
                setShowDeleteWarning(false);
              }}
            >
              <Text>確定</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </Portal>
  );
};
