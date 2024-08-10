from flask import Flask, render_template, jsonify, request, url_for, redirect, session, Blueprint
from flask_cors import CORS
import secrets
import mariadb
import sys
import datetime


# 建立實體
title = Blueprint('title', __name__,
                  template_folder='../ForFun/Overview/UserTitle')
CORS(title)  # 跨平台使用

title.secret_key = secrets.token_hex(16)  # 保護session


@title.route('/')
def index():
    return render_template("index.tsx")


@title.route('/GetUserTitleList', methods=['POST'])
def get_UserTitleList():
    data = request.get_json()
    email = data.get('email')
    title_list = ['無']
    current_title = 0
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
        "SELECT PID FROM user WHERE Email = ?",
        (email,)
    )
    for row in cur:
        userid = row[0]
    cur.execute(
        "SELECT Title, used FROM user_title WHERE PID = ?",
        (userid,)
    )
    for row in cur:
        title_list.append(row[0])
        if (row[1] == 'Y'):
            current_title = row[0]

    conn.commit()
    conn.close()
    if (current_title):
        return jsonify({"titleList": title_list, "currentTitle": current_title, "state": "success"})
    else:  # 如果沒設置Title
        return jsonify({"titleList": title_list, "currentTitle": '無', "state": "success"})


@title.route('/ChangeUserTitle', methods=['POST'])
def change_UserTitle():
    data = request.get_json()
    email = data.get('email')
    changedTitle = data.get('newTitle')
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
        "SELECT PID FROM user WHERE Email = ?",
        (email,)
    )
    for row in cur:
        userid = row[0]
    cur.execute(
        "UPDATE user_title SET Used = ? WHERE PID = ?",
        ('N', userid))
    if (changedTitle != "無"):
        cur.execute(
            "UPDATE user_title SET Used = ? WHERE PID = ? AND Title = ?",
            ('Y', userid, changedTitle)
        )
    conn.commit()
    conn.close()

    return jsonify({"state": "success"})


# 執行程式
if __name__ == '__main__':
    title.run(host="0.0.0.0", port=5000)  # 我先設這個，有更好的話可以直接提出來討論修改
