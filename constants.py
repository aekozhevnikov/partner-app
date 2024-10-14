from dotenv import load_dotenv, find_dotenv
from zoneinfo import ZoneInfo
import os

env_file = find_dotenv(".env")
load_dotenv(env_file)


# Bot
BOT_FOLDER = os.path.dirname(os.path.dirname(__file__))

BOT_TOKEN = os.getenv("bot_token")
KUPISALONID = os.getenv("kupisalonID")

# Date and time
TIMEZONE_UTC = ZoneInfo("UTC")
TIMEZONE_MOSCOW = ZoneInfo("Europe/Moscow")

# SPREADSHEETS
SPREADSHEETID=os.getenv("spreadsheetID")
DB=os.getenv("DBPARTNERS")
SHEETNAME=os.getenv("sheetName")
GROUPSSHEETNAME=os.getenv("groups_sheetname")

# ROUTE
HOME='html/mini-app-main.html'
AUTH='html/auth-web-app.html'
