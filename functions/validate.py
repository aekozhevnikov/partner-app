import hashlib
from urllib.parse import quote_plus

async def HMAC_SHA256(key, secret):
    h = hashlib.sha256(key.encode())
    h.update(secret.encode())
    return h.digest()

async def getCheckString(data):
    items = [(k, v) for k, v in data.items() if k != "hash"]
    items.sort(key=lambda x: x[0])  # Сортировка по ключам
    encoded_items = [f"{k}={quote_plus(v)}" for k, v in items]
    return "&".join(encoded_items)
