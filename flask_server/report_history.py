from flask import Flask, render_template, jsonify, request, url_for, redirect, session, Blueprint
from flask_cors import CORS
import secrets
import mariadb
import sys
from werkzeug.utils import secure_filename
from pypinyin import lazy_pinyin
import datetime
import requests
import json
from map import get_elevation
from notify import send_messages

# 建立實體
history = Blueprint('history', __name__,
                    template_folder='..\\Profile\\Home\\Report')
CORS(history)  # 跨平台使用

history.secret_key = secrets.token_hex(16)  # 保護session

# 獲取所需API
with open('../config.json') as f:
    config = json.load(f)
registration_token = config["GOOGLE_MAP_API"]
weather_API = config["WEATHER_API"]
url = config["URl"]

# 獲取天氣資訊
weather_dict = {}


def get_weather():
    # 雖然他是一個小時更新資料，但例如15.的資料他並不會15.準時更新(可以再確認一下，下面有放一張圖是16.的時候看到的大概9分快10更新)，這個部分應該還要做修正和調整
    # 這邊試爬中央氣象局鼓山觀測站的資料
    weather_url = 'https://opendata.cwa.gov.tw/api/v1/rest/datastore/O-A0001-001'
    parameters = {
        'Authorization': weather_API,
        'format': 'JSON',
        'StationId': 'C0V690'  # 鼓山觀測站代碼
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
            weather_dict['Relative Humidity'] = weather_element.get(
                'RelativeHumidity')
            weather_dict['Wind Speed'] = weather_element.get('WindSpeed')
            weather_dict['Wind Direction'] = weather_element.get(
                'WindDirection')
            precipitation = weather_element['Now'].get('Precipitation')

            if precipitation is not None:
                if precipitation > 0:
                    weather_dict['Precipitation'] = 1
                elif precipitation == 0:
                    weather_dict['Precipitation'] = 0


@history.route('/')
def index():
    return render_template("index.tsx")


@history.route('/reportSubmit', methods=["GET", "POST"])
def submit_report():
    if request.method == "POST":
        # 提取表單資料
        # 照片為非必填資料
        if "photo" in request.files:
            image = request.files['photo']
            image_name = image.filename
            image_name = secure_filename(''.join(lazy_pinyin(image_name)))

            # 將圖片存入專案照片資料夾底下的"reportImg"資料夾
            image.save(f'static/reportImg/{image_name}')
            img_url = url + "static/reportImg/" + image_name
        else:
            img_url = ""
        email = request.form['email']
        lat = request.form['latitude']
        lon = request.form['longitude']
        alt = get_elevation(lat, lon, registration_token)
        # freq = request.form['frequency']
        count = int(request.form['textInputValue'])
        # 數量不可為0
        if count <= 0:
            session['success'] = 0
            print("no num")
            return redirect(url_for("history.submit_report"))
        time = datetime.datetime.now()
        # today = datetime.date.today()
        # time_time = time.hour
        # wday = today.isoweekday()
        get_weather()
        # pa = weather_dict.get('Pressure', None)  # 氣壓
        temp = weather_dict.get('Temperature', None)  # 氣溫
        hum = weather_dict.get('Relative Humidity', None)  # 相對溼度
        wspd = weather_dict.get('Wind Speed', None)  # 風速
        wdir = weather_dict.get('Wind Direction', None)  # 風向
        precip = weather_dict.get('Precipitation', None)  # 降水

        # 連接資料庫
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

        # 讀取資料庫資料
        cur = conn.cursor()
        cur.execute("SELECT PID FROM user WHERE Email=? LIMIT 1", (email,))
        rows = cur.fetchall()
        # 取該使用者之PID
        if rows:
            for row in rows:
                pid = row[0]
        else:
            session['success'] = 0
            print("no pid")
            return redirect(url_for("history.submit_report"))

        cur.execute("INSERT INTO monkey_history (Date_time, Longitude, Latitude, Altitude, Number, Temperature, Relative_humidity, Wind_speed, Wind_direction, Precipitation, Notifier, Picture_path) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
                    (time, lon, lat, alt, count, temp, hum, wspd, wdir, precip, pid, img_url))  # location, tptype, wday, iswday
        conn.commit()
        session['success'] = 1
        conn.close()

        # 發送獼猴警示訊息(若使用者未開啟APP，則提示顯示於提示欄；反之，則顯示於APP內)
        send_messages(lat, lon, 0.1)

        return redirect(url_for("history.submit_report"))  # 網頁重新導向，避免重複提交資料
    # 讀取session資料
    success = session.get('success', 0)
    session.clear()  # 將session裡的資料清除

    return jsonify({"success": success})


# 執行程式
if __name__ == '__main__':
    # 我先設這個，有更好的話可以直接提出來討論修改
    history.run(host="0.0.0.0", port=5000, debug=True)
