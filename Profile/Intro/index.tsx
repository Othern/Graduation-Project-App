import React, { useState, useRef, useEffect } from 'react';
import AppIntroSlider from 'react-native-app-intro-slider';
import { View, Text, Image, StyleSheet, Pressable, Modal, TouchableWithoutFeedback } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
const slides = [
    {
        key: 'sh1',
        title: '系統介紹: 首頁 - 地圖',
        text: '這個地圖會顯示最近各個通報獼猴出沒的位置，可以透過1號紅框中的按鈕來控制被通報的獼猴位置是否在地圖上顯示。',
        image: require('../../asset/introduction/system/home.png'),
        backgroundColor: '#D6D6AD',
        noModal: 'false',
    },
    {
        key: 'sh2',
        title: '系統介紹: 首頁 - 通報',
        text: '如果您發現您周圍有猴猴出現，請使用2號紅框中的鈴鐺通報，幫助大家了解猴猴蹤跡。',
        image: require('../../asset/introduction/system/home.png'),
        backgroundColor: '#D6D6AD',
        noModal: 'false',
    },
    {
        key: 'sh3',
        title: '系統介紹: 首頁 - 通報',
        text: '這個頁面中可以填寫猴猴資訊，以及上傳或拍攝圖片，提供越詳細準確的資料會幫助我們能夠更準確的發現定位猴猴。',
        image: require('../../asset/introduction/system/report.png'),
        backgroundColor: '#D6D6AD',
        noModal: 'false',
    },
    {
        key: 'sh4',
        title: '系統介紹: 首頁 - 功能列',
        text: '3號紅框中是此系統其他功能分別是:ForFun猴猴短影音功能、Predict預測猴猴功能、以及個人頁面在',
        image: require('../../asset/introduction/system/home.png'),
        backgroundColor: '#D6D6AD',
        noModal: 'false',
    },
    {
        key: 'sf1',
        title: '系統介紹: 猴猴短影音 - 介紹',
        text: '這個頁面可以分享有關猴猴的可愛逗趣的短片或照片，並且可以餐與人氣投票(可愛或好笑)的機制,讓大家選出最喜歡的貼文，獲勝者還可以獲得獨特稱號',
        image: require('../../asset/introduction/system/forfun.png'),
        backgroundColor: '#AFAF61',
        noModal: 'false',
    },
    {
        key: 'sf2',
        title: '系統介紹: 猴猴短影音 - 主要',
        text: '1號紅框分別是可以查看過去人氣投票比賽的前三名，調整使用獲得的稱號，以及領取每日用來給貼文投票的香蕉',
        image: require('../../asset/introduction/system/forfun.png'),
        backgroundColor: '#AFAF61',
        noModal: 'false',
    },
    {
        key: 'sf3',
        title: '系統介紹: 猴猴短影音 - 主要',
        text: '2號紅框則是可以查看這屆人氣投票的貼文，分別是最新貼文，可愛類貼文，好笑類貼文',
        image: require('../../asset/introduction/system/forfun.png'),
        backgroundColor: '#AFAF61',
        noModal: 'false',
    },
    {
        key: 'sf4',
        title: '系統介紹: 猴猴短影音 - 主要',
        text: '3號紅框是可以查看貼文的留言或給予留言，4號紅框是投票按鈕，5號紅框是則是新增一篇貼文',
        image: require('../../asset/introduction/system/forfun.png'),
        backgroundColor: '#AFAF61',
        noModal: 'false',
    },
    {
        key: 'sf5',
        title: '系統介紹: 猴猴短影音 - 發布',
        text: '這是發佈貼文的頁面，1號紅框是選擇圖片或影音，2號則是選擇想要參加的投票類別。',
        image: require('../../asset/introduction/system/uploadPost.png'),
        backgroundColor: '#AFAF61',
        noModal: 'false',
    },
    {
        key: 'spre1',
        title: '系統介紹: 預測 - 主要',
        text: '這個頁面可以看到猴猴常見地點可能出現的猴猴數量，其中的單元也可以點開看一天之中各個時間的預測數量',
        image: require('../../asset/introduction/system/predict.png'),
        backgroundColor: '#6FB7B7',
        noModal: 'false',
    },
    {
        key: 'spre2',
        title: '系統介紹: 預測 - 細部',
        text: '點開剛才的單元後可以看到該地點一天之中各個時間的預測數量，其中的紅框是可以左右移動，查看各時間可能的的變化',
        image: require('../../asset/introduction/system/predictDetail.png'),
        backgroundColor: '#6FB7B7',
        noModal: 'false',
    },
    {
        key: 'spro1',
        title: '系統介紹: 個人 - 主要',
        text: '這個頁面可以點選修改帳號資訊，確認開啟手機權限，修改在猴猴短影音中發布的Post，以及開啟這個介紹',
        image: require('../../asset/introduction/system/profile.png'),
        backgroundColor: '#B87070',
        noModal: 'false',
    },
    {
        key: 'spro2',
        title: '系統介紹: 個人 - Mypost',
        text: '這個頁面可以修改在猴猴短影音中發布的Post，1號紅框是刪除該貼文，會連該貼文的留言一起刪除，2號紅框則是修改貼文，調整貼文內容。',
        image: require('../../asset/introduction/system/mypost.png'),
        backgroundColor: '#B87070',
        noModal: 'false',
    },
];

