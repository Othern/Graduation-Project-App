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
import xgboost as xgb
from sklearn.metrics import mean_squared_error as MSE
from apscheduler.schedulers.background import BackgroundScheduler
from pytz import timezone
import json

predict = Blueprint('predict', __name__, template_folder='C:\\Users\\work\\AwesomeProject\\Graduation-Project-App')
CORS(predict) # 跨平台使用

predict.secret_key = secrets.token_hex(16) # 保護session

# 資料庫連接設置
DB_CONFIG = {
    'user': "root",
    'password': "mis114monkey",
    'host': "127.0.0.1",
    'port': 3307,
    'database': "mis114_monkey"
}

# 定義區域範圍和其他全域變數
regions = {
    '武嶺': {
        'polygon': Polygon([
            (120.26325051366383, 22.63131423396974),
            (120.26351467795561, 22.62887597596471),
            (120.26450301677248, 22.62887177203434),
            (120.26432538905905, 22.631293214689123)
        ]),
        'height_range': (25, 60)
    },
    '翠亨': {
        'polygon': Polygon([
            (120.26739872290042, 22.629042764151503),
            (120.26896906806277, 22.628982579258686),
            (120.27060958570415, 22.62734367060859),
            (120.27050405511919, 22.626981870689427),
            (120.26897993547175, 22.62736760811727),
            (120.2678062518902, 22.627302407020913),
            (120.26773017980621, 22.62794940114626),
            (120.26742045774996, 22.628220234992206)
        ]),
        'height_range': (30, 63)
    },
    '文學院和藝術學院': {
        'polygon': Polygon([
            (120.26004403737878, 22.634358736379614),
            (120.26087998875826, 22.63509459203184),
            (120.26277012981159, 22.63411932084963),
            (120.26270181146026, 22.633967985045803),
            (120.26099122390026, 22.63367352441278)
        ]),
        'height_range': (40, 100)
    },
    '教學區': {
        'polygon': Polygon([
            (120.2649867912452, 22.627934634912),
            (120.26665947721433, 22.62800519070175),
            (120.26672348274266, 22.625188569280787),
            (120.26502358913307, 22.625252328820903)
        ]),
        'height_range': (3, 15)
    },
    '電資大樓': {
        'polygon': Polygon([
            (120.26676668285094,  22.628117734802885),
            (120.26771890129012, 22.627647133207333),
            (120.26774063617125, 22.626834626681056),
            (120.26730593854845, 22.6267744408214),
            (120.26728420366733, 22.625936851539322),
            (120.26675537600254, 22.625964327607832)
        ]),
        'height_range': (7, 31)
    },
    '活動中心': {
        'polygon': Polygon([
            (120.26440449075304, 22.628717980001145),
            (120.26577541233628, 22.628486763368834),
            (120.26574353043898, 22.627994901239084),
            (120.26497381034739, 22.62797388145074),
            (120.26440212619337, 22.627966381710543)
        ]),
        'height_range': (7, 33)
    },
    '海院': {
        'polygon': Polygon([
            (120.26067338088106, 22.632473951480502),
            (120.26148583595372, 22.632751866309285),
            (120.26400476123293, 22.62797105002212),
            (120.26370698532007, 22.627696195896384),
            (120.26249702154453, 22.628315597055096)
        ]),
        'height_range': (1, 15)
    },
    '國研大樓和體育館': {
        'polygon': Polygon([
            (120.2650612786277, 22.625221018773832),
            (120.26667509215821, 22.62513157919756),
            (120.26669081115945, 22.62410391046685),
            (120.26614828403213, 22.623250905185703),
            (120.2658354612267, 22.62327525779414),
            (120.26576004235405, 22.624311433174963),
            (120.2650765792699, 22.62432803497808)
        ]),
        'height_range': (1, 20)
    },
     '教學區西側': {
        'polygon': Polygon([
            (120.26402911107782, 22.62797854782038),
            (120.26436706941979, 22.624368872784316),
            (120.26497861310409, 22.624349066350128),
            (120.26494485491602, 22.627903762845577)
        ]),
        'height_range': (2, 10)
    },
    '體育場和海堤': {
        'polygon': Polygon([
            (120.2611410286546, 22.622881429509075),
            (120.26414581056034,22.624357088129894),
            (120.26576591199168, 22.624287774725346),
            (120.26569630672408, 22.62171779289629)
        ]),
        'height_range': (1, 3)
    }
}

