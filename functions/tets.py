import hashlib
import urllib.parse
import hmac

def verify_telegram_web_app_data(telegram_init_data, bot_token):
    # The data is a query string, which is composed of a series of field-value pairs.
    encoded = urllib.parse.unquote(telegram_init_data)

    # HMAC-SHA-256 signature of the bot's token with the constant string WebAppData used as a key.
    secret_key = "WebAppData".encode()
    secret = hmac.new(secret_key, bot_token.encode(), hashlib.sha256)

    # Data-check-string is a chain of all received fields'.
    arr = encoded.split("&")
    hash_index = next((i for i, str in enumerate(arr) if str.startswith("hash=")), -1)
    hash_value = arr.pop(hash_index).split("=")[1]
    # Sorted alphabetically
    arr.sort()
    # In the format key=<value> with a line feed character ('\n', 0x0A) used as separator
    # e.g., 'auth_date=<auth_date>\nquery_id=<query_id>\nuser=<user>
    data_check_string = "\n".join(arr)

    # The hexadecimal representation of the HMAC-SHA-256 signature of the data-check-string with the secret key
    _hash = hmac.new(secret.digest(), data_check_string.encode(), hashlib.sha256).hexdigest()

    # If hash is equal, the data may be used on your server.
    # Complex data types are represented as JSON-serialized objects.
    return _hash == hash_value

telegram_init_data = "user=%7B%22id%22%3A290406947%2C%22first_name%22%3A%22Anton%20%F0%9F%90%88%E2%80%8D%E2%AC%9B%22%2C%22last_name%22%3A%22Kozhevnikov%22%2C%22username%22%3A%22hungryking%22%2C%22language_code%22%3A%22ru%22%2C%22is_premium%22%3Atrue%2C%22allows_write_to_pm%22%3Atrue%7D&chat_instance=-4623330916426688067&chat_type=private&start_param=kupisalon&auth_date=1728998008&hash=9db1af9bd6389ae69331c5029615139adec21989d6eebdca6199ccff2e14d32e"
bot_token = "7739509556:AAEpe6ihMXrxCCCGRij9RK_7sxD0T5xDjvs"

result = verify_telegram_web_app_data(telegram_init_data, bot_token)
print(result)