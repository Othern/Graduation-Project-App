import { View, Text, StyleSheet, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import messaging from '@react-native-firebase/messaging';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import data from '../config.json'
const URL = data['URl']
const getUserData = async (key: string) => {
    try {
      // 获取存储的UserData
      const userDataString = await AsyncStorage.getItem('UserData');
  
      if (userDataString !== null) {
        // 解析字符串为对象
        const userData = JSON.parse(userDataString);
        const result = userData[key];
        return result;
      } else {
        console.log('UserData not found');
        return null;
      }
    } catch (error) {
      console.error('Failed to retrieve or parse UserData:', error);
      return null;
    }
};
const showToast = (text1: string, text2: string, type = 'success') => {
    Toast.show({
        type: type,
        text1: text1,
        text2: text2,
        topOffset: 20
    });
}
export const Notify = async() => {
    const email = await getUserData('email');
    // 確保為該user的token傳送至後端
    if (email) {
        messaging()
            .requestPermission()
            .then(authStatus => {
                console.log('APNs Status: ', authStatus);
                if (
                    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
                    authStatus === messaging.AuthorizationStatus.PROVISIONAL
                ) {
                    messaging()
                        .getToken()
                        .then(token => {
                            console.log('messaging.getToken: ', token);
                            sendTokenToServer(token);
                        });
                    //訂閱主題
                    // subscribeToTopic('MonkeyAlert');
                    messaging().onTokenRefresh(token => {
                        console.log('messaging.onTokenRefresh: ', token);
                        
                    });
                    messaging().onMessage(async (remoteMessage:any) => {
                        showToast(
                            remoteMessage.notification.title,
                            remoteMessage.notification.body,
                            'notification'
                        );
                    });
                
                }
            })
            .catch(err => {
                console.log('messaging.requestPermission Error: ', err);
            });
    }
    else{
        console.log("no email in notify");
    }
}

// 訂閱主題的函數
const subscribeToTopic = (topic: string) => {
    }
// 將該使用者的token傳送至後端 
const sendTokenToServer = async (token: any) => {
    const email = await getUserData('email');
    if (email) {
        try {
            const response = await fetch(URL+'tokenSubmit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ token, email })
            });
            const responseData = await response.json();
            if (responseData.state === "success") {
                console.log("Token sent to server successfully!");
            } else {
                console.log("Token sent to server fail!");
            }
        } catch (error) {
            console.error('An error occurred while sending token to server: ', error);
        }
    }
    else{
        console.log("no email in gettoken");
    }
};