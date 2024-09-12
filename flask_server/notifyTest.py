import firebase_admin
from firebase_admin import credentials
from firebase_admin import messaging

# 初始化 Firebase Admin SDK
cred = credentials.Certificate("./Graduation-Project-App/flask_server/google.json")
default_app = firebase_admin.initialize_app(cred)

# 定義主題名稱
token = "dyboQwC_SAuuwyMA3Iq3m8:APA91bFgi0rZz1e9zEhT901HyVTPDWpY4kRbiAy5ZEliwzqFJNei9ifjzM-lkmKVgywJ6c0nbXk6tdOvRVO65fAFJVV1GHxEvR1N9HfhZHnw9yfJS9A2dD0HoC7AUYHBK5t_KpHMXrx2"


def send_test():
    # 構建消息
    message = [messaging.Message(
        notification=messaging.Notification(
            title="武嶺宿舍獼猴入侵",
            body="‼️⚠️請關緊門窗⚠️‼️",
        ),
        data={
            "screen_name": "RRRR",
            "title": "great match!",
        },
        token=token,
    )]

    try:
        # 發送消息
        response = messaging.send_all(message)
        print(f"Successfully sent message to  {token}:", response)
    except Exception as e:
        print(f"Failed to send message to  {token}:", e)


if __name__ == "__main__":
    send_test()
