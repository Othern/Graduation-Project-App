import {PermissionsAndroid} from 'react-native';

export async function requestGeolocationPermission() {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: 'Location Permission',
        message: 'This app needs access to your location.',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      },
    );
  } catch (err) {
    console.warn(err);
  }
}

type Coordinate = {
  longitude: number;
  latitude: number;
};

type Region = [string, Coordinate[], Coordinate];

export const regions: Region[] = [
  [
    '武嶺',
    [
      { longitude: 120.26325051366383, latitude: 22.63131423396974 },
      { longitude: 120.26351467795561, latitude: 22.62887597596471 },
      { longitude: 120.26450301677248, latitude: 22.62887177203434 },
      { longitude: 120.26432538905905, latitude: 22.631293214689123 }
    ],
    { longitude: 120.263751,latitude: 22.630101}
  ],
  [
    '翠亨',
    [
      { longitude: 120.26739872290042, latitude: 22.629042764151503 },
      { longitude: 120.26896906806277, latitude: 22.628982579258686 },
      { longitude: 120.27060958570415, latitude: 22.62734367060859 },
      { longitude: 120.27050405511919, latitude: 22.626981870689427 },
      { longitude: 120.26897993547175, latitude: 22.62736760811727 },
      { longitude: 120.2678062518902, latitude: 22.627302407020913 },
      { longitude: 120.26773017980621, latitude: 22.62794940114626 },
      { longitude: 120.26742045774996, latitude: 22.628220234992206 }
    ],
    { longitude: 120.268184, latitude: 22.627162}
  ],
  [
    '文學院和藝術學院',
    [
      { longitude: 120.26004403737878, latitude: 22.634358736379614 },
      { longitude: 120.26087998875826, latitude: 22.63509459203184 },
      { longitude: 120.26277012981159, latitude: 22.63411932084963 },
      { longitude: 120.26270181146026, latitude: 22.633967985045803 },
      { longitude: 120.26099122390026, latitude: 22.63367352441278 }
    ],
    { longitude: 120.261477,latitude: 22.634256}
  ],
  [
    '教學區',
    [
      { longitude: 120.2649867912452, latitude: 22.627934634912 },
      { longitude: 120.26665947721433, latitude: 22.62800519070175 },
      { longitude: 120.26672348274266, latitude: 22.625188569280787 },
      { longitude: 120.26502358913307, latitude: 22.625252328820903 }
    ],
    { longitude: 120.265847,latitude: 22.626845}
  ],
  [
    '電資大樓',
    [
      { longitude: 120.26676668285094, latitude: 22.628117734802885 },
      { longitude: 120.26771890129012, latitude: 22.627647133207333 },
      { longitude: 120.26774063617125, latitude: 22.626834626681056 },
      { longitude: 120.26730593854845, latitude: 22.6267744408214 },
      { longitude: 120.26728420366733, latitude: 22.625936851539322 },
      { longitude: 120.26675537600254, latitude: 22.625964327607832 }
    ],
    { longitude: 120.267177,latitude: 22.627887}
  ],
  [
    '活動中心',
    [
      { longitude: 120.26440449075304, latitude: 22.628717980001145 },
      { longitude: 120.26577541233628, latitude: 22.628486763368834 },
      { longitude: 120.26574353043898, latitude: 22.627994901239084 },
      { longitude: 120.26497381034739, latitude: 22.62797388145074 },
      { longitude: 120.26440212619337, latitude: 22.627966381710543 }
    ],
    { longitude: 120.265060,latitude: 22.628629}
  ],
  [
    '海院',
    [
      { longitude: 120.26067338088106, latitude: 22.632473951480502 },
      { longitude: 120.26148583595372, latitude: 22.632751866309285 },
      { longitude: 120.26400476123293, latitude: 22.62797105002212 },
      { longitude: 120.26370698532007, latitude: 22.627696195896384 },
      { longitude: 120.26249702154453, latitude: 22.628315597055096 }
    ],
    { longitude: 120.262265,latitude: 22.629662}
  ],
  [
    '國研大樓和體育館',
    [
      { longitude: 120.2650612786277, latitude: 22.625221018773832 },
      { longitude: 120.26667509215821, latitude: 22.62513157919756 },
      { longitude: 120.26669081115945, latitude: 22.62410391046685 },
      { longitude: 120.26614828403213, latitude: 22.623250905185703 },
      { longitude: 120.2658354612267, latitude: 22.62327525779414 },
      { longitude: 120.26576004235405, latitude: 22.624311433174963 },
      { longitude: 120.2650765792699, latitude: 22.62432803497808 }
    ],
    { longitude: 120.265229,latitude: 22.624883}
  ],
  [
    '教學區西側',
    [
      { longitude: 120.26402911107782, latitude: 22.62797854782038 },
      { longitude: 120.26436706941979, latitude: 22.624368872784316 },
      { longitude: 120.26497861310409, latitude: 22.624349066350128 },
      { longitude: 120.26494485491602, latitude: 22.627903762845577 }
    ],
    { longitude: 120.264330, latitude: 22.626300}
  ],
  [
    '體育場和海堤',
    [
      { longitude: 120.2611410286546, latitude: 22.622881429509075 },
      { longitude: 120.26414581056034, latitude: 22.624357088129894 },
      { longitude: 120.26576591199168, latitude: 22.624287774725346 },
      { longitude: 120.26569630672408, latitude: 22.62171779289629 }
    ],
    { longitude: 120.264437,latitude:  22.623661}
  ]
];
type DataItem = {
  Category: string;
  Location: string;
  Number: number;
};

type CategoryData = Record<string, string>;

export const transformAndMergeData = (data: DataItem[]) => {
  // Step 1: Transform data into { Location: Category }
  const categoryData: CategoryData = data.reduce((acc, curr) => {
    acc[curr.Location] = curr.Category;
    return acc;
  }, {} as Record<string, string>);

  // Step 2: Find locations that intersect and merge data
  return regions
    .filter(([location]) => typeof location === 'string' && categoryData.hasOwnProperty(location)) // Ensure location is a string
    .map(([location, coordinates, center]) => {
      return [
        location,
        coordinates,
        center,
        categoryData[location] // Get the corresponding category from the transformed data
      ];
    });
};



// const data = [
//   {
//     name: '威爾希斯咖啡',
//     longitude: 120.2661326,
//     latitude: 22.6261283,
//     quantity: 1,
//     time: '2024-06-14 07:57:27',
//   },
//   {
//     name: '國研停車場',
//     longitude: 120.2660711,
//     latitude: 22.6242157,
//     quantity: 1,
//     time: '2024-06-14 07:50:27',
//   },
//   {
//     name: '理工一道',
//     longitude: 120.2666379,
//     latitude: 22.6263989,
//     quantity: 2,
//     time: '2024-06-14 07:51:27',
//   },
//   {
//     name: '武四',
//     longitude: 120.2643484,
//     latitude: 22.6301555,
//     quantity: 3,
//     time: '2024-06-14 07:57:27',
//   },
// ];
type DATA = {
  name: string,
  longitude: number,
  latitude: number,
  quantity: number,
  time: string,
};

// data
export const Data: DATA[] = [];
