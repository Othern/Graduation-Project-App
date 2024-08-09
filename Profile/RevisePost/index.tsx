import React, { useState, useCallback } from "react";
import { View, StyleSheet, Pressable, TextInput, Image } from "react-native";
import { Text } from "react-native-paper";
import { ShowMediaLibrary, showToast, formReviseData, uploadToServer, getDataJSON } from './function';
import Video from "react-native-video"
import Icon from 'react-native-vector-icons/Ionicons';

export default function MediaUploader(props: any, { theme }: any) {
    const id = props.route.params.id
    const image = useState(props.route.params.image)
    const [contentUri, setContentUri] = useState(props.route.params.contentUri)
    const [desc, setDesc] = useState(props.route.params.desc)
    const [email, setEmail] = useState('');
    getDataJSON('UserData', (data) => {
        if (data) {
            setEmail(data.email);
        }
        else {
            console.log('Not login, login again')
        }
    });

    //Media 介面 定義 避免null 而不通過 ts 
    interface Media {
        uri: string;
        type?: string;
        fileName?: string;
    }

    const [media, setMedia] = useState<Media | null>(null);
    const [mediaURI, setMediaURI] = useState<string | null>(null);


    //選擇media 檔案
    const handleMedia = useCallback(() => {
        ShowMediaLibrary(
            (selectedMedia: Media) => {
                setMediaURI(selectedMedia.uri);
                setMedia(selectedMedia);
            },
            () => showToast("選取失敗", "請重試", "error")
        );
    }, []);

    //確認 (上傳並離開), 使用useCallback 的相依性，決定重新建構，確保變動時使用最新
    const handleConfirm = useCallback(async () => {
        const formData = formReviseData(media, id, desc, email);
        try {
            console.log(formData);
            //待後端完成連接@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
            await uploadToServer(formData); 
            showToast("修改成功", "");
            props.navigation.goBack();
        } catch (error) {
            showToast("修改失敗", error instanceof Error ? error.message : "未知錯誤", "error");
        }
    }, [media, mediaURI, desc, props.navigation]);


    return (
        <View style={styles.container}>
            <View style={styles.media}>
                <View>
                    {media && mediaURI ? (
                        media.type?.startsWith('image') ? (
                            <Image source={{ uri: mediaURI }} style={styles.mediaPreview} />
                        ) : (
                            <Video source={{ uri: mediaURI }} style={styles.mediaPreview} />
                        )
                    ) : (
                        image ? (
                            <Image source={{ uri: contentUri }} style={styles.mediaPreview} />
                        ) : (
                            <Video source={{ uri: contentUri }} style={styles.mediaPreview} />
                        )
                    )}
                </View>
                <Pressable
                    onPress={handleMedia}
                    style={({ pressed }) => [
                        styles.pressableMedia,
                        {
                            backgroundColor: pressed ? '#E0E0E0' : 'white',
                            borderColor: pressed ? 'white' : '#E0E0E0',
                        }
                    ]}>
                    <Icon name="images-outline" size={30} color="black" aria-label="上傳" />
                </Pressable>
            </View>

            <View style={styles.cate}>
            </View>

            <TextInput
                style={styles.input}
                placeholder="可於此輸入短文(100字內)"
                onChangeText={setDesc}
                value={desc}
                maxLength={100}
                multiline={true}
                numberOfLines={6}
                placeholderTextColor="#888888"
            />

            <View style={styles.ButtonContainerDone}>
                <Pressable
                    onPress={() => { props.navigation.pop() }}
                    style={({ pressed }) => [
                        styles.pressable,
                        {
                            opacity: pressed ? 0.8 : 1,
                            borderColor: '#FFBB77'
                        }
                    ]}>
                    <Text style={styles.pressableText}>取消</Text>
                </Pressable>
                <Pressable
                    onPress={handleConfirm}
                    style={({ pressed }) => [
                        styles.pressable,
                        {
                            opacity: pressed ? 0.8 : 1,
                            borderColor: '#FFBB77'
                        }
                    ]}>
                    <Text style={styles.pressableText}>更改</Text>
                </Pressable>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    media: {
        height: '40%',
        backgroundColor: '#E0E0E0',
        borderColor: '#D0D0D0',
        borderWidth: 1,
        justifyContent: 'center',
        alignContent: 'center',
    },
    mediaPreview: {
        height: '100%',
    },
    placeholderText: {
        fontSize: 24,
        textAlign: 'center',
        color: 'black',
    },
    cate: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        marginTop: '4%',
        height: '30%',
        marginBottom: '10%'
    },
    buttonHint: {
        fontSize: 16,
        textAlign: 'left',
    },
    ButtonContainerCate: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-between',
        marginBottom: '1%',
    },
    pressableCate: {
        padding: 7,
        borderRadius: 100,
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
        width: '49%',
    },
    pressableTextCate: {
        fontWeight: 'bold',
        fontSize: 24,
    },
    ButtonContainerDone: {
        flexDirection: 'row',
        alignContent: 'center',
        justifyContent: 'space-between',
        marginTop: '5%'
    },
    pressableMedia: {
        height: 50,
        width: 50,
        borderRadius: 25,
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        bottom: 10,
        right: 10,
    },
    pressable: {
        padding: 8,
        borderRadius: 100,
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',

        width: '30%',
        paddingHorizontal: 5
    },
    pressableText: {
        fontSize: 20,
    },
    input: {
        borderWidth: 1,
        borderColor: '#FFBB77',
        borderRadius: 5,
        fontSize: 16,
        height: 230,
        textAlignVertical: 'top',
        marginHorizontal: 10,
        backgroundColor: 'white',
        color: 'black',
    },
});