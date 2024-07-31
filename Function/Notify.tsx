import { View, Text, StyleSheet, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import messaging from '@react-native-firebase/messaging';
import Toast from 'react-native-toast-message';


const showToast = (text1: string, text2: string, type = 'success') => {
    Toast.show({
        type: type,
        text1: text1,
        text2: text2,
        topOffset: 20
    });
}
export const Notify = () => {
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
                        
                    });
                //訂閱主題
                subscribeToTopic('MonkeyAlert');
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

// 訂閱主題的函數
const subscribeToTopic = (topic: string) => {
    }