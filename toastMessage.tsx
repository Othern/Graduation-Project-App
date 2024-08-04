import Toast, {BaseToast, ErrorToast} from 'react-native-toast-message';
import {View, Text} from 'react-native';

export default ({theme}: any) => {
  const toastConfig = {
    /* Overwrite 'success' type*/
    success: (props: any) => (
      <BaseToast
        {...props}
        style={{borderLeftColor: '#4CAF50', position: 'relative'}}
        contentContainerStyle={{
          paddingHorizontal: 5,
          backgroundColor: theme === 'dark' ? '#4A4A4A' : 'white',
        }}
        text1Style={{
          fontSize: 15,
          color: theme === 'dark' ? 'white' : 'black',
          fontWeight: '400',
        }}
      />
    ),
    /* Overwrite 'error' type */
    error: (props: any) => (
      <ErrorToast
        {...props}
        text1Style={{
          fontSize: 17,
        }}
        text2Style={{
          fontSize: 15,
        }}
      />
    ),
    /* create a 'notification' type */
    notification: (props: any) => {
      // 計算 text2 的長度
      const text2Length = props.text2 ? props.text2.length : 0;
      const newLineCount = props.text2
        ? (props.text2.match(/\n/g) || []).length
        : 0;
      const temp = (newLineCount + 1) * 18 + 50;

      // 根據文字數量調整大小
      const dynamicHeight = temp > 130 ? 130 : temp;
      return (
        <BaseToast
          {...props}
          style={{
            borderLeftColor: 'red',
            position: 'relative',
            height: dynamicHeight,
            borderTopRightRadius: 10,
            borderBottomRightRadius: 10,
          }}
          contentContainerStyle={{
            backgroundColor: theme === 'dark' ? '#4A4A4A' : 'white',
            padding: 10,
            borderTopRightRadius: 10,
            borderBottomRightRadius: 10,
          }}
          text1Style={{
            fontSize: 15,
            color: theme === 'dark' ? 'white' : 'black',
            fontWeight: '500',
            marginVertical: 10,
          }}
          text2Style={{
            fontSize: 13,
            color: theme === 'dark' ? 'white' : 'black',
            lineHeight: 18,
            marginBottom: 10,
          }}
          text2NumberOfLines={5}
        />
      );
    },
    /* create a 'forfun' type */
    forfun: (props: any) => (
      <BaseToast
        {...props}
        style={{
          borderLeftColor: '#B62619',
          position: 'relative',
          borderTopRightRadius: 10,
          borderBottomRightRadius: 10,
        }}
        contentContainerStyle={{
          borderTopRightRadius: 10,
          borderBottomRightRadius: 10,
          backgroundColor: theme === 'dark' ? '#4A4A4A' : 'white',
        }}
        text1Style={{
          fontSize: 13.5,
          color: theme === 'dark' ? 'white' : 'black',
          fontWeight: '400',
        }}
        text2Style={{
          fontSize: 11,

          color: theme === 'dark' ? 'white' : 'black',
        }}
      />
    ),
  };

  return <Toast config={toastConfig} />;
};
