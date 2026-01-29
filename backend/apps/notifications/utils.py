from exponent_server_sdk import (
    PushClient,
    PushMessage,
    PushServerError,
    DeviceNotRegisteredError,
)
from requests.exceptions import ConnectionError, HTTPError

def send_push_notification(token, title, message, data=None):
    """
    Send a push notification to a specific Expo push token.
    """
    if not token:
        print("Push notification skipped: no token")
        return
    
    if not title:
        title = "New notification"
    if not message:
        message = "You have a new notification"

    print(f"Sending push notification to {token[:20]}... title='{title}' body='{message[:50]}'")

    try:
        response = PushClient().publish(
            PushMessage(
                to=token,
                title=title,
                body=message,
                data=data or {},
                sound='default',
            )
        )
        print(f"Push notification sent successfully: {response}")
    except (ConnectionError, HTTPError) as exc:
        print(f"Error sending push notification (Connection/HTTP): {exc}")
    except (PushServerError, DeviceNotRegisteredError) as exc:
        print(f"Error sending push notification (PushServer/Device): {exc}")
    except Exception as exc:
        print(f"Unknown error sending push notification: {exc}")

def send_push_to_user(user, title, message, data=None):
    """
    Send push notification to a user safely.
    """
    if not user or not user.expo_push_token:
        return
    
    send_push_notification(user.expo_push_token, title, message, data)
