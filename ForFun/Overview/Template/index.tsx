import { View, Text, Image, StyleSheet, FlatList, SafeAreaView, Animated, useColorScheme, ScrollView, Pressable, TouchableOpacity } from "react-native";
import React, { useState, useRef, useMemo, useCallback, useEffect } from 'react';
import { Card } from "react-native-paper";
import { reviceHeart } from "../../function";
import Icon from 'react-native-vector-icons/Ionicons';
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import Video, { VideoRef } from 'react-native-video';

const COMMENTDATA = [
  {
    id: 1,
    username: 'Alice',
    content: '這是一個很有幫助的帖子，感謝分享！❤️❤️❤️❤️❤️❤️',
    avatarUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSC28lvhB3X_P4cDQ17N2RQvttJRUYagluoPw&s',
    timestamp: '2024-07-02T08:30:00Z'
  },
  {
    id: 2,
    username: 'eromangasensei_1210',
    content: '我也遇到過類似的問題，這些建議真的很實用。',
    avatarUrl: 'https://steamuserimages-a.akamaihd.net/ugc/1651094778160293860/28F0B5713A2F4D69F937C017E49E2CD0AE719CE5/?imw=5000&imh=5000&ima=fit&impolicy=Letterbox&imcolor=%23000000&letterbox=false',
    timestamp: '2024-07-02T09:15:00Z'
  },
  {
    id: 3,
    username: 'Charlie',
    content: '我有一個疑問，能否解釋一下 useCallback 的具體使用場景？',
    avatarUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSC28lvhB3X_P4cDQ17N2RQvttJRUYagluoPw&s',
    timestamp: '2024-07-02T10:05:00Z'
  },
  {
    id: 4,
    username: 'GrayRat',
    content: '很詳細的講解，學到了很多，謝謝！',
    avatarUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRxeUFVL8Duz6mNlimoa_oyELM8wzmggFWrhA&s',
    timestamp: '2024-07-02T10:45:00Z'
  },
  {
    id: 5,
    username: 'Rem',
    content: '請問這個方法可以在大型項目中使用嗎？',
    avatarUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRN8CBMt-r2TFvNsYIf01Dd6QjEVkmWPwb-eQ&s',
    timestamp: '2024-07-02T11:30:00Z'
  },
  {
    id: 6,
    username: '三鷹アサ',
    content: '我只會做正確的事',
    avatarUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTpnobU2ifAGJ6doWR82Mrt-Cjih4-FKSBF1A&s',
    timestamp: '2024-07-02T12:00:00Z'
  }
];

const DATA = [
  {
    id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
    name: 'shelter_1022',
    description: '這種痛苦還要持續多久',
    avatarUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSC28lvhB3X_P4cDQ17N2RQvttJRUYagluoPw&s',
    image: true,
    contentUri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTreBuOexL-mU-nxKgDnvnXQfLFmar1NhcfJg&s',
    hearts: 100
  },
  {
    id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
    name: 'eromangasensei_1210',
    description: '歐尼醬什麼的最討厭了!\n歐尼醬什麼的最討厭了!\n歐尼醬什麼的最討厭了!\n歐尼醬什麼的最討厭了!\n歐尼醬什麼的最討厭了!\n歐尼醬什麼的最討厭了!\n歐尼醬什麼的最討厭了!',
    avatarUrl: 'https://steamuserimages-a.akamaihd.net/ugc/1651094778160293860/28F0B5713A2F4D69F937C017E49E2CD0AE719CE5/?imw=5000&imh=5000&ima=fit&impolicy=Letterbox&imcolor=%23000000&letterbox=false',
    image: true,
    contentUri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTreBuOexL-mU-nxKgDnvnXQfLFmar1NhcfJg&s',
    hearts: 50

  },
  {
    id: '58694a0f-3da1-471f-bd96-145571e29d72',
    name: 'Third Item',
    description: 'Hello Everyone.',
    avatarUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSC28lvhB3X_P4cDQ17N2RQvttJRUYagluoPw&s',
    image: false,
    contentUri: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    hearts: 10

  },
];

