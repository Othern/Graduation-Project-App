import React, { useState, useEffect } from 'react';
import { View, Modal, StyleSheet, Text, Pressable } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Dropdown } from 'react-native-element-dropdown';
import data from '../../../config.json'
const URL = data['URl']
const getDataJSON = async (key: any, success = (data: any) => { }) => {
    try {
        const value = await AsyncStorage.getItem(key);
        if (value) {
            const valueParse = JSON.parse(value);
            success(valueParse);
        }
    } catch (e) {
        console.log("error", e);
    }
};

// 測試用假資料測試用假資料測試用假資料測試用假資料測試用假資料測試用假資料測試用假資料測試用假資料測試用假資料
const mockTitleList:any = ["無"];
// const mockTitleList = [
//     "無",
//     "大師",
//     "大大師",
//     "可愛大師",
//     "好笑王",
// ];
// const mockCurrentTitle = "好笑王";
const mockCurrentTitle = "無";
// 測試用假資料 測試用假資料測試用假資料測試用假資料測試用假資料測試用假資料測試用假資料測試用假資料測試用假資料
const TitleModal = ({ visible, onClose }: any) => {
    const [email, setEmail] = useState('');
    const [titleList, setTitleList] = useState<string[]>([]);
    const [currentTitle, setCurrentTitle] = useState('');
    const [selectedTitle, setSelectedTitle] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        if (visible) {
            // @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@實際使用需修改
            if (false) { //使用假資料(測試用)
                setTitleList(mockTitleList);
                setCurrentTitle(mockCurrentTitle);
                setSelectedTitle(mockCurrentTitle);
            }
            else { //使用真實資料
                fetchUserData();
            }
        }
    }, [visible]);

    const fetchUserData = async () => {
        getDataJSON('UserData', async (data) => {
            if (data) {
                setEmail(data.email);
                await fetchTitleList(data.email);
            } else {
                setError('Not logged in, please login again');
            }
        });
    };

    const fetchTitleList = async (userEmail: any) => {
        try {
            const response = await fetch(URL+'GetUserTitleList', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email: userEmail })
            });
            const responseData = await response.json();
            if (responseData.state === "success") {
                //titleList 如果沒有 就傳只有 "無" 的 list (如果有的話，也要多一個"無"的item)
                setTitleList(responseData.titleList);
                //currentTitle 如果沒有就傳"無"
                setCurrentTitle(responseData.currentTitle);
                setSelectedTitle(responseData.currentTitle);
            } else {
                setError('Failed to fetch title list');
            }
        } catch (error) {
            setError('Network error');
        }
    };

    const handleSave = async () => {
        if (selectedTitle !== currentTitle) {
            try {
                const response = await fetch(URL+'ChangeUserTitle', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email, newTitle: selectedTitle })
                });
                const responseData = await response.json();
                if (responseData.state === "success") {
                    setCurrentTitle(selectedTitle);
                } else {
                    setError('Failed to change title');
                }
            } catch (error) {
                setError('Network error');
            }
        } else {

        }
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
                    <Text style={styles.title}>您的稱號</Text>
                    <Text style={styles.intro}>當前稱號: {currentTitle}</Text>
                    <Dropdown
                        style={styles.dropdown}
                        data={titleList.map(title => ({ label: title, value: title }))}
                        maxHeight={300}
                        labelField="label"
                        valueField="value"
                        placeholder="Select new title"
                        value={selectedTitle}
                        placeholderStyle={{ color: 'gray' }}
                        selectedTextStyle={{ color: 'gray' }}
                        itemTextStyle={{ color: 'gray' }}
                        onChange={item => setSelectedTitle(item.value)}
                    />
                    {error ? <Text style={styles.error}>{error}</Text> : null}
                    <View style={styles.buttonContainer}>
                        <Pressable style={({ pressed }) => [
                            styles.pressable,
                            {
                                opacity: pressed ? 0.8 : 1,
                                borderColor: '#FFBB77'
                            }
                        ]} onPress={onClose}>
                            <Text style={styles.pressableText}>離開</Text>
                        </Pressable>
                        <Pressable style={({ pressed }) => [
                            styles.pressable,
                            {
                                opacity: pressed ? 0.8 : 1,
                                borderColor: '#FFBB77'
                            }
                        ]} onPress={handleSave}>
                            <Text style={styles.pressableText}>更換</Text>
                        </Pressable>
                    </View>
                </View>
            </View>
        </Modal >
    );
};

const styles = StyleSheet.create({
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 15,
        color: 'black',
    },
    intro: {
        fontSize: 20,
        marginBottom: 15,
        color: 'black',
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
    },
    modalView: {
        borderRadius: 10,
        padding: 20,
        width: '80%',
        alignItems: 'center',
        elevation: 5,
        marginTop: 10,
        backgroundColor: '#FCFCFC'
    },
    dropdown: {
        height: 50,
        width: '80%',
        borderColor: 'gray',
        borderWidth: 0.5,
        borderRadius: 8,
        paddingHorizontal: 8,
        marginBottom: 20,
        backgroundColor: 'white',
        color: 'black'
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '80%',
    },
    pressable: {
        width: '40%',
        height: 40,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    pressableText: {
        fontSize: 18,
        color: 'black',
    },
    error: {
        marginTop: 10,
        textAlign: 'center',
        color: 'red',
        fontSize: 15,
    }
});

export default TitleModal;