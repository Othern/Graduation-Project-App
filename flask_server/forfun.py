from flask import Flask, render_template, jsonify, request, url_for, redirect, session, Blueprint
from flask_cors import CORS
import secrets
import mariadb
import sys
import datetime


# 建立實體
forfun = Blueprint('forfun', __name__,
                   template_folder='../ForFun/Overview/Template')
CORS(forfun)  # 跨平台使用

forfun.secret_key = secrets.token_hex(16)  # 保護session


@forfun.route('/')
def index():
    return render_template("index.tsx")


@forfun.route('/api/data/getCommentData', methods=['POST'])
def get_PostData():
    data = request.get_json()
    pid = data.get('pid')
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
        "SELECT M.Message_ID, U.User_name, M.Message_content, U.Headimg_link, M.Message_time FROM user AS U JOIN message AS M ON U.PID = M.PID WHERE M.Post_ID = ?  ORDER BY M.Message_time",
        (pid,)
    )

    transformed_data = [
        {
            "id": row[0],
            "username":row[1],
            "content": row[2],
            "avatarUrl": row[3],
            "timestamp": row[4].strftime("%Y-%m-%d %H:%M:%S")
        } for row in cur
    ]
    return jsonify(transformed_data)


# 執行程式
if __name__ == '__main__':
    forfun.run(host="0.0.0.0", port=5000)  # 我先設這個，有更好的話可以直接提出來討論修改
