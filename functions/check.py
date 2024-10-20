import logging
import asyncio

from google.oauth2.service_account import Credentials
from googleapiclient.discovery import build
from constants import SPREADSHEETID, SHEETNAME, KUPISALONID

log_formatter = logging.Formatter('[%(asctime)s] [%(levelname)s] [%(name)s] %(message)s')
logger = logging.getLogger(__name__)
logger.setLevel(logging.DEBUG)

handler = logging.StreamHandler()
handler.setFormatter(log_formatter)
logger.addHandler(handler)

async def subscription(bot) -> bool:
    try:
        
        member = await bot.get_chat_member(chat_id=KUPISALONID, user_id=bot.id)
        return member.status in ('administrator', 'creator')
    except Exception as e:
        logger.error(f"An error occurred in subscription: {e}")
        return False
    
async def auth(user_id: str, partner: str) -> bool:
    try:
        
        credentials = Credentials.from_service_account_file('credentials.json')
        service = build('sheets', 'v4', credentials=credentials, cache_discovery=False)
        sheet = service.spreadsheets()

        request = sheet.values().get(spreadsheetId=SPREADSHEETID, range=SHEETNAME)
        response = request.execute()
        values = response.get('values', [])

        for row in values:
            if row and row[1] == partner and row[2] == user_id and row[3] and row[4] and row[5] and row[6]:
                return True
                    
        return False
    except Exception as e:
        logger.error(f"An error occurred in auth: {e}")
        return False