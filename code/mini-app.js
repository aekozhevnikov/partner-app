import dotenv from 'dotenv';

const tg = window.Telegram.WebApp;
const channel = 'https://t.me/kupi_salon';
const { user: { username, id }, start_param } = tg.initDataUnsafe;
const botToken = process.env.bot_token;
const channel_name = process.env.kupisalonID;

dotenv.config();
tg.expand();
tg.BackButton.hide();

// Проверка подписки на канал при старте веб-приложения
window.addEventListener('load', function () {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', `https://api.telegram.org/bot${botToken}/getChatMember?chat_id=${channel_name}&user_id=${id}`, true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            var response = JSON.parse(xhr.responseText);
            if (response.ok && response.result.status !== 'left') {
                tg.showAlert('Подписан');
            } else {
                tg.showAlert('Не подписан');
            }
        }
    };
    xhr.send();
});

const subscribe = document.getElementById("subscribe-button");
const auth = document.getElementById("auth-button");
const calculate = document.getElementById("calculate-button");

subscribe.addEventListener('click', function () {
    tg.openTelegramLink(channel);
});

auth.addEventListener('click', function () {
    window.location.href = `/auth?partner=${start_param}&user=${username}&id=${id}`;
});

calculate.addEventListener('click', function () {

});