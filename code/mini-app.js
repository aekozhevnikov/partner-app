const tg = window.Telegram.WebApp;
const channel = 'https://t.me/kupi_salon';

tg.ready();

const subscribe = document.getElementById("subscribe-button");
const auth = document.getElementById("auth-button");
const calculate = document.getElementById("calculate-button");

tg.enableClosingConfirmation();

const { user: { username, id }, start_param } = tg.initDataUnsafe;

const checkout = {
    as: () => { [subscribe, auth].forEach(s => s.style.display = 'none'); },
    a: () => { [auth, calculate].forEach(s => s.style.display = 'none'); },
    s: () => { [subscribe, calculate].forEach(s => s.style.display = 'none'); }
};

let isCheckPerformed = false; // Флаг, чтобы отслеживать, была ли проверка выполнена

const checkSubscriptionAndAuthorization = async () => {
    if (!isCheckPerformed) { // Проверка, чтобы выполнить только один раз
        try {
            const response = await fetch(`/check?partner=${start_param}&user_id=${id}`);
            const { is_subscribed, is_authorized } = await response.json();

            const checks = {
                a: is_authorized && !is_subscribed,
                as: !is_authorized && !is_subscribed,
                s: !is_authorized && is_subscribed
            };

            for (const key in checks) {
                if (checks[key]) {
                    if (checkout[key]) {
                        checkout[key]();
                    }
                    window.location.href = '/';
                    break;
                }
            }
        } catch (error) {
            console.error('Error:', error);
        }

        isCheckPerformed = true; // Установка флага в true, чтобы указать, что проверка выполнена
    }
};

window.addEventListener('load', async function () {
    if (!isCheckPerformed) {
        console.log(tg.initData);
        const data = await fetch(`/validate-init?${tg.initData}`).then(res => res.json());
        console.log(data);

        checkSubscriptionAndAuthorization(); // Вызов функции проверки после загрузки данных
    }
});

subscribe.addEventListener('click', function () {
    tg.openTelegramLink(channel);
});

auth.addEventListener('click', function () {
    window.location.href = `/auth?partner=${start_param}&user=${username}&id=${id}`;
});

calculate.addEventListener('click', function () {

});