type ItemProps = { name: string, avatarUrl: string, description: string, image: boolean, contentUri: string, hearts: number, handleComment: any };

const Item = ({ name, avatarUrl, description, image, contentUri, hearts, handleComment }: ItemProps,) => {
  const theme = useColorScheme();
  const color = theme === "dark" ? "white" : "black";
  const [heart, setHeart] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const desc = (description).substring(0, 49)
  const moredesc = (description).substring(49)
  const videoRef = useRef<VideoRef>(null);
  const [muted, setMuted] = useState(true)
  const [paused, setPaused] = useState(true)
  return (
    <View style={styles.item}>

      <View style={{ height: 50, flexDirection: 'row', alignItems: 'center' }}>
        <Image source={{ uri: avatarUrl }} style={styles.avatar} />
        <Text style={[styles.name, { color: color }]}>{name}</Text>

      </View>
      <View style={{ marginBottom: 10 }}>
        {image
          ?
          <Image source={{ uri: contentUri }} style={styles.content} /> :
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => {
              setPaused((prev) => (!prev))
            }}
          >
            <Video
              // Can be a URL or a local file.
              source={{ uri: contentUri }}
              ref={videoRef}
              muted={muted}
              paused={paused}
              style={{ height: 350, width: '100%' }}
              resizeMode="cover"
            />
            <Pressable style={{ position: 'absolute', left: 5, bottom: 5, backgroundColor: "gray", borderRadius: 20, height: 30, width: 30, justifyContent: 'center' }}
              onPress={() => {
                setMuted((prev) => !prev)

              }}
            >
              <Icon name={muted ? "volume-mute" : "volume-high"} size={20} style={{ alignSelf: "center" }} color="white" />
            </Pressable>
            <Pressable style={{ position: 'absolute', alignSelf: 'center', right: 5, bottom: 5, backgroundColor: "gray", borderRadius: 20, height: 30, width: 30, justifyContent: 'center' }}
              onPress={() => {
                setPaused((prev) => !prev)

              }}
            >
              <Icon name={paused ? "play" : "pause"} size={20} style={{ alignSelf: "center" }} color="white" />
            </Pressable>
          </TouchableOpacity>
        }

      </View>
      <View style={{ padding: 5 }} >
        <View style={{ flexDirection: "row", alignItems: 'center' }}>
          <Pressable
            onPress={() => {
              reviceHeart(heart, () => { setHeart((prev) => (!prev)) })

            }}>
            <Icon name={!heart ? "heart-outline" : "heart"} color={!heart ? color : 'red'} size={30} style={{ marginRight: 5 }} />
          </Pressable>
          <Text style={[styles.name, { color: color, marginRight: 10 }]}>{hearts}</Text>
          <Pressable onPress={() => { handleComment() }} style={{ position: "absolute", right: 10 }}>
            <Icon name="chatbubble-outline" color={color} size={28} style={{ marginRight: 5, marginBottom: 5 }} />
          </Pressable>
        </View>

        {(desc).length < 49 ?
          <View>
            <Text style={{ fontWeight: '500', color: color, fontSize: 16 }}>{desc}</Text>
          </View> :
          <View>
            {!showMore ?
              <View>
                <Text style={{ fontWeight: '500', color: color, fontSize: 16 }}>{desc}</Text>
                <Pressable onPress={() => { setShowMore((prev) => (!prev)) }}>
                  <Text style={{ fontWeight: '500', fontSize: 16 }}>顯示更多...</Text>
                </Pressable>
              </View> :
              <Text style={{ fontWeight: '500', color: color, fontSize: 16 }}>{desc}{moredesc}</Text>
            }

          </View>

        }

      </View>
    </View>
  )
};

type CommentItemProps = {
  id: number,
  username: string,
  content: string,
  avatarUrl: string,
  timestamp: string,
};

