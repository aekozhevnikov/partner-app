from logging.handlers import RotatingFileHandler
from flask import send_file, jsonify, request
from urllib.parse import unquote_plus

import os
import asyncio
import logging

from functions.check import subscription, auth
from functions.save import save
from functions.get_values import get_values
from functions.validate import verify_telegram_web_app_data

from constants import BOT_TOKEN, HOME, AUTH

log_formatter = logging.Formatter('[%(asctime)s] [%(levelname)s] [%(name)s] %(message)s')
logger = logging.getLogger(__name__)
logger.setLevel(logging.DEBUG)

handler = logging.StreamHandler()
handler.setFormatter(log_formatter)
logger.addHandler(handler)

def configure_routes(app, dp, bot):
    
        @app.route("/validate-init", methods=["GET"])
        async def validate_init():
            try:
                decoded_data = {key: unquote_plus(value) for key, value in request.args.items()}
                _hash = await verify_telegram_web_app_data(decoded_data, BOT_TOKEN)

                if _hash == decoded_data.get("hash"):
                    logger.debug("Validation successful: %s", decoded_data)
                    return jsonify(dict(decoded_data))
                else:
                    logger.warning("Validation failed: %s", decoded_data)
                    return jsonify({}), 401
            except Exception as e:
                logger.error('An error occurred: %s', str(e))
                return jsonify({'error': str(e)}), 500

        async def on_startup(dp):
            try:
                await bot.set_webhook('') 
            except Exception as e:
                logger.error(f"An error occurred in on_startup: {e}")

        @app.route('/')
        def home():
            return send_file(HOME)

        @app.route('/styles/<path:path>')
        def static_styles(path):
            static_folder = os.path.join(app.root_path, 'styles')
            return send_file(os.path.join(static_folder, path))

        @app.route('/scripts/<path:path>')
        def static_scripts(path):
            static_folder = os.path.join(app.root_path, 'code')
            return send_file(os.path.join(static_folder, path))

        @app.errorhandler(Exception)
        def error_handler(error):
            logger.error(f"An error occurred: {error}")
            return error, 500
        
        @app.route('/auth')
        def auth_route():
            return send_file(AUTH)
        
        @app.route('/check', methods=['GET'])
        async def check_subscription_and_authorization():
            try:
                user_id = request.args.get('user_id')
                partner = request.args.get('partner')
                
                # async def run_checks():
                is_subscribed =  await subscription(bot)
                is_authorized = await auth(user_id, partner)

                return jsonify(is_subscribed=is_subscribed, is_authorized=is_authorized)
                
                # loop = asyncio.new_event_loop()
                # asyncio.set_event_loop(loop)
                # result = asyncio.run(run_checks())
                # loop.close()
                
                # return result
            except Exception as e:
                logger.error(f"An error occurred in check_subscription_and_authorization: {e}")
                return jsonify(error=str(e)), 500
            
        @app.route('/savedata', methods=['GET'])
        async def save_data():
            
            try:
                values_list = list(request.args.values())
                logger.debug(f"Data successfully recived from mini-app: {values_list}")
                success = await save(arr=values_list)
                
                return jsonify(success=success)
            except Exception as e:
                logger.error(f"An error occurred in save_data: {e}")
                return jsonify(error=str(e)), 500
            
        @app.route('/getdata', methods=['GET'])
        async def get_data():

            try:
                values = await get_values()
                
                return jsonify(values)
            except Exception as e:
                logger.error(f"An error occurred in get_data: {e}")
                return jsonify(error=str(e)), 500