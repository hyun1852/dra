let display = document.getElementById('display');
let currentInput = '';
let themeToggle = document.getElementById('theme-toggle');

// 테마 토글 핸들러
themeToggle.addEventListener('change', (e) => {
    if (e.target.checked) {
        document.body.setAttribute('data-theme', 'dark');
    } else {
        document.body.removeAttribute('data-theme');
    }
});

function appendToDisplay(value) {
    if (currentInput === '0' && value !== '.') {
        currentInput = value;
    } else {
        currentInput += value;
    }
    updateDisplay();
}

function clearDisplay() {
    currentInput = '0';
    updateDisplay();
}

function deleteLast() {
    currentInput = currentInput.toString().slice(0, -1);
    if (currentInput === '') currentInput = '0';
    updateDisplay();
}

function updateDisplay() {
    display.innerText = currentInput;
}

function calculate() {
    try {
        // eval 대신 좀 더 안전한 방식이 좋지만, 간단한 계산기이므로 eval 사용
        // 실제 서비스에서는 수식 파싱 라이브러리 권장
        currentInput = eval(currentInput).toString();
        updateDisplay();
    } catch (error) {
        display.innerText = 'Error';
        currentInput = '';
    }
}

// 키보드 지원 추가
document.addEventListener('keydown', (e) => {
    if ((e.key >= '0' && e.key <= '9') || e.key === '.' || e.key === '+' || e.key === '-' || e.key === '*' || e.key === '/') {
        appendToDisplay(e.key);
    } else if (e.key === 'Enter' || e.key === '=') {
        calculate();
    } else if (e.key === 'Backspace') {
        deleteLast();
    } else if (e.key === 'Escape') {
        clearDisplay();
    }
});
