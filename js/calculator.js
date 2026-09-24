const PRICE_PER_HOUR = 100;
const MIN_HOURS = 1;
const MAX_HOURS = 100;

const calcForm = document.getElementById('calculator-form');
const hoursInput = document.getElementById('calc-hours');
const totalOutput = document.getElementById('calc-total');
const calcError = document.getElementById('calc-error');

function updateTotal() {
  const hours = Number(hoursInput.value);

  if (hoursInput.value === '' || !Number.isInteger(hours) || hours < MIN_HOURS || hours > MAX_HOURS) {
    calcError.textContent = `Введите целое число часов от ${MIN_HOURS} до ${MAX_HOURS}.`;
    calcError.hidden = false;
    totalOutput.textContent = '—';
    return;
  }

  calcError.hidden = true;
  totalOutput.textContent = (hours * PRICE_PER_HOUR).toLocaleString('ru-RU');
}

hoursInput.addEventListener('input', updateTotal);
calcForm.addEventListener('submit', function (event) {
  event.preventDefault();
});

updateTotal();
