const display = document.getElementById('display');

let currentInput = '0';
let previousValue = null;
let operator = null;
let shouldResetDisplay = false;

function updateDisplay() {
  display.textContent = currentInput;
}

function clearCalculator() {
  currentInput = '0';
  previousValue = null;
  operator = null;
  shouldResetDisplay = false;
  updateDisplay();
}

function deleteLastCharacter() {
  if (currentInput.length <= 1 || (currentInput.length === 2 && currentInput.startsWith('-'))) {
    currentInput = '0';
  } else {
    currentInput = currentInput.slice(0, -1);
  }
  updateDisplay();
}

function appendNumber(value) {
  if (shouldResetDisplay) {
    currentInput = '0';
    shouldResetDisplay = false;
  }

  if (value === '.' && currentInput.includes('.')) return;

  if (currentInput === '0' && value !== '.') {
    currentInput = value;
  } else {
    currentInput += value;
  }

  updateDisplay();
}

function chooseOperator(nextOperator) {
  const inputValue = Number(currentInput);

  if (previousValue === null) {
    previousValue = inputValue;
  } else if (operator) {
    previousValue = calculate(previousValue, inputValue, operator);
    currentInput = String(previousValue);
    updateDisplay();
  }

  operator = nextOperator;
  shouldResetDisplay = true;
}

function calculate(first, second, currentOperator) {
  switch (currentOperator) {
    case '+':
      return first + second;
    case '-':
      return first - second;
    case '*':
      return first * second;
    case '/':
      return second === 0 ? 'Error' : first / second;
    default:
      return second;
  }
}

function evaluateExpression() {
  if (operator === null || previousValue === null) return;

  const finalValue = calculate(previousValue, Number(currentInput), operator);

  currentInput = String(finalValue);
  previousValue = null;
  operator = null;
  shouldResetDisplay = true;
  updateDisplay();
}

function handleButtonClick(event) {
  const button = event.target.closest('button');
  if (!button) return;

  const { value, action } = button.dataset;

  if (action === 'clear') {
    clearCalculator();
    return;
  }

  if (action === 'delete') {
    deleteLastCharacter();
    return;
  }

  if (action === 'equals') {
    evaluateExpression();
    return;
  }

  if (button.classList.contains('number')) {
    appendNumber(value);
    return;
  }

  if (button.classList.contains('operator')) {
    chooseOperator(value);
  }
}

document.querySelectorAll('button').forEach((button) => {
  button.addEventListener('click', handleButtonClick);
});

document.addEventListener('keydown', (event) => {
  const { key } = event;

  if (/^[0-9]$/.test(key)) {
    appendNumber(key);
    return;
  }

  if (key === '.') {
    appendNumber('.');
    return;
  }

  if (['+', '-', '*', '/'].includes(key)) {
    chooseOperator(key);
    return;
  }

  if (key === 'Enter' || key === '=') {
    evaluateExpression();
    return;
  }

  if (key === 'Backspace') {
    deleteLastCharacter();
    return;
  }

  if (key === 'Escape') {
    clearCalculator();
  }
});

updateDisplay();
