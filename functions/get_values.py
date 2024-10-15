import logging
import asyncio

from logging.handlers import RotatingFileHandler
from pydrive2.auth import GoogleAuth
from google.oauth2.service_account import Credentials
from googleapiclient.discovery import build
from constants import DB, GROUPSSHEETNAME

# Настройка логирования
log_formatter = logging.Formatter('[%(asctime)s] [%(levelname)s] [%(name)s] %(message)s')
logger = logging.getLogger(__name__)
logger.setLevel(logging.DEBUG)

# Создание и настройка RotatingFileHandler для записи логов в файл
file_handler = RotatingFileHandler('logs/app.log', maxBytes=10000, backupCount=5)
file_handler.setLevel(logging.DEBUG) 
file_handler.setFormatter(log_formatter)
logger.addHandler(file_handler)

async def get_values() -> list:
    try:
        
        credentials = Credentials.from_service_account_file('credentials.json')
        service = build('sheets', 'v4', credentials=credentials, cache_discovery=False)
        sheet = service.spreadsheets()
        
        loop = asyncio.get_event_loop()
        
        request = sheet.values().get(spreadsheetId=DB, range=GROUPSSHEETNAME)
        response = await loop.run_in_executor(None, request.execute)
        values = response.get('values', [])

        return values
    except Exception as e:
        logger.error(f"An error occurred in auth: {e}")
        return []