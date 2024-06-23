import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, Pressable, StyleSheet } from 'react-native';
import { NavigationContainer, getFocusedRouteNameFromRoute, DefaultTheme, DarkTheme } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

//已完成:s
//前端使用者介面
//代辦:
//1. stack tab
//2. 處理後端溝通
//3. 儲存帳戶資訊
const Stack = createStackNavigator();
const LoginAssociate = (props: any) => {
    const [showRegistration, setShowRegistration] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [usernameL, setUsernameL] = useState('');
    const [passwordL, setPasswordL] = useState('');


    const handleLogin = () => {
        // Implement login logic here
        console.log('Logging in with username:', usernameL, 'and password:', passwordL);
        props.navigation.push('tab', { From: 'login' })
    };

    const handleRegister = () => {
        // Implement registration logic here
        console.log('Registering with email:', email, 'username:', username, 'and password:', password);
        props.navigation.push('Home', { From: 'Login' })
    };

    const toggleRegistration = () => {
        setShowRegistration(!showRegistration);
        setUsername('');
        setPassword('');
        setEmail('');
        setUsernameL('');
        setPasswordL('');
    };

    return (
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
                        placeholder="Username"
                        placeholderTextColor="gray"
                        value={usernameL}
                        onChangeText={(text) => setUsernameL(text)}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Password"
                        placeholderTextColor="gray"
                        secureTextEntry={!showPassword}
                        value={passwordL}
                        onChangeText={(text) => setPasswordL(text)}
                    />
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
    );
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
        marginBottom: 20,
        color: '#000000',
        textAlign: 'center',
    },
    form: {
        width: 300,
    },
    input: {
        height: 45,
        margin: 12,
        padding: 10,
        borderWidth: 1,
        borderColor: 'gray',
        color: '#000000',
        fontSize: 20,

    },
    row: {
        paddingVertical: 10,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    pressable: {

        width: 140,
        height: 38,
        padding: 5,
        borderRadius: 5,
        borderWidth: 1,
        margin: 5,
    },
    pressableText: {
        textAlign: 'center',
        color: 'black',
        fontSize: 20,
    },
});

export default LoginAssociate;