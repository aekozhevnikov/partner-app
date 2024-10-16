const tg = window.Telegram.WebApp;
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const username = urlParams.get('user');
const id = urlParams.get('id');
const partner = urlParams.get('partner');

const fields = {
  manager_name: '#manager-name',
  phone: '#manager-phone',
  email: '#manager-email',
};

const setCheckmark = s => {
  s.style.pointerEvents = "none";
  s.style.opacity = "0.5";
};

const fill_tg = document.querySelector('.fill-tg');
const n = document.getElementById(fields.manager_name);
const ph = document.getElementById(fields.phone);

tg.BackButton.show();
tg.setBottomBarColor("bottom_bar_bg_color");

fill_tg.addEventListener('click', function () {
  const { phone_number, auth_date, last_name, first_name } = tg.requestContact(async (shared, callback) => {
    if (shared && callback) {
      console.log(callback);
      const { responseUnsafe: { contact: { phone_number, last_name, first_name }, auth_date } } = callback;
      return { phone_number, auth_date, last_name, first_name };
    }
  });

  n.value = `${first_name} ${last_name}`;
  ph.value = phone_number;
  setCheckmark(fill_tg);

});

tg.onEvent('backButtonClicked', (event) => {
  window.location.href = '/';
  tg.MainButton.hide();
});

async function fetchData() {

  const selectElement = document.getElementById('field_select-type');

  try {
    const response = await fetch('/getdata');
    console.log(response);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const text = await response.text();

    const data = JSON.parse(text);
    const flatValues = data.flat();

    flatValues.forEach(option => {
      const optionElement = document.createElement('option');
      optionElement.value = option;
      optionElement.text = option;
      selectElement.appendChild(optionElement);
    });

  } catch (error) {
    console.error('Error fetching data:', error.message); // Вывод текста ошибки в консоль
  }
}

fetchData();

function formatPhoneNumber(input) {

  if (!input.value.startsWith('+') && input.value.match(/^\d/)) {
    input.value = '+' + input.value;
  }
  if (input.value === '+') {
    input.value = '';
  }
  input.value = input.value.replace(/[^+d (\d)-]/, '');
  if (input.value.startsWith('+')) {
    input.value = input.value.substring(0, 4) + input.value.substring(4).replace(/[^0-9]/g, '').slice(0, 13);
  } else {
    input.value = input.value.replace(/[^0-9]/g, '').slice(0, 10);
  }
}

function validateName(input) {
  let value = input.value;
  let pattern = /^[A-Za-zА-ЯЁа-яё]+([- ][A-Za-zА-ЯЁа-яё]+)*$/;
  if (!value.match(pattern)) {
    input.setCustomValidity("Имя должно содержать только буквы и может включать пробелы или дефисы.");
  }

  value = value.replaceAll(/\d+/g, '');
  input.value = value;
  input.setCustomValidity("");
}


function showErrorNotification(error) {
  Swal.fire({
    icon: 'error',
    title: 'Ошибка',
    text: error.message,
    timer: 3000,
    showConfirmButton: false
  });
}

let multiselect_block = document.querySelectorAll(".multiselect_block");
multiselect_block.forEach(parent => {
  let label = parent.querySelector(".field_multiselect");
  let select = parent.querySelector(".field_select");
  let text = label.innerHTML;
  select.addEventListener("change", function (element) {
    let selectedOptions = this.selectedOptions;
    label.innerHTML = "";
    for (let option of selectedOptions) {
      let button = document.createElement("button");
      button.type = "button";
      button.className = "btn_multiselect";
      button.textContent = option.value;
      button.onclick = _ => {
        option.selected = false;
        button.remove();
        if (!select.selectedOptions.length) label.innerHTML = text
      };
      label.append(button);
    }
  });
});

function getValues() {

  const data = Object.fromEntries(
    Object.entries(fields).map(([key, selector]) => [key, document.querySelector(selector).value])
  );

  const buttons = document.querySelectorAll('.btn_multiselect');
  let buttonValues = [];

  buttons.forEach(button => {
    const buttonValue = button.textContent.trim();
    buttonValues.push(buttonValue);
  });

  const { manager_name, phone, email } = data;

  buttonValues = buttonValues.join(', ');
  return { buttonValues, manager_name, phone, email };
}

if (id && username) {
  tg.MainButton.show();
  tg.MainButton.setParams({ has_shine_effect: true, text: 'Зарегистироваться', });

  tg.onEvent('mainButtonClicked', async (event) => {
    tg.MainButton.showProgress(true);

    const { buttonValues, manager_name, phone, email } = getValues();
    console.log({ buttonValues, manager_name, phone, email });
    if (buttonValues && manager_name && phone && email) {

      const timestamp = new Date().getTime();

      try {
        const response = await fetch(`/savedata?timestamp=${timestamp}&partner=${partner}&user_id=${id}&username=${username}&name=${manager_name}&phone=${phone}&email=${email}&groups=${buttonValues}`);

        const { success } = await response.json();
        if (success) {
          tg.showPopup({ message: 'Регистрация прошла успешно' });
          tg.MainButton.hideProgress();
          tg.MainButton.hide();
          window.location.href = '/';
        }
      } catch (error) {
        tg.showPopup({ title: 'Error', message: error });
        tg.MainButton.hideProgress();
      }
    } else {
      tg.showPopup({ message: 'Вначале заполните все данные' });
      tg.MainButton.hideProgress();
    }
  });
}