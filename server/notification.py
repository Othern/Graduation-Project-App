import firebase_admin
from firebase_admin import credentials
from firebase_admin import messaging
import datetime

cred = credentials.Certificate("./serviceAccountKey.json")
default_app = firebase_admin.initialize_app(credential=cred)
registration_token = "fofD1N3ISXC3Q2cElLAFTJ:APA91bHzwuP9R2hRxz6Sly3G97PFh1vlO37UMTx2ojeFv7CgCnjJHumxG8Wa6TJkJVNU6gF-58lO38khlGIc2Iun9xr2MfiIPZ9bJxm4sY8tKWuZYJhI95g46APptQqg2fV4usB_0N3o"
messages = [
    messaging.Message(
        notification=messaging.Notification(
            title="武嶺宿舍獼猴入侵",
            body="‼️⚠️請關緊門窗⚠️‼️",
            image="https://cdn-icons-png.flaticon.com/512/7246/7246727.png",
        ),
        data={
            "screen_name": "RRRR",
            "title": "great match!",
        },
        token=registration_token,
    ),
]
def send_test():
    response = messaging.send_all(messages)
    print("{0} messages were sent successfully".format(response.success_count))

if __name__ == "__main__":
    send_test()