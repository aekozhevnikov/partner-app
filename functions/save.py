import logging

from google.oauth2.service_account import Credentials
from googleapiclient.discovery import build
from constants import SPREADSHEETID, SHEETNAME

log_formatter = logging.Formatter('[%(asctime)s] [%(levelname)s] [%(name)s] %(message)s')
logger = logging.getLogger(__name__)
logger.setLevel(logging.DEBUG)

handler = logging.StreamHandler()
handler.setFormatter(log_formatter)
logger.addHandler(handler)

async def save(arr: list[str]) -> bool:
    
    try:
        credentials = Credentials.from_service_account_file('credentials.json')
        service = build('sheets', 'v4', credentials=credentials, cache_discovery=False)
        sheet = service.spreadsheets()
        
        range_to_append = f"{SHEETNAME}!A:A" 
        
        # Получение данных из последней строки
        request = sheet.values().get(spreadsheetId=SPREADSHEETID, range=range_to_append)
        response = request.execute()
        values = response.get('values', [])
        last_row = len(values) + 1
                
        # Запись массива в последнюю строку
        value_input_option = 'USER_ENTERED'
        range_to_save = f"{SHEETNAME}!A{last_row}:H{last_row}"
        value_range_body = {
            'range': range_to_save,
            'majorDimension': 'ROWS',
            'values': [arr]
        }
        
        save_request = sheet.values().append(spreadsheetId=SPREADSHEETID, range=range_to_save,
                              valueInputOption=value_input_option, body=value_range_body)
        
        save_response = save_request.execute()
        
        logger.info("Ueser data successfully saved to the spreadsheet")

        return True
    except Exception as e:
        logger.error(f"An error occurred in auth: {e}")
        return False