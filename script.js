const display = document.getElementById('display');
const displayScientific = document.getElementById('displayScientific');
const historyLog = document.getElementById('historyLog');

// === Standard Calculator ===
function append(char) {
  const lastChar = display.value.slice(-1);
  const operators = ['+', '-', '*', '/', '%'];
  if (operators.includes(char) && operators.includes(lastChar)) return;
  display.value += char;
}

function clearDisplay() {
  display.value = '';
}

function backspace() {
  display.value = display.value.slice(0, -1);
}

function calculate() {
  try {
    const result = new Function(`return (${display.value})`)();
    display.value = result;
    if (result !== undefined) addToHistory(display.value, result);
  } catch {
    display.value = 'Error';
  }
}

// === Scientific Calculator ===
let angleMode = 'DEG';
let memory = 0;

function appendToScientific(value) {
  displayScientific.value += value;
}

function clearScientific() {
  displayScientific.value = '';
}

function calculateScientific() {
  try {
    let expr = displayScientific.value;

    // Angle mode for trig
    if (angleMode === 'DEG') {
      expr = expr.replace(/Math\.sin\(([^)]+)\)/g, (_, x) => `Math.sin((${x}) * Math.PI / 180)`);
      expr = expr.replace(/Math\.cos\(([^)]+)\)/g, (_, x) => `Math.cos((${x}) * Math.PI / 180)`);
      expr = expr.replace(/Math\.tan\(([^)]+)\)/g, (_, x) => `Math.tan((${x}) * Math.PI / 180)`);
    }

    expr = expr.replace(/factorial\(([^)]+)\)/g, (_, x) => factorial(parseFloat(x)));
    const result = new Function(`return ${expr}`)();
    displayScientific.value = result;
    if (result !== undefined) addToHistory(expr, result);
  } catch {
    displayScientific.value = 'Error';
  }
}

function setAngleMode(mode) {
  angleMode = mode;
}

function factorial(n) {
  if (n < 0) return NaN;
  return n <= 1 ? 1 : n * factorial(n - 1);
}

// === Memory Functions ===
function memoryClear() {
  memory = 0;
}

function memoryRecall() {
  displayScientific.value += memory;
}

function memoryAdd() {
  try {
    memory += parseFloat(displayScientific.value) || 0;
  } catch {}
}

function memorySubtract() {
  try {
    memory -= parseFloat(displayScientific.value) || 0;
  } catch {}
}

// === History ===
function addToHistory(expr, result) {
  if (!historyLog) return;
  const entry = document.createElement('p');
  entry.innerHTML = `<strong>${expr}</strong> = ${result}`;
  historyLog.prepend(entry);
}

// === Keyboard Support ===
document.addEventListener('keydown', e => {
  if ((e.key >= '0' && e.key <= '9') || ['+', '-', '*', '/', '.', '%', '(', ')'].includes(e.key)) {
    append(e.key);
  } else if (e.key === 'Enter') {
    calculate();
  } else if (e.key === 'Backspace') {
    backspace();
  } else if (e.key === 'Escape') {
    clearDisplay();
  }
});

// === Unit Converter ===
const unitOptions = {
  length: ['meters', 'kilometers', 'miles'],
  weight: ['grams', 'kilograms', 'pounds'],
  temperature: ['celsius', 'fahrenheit', 'kelvin'],
};

const convertRates = {
  meters: { kilometers: 0.001, miles: 0.000621371 },
  kilometers: { meters: 1000, miles: 0.621371 },
  miles: { meters: 1609.34, kilometers: 1.60934 },
  grams: { kilograms: 0.001, pounds: 0.00220462 },
  kilograms: { grams: 1000, pounds: 2.20462 },
  pounds: { grams: 453.592, kilograms: 0.453592 },
};

function updateConverterOptions() {
  const type = document.getElementById('convertType').value;
  const from = document.getElementById('fromUnit');
  const to = document.getElementById('toUnit');
  from.innerHTML = to.innerHTML = '';
  unitOptions[type].forEach(unit => {
    from.innerHTML += `<option value="${unit}">${unit}</option>`;
    to.innerHTML += `<option value="${unit}">${unit}</option>`;
  });
}

function convertUnit() {
  const value = parseFloat(document.getElementById('inputValue').value);
  const from = document.getElementById('fromUnit').value;
  const to = document.getElementById('toUnit').value;
  const type = document.getElementById('convertType').value;
  const resultEl = document.getElementById('conversionResult');

  if (type === 'temperature') {
    resultEl.textContent = convertTemperature(value, from, to);
  } else {
    const rate = convertRates[from]?.[to];
    resultEl.textContent = rate ? (value * rate).toFixed(4) : 'Unsupported';
  }
}

function convertTemperature(val, from, to) {
  if (from === to) return val;
  if (from === 'celsius') {
    if (to === 'fahrenheit') return (val * 9/5 + 32).toFixed(2);
    if (to === 'kelvin') return (val + 273.15).toFixed(2);
  } else if (from === 'fahrenheit') {
    if (to === 'celsius') return ((val - 32) * 5/9).toFixed(2);
    if (to === 'kelvin') return ((val - 32) * 5/9 + 273.15).toFixed(2);
  } else if (from === 'kelvin') {
    if (to === 'celsius') return (val - 273.15).toFixed(2);
    if (to === 'fahrenheit') return ((val - 273.15) * 9/5 + 32).toFixed(2);
  }
  return 'Invalid';
}

// === Crypto Tools ===
async function convertFX() {
  const amount = parseFloat(document.getElementById('fxAmount').value);
  const from = document.getElementById('fxFrom').value;
  const to = document.getElementById('fxTo').value;
  const res = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${from}&vs_currencies=${to}`);
  const data = await res.json();
  const rate = data[from]?.[to];
  document.getElementById('fxResult').textContent = rate ? (amount * rate).toFixed(6) : 'Error';
}

async function fetchCryptoPrices() {
  const res = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana&vs_currencies=usd');
  const data = await res.json();
  const el = document.getElementById('cryptoPrices');
  el.innerHTML = `
    <p>BTC: $${data.bitcoin.usd}</p>
    <p>ETH: $${data.ethereum.usd}</p>
    <p>SOL: $${data.solana.usd}</p>
  `;
}
fetchCryptoPrices();
setInterval(fetchCryptoPrices, 60000); // Refresh every 1 min

function genWalletQR() {
  const addr = document.getElementById('walletAddr').value;
  const qr = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(addr)}&size=150x150`;
  document.getElementById('walletQR').src = qr;
}

async function fetchGasFee() {
  const res = await fetch('https://api.blocknative.com/gasprices/blockprices', {
    headers: { Authorization: '10440ee4-699b-4aaf-8b8e-35de02810210' } // Replace if needed
  });
  const data = await res.json();
  const fee = data?.blockPrices?.[0]?.estimatedPrices?.[0]?.maxFeePerGas;
  document.getElementById('gasResult').textContent = fee ? `${fee} Gwei` : 'N/A';
}

function calcMining() {
  const hashRate = parseFloat(document.getElementById('hashRate').value); // TH/s
  const powerCost = parseFloat(document.getElementById('powerCost').value); // $/kWh
  const revenuePerTH = 0.07; // Example BTC mining rev
  const dailyRevenue = hashRate * revenuePerTH;
  const powerUse = hashRate * 3000; // W per TH/s
  const dailyCost = (powerUse / 1000) * 24 * powerCost;
  const profit = dailyRevenue - dailyCost;
  document.getElementById('miningResult').textContent = `$${profit.toFixed(2)} / day`;
}