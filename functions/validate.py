import hashlib
import urllib.parse
import hmac

async def verify_telegram_web_app_data(data, bot_token):

    # HMAC-SHA-256 signature of the bot's token with the constant string WebAppData used as a key.
    secret_key = "WebAppData".encode()
    secret = hmac.new(secret_key, bot_token.encode(), hashlib.sha256)
    
    items = [(k, v) for k, v in data.items() if k != "hash"]
    items.sort(key=lambda x: x[0])  # Сортировка по ключам
    data_check_string = "\n".join([f"{k}={v}" for k, v in items])

    # The hexadecimal representation of the HMAC-SHA-256 signature of the data-check-string with the secret key
    _hash = hmac.new(secret.digest(), data_check_string.encode(), hashlib.sha256).hexdigest()
    return _hash