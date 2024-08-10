from flask import Flask, jsonify, request, render_template, Blueprint
from flask_cors import CORS
import secrets
import mariadb
import sys
import pandas as pd
from datetime import datetime, timedelta
from shapely.geometry import Point, Polygon
from sklearn.preprocessing import LabelEncoder
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
import xgboost as xgb
from sklearn.metrics import mean_squared_error as MSE
from apscheduler.schedulers.background import BackgroundScheduler
from pytz import timezone
import json
import requests

with open('../config.json') as f:
    config = json.load(f)
template_folder = config["PREDICT_TEMPLATE_FOLDER"]
weather_API = config["WEATHER_API"]

predict = Blueprint(
    "predict",
    __name__,
    template_folder="..\\Prediction",
)
CORS(predict)  # 跨平台使用

predict.secret_key = secrets.token_hex(16)  # 保護session

# 資料庫連接設置
DB_CONFIG = {
    "user": "root",
    "password": "mis114monkey",
    "host": "127.0.0.1",
    "port": 3307,
    "database": "mis114_monkey",
}

# 定義區域範圍和其他全域變數
regions = {
    "武嶺": {
        "polygon": Polygon(
            [
                (120.26325051366383, 22.63131423396974),
                (120.26351467795561, 22.62887597596471),
                (120.26450301677248, 22.62887177203434),
                (120.26432538905905, 22.631293214689123),
            ]
        ),
        "height_range": (25, 60),
    },
    "翠亨": {
        "polygon": Polygon(
            [
                (120.26739872290042, 22.629042764151503),
                (120.26896906806277, 22.628982579258686),
                (120.27060958570415, 22.62734367060859),
                (120.27050405511919, 22.626981870689427),
                (120.26897993547175, 22.62736760811727),
                (120.2678062518902, 22.627302407020913),
                (120.26773017980621, 22.62794940114626),
                (120.26742045774996, 22.628220234992206),
            ]
        ),
        "height_range": (30, 63),
    },
    "文學院和藝術學院": {
        "polygon": Polygon(
            [
                (120.26004403737878, 22.634358736379614),
                (120.26087998875826, 22.63509459203184),
                (120.26277012981159, 22.63411932084963),
                (120.26270181146026, 22.633967985045803),
                (120.26099122390026, 22.63367352441278),
            ]
        ),
        "height_range": (40, 100),
    },
    "教學區": {
        "polygon": Polygon(
            [
                (120.2649867912452, 22.627934634912),
                (120.26665947721433, 22.62800519070175),
                (120.26672348274266, 22.625188569280787),
                (120.26502358913307, 22.625252328820903),
            ]
        ),
        "height_range": (3, 15),
    },
    "電資大樓": {
        "polygon": Polygon(
            [
                (120.26676668285094, 22.628117734802885),
                (120.26771890129012, 22.627647133207333),
                (120.26774063617125, 22.626834626681056),
                (120.26730593854845, 22.6267744408214),
                (120.26728420366733, 22.625936851539322),
                (120.26675537600254, 22.625964327607832),
            ]
        ),
        "height_range": (7, 31),
    },
    "活動中心": {
        "polygon": Polygon(
            [
                (120.26440449075304, 22.628717980001145),
                (120.26577541233628, 22.628486763368834),
                (120.26574353043898, 22.627994901239084),
                (120.26497381034739, 22.62797388145074),
                (120.26440212619337, 22.627966381710543),
            ]
        ),
        "height_range": (7, 33),
    },
    "海院": {
        "polygon": Polygon(
            [
                (120.26067338088106, 22.632473951480502),
                (120.26148583595372, 22.632751866309285),
                (120.26400476123293, 22.62797105002212),
                (120.26370698532007, 22.627696195896384),
                (120.26249702154453, 22.628315597055096),
            ]
        ),
        "height_range": (1, 15),
    },
    "國研大樓和體育館": {
        "polygon": Polygon(
            [
                (120.2650612786277, 22.625221018773832),
                (120.26667509215821, 22.62513157919756),
                (120.26669081115945, 22.62410391046685),
                (120.26614828403213, 22.623250905185703),
                (120.2658354612267, 22.62327525779414),
                (120.26576004235405, 22.624311433174963),
                (120.2650765792699, 22.62432803497808),
            ]
        ),
        "height_range": (1, 20),
    },
    "教學區西側": {
        "polygon": Polygon(
            [
                (120.26402911107782, 22.62797854782038),
                (120.26436706941979, 22.624368872784316),
                (120.26497861310409, 22.624349066350128),
                (120.26494485491602, 22.627903762845577),
            ]
        ),
        "height_range": (2, 10),
    },
    "體育場和海堤": {
        "polygon": Polygon(
            [
                (120.2611410286546, 22.622881429509075),
                (120.26414581056034, 22.624357088129894),
                (120.26576591199168, 22.624287774725346),
                (120.26569630672408, 22.62171779289629),
            ]
        ),
        "height_range": (1, 3),
    },
}

