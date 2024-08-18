from flask import Flask, render_template, jsonify, request, url_for, redirect, session, Blueprint
from flask_cors import CORS
import secrets
import mariadb
import sys
import json
from werkzeug.utils import secure_filename
from pypinyin import lazy_pinyin


# 建立實體
modify = Blueprint('modify', __name__,
                   template_folder='..\\Profile\\Modify\\Head')
CORS(modify)  # 跨平台使用

modify.secret_key = secrets.token_hex(16)  # 保護session

# 獲取所需API
with open('../config.json') as f:
    config = json.load(f)
url = config["URl"]

@modify.route('/')
def index():
    return render_template("index.tsx")


@modify.route('/ModifyPassword', methods=["GET", "POST"])
def change_password():
    if request.method == "POST":
        # 取表單資料
        data = request.get_json()
        email = data.get('currentEmail')
        old_pw = data.get('oldPassword')
        new_pw = data.get('newPassword')

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
        cur.execute("SELECT Password FROM user WHERE Email=? LIMIT 1", (email,))
        rows = cur.fetchall()
        if rows:
            for row in rows:
                if old_pw == str(row[0]) and old_pw != new_pw and new_pw.isalnum():
                    try:
                        cur.execute(
                            "UPDATE user SET Password=? WHERE Email=?", (new_pw, email))
                        conn.commit()
                    except mariadb.Error as e:
                        print(f"Error: {e}")
                    session['state'] = "success"
                else:
                    session['state'] = "wrong"

        else:
            session['state'] = "wrong"
        conn.close()

        return redirect(url_for("modify.change_password"))  # 網頁重新導向，避免重複提交資料
    # 讀取session資料
    state = session.get('state', "wrong")
    session.clear()  # 將session裡的資料清除

    return jsonify({"state": state})


@modify.route('/ModifyUsername', methods=["GET", "POST"])
def change_username():
    if request.method == "POST":
        # 取表單資料
        data = request.get_json()
        email = data.get('currentEmail')
        new_name = data.get('newUsername')

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
        cur.execute(
            "SELECT User_name FROM user WHERE Email=? LIMIT 1", (email,))
        rows = cur.fetchall()
        if rows:
            cur.execute(
                "SELECT User_name FROM user WHERE User_name=? LIMIT 1", (new_name,))
            rows = cur.fetchall()
            if rows:
                session['state'] = "wrong"
            else:
                cur.execute(
                    "UPDATE user SET User_name=? WHERE Email=?", (new_name, email))
                conn.commit()
                session['state'] = "success"
        else:
            session['state'] = "wrong"
        conn.close()

        return redirect(url_for("modify.change_username"))  # 網頁重新導向，避免重複提交資料
    # 讀取session資料
    state = session.get('state', "wrong")
    session.clear()  # 將session裡的資料清除

    return jsonify({"state": state})


@modify.route('/ModifyHeadImg', methods=["GET", "POST"])
def change_headimg():
    if request.method == "POST":
        # 取表單資料
        image = request.files['image']
        email = request.form['email']
        image_name = image.filename
        image_name = secure_filename(''.join(lazy_pinyin(image_name)))

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

        image.save(f'static/headImg/{image_name}')
        img_path = url + "static/headImg/" + image_name

        # 讀取資料庫資料
        cur = conn.cursor()
        cur.execute("UPDATE user SET Headimg_link=? WHERE Email=?",
                    (img_path, email))
        conn.commit()
        conn.close()
        session['success'] = 1
        session['headImg'] = img_path

        return redirect(url_for("modify.change_headimg"))  # 網頁重新導向，避免重複提交資料
    # 讀取session資料
    success = session.get('success', 0)
    headImg = session.get('headImg', "")
    session.clear()  # 將session裡的資料清除

    return jsonify({"success": success, "headImg": headImg})

# 執行程式
if __name__ == '__main__':
    modify.run(host="0.0.0.0", port=5000)  # 我先設這個，有更好的話可以直接提出來討論修改
