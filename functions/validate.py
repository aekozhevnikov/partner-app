import hashlib

async def HMAC_SHA256(secret_key, bot_token):
    hash_object = hashlib.sha256(secret_key)
    hash_object.update(bot_token)
    hash_value = hash_object.digest()
    return hash_value

async def getCheckString(data):
    items = [(k, v) for k, v in data.items() if k != "hash"]
    items.sort(key=lambda x: x[0])  # Сортировка по ключам
    return "\n".join([f"{k}={v}" for k, v in items])