# 定義位置類別數據
location_categories = [
    "Location_1", "Location_2", "Location_3", "Location_4",
    "Location_5", "Location_6", "Location_7", "Location_8",
    "Location_9"
]

location_mapping = {
    "國研大樓和體育館": 0,
    "教學區": 1,
    "教學區西側": 2,
    "文學院和藝術學院": 3,
    "武嶺": 4,
    "活動中心": 5,
    "海院": 6,
    "翠亨": 7,
    "電資大樓": 8,
    "體育場和海堤": 9,
}

# 定義各區域的中心點經緯度以及平均高度
region_centers = {
    "武嶺": {
        "coordinates": (120.263751, 22.630101),
        "avg_height": (25 + 60) / 2,
    },
    "翠亨": {
        "coordinates": (120.268184, 22.627162),
        "avg_height": (30 + 63) / 2,
    },
    "文學院和藝術學院": {
        "coordinates": (120.261477, 22.634256),
        "avg_height": (40 + 100) / 2,
    },
    "教學區": {
        "coordinates": (120.265847, 22.626845),
        "avg_height": (3 + 15) / 2,
    },
    "電資大樓": {
        "coordinates": (120.267177, 22.627887),
        "avg_height": (7 + 31) / 2,
    },
    "活動中心": {
        "coordinates": (120.265060, 22.628629),
        "avg_height": (7 + 33) / 2,
    },
    "海院": {
        "coordinates": (120.262265, 22.629662),
        "avg_height": (1 + 15) / 2,
    },
    "國研大樓和體育館": {
        "coordinates": (120.265229, 22.624883),
        "avg_height": (1 + 20) / 2,
    },
    "教學區西側": {
        "coordinates": (120.264330, 22.626300),
        "avg_height": (2 + 10) / 2,
    },
    "體育場和海堤": {
        "coordinates": (120.264437, 22.623661),
        "avg_height": (1 + 3) / 2,
    },
}


# 模型超參數
best_params = {
    'subsample': 0.9087919226291457,
    'n_estimators': 2000,
    'eta': 0.06477528416088997,
    'min_child_weight': 2,
    'colsample_bytree': 0.8707440237807236
}


# 風向文字對應的角度
wind_direction_dict = {
    "北風": 0,
    "偏北風": 22.5,
    "東北風": 45,
    "東風": 90,
    "偏東風": 112.5,
    "東南風": 135,
    "南風": 180,
    "偏南風": 202.5,
    "西南風": 225,
    "西風": 270,
    "偏西風": 292.5,
    "西北風": 315,
}

# 全域變數
final_counts = pd.DataFrame()


