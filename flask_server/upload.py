from flask import Flask, render_template, jsonify, request, url_for, redirect, session, Blueprint
from flask_cors import CORS
import secrets
import mariadb
import sys
import datetime
import json
from werkzeug.utils import secure_filename
from pypinyin import lazy_pinyin
import os

# 建立實體
upload = Blueprint('upload', __name__,
                   template_folder='../ForFun/Upload')
CORS(upload)  # 跨平台使用

upload.secret_key = secrets.token_hex(16)  # 保護session

# 獲取所需API
with open('../config.json') as f:
    config = json.load(f)
url = config["URl"]

@upload.route('/')
def index():
    return render_template("index.tsx")


@upload.route('/forFunSubmit', methods=["GET", "POST"])
def forFun_submit():
    if request.method == "POST":
        media = request.files['media']
        email = request.form['email']
        category = request.form['category']
        text = request.form['text']
        media_name = media.filename
        media_type = media.content_type
        media_name = secure_filename(''.join(lazy_pinyin(media_name)))
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
        media_name = str(
            userid) + '_' + str(datetime.datetime.now().strftime("%Y-%m-%d-%H-%M-%S")) + '_' + media_name

        media.save(f'static/forFun/{media_name}')
        media_path = url + "static/forFun/" + media_name
        x = datetime.datetime(2024, 8, 2)  # baseline
        now = datetime.datetime.now()
        delta = now - x
        cur.execute(
            "INSERT INTO post (`PID`,  `Heart_sum`,  `Post_type`, `Content`, `Path`, `Post_time`, `Post_phase`, `Type`) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
            (userid, 0, category, text, media_path,
             datetime.datetime.now(), int((delta.days) / 7) + 1, media_type)
        )
        conn.commit()
        conn.close()
        session['ok'] = 1
        return redirect(url_for("upload.forFun_submit"))
    ok = session.get('ok', 0)
    session.clear()
    return jsonify({"ok": ok})


@upload.route('/forFunRevise', methods=["GET", "POST"])
def forFun_Revise():
    if request.method == "POST":
        reviseMedia = request.form['reviseMedia']
        if reviseMedia == 'true':
            media = request.files['media']
            media_name = media.filename
            media_type = media.content_type
            media_name = secure_filename(''.join(lazy_pinyin(media_name)))
        email = request.form['email']
        print(email)
        PostId = request.form['PostId']
        text = request.form['text']
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

        cur = conn.cursor()
        cur.execute(
            "SELECT PID FROM user WHERE Email = ?",
            (email,)
        )
        for row in cur:
            userid = row[0]

        if reviseMedia == 'true':
            media_name = str(
                userid) + '_' + str(datetime.datetime.now().strftime("%Y-%m-%d-%H:%M:%S")) + '_' + media_name
            media.save(f'static/forFun/{media_name}')
            media_path = url + "static/forFun/" + media_name
        # 取得資料庫的指標(類似pointer的意思，不須理解)

        if reviseMedia == 'true':
            cur.execute(
                "UPDATE post SET `Content` = ?, `Path` = ?, `Type` = ? WHERE PID = ? AND Post_ID = ?",
                (text, media_path, media_type, userid, PostId)
            )
        else:
            cur.execute(
                "UPDATE post SET `Content` = ? WHERE PID = ? AND Post_ID = ?",
                (text, userid, PostId)
            )
        conn.commit()
        conn.close()
        session['ok'] = 1
        return redirect(url_for("upload.forFun_Revise"))
    ok = session.get('ok', 0)
    session.clear()
    return jsonify({"ok": ok})


# 執行程式
if __name__ == '__main__':
    upload.run(host="0.0.0.0", port=5000)  # 我先設這個，有更好的話可以直接提出來討論修改
