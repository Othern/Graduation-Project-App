import AsyncStorage from '@react-native-async-storage/async-storage';
import data from '../config.json';
const URL = data['URl'];
const getUserData = async (key: string) => {
  try {
    // 获取存储的UserData
    const userDataString = await AsyncStorage.getItem('UserData');

    if (userDataString !== null) {
      // 解析字符串为对象
      const userData = JSON.parse(userDataString);
      const result = userData[key];
      return result;
    } else {
      console.log('UserData not found');
      return null;
    }
  } catch (error) {
    console.error('Failed to retrieve or parse UserData:', error);
    return null;
  }
};
type CommentData = {
  id: number; // comment id
  mockTitle: string; // 稱號
  username: string; // comment author
  content: string; // comment content
  avatarUrl: string; // author's avatar url
  timestamp: string; // timestamp
};

export const COMMENTDATA: CommentData[] = [];

// export const COMMENTDATA = [
//   {
//     id: 1, //coment id
//     mockTitle: '大師', // 稱號
//     username: 'Alice', //coment author
//     content: '這是一個很有幫助的帖子，感謝分享！❤️❤️❤️❤️❤️❤️', // comment content
//     avatarUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSC28lvhB3X_P4cDQ17N2RQvttJRUYagluoPw&s', //author's avatar url
//     timestamp: '2024-07-02T08:30:00Z'// timestamp
//   },
//   {
//     id: 2,
//     mockTitle: '大師', // 稱號
//     username: 'eromangasensei_1210',
//     content: '我也遇到過類似的問題，這些建議真的很實用。',
//     avatarUrl: 'https://steamuserimages-a.akamaihd.net/ugc/1651094778160293860/28F0B5713A2F4D69F937C017E49E2CD0AE719CE5/?imw=5000&imh=5000&ima=fit&impolicy=Letterbox&imcolor=%23000000&letterbox=false',
//     timestamp: '2024-07-02T09:15:00Z'
//   },
//   {
//     id: 3,
//     mockTitle: '大師', // 稱號
//     username: 'Charlie',
//     content: '我有一個疑問，能否解釋一下 useCallback 的具體使用場景？',
//     avatarUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSC28lvhB3X_P4cDQ17N2RQvttJRUYagluoPw&s',
//     timestamp: '2024-07-02T10:05:00Z'
//   },
//   {
//     id: 4,
//     mockTitle: '大師', // 稱號
//     username: 'GrayRat',
//     content: '很詳細的講解，學到了很多，謝謝！',
//     avatarUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRxeUFVL8Duz6mNlimoa_oyELM8wzmggFWrhA&s',
//     timestamp: '2024-07-02T10:45:00Z'
//   },
//   {
//     id: 5,
//     mockTitle: '大師', // 稱號
//     username: 'Rem',
//     content: '請問這個方法可以在大型項目中使用嗎？',
//     avatarUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRN8CBMt-r2TFvNsYIf01Dd6QjEVkmWPwb-eQ&s',
//     timestamp: '2024-07-02T11:30:00Z'
//   },
//   {
//     id: 6,
//     mockTitle: '大師', // 稱號
//     username: '三鷹アサ',
//     content: '我只會做正確的事',
//     avatarUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTpnobU2ifAGJ6doWR82Mrt-Cjih4-FKSBF1A&s',
//     timestamp: '2024-07-02T12:00:00Z'
//   }
// ];

export const sendComment = async (pid: string, comment: string) => {
  const Url = URL + '/api/data/sendComment';
  const email = await getUserData('email');
  try {
    const response = await fetch(Url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email,
        comment: comment,
        pid: pid,
      }),
    });
  } catch (error) {
    console.error(error);
  }
};

// 取得評論資料
export const getCommentData = async (setCommentData: any, pid: string) => {
    const Url =URL+ "api/data/getCommentData";
    try {
      const response = await fetch(Url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ "pid": pid })
      }
      ).then(response => response.json());
      setCommentData(response);
    } catch (error) {
      console.error(error)
    }
  }