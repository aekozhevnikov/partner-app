from logging.handlers import RotatingFileHandler
from flask import Flask, send_file, jsonify, request,  session

import os
import asyncio
import logging
from routes import configure_routes

from aiogram import Bot, Dispatcher
from constants import BOT_TOKEN

app = Flask(__name__)
# secret_key = binascii.hexlify(os.urandom(24)).decode()
# app.secret_key = secret_key

# Настройка логирования
log_formatter = logging.Formatter('[%(asctime)s] [%(levelname)s] [%(name)s] %(message)s')
logger = logging.getLogger(__name__)
logger.setLevel(logging.DEBUG)

# Создание и настройка RotatingFileHandler для записи логов в файл
file_handler = RotatingFileHandler('logs/app.log', maxBytes=10000, backupCount=5)
file_handler.setLevel(logging.DEBUG) 
file_handler.setFormatter(log_formatter)
logger.addHandler(file_handler)

bot = Bot(BOT_TOKEN)
dp = Dispatcher()

# Конфигурирование маршрутов
route_conf = configure_routes(app, dp, bot, logger)

# @app.route("/validate-init", methods=["POST"])
# def validate_init():
#     try:
#         data = request.form

#         data_check_string = getCheckString(data)
#         secret_key = HMAC_SHA256("WebAppData", BOT_TOKEN)
#         hash_val = HMAC_SHA256(secret_key, data_check_string).hex()

#         if hash_val == data.get("hash"):
#             # Валидация успешна
#             logger.debug("Validation successful: %s", data)
#             return jsonify(dict(data))
#         else:
#             # Валидация неудачна
#             logger.warning("Validation failed: %s", data)
#             return jsonify({}), 401
#     except Exception as e:
#         logger.error('An error occurred: %s', str(e))
#         return jsonify({'error': str(e)}), 500

# # @app.after_request
# # def clear_session(response):
# #     session.clear()  # Очистка сессии после каждого запроса
# #     return response

# async def on_startup(dp):
#     try:
#         await bot.set_webhook('') 
#         fname = get_func_name()
#     except Exception as e:
#         logger.error(f"An error occurred in on_startup: {e}")

# @app.route('/')
# def home():
#     return send_file(HOME)

# @app.route('/styles/<path:path>')
# def static_styles(path):
#     static_folder = os.path.join(app.root_path, 'styles')
#     return send_file(os.path.join(static_folder, path))

# @app.route('/scripts/<path:path>')
# def static_scripts(path):
#     static_folder = os.path.join(app.root_path, 'code')
#     return send_file(os.path.join(static_folder, path))

# @app.errorhandler(Exception)
# def error_handler(error):
#     logger.error(f"An error occurred: {error}")
#     return 'Something broke!', 500
  
# @app.route('/auth')
# def auth_route():
#     return send_file(AUTH)
  
# @app.route('/check', methods=['GET'])
# def check_subscription_and_authorization():
#     loop = asyncio.get_event_loop()
    
#     try:
#         user_id = request.args.get('user_id')
#         partner = request.args.get('partner')

#         is_subscribed = asyncio.run(subscription(bot))
#         is_authorized = asyncio.run(auth(user_id, partner))
        
#         loop.close()
#         return jsonify(is_subscribed=is_subscribed, is_authorized=is_authorized)
#     except Exception as e:
#         logger.error(f"An error occurred in check_subscription_and_authorization: {e}")
#         return jsonify(error=str(e)), 500
    
# @app.route('/savedata', methods=['GET'])
# def save_data():
#     loop = asyncio.get_event_loop()
    
#     try:
#         values_list = list(request.args.values())
#         success = asyncio.run(save(arr=values_list))
        
#         loop.close()
#         return jsonify(success=success)
#     except Exception as e:
#         logger.error(f"An error occurred in save_data: {e}")
#         return jsonify(error=str(e)), 500
    
# @app.route('/getdata', methods=['GET'])
# def get_data():
#     loop = asyncio.get_event_loop()

#     try:
#         values = loop.run_until_complete(get_values())
        
#         loop.close()
#         return jsonify(values)
#     except Exception as e:
#         logger.error(f"An error occurred in get_data: {e}")
#         return jsonify(error=str(e)), 500
        
if __name__ == '__main__':
    loop = asyncio.get_event_loop()
    loop.create_task(route_conf.on_startup(dp))  # Вызов установки Webhook асинхронно
    loop.create_task(dp.start_polling())  # Запуск Polling асинхронно
    loop.run_forever()  

if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True)