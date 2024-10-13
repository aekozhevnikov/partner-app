const tg = window.Telegram.WebApp;
const channel = 'https://t.me/kupi_salon';
const { user: { username, id }, start_param } = tg.initDataUnsafe;

tg.expand();
tg.BackButton.hide();

// Проверка подписки на канал при старте веб-приложения
window.addEventListener('load', function () {
    const { is_subscribed, is_authorized } = window.location.href = `/check`;
    tg.showAlert({ is_subscribed, is_authorized });
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