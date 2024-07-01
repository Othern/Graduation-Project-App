import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, Pressable, StyleSheet } from 'react-native';
import { NavigationContainer, getFocusedRouteNameFromRoute, DefaultTheme, DarkTheme } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { submitLogin, submitRegister, showToast, saveCredentials, getCredentialsFromKeychain, saveData, getDataJSON } from "./function";

// //2. 處理後端溝通 測試範例:貼function response data中
// const loginReturndata = {
//     state: "success",
//     headImg: "",
//     username: "James",
// }
// // state = {"success","wrongEmail","wrongPassword"} -> 先找email 是否在資料庫或是否合法， 再對密碼在資料庫或是否合法
// // headimage: "" -> 頭像圖片地址 default是空或若使用預設圖片，則為預設圖片地址
// // username: "James" -> 用戶名 (因為登入是靠不能自己更改的email)
// const RegisterReturndata = {
//     state: "success",
//     headImg: "",
// }
// // state = {"success","wrongEmail","wrongUsername","wrongPassword"} -> 先找email 是否在資料庫或是否合法， 再對帳號是否在資料庫或是否合法， 在對密碼(是否合法)
// // headimage: "" -> 頭像圖片地址 default是空或若使用預設圖片，則為預設圖片地址


const Stack = createStackNavigator();
const LoginAssociate = (props: any) => {

    const [showRegistration, setShowRegistration] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [hint, setHint] = useState("");

    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const [emailL, setEmailL] = useState('');
    const [passwordL, setPasswordL] = useState('');
    //check whether already login before "登入資訊是否儲存"

    useEffect(() => {
        const logindata = getCredentialsFromKeychain();
        async function FastLogin() {
            const logdata = await logindata;
            if (logdata) {
                props.navigation.push('tab', { From: 'login' });
                // submitLogin(logdata.email, logdata.password, (data: any) => {
                //     // success = save the logindata that response on clint device also their password
                //     const usernameLS = data.username;
                //     const headImgLS = data.headImg;
                //     const UserData = JSON.stringify({ email:logdata.email, usernameLS, headImgLS });
                //     saveData('UserData', UserData);
                //     props.navigation.push('tab', { From: 'login' });
                // }, (data: any) => {
                //     // fail = show the reason (setHint)
                //     if (data.stat == 'wrongEmail') {
                //         setHint('該電子郵件未註冊');
                //     }
                //     else {
                //         setHint('密碼錯誤');
                //     }
                // })
            }
        }
        FastLogin();
    }, []);

    const handleLogin = () => {
        // Implement login logic here
        // submit email and password
        if (true) {
            saveCredentials(emailL, passwordL);
            const usernameLS = 'James';
            const headImgLS = '';
            const UserData = JSON.stringify({ email: emailL, username: usernameLS, headImg: headImgLS });
            saveData('UserData', UserData);
            setEmailL('');
            setPasswordL('');
            props.navigation.push('tab', { From: 'login' });//做為測試(由於伺服器未完成，待完成後取消)
        }
        else {
            submitLogin(emailL, passwordL, (data: any) => {
                // success = save the logindata that response on clint device also their password
                saveCredentials(emailL, passwordL);
                const usernameLS = data.username;
                const headImgLS = data.headImg;
                const UserData = JSON.stringify({ email: emailL, username: usernameLS, headImg: headImgLS });
                saveData('UserData', UserData);
                setEmailL('');
                setPasswordL('');
                props.navigation.push('tab', { From: 'login' });
            }, (data: any) => {
                // fail = show the reason (setHint)
                if (data.stat == 'wrongEmail') {
                    setHint('該電子郵件未註冊');
                }
                else {
                    setHint('密碼錯誤');
                }
            });
        }

    };

    const handleRegister = () => {
        // Implement registration logic here
        // submit email and password and username
        if (true) {
            saveCredentials(email, password);
            const headImgRS = '';
            const UserData = JSON.stringify({ email, username, headImg: headImgRS });
            saveData('UserData', UserData);
            setEmail('');
            setPassword('');
            setUsername('');
            props.navigation.push('tab', { From: 'login' });//做為測試(由於伺服器未完成，待完成後取消)
        }
        else {
            submitRegister(email, password, username, (data: any) => {
                // success = save the logindata that response on clint device also their password and also activate a toast message
                saveCredentials(email, password);
                const headImgRS = data.headImg;
                const UserData = JSON.stringify({ email, username, headImgRS });
                saveData('UserData', UserData);
                setEmail('');
                setPassword('');
                setUsername('');
                showToast('註冊成功.', '');
                props.navigation.push('tab', { From: 'login' });
            }, (data: any) => {
                // fail = show the reason (setHint)
                if (data.stat == 'wrongEmail') {
                    setHint('該電子郵件已註冊或格式錯誤');
                }
                else if (data.stat == 'wrongUsername') {
                    setHint('該用戶名已註冊或格式錯誤');
                }
                else {
                    setHint('密碼錯誤(非法格式)');
                }
            });
        }
    };

    const toggleRegistration = () => {
        setShowRegistration(!showRegistration);
        setUsername('');
        setPassword('');
        setEmail('');
        setEmailL('');
        setPasswordL('');
        setHint('');
    };

    return (
        (
            <View style={styles.container}>

                {showRegistration ? (
                    <View style={styles.form}>
                        <Text style={styles.title}>註冊帳號</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Email"
                            placeholderTextColor="gray"
                            value={email}
                            onChangeText={(text) => setEmail(text)}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Username"
                            placeholderTextColor="gray"
                            value={username}
                            onChangeText={(text) => setUsername(text)}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Password"
                            placeholderTextColor="gray"
                            secureTextEntry={!showPassword}
                            value={password}
                            onChangeText={(text) => setPassword(text)}
                        />
                        {
                            hint == "" ? (<Text style={styles.hintNormal}>輸入電子郵件、帳號名稱、密碼來註冊帳號</Text>) : (<Text style={styles.hintWarning}>{hint}</Text>)
                        }
                        <View style={styles.row}>
                            <Pressable onPress={toggleRegistration} style={({ pressed }) => [
                                styles.pressable,
                                {
                                    backgroundColor: pressed ? '#FFAF60' : 'orange',
                                    borderColor: pressed ? 'orange' : '#FFAF60',
                                }
                            ]}><Text style={styles.pressableText}>改為登入</Text>
                            </Pressable>
                            <Pressable onPress={handleRegister} style={({ pressed }) => [
                                styles.pressable,
                                {
                                    backgroundColor: pressed ? '#FFAF60' : 'orange',
                                    borderColor: pressed ? 'orange' : '#FFAF60',
                                }
                            ]}><Text style={styles.pressableText}>註冊</Text>
                            </Pressable>
                        </View>

                    </View>
                ) : (
                    <View style={styles.form}>
                        <Text style={styles.title}>登入</Text>

                        <TextInput
                            style={styles.input}
                            placeholder="Email"
                            placeholderTextColor="gray"
                            value={emailL}
                            onChangeText={(text) => setEmailL(text)}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Password"
                            placeholderTextColor="gray"
                            secureTextEntry={!showPassword}
                            value={passwordL}
                            onChangeText={(text) => setPasswordL(text)}
                        />
                        {
                            hint == "" ? (<Text style={styles.hintNormal}>輸入電子郵件、密碼來登入</Text>) : (<Text style={styles.hintWarning}>{hint}</Text>)
                        }
                        <View style={styles.row}>
                            <Pressable onPress={toggleRegistration} style={({ pressed }) => [
                                styles.pressable,
                                {
                                    backgroundColor: pressed ? '#FFAF60' : 'orange',
                                    borderColor: pressed ? 'orange' : '#FFAF60',
                                }
                            ]}><Text style={styles.pressableText}>改為註冊</Text>
                            </Pressable>
                            <Pressable onPress={handleLogin} style={({ pressed }) => [
                                styles.pressable,
                                {
                                    backgroundColor: pressed ? '#FFAF60' : 'orange',
                                    borderColor: pressed ? 'orange' : '#FFAF60',
                                }
                            ]}><Text style={styles.pressableText}>登入</Text>
                            </Pressable>
                        </View>

                    </View>
                )}
            </View>
        ));
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        marginBottom: 15,
        color: '#000000',
        textAlign: 'center',
    },
    form: {
        width: 300,
    },
    input: {
        height: 45,
        margin: 12,
        padding: 5,
        elevation:1,
        
        borderColor: 'gray',
        color: '#000000',
        backgroundColor:'white',
        fontSize: 20,
        borderRadius: 8,

    },
    row: {
        paddingVertical: 10,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    pressable: {
        elevation:1,
        width: 120,
        height: 45,
        padding: 5,
        borderRadius: 20,
        borderWidth: 1,
        margin: 5,
    },
    pressableText: {
        textAlign: 'center',
        color: 'white',
        fontWeight:'bold',
        fontSize: 20,
    },
    hintNormal: {
        fontSize: 15,
        color: '#6FB7B7',
        textAlign: 'center',
    },
    hintWarning: {
        fontSize: 15,
        color: '#B87070',
        textAlign: 'center',
    },
});

export default LoginAssociate;