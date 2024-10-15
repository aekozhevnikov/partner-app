import hashlib
import urllib.parse

async def HMAC_SHA256(key, secret):
    h = hashlib.sha256(key.encode())
    h.update(secret.encode())
    return h.digest()

async def getCheckString(data):
    items = [(k, v) for k, v in data.items() if k != "hash"]
    items.sort(key=lambda x: x[0])  # Сортировка по ключам

    # Преобразование ключей и значений в закодированную строку
    encoded_items = [f"{urllib.parse.quote(str(k))}={urllib.parse.quote(str(v))}" for k, v in items]

    return "&".join(encoded_items)
