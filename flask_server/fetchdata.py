from flask import Flask, render_template, jsonify, request, url_for, redirect, session, Blueprint
from flask_cors import CORS
import secrets
import mariadb
import sys
import datetime

# function used to group the data


def group_by_lat_lng(data, tolerance=0.0001):
    groups = []
    for row in data:
        name = row['name']
        quantity = row['quantity']
        latitude = row['latitude']
        longitude = row['longitude']
        time = datetime.datetime.strptime(row['time'], "%Y-%m-%d %H:%M:%S")

        grouped = False

        for group in reversed(groups):
            if abs(group['latitude'] - latitude) <= tolerance and abs(group['longitude'] - longitude) <= tolerance:
                # Update the entry only if the new quantity is greater
                if quantity > group['quantity']:
                    group.update({"quantity": quantity})
                # Also update time to the latest if the quantity is the same
                grouped = True
                break
        if not grouped:
            groups.append({
                "name": name, "quantity": quantity, "latitude": latitude, "longitude": longitude, "time": time})

    return groups


# 建立實體
fetchdata = Blueprint('fetchdata', __name__,
                      template_folder='../Home')
CORS(fetchdata)  # 跨平台使用

fetchdata.secret_key = secrets.token_hex(16)  # 保護session


@fetchdata.route('/')
def index():
    return render_template("index.tsx")


@fetchdata.route('/api/data/getRealTimeData', methods=['GET'])
def get_RealTimeData():
    try:
        conn = mariadb.connect(
            user="root",  # 輸入你的user名稱
            password="mis114monkey",  # 輸入你的user密碼
            host="127.0.0.1",  # 輸入你的ip
            port=3307,  # 輸入你的port號，基本上都是3306
            database="mis114_monkey"  # 輸入你的資料庫名稱
        )

    except mariadb.Error as e:
        print(f"Error connecting to MariaDB Platform: {e}")
        sys.exit(1)

    # 取得資料庫的指標(類似pointer的意思，不須理解)
    cur = conn.cursor()
    cur.execute(
        "SELECT Location, Longitude, Latitude, NUMBER AS Quantity, Date_time FROM monkey_history WHERE Date_time BETWEEN NOW() - INTERVAL 45 MINUTE AND NOW()",
    )

    transformed_data = [
        {
            "name": row[0],
            "longitude":row[1],
            "latitude": row[2],
            "quantity": row[3],
            "time": row[4].strftime("%Y-%m-%d %H:%M:%S")
        } for row in cur
    ]
    grouped_data = group_by_lat_lng(transformed_data)
    conn.commit()
    conn.close()
    return jsonify(grouped_data)


# 執行程式
if __name__ == '__main__':
    fetchdata.run(host="0.0.0.0", port=5000)  # 我先設這個，有更好的話可以直接提出來討論修改
