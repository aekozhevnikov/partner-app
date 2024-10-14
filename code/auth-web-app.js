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
    const data = await response.json();
    const flatValues = data.flat();

    flatValues.forEach(option => {
      const optionElement = document.createElement('option');
      optionElement.value = option
      optionElement.text = option
      selectElement.appendChild(optionElement);
    });

  } catch (error) {
    console.error('Error fetching data:', error);
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

try {
  function UIProgressButton(el, options) {
    this.el = el;
    this.options = extend({}, this.options);
    extend(this.options, options);
    this._init();
  }

  UIProgressButton.prototype._init = function () {
    this.button = this.el.querySelector('button');
    this.progressEl = new SVGEl(this.el.querySelector('svg.progress-circle'));
    this.successEl = new SVGEl(this.el.querySelector('svg.checkmark'));
    this.errorEl = new SVGEl(this.el.querySelector('svg.cross'));
    // init events
    this._initEvents();
    // enable button
    this._enable();
  }

  function SVGEl(el) {
    this.el = el;
    // the path elements
    this.paths = [].slice.call(this.el.querySelectorAll('path'));
    // we will save both paths and its lengths in arrays
    this.pathsArr = new Array();
    this.lengthsArr = new Array();
    this._init();
  }

  SVGEl.prototype._init = function () {
    var self = this;
    this.paths.forEach(function (path, i) {
      self.pathsArr[i] = path;
      path.style.strokeDasharray = self.lengthsArr[i] = path.getTotalLength();
    });
    // undraw stroke
    this.draw(0);
  }

  // val in [0,1] : 0 - no stroke is visible, 1 - stroke is visible
  SVGEl.prototype.draw = function (val) {
    for (var i = 0, len = this.pathsArr.length; i < len; ++i) {
      this.pathsArr[i].style.strokeDashoffset = this.lengthsArr[i] * (1 - val);
    }
  }

  UIProgressButton.prototype._initEvents = function () {
    var self = this;
    this.button.addEventListener('click', function () {
      self._submit();
    });
  }

  UIProgressButton.prototype._submit = function () {
    classie.addClass(this.el, 'loading');
    var self = this,
      onEndBtnTransitionFn = function (ev) {
        if (support.transitions) {
          this.removeEventListener(transEndEventName, onEndBtnTransitionFn);
        }
        this.setAttribute('disabled', '');
        if (typeof self.options.callback === 'function') {
          self.options.callback(self);
        } else {
          self.setProgress(1);
          self.stop();
        }
      };
    if (support.transitions) {
      this.button.addEventListener(transEndEventName, onEndBtnTransitionFn);
    } else {
      onEndBtnTransitionFn();
    }
  }

  UIProgressButton.prototype.stop = function (status) {
    var self = this,
      endLoading = function () {
        self.progressEl.draw(0);
        if (typeof status === 'number') {
          var statusClass = status >= 0 ? 'success' : 'error',
            statusEl = status >= 0 ? self.successEl : self.errorEl;
          statusEl.draw(1);
          // add respective class to the element
          classie.addClass(self.el, statusClass);
          // after options.statusTime remove status and undraw the respective stroke and enable the button
          setTimeout(function () {
            classie.remove(self.el, statusClass);
            statusEl.draw(0);
            self._enable();
          }, self.options.statusTime);
        } else {
          self._enable();
        }
        classie.removeClass(self.el, 'loading');
      };
    // give it a little time (ideally the same like the transition time) so that the last progress increment animation is still visible.
    setTimeout(endLoading, 300);
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

  document.getElementById('progress-button').addEventListener('click', async (event) => {
    event.preventDefault();
    try {
      const fields = {
        name: '#manager-name',
        phone: '#manager-phone',
        email: '#manager-email',
      };

      const data = Object.fromEntries(
        Object.entries(fields).map(([key, selector]) => [key, document.querySelector(selector).value])
      );

      const { name, phone, email } = data;
      const { success } = await fetch(`/savedata?partner=${partner}&user_id=${id}&username=${username}&name=${name}&phone=${phone}&email=${email}`);

      if (success) {
        alert('Вы успешно авторизованы');
      }

    } catch (error) {
      alert('Ошибка Авторизации');
      showErrorNotification(error);
    }
  });

} catch (error) {
  showErrorNotification(error);
}