def get_weather():
    print("getting weather data...")

    weather_url = 'https://opendata.cwa.gov.tw/api/v1/rest/datastore/F-D0047-065'

    # 設定明天的日期，並指定時間範圍
    tomorrow = (datetime.today() + timedelta(days=1)).strftime('%Y-%m-%d')
    time_from = f"{tomorrow}T06:00:00"
    time_to = f"{tomorrow}T18:00:01"

    parameters = {
        'Authorization': weather_API,
        'format': 'JSON',
        'locationName': ['鹽埕區'],  # 指定地點為鹽埕區
        'elementName': ['WS', 'WD', 'PoP12h', 'T', 'RH', 'Wx'],  # 指定所需的天氣因子
        'timeFrom': time_from,
        'timeTo': time_to
    }

    response = requests.get(weather_url, params=parameters)

    if response.status_code == 200:
        weather_data = json.loads(response.text)
        locations = weather_data["records"]["locations"][0]["location"]

        weather_dict = {}
        precipitation_value = None  # 初始的降雨值

        for location in locations:
            for weather_element in location['weatherElement']:
                element_name = weather_element['elementName']
                for time_data in weather_element['time']:
                    obs_time = time_data.get(
                        'dataTime') or time_data.get('startTime')
                    obs_datetime = datetime.fromisoformat(obs_time)
                    obs_time_str = obs_datetime.strftime('%Y-%m-%d %H:%M:%S')

                    if obs_time_str not in weather_dict:
                        weather_dict[obs_time_str] = {
                            'ObservationTime': obs_datetime,
                            'Temperature': None,
                            'Relative_Humidity': None,
                            'Wind_Speed': None,
                            'Wind_Direction': None,
                            'Precipitation': None
                        }

                    if element_name == 'T':
                        weather_dict[obs_time_str]['Temperature'] = float(
                            time_data['elementValue'][0]['value'])
                    elif element_name == 'RH':
                        weather_dict[obs_time_str]['Relative_Humidity'] = float(
                            time_data['elementValue'][0]['value'])
                    elif element_name == 'WS':
                        weather_dict[obs_time_str]['Wind_Speed'] = float(
                            time_data['elementValue'][0]['value'])
                    elif element_name == 'WD':
                        wind_direction_text = time_data['elementValue'][0]['value']
                        weather_dict[obs_time_str]['Wind_Direction'] = wind_direction_dict.get(
                            wind_direction_text, None)
                    elif element_name == 'PoP12h':
                        # 只更新初始的降雨值
                        if precipitation_value is None:
                            precipitation_value = 1 if float(
                                time_data['elementValue'][0]['value']) > 80 else 0

        # 更新所有紀錄中的降雨值
        for obs_time_str in weather_dict:
            weather_dict[obs_time_str]['Precipitation'] = precipitation_value

        weather_list = list(weather_dict.values())
        weather_df = pd.DataFrame(weather_list)

        # 確保每小時都有資料
        start_time = datetime.strptime(
            f"{tomorrow} 06:00:00", '%Y-%m-%d %H:%M:%S')
        end_time = datetime.strptime(
            f"{tomorrow} 18:00:00", '%Y-%m-%d %H:%M:%S')
        all_times = pd.date_range(start=start_time, end=end_time, freq='H')

        # 創建一個包含所有時間的DataFrame
        all_times_df = pd.DataFrame(all_times, columns=['ObservationTime'])

        # 將原有的weather_df與all_times_df合併
        weather_df = all_times_df.merge(
            weather_df, on='ObservationTime', how='left')

        # 將 DataFrame 中的 object 類型轉換為適當的數值類型
        weather_df = weather_df.infer_objects()

        # 使用線性插值填補缺失值
        weather_df.interpolate(method='linear', inplace=True)

        # 填補缺失的降雨值
        weather_df['Precipitation'].fillna(precipitation_value, inplace=True)
        print("2222")
        return weather_df

    else:
        print("Failed to retrieve data")
        return pd.DataFrame()  # 保證總是返回一個 DataFrame


