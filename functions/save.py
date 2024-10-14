import logging

from pydrive2.auth import GoogleAuth
from google.oauth2.service_account import Credentials
from googleapiclient.discovery import build

from constants import SPREADSHEETID, GROUPSSHEETNAME

# Настройка логирования
log_formatter = logging.Formatter('[%(asctime)s] [%(name)s] [%(levelname)s] %(message)s')
logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)

async def save(arr: list[str]) -> bool:
    
    try:
        # Аутентификация Google
        gauth = GoogleAuth()
        gauth.credentials = Credentials.from_service_account_file('credentials.json')

        # Подключение к таблице
        service = build('sheets', 'v4', credentials=gauth.credentials)
        sheet = service.spreadsheets()
        
        # Определение диапазона последней строки
        range_to_append = f"{SHEETNAME}!A:A"  # Измените "A:A" на нужный диапазон столбцов
        
        # Получение данных из последней строки
        result = sheet.values().get(spreadsheetId=SPREADSHEETID, range=range_to_append).execute()
        last_row = len(result['values']) + 1
        
        # Запись массива в последнюю строку
        value_input_option = 'USER_ENTERED'
        value_range_body = {
            'range': f"{GROUPSSHEETNAME}!A{last_row}:F{last_row}",
            'majorDimension': 'ROWS',
            'values': [arr]
        }
        sheet.values().append(spreadsheetId=SPREADSHEETID, range=range_to_append,
                              valueInputOption=value_input_option, body=value_range_body).execute()

        return True
    except Exception as e:
        logger.error(f"An error occurred in auth: {e}")
        return False