const tg = window.Telegram.WebApp;
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const username = urlParams.get('user');
const id = urlParams.get('id');
const partner = urlParams.get('partner');

tg.BackButton.show();

tg.onEvent('backButtonClicked', function(event) {
    window.location.href = '/';
  });

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
  
    document.getElementById('partner-form').addEventListener('submit', function (event) {
      event.preventDefault();
      try {
        const fields = {
          managerName: '#manager-name',
          managerPhone: '#manager-phone',
          managerTgAccount: '#manager-tg-account',
          managerEmail: '#manager-email',
        };
  
        const data = Object.fromEntries(
          Object.entries(fields).map(([key, selector]) => [key, document.querySelector(selector).value])
        );
  
        const {
          managerName,
          managerPhone,
          managerTgAccount,
          managerEmail
        } = data;
  
        alert('Данные успешно отправлены');
      } catch (error) {
        showErrorNotification(error);
      }
    });
  
    const addManagerButton = document.querySelector('.add-manager-button');
    const inputForm = document.querySelector('.input-form');
  
    addManagerButton.addEventListener('click', function () {
      inputForm.innerHTML += `
        <div class="input-label" id="manager-name-label">ФИО:</div>
        <input type="text" id="manager-name" placeholder="Name" required>
        <div class="input-label" id="manager-phone-label">Телефон:</div>
        <input type="text" id="manager-phone" placeholder="+79999999999" required>
        <div class="input-label" id="manager-tg-account-label">Телеграм:</div>
        <input type="text" id="manager-tg-account" class="telegram-account" placeholder="@username" required pattern="^@[A-Za-z0-9_]{1,}$">
        <div class="input-label" id="manager-email-label">Email:</div>
        <input type="text" id="manager-email" placeholder="example@mail.com" required>`;
    });
  } catch (error) {
    showErrorNotification(error);
  }