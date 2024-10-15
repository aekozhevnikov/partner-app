from logging.handlers import RotatingFileHandler
from flask import Flask, send_file, jsonify, request,  session

import os
import asyncio

from routes import configure_routes
from aiogram import Bot, Dispatcher
from constants import BOT_TOKEN

app = Flask(__name__)

bot = Bot(BOT_TOKEN)
dp = Dispatcher()

# Конфигурирование маршрутов
route_conf = configure_routes(app, dp, bot)
        
if __name__ == '__main__':
    loop = asyncio.get_event_loop()
    loop.create_task(route_conf.on_startup(dp))  # Вызов установки Webhook асинхронно
    loop.create_task(dp.start_polling())  # Запуск Polling асинхронно
    loop.run_forever()  

if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True)