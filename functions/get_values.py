import logging
import asyncio

from pydrive2.auth import GoogleAuth
from google.oauth2.service_account import Credentials
from googleapiclient.discovery import build

from constants import SPREADSHEETID, SHEETNAME

# Создание и настройка асинхронного логгера
logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)
log_formatter = logging.Formatter('[%(asctime)s] [%(levelname)s] [%(name)s] %(message)s')

handler = logging.StreamHandler()
handler.setFormatter(log_formatter)
logger.addHandler(handler)

async def get_values() -> list:
    try:
        # Аутентификация Google
        gauth = GoogleAuth()
        gauth.credentials = Credentials.from_service_account_file('credentials.json')

        # Подключение к таблице
        service = build('sheets', 'v4', credentials=gauth.credentials)
        sheet = service.spreadsheets()

        # Получение данных
        result = await sheet.values().get(spreadsheetId=SPREADSHEETID, range=SHEETNAME).execute()
        values = result.get('values', [])

        return values
    except Exception as e:
        logger.error(f"An error occurred in auth: {e}")
        return []