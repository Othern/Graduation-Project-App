import firebase_admin
from firebase_admin import credentials
from firebase_admin import messaging
import datetime

cred = credentials.Certificate("./serviceAccountKey.json")
default_app = firebase_admin.initialize_app(credential=cred)
registration_token = "dBJAFpW5RW6_5CszD0RQtV:APA91bF08YN14x5aHgaTJb-Dy5I24wUkAW91NBlvueXlJPTRh-G5MLlCrNYeJiZw8EjsBPfdiUvnJVePSwTSXNuf6VKl48PYjL6oMBREjgXd4iC0qzI_9KcgWD23m4Fw91cdNp5h_rL0"
messages = [
    messaging.Message(
        notification=messaging.Notification(
            title="你好",
            body="通知測試",
            image="https://cdn-icons-png.flaticon.com/512/7246/7246727.png",
        ),
        data={
            "screen_name": "RRRR",
            "title": "great match!",
        },
        #token=registration_token, 可以用topic 或 token 其一
        topic="all_devices",
    ),
]
def send_test():
    response = messaging.send_all(messages)
    print("{0} messages were sent successfully".format(response.success_count))
