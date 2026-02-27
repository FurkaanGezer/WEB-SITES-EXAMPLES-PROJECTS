const display = document.querySelector(".calculator-input");
const keys = document.querySelector(".calculator-keys");

let displayValue = "0";
let firstValue = null;
let operator = null;
let waitingForSecondValue = false;
let lastSecondValue = null;
let lastOperator = null;

updateDisplay();

/* DISPLAY */

function updateDisplay() {
  display.value = displayValue;
}

/* EVENTS */

keys.addEventListener("click", (e) => {
  const element = e.target;
  if (!element.matches("button")) return;

  const value = element.value;

  switch (value) {
    case "+":
    case "-":
    case "*":
    case "/":
      handleOperator(value);
      break;

    case "=":
      handleEquals();
      break;

    case ".":
      inputDecimal();
      break;

    case "clear":
      clearAll();
      break;

    default:
      inputNumber(value);
  }

  updateDisplay();
});

/* NUMBER */

function inputNumber(num) {
  if (displayValue === "Error") clearAll();

  if (waitingForSecondValue) {
    displayValue = num;
    waitingForSecondValue = false;
  } else {
    displayValue = displayValue === "0" ? num : displayValue + num;
  }
}

/* DECIMAL */

function inputDecimal() {
  if (displayValue === "Error") clearAll();

  if (waitingForSecondValue) {
    displayValue = "0.";
    waitingForSecondValue = false;
    return;
  }

  if (!displayValue.includes(".")) {
    displayValue += ".";
  }
}

/* OPERATOR */

function handleOperator(nextOperator) {
  if (displayValue === "Error") return;

  const inputValue = parseFloat(displayValue);

  if (firstValue === null) {
    firstValue = inputValue;
  } else if (!waitingForSecondValue) {
    const result = calculate(firstValue, inputValue, operator);
    displayValue = formatNumber(result);
    firstValue = result;
  }

  operator = nextOperator;
  waitingForSecondValue = true;
}

/* EQUALS */

function handleEquals() {
  if (displayValue === "Error" || operator === null) return;

  const inputValue = parseFloat(displayValue);

  if (!waitingForSecondValue) {
    lastSecondValue = inputValue;
    lastOperator = operator;
  }

  const result = calculate(firstValue, lastSecondValue, lastOperator);

  displayValue = formatNumber(result);
  firstValue = result;
  waitingForSecondValue = true;
}

/* CALCULATE */

function calculate(first, second, operator) {
  if (second === null) return first;

  switch (operator) {
    case "+":
      return first + second;
    case "-":
      return first - second;
    case "*":
      return first * second;
    case "/":
      return second === 0 ? "Error" : first / second;
    default:
      return second;
  }
}

/* FORMAT */

function formatNumber(num) {
  if (num === "Error") return "Error";

  let result = parseFloat(num.toFixed(10)).toString();

  if (result.length > 14) {
    result = Number(result).toExponential(6);
  }

  return result;
}

/* CLEAR */

function clearAll() {
  displayValue = "0";
  firstValue = null;
  operator = null;
  waitingForSecondValue = false;
  lastSecondValue = null;
  lastOperator = null;
}
