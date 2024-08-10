// CommentSection.tsx
import React, {useRef, useMemo, useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  useColorScheme,
  Image,
} from 'react-native';
import BottomSheet, {BottomSheetFlatList} from '@gorhom/bottom-sheet';
import {sendComment, getCommentData, COMMENTDATA} from './function';
type CommentItemProps = {
  id: number;
  username: string;
  content: string;
  avatarUrl: string;
  mockTitle: string;
  timestamp: string;
};
const CommentItem = ({
  id,
  username,
  content,
  avatarUrl,
  mockTitle,
  timestamp,
}: CommentItemProps) => {
  const theme = useColorScheme();
  const color = theme === 'dark' ? 'white' : 'black';
  return (
    <View style={{marginVertical: 10, padding: 10, flexDirection: 'row'}}>
      <Image source={{uri: avatarUrl}} style={styles.avatar} />
      <View>
        <Text style={[styles.username, {color}]}>
          {username} {mockTitle}
        </Text>
        <Text style={[styles.content, {color}]}>{content}</Text>
      </View>
    </View>
  );
};

const CommentSection = ({isVisible, setIsVisible, focusPostId}: any) => {
  const theme = useColorScheme();
  const [commentData, setCommentData] = useState(COMMENTDATA);
  const [comment, setComment] = useState('');
  const sheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ['60%'], []);

  const handleCloseComment = () => {
    sheetRef.current?.close();
    setIsVisible(false);
  };

  const handleSnapPress = useCallback((index: any) => {
    sheetRef.current?.snapToIndex(index);
  }, []);

  useEffect(() => {
    if (isVisible) {
      handleSnapPress(0);
      getCommentData(setCommentData, focusPostId);
    }
  }, [isVisible, focusPostId]);

  return (
    <>
      {isVisible && (
        <TouchableWithoutFeedback onPress={handleCloseComment}>
          <View style={styles.overlay} />
        </TouchableWithoutFeedback>
      )}
      <BottomSheet
        ref={sheetRef}
        index={-1}
        enablePanDownToClose
        snapPoints={snapPoints}
        backgroundStyle={[
          styles.commentContainer,
          {backgroundColor: theme === 'dark' ? '#1C1C1E' : 'white'},
        ]}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{flex: 1}}>
          <BottomSheetFlatList
            data={commentData}
            ListHeaderComponent={<View style={{height: 60}} />}
            keyExtractor={item => item.id.toString()}
            renderItem={({item}) => <CommentItem {...item} />}
            ListEmptyComponent={
              <View
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  flex: 1,
                  marginTop: 20
                }}>
                <Text style={{fontSize: 18, fontWeight: 'bold'}}>
                  目前沒有留言!!!
                </Text>
              </View>
            }
          />
          <View
            style={[
              styles.inputContainer,
              {backgroundColor: theme === 'dark' ? '#1C1C1E' : 'white'},
            ]}>
            <TextInput
              style={[
                styles.input,
                {color: theme === 'dark' ? 'white' : 'black'},
              ]}
              value={comment}
              onChangeText={setComment}
              placeholder="寫下你的評論..."
              placeholderTextColor={theme === 'dark' ? '#999' : '#666'}
            />
            <TouchableOpacity
              onPress={() => {
                sendComment(focusPostId, comment);
                handleCloseComment();
                setComment('');
              }}
              style={styles.submitButton}>
              <Text style={styles.submitButtonText}>發送</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </BottomSheet>
    </>
  );
};

const styles = StyleSheet.create({
  username: {
    fontWeight: '500',
    marginBottom: 5,
    fontSize: 18,
    width: 320,
  },
  commentContainer: {
    backgroundColor: 'gray',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
    backgroundColor: 'white',
  },
  content: { fontWeight: '500', width: 320 },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,

    borderTopColor: '#ccc',
    position: 'absolute',
    top: 0,
  },
  input: {
    flex: 1,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 20,
    marginRight: 10,
  },
  submitButton: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#007AFF',
    paddingHorizontal: 15,
    borderRadius: 20,
  },
  submitButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: '0%',
    backgroundColor: 'rgba(0, 0, 0, 0.3)', // 半透明黑色背景
    zIndex: 0, // 確保覆蓋在底部視圖上
  },
});

export default CommentSection;
