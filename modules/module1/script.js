// --- Логіка вкладок ---
function openTab(tabName) {
    // 1. Приховати всі вкладки
    const contents = document.querySelectorAll('.tab-content');
    contents.forEach(content => content.classList.remove('active'));

    // 2. Деактивувати всі кнопки
    const buttons = document.querySelectorAll('.tab-btn');
    buttons.forEach(btn => btn.classList.remove('active'));

    // 3. Показати обрану
    document.getElementById(tabName).classList.add('active');
    
    // 4. Активувати кнопку (знаходимо її за текстом або індексом, тут просто перебираємо)
    // У реальному проекті краще дати ID кнопкам, але тут спрощено:
    const clickedBtn = Array.from(buttons).find(btn => btn.getAttribute('onclick').includes(tabName));
    if(clickedBtn) clickedBtn.classList.add('active');
}

// --- Логіка автозбереження (LocalStorage) ---

// Функція збереження даних
function saveData(key, value) {
    localStorage.setItem(key, value);
}

// Функція завантаження даних при запуску сторінки
function loadData() {
    // Список всіх ID інпутів, які треба відновити
    const inputs = [
        'studentName', 
        'm1_t1_r1_c1', 'm1_t1_r1_c2',
        'm1_t1_r2_c1', 'm1_t1_r2_c2',
        'm1_t1_r3_c1', 'm1_t1_r3_c2',
        'm1_q1', 'm1_q2',
        'm1_ref1', 'm1_ref2'
    ];

    inputs.forEach(id => {
        const element = document.getElementById(id);
        // Для кожного елемента шукаємо збережене значення в LocalStorage
        // Ключ в LocalStorage буде таким самим, як ID елемента, або спеціальним (наприклад, m1_name)
        // У html я використав saveData('ключ', value). Тут треба підлаштувати логіку.
        // Щоб було простіше, я в HTML в oninput передаю конкретний ключ. 
        // Тут ми просто перевіримо конкретні ключі.
    });

    // Більш універсальний метод: відновити все по ID
    const allInputs = document.querySelectorAll('input[type="text"], textarea');
    allInputs.forEach(input => {
        // Ми використовуємо ID input-а або аргумент функції з HTML як ключ
        // Але оскільки в HTML вказано oninput="saveData('KEY', val)", відновити складніше.
        // Давайте зробимо так: при завантаженні ми беремо значення за тими ключами, які вказані в HTML.
        
        // Оскільки ми не можемо "розпарсити" HTML JS-ом легко, краще використовувати ID як ключ.
        // Я виправлю це в логіці нижче.
    });

    // ПРАВИЛЬНИЙ ПІДХІД:
    // Ми просто беремо елемент по ID і шукаємо в LS ключ з таким же ID (або відповідний йому).
    // В HTML я використав ключі типу 'm1_name'.
    
    if(localStorage.getItem('m1_name')) document.getElementById('studentName').value = localStorage.getItem('m1_name');
    
    // Таблиця
    if(localStorage.getItem('m1_t1_r1_c1')) document.getElementById('m1_t1_r1_c1').value = localStorage.getItem('m1_t1_r1_c1');
    if(localStorage.getItem('m1_t1_r1_c2')) document.getElementById('m1_t1_r1_c2').value = localStorage.getItem('m1_t1_r1_c2');
    
    if(localStorage.getItem('m1_t1_r2_c1')) document.getElementById('m1_t1_r2_c1').value = localStorage.getItem('m1_t1_r2_c1');
    if(localStorage.getItem('m1_t1_r2_c2')) document.getElementById('m1_t1_r2_c2').value = localStorage.getItem('m1_t1_r2_c2');
    
    if(localStorage.getItem('m1_t1_r3_c1')) document.getElementById('m1_t1_r3_c1').value = localStorage.getItem('m1_t1_r3_c1');
    if(localStorage.getItem('m1_t1_r3_c2')) document.getElementById('m1_t1_r3_c2').value = localStorage.getItem('m1_t1_r3_c2');

    // Питання
    if(localStorage.getItem('m1_q1')) document.getElementById('m1_q1').value = localStorage.getItem('m1_q1');
    if(localStorage.getItem('m1_q2')) document.getElementById('m1_q2').value = localStorage.getItem('m1_q2');
    
    // Рефлексія
    if(localStorage.getItem('m1_ref1')) document.getElementById('m1_ref1').value = localStorage.getItem('m1_ref1');
    if(localStorage.getItem('m1_ref2')) document.getElementById('m1_ref2').value = localStorage.getItem('m1_ref2');

    // Energy check відновлення
    const savedEnergy = localStorage.getItem('m1_energy');
    if (savedEnergy) {
        const buttons = document.querySelectorAll('.energy-btn');
        buttons.forEach(btn => {
            if(btn.getAttribute('onclick').includes(savedEnergy)) {
                btn.classList.add('active');
            }
        });
    }
}

// --- Energy Check-in ---
function setEnergy(btn, mode) {
    // Прибрати активність з усіх
    document.querySelectorAll('.energy-btn').forEach(b => b.classList.remove('active'));
    // Додати активність натиснутій
    btn.classList.add('active');
    // Зберегти
    saveData('m1_energy', mode);
}

// --- AI Copy ---
function copyToClipboard(btnElement) {
    // Знаходимо текст в попередньому елементі (p.prompt-text)
    const textToCopy = btnElement.previousElementSibling.innerText;
    
    // Використовуємо Clipboard API
    navigator.clipboard.writeText(textToCopy).then(() => {
        // Візуальний зворотній зв'язок
        const originalText = btnElement.innerText;
        btnElement.innerText = "✅ Скопійовано!";
        btnElement.style.background = "#4caf50";
        
        setTimeout(() => {
            btnElement.innerText = originalText;
            btnElement.style.background = "#8e24aa";
        }, 2000);
    }).catch(err => {
        console.error('Не вдалося скопіювати: ', err);
    });
}

// Запускаємо відновлення даних при завантаженні
window.onload = loadData;
