// Calculator state
let firstOperand = null;
let operator = null;
let waitingForSecondOperand = false;
let displayValue = '0';

// Helper to update display
function updateDisplay() {
    document.getElementById('display').textContent = displayValue;
}

updateDisplay();

// Handle number and decimal input
function inputNumber(num) {
    if (waitingForSecondOperand) {
        displayValue = num;
        waitingForSecondOperand = false;
    } else {
        // Prevent multiple leading zeroes
        if (displayValue === '0' && num !== '.') {
            displayValue = num;
        } else if (num === '.' && displayValue.includes('.')) {
            // Prevent multiple decimals
            return;
        } else {
            displayValue += num;
        }
    }
    updateDisplay();
}

// Handle operator input
function inputOperator(nextOperator) {
    const inputValue = parseFloat(displayValue);

    if (operator && waitingForSecondOperand) {
        operator = nextOperator; // Allow operator change before next number
        return;
    }

    if (firstOperand == null && !isNaN(inputValue)) {
        firstOperand = inputValue;
    } else if (operator) {
        const result = performCalculation(firstOperand, inputValue, operator);
        displayValue = result;
        firstOperand = parseFloat(result);
        updateDisplay();
    }

    operator = nextOperator;
    waitingForSecondOperand = true;
}

// Perform actual calculation
function performCalculation(first, second, operator) {
    if (operator === '+') {
        return String(first + second);
    }
    if (operator === '-') {
        return String(first - second);
    }
    if (operator === '*') {
        return String(first * second);
    }
    if (operator === '/') {
        if (second === 0) return 'Error';
        return String(first / second);
    }
    return String(second);
}

// Handle clear button
function clearCalculator() {
    displayValue = '0';
    firstOperand = null;
    operator = null;
    waitingForSecondOperand = false;
    updateDisplay();
}

// Handle equals button
function handleEquals() {
    if (!operator || waitingForSecondOperand) {
        // No calculation to perform
        return;
    }
    const inputValue = parseFloat(displayValue);
    const result = performCalculation(firstOperand, inputValue, operator);

    displayValue = result;
    firstOperand = (result !== 'Error') ? parseFloat(result) : null;
    operator = null;
    waitingForSecondOperand = false;
    updateDisplay();
}

// Attach event listeners
document.querySelector('.calculator-buttons').addEventListener('click', function(e) {
    const target = e.target;
    if (!target.matches('button')) return;

    if (target.dataset.number) {
        inputNumber(target.dataset.number);
    }

    if (target.dataset.operator) {
        inputOperator(target.dataset.operator);
    }

    if (target.id === 'clear') {
        clearCalculator();
    }

    if (target.id === 'equals') {
        handleEquals();
    }
});

// Optional: Keyboard support
document.addEventListener('keydown', function(e) {
    if (/\d/.test(e.key)) {
        inputNumber(e.key);
    }
    if (e.key === '.') {
        inputNumber('.');
    }
    if (['+', '-', '*', '/'].includes(e.key)) {
        inputOperator(e.key);
    }
    if (e.key === 'Enter' || e.key === '=') {
        e.preventDefault();
        handleEquals();
    }
    if (e.key.toLowerCase() === 'c') {
        clearCalculator();
    }
});