# 處理資料函數
def preprocess_data():
    print("Preprocessing data...")

    try:
        conn = mariadb.connect(**DB_CONFIG)
    except mariadb.Error as e:
        print(f"Error connecting to MariaDB Platform: {e}")
        sys.exit(1)

    cur = conn.cursor()

    # 設定日期範圍
    date_range = "%"

    query = """
        SELECT 
            Date_time, Longitude, Latitude, Altitude, Location, Number, Temperature, 
            Relative_humidity, Wind_speed, Wind_direction, Precipitation, Time_type, Week, Weekday 
        FROM 
            monkey_history
        WHERE
            Date_time LIKE ?
    """
    cur.execute(query, (date_range,))
    rows = cur.fetchall()
    columns = [
        "Date_time",
        "Longitude",
        "Latitude",
        "Altitude",
        "Location",
        "Number",
        "Temperature",
        "Relative_humidity",
        "Wind_speed",
        "Wind_direction",
        "Precipitation",
        "Time_type",
        "Week",
        "Weekday",
    ]
    data_df = pd.DataFrame(rows, columns=columns)

    cur.close()
    conn.close()

    # 處理資料
    data_df["Date_time"] = data_df["Date_time"].astype(str)
    data_df[["date", "hour"]] = data_df["Date_time"].str.split(
        " ", n=1, expand=True)
    data_df["Time_type"] = data_df["hour"].str[0:2].astype(int)
    data_df["Time_type"] = data_df["Time_type"].apply(
        lambda x: 1 if (6 <= x <= 12) else (2 if (13 <= x <= 18) else 3)
    )
    data_df["Week"] = pd.to_datetime(data_df["date"]).dt.weekday + 1
    data_df["Weekday"] = data_df["Week"].apply(
        lambda x: 0 if x in {6, 7} else 1)

    def determine_region(lat, lon, height):
        point = Point(lon, lat)
        closest_region = None
        closest_distance = float("inf")

        for region, info in regions.items():
            polygon = info["polygon"]
            height_range = info["height_range"]

            if height_range[0] <= height <= height_range[1] and polygon.contains(point):
                return region

            # 計算點到多邊形的最近距離
            distance = point.distance(polygon)
            if distance < closest_distance:
                closest_distance = distance
                closest_region = region

        return closest_region

    data_df["Location"] = data_df.apply(
        lambda row: determine_region(
            row["Latitude"], row["Longitude"], row["Altitude"]
        ),
        axis=1,
    )

    data_df = data_df.drop(["date", "hour"], axis=1)

    # 更新處理後的資料回到資料表中
    try:
        conn = mariadb.connect(**DB_CONFIG)
        cur = conn.cursor()
        cur.executemany(
            """
            UPDATE monkey_history SET
            Longitude = ?, Latitude = ?, Altitude = ?, Location = ?, Number = ?, 
            Temperature = ?, Relative_humidity = ?, Wind_speed = ?, Wind_direction = ?, Precipitation = ?, 
            Time_type = ?, Week = ?, Weekday = ?
            WHERE Date_time = ?
            """,
            data_df[
                [
                    "Longitude",
                    "Latitude",
                    "Altitude",
                    "Location",
                    "Number",
                    "Temperature",
                    "Relative_humidity",
                    "Wind_speed",
                    "Wind_direction",
                    "Precipitation",
                    "Time_type",
                    "Week",
                    "Weekday",
                    "Date_time",
                ]
            ].values.tolist(),
        )
        conn.commit()
        cur.close()
        conn.close()
        print("1111")
    except mariadb.Error as e:
        print(f"Error updating MariaDB Platform: {e}")


# 預測資料函數
def predict_model():
    print("Predicting model...")

    try:
        conn = mariadb.connect(**DB_CONFIG)
    except mariadb.Error as e:
        print(f"Error connecting to MariaDB Platform: {e}")
        sys.exit(1)

    cur = conn.cursor()
    query = """
        SELECT 
            Date_time, Location, Number, Temperature, 
            Relative_humidity, Wind_speed, Wind_direction, Precipitation, Time_type, Weekday 
        FROM 
            monkey_history 
    """
    cur.execute(query)
    rows = cur.fetchall()
    columns = [
        "Date_time",
        "Location",
        "Number",
        "Temperature",
        "Relative_humidity",
        "Wind_speed",
        "Wind_direction",
        "Precipitation",
        "Time_type",
        "Weekday",
    ]
    data_df = pd.DataFrame(rows, columns=columns)

    cur.close()
    conn.close()

    # 資料預處理
    data_df["Date_time"] = data_df["Date_time"].astype(str)
    data_df[["date", "hour"]] = data_df["Date_time"].str.split(
        " ", n=1, expand=True)
    data_df['date'] = pd.to_datetime(data_df['date']).astype("int64") / 10**9

    # 將 Location 欄位進行編碼
    data_df["Location"] = data_df["Location"].map(location_mapping)
    data_df["Location"] = data_df["Location"].astype("int64")

    # 選擇要標準化的數值特徵
    numeric_features = ['Temperature', 'Relative_humidity', 'Wind_speed',
                        'Wind_direction']

    # 初始化StandardScaler
    scaler = StandardScaler()

    # 對數值特徵進行標準化
    scaled_features = scaler.fit_transform(data_df[numeric_features])

    # 將標準化後的數據轉換為DataFrame
    scaled_features_df = pd.DataFrame(
        scaled_features, columns=numeric_features)

    # 將標準化後的數據替換回原data_df中
    for feature in numeric_features:
        data_df[feature] = scaled_features_df[feature]

