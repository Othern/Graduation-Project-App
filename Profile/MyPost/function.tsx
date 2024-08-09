import AsyncStorage from '@react-native-async-storage/async-storage';
const getUserData = async(key: string)=>{
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
}
// 刪除貼文
export const deletePost = async(id:string)=>{
  const Url = "http://192.168.0.18:4000/api/data/deletePostData";
  const email = getUserData('email');
  try {
    const response = await fetch(Url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(
        {
          "email": email,
          "postID": id
        })
    }).then(response => response.json())

  }
  catch (error) {
    console.error(error)
  }
}

// 取得貼文資料，這邊要取得的是使用者寫的文章
export const getPostData = async (setPostData: any, kind: string, page: number) => {
  const Url = "http://192.168.0.18:4000/api/data/getPostData";
  const email = getUserData('email');
  try {
    const response = await fetch(Url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(
        {
          "kind": kind,
          "page": page,
          "email": email
        })
    }).then(response => response.json())

    setPostData(response)
  }
  catch (error) {
    console.error(error)
  }
}

// 取得評論資料
export const getCommentData = async (setCommentData: any, pid: number) => {
  const Url = "http://192.168.0.18:4000/api/data/getCommentData";
  try {
    const response = await fetch(Url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ "pid": pid })
    }
    );
    setCommentData(response);
  } catch (error) {
    console.error(error)
  }
}

// 發表評論
export const sendComment = async (pid: number, comment: string) => {
  const Url = "http://192.168.0.18:4000/api/data/sendComment";
  const email = await getUserData('email')
  try {
    const response = await fetch(Url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "email": email,
        "comment": comment,
        "pid": pid
      })
    }
    );
  } catch (error) {
    console.error(error)
  }
}
// 目前所需的回傳資料格式
// Comment data

export const COMMENTDATA = [
  {
    id: 1, //coment id
    mockTitle: '大師', // 稱號
    username: 'Alice', //coment author
    content: '這是一個很有幫助的帖子，感謝分享！❤️❤️❤️❤️❤️❤️', // comment content
    avatarUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSC28lvhB3X_P4cDQ17N2RQvttJRUYagluoPw&s', //author's avatar url
    timestamp: '2024-07-02T08:30:00Z'// timestamp
  },
  {
    id: 2,
    mockTitle: '大師', // 稱號
    username: 'eromangasensei_1210',
    content: '我也遇到過類似的問題，這些建議真的很實用。',
    avatarUrl: 'https://steamuserimages-a.akamaihd.net/ugc/1651094778160293860/28F0B5713A2F4D69F937C017E49E2CD0AE719CE5/?imw=5000&imh=5000&ima=fit&impolicy=Letterbox&imcolor=%23000000&letterbox=false',
    timestamp: '2024-07-02T09:15:00Z'
  },
  {
    id: 3,
    mockTitle: '大師', // 稱號
    username: 'Charlie',
    content: '我有一個疑問，能否解釋一下 useCallback 的具體使用場景？',
    avatarUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSC28lvhB3X_P4cDQ17N2RQvttJRUYagluoPw&s',
    timestamp: '2024-07-02T10:05:00Z'
  },
  {
    id: 4,
    mockTitle: '大師', // 稱號
    username: 'GrayRat',
    content: '很詳細的講解，學到了很多，謝謝！',
    avatarUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRxeUFVL8Duz6mNlimoa_oyELM8wzmggFWrhA&s',
    timestamp: '2024-07-02T10:45:00Z'
  },
  {
    id: 5,
    mockTitle: '大師', // 稱號
    username: 'Rem',
    content: '請問這個方法可以在大型項目中使用嗎？',
    avatarUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRN8CBMt-r2TFvNsYIf01Dd6QjEVkmWPwb-eQ&s',
    timestamp: '2024-07-02T11:30:00Z'
  },
  {
    id: 6,
    mockTitle: '大師', // 稱號
    username: '三鷹アサ',
    content: '我只會做正確的事',
    avatarUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTpnobU2ifAGJ6doWR82Mrt-Cjih4-FKSBF1A&s',
    timestamp: '2024-07-02T12:00:00Z'
  }
];
// Post data
export const POSTDATA = [
  {
    id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba', // post id
    name: 'shelter_1022', // author's name
    mockTitle: '大師', // 稱號
    description: '這種痛苦還要持續多久', // post's description
    avatarUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSC28lvhB3X_P4cDQ17N2RQvttJRUYagluoPw&s', // author's avatarUrl
    image: true, // whether image or video
    contentUri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTreBuOexL-mU-nxKgDnvnXQfLFmar1NhcfJg&s', // contentUri
    like: true, // user like or not this post
    hearts: 100 // how mant heart does the post get
  },
  {
    id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
    name: 'eromangasensei_1210',
    description: '歐尼醬什麼的最討厭了!\n歐尼醬什麼的最討厭了!\n歐尼醬什麼的最討厭了!\n歐尼醬什麼的最討厭了!\n歐尼醬什麼的最討厭了!\n歐尼醬什麼的最討厭了!\n歐尼醬什麼的最討厭了!',
    mockTitle: '可愛大師',
    avatarUrl: 'https://steamuserimages-a.akamaihd.net/ugc/1651094778160293860/28F0B5713A2F4D69F937C017E49E2CD0AE719CE5/?imw=5000&imh=5000&ima=fit&impolicy=Letterbox&imcolor=%23000000&letterbox=false',
    image: true,
    contentUri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTreBuOexL-mU-nxKgDnvnXQfLFmar1NhcfJg&s',
    like: false,
    hearts: 50

  },
  {
    id: '58694a0f-3da1-471f-bd96-145571e29d75',
    name: 'Third Item',
    mockTitle: '可愛大師',
    description: 'Hello Everyone.',
    avatarUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSC28lvhB3X_P4cDQ17N2RQvttJRUYagluoPw&s',
    image: false,
    contentUri: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    like: false,
    hearts: 10

  },
  {
    id: '58694a0f-3da1-471f-bd96-145571e29d74',
    name: 'Aarya_0729',
    mockTitle: '好笑王', 
    description: 'Ты симпатичная ',
    avatarUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRESgscYBotXXua0fHnKMk-B9NJuLQ97d19sQ&s',
    image: false,
    contentUri: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    like: false,
    hearts: 100

  },
];