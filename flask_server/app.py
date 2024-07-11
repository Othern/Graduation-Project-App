from flask import Flask, Blueprint
from flask_cors import CORS
from login import login
from modify import modify
import secrets

app = Flask(__name__)
CORS(app) # 跨平台使用

app.secret_key = secrets.token_hex(16) # 保護session

# 註冊附屬檔案在APP上
app.register_blueprint(login)
app.register_blueprint(modify)

# 執行程式
if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5000,debug=True) # 我先設這個，有更好的話可以直接提出來討論修改