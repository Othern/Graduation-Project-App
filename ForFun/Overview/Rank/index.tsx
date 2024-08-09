import React, { useState, useRef, useMemo, useCallback, useEffect } from 'react';
import { TouchableWithoutFeedback, View, Text, Image, StyleSheet, FlatList, SafeAreaView, Animated, useColorScheme, ScrollView, Pressable, TouchableOpacity, KeyboardAvoidingView, Platform, TextInput, Modal } from "react-native";
import Icon from 'react-native-vector-icons/Ionicons';
import BottomSheet, { BottomSheetFlatList } from "@gorhom/bottom-sheet";
import { getPostData, getCommentData, COMMENTDATA, POSTDATA } from "./function";
import Video, { VideoRef } from 'react-native-video';

const fullBanana = '../../../asset/fullBanana.png';

type ItemProps = {
    id: string;
    name: string;
    mockTitle: string;
    avatarUrl: string;
    description: string;
    image: boolean;
    contentUri: string;
    hearts: number;
    like: boolean;
    viewable: boolean;
    handleComment: () => void;
    rank: number;
};

const RankingItem = ({ item, handleComment }: { item: ItemProps; handleComment: () => void }) => {


    return (
        <View style={[styles.itemContainer, { backgroundColor: item.rank == 1 ? '#FFFFDF' : (item.rank == 2 ? '#FCFCFC' : '#FFEEDD') }]}>
            <View style={styles.rowContainer}>
                <Image source={{ uri: item.avatarUrl }} style={styles.avatar} />
                <Text style={[styles.username]}>{item.name}  {item.mockTitle}</Text>
            </View>
            <View style={styles.contentContainer}>
                {item.image ? (
                    <Image source={{ uri: item.contentUri }} style={styles.contentImage} />
                ) : (
                    <Video
                        source={{ uri: item.contentUri }}
                        style={styles.contentVideo}
                        resizeMode="cover"
                        paused={!item.viewable}
                    />
                )}
                <View style={styles.interactionContainer}>
                    <Pressable onPress={handleComment} style={{ marginRight: 10 }}>
                        <Icon name="chatbubble-outline" size={28} color={'black'} />
                    </Pressable>

                    <Image
                        source={require(fullBanana)}
                        style={styles.bananaIcon}
                    />

                    <Text style={[styles.heartsCount]}>{item.hearts}</Text>
                </View>
                <Text style={[styles.description]}>{item.description}</Text>
            </View>
        </View>
    );
};