const CommentItem = ({ id, username, content, avatarUrl, timestamp }: CommentItemProps,) => {
  const theme = useColorScheme();
  const color = theme === "dark" ? "white" : "black";
  const [heart, setHeart] = useState(false);
  return (
    <View style={{ marginVertical: 10, padding: 10, flexDirection: 'row' }}>
      <Image source={{ uri: avatarUrl }} style={styles.avatar} />
      <View>
        <Text style={{ color: color, fontWeight: "500", marginBottom: 5, fontSize: 18, width: 320 }}>{username}</Text>
        <Text style={{ color: color, fontWeight: "500", width: 320 }}>{content}</Text>
      </View>
    </View>
  )
};

export default ({ kind, scrollY }: any) => {
  const theme = useColorScheme();
  const [postData, setPostData] = useState(DATA)
  const [commentData, setCommentData] = useState(COMMENTDATA)
  // 要使用Networking 取消quote，並要改成你的url
  // const getPostData = async () => {
  //     const Url = "http://172.20.10.2:4000//api/data/getPostData";
  //     try {
  //         const response = await fetch(Url)
  //             .then(response => response.json())
  //         setPostData(response)
  //     }
  //     catch (error) {
  //         console.error(error)
  //     }
  // const getCommentData = async (pid: string) => {
  //   const Url = "http://172.20.10.2:4000//api/data/getCommentData";
  //   try {
  //     const response = await fetch(Url, {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json'
  //       },
  //       body: JSON.stringify({ "pid": pid })
  //     }
  //     );
  //     setCommentData(response);
  //   } catch (error) {
  //     console.error(error)
  //   }
  // }
    const sheetRef = useRef<BottomSheet>(null);
    const snapPoints = useMemo(() => ["50%", "90%"], []);

    const handleSheetChange = useCallback((index: any) => {
      console.log("handleSheetChange", index);
    }, []);
    const handleSnapPress = useCallback((index: any) => {
      sheetRef.current?.snapToIndex(index);
    }, []);
    const handleClosePress = useCallback(() => {
      sheetRef.current?.close();
    }, []);
    return (
      <>
        <ScrollView
          style={{ flex: 1 }}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: false }
          )}
          scrollEventThrottle={16}>

          <View style={{ height: 80 }} />

          {postData.map((item, key) => (
            <Item name={item.name} avatarUrl={item.avatarUrl} description={item.description} image={item.image} contentUri={item.contentUri} hearts={item.hearts} key={key}
              handleComment={
                () => {
                  handleSnapPress(0);
                  //getCommentData(item.id);
                }} />
          ))}

        </ScrollView>

        <BottomSheet
          ref={sheetRef}
          index={-1}
          enablePanDownToClose
          snapPoints={snapPoints}
          onChange={handleSheetChange}
          backgroundStyle={[styles.commentContainer, { backgroundColor: theme === "dark" ? "#1C1C1E" : "white" }]}
        >
          <BottomSheetScrollView contentContainerStyle={{}}>
            {commentData.map((item, index) => (
              <CommentItem id={item.id} username={item.username} content={item.content} timestamp={item.timestamp} avatarUrl={item.avatarUrl} />
            ))}
          </BottomSheetScrollView>
        </BottomSheet>

      </>
    )
  }

  const styles = StyleSheet.create({
    item: {
      marginVertical: 10,
      padding: 10,
      flex: 1,

    },
    commentContainer: {
      backgroundColor: 'gray'
    },
    textContainer: {
      flex: 1,
      justifyContent: 'center', // 垂直居中对齐
    },
    flexContainer: {
      flex: 3,
    },
    name: {
      fontSize: 16,

      fontWeight: 'bold',
    },
    avatar: {
      width: 40,
      height: 40,
      borderRadius: 20,
      marginRight: 10,
    },
    content: {
      width: "100%",
      height: 350

    }
  });