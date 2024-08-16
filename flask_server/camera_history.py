# Module Imports
# for database
import mariadb
import sys
########################## ADD ############################
# for weather information
import requests
import json
###########################################################
# for monitor and object detection
import cv2
import numpy as np
from datetime import datetime, timedelta
# import os
# import glob
# import random
from tensorflow.lite.python.interpreter import Interpreter
from notify import send_messages
from map import get_elevation


# 取得中央氣象局的API
with open('../config.json') as f:
    config = json.load(f)
registration_token = config["GOOGLE_MAP_API"]
weather_API = config["WEATHER_API"]
rtsp_path = config["RTSP_PATH"]

try:
    conn = mariadb.connect(
        user="root",
        password="mis114monkey",
        host="127.0.0.1",
        port=3307,
        database="mis114_monkey"
    )

except mariadb.Error as e:
    print(f"Error connecting to MariaDB Platform: {e}")
    sys.exit(1)

cur = conn.cursor()

# PATH_TO_MODEL='./custom_model_lite_v1/detect_ssdmobilenetv2_60000.tflite'
# PATH_TO_MODEL='C:/Users/mybea/Downloads/2nd_phase/2nd_phase_weights/non4_detect.tflite'
PATH_TO_MODEL='./detect.tflite'
PATH_TO_LABELS='./labelmap.txt'

# 從input details 去改 width 和 height
width = 640
height = 640

# 取得攝影機資料
camera = 1
cur.execute("SELECT Location, Longitude, Latitude FROM user WHERE PID=? AND isCamera=? LIMIT 1", (camera,"Y"))
rows = cur.fetchall()
if rows:
    for row in rows:
        location = row[0]
else:
    print("Camera fetch error!")

# camera_dict = {
#     1: [location, rtsp_path],
#     2: ['管院', 'rtsp2'],
#     3: ['武嶺', 'rtsp3']
# }


# location, rtsp_link = camera_dict.get(camera)
#print(location, rtsp_link)

########################### ADD和修改 ####################################
# post_backend function 前面加入抓取天氣資料的function
# 儲存天氣資料_dict
weather_dict = {}

def get_weather():
		# 雖然他是一個小時更新資料，但例如15.的資料他並不會15.準時更新(可以再確認一下，下面有放一張圖是16.的時候看到的大概9分快10更新)，這個部分應該還要做修正和調整
    # 這邊試爬中央氣象局鼓山觀測站的資料
    weather_url = 'https://opendata.cwa.gov.tw/api/v1/rest/datastore/O-A0001-001'
    parameters = {
        'Authorization':weather_API,
        'format':'JSON',
        'StationId':'C0V690' # 鼓山觀測站代碼
    }

    response = requests.get(weather_url, params=parameters)

    if response.status_code == 200:
        weather_data = json.loads(response.text)
        stations = weather_data["records"]["Station"]
        for station in stations:
            # station_name = station['StationName']
            weather_element = station['WeatherElement']

            weather_dict['Pressure'] = weather_element.get('AirPressure')
            weather_dict['Temperature'] = weather_element.get('AirTemperature')
            weather_dict['Relative Humidity'] = weather_element.get('RelativeHumidity')
            weather_dict['Wind Speed'] = weather_element.get('WindSpeed')
            weather_dict['Wind Direction'] = weather_element.get('WindDirection')
            precipitation = weather_element['Now'].get('Precipitation')

            if precipitation is not None:
                if precipitation > 0:
                    weather_dict['Precipitation'] = 1
                elif precipitation == 0:
                    weather_dict['Precipitation'] = 0
#########################################################################                    
def post_backend(camera, location, time, label_count):
    # print 連後端要傳的 - time
    print("time:", time)

    # print 連後端要傳的 - location
    print("location:", location)

    # print 連後端要傳的 - label
    for label, count in label_count.items():
        print(f"{label}: {count}")

    lon = None  # 經度
    lat = None  # 緯度
    alt = None  # 高度
  
   # 修改post_backend的天氣資料部分
########################### ADD和修改 ####################################    
    # 抓取天氣資料
    get_weather()
    # pa = weather_dict.get('Pressure', None)  # 氣壓
    temp = weather_dict.get('Temperature', None) # 氣溫
    hum =  weather_dict.get('Relative Humidity', None)  # 相對溼度
    wspd =  weather_dict.get('Wind Speed', None)  # 風速
    wdir = weather_dict.get('Wind Direction', None)  # 風向
    precip = weather_dict.get('Precipitation', None)  # 降水 

    # print 連後端要傳的 - 天氣資料(pa, temp, hm, wspd, wdir, precip)
    print("weather_dict", weather_dict)