#    #標準化器
#     scaler = StandardScaler()

#     # 用原始數據擬合標準化器
#     scaler.fit(data_df[['Number']])

#     # 標準化目標特徵
#     data_df['Number'] = scaler.transform(data_df[['Number']])
    # 對weekday和Time_type做one_hot_encoding

    data_df = pd.get_dummies(data_df, columns=['Weekday'], drop_first=False)
    data_df = pd.get_dummies(data_df, columns=['Time_type'], drop_first=False)

    # 計算每個類別的頻率
    frequency_encoding = data_df['Location'].value_counts()

    # 創建映射字典
    frequency_dict = frequency_encoding.to_dict()

    # 用 Frequency Encoding 替換 Location 特徵
    data_df['Location'] = data_df['Location'].map(frequency_dict)

    X = data_df.drop(["Number", "Date_time", "hour"], axis=1)

    y = data_df["Number"].values

    model = xgb.XGBRegressor(**best_params)
    model.fit(X, y)

    # # 設定今天的日期
    # today = (datetime.now()).strftime("%Y-%m-%d")
    tomorrow = (datetime.today() + timedelta(days=1)).strftime('%Y-%m-%d')

    weather_df = get_weather()
    if weather_df.empty:
        print("Weather data is not available.")
        return

    # 建立預測資料
    prediction_df = []

    # 確保 weather_df 按照 ObservationTime 排序
    weather_df = weather_df.sort_values('ObservationTime')

    if not weather_df.empty:
        for region, info in region_centers.items():
            for hour in range(6, 19):
                # 根據小時匹配天氣資料
                weather_for_hour = weather_df[weather_df['ObservationTime'].dt.hour == hour]

                if weather_for_hour.empty:
                    # 如果該小時沒有資料，找到最接近的資料
                    # 計算每個時間點與目標小時的時間差
                    weather_df['time_diff'] = (
                        weather_df['ObservationTime'].dt.hour - hour).abs()

                    # 找到時間差最小的資料
                    closest_hour = weather_df.loc[weather_df['time_diff'].idxmin(
                    )]
                    weather_for_hour = closest_hour.to_dict()
                else:
                    weather_for_hour = weather_for_hour.iloc[0].to_dict()

                # 去掉多餘的 'time_diff' 列
                if 'time_diff' in weather_df.columns:
                    weather_df = weather_df.drop(columns=['time_diff'])

                # 創建 one-hot 編碼的 Time_type 和 Weekday
                time_type = 1 if (6 <= hour <= 12) else (
                    2 if (13 <= hour <= 18) else 3)
                weekday = 0 if pd.to_datetime(
                    tomorrow).weekday() in [5, 6] else 1

                # 創建 input_data，並添加 one-hot 編碼列
                input_data = {
                    "date": tomorrow,
                    "hour": f"{hour:02d}:00:00",
                    "Location": region,
                    "Weekday_0": 1 if weekday == 0 else 0,
                    "Weekday_1": 1 if weekday == 1 else 0,
                    "Time_type_1": 1 if time_type == 1 else 0,
                    "Time_type_2": 1 if time_type == 2 else 0,
                    "Time_type_3": 1 if time_type == 3 else 0,
                    "Temperature": weather_for_hour['Temperature'],
                    "Relative_humidity": weather_for_hour['Relative_Humidity'],
                    "Wind_speed": weather_for_hour['Wind_Speed'],
                    "Wind_direction": weather_for_hour['Wind_Direction'],
                    "Precipitation": weather_for_hour['Precipitation'],
                }

                prediction_df.append(input_data)

    prediction_df = pd.DataFrame(prediction_df)

    # 預處理預測資料
    # 確保 'hour' 列的數據類型為字符串
    if prediction_df["hour"].dtype != object:
        prediction_df["hour"] = prediction_df["hour"].astype(str)

    # 提取小時數值
    prediction_df["hour"] = prediction_df["hour"].str.split(
        ":").str[0].astype(int)

    # 將 'date' 列轉換為時間戳（Unix時間）
    prediction_df["date"] = (
        pd.to_datetime(prediction_df["date"]).astype("int64") // 10**9
    )

    # 將 Location 欄位進行編碼
    prediction_df["Location"] = prediction_df["Location"].map(location_mapping)

    # 用 Frequency Encoding 替換 Location 特徵
    prediction_df['Location'] = prediction_df['Location'].map(frequency_dict)

    # 選擇要標準化的數值特徵
    numeric_features = ['Temperature', 'Relative_humidity', 'Wind_speed',
                        'Wind_direction']

    # 初始化StandardScaler
    scaler = StandardScaler()

    # 對數值特徵進行標準化
    scaled_features = scaler.fit_transform(prediction_df[numeric_features])

    # 將標準化後的數據轉換為DataFrame
    scaled_features_df = pd.DataFrame(
        scaled_features, columns=numeric_features)

    # 將標準化後的數據替換回原dprediction_df中
    for feature in numeric_features:
        prediction_df[feature] = scaled_features_df[feature]

    # 重新編排 prediction_df 去對應 training data
    prediction_df = prediction_df[
        [
            "Location",
            "Temperature",
            "Relative_humidity",
            "Wind_speed",
            "Wind_direction",
            "Precipitation",
            "date",
            "hour",
            "Weekday_0",
            "Weekday_1",
            "Time_type_1",
            "Time_type_2",
            "Time_type_3",

        ]
    ]

    y_pred = model.predict(prediction_df.drop('hour', axis=1))

    # 反轉Frequent_encoding
    reverse_frequency_encoding = {v: k for k, v in frequency_encoding.items()}
    prediction_df['Location'] = prediction_df['Location'].map(
        reverse_frequency_encoding)

    # 計算各地區每小時的獼猴數量
    prediction_df["Number"] = y_pred
    hourly_counts = prediction_df[[
        "date", "hour", "Location", "Number"]].copy()

    location_reverse_mapping = {v: k for k, v in location_mapping.items()}
    hourly_counts["Location"] = hourly_counts["Location"].map(
        location_reverse_mapping)

    hourly_counts["date"] = pd.to_datetime(hourly_counts["date"], unit="s").dt.strftime(
        "%Y-%m-%d"
    )

    # 創建 Date_time 欄位
    hourly_counts["Date_time"] = hourly_counts.apply(
        lambda row: f"{row['date']} {int(row['hour']):02d}:00:00", axis=1
    )

    # 僅保留 Date_time, Location, Number
    hourly_counts = hourly_counts[["Date_time", "Location", "Number"]]

    # 新增處理後的資料到資料表中
    try:
        conn = mariadb.connect(**DB_CONFIG)
        cur = conn.cursor()

        cur.executemany(
            """
            INSERT INTO monkey_predict (Date_time, Location, Number)
            VALUES (?, ?, ?)
            ON DUPLICATE KEY UPDATE
                Number = VALUES(Number)
            """,
            hourly_counts[["Date_time", "Location", "Number"]].values.tolist(),
        )
        conn.commit()
        print(
            f"Successfully inserted {cur.rowcount} rows into monkey_predict.")

    except mariadb.Error as e:
        print(f"Error inserting data into MariaDB Platform: {e}")

    finally:
        # 確保游標和連接安全關閉
        if cur:
            cur.close()
        if conn:
            conn.close()


