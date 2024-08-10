import {
  View,
  Text,
  Image,
  StyleSheet,
  FlatList,
  Animated,
  useColorScheme,
  Pressable,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  TouchableWithoutFeedback,
  RefreshControl,
} from 'react-native';
import React, {useState, useRef, useMemo, useCallback, useEffect} from 'react';
import {Card} from 'react-native-paper';
import Icon from 'react-native-vector-icons/Ionicons';
import {getPostData, deletePost, POSTDATA} from './function';
import Video, {VideoRef} from 'react-native-video';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import AlertDelete from './AlertDelete';
import CommentSection from '../../Comment';
const fullBanana = '../../asset/fullBanana.png';

type ItemProps = {
  id: string;
  description: string;
  image: boolean;
  contentUri: string;
  hearts: number;
  like: boolean;
  viewable: boolean;
  handleDelete: any;
  handleComment: any;
  handleRevise: any;
};

const Item = ({
  id,
  description,
  image,
  contentUri,
  hearts,
  viewable,
  handleDelete,
  handleComment,
  handleRevise,
}: ItemProps) => {
  const theme = useColorScheme();
  const color = theme === 'dark' ? 'white' : 'black';
  const [heartNum, setHeartNum] = useState(hearts);
  const [showMore, setShowMore] = useState(false);
  const desc = description.substring(0, 49);
  const moredesc = description.substring(49);
  const videoRef = useRef<VideoRef>(null);
  const [muted, setMuted] = useState(true);
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    setPaused(!viewable);
    setMuted(!viewable);
  }, [viewable]);
  return (
    <View style={styles.item}>
      <View style={{height: 45, alignItems: 'center'}}>
        <Pressable
          onPress={() => {
            handleDelete();
          }}
          style={{
            height: 35,
            width: 35,
            position: 'absolute',
            right: 5,
            borderRadius: 5,
            backgroundColor: 'red',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Icon name={'close'} color={'white'} size={30} />
        </Pressable>
      </View>
      <View style={{marginBottom: 10}}>
        {image ? (
          <Image source={{uri: contentUri}} style={styles.content} />
        ) : (
          <TouchableOpacity
            activeOpacity={1}
            touchSoundDisabled={true}
            onPress={() => {
              setPaused(prev => !prev);
            }}>
            <Video
              // Can be a URL or a local file.
              source={{uri: contentUri}}
              ref={videoRef}
              muted={muted}
              paused={paused}
              style={{height: 350, width: '100%'}}
              resizeMode="cover"
            />
            <Pressable
              style={{
                position: 'absolute',
                left: 5,
                bottom: 5,
                backgroundColor: 'gray',
                borderRadius: 20,
                height: 30,
                width: 30,
                justifyContent: 'center',
              }}
              onPress={() => {
                setMuted(prev => !prev);
              }}>
              <Icon
                name={muted ? 'volume-mute' : 'volume-high'}
                size={20}
                style={{alignSelf: 'center'}}
                color="white"
              />
            </Pressable>
            <Pressable
              style={{
                position: 'absolute',
                alignSelf: 'center',
                right: 5,
                bottom: 5,
                backgroundColor: 'gray',
                borderRadius: 20,
                height: 30,
                width: 30,
                justifyContent: 'center',
              }}
              onPress={() => {
                setPaused(prev => !prev);
              }}>
              <Icon
                name={paused ? 'play' : 'pause'}
                size={20}
                style={{alignSelf: 'center'}}
                color="white"
              />
            </Pressable>
          </TouchableOpacity>
        )}
      </View>
      <View style={{padding: 5}}>
        <View style={{flexDirection: 'row', marginBottom: 5}}>
          {desc.length < 49 ? (
            <View>
              <Text style={{fontWeight: '500', color: color, fontSize: 16}}>
                {desc}
              </Text>
            </View>
          ) : (
            <View>
              {!showMore ? (
                <View>
                  <Text style={{fontWeight: '500', color: color, fontSize: 16}}>
                    {desc}
                  </Text>
                  <Pressable
                    onPress={() => {
                      setShowMore(prev => !prev);
                    }}>
                    <Text style={{fontWeight: '500', fontSize: 16}}>
                      顯示更多...
                    </Text>
                  </Pressable>
                </View>
              ) : (
                <Text style={{fontWeight: '500', color: color, fontSize: 16}}>
                  {desc}
                  {moredesc}
                </Text>
              )}
            </View>
          )}
          <View
            style={{
              position: 'absolute',
              right: 0,
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <Image
              source={require(fullBanana)}
              style={{height: 30, width: 30, marginRight: 5}}
            />
            <Text style={[{color: color, fontSize: 15, marginRight: 10}]}>
              {heartNum}
            </Text>
            <Pressable
              onPress={() => {
                handleComment();
              }}
              style={{marginRight: 10}}>
              <Icon
                name="chatbubble-outline"
                color={color}
                size={28}
                style={{}}
              />
            </Pressable>
            <Pressable
              onPress={() => {
                handleRevise();
              }}
              style={{marginRight: 10}}>
              <Icon name="hammer-outline" color={color} size={28} style={{}} />
            </Pressable>
          </View>
        </View>
      </View>
    </View>
  );
};

export default (props: any, {kind}: any) => {
  const theme = useColorScheme();
  const [postData, setPostData] = useState(POSTDATA);
  const [moreData, setMoreData] = useState(POSTDATA);
  const [focusPostId, setFocusPostId] = useState('');
  const [page, setPage] = useState(1);
  const [isVisible, setIsVisible] = useState(false);

  // 設定警告
  const [showDeleteWarning, setShowDeleteWarning] = useState(false);
  const [deletePostId, setDeletePostId] = useState('');

  //先將loading設為false，若是後端完成後要設為true
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    getPostData(setPostData, kind, page);
    setLoading(false);
  }, []);
  const isFocused = useIsFocused();
  const [isRefreshing, setIsRefreshing] = useState(false);
  // 設定當前觀看的item是哪一個
  const [viewItem, setViewItem] = useState(0);
  // for item focus
  const viewabilityConfig = {
    itemVisiblePercentThreshold: 70, // Percentage of item that needs to be visible to consider it "in view"
  };
  // 當目前觀看的item改變時
  const onViewableItemsChanged = useCallback(({viewableItems}: any) => {
    viewableItems.forEach((item: any) => {
      setViewItem(item.index);
    });
  }, []);
  const loadMoreData = useCallback(() => {
    if (!loading) {
      setLoading(true);
      // 調用getpostdata 來獲取更多數據，如果寫好則可以替代下面兩行
      // getPostData(setMoreData,page + 1, kind)
      // setPostData((prev)=>[...prev,...MoreData])
      setMoreData(POSTDATA);
      setPostData(prev => [...prev, ...prev]);
      setLoading(false);
    }
  }, [page, kind, loading]);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      await getPostData(setPostData, kind, page);
    } catch (error) {
      console.error('Error fetching new data:', error);
    } finally {
      setIsRefreshing(false);
    }
  }, [kind, page]);
  useEffect(() => {
    if (isFocused) {
      handleRefresh();
    }
  }, [isFocused, handleRefresh]);
  if (loading) {
    return <Text style={{alignSelf: 'center'}}>loading...</Text>;
  } else {
    return (
      <>
        <AlertDelete
          showDeleteWarning={showDeleteWarning}
          setShowDeleteWarning={setShowDeleteWarning}
          onConfirmDelete={async () => {
            await deletePost(deletePostId);
            await getPostData(setPostData, kind, page);
          }}
        />
        <FlatList
          data={postData}
          renderItem={({item, index}) => {
            let viewable = false;
            if (viewItem == index && isFocused == true) {
              viewable = true;
            }

            return (
              <Item
                id={item.id}
                description={item.description}
                image={item.image}
                contentUri={item.contentUri}
                hearts={item.hearts}
                like={item.like}
                key={index}
                viewable={viewable}
                handleDelete={() => {
                  setShowDeleteWarning(prev => !prev);
                  setDeletePostId(item.id);
                }}
                handleComment={() => {
                  setIsVisible(true);
                  setFocusPostId(item.id);
                }}
                handleRevise={() => {
                  props.navigation.push('reviseMyPost', {
                    id: item.id,
                    contentUri: item.contentUri,
                    desc: item.description,
                    image: item.image,
                  });
                }}
              />
            );
          }}
          keyExtractor={(item, index) => index.toString()}
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={viewabilityConfig}
          // onEndReached={loadMoreData}
          // onEndReachedThreshold={1}
          // ListFooterComponent={loading ? <Text style={{ alignSelf: "center", padding: 10 }}>載入中...</Text> : null}
          ListEmptyComponent={
            <View
              style={{alignItems: 'center', justifyContent: 'center', flex: 1}}>
              <Text
                style={{fontSize: 18, fontWeight: 'bold', textAlign: 'center',marginTop: 20}}>
                目前沒有文章,快來新增一篇吧!
              </Text>
            </View>
          }
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
              tintColor={theme === 'dark' ? 'white' : 'black'}
            />
          }
        />
        <CommentSection
          isVisible={isVisible}
          setIsVisible={setIsVisible}
          focusPostId={focusPostId}
        />
      </>
    );
  }
};

const styles = StyleSheet.create({
  item: {
    marginVertical: 10,
    padding: 10,
    flex: 1,
    elevation: 2,
    borderWidth: 0.001,
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
    width: '100%',
    height: 350,
  },
});
