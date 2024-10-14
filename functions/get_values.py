import logging

from pydrive2.auth import GoogleAuth
from google.oauth2.service_account import Credentials
from googleapiclient.discovery import build

from constants import SPREADSHEETID, SHEETNAME

# Настройка логирования
logging.basicConfig(level=logging.INFO, format='[%(asctime)s] - [%(name)s] - [%(levelname)s] - %(message)s')
logger = logging.getLogger(__name__)

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