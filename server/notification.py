import firebase_admin
from firebase_admin import credentials
from firebase_admin import messaging

# 初始化 Firebase Admin SDK
cred = credentials.Certificate("./serviceAccountKey.json")
firebase_admin.initialize_app(cred)

# 定義主題名稱
topic = "MonkeyAlert"  # 確保這與客戶端訂閱的主題相同


def send_test():
    # 構建消息
    message = messaging.Message(
        notification=messaging.Notification(
            title="武嶺宿舍獼猴入侵",
            body="‼️⚠️請關緊門窗⚠️‼️",
        ),
        data={
            "screen_name": "RRRR",
            "title": "great match!",
        },
        topic=topic,
    )

    try:
        # 發送消息
        response = messaging.send(message)
        print(f"Successfully sent message to topic {topic}:", response)
    except Exception as e:
        print(f"Failed to send message to topic {topic}:", e)


if __name__ == "__main__":
    send_test()
