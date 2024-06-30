//調整權限頁面 有調整權限欄位 權限名:開啟關閉(永久) 權限 {鏡頭, 位置} 且有 介紹按鈕{進入介紹頁面(介紹這個APP的功能)}
//修改資料頁面 有 {修改頭像按鈕(進入頭像修改頁面), 修改帳號名按鈕(進入帳號名修改頁面), 修改密碼按鈕(進入密碼修改頁面)}
//修改頭像頁面 有 {當前頭像圖片預覽, 使用預設頭像按鈕, 上傳新頭像按鈕, 確認, 取消}
//修改帳號名 有 {當前帳號名, 新帳號名輸入欄, 確認, 取消}
//修改密碼 有 {當前密碼輸入欄, 新密碼輸入欄, 確認, 取消}
import React, { useState, useEffect, useCallback } from "react";
import { View, Text, TextInput, Button, Pressable, StyleSheet, Image } from 'react-native';
import { createStackNavigator } from "@react-navigation/stack";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StackActions, useFocusEffect } from '@react-navigation/native';
import * as Keychain from 'react-native-keychain';

import Modify from "./Modify"
import Setting from "./Setting"
import Intro from "./Intro"
const UserStack = createStackNavigator();

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

const Logout = async (props: any) => {
    try {
        await Keychain.resetGenericPassword();
        console.log('Credentials successfully removed from keychain');
        await AsyncStorage.clear();
        console.log('Async Storage cleared successfully!');
        props.navigation.dispatch(StackActions.popToTop());
    } catch (error) {
        console.error('Failed to reset keychain:', error);
        console.error('Failed to clear Async Storage:', error);
    }

}

const Profile = (props: any) => {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [headImg, setHeadImg] = useState('');


    getDataJSON('UserData', (data) => {
        if (data) {
            setEmail(data.email);
            setUsername(data.username);
            setHeadImg(data.headImg);
        }
        else {
            console.log('Not login, login again')
        }
    });
    useFocusEffect(
        useCallback(() => {
            getDataJSON('UserData', (data) => {
                if (data) {
                    setEmail(data.email);
                    setUsername(data.username);
                    setHeadImg(data.headImg);
                }
                else {
                    console.log('Not login, login again')
                }
            });
        }, [])
    );
    const image =
        headImg == "" ? require("../asset/rain.png") : { uri: headImg }
    // 等決定預設頭項後，把該圖放入asset中，並把rain 改掉. require 可以接這裡面的，uri則是可以接網址，地址

    return (

        <View style={styles.container}>
            <View style={styles.UserInfo}>
                <Image
                    style={styles.headImg}
                    source={image}
                />
                <Text style={styles.username}>{username}</Text>
            </View>

            <View style={styles.line} />

            <Pressable onPress={() => props.navigation.push('modifyPages', { From: 'profile', Email: email, Username: username, HeadImg: headImg })} style={({ pressed }) => [
                styles.pressable,
                {
                    backgroundColor: pressed ? '#FFAF60' : 'orange',
                    borderColor: pressed ? 'orange' : '#FFAF60',
                }
            ]}><Text style={styles.pressableText}>修改帳號資訊</Text>
            </Pressable>

            <Pressable onPress={() => props.navigation.push('setting', { From: 'profile' })} style={({ pressed }) => [
                styles.pressable,
                {
                    backgroundColor: pressed ? '#FFAF60' : 'orange',
                    borderColor: pressed ? 'orange' : '#FFAF60',
                }
            ]}><Text style={styles.pressableText}>設定系統權限</Text>
            </Pressable>

            <Pressable onPress={() => props.navigation.push('intro', { From: 'profile' })} style={({ pressed }) => [
                styles.pressable,
                {
                    backgroundColor: pressed ? '#FFAF60' : 'orange',
                    borderColor: pressed ? 'orange' : '#FFAF60',
                }
            ]}><Text style={styles.pressableText}>系統使用說明</Text>
            </Pressable>

            <Pressable onPress={() => Logout(props)} style={({ pressed }) => [
                styles.pressable,
                {
                    backgroundColor: pressed ? '#FFAF60' : 'orange',
                    borderColor: pressed ? 'orange' : '#FFAF60',
                }
            ]}><Text style={styles.pressableText}>登出當前帳號</Text>
            </Pressable>

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,

        alignItems: 'center',
        backgroundColor: 'white',
    },
    UserInfo: {
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: '4%',
        marginTop: '10%',
    },
    headImg: {
        width: 140,
        height: 140,
        borderRadius: 100,
        margin: '3%',
    },
    username: {
        textAlign: 'center',
        color: 'black',
        fontSize: 24,
    },
    line: {
        height: 1,
        backgroundColor: 'black',
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
        color: 'white',
        fontSize: 24,
    },
});

export default (props: any) => {
    // 主要一個頁面 有 {頭像圖片, 登出按鈕(清除登入資訊，user資訊,並navigate到登入頁面), setting按鈕(進入調整權限頁面), 修改資料按鈕(進入修改資料頁面)}
    return (
        <UserStack.Navigator initialRouteName="profile">
            <UserStack.Screen component={Profile} name="profile" options={{ headerShown: false }} />
            <UserStack.Screen component={Modify} name="modifyPages" options={{ headerShown: false }} />
            <UserStack.Screen component={Setting} name="setting" options={{ headerShown: false }} />
            <UserStack.Screen component={Intro} name="intro" options={{ headerShown: false }} />
        </UserStack.Navigator>
    )
}