location_mapping = {
    '國研大樓和體育館': 0,
    '教學區': 1,
    '教學區西側': 2,
    '文學院和藝術學院': 3,
    '武嶺': 4,
    '活動中心': 5,
    '海院': 6,
    '翠亨': 7,
    '電資大樓': 8,
    '體育場和海堤': 9
}

# 模型超參數
best_params = {
    'max_depth': 8,
    'subsample': 0.9032802481376583,
    'n_estimators': 100,
    'eta': 0.03739459164632489,
    'min_child_weight': 8,
    'grow_policy': 'lossguide',
    'colsample_bytree': 0.9873584134757056
}

# 全域變數
final_counts = None

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
            Date_time, Longitude, Latitude, Altitude, Location, Number, Pressure, Temperature, 
            Relative_humidity, Wind_speed, Wind_direction, Precipitation, Time_type, Week, Weekday 
        FROM 
            monkey_history
        WHERE
            Date_time LIKE ?
    """
    cur.execute(query, (date_range,))
    rows = cur.fetchall()
    columns = [
        'Date_time', 'Longitude', 'Latitude', 'Altitude', 'Location', 'Number', 'Pressure', 
        'Temperature', 'Relative_humidity', 'Wind_speed', 'Wind_direction', 'Precipitation', 
        'Time_type', 'Week', 'Weekday'
    ]
    data_df = pd.DataFrame(rows, columns=columns)

    cur.close()
    conn.close()

    # 處理資料
    data_df['Date_time'] = data_df['Date_time'].astype(str)
    data_df[['date', 'hour']] = data_df['Date_time'].str.split(' ', n=1, expand=True)
    data_df['Time_type'] = data_df['hour'].str[0:2].astype(int)
    data_df['Time_type'] = data_df['Time_type'].apply(lambda x: 1 if (6 <= x <= 12) else (2 if (13 <= x <= 18) else 3))
    data_df['Week'] = pd.to_datetime(data_df['date']).dt.weekday + 1
    data_df['Weekday'] = data_df['Week'].apply(lambda x: 0 if x in {6, 7} else 1)
    
    def determine_region(lat, lon, height):
        point = Point(lon, lat)
        closest_region = None
        closest_distance = float('inf')

        for region, info in regions.items():
            polygon = info['polygon']
            height_range = info['height_range']
            
            if height_range[0] <= height <= height_range[1] and polygon.contains(point):
                return region
            
            # 計算點到多邊形的最近距離
            distance = point.distance(polygon)
            if distance < closest_distance:
                closest_distance = distance
                closest_region = region

        return closest_region

    data_df['Location'] = data_df.apply(lambda row: determine_region(row['Latitude'], row['Longitude'], row['Altitude']), axis=1)
   
    
    data_df = data_df.drop(['date', 'hour'], axis=1)

    # 更新處理後的資料回到資料表中
    try:
        conn = mariadb.connect(**DB_CONFIG)
        cur = conn.cursor()
        cur.executemany(
            """
            UPDATE monkey_history SET
            Longitude = ?, Latitude = ?, Altitude = ?, Location = ?, Number = ?, Pressure = ?, 
            Temperature = ?, Relative_humidity = ?, Wind_speed = ?, Wind_direction = ?, Precipitation = ?, 
            Time_type = ?, Week = ?, Weekday = ?
            WHERE Date_time = ?
            """,
            data_df[['Longitude', 'Latitude', 'Altitude', 'Location', 'Number', 'Pressure', 
                     'Temperature', 'Relative_humidity', 'Wind_speed', 'Wind_direction', 'Precipitation', 
                     'Time_type', 'Week', 'Weekday', 'Date_time']].values.tolist()
        )
        conn.commit()
        cur.close()
        conn.close()
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
            Date_time, Longitude, Latitude, Altitude, Location, Number, Pressure, Temperature, 
            Relative_humidity, Wind_speed, Wind_direction, Precipitation, Time_type, Week, Weekday 
        FROM 
            monkey_history 
    """
    cur.execute(query)
    rows = cur.fetchall()
    columns = [
        'Date_time', 'Longitude', 'Latitude', 'Altitude', 'Location', 'Number', 'Pressure', 
        'Temperature', 'Relative_humidity', 'Wind_speed', 'Wind_direction', 'Precipitation', 
        'Time_type', 'Week', 'Weekday'
    ]
    data_df = pd.DataFrame(rows, columns=columns)

    cur.close()
    conn.close()

    # 資料預處理
    data_df['Date_time'] = data_df['Date_time'].astype(str)
    data_df[['date', 'hour']] = data_df['Date_time'].str.split(' ', n=1, expand=True)
    # 如果 'hour' 列不是字符串類型，則將其轉換為字符串
    if data_df['hour'].dtype != object:
        data_df['hour'] = data_df['hour'].astype(str)

    # 提取小時數值
    data_df['hour'] = data_df['hour'].str.split(':').str[0].astype(int)
    # 將日期轉換為數值時間戳
    data_df['date'] = pd.to_datetime(data_df['date']).astype('int64') // 10**9

   
    # 將 Location 欄位進行編碼
    data_df['Location'] = data_df['Location'].map(location_mapping)
    data_df['Location'] = data_df['Location'].astype(int)
    data_df['hour'] = data_df['hour'].astype(int)
  

    X = data_df.drop(['Number', 'Date_time'], axis=1)
    
    y = data_df['Number'].values

    model = xgb.XGBRegressor(**best_params)
    model.fit(X, y)

    # 設定明天的日期
    tomorrow = (datetime.now() + timedelta(days=1)).strftime('%Y-%m-%d')

    # 定義各區域的中心點經緯度
    region_centers = {
        '武嶺': (120.263751, 22.630101),
        '翠亨': (120.268184, 22.627162),
        '文學院和藝術學院': (120.261477, 22.634256),
        '教學區': (120.265847, 22.626845),
        '電資大樓': (120.267177, 22.627887),
        '活動中心': (120.265060, 22.628629),
        '海院': (120.262265, 22.629662),
        '國研大樓和體育館': (120.265229, 22.624883),
        '教學區西側': (120.264330, 22.626300),
        '體育場和海堤': (120.264437, 22.623661)
    }

    prediction_df = []

    for region, (lon, lat) in region_centers.items():
        for hour in range(8, 19):
            input_data = {
                'date': tomorrow,
                'hour': f'{hour:02d}:00:00',
                'Longitude': lon,
                'Latitude': lat,
                'Location': region,
                'Time_type': 1 if (6 <= hour <= 12) else (2 if (13 <= hour <= 18) else 3),
                'Week': pd.to_datetime(tomorrow).weekday() + 1,
                'Weekday': 0 if pd.to_datetime(tomorrow).weekday() in [5, 6] else 1,
                # 以下氣象資料還未接爬取天氣資料，還會修改
                'Altitude': data_df['Altitude'].mean(),  # 平均海拔高度
                'Pressure': data_df['Pressure'].mean(),  # 平均氣壓
                'Temperature': data_df['Temperature'].mean(),  # 平均氣溫
                'Relative_humidity': data_df['Relative_humidity'].mean(),  # 平均相對溼度
                'Wind_speed': data_df['Wind_speed'].mean(),  # 平均風速
                'Wind_direction': data_df['Wind_direction'].mean(),  # 平均風向
                'Precipitation': 0
            }
            input_data['Location'] = region
            prediction_df.append(input_data)

    prediction_df = pd.DataFrame(prediction_df)

    # 預處理預測資料
    # 確保 'hour' 列的數據類型為字符串
    if prediction_df['hour'].dtype != object:
        prediction_df['hour'] = prediction_df['hour'].astype(str)

    # 提取小時數值
    prediction_df['hour'] = prediction_df['hour'].str.split(':').str[0].astype(int)

    # 將 'date' 列轉換為時間戳（Unix時間）
    prediction_df['date'] = pd.to_datetime(prediction_df['date']).astype('int64') // 10**9


    # 將 Location 欄位進行編碼
    prediction_df['Location'] = prediction_df['Location'].map(location_mapping)

    
    # 重新編排 prediction_df 去對應 training data
    prediction_df = prediction_df[['Longitude', 'Latitude', 'Altitude', 'Location', 'Pressure',
       'Temperature', 'Relative_humidity', 'Wind_speed', 'Wind_direction',
       'Precipitation', 'Time_type', 'Week', 'Weekday', 'date', 'hour']]

    y_pred = model.predict(prediction_df)
    y_pred = y_pred.round().astype(int)  # 預測結果轉換為整數

    # 計算各地區每小時的獼猴數量
    prediction_df['Number'] = y_pred
    hourly_counts = prediction_df[['date', 'hour', 'Location', 'Number']].copy()

    location_reverse_mapping = {v: k for k, v in location_mapping.items()}
    hourly_counts['Location'] = hourly_counts['Location'].map(location_reverse_mapping)
   
    hourly_counts['date'] = pd.to_datetime(hourly_counts['date'], unit='s').dt.strftime('%Y-%m-%d')

    # 創建 Date_time 欄位
    hourly_counts['Date_time'] = hourly_counts.apply(
        lambda row: f"{row['date']} {int(row['hour']):02d}:00:00", axis=1
    )

    # 僅保留 Date_time, Location, Number
    hourly_counts = hourly_counts[['Date_time', 'Location', 'Number']]

    # 新增處理後的資料到資料表中
    try:
        conn = mariadb.connect(**DB_CONFIG)
        cur = conn.cursor()

        cur.executemany(
            """
            INSERT INTO monkey_predict (Date_time, Location, Number)
            VALUES (?, ?, ?)
            """,
            hourly_counts[['Date_time', 'Location', 'Number']].values.tolist()
        )
        conn.commit()
        cur.close()
        conn.close()
        
    except mariadb.Error as e:
        print(f"Error inserting data into MariaDB Platform: {e}")

    # 確保每個地區只有一行，將每小時的數量相加
    total_counts = hourly_counts.groupby(['Location'])['Number'].sum().reset_index()

    # 分級少量、中量、大量
    def categorize_amount(number):
        if number <= 40:
            return '少量'
        elif number <= 60:
            return '中量'
        else:
            return '大量'

    total_counts['Category'] = total_counts['Number'].apply(categorize_amount)

    # 最後選擇需要的欄位
    final_counts = total_counts[['Location', 'Number', 'Category']]
    # 返回結果
    return jsonify(final_counts.to_dict(orient='records'))


