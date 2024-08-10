// url 需要更改
import data from '../../config.json';
const URL = data['URl'];
export const getPreviewlData = async (success: any) => {
  try {
    const jsonData = await fetch(URL + 'predict_model').then(response => response.json());
    success(jsonData);
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};
type PREVIEWDATA = {
  Location: string; // post id
  Category: string; // author's name
};

// Post data
export const previewData: PREVIEWDATA[] = [];
// export const previewData = [
//     { Location: "國研大樓和體育館", Category: '少量' },
//     { Location: "教學區", Category: '大量' },
//     { Location: "教學區西側", Category: '中量' },
//     { Location: "文學院和藝術學院", Category: '大量'},
//     { Location: "武嶺", Category: '大量' },
//     { Location: "活動中心", Category: '大量' },
//     { Location: "海院", Category: '中量' },
//     { Location: "翠亨", Category: '中量' },
//     { Location: "電資大樓", Category: '大量' },
//     { Location: "體育場和海提", Category: '少量' }
// ];
