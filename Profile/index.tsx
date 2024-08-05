//調整權限頁面 有調整權限欄位 權限名:開啟關閉(永久) 權限 {鏡頭, 位置} 且有 介紹按鈕{進入介紹頁面(介紹這個APP的功能)}
//修改資料頁面 有 {修改頭像按鈕(進入頭像修改頁面), 修改帳號名按鈕(進入帳號名修改頁面), 修改密碼按鈕(進入密碼修改頁面)}
//修改頭像頁面 有 {當前頭像圖片預覽, 使用預設頭像按鈕, 上傳新頭像按鈕, 確認, 取消}
//修改帳號名 有 {當前帳號名, 新帳號名輸入欄, 確認, 取消}
//修改密碼 有 {當前密碼輸入欄, 新密碼輸入欄, 確認, 取消}
import React, { useState, useEffect, useCallback } from "react";
import { View, Text, TextInput, Button, Pressable, StyleSheet, Image,useColorScheme } from 'react-native';
import { createStackNavigator } from "@react-navigation/stack";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StackActions, useFocusEffect } from '@react-navigation/native';
import * as Keychain from 'react-native-keychain';
import Icon from 'react-native-vector-icons/Ionicons';

import Modify from "./Modify"
import Setting from "./Setting"
import Intro from "./Intro"
import MyArticle from "./MyPost";
import RevisePost from "./RevisePost"
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
    const theme = useColorScheme();

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
            <View style={[styles.UserInfo,]}>
                <Image
                    style={styles.headImg}
                    source={image}
                />
                <Text style={styles.username}>{username}</Text>
            </View>

            <Pressable
                onPress={() => props.navigation.push('modifyPages',
                    { From: 'profile', Email: email, Username: username, HeadImg: headImg })}
                style={styles.pressable}
            >
                <Icon style={styles.icon} name={'person-circle'} size={30} />
                <Text style={styles.pressableText}>修改帳號資訊</Text>
                <Icon style={[styles.icon,styles.forward]} name={'chevron-forward'} size={30} />

            </Pressable>

            <Pressable onPress={() => props.navigation.push('setting', { From: 'profile' })} style={styles.pressable}>
                <Icon style={styles.icon} name={'settings'} size={30} />
                <Text style={styles.pressableText}>設定系統權限</Text>
                <Icon style={[styles.icon,styles.forward]} name={'chevron-forward'} size={30} />

            </Pressable>

            <Pressable onPress={() => props.navigation.push('myArticle', { From: 'profile' })} style={styles.pressable}>
                <Icon style={styles.icon} name={'newspaper'} size={30} />
                <Text style={styles.pressableText}>我的文章</Text>
                <Icon style={[styles.icon,styles.forward]} name={'chevron-forward'} size={30} />
            </Pressable>

            <Pressable onPress={() => props.navigation.push('intro', { From: 'profile' })} style={styles.pressable}>
                <Icon style={styles.icon} name={'information-circle'} size={30} />
                <Text style={styles.pressableText}>系統使用說明</Text>
                <Icon style={[styles.icon,styles.forward]} name={'chevron-forward'} size={30} />
            </Pressable>

            <Pressable onPress={() => Logout(props)} style={styles.pressable}>
                <Icon style={styles.icon} name={'log-out'} size={30} />
                <Text style={styles.pressableText}>登出當前帳號</Text>
                <Icon style={[styles.icon,styles.forward]} name={'chevron-forward'} size={30} />
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
        height:150,
        alignItems: 'center',
        flexDirection: 'row',
        marginBottom: '4%',
        borderRadius: 10,
        padding: 10,
        marginTop: '10%',

    },
    headImg: {
        width: 100,
        height: 100,
        borderRadius: 100,
        marginRight:20
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
        marginTop: '7%',
    },
    icon: {
        marginTop: 5,
        marginRight: 20,
    },
    pressableText: {
        justifyContent: 'center',
        fontSize: 20,
    },
    forward:{
        position:'absolute',
        
        right:5,
    }
});

export default (props: any) => {
    // 主要一個頁面 有 {頭像圖片, 登出按鈕(清除登入資訊，user資訊,並navigate到登入頁面), setting按鈕(進入調整權限頁面), 修改資料按鈕(進入修改資料頁面)}
    return (
        <UserStack.Navigator initialRouteName="profile">
            <UserStack.Screen component={Profile} name="profile" options={{ header: ()=>(null) }} />
            <UserStack.Screen component={Modify} name="modifyPages" options={{ headerShown: false }} />
            <UserStack.Screen component={Setting} name="setting" options={{ headerShown: false }} />
            <UserStack.Screen component={MyArticle} name="myArticle" options={{ headerShown: false }} />
            <UserStack.Screen component={Intro} name="intro" options={{ headerShown: false }} />
            <UserStack.Screen component={RevisePost} name="reviseArticle" options={{ headerShown: false }} />
        </UserStack.Navigator>
    )
}
