import React, { useState } from 'react';
import { View, Modal, TextInput, Button, StyleSheet, Text, Pressable } from 'react-native';


const UsernameModal = ({ visible, onClose, onSave, currentUsername }: any) => {
    const [newUsername, setNewUsername] = useState('');
    const [error, setError] = useState(false);

    const handleSave = async () => {
        try {

            if (true) {
                onSave(newUsername);
                setNewUsername('');
            } else {
                setError(true);
                setNewUsername('');
            }

            // const response = await fetch('http://172.20.10.2:4000/ModifyUsername', {
            //     method: 'POST',
            //     headers: {
            //         'Content-Type': 'application/json'
            //     },
            //     body: JSON.stringify({ newUsername })
            // });
            // const responseData = await response.json();
            // if (responseData.state === "success") {
            //     onSave(newUsername);
            //     setNewUsername('');
            // } else {
            //     setNewUsername('');
            // }
        } catch (error) {
            console.error('Error sending New Username data:', error);
        }
    };

    const handleClose = () => {
        onClose();
        setNewUsername('');
    };
    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    <Text style={styles.title}>修改帳號名稱</Text>
                    <Text style={styles.currentUsername}>當前帳號名稱:{currentUsername}</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="輸入新帳號"
                        value={newUsername}
                        onChangeText={setNewUsername}
                    />
                    <View style={styles.buttonContainer}>
                        <Pressable onPress={handleClose} style={({ pressed }) => [
                            styles.pressable,
                            {
                                backgroundColor: pressed ? '#8E8E8E' : '#E0E0E0',
                                borderColor: pressed ? '#E0E0E0' : '#8E8E8E',
                            }
                        ]}><Text style={styles.pressableText}>取消</Text>
                        </Pressable>
                        <Pressable onPress={handleSave} style={({ pressed }) => [
                            styles.pressable,
                            {
                                backgroundColor: pressed ? '#FFAF60' : 'orange',
                                borderColor: pressed ? 'orange' : '#FFAF60',
                            }
                        ]}><Text style={styles.pressableText}>確認</Text>
                        </Pressable>
                    </View>

                    {error ? <Text style={styles.error}>名稱已被使用或格式錯誤</Text> : <></>}
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'black',
        marginBottom: 15,
    },
    currentUsername: {
        fontSize: 20,
        color: 'black',
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalView: {
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        width: '80%',
        alignItems: 'center',
        elevation: 5,
        marginTop: 10,
    },
    input: {
        borderWidth: 1,
        padding: 10,
        marginVertical: 20,
        width: '80%',
        borderRadius: 8,
        height: 45,
        margin: 12,

        borderColor: 'gray',
        color: '#000000',
        fontSize: 20,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '80%',
    },
    pressable: {
        width: '30%',
        height: 35,
        borderRadius: 10,
        borderWidth: 1,
        paddingTop: 4,
    },
    pressableText: {
        textAlign: 'center',
        color: 'white',
        fontSize: 18,
    },
    error: {
        marginTop: 10,
        textAlign: 'center',
        color: 'red',
        fontSize: 15,
    }
});

export default UsernameModal;