#########################################################################
    # 這邊日期和圖片地址還是先傳 null
    tptype = None  # 時段類型
    wday = None  # 星期
    iswday = None  # 是否平日
    img_url = None  # 圖片地址

    # search camera 1 data in user data
    cur.execute("SELECT Longitude, Latitude FROM user WHERE PID = ?", (camera,))
    camera_data = cur.fetchone()

    # check if the data is fetched
    if camera_data:
        lon, lat = camera_data
        alt = get_elevation(lat, lon, registration_token)
        send_messages(lat, lon, 0.1)
        cur.execute( "INSERT INTO monkey_history (Date_time, Longitude, Latitude, Altitude, Location, Number, Temperature, Relative_humidity, Wind_speed, Wind_direction, Precipitation, Time_type, Week, Weekday, Notifier, Picture_path) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        (time, lon, lat, alt, location, count, temp, hum, wspd, wdir, precip, tptype, wday, iswday, camera, img_url) )
        conn.commit()
    else: # if data is not found
        print('No valid camera!')
      
    
def tflite_detect_video(interpreter, image, labels, min_conf=0.5):
    input_details = interpreter.get_input_details()
    output_details = interpreter.get_output_details()
    # print(input_details)

    imH, imW, _ = image.shape
    image_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
    image_resized = cv2.resize(image_rgb, (width, height))
    input_data = np.expand_dims(image_resized, axis=0)

    float_input = (input_details[0]['dtype'] == np.float32)

    if float_input:
        input_data = (np.float32(input_data) - 127.5) / 127.5

    interpreter.set_tensor(input_details[0]['index'], input_data)
    interpreter.invoke()

    boxes = interpreter.get_tensor(output_details[1]['index'])[0]
    classes = interpreter.get_tensor(output_details[3]['index'])[0]
    scores = interpreter.get_tensor(output_details[0]['index'])[0]

    detections = []
    label_count = {}

    for i in range(len(scores)):
        if scores[i] > min_conf and scores[i] <= 1.0:
            
            # get current time
            current_time = datetime.now().strftime("%Y-%m-%d %H:%M:%S.%f")

            ymin = int(max(1, (boxes[i][0] * imH)))
            xmin = int(max(1, (boxes[i][1] * imW)))
            ymax = int(min(imH, (boxes[i][2] * imH)))
            xmax = int(min(imW, (boxes[i][3] * imW)))

            cv2.rectangle(image, (xmin, ymin), (xmax, ymax), (10, 255, 0), 2)

            object_name = labels[int(classes[i])]

            #  label count
            if object_name in label_count:
                label_count[object_name] += 1
            else:
                label_count[object_name] = 1

            label = '%s-%d : %d%%' % (object_name, label_count.get(object_name, 0), int(scores[i] * 100))
            labelSize, baseLine = cv2.getTextSize(label, cv2.FONT_HERSHEY_SIMPLEX, 0.7, 2)
            label_ymin = max(ymin, labelSize[1] + 10)
            cv2.rectangle(image, (xmin, label_ymin - labelSize[1] - 10), (xmin + labelSize[0], label_ymin + baseLine - 10), (255, 255, 255), cv2.FILLED)
            cv2.putText(image, label, (xmin, label_ymin - 7), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 0, 0), 2)

            detections.append([object_name, scores[i], xmin, ymin, xmax, ymax])
            
            # 因為monkey_history是使用Date_time當作PRIMARY Key，所以當時間完全一樣時，會報錯
            # 這邊先暫時將加入新判讀到的資料的基準為與最後一筆加入資料庫的Date_time差超過0.5秒
            cur.execute("SELECT * FROM monkey_history ORDER BY Date_time DESC LIMIT 1;")
            last_recorded_date_time = cur.fetchone()[0]
            current_time = datetime.strptime(current_time, "%Y-%m-%d %H:%M:%S.%f") # 將current time先轉回為時間型態

            # if the current detected monkey time is later than last recorded Date_time for over 0.5 second
            if (current_time - last_recorded_date_time) > timedelta(seconds=0.5):
                post_backend(camera, location, current_time, label_count) # insert the data to database

    return image, detections


def main():

    # for mp4 video testing
    video_path = './VID_20240313_134833.mp4'

    # for rtsp testing
    # video_path = rtsp_path
    cap = cv2.VideoCapture(video_path)

    interpreter = Interpreter(model_path=PATH_TO_MODEL)
    interpreter.allocate_tensors()

    with open(PATH_TO_LABELS, 'r') as f:
        labels = [line.strip() for line in f.readlines()]

    while cap.isOpened():
        ret, frame = cap.read()
        frame = cv2.resize(frame, (800, 600))
        if not ret:
            break

        processed_frame, detections = tflite_detect_video(interpreter, frame, labels, min_conf=0.5)
        
        cv2.imshow("test", processed_frame)
        #cv2_imshow(processed_frame)

        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

    cap.release()
    cv2.destroyAllWindows()


if __name__ == '__main__':
    main()