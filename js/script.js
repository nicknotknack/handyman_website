const TELEGRAM_BOT_TOKEN = '8905622619:AAEJr6LWfb0vngUAyoOSzgFS0dg5VJjMeF8';
const TELEGRAM_CHAT_ID = '-5112119367';

const form = document.getElementById('request-form');
const message = document.getElementById('form-message');

form.addEventListener('submit', async function (event) {
  event.preventDefault();

  const phoneInput = form.querySelector('.phone-input');
  const submitButton = form.querySelector('.btn');

  if (!phoneInput.checkValidity()) {
    message.textContent = 'Введите корректный номер телефона.';
    message.className = 'form-message error';
    message.hidden = false;
    return;
  }

  submitButton.disabled = true;

  try {
    const text = `Новая заявка с сайта!\nТелефон: ${phoneInput.value}`;

    const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: TELEGRAM_CHAT_ID, text }),
    });

    if (!response.ok) {
      throw new Error('Telegram API error');
    }

    message.textContent = 'Спасибо! Мы скоро вам перезвоним.';
    message.className = 'form-message success';
    message.hidden = false;
    form.reset();
  } catch (error) {
    message.textContent = 'Не удалось отправить заявку. Попробуйте ещё раз или позвоните нам напрямую.';
    message.className = 'form-message error';
    message.hidden = false;
  } finally {
    submitButton.disabled = false;
  }
});
