const tg = window.Telegram.WebApp;
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const username = urlParams.get('user');
const id = urlParams.get('id');
const partner = urlParams.get('partner');

// tg.BackButton.show();

tg.onEvent('backButtonClicked', (event) => {
  window.location.href = '/';
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

    try {
      const data = JSON.parse(text);
      const flatValues = data.flat();

      flatValues.forEach(option => {
        const optionElement = document.createElement('option');
        optionElement.value = option;
        optionElement.text = option;
        selectElement.appendChild(optionElement);
      });

    } catch (error) {
      console.error('Error parsing JSON data:', error.message); // Вывод текста ошибки в консоль
    }

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

function checkTelegramAccount(input) {
  if (input.value === '') {
    input.setCustomValidity("");
  } else {
    if (!input.value.startsWith('@')) {
      input.value = '@' + input.value;
    }

    let value = input.value;
    let pattern = /^@[A-Za-z0-9_]{1,}$/;

    if (!value.match(pattern)) {
      input.setCustomValidity("Неверный формат учетной записи Telegram. Используйте только буквы a-z, цифры 0-9 и _.");
    } else {
      input.setCustomValidity("");
    }
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

// document.getElementById('progress-button').addEventListener('click', async (event) => {
//   event.preventDefault();
//   try {
//     const fields = {
//       name: '#manager-name',
//       phone: '#manager-phone',
//       email: '#manager-email',
//     };

//     const data = Object.fromEntries(
//       Object.entries(fields).map(([key, selector]) => [key, document.querySelector(selector).value])
//     );

//     const buttons = document.querySelectorAll('.btn_multiselect');
//     let buttonValues = [];

//     buttons.forEach(button => {
//       const buttonValue = button.textContent.trim();
//       buttonValues.push(buttonValue);
//     });

//     buttonValues = buttonValues.join(', ');
//     console.log(buttonValues);

//     const { name, phone, email } = data;
//     const response = await fetch(`/savedata?partner=${partner}&user_id=${id}&username=${username}&name=${name}&phone=${phone}&email=${email}&groups=${buttonValues}`);
//     const { success } = await response.json();

//     if (success) {
//       alert('Вы успешно авторизованы');
//     }

//   } catch (error) {
//     alert('Ошибка Авторизации');
//     showErrorNotification(error);
//   }
// });