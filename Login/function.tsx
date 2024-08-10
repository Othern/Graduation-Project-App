import { Alert } from "react-native";
import Toast from 'react-native-toast-message';
import * as Keychain from 'react-native-keychain';
//keychain 如果要在ios 用 要在 ios資料夾中運行 npx pod-install 
import AsyncStorage from '@react-native-async-storage/async-storage';
import { request, PERMISSIONS } from 'react-native-permissions';
import data from '../config.json';
const url = data['URl']
export const checkFastLoginSelection = async () => { //should use saveData to set 'FastLogin' to 'true'
    try {
        const value = await AsyncStorage.getItem('FastLogin');
        if (value) {
            return (value);
        }
        else {
            return ('false');
        }
    } catch (e) {
        console.log("error", e);
    }
};


export const showToast = (text1: string, text2: string, type = 'success') => {
    Toast.show({
        type: type,
        text1: text1,
        text2: text2,
        topOffset: 65
    });
}

export async function saveCredentials(email: string, password: string) {
    try {
        // 儲存Email和密碼
        await Keychain.setGenericPassword(email, password);
        console.log('Credentials saved successfully!');
    } catch (error) {
        console.error('Could not save credentials', error);
    }
}

export async function getCredentialsFromKeychain() {
    try {
        const credentials = await Keychain.getGenericPassword();
        if (credentials) {
            return { email: credentials.username, password: credentials.password };
        } else {
            console.log('No credentials stored');
            return null;
        }
    } catch (error) {
        console.error('Could not load credentials', error);
        return null;
    }
}

export const saveData = (key: any, value: any) => {
    try {
        AsyncStorage.setItem(key, value);
    } catch (e) {
        console.log("error", e);
    }
};

export const getDataJSON = async (key: any, success = (data: any) => { }) => {
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

export async function submitLogin(email: string, password: string, success = (data: any) => { }, fail = (data: any) => { }) {
    try {
        const response = await fetch(url+'loginSubmit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });
        const responseData = await response.json();
        if (responseData.state === "success") {
            success({
                headImg: responseData.headImg,
                username: responseData.username
            });
        } else {
            fail(responseData.state); // Pass state as error
            Alert.alert("登入失敗.");
        }
    } catch (error) {
        console.error('Error sending login data:', error);
    }
}

export async function submitRegister(email: string, password: string, username: string, success = (data: any) => { }, fail = (data: any) => { }) {
    try {
        const response = await fetch(url+'registerSubmit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password, username })
        });
        const responseData = await response.json();
        if (responseData.state === "success") {
            success({
                headImg: responseData.headImg,
            });
        } else {
            fail(responseData.state); // Pass state as error
            Alert.alert("註冊失敗.");
        }
    } catch (error) {
        console.error('Error sending Register data:', error);
    }
}
export const requestNotificationPermission = async () => {
  const result = await request(PERMISSIONS.ANDROID.POST_NOTIFICATIONS);
  // 处理结果
};