# 建立排程器並設置時區
scheduler = BackgroundScheduler(timezone='Asia/Taipei')
#測試用，每分鐘呼叫function一次
# scheduler.add_job(preprocess_data, 'cron', minute='*')
# scheduler.add_job(predict_model, 'cron', minute='*')
#實際用
scheduler.add_job(preprocess_data, 'cron', hour=0, minute=0)#半夜12:00
scheduler.add_job(predict_model, 'cron', hour=0, minute=5)#半夜12:05

print("Scheduler started. Jobs are set up.")
scheduler.start()


# 渲染頁面
@predict.route('/')
def index():
    return render_template("Prediction\\index.tsx")

@predict.route('/preprocess', methods=['GET'])
def preprocess_endpoint():
    preprocess_data()
    return jsonify({"message": "Data preprocessing completed successfully."})

@predict.route('/predict_model', methods=['GET'])
def predict_model_endpoint():
    global final_counts  # 使用全域變數

    if final_counts is None:
        return jsonify({"error": "No data available."}), 404

    # 將 DataFrame 轉換為字典列表並轉換為 JSON 格式
    json_data = final_counts.to_dict(orient='records')

    return jsonify(json_data)


@predict.route('/details', methods=['POST'])
def get_details():
    # 從資料庫中抓取資料，返回給前端
    try:
        conn = mariadb.connect(**DB_CONFIG)
        cur = conn.cursor()
        tomorrow = (datetime.datetime.now() + datetime.timedelta(days=1)).strftime('%Y-%m-%d')
        query = """
        SELECT Date_time, Location, Number
        FROM monkey_predict
        WHERE Date_time BETWEEN ? AND ?
        """
        start_time = f"{tomorrow} 00:00:00"
        end_time = f"{tomorrow} 23:59:59"
        cur.execute(query, (start_time, end_time))
        results = cur.fetchall()
        columns = [desc[0] for desc in cur.description]
        data = [dict(zip(columns, row)) for row in results]
        cur.close()
        conn.close()
        return jsonify(data)
    except mariadb.Error as e:
        print(f"Error fetching data from MariaDB Platform: {e}")
        return jsonify({"message": "Error fetching data from database."}), 500


