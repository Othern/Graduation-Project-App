// url 需要更改
import data from '../../config.json';
const URL = data['URl'];
export const getDetailData = async (location: string, success: any) => {
  try {
    const response = await fetch(URL+'details', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({location: location}),
    });
    const responseData = await response.json();
    console.log(responseData)
    success(responseData);
  } catch (error) {
    console.error('Error sending login data:', error);
  }
};
type DETAILDATA = {
  Number: number; // post id
  Date_time: string; // author's name
};

// Post data
//export const detailData: DETAILDATA[] = [];
export const detailData  = [
    { Number: 7, Date_time: '6' },
    { Number: 6, Date_time: '7' },
    { Number: 4, Date_time: '8' },
    { Number: 4, Date_time: '9' },
    { Number: 4, Date_time: '10' },
    { Number: 4, Date_time: '11' },
    { Number: 3, Date_time: '12' },
    { Number: 3, Date_time: '13' },
    { Number: 4, Date_time: '14' },
    { Number: 4, Date_time: '15' },
    { Number: 6, Date_time: '16' },
    { Number: 7, Date_time: '17' },
    { Number: 7, Date_time: '18' },
];
