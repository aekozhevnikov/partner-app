from logging.handlers import RotatingFileHandler
from flask import Flask, send_file, jsonify, request,  session
from aiohttp import web

import asyncio
import logging

from routes import configure_routes
from aiogram import Bot, Dispatcher
from constants import BOT_TOKEN

app = Flask(__name__)

bot = Bot(BOT_TOKEN)
dp = Dispatcher()

# Настройка логирования
log_formatter = logging.Formatter('[%(asctime)s] [%(levelname)s] [%(name)s] %(message)s')
logger = logging.getLogger(__name__)
logger.setLevel(logging.DEBUG)

# Создание и настройка RotatingFileHandler для записи логов в файл
file_handler = RotatingFileHandler('logs/app.log', maxBytes=10000, backupCount=5)
file_handler.setLevel(logging.DEBUG) 
file_handler.setFormatter(log_formatter)
logger.addHandler(file_handler)

# Конфигурирование маршрутов
route_conf = configure_routes(app, dp, bot)

if __name__ == '__main__':
    async def main():
        runner = web.AppRunner(app)
        await runner.setup()
        site = web.TCPSite(runner, '0.0.0.0', 5000)
        await site.start()

        await route_conf.on_startup(dp)
        await dp.start_polling()
        
         # Остановка aiohttp-приложения
        await app.cleanup()

    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        pass