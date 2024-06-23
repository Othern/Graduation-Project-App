import { Alert } from "react-native";
import Toast from 'react-native-toast-message';
import { launchImageLibrary } from "react-native-image-picker";

//Submit Report
export async function submit(data: any, success = () => { }, fail = () => { }) {
    try {
        const response = await fetch('http://172.20.10.2:4000/reportSubmit', {
            method: 'POST',
            headers: {
                'Content-Type': 'multipart/form-data'
            },
            body: data
        }).then(response => response.json());
        if (response.success == 1) {
            success();
        } else {
            fail();
            Alert.alert("Submission failed.");
        }
    } catch (error) {
        console.error('Error sending data:', error);
    }
}
type BodyType = {
    [key: string]: any
};
//Turn submission data to Form Data
export const createFormData = (body: BodyType = {}) => {
    const data = new FormData();
    Object.keys(body).forEach((key) => {
        const value = body[key];
        if (key == 'photo') {
            data.append(key, {
                name: value?.fileName,
                type: value?.type,
                uri: value?.uri
            });

        }
        else
            data.append(key, value.toString());

    });
    return data;
};

export const showToast = (text1: string, text2: string, type = 'success') => {
    Toast.show({
        type: type,
        text1: text1,
        text2: text2,
        topOffset: 65
    });
}

export const ShowImageLibrary = async (success = (image:any) => { }, fail = () => { }) => {
    await launchImageLibrary({ mediaType: 'photo' }, (response) => {
        if (response.didCancel) {
            console.log('User cancelled image picker');

        } else if (response.errorMessage) {
            console.log('Image picker error: ', response.errorMessage);

        } else {
            let image = response.assets?.[0];
            if (image?.uri == undefined) {
                fail();
                
            }
            else {
                success(image);
                
            }
        }
    });
}