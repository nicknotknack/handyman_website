const form = document.getElementById('request-form');
const message = document.getElementById('form-message');

form.addEventListener('submit', function (event) {
  event.preventDefault();

  const phoneInput = form.querySelector('.phone-input');

  if (!phoneInput.checkValidity()) {
    message.textContent = 'Введите корректный номер телефона.';
    message.className = 'form-message error';
    message.hidden = false;
    return;
  }

  message.textContent = 'Спасибо! Мы свяжемся с вами по номеру ' + phoneInput.value + '.';
  message.className = 'form-message success';
  message.hidden = false;

  form.reset();
});