const IntroSlider = (props: any) => {
    const [openModalIndex, setOpenModalIndex] = useState<number | null>(0);
    const sliderRef = useRef<any>(null);

    useEffect(() => {
        // Automatically open the modal when slide changes
        if (openModalIndex !== null) {
            setOpenModalIndex(openModalIndex);
        }
    }, [openModalIndex]);

    const renderItem = ({ item, index }: any) => (
        <View style={[styles.slide, { backgroundColor: item.backgroundColor }]}>

            {item.noModal !== 'true' && (<Text style={styles.text}>點擊畫面以開啟說明</Text>)}
            <Pressable
                onPress={() => item.noModal !== 'true' && setOpenModalIndex(index)}
                style={styles.imageP}
            >
                <Text style={styles.titleO}>{item.title}</Text>
                <Image source={item.image} style={styles.image} />
            </Pressable>

            {item.noModal !== 'true' && (
                <Modal
                    visible={openModalIndex === index}
                    transparent={true}
                    onRequestClose={() => setOpenModalIndex(null)}
                >
                    <View style={styles.modalBackground}>
                        <View style={styles.modalContainer}>
                            <View style={styles.modalHeader}>
                                <Text style={styles.title}>{item.title}</Text>
                                <Pressable onPress={() => setOpenModalIndex(null)} style={styles.closeButton}>
                                    <Icon name="close-outline" size={28} color="black"></Icon>
                                </Pressable>
                            </View>


                            <Text style={styles.text}>{item.text}</Text>

                        </View>
                    </View>
                </Modal>
            )}
        </View>
    );

    const goToOtherSlide = (index: any) => { //for fast jump
        if (sliderRef.current) {
            sliderRef.current.goToSlide(index);
            setOpenModalIndex(index); // Automatically open the modal for the new slide
        }
    };

    const handleSlideChange = (index: number) => {
        setOpenModalIndex(index); // Automatically open the modal for the new slide
    };

    return (
        <View style={{ flex: 1 }}>
            <AppIntroSlider
                ref={sliderRef}
                renderItem={renderItem}
                data={slides}
                onDone={() => props.navigation.goBack()}
                onSlideChange={handleSlideChange}
            />
            <Pressable
                onPress={() => props.navigation.goBack()}
                style={styles.transparentButton}
                android_ripple={{ color: 'rgba(0, 0, 0, 0.1)', borderless: true }}
            >
                {({ pressed }) => (
                    <Text style={[styles.buttonText, { opacity: pressed ? 0.3 : 1 }]}>Close</Text>
                )}
            </Pressable>
        </View>
    );
};

const styles = StyleSheet.create({
    slide: {
        flex: 1,
        alignItems: 'center',
    },
    imageP: {
        width: 380,
        height: 600,
        alignItems: 'center',
    },
    image: {
        width: '100%',
        height: '90%',
        resizeMode: 'contain',
    },
    modalBackground: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContainer: {
        width: '90%',
        padding: 20,
        backgroundColor: 'white',
        borderRadius: 10,
        alignItems: 'center',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#642100'
    },
    titleO: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#642100',
        paddingTop: 10
    },
    text: {
        fontSize: 18,
        textAlign: 'left',
        color: '#A23400',

    },
    closeButton: {
        paddingLeft: 20,
        borderRadius: 50,
    },
    buttonText: {
        fontSize: 18,
        color: 'white',
    },
    modalHeader: {
        flexDirection: 'row',
        marginBottom: 10,
        justifyContent: 'space-around'
    },
    transparentButton: {
        position: 'absolute',
        bottom: 20,
        left: 0,
        right: 0,
        width: 60,
        alignSelf: 'center',
        marginTop: 20,
        paddingVertical: 10,
        marginHorizontal: 20,
        borderRadius: 8,
        borderWidth: 1,
    },
});

export default IntroSlider;