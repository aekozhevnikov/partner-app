import logging
import asyncio

from aiogram import Bot

from pydrive2.auth import GoogleAuth
from google.oauth2.service_account import Credentials
from googleapiclient.discovery import build

from constants import SPREADSHEETID, SHEETNAME, KUPISALONID

# Настройка логирования
log_formatter = logging.Formatter('[%(asctime)s] [%(levelname)s] [%(name)s] %(message)s')
logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)

handler = logging.StreamHandler()
handler.setFormatter(log_formatter)
logger.addHandler(handler)

async def subscription(bot: Bot) -> bool:
    try:
        member = await bot.get_chat_member(chat_id=KUPISALONID, user_id=bot.id)
        return member.is_chat_member()
    except Exception as e:
        logger.error(f"An error occurred in check_subscription: {e}")
        return False
    
    
async def auth(user_id: str, partner: str) -> bool:
    try:
        
        credentials = Credentials.from_service_account_file('credentials.json')
        service = build('sheets', 'v4', credentials=credentials, cache_discovery=False)
        sheet = service.spreadsheets()

        loop = asyncio.get_event_loop()

        request = sheet.values().get(spreadsheetId=SPREADSHEETID, range=SHEETNAME)
        response = await loop.run_in_executor(None, request.execute)
        values = response.get('values', [])

        for row in values:
            if row and row[0] == partner and row[1] == user_id and row[2] and row[3]:
                return True
        
        return False
    except Exception as e:
        logger.error(f"An error occurred in auth: {e}")
        return False