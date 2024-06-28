// App.jsx
import Toast, { BaseToast, ErrorToast } from 'react-native-toast-message';
import { View,Text } from 'react-native';
/*
1. Create the config
*/


export default ({theme}:any)=>{
  const toastConfig = {
    /* Overwrite 'success' type*/
    success: (props: any) => (
      <BaseToast 
        {...props}
        style={{ borderLeftColor: '#4CAF50' , position: 'relative' }}
        contentContainerStyle={{
          paddingHorizontal: 5 ,
          backgroundColor: theme === 'dark' ? "#4A4A4A" :"white"
          }}
        text1Style={{
          fontSize: 15,
          color: theme === 'dark' ? "white" :"black",
          fontWeight: '400'
        }}
      />
    ),
    /* Overwrite 'error' type */
    error: (props :any) => (
      <ErrorToast
        {...props}
        text1Style={{
          fontSize: 17
        }}
        text2Style={{
          fontSize: 15
        }}
      />
    ),
    /* create a 'notification' type */
    notification: (props: any) => (
      <BaseToast 
        {...props}
        style={{ borderLeftColor: 'red' , position: 'relative' }}
        contentContainerStyle={{
          
          
          backgroundColor: theme === 'dark' ? "#4A4A4A" :"white"
          }}
        text1Style={{
          fontSize: 15,
          color: theme === 'dark' ? "white" :"black",
          fontWeight: '400'
        }}
        text2Style={{
          fontSize: 11,
          
          color: theme === 'dark' ? "white" :"black",
          
        }}
      />
    ),
    /* create a 'forfun' type */
    forfun: (props: any) => (
      <BaseToast 
        {...props}
        style={{ borderLeftColor: '#B62619' , position: 'relative',
          borderTopRightRadius:10,
          borderBottomRightRadius:10,}}
        contentContainerStyle={{
          borderTopRightRadius:10,
          borderBottomRightRadius:10,
          backgroundColor: theme === 'dark' ? "#4A4A4A" :"white"
          }}
        text1Style={{
          fontSize: 13.5,
          color: theme === 'dark' ? "white" :"black",
          fontWeight: '400'
        }}
        text2Style={{
          fontSize: 11,
          
          color: theme === 'dark' ? "white" :"black",
          
        }}
      />
    ),
    
  };

  return (<Toast config={toastConfig}/>)
}