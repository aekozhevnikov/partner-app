const tg = window.Telegram.WebApp;
const channel = 'https://t.me/kupi_salon';

const subscribe = document.getElementById("subscribe-button");
const auth = document.getElementById("auth-button");
const calculate = document.getElementById("calculate-button");

tg.isClosingConfirmationEnabled(true);

// if (tg !== undefined) {

const { user: { username, id }, start_param } = tg.initDataUnsafe;
// tg.expand();
// tg.BackButton.hide();
// }

tg.SecondaryButton.setParams({
    position: 'top',
    has_shine_effect: true,
    is_active: true,
    is_visible: true
});
tg.MainButton.show();
tg.SecondaryButton.show();



const checkout = {
    as: () => { [subscribe, auth].forEach(s => s.style.display = 'none'); },
    a: () => { [auth, calculate].forEach(s => s.style.display = 'none'); },
    s: () => { [subscribe, calculate].forEach(s => s.style.display = 'none'); }
};

const checkSubscriptionAndAuthorization = async () => {
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
}

// Добавление обработчика события load
window.addEventListener('load', checkSubscriptionAndAuthorization);

subscribe.addEventListener('click', function () {
    tg.openTelegramLink(channel);
});

auth.addEventListener('click', function () {
    window.location.href = `/auth?partner=${start_param}&user=${username}&id=${id}`;
});

calculate.addEventListener('click', function () {

});