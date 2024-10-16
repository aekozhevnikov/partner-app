const tg = window.Telegram.WebApp;
const channel = 'https://t.me/kupi_salon';

tg.ready();

const subscribe = document.getElementById("subscribe-button");
const auth = document.getElementById("auth-button");
const calculate = document.getElementById("calculate-button");
const auth_text = document.getElementById("auth_text");
const subscribe_text = document.getElementById("subscribe_text");
const auth_block = document.querySelector(".auth-block")

tg.enableClosingConfirmation();

const { user: { username, id }, start_param } = tg.initDataUnsafe;

const checkout = {
    as: () => {
        [auth, subscribe].forEach(s => s.disabled = true);
        auth_block.style.pointerEvents = "none";
        auth_block.style.opacity = "0.5";
    },
    a: () => {
        auth_text.style.opacity = "0.5";
        [auth, calculate].forEach(s => s.disabled = true);
    },
    s: () => {
        subscribe_text.style.opacity = "0.5";
        [subscribe, calculate].forEach(s => s.disabled = true);
    }
};

const checkSubscriptionAndAuthorization = async () => {
    try {
        const response = await fetch(`/check?partner=${start_param}&user_id=${id}`);
        const { is_subscribed, is_authorized } = await response.json();

        console.log({ is_subscribed, is_authorized });

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
                break;
            }
        }
    } catch (error) {
        console.error('Error:', error);
    }
};

const fetchData = async () => {
    try {
        const response = await fetch(`/validate-init?${tg.initData}`);
        const data = await response.json();
        console.log(data);
    } catch (error) {
        console.error('Error:', error);
    }
};

window.addEventListener('load', async () => {
    await fetchData();
    await checkSubscriptionAndAuthorization();
});

subscribe.addEventListener('click', function () {
    tg.openTelegramLink(channel);
});

auth.addEventListener('click', function () {
    window.location.href = `/auth?partner=${start_param}&user=${username}&id=${id}`;
});

calculate.addEventListener('click', function () {

});