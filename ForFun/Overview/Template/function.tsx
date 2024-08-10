import AsyncStorage from '@react-native-async-storage/async-storage';
import data from '../../../config.json'
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
const URL = data['URl']
// 取得貼文資料
export const getPostData = async (setPostData: any, kind: string, page: number) => {
  const Url = URL+"api/data/getPostData";
  const email = await getUserData('email');
  
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

// 回傳愛心
export const sendHeart = async (pid: string) => {
  const Url = URL+"api/data/sendHeart";
  const email = await getUserData('email');
  try {
    const response = await fetch(Url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "email": email,
        "pid": pid
      })
    }
    );
  } catch (error) {
    console.error(error)
  }
}

type PostData = {
  id: string;                // post id
  name: string;              // author's name
  mockTitle: string;         // 稱號
  description: string;       // post's description
  avatarUrl: string;         // author's avatarUrl
  image: boolean;            // whether image or video
  contentUri: string;        // contentUri
  like: boolean;             // user like or not this post
  hearts: number;            // how many hearts does the post get
};

// Post data
export const POSTDATA: PostData[] = [];

// export const POSTDATA = [
//   {
//     id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba', // post id
//     name: 'shelter_1022', // author's name
//     mockTitle: '大師', // 稱號
//     description: '這種痛苦還要持續多久', // post's description
//     avatarUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSC28lvhB3X_P4cDQ17N2RQvttJRUYagluoPw&s', // author's avatarUrl
//     image: true, // whether image or video
//     contentUri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTreBuOexL-mU-nxKgDnvnXQfLFmar1NhcfJg&s', // contentUri
//     like: true, // user like or not this post
//     hearts: 100 // how mant heart does the post get
//   },
//   {
//     id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
//     name: 'eromangasensei_1210',
//     description: '歐尼醬什麼的最討厭了!\n歐尼醬什麼的最討厭了!\n歐尼醬什麼的最討厭了!\n歐尼醬什麼的最討厭了!\n歐尼醬什麼的最討厭了!\n歐尼醬什麼的最討厭了!\n歐尼醬什麼的最討厭了!',
//     mockTitle: '可愛大師',
//     avatarUrl: 'https://steamuserimages-a.akamaihd.net/ugc/1651094778160293860/28F0B5713A2F4D69F937C017E49E2CD0AE719CE5/?imw=5000&imh=5000&ima=fit&impolicy=Letterbox&imcolor=%23000000&letterbox=false',
//     image: true,
//     contentUri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTreBuOexL-mU-nxKgDnvnXQfLFmar1NhcfJg&s',
//     like: false,
//     hearts: 50

//   },
//   {
//     id: '58694a0f-3da1-471f-bd96-145571e29d75',
//     name: 'Third Item',
//     mockTitle: '可愛大師',
//     description: 'Hello Everyone.',
//     avatarUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSC28lvhB3X_P4cDQ17N2RQvttJRUYagluoPw&s',
//     image: false,
//     contentUri: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
//     like: false,
//     hearts: 10

//   },
//   {
//     id: '58694a0f-3da1-471f-bd96-145571e29d74',
//     name: 'Aarya_0729',
//     mockTitle: '好笑王', 
//     description: 'Ты симпатичная ',
//     avatarUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRESgscYBotXXua0fHnKMk-B9NJuLQ97d19sQ&s',
//     image: false,
//     contentUri: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
//     like: false,
//     hearts: 100

//   },
// ];
