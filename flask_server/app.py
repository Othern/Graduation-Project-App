from flask import Flask
from flask_cors import CORS
from login import login
from modify import modify
from report_history import history
from predict import predict
from fetchdata import fetchdata
from forfun import forfun
from notify import notify
from title import title
from upload import upload

import secrets

app = Flask(__name__)
CORS(app)  # 跨平台使用

app.secret_key = secrets.token_hex(16)  # 保護session

# 註冊附屬檔案在APP上
app.register_blueprint(login)  # 登入、註冊
app.register_blueprint(modify)  # 調整使用者頭像、名稱、密碼
app.register_blueprint(history)  # 將使用者通報內容匯入資料庫，並進行通知
app.register_blueprint(notify)  # 通知使用者(包含內容、通知條件、取得所有使用者token)
app.register_blueprint(predict)  # 調整歷史紀錄、將歷史資料放進預測模型、回傳預測結果
app.register_blueprint(fetchdata)  # 顯示獼猴出沒座標
app.register_blueprint(forfun)  # 獼猴人氣投票相關
app.register_blueprint(title)  # 稱號的更改，取得稱號列表
app.register_blueprint(upload)  # 上傳、修改貼文


# 執行程式
if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5000, debug=True)  # 我先設這個，有更好的話可以直接提出來討論修改
