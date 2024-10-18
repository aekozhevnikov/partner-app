import logging
import asyncio

from google.oauth2.service_account import Credentials
from googleapiclient.discovery import build
from constants import DB, GROUPSSHEETNAME

log_formatter = logging.Formatter('[%(asctime)s] [%(levelname)s] [%(name)s] %(message)s')
logger = logging.getLogger(__name__)
logger.setLevel(logging.DEBUG)

handler = logging.StreamHandler()
handler.setFormatter(log_formatter)
logger.addHandler(handler)

async def get_values() -> list:
    try:
        
        credentials = Credentials.from_service_account_file('credentials.json')
        service = build('sheets', 'v4', credentials=credentials, cache_discovery=False)
        sheet = service.spreadsheets()
        
        request = sheet.values().get(spreadsheetId=DB, range=GROUPSSHEETNAME)
        response = request.execute()
        values = response.get('values', [])

        return values
    except Exception as e:
        logger.error(f"An error occurred in auth: {e}")
        return []