export default ({ visible, onClose }: { visible: boolean; onClose: () => void }) => {
    const [maxYear, setMaxYear] = useState(0);
    const [currentYear, setCurrentYear] = useState(0);
    const [category, setCategory] = useState<'cute' | 'funny'>('cute');
    const [rankings, setRankings] = useState<ItemProps[]>([]);
    const [commentData, setCommentData] = useState(COMMENTDATA);
    const [isVisible, setIsVisible] = useState(false);

    const sheetRef = useRef<BottomSheet>(null);
    const snapPoints = useMemo(() => ['60%'], []);

    useEffect(() => {
        fetchData(0, category);
    }, []);
    useEffect(() => {
        if (maxYear !== 0) {
            setCurrentYear(maxYear);
        }
    }, [maxYear]);
    const fetchData = async (year: number, cat: string) => {
        try {
            getPostData(setRankings, setMaxYear, year, cat);

        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    const handleYearChange = (direction: 'prev' | 'next') => {
        const newYear = direction === 'prev' ? currentYear - 1 : currentYear + 1;
        if (newYear > 0 && newYear <= maxYear) {
            setCurrentYear(newYear);
            fetchData(newYear, category);
        }
    };

    const handleCategoryChange = (newCategory: 'cute' | 'funny') => {
        setCategory(newCategory);
        fetchData(currentYear, newCategory);
    };

    const handleComment = useCallback((postId: string) => {
        sheetRef.current?.snapToIndex(0);
        getCommentData(setCommentData, (postId))
        setIsVisible(true)
    }, []);
    const handleCloseComment = () => {
        sheetRef.current?.close();
        setIsVisible(false);
    };
    return (
        <Modal
            animationType="slide"
            transparent={false}
            visible={visible}
            onRequestClose={onClose}
        >
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.mockTitle}>歷屆排行榜</Text>
                    <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                        <Icon name="close" size={24} color="black" />
                    </TouchableOpacity>
                </View>
                <View style={styles.rowContainer}>


                    <View style={styles.yearSelector}>
                        <TouchableOpacity onPress={() => handleYearChange('prev')}>
                            <Icon name="chevron-back" size={24} color="black" />
                        </TouchableOpacity>
                        <Text style={styles.yearText}>第 {currentYear} 屆</Text>
                        <TouchableOpacity onPress={() => handleYearChange('next')}>
                            <Icon name="chevron-forward" size={24} color="black" />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.categorySelector}>
                        <Pressable
                            style={[styles.categoryButton, category === 'cute' && styles.selectedCategory]}
                            onPress={() => handleCategoryChange('cute')}
                        >
                            <Text style={styles.categoryText}>Cute</Text>
                        </Pressable>
                        <Pressable
                            style={[styles.categoryButton, category === 'funny' && styles.selectedCategory]}
                            onPress={() => handleCategoryChange('funny')}
                        >
                            <Text style={styles.categoryText}>Funny</Text>
                        </Pressable>
                    </View>
                </View>
                <FlatList
                    data={rankings.slice(0, 3)}
                    renderItem={({ item, index }) => (
                        <RankingItem
                            item={{ ...item, rank: index + 1, viewable: true }}
                            handleComment={() => handleComment(item.id)}
                        />
                    )}
                    keyExtractor={(item) => item.id}
                />

                {isVisible && (
                    <TouchableWithoutFeedback onPress={handleCloseComment}>
                        <View style={styles.overlay} />
                    </TouchableWithoutFeedback>
                )}
                <BottomSheet
                    ref={sheetRef}
                    index={-1}
                    enablePanDownToClose={true}
                    snapPoints={snapPoints}
                    backgroundStyle={styles.commentContainer}
                >
                    <KeyboardAvoidingView
                        behavior={Platform.OS === "ios" ? "padding" : "height"}
                        style={{ flex: 1 }}
                    >

                        <BottomSheetFlatList
                            data={commentData}
                            ListHeaderComponent={<View style={{ height: 10 }}></View>}
                            keyExtractor={(item) => item.id.toString()}
                            renderItem={({ item }) => (
                                <View style={styles.commentItem}>
                                    <Image source={{ uri: item.avatarUrl }} style={styles.commentAvatar} />
                                    <View>
                                        <Text style={styles.commentUsername}>{item.username} {item.mockTitle}</Text>
                                        <Text style={styles.commentContent}>{item.content}</Text>
                                    </View>
                                </View>
                            )}
                        />
                    </KeyboardAvoidingView>
                </BottomSheet>

            </SafeAreaView>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FBFBFF',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
    },
    mockTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'black',
    },
    closeButton: {
        padding: 5,
    },
    yearSelector: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
    },
    yearText: {
        fontSize: 18,
        fontWeight: 'bold',
        marginHorizontal: 10,
        color: 'black',
    },
    categorySelector: {
        flexDirection: 'row',
        justifyContent: 'center',
        padding: 10,
    },
    categoryButton: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        marginLeft: 20,
        borderRadius: 20,
        marginHorizontal: 5,
        backgroundColor: '#f0f0f0',
    },
    selectedCategory: {
        backgroundColor: '#FFF0AC',
    },
    categoryText: {
        fontSize: 16,
        color: 'black',
    },
    itemContainer: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    rowContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 5,
    },
    rankText: {
        fontSize: 18,
        fontWeight: 'bold',
        marginRight: 10,
        color: 'black',
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 10,
    },
    contentContainer: {
        flex: 1,
    },
    username: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'black',
    },
    description: {
        fontSize: 14,
        marginVertical: 5,
        color: 'black'
    },
    contentImage: {
        width: '100%',
        height: 200,
        resizeMode: 'cover',
        borderRadius: 10,
        marginVertical: 5,
        backgroundColor: 'white',
    },
    contentVideo: {
        width: '100%',
        height: 200,
        borderRadius: 10,
        marginVertical: 5,
    },
    interactionContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 5,
    },
    bananaIcon: {
        width: 30,
        height: 30,
        marginRight: 10,
    },
    heartsCount: {
        fontSize: 14,
        color: 'black'
    },
    commentContainer: {
        backgroundColor: 'white',
    },
    commentItem: {
        flexDirection: 'row',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    commentAvatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 10,
        backgroundColor: 'white',
    },
    commentUsername: {
        fontWeight: "500",
        marginBottom: 5,
        fontSize: 18,
        width: 320,
        color: 'black'
    },
    commentContent: {
        fontWeight: "500",
        width: 320,
        color: 'black'
    },
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: '60%',
        backgroundColor: 'rgba(0, 0, 0, 0.3)', // 半透明黑色背景
        zIndex: 0, // 確保覆蓋在底部視圖上
    }
});