function append(char) {
  document.getElementById('display').value += char;
}

function clearDisplay() {
  document.getElementById('display').value = '';
}

function calculate() {
  try {
    const result = eval(document.getElementById('display').value);
    document.getElementById('display').value = result;
  } catch (e) {
    document.getElementById('display').value = 'Error';
  }
}