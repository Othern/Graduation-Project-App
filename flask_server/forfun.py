from flask import Flask, render_template, jsonify, request, url_for, redirect, session, Blueprint
from flask_cors import CORS
import secrets
import mariadb
import sys
import datetime
import os

# 建立實體
forfun = Blueprint('forfun', __name__,
                   template_folder='../ForFun/Overview/Template')
CORS(forfun)  # 跨平台使用

forfun.secret_key = secrets.token_hex(16)  # 保護session


@forfun.route('/')
def index():
    return render_template("index.tsx")


@forfun.route('/api/data/getCommentData', methods=['POST'])
def get_CommentData():
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
    cur2 = conn.cursor()
    cur.execute(
        "SELECT M.Message_ID, U.User_name, M.Message_content, U.Headimg_link, M.Message_time, U.PID FROM user AS U JOIN message AS M ON U.PID = M.PID WHERE M.Post_ID = ?  ORDER BY M.Message_time",
        (pid,)
    )

    transformed_data = []
    for row in cur:
        cur2.execute(
            "SELECT Title FROM user_title WHERE PID = ? AND Used = ?",
            (row[5], 'Y')
        )
        rows = cur2.fetchone()
        if rows:
            transformed_data.append({
                "id": row[0],
                "mockTitle": rows[0],
                "username": row[1],
                "content": row[2],
                "avatarUrl": row[3],
                "timestamp": row[4].strftime("%Y-%m-%d %H:%M:%S")
            })
        else:
            transformed_data.append({
                "id": row[0],
                "mockTitle": ' ',
                "username": row[1],
                "content": row[2],
                "avatarUrl": row[3],
                "timestamp": row[4].strftime("%Y-%m-%d %H:%M:%S")
            })
    conn.commit()
    conn.close()
    return jsonify(transformed_data)


@forfun.route('/api/data/getPostData', methods=['POST'])
def get_PostData():
    data = request.get_json()
    kind = data.get('kind')
    print(kind)
    email = data.get('email')
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
    cur2 = conn.cursor()
    cur.execute(
        "SELECT PID FROM user WHERE Email = ?",
        (email,)
    )
    for row in cur:
        userid = row[0]
    cur.execute(
        "SELECT Post_id FROM user_heart_history WHERE PID = ?",
        (userid,)
    )

    data = []
    for i in cur:
        data.append(int(i[0]))
    x = datetime.datetime(2024, 8, 1)  # baseline
    now = datetime.datetime.now()
    delta = now - x
    period = int((delta.days) / 7) + 1
    if (kind != 'recent'):
        cur.execute(
            "SELECT P.Post_id, U.User_name, P.Content, U.Headimg_link, P.Type, P.Heart_sum, P.Path, P.PID FROM user AS U JOIN post AS P ON U.PID = P.PID WHERE P.Post_type = ? AND P.Post_phase = ? ORDER BY P.Post_time",
            (kind, period)
        )
    else:
        cur.execute(
            "SELECT P.Post_id, U.User_name, P.Content, U.Headimg_link, P.Type, P.Heart_sum, P.Path, P.PID FROM user AS U JOIN post AS P ON U.PID = P.PID WHERE P.Post_phase = ? ORDER BY P.Post_time",
            (period,)
        )
    transformed_data = []
    for row in cur:
        cur2.execute(
            "SELECT Title FROM user_title WHERE PID = ? AND Used = ?",
            (row[7], 'Y')
        )
        rows = cur2.fetchone()
        if rows:
            transformed_data.append({
                "id": str(row[0]),
                "name": str(row[1]),
                "mockTitle": rows[0],
                "description": str(row[2]),
                "avatarUrl": row[3],
                "image": 'image' in row[4],
                "contentUri": row[6],
                "like": row[0] in data,
                "hearts": row[5]
            })
        else:
            transformed_data.append({
                "id": str(row[0]),
                "name": str(row[1]),
                "mockTitle": ' ',
                "description": str(row[2]),
                "avatarUrl": row[3],
                "image": 'image' in row[4],
                "contentUri": row[6],
                "like": row[0] in data,
                "hearts": row[5]
            })

    conn.commit()
    conn.close()
    return jsonify(transformed_data)


