// App.jsx
import Toast, { BaseToast, ErrorToast } from 'react-native-toast-message';
import { View,Text } from 'react-native';
/*
1. Create the config
*/
const toastConfig = {
  /* Overwrite 'success' type*/
  success: (props: any) => (
    <BaseToast
      {...props}
      style={{ borderLeftColor: '#4CAF50' , position: 'relative' }}
      contentContainerStyle={{ paddingHorizontal: 5 }}
      text1Style={{
        fontSize: 15,
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
  /* create a completely new type - `tomatoToast` */
};

export default ()=>(<Toast config={toastConfig}/>)