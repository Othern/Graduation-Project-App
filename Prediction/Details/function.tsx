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
export const detailData: DETAILDATA[] = [];
// export const detailData  = [
//     { Number: 12, Date_time: '0' },
//     { Number: 3, Date_time: '1' },
//     { Number: 15, Date_time: '2' },
//     { Number: 8, Date_time: '3' },
//     { Number: 7, Date_time: '4' },
//     { Number: 10, Date_time: '5' },
//     { Number: 5, Date_time: '6' },
//     { Number: 13, Date_time: '7' },
//     { Number: 1, Date_time: '8' },
//     { Number: 14, Date_time: '9' },
//     { Number: 6, Date_time: '10' },
//     { Number: 2, Date_time: '11' },
//     { Number: 11, Date_time: '12' },
//     { Number: 4, Date_time: '13' },
//     { Number: 9, Date_time: '14' },
//     { Number: 0, Date_time: '15' },
//     { Number: 3, Date_time: '16' },
//     { Number: 8, Date_time: '17' },
//     { Number: 12, Date_time: '18' },
//     { Number: 7, Date_time: '19' },
//     { Number: 15, Date_time: '20' },
//     { Number: 1, Date_time: '21' },
//     { Number: 14, Date_time: '22' },
//     { Number: 9, Date_time: '23' },
//     { Number: 5, Date_time: '24' }
// ];