# 建立排程器並設置時區
scheduler = BackgroundScheduler(timezone="Asia/Taipei")
# 測試用，每分鐘呼叫function一次
# scheduler.add_job(preprocess_data, 'cron', minute='*')
# scheduler.add_job(predict_model, 'cron', minute='*')
# # 實際用
scheduler.add_job(preprocess_data, "cron", hour=0, minute=0)  # 半夜12:00
scheduler.add_job(predict_model, "cron", hour=0, minute=5)  # 半夜12:05

print("Scheduler started. Jobs are set up.")
scheduler.start()


@predict.route("/predict_model", methods=["GET"])
def predict_model_endpoint():
    try:
        # 連接到 MariaDB 資料庫
        conn = mariadb.connect(**DB_CONFIG)
    except mariadb.Error as e:
        print(f"Error connecting to MariaDB Platform: {e}")
        sys.exit(1)

    # 創建 Cursor
    cur = conn.cursor()

    try:
        # 計算明天的日期
        tomorrow = (datetime.now() + timedelta(days=1)).strftime('%Y-%m-%d')

        # 從資料庫中提取明天的 Date_time, Location 和 Number 的資料
        query = "SELECT Date_time, Location, Number FROM monkey_predict WHERE DATE(Date_time) = %s"
        cur.execute(query, (tomorrow,))
        rows = cur.fetchall()

        # 將結果轉換為 DataFrame
        columns = [desc[0] for desc in cur.description]
        total_count = pd.DataFrame(rows, columns=columns)

        # 將 Date_time 轉換為 datetime 格式，並提取小時
        total_count["Date_time"] = pd.to_datetime(total_count["Date_time"])
        total_count["Hour"] = total_count["Date_time"].dt.hour

        # 按 Location 和 12 小時內分組，計算每個 12 小時內的平均 Number
        total_count.set_index("Date_time", inplace=True)
        total_count = total_count.groupby([pd.Grouper(freq='12H'), 'Location'])[
            "Number"].mean().reset_index()

        # 定義分級函數
        def categorize_amount(value):
            if value > 15:
                return "大量"
            elif value > 10:
                return "中量"
            else:
                return "少量"

        # 新增分類欄位
        total_count["Category"] = total_count["Number"].apply(
            categorize_amount)

        # 按照 Location 彙總總數和分類
        final_counts = total_count.groupby("Location", as_index=False).agg({
            "Number": "mean",  # 可以選擇使用平均數量作為代表值
            "Category": "first"  # 只取第一個分類結果
        })

        # 最後選擇需要的欄位
        final_counts = final_counts[["Location", "Number", "Category"]]

        # 將 DataFrame 轉換為字典列表並轉換為 JSON 格式
        json_data = final_counts.to_dict(orient='records')

    finally:
        # 確保在完成操作後關閉游標和連接
        cur.close()
        conn.close()

    # json_data = [
    #     {"Location": "國研大樓和體育館", "Category": "少量"},
    #     {"Location": "教學區", "Category": "大量"},
    #     {"Location": "教學區西側", "Category": "中量"},
    #     {"Location": "武嶺", "Category": "大量"},
    #     {"Location": "活動中心", "Category": "大量"},
    #     {"Location": "海院", "Category": "中量"},
    #     {"Location": "翠亨", "Category": "中量"},
    #     {"Location": "電資大樓", "Category": "大量"},
    #     {"Location": "體育場和海提", "Category": "少量"},
    # ]
    return jsonify(json_data)


