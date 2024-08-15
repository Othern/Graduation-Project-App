//調整權限頁面 有調整權限欄位 權限名:開啟關閉(永久) 權限 {鏡頭, 位置} 且有 介紹按鈕{進入介紹頁面(介紹這個APP的功能)}
//修改資料頁面 有 {修改頭像按鈕(進入頭像修改頁面), 修改帳號名按鈕(進入帳號名修改頁面), 修改密碼按鈕(進入密碼修改頁面)}
//修改頭像頁面 有 {當前頭像圖片預覽, 使用預設頭像按鈕, 上傳新頭像按鈕, 確認, 取消}
//修改帳號名 有 {當前帳號名, 新帳號名輸入欄, 確認, 取消}
//修改密碼 有 {當前密碼輸入欄, 新密碼輸入欄, 確認, 取消}
import React, { useState, useEffect, useCallback } from "react";
import { View, Text, TextInput, Button, Pressable, StyleSheet, Image, useColorScheme } from 'react-native';
import { createStackNavigator } from "@react-navigation/stack";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StackActions, useFocusEffect } from '@react-navigation/native';
import * as Keychain from 'react-native-keychain';
import Icon from 'react-native-vector-icons/Ionicons';
import data from '../config.json'
const URL = data['URl']
import Modify from "./Modify"
import Setting from "./Setting"
import Intro from "./Intro"
import MyArticle from "./MyPost";
import RevisePost from "./RevisePost"
import Header from "./Header";
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

const Logout = async (props: any, email: any) => {
    try {
        const response = await fetch(URL+'DataClean', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email })
        });
        const responseData = await response.json();
        if (responseData.state === "success") {
            console.log('Clean data Successfully!');
        } else {
            console.log('Clean data not found!');
        }
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
    const theme = useColorScheme();
    const textColor = theme === 'dark' ? 'white' : 'gray'

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
        headImg == "" ? require("../asset/profile-user.png") : { uri: headImg }
    // 等決定預設頭項後，把該圖放入asset中，並把rain 改掉. require 可以接這裡面的，uri則是可以接網址，地址

    return (

        <View style={styles.container}>
            <View style={[styles.UserInfo,]}>
                <Image
                    style={styles.headImg}
                    source={image}
                />
                <Text style={[styles.username, { color: textColor }]}>{username}</Text>
            </View>

            <Pressable
                onPress={() => props.navigation.push('modifyPages',
                    { From: 'profile', Email: email, Username: username, HeadImg: headImg })}
                style={styles.pressable}
            >
                <Icon style={[styles.icon, { color: textColor }]} name={'person-circle'} size={30} />
                <Text style={[styles.pressableText, { color: textColor }]}>修改帳號資訊</Text>
                <Icon style={[styles.icon, styles.forward, { color: textColor }]} name={'chevron-forward'} size={30} />

            </Pressable>

            <Pressable onPress={() => props.navigation.push('setting', { From: 'profile' })} style={styles.pressable}>
                <Icon style={[styles.icon, { color: textColor }]} name={'settings'} size={30} />
                <Text style={[styles.pressableText, { color: textColor }]}>設定系統權限</Text>
                <Icon style={[styles.icon, styles.forward, { color: textColor }]} name={'chevron-forward'} size={30} />

            </Pressable>

            <Pressable onPress={() => props.navigation.push('myPost', { From: 'profile' })} style={styles.pressable}>
                <Icon style={[styles.icon, { color: textColor }]} name={'newspaper'} size={30} />
                <Text style={[styles.pressableText, { color: textColor }]}>我的文章</Text>
                <Icon style={[styles.icon, styles.forward, { color: textColor }]} name={'chevron-forward'} size={30} />
            </Pressable>

            <Pressable onPress={() => props.navigation.push('intro', { From: 'profile' })} style={styles.pressable}>
                <Icon style={[styles.icon, { color: textColor }]} name={'information-circle'} size={30} />
                <Text style={[styles.pressableText, { color: textColor }]}>系統使用說明</Text>
                <Icon style={[styles.icon, styles.forward, { color: textColor }]} name={'chevron-forward'} size={30} />
            </Pressable>

            <Pressable onPress={() => Logout(props, email)} style={styles.pressable}>
                <Icon style={[styles.icon, { color: textColor }]} name={'log-out'} size={30} />
                <Text style={[styles.pressableText, { color: textColor }]}>登出當前帳號</Text>
                <Icon style={[styles.icon, styles.forward, { color: textColor }]} name={'chevron-forward'} size={30} />
            </Pressable>

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,

    },
    UserInfo: {
        height: 150,
        alignItems: 'center',
        flexDirection: 'row',
        marginBottom: '1%',
        borderRadius: 10,
        padding: 10,
        marginTop: '6%',

    },
    headImg: {
        width: 100,
        height: 100,
        borderRadius: 100,
        marginRight: 20,
        backgroundColor: 'white',
    },
    username: {
        textAlign: 'center',
        fontSize: 30,
        fontWeight: 'bold'
    },
    line: {
        height: 1,
        backgroundColor: 'white',
        width: '80%',
        marginBottom: '2%',
    },
    pressable: {
        width: '100%',
        height: 70,
        borderRadius: 10,

        alignItems: 'center',

        flexDirection: 'row',
        padding: 5,
        marginTop: '5%',
    },
    icon: {
        marginTop: 5,
        marginRight: 20,
    },
    pressableText: {
        justifyContent: 'center',
        fontSize: 20,
    },
    forward: {
        position: 'absolute',

        right: 5,
    }
});

export default (props: any) => {
    // 主要一個頁面 有 {頭像圖片, 登出按鈕(清除登入資訊，user資訊,並navigate到登入頁面), setting按鈕(進入調整權限頁面), 修改資料按鈕(進入修改資料頁面)}
    return (
        <UserStack.Navigator initialRouteName="profile">
            <UserStack.Screen component={Profile} name="profile" options={{ header: () => (null) }} />
            <UserStack.Screen component={Modify} name="modifyPages" options={{ headerShown: false }} />
            <UserStack.Screen component={Setting} name="setting" options={{ headerShown: false }} />
            <UserStack.Screen component={MyArticle} name="myPost" options={{ header: (props) => <Header {...props} /> }} />
            <UserStack.Screen component={Intro} name="intro" options={{ headerShown: false }} />
            <UserStack.Screen component={RevisePost} name="reviseMyPost" options={{ header: (props) => <Header {...props} /> }} />
        </UserStack.Navigator>
    )
}
