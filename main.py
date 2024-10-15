from logging.handlers import RotatingFileHandler
from flask import Flask

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
    loop = asyncio.get_event_loop()

    try:
        # Создание и запуск цикла обработки событий
        loop.run_until_complete(route_conf.on_startup(dp))
        loop.run_until_complete(dp.start_polling())
        loop.run_forever()
    except KeyboardInterrupt:
        # Обработка прерывания (например, нажатия Ctrl+C)
        pass
    finally:
        # Закрытие цикла обработки событий
        loop.close()

if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True)