@predict.route("/details", methods=["POST"])
def get_details():
    req_data = request.get_json()
    location = req_data["location"]

    try:
        conn = mariadb.connect(**DB_CONFIG)
    except mariadb.Error as e:
        print(f"Error connecting to MariaDB Platform: {e}")
        return jsonify({"message": "Error connecting to database."}), 500

    try:
        cur = conn.cursor()

        # 計算明天的日期
        tomorrow = (datetime.now() + timedelta(days=1)).strftime('%Y-%m-%d')

        # 從資料庫中提取明天的 Date_time, Location 和 Number 的資料
        query = """
        SELECT Date_time, Location, Number
        FROM monkey_predict
        WHERE DATE(Date_time) = ? AND Location = ?
        """
        cur.execute(query, (tomorrow, location))
        results = cur.fetchall()

        # 將結果轉換為字典列表
        columns = [desc[0] for desc in cur.description]
        data = [dict(zip(columns, row)) for row in results]

        # 關閉資料庫連接
        cur.close()
        conn.close()

        # 處理 Date_time，只保留小時部分，並轉為整數
        for row in data:
            try:
                # 直接從 datetime 物件提取小時部分
                date_time_obj = row['Date_time']
                row['Date_time'] = date_time_obj.hour  # 小時部分以整數形式表示
            except AttributeError:
                row['Date_time'] = None  # 或者設置為其他適當的值

        return jsonify(data)

    except mariadb.Error as e:
        print(f"Error fetching data from MariaDB Platform: {e}")
        return jsonify({"message": "Error fetching data from database."}), 500
