from google.oauth2.service_account import Credentials
from logs.logger import logger

def sheet():
    
    try:
        credentials = Credentials.from_service_account_file('credentials.json')
        service = build('sheets', 'v4', credentials=credentials, cache_discovery=False)
        sheet = service.spreadsheets()
        return sheet
    except Exception as e:
        logger.error(f"An error occurred in auth: {e}")
        return False