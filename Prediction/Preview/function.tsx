// url 需要更改
export const getPreviewlData = async (success:any) => {
    try {
        const response = await fetch("http://192.168.0.18:4000/predict_model");
        const jsonData = await response.json();
        success(jsonData);
        console.log(jsonData)
      } catch (error) {
        console.error('Error fetching data:', error);
      }
}

export const previewData = [
    { Location: "國研大樓和體育館", Category: '少量' },
    { Location: "教學區", Category: '大量' },
    { Location: "教學區西側", Category: '中量' },
    { Location: "武嶺", Category: '大量' },
    { Location: "活動中心", Category: '大量' },
    { Location: "海院", Category: '中量' },
    { Location: "翠亨", Category: '中量' },
    { Location: "電資大樓", Category: '大量' },
    { Location: "體育場和海提", Category: '少量' }
];