@forfun.route('/api/data/getMyPostData', methods=['POST'])
def get_MyPostData():
    data = request.get_json()
    email = data.get('email')
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
    cur2 = conn.cursor()
    cur.execute(
        "SELECT PID FROM user WHERE Email = ?",
        (email,)
    )
    for row in cur:
        userid = row[0]
    cur.execute(
        "SELECT Post_id FROM user_heart_history WHERE PID = ?",
        (userid,)
    )

    data = []
    for i in cur:
        data.append(int(i[0]))
    x = datetime.datetime(2024, 8, 2)  # baseline
    now = datetime.datetime.now()
    delta = now - x
    cur.execute(
        "SELECT P.Post_id, U.User_name, P.Content, U.Headimg_link, P.Type, P.Heart_sum, P.Path, P.PID FROM user AS U JOIN post AS P ON U.PID = P.PID WHERE P.PID = ? ORDER BY P.Post_time",
        (userid,)
    )
    transformed_data = []
    for row in cur:
        cur2.execute(
            "SELECT Title FROM user_title WHERE PID = ? AND Used = ?",
            (row[7], 'Y')
        )
        rows = cur2.fetchone()
        if rows:
            transformed_data.append({
                "id": str(row[0]),
                "name": str(row[1]),
                "mockTitle": rows[0],
                "description": str(row[2]),
                "avatarUrl": row[3],
                "image": 'image' in row[4],
                "contentUri": row[6],
                "like": row[0] in data,
                "hearts": row[5]
            })
        else:
            transformed_data.append({
                "id": str(row[0]),
                "name": str(row[1]),
                "mockTitle": ' ',
                "description": str(row[2]),
                "avatarUrl": row[3],
                "image": 'image' in row[4],
                "contentUri": row[6],
                "like": row[0] in data,
                "hearts": row[5]
            })

    conn.commit()
    conn.close()
    return jsonify(transformed_data)


@forfun.route('/api/data/getPreviousPostData', methods=['POST'])
def get_PreviousPostData():
    data = request.get_json()
    kind = data.get('kind')
    print(kind)
    period = data.get('period')
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
    cur2 = conn.cursor()

    x = datetime.datetime(2024, 8, 2)  # baseline
    now = datetime.datetime.now()
    delta = now - x
    periods = int((delta.days) / 7)
    if period == 0:
        cur.execute(
            "SELECT P.Post_id, U.User_name, P.Content, U.Headimg_link, P.Type, P.Heart_sum, P.Path, P.PID FROM user AS U JOIN post AS P ON U.PID = P.PID WHERE P.Post_type = ? AND P.Post_phase = ? ORDER BY P.Heart_sum DESC",
            (kind, periods)
        )
    else:
        cur.execute(
            "SELECT P.Post_id, U.User_name, P.Content, U.Headimg_link, P.Type, P.Heart_sum, P.Path, P.PID FROM user AS U JOIN post AS P ON U.PID = P.PID WHERE P.Post_type = ? AND P.Post_phase = ? ORDER BY P.Heart_sum",
            (kind, period)
        )
    transformed_data = []
    for row in cur:
        cur2.execute(
            "SELECT Title FROM user_title WHERE PID = ? AND Used = ?",
            (row[7], 'Y')
        )
        rows = cur2.fetchone()
        if rows:
            transformed_data.append({
                "id": str(row[0]),
                "name": str(row[1]),
                "mockTitle": rows[0],
                "description": str(row[2]),
                "avatarUrl": row[3],
                "image": 'image' in row[4],
                "contentUri": row[6],
                "hearts": row[5]
            })
        else:
            transformed_data.append({
                "id": str(row[0]),
                "name": str(row[1]),
                "mockTitle": ' ',
                "description": str(row[2]),
                "avatarUrl": row[3],
                "image": 'image' in row[4],
                "contentUri": row[6],
                "hearts": row[5]
            })

    conn.commit()
    conn.close()
    return jsonify({"data": transformed_data, "maxYear": int((delta.days) / 7)})


@forfun.route('/api/data/deletePostData', methods=['POST'])
def delete_PostData():
    data = request.get_json()
    email = data.get('email')
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
        "SELECT PID FROM user WHERE Email = ?",
        (email,)
    )
    for row in cur:
        userid = row[0]
    cur.execute(
        "DELETE FROM post WHERE Post_ID = ? AND PID = ?",
        (pid, userid)
    )

    conn.commit()
    conn.close()
    return jsonify({"state": "success"})


@forfun.route('/api/data/sendHeart', methods=['POST'])
def send_Heart():
    data = request.get_json()
    pid = data.get('pid')
    email = data.get('email')
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
        "INSERT INTO user_heart_history (`PID`, `Post_ID`) VALUES (?, ?)",
        (userid, pid)
    )
    cur.execute(
        "UPDATE post SET Heart_sum = Heart_sum + ? WHERE Post_ID = ?",
        (1, pid)
    )
    conn.commit()
    conn.close()
    return jsonify({'state': 'success'})


@forfun.route('/api/data/sendComment', methods=['POST'])
def send_Comment():
    data = request.get_json()
    pid = data.get('pid')
    email = data.get('email')
    comment = data.get('comment')
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
        "INSERT INTO `message` (`Post_ID`, `PID`, `Message_content`, `Message_time`) VALUES (?, ?, ?, ?)",
        (pid, userid, comment, datetime.datetime.now())
    )
    conn.commit()
    conn.close()
    return jsonify({'state': 'success'})


# 執行程式
if __name__ == '__main__':
    forfun.run(host="0.0.0.0", port=5000)  # 我先設這個，有更好的話可以直接提出來討論修改
