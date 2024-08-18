import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  Pressable,
  StyleSheet,
} from 'react-native';
import {
  NavigationContainer,
  getFocusedRouteNameFromRoute,
  DefaultTheme,
  DarkTheme,
} from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import {
  submitLogin,
  submitRegister,
  showToast,
  saveCredentials,
  getCredentialsFromKeychain,
  saveData,
  getDataJSON,
  checkFastLoginSelection,
  requestNotificationPermission
} from './function';
import Icon from 'react-native-vector-icons/Ionicons';
import { Notify } from '../Function/Notify';
import BackgroundLocation from '../Function/BackgroundLocation';
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
const test = false
const Stack = createStackNavigator();
const LoginAssociate = (props: any) => {
  const [showRegistration, setShowRegistration] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [hint, setHint] = useState('');

  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [passwordCheck, setPasswordCheck] = useState('');

  const [emailL, setEmailL] = useState('');
  const [passwordL, setPasswordL] = useState('');
  //check whether already login before "登入資訊是否儲存"

  const [fast, setFast] = useState(false);
  const [waiting, setWaiting] = useState(true); //等待模式 (等server 反應)
  requestNotificationPermission()
  useEffect(() => {
    const logindata = getCredentialsFromKeychain();
    async function FastLogin() {
      const FLSelect = await checkFastLoginSelection();
      if (FLSelect === 'false') {
        setFast(false);
        setWaiting(false);
        return;
      } else {
        setFast(true);
      }

      const logdata = await logindata;
      if (logdata) {
        if (test) {
          // change the state to false if we have server on
          showToast('登入成功.', '');
          props.navigation.push('tab', { From: 'login' });
          //The problem that 徐 got about login fail and stuck in the page after login might because line 44 isn't be commented, or might be some other problems.
        } else {
          submitLogin(
            logdata.email,
            logdata.password,
            (data: any) => {
              // success = save the logindata that response on clint device also their password
              const usernameLS = data.username;
              const headImgLS = data.headImg;
              const UserData = JSON.stringify({
                email: logdata.email,
                username: usernameLS,
                headImg: headImgLS,
              });
              saveData('UserData', UserData);
              showToast('登入成功.', '');
              Notify();
              BackgroundLocation();
              props.navigation.push('tab', { From: 'login' });
            },
            (data: any) => {
              // fail = show the reason (setHint)
              if (data.stat == 'wrongEmail') {
                setHint('該電子郵件未註冊');
              } else {
                setHint('密碼錯誤');
              }
            },
          );
        }
      }
      setWaiting(false);
    }
    FastLogin();
  }, []);
  const handleFast = () => {
    if (fast) {
      saveData('FastLogin', 'false');
      setFast(false);
    } else {
      saveData('FastLogin', 'true');
      setFast(true);
    }
  };
  const handleLogin = () => {
    // Implement login logic here
    // submit email and password
    if (passwordL && emailL) {
    } else {
      setHint('有欄位未輸入');
      showToast('登入失敗.', '', 'error');
      return;
    }

    if (test) {
      //turn to false if server had been started
      saveCredentials(emailL, passwordL);
      const usernameLS = 'James';
      const headImgLS = '';
      const UserData = JSON.stringify({
        email: emailL,
        username: usernameLS,
        headImg: headImgLS,
      });
      saveData('UserData', UserData);
      setEmailL('');
      setPasswordL('');
      setHint('');
      showToast('登入成功.', '');
      Notify();
      BackgroundLocation();
      props.navigation.push('tab', { From: 'login' }); //做為測試(由於伺服器未完成，待完成後取消)
    } else {
      submitLogin(
        emailL,
        passwordL,
        (data: any) => {
          // success = save the logindata that response on clint device also their password
          saveCredentials(emailL, passwordL);
          const usernameLS = data.username;
          const headImgLS = data.headImg;
          const UserData = JSON.stringify({
            email: emailL,
            username: usernameLS,
            headImg: headImgLS,
          });
          saveData('UserData', UserData);
          setEmailL('');
          setPasswordL('');
          setHint('');
          showToast('登入成功.', '');
          Notify();
          BackgroundLocation();
          props.navigation.push('tab', { From: 'login' });
        },
        (data: any) => {
          // fail = show the reason (setHint)
          if (data == 'wrongEmail') {
            setHint('該電子郵件未註冊');
            showToast('登入失敗.', '', 'error');
          } else {
            setHint('密碼錯誤');
            showToast('登入失敗.', '', 'error');
          }
        },
      );
    }
  };

  const handleRegister = () => {
    // Implement registration logic here
    // submit email and password and username
    if (password === passwordCheck) {
    } else {
      setHint('兩次輸入的密碼不相符');
      showToast('註冊失敗.', '', 'error');
      return;
    }

    if (password && email && username) {
    } else {
      setHint('有欄位未輸入');
      showToast('註冊失敗.', '', 'error');
      return;
    }

    if (test) {
      //turn to false if server had been started
      saveCredentials(email, password);
      const headImgRS = '';
      const UserData = JSON.stringify({ email, username, headImg: headImgRS });
      saveData('UserData', UserData);
      setEmail('');
      setPassword('');
      setPasswordCheck('');
      setUsername('');
      setHint('');
      showToast('註冊成功.', '');
      Notify();
      BackgroundLocation();
      props.navigation.push('tab', { From: 'login' }); //做為測試(由於伺服器未完成，待完成後取消)
    } else {
      submitRegister(
        email,
        password,
        username,
        (data: any) => {
          // success = save the logindata that response on clint device also their password and also activate a toast message
          saveCredentials(email, password);
          const headImgRS = data.headImg;
          const UserData = JSON.stringify({ email, username, headImgRS });
          saveData('UserData', UserData);
          setEmail('');
          setPassword('');
          setUsername('');
          setHint('');
          showToast('註冊成功.', '');
          Notify();
          BackgroundLocation();
          props.navigation.push('tab', { From: 'login' });
        },
        (data: any) => {
          // error = show the reason (setHint)
          if (data == 'wrongEmail') {
            setHint('該電子郵件已註冊或格式錯誤');
            showToast('註冊失敗.', '', 'error');
          } else if (data == 'wrongUsername') {
            setHint('該用戶名已註冊或格式錯誤');
            showToast('註冊失敗.', '', 'error');
          } else {
            setHint('密碼錯誤(非法格式)');
            showToast('註冊失敗.', '', 'error');
          }
        },
      );
    }
  };

  const toggleRegistration = () => {
    setShowRegistration(!showRegistration);
    setUsername('');
    setPassword('');
    setPasswordCheck('');
    setEmail('');
    setEmailL('');
    setPasswordL('');
    setHint('');
  };

  return waiting ? (
    <></>
  ) : (
    <View style={styles.container}>
      {showRegistration ? (
        <View style={styles.form}>
          <Text style={styles.title}>註冊帳號</Text>
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="gray"
            value={email}
            onChangeText={text => setEmail(text)}
          />
          <TextInput
            style={styles.input}
            placeholder="Username - Max Length 20"
            placeholderTextColor="gray"
            value={username}
            maxLength={20}
            onChangeText={text => setUsername(text)}
          />
          <TextInput
            style={styles.input}
            placeholder="Password - Max Length 20"
            placeholderTextColor="gray"
            secureTextEntry={!showPassword}
            value={password}
            maxLength={20}
            onChangeText={text => setPassword(text)}
          />
          <TextInput
            style={styles.input}
            placeholder="Enter Your Password Again"
            placeholderTextColor="gray"
            secureTextEntry={!showPassword}
            value={passwordCheck}
            maxLength={20}
            onChangeText={text => setPasswordCheck(text)}
          />

          {hint == '' ? (
            <Text style={styles.hintNormal}>
              輸入電子郵件、帳號名稱、密碼來註冊帳號
            </Text>
          ) : (
            <Text style={styles.hintWarning}>{hint}</Text>
          )}

          <View style={styles.row}>
            <Pressable
              onPress={toggleRegistration}
              style={({ pressed }) => [
                styles.pressable,
                {
                  opacity: pressed ? 0.8 : 1,
                  borderColor: '#FFBB77',
                },
              ]}>
              <Text style={styles.pressableText}>改為登入</Text>
            </Pressable>
            <Pressable
              onPress={handleRegister}
              style={({ pressed }) => [
                styles.pressable,
                {
                  opacity: pressed ? 0.8 : 1,
                  borderColor: '#FFBB77',
                },
              ]}>
              <Text style={styles.pressableText}>註冊</Text>
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
            onChangeText={text => setEmailL(text)}
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="gray"
            secureTextEntry={!showPassword}
            value={passwordL}
            maxLength={20}
            onChangeText={text => setPasswordL(text)}
          />

          {hint == '' ? (
            <Text style={styles.hintNormal}>輸入電子郵件、密碼來登入</Text>
          ) : (
            <Text style={styles.hintWarning}>{hint}</Text>
          )}

          <View style={styles.row}>
            <Pressable
              onPress={toggleRegistration}
              style={({ pressed }) => [
                styles.pressable,
                {
                  opacity: pressed ? 0.8 : 1,
                  borderColor: '#FFBB77',
                },
              ]}>
              <Text style={styles.pressableText}>改為註冊</Text>
            </Pressable>
            <Pressable
              onPress={handleLogin}
              style={({ pressed }) => [
                styles.pressable,
                {
                  opacity: pressed ? 0.8 : 1,
                  borderColor: '#FFBB77',
                },
              ]}>
              <Text style={styles.pressableText}>登入</Text>
            </Pressable>
          </View>
          <Pressable style={styles.row} onPress={handleFast}>
            {fast ? (
              <Icon name="checkbox-outline" size={25} aria-label="Selected" />
            ) : (
              <Icon name="square-outline" size={25} aria-label="Unselected" />
            )}
            <Text style={{ fontSize: 16 }}> 下次進入程式是否直接登入</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  form: {
    width: 300,
  },
  input: {
    height: 45,
    margin: 12,
    padding: 5,
    elevation: 1,

    borderColor: 'gray',
    color: '#000000',
    backgroundColor: 'white',
    fontSize: 20,
    borderRadius: 8,
  },
  row: {
    paddingTop: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pressable: {
    width: 120,
    height: 45,
    padding: 5,
    borderRadius: 20,
    borderWidth: 1,
    margin: 5,
  },
  pressableText: {
    textAlign: 'center',
    fontWeight: 'bold',
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
