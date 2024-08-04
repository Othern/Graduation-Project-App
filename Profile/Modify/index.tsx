import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, Pressable, StyleSheet, Image } from 'react-native';
import Head from './Head'
import PasswordModal from "./Password";
import UsernameModal from "./Username";
import * as Keychain from 'react-native-keychain';
//keychain 如果要在ios 用 要在 ios資料夾中運行 npx pod-install 
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createStackNavigator } from "@react-navigation/stack";
import Toast from 'react-native-toast-message';

const showToast = (text1: string, text2: string, type = 'success') => {
    Toast.show({
        type: type,
        text1: text1,
        text2: text2,
        topOffset: 65
    });
}

const Modify = (props: any) => {
    const { From, Email, Username, HeadImg } = props.route.params;
    const [username, setUsername] = useState(Username);
    const [headImg, setHeadImg] = useState(HeadImg);
    // 等決定預設頭項後，把該圖放入asset中，並把rain 改掉. require 可以接這裡面的，uri則是可以接網址，地址

    const [usernameVisible, setUsernameVisible] = useState(false);
    const handleOpenUsername = () => {
        setUsernameVisible(true);
    };
    const handleCloseUsername = () => {
        setUsernameVisible(false);
    };
    const handleSaveUserame = async (newUsername: any) => {
        try {
            const value = JSON.stringify({ email: Email, username: newUsername, headImg: HeadImg });
            AsyncStorage.setItem('UserData', value);
            showToast('帳號修改成功', '');
            setUsername(newUsername);
            setUsernameVisible(false);
        } catch (e) {
            console.log("error", e);
            setUsernameVisible(false);
        }
    };

    const [passwordVisible, setPasswordVisible] = useState(false);
    const handleOpenPassword = () => {
        setPasswordVisible(true);
    };
    const handleClosePassword = () => {
        setPasswordVisible(false);
    };
    const handleSavePassword = async (newPassword: any) => {
        try {
            // 儲存Email和密碼
            await Keychain.setGenericPassword(Email, newPassword);
            showToast('密碼修改成功', '');
            setPasswordVisible(false);
        } catch (error) {
            setPasswordVisible(false);
            console.error('Could not save credentials', error);
        }
    };

    return (


        <View style={styles.container}>
            <View style={styles.titleContainer}>

                <Text style={styles.title}>修改帳號資訊</Text>
            </View>

            <View style={styles.line} />

            <Pressable onPress={() => props.navigation.push('head', { From: 'modify', HeadImg: headImg, Email: Email, Username: username })} style={({ pressed }) => [
                styles.pressable,
                {
                    opacity: pressed ? 0.8 : 1,
                    borderColor: '#FFBB77'
                }
            ]}><Text style={styles.pressableText}>修改頭像圖片</Text>
            </Pressable>

            <Pressable onPress={handleOpenUsername} style={({ pressed }) => [
                styles.pressable,
                {
                    opacity: pressed ? 0.8 : 1,
                    borderColor: '#FFBB77'
                }
            ]}><Text style={styles.pressableText}>修改帳號名稱</Text>
            </Pressable>
            <UsernameModal
                visible={usernameVisible}
                onClose={handleCloseUsername}
                onSave={handleSaveUserame}
                currentUsername={username}
                currentEmail={Email}
            />

            <Pressable onPress={handleOpenPassword} style={({ pressed }) => [
                styles.pressable,
                {
                    opacity: pressed ? 0.8 : 1,
                    borderColor: '#FFBB77'
                }
            ]}><Text style={styles.pressableText}>變更為新密碼</Text>
            </Pressable>
            <PasswordModal
                visible={passwordVisible}
                onClose={handleClosePassword}
                onSave={handleSavePassword}
                currentEmail={Email}
            />

            <Pressable onPress={() => props.navigation.goBack()} style={({ pressed }) => [
                styles.pressable,
                {
                    opacity: pressed ? 0.8 : 1,
                    borderColor: '#FFBB77'
                }
            ]}><Text style={styles.pressableText}>返回個人頁面</Text>
            </Pressable>

        </View>
    );

}
const styles = StyleSheet.create({
    container: {
        flex: 1,

        alignItems: 'center',

    },
    titleContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: '4%',
        marginTop: '30%',
    },
    title: {
        textAlign: 'center',

        fontSize: 32,
        fontWeight: 'bold',
    },
    line: {
        height: 1,

        width: '80%',
        marginBottom: '2%',
    },
    pressable: {
        width: '60%',
        height: 40,
        borderRadius: 10,
        borderWidth: 1,
        marginTop: '7%',
        paddingTop: 3,
    },
    pressableText: {
        textAlign: 'center',

        fontSize: 24,
    },
});
const ModifyStack = createStackNavigator();
export default (props: any) => {
    return (
        <ModifyStack.Navigator initialRouteName="modify" >
            <ModifyStack.Screen component={Modify} name="modify" options={{ headerShown: false }} initialParams={props.route.params} />
            <ModifyStack.Screen component={Head} name="head" options={{ headerShown: false }} />
        </ModifyStack.Navigator >
    )

}