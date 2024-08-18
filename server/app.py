# app.py
from flask import Flask, render_template,jsonify,request,url_for
from flask_socketio import SocketIO
import json
import time
from werkzeug.utils import secure_filename
from config import configs
import os


app = Flask(__name__)
socketio = SocketIO(app)
app.config.update(configs)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/data/getPostData', methods=['POST'])
def get_PostData():
    data = {'message': 'Hello from Flask API with GET method.'}
    return jsonify(data)


@app.route('/api/data/get', methods=['GET'])
def get_data():
    data = {'message': 'Hello from Flask API with GET method'}
    return jsonify(data)

@app.route('/api/data/post', methods=['POST'])
def process_data():
    req_data = request.get_json()
    file = request.files['file']
    print(file)
    data = {'message': 'Hello from Flask API with POST method.'}
    return jsonify(data)

@app.route('/api/data/getDetail', methods=['GET'])
def get_detail():
    with open('./server/detail.json','r') as file:
        data = json.load(file)
    return jsonify(data)

### 用來接收回報處理
@app.route('/reportSubmit',methods = ['POST'])
def process_submit():
    # 錯誤處理
    if 'photo' not in request.files:
        return jsonify({"success": 0}), 400
    file = request.files['photo']
    if file.filename == '':
        return jsonify({"success": 0}), 400
    # 下載檔案
    elif file:
        
        filename = secure_filename(file.filename)
        file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
        return jsonify({"success": 1, "filename": filename}), 200

    


@socketio.on('button_click')
def handle_button_click():
    print('Button clicked!')
    socketio.emit('response', 'Message from Flask!!!')

if __name__ == '__main__':
    app.run(ssl_context=('server.crt', 'server.key'), port=8080,host="0.0.0.0")
    