const API_URL = ""; 

// --- СОСТОЯНИЕ ПРИЛОЖЕНИЯ ---
let currentUser = null;
let currentThemeBg = "#f0f2f5";
let currentThemeEmoji = ""; 
let currentMusicUrl = ""; 
let customSelectedMusicUrl = ""; 
let currentCardName = "";
let slides = [{ header: "", img: "", message: "" }];
let currentIndex = 0;
let currentPlayingUrl = "";
let currentSavedUrl = null; 
let isSavingCard = false;   
window.selectedCustomColor = "#ffb6c1";

const cardThemes = [
    { id: 'mom', name: 'Любимой Маме 🌸', emoji: '🌸', bg: 'linear-gradient(135deg, #fbc2eb 0%, #a6c1ee 100%)', music: myMusicLibrary.romantic.tracks[0].url },
    { id: 'love', name: 'Любимому ❤️', emoji: '❤️', bg: 'linear-gradient(to top, #ff0844 0%, #ffb199 100%)', music: myMusicLibrary.romantic.tracks[0].url },
    { id: 'hb', name: 'С Днём Рождения 🎈', emoji: '🎈', bg: 'linear-gradient(120deg, #f6d365 0%, #fda085 100%)', music: myMusicLibrary.fun.tracks[0].url },
    { id: 'friend', name: 'Для Друга ✌️', emoji: '✌️', bg: 'linear-gradient(to right, #4facfe 0%, #00f2fe 100%)', music: myMusicLibrary.fun.tracks[0].url },
    { id: 'sad', name: 'Прости меня 🥺', emoji: '🥺', bg: 'linear-gradient(to top, #accbee 0%, #e7f0fd 100%)', music: myMusicLibrary.romantic.tracks[1].url },
    { id: 'neutral', name: 'Просто так ✨', emoji: '✨', bg: '#f0f2f5', music: "" }
];

document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('otkritka_token');
    const savedUser = localStorage.getItem('otkritka_username');
    
    if (token && savedUser) {
        // АВТОРИЗОВАННЫЙ ПОЛЬЗОВАТЕЛЬ (Видит свои открытки)
        currentUser = savedUser;
        const nameDisplay = document.getElementById('userNameDisplay');
        if(nameDisplay) nameDisplay.innerText = currentUser;
        
        document.getElementById('logoutBtn').style.display = 'block';
        document.getElementById('headerLoginBtn').style.display = 'none';
        document.getElementById('myCardsSection').style.display = 'block';
        document.querySelector('#myCardsSection h3').innerText = window.t('my_cards') || "Мои открытки 🗂️";
        
        fetchUserProfile(); 
        renderSavedCards();
    } else {
        // ГОСТЬ (Видит примеры)
        currentUser = null;
        const nameDisplay = document.getElementById('userNameDisplay');
        if(nameDisplay) nameDisplay.innerText = window.t('guest') || "Гость";
        
        document.getElementById('logoutBtn').style.display = 'none';
        document.getElementById('headerLoginBtn').style.display = 'block';
        
        // Показываем примеры в блоке открыток
        document.getElementById('myCardsSection').style.display = 'block';
        document.querySelector('#myCardsSection h3').innerHTML = "Примеры открыток 👀 <span style='font-size:12px; font-weight:normal; color:#888;'>(Для гостей)</span>";
        
        const container = document.getElementById('savedCardsContainer');
        container.innerHTML = `
            <div class="saved-card-item" onclick="window.open('/view.html?id=onTpg', '_blank')" style="cursor:pointer; background: #fff8f8; border: 1px dashed #ff9ff3;">
                <div class="saved-card-preview" style="background: linear-gradient(135deg, #fbc2eb 0%, #a6c1ee 100%);"><div class="saved-card-emoji">🌸</div></div>
                <div class="saved-card-info"><div class="saved-card-name" style="color:#ff4757;">Любимой маме (Пример)</div><p style="color:#888; font-size:12px;">Нажми, чтобы посмотреть</p></div>
            </div>
            <div class="saved-card-item" onclick="window.open('/view.html?id=onTpg', '_blank')" style="cursor:pointer; background: #fff8f8; border: 1px dashed #f6e58d;">
                <div class="saved-card-preview" style="background: linear-gradient(120deg, #f6d365 0%, #fda085 100%);"><div class="saved-card-emoji">🎈</div></div>
                <div class="saved-card-info"><div class="saved-card-name" style="color:#e15f41;">С Днем Рождения (Пример)</div><p style="color:#888; font-size:12px;">Нажми, чтобы посмотреть</p></div>
            </div>
        `;
    }
    
    showScreen('screen-dashboard');
    setTimeout(() => { renderThemes(); renderCategoryButtons(); }, 100);
});

// --- СИСТЕМА УВЕДОМЛЕНИЙ И ПОДТВЕРЖДЕНИЙ ---
function showToast(message, type = "") {
    const container = document.getElementById('toastContainer');
    if (!container) return;
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `<span class="toast-message">${message}</span><span class="toast-close" style="margin-left:15px; opacity:0.5; font-size:18px;">✖</span>`;
    const removeToast = () => { toast.classList.add('fade-out'); setTimeout(() => toast.remove(), 300); };
    toast.addEventListener('click', removeToast);
    setTimeout(removeToast, 4000);
    container.appendChild(toast);
}

function showConfirm(message, onConfirmCallback) {
    const overlay = document.getElementById('confirmOverlay');
    const modal = document.getElementById('confirmModal');
    if(!overlay || !modal) {
        if(confirm(message)) onConfirmCallback();
        return;
    }
    document.getElementById('confirmMessage').innerText = message;
    overlay.style.display = 'block';
    modal.style.display = 'block';
    const closeConfirm = () => {
        overlay.style.display = 'none';
        modal.style.display = 'none';
        document.getElementById('confirmYesBtn').onclick = null;
        document.getElementById('confirmNoBtn').onclick = null;
    };
    document.getElementById('confirmYesBtn').onclick = () => { closeConfirm(); onConfirmCallback(); };
    document.getElementById('confirmNoBtn').onclick = closeConfirm;
}

let isLoginMode = true;
function toggleAuthMode() {
    isLoginMode = !isLoginMode;
    const t = window.t || (k => k); 
    
    // Меняем заголовки
    document.getElementById('authTitle').innerText = isLoginMode ? (t('auth_title') || "Вход в аккаунт 🔐") : (t('btn_up') || "Создать аккаунт ✨");
    document.getElementById('authSub').innerText = isLoginMode ? (t('auth_sub') || "Чтобы сохранять открытки навсегда") : "Регистрация нового профиля";
    
    // ПРЯЧЕМ И ПОКАЗЫВАЕМ НУЖНЫЕ КНОПКИ
    document.getElementById('loginBtn').style.display = isLoginMode ? 'block' : 'none';
    document.getElementById('regBtn').style.display = isLoginMode ? 'none' : 'block';
    
    // Меняем текст самой ссылки-переключателя
    document.getElementById('authToggleBtn').innerText = isLoginMode ? "Нет аккаунта? Создать ✨" : "Уже есть аккаунт? Войти ➔";
}

// --- АВТОРИЗАЦИЯ ---
async function registerUser() {
    const user = document.getElementById('usernameInput').value.trim();
    const pass = document.getElementById('passwordInput').value.trim();
    if (!user || !pass) return showToast(window.t('toast_enter_cred') || "Пожалуйста, введите логин и пароль!", "error");

    try {
        const regResponse = await fetch(`${API_URL}/api/register`, {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: user, password: pass })
        });
        
        const regData = await regResponse.json();
        if (!regResponse.ok) return showToast((window.t('toast_err_server') || "Ошибка сервера!") + " " + regData.detail, "error");

        showToast(window.t('toast_acc_created') || "🎉 Аккаунт создан! Входим...", "success");
        
        const formData = new URLSearchParams(); formData.append('username', user); formData.append('password', pass);
        const loginResponse = await fetch(`${API_URL}/api/login`, {
            method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: formData.toString()
        });
        
        if (loginResponse.ok) {
            const loginData = await loginResponse.json();
            localStorage.setItem('otkritka_token', loginData.access_token);
            localStorage.setItem('otkritka_username', user);
            currentUser = user; 
            document.getElementById('userNameDisplay').innerText = currentUser;
            
            // --- МГНОВЕННОЕ ОБНОВЛЕНИЕ ИНТЕРФЕЙСА ---
            document.getElementById('logoutBtn').style.display = 'block';
            document.getElementById('headerLoginBtn').style.display = 'none';
            document.getElementById('myCardsSection').style.display = 'block';
            const cardsTitle = document.querySelector('#myCardsSection h3');
            if(cardsTitle) cardsTitle.innerText = window.t('my_cards') || "Мои открытки 🗂️";
            
            await fetchUserProfile(); showScreen('screen-dashboard'); renderSavedCards();
        }
    } catch (e) { showToast(window.t('toast_net_err') || "Ошибка сети. Бэкенд запущен?", "error"); }
}

async function loginUser() {
    const user = document.getElementById('usernameInput').value.trim();
    const pass = document.getElementById('passwordInput').value.trim();
    if (!user || !pass) return showToast(window.t('toast_enter_cred') || "Введите логин и пароль!", "error");

    const formData = new URLSearchParams(); formData.append('username', user); formData.append('password', pass);
    try {
        const response = await fetch(`${API_URL}/api/login`, {
            method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: formData.toString()
        });
        const data = await response.json();
        if (response.ok) {
            localStorage.setItem('otkritka_token', data.access_token);
            localStorage.setItem('otkritka_username', user);
            currentUser = user; 
            document.getElementById('userNameDisplay').innerText = currentUser;
            
            // --- МГНОВЕННОЕ ОБНОВЛЕНИЕ ИНТЕРФЕЙСА ---
            document.getElementById('logoutBtn').style.display = 'block';
            document.getElementById('headerLoginBtn').style.display = 'none';
            document.getElementById('myCardsSection').style.display = 'block';
            const cardsTitle = document.querySelector('#myCardsSection h3');
            if(cardsTitle) cardsTitle.innerText = window.t('my_cards') || "Мои открытки 🗂️";

            await fetchUserProfile(); showScreen('screen-dashboard'); renderSavedCards();
        } else {
            showToast(window.t('toast_wrong_cred') || "❌ Неверный логин или пароль", "error");
        }
    } catch (e) { showToast(window.t('toast_net_err') || "Ошибка сети. Бэкенд запущен?", "error"); }
}

function logout() {
    localStorage.removeItem('otkritka_token');
    localStorage.removeItem('otkritka_username');
    currentUser = null;
    location.reload(); // Перезагружаем страницу, чтобы гостевой режим включился сам
}

function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(screenId).classList.add('active');
    if(screenId === 'screen-dashboard') {
        document.body.style.background = '#f0f2f5';
        const pattern = document.getElementById('bg-pattern-layer');
        if (pattern) pattern.remove(); 
    }
}

// --- БАЛАНС ---
async function fetchUserProfile() {
    const token = localStorage.getItem('otkritka_token');
    if (!token) return;
    
    try {
        const response = await fetch(`${API_URL}/api/me`, { 
            headers: { 'Authorization': `Bearer ${token}` } 
        });
        
        if (response.ok) {
            const data = await response.json();
            const balanceEl = document.getElementById('balanceDisplay');
            // Просто берем цифру с сервера и обновляем шапку
            if(balanceEl) balanceEl.innerText = data.free_cards;
        }
    } catch (e) { 
        console.log("Не удалось обновить профиль"); 
    }
}

function openShopModal() { const s = document.getElementById('shopModal'); if(s) s.style.display = 'flex'; }
function closeShopModal() { const s = document.getElementById('shopModal'); if(s) s.style.display = 'none'; }
function openOutOfCardsModal() { const m = document.getElementById('outOfCardsModal'); if(m) m.style.display = 'flex'; }
function closeOutOfCardsModal() { const m = document.getElementById('outOfCardsModal'); if(m) m.style.display = 'none'; }

// --- ПРОСМОТР РЕКЛАМЫ (СИМУЛЯТОР) ---
async function watchAdAndSave() {
    const btn = document.getElementById('watchAdBtn');
    if(btn) btn.disabled = true;

    // Показываем окно рекламы
    const adModal = document.getElementById('adModal');
    const timerDisplay = document.getElementById('adTimerDisplay');
    adModal.style.display = 'flex';
    
    let timeLeft = 5; // 5 секунд
    timerDisplay.innerText = timeLeft;

    const countdown = setInterval(async () => {
        timeLeft--;
        timerDisplay.innerText = timeLeft;
        
        if (timeLeft <= 0) {
            clearInterval(countdown);
            adModal.style.display = 'none';
            if(btn) btn.disabled = false;

            // Начисляем открытку на бэкенде
            const token = localStorage.getItem('otkritka_token');
            try {
                const response = await fetch(`${API_URL}/api/reward-ad`, {
                    method: 'POST',
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                
                if (response.ok) {
                    showToast(window.t('toast_ad_reward') || "✅ Реклама просмотрена! Начислена 1 открытка.", "success");
                    fetchUserProfile(); 
                    closeOutOfCardsModal();
                    
                    // Сразу переходим к отправке
                    document.getElementById('finishModal').style.display = 'flex';
                    shareCard(); 
                } else {
                    showToast(window.t('toast_err_server') || "Ошибка сервера!", "error");
                }
            } catch (e) {
                showToast(window.t('toast_net_err') || "Ошибка сети", "error");
            }
        }
    }, 1000);
}

// --- ПРОСМОТР РЕКЛАМЫ (ИЗ ШАПКИ, ПРОСТО ДЛЯ БАЛАНСА) ---
async function watchAdForFreeCard() {
    // Показываем окно рекламы
    const adModal = document.getElementById('adModal');
    const timerDisplay = document.getElementById('adTimerDisplay');
    
    if(!adModal) return;
    
    adModal.style.display = 'flex';
    
    let timeLeft = 5; // 5 секунд рекламы
    timerDisplay.innerText = timeLeft;

    const countdown = setInterval(async () => {
        timeLeft--;
        timerDisplay.innerText = timeLeft;
        
        if (timeLeft <= 0) {
            clearInterval(countdown);
            adModal.style.display = 'none'; // Скрываем рекламу

            // Начисляем открытку на бэкенде
            const token = localStorage.getItem('otkritka_token');
            try {
                const response = await fetch(`${API_URL}/api/reward-ad`, {
                    method: 'POST',
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                
                if (response.ok) {
                    showToast(window.t('toast_ad_reward') || "✅ Реклама просмотрена! Начислена 1 открытка.", "success");
                    // Мгновенно обновляем цифру баланса в шапке!
                    fetchUserProfile(); 
                } else {
                    showToast(window.t('toast_err_server') || "Ошибка сервера!", "error");
                }
            } catch (e) {
                showToast(window.t('toast_net_err') || "Ошибка сети", "error");
            }
        }
    }, 1000);
}


// --- ТЕМЫ И ИСТОРИЯ ---
function renderThemes() {
    const container = document.getElementById('themesContainer');
    if(!container) return;
    container.innerHTML = '';
    
    // 1. ДОБАВЛЯЕМ "СВОЙ ДИЗАЙН" (Без блокировок)
    const customBtn = document.createElement('button');
    customBtn.className = 'theme-tile';
    customBtn.innerHTML = window.t ? window.t('theme_custom') : '+ Свой дизайн 🎨';
    customBtn.style.background = 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)';
    customBtn.style.color = '#333';
    customBtn.onclick = () => {
        startBuilder('#f0f2f5', '', '', ''); 
        document.getElementById('customThemeModal').style.display = 'flex';
    };
    container.appendChild(customBtn);

    // 2. ДОБАВЛЯЕМ ОСТАЛЬНЫЕ ШАБЛОНЫ (Без блокировок)
    cardThemes.forEach(theme => {
        const btn = document.createElement('button');
        btn.className = 'theme-tile';
        const translatedName = window.t ? window.t('theme_' + theme.id) : theme.name;
        btn.innerText = translatedName || theme.name;
        btn.style.background = theme.bg;
        btn.onclick = () => {
            startBuilder(theme.bg, theme.emoji, theme.music, translatedName || theme.name);
        };
        container.appendChild(btn);
    });
}

// --- ВЫБОР ЦВЕТА СВОЕГО ДИЗАЙНА ---
function setCustomColor(color, element) {
    document.getElementById('selectedColorValue').value = color;
    document.querySelectorAll('.color-circle').forEach(el => el.style.border = '2px solid transparent');
    if(element && element.classList.contains('color-circle')) {
        element.style.border = '2px solid #2c3e50';
    }
    
    // МГНОВЕННО меняем цвет фона позади окна!
    document.body.style.background = color;
}

function closeCustomThemeModal() {
    document.getElementById('customThemeModal').style.display = 'none';
    showScreen('screen-dashboard'); 
}

function startCustomTheme() {
    const name = document.getElementById('customThemeName').value.trim();
    const emoji = document.getElementById('customThemeEmoji').value.trim();
    const color = window.selectedCustomColor || document.getElementById('customThemeColor').value;
    if (!name) return showToast(window.t('toast_who_for') || "Кому будет эта открытка?", "error"); 
    document.getElementById('customThemeModal').style.display = 'none';
    startBuilder(color, emoji, customSelectedMusicUrl, name); 
}

async function renderSavedCards() {
    const container = document.getElementById('savedCardsContainer');
    if(!container) return;
    container.innerHTML = '<div style="text-align:center; color:#888;">⏳...</div>';
    const token = localStorage.getItem('otkritka_token');
    if (!token) return;
    try {
        const response = await fetch(`${API_URL}/api/my-cards`, { headers: { 'Authorization': `Bearer ${token}` } });
        if (response.status === 401) { logout(); return; }
        if (!response.ok) throw new Error("Ошибка");
        const cards = await response.json();
        container.innerHTML = '';
        if (cards.length === 0) { container.innerHTML = '<div style="text-align:center; color:#888;">Пусто</div>'; return; }
        
        cards.reverse().forEach(card => {
            const cardEl = document.createElement('div');
            cardEl.className = 'saved-card-item';
            
            const displayName = (!card.name || card.name === 'Без названия' || card.name === 'Untitled') 
                                ? (window.t('untitled') || 'Без названия') 
                                : card.name;
                                
            const shareText = window.t('btn_share') || 'Поделиться';

            cardEl.innerHTML = `
                <div class="saved-card-preview" style="background: ${card.bg};"><div class="saved-card-emoji">${card.emoji || '💌'}</div></div>
                <div class="saved-card-info"><div class="saved-card-name">${displayName}</div></div>
                <div class="saved-card-actions">
                    <button class="saved-btn share-btn" onclick="shareSavedCardFromServer('${card.id}')">${shareText}</button>
                    <button class="saved-btn delete-btn" onclick="deleteCardFromServer('${card.id}')">🗑️</button>
                </div>
            `;
            container.appendChild(cardEl);
        });
    } catch (err) { container.innerHTML = '<div style="text-align:center; color:red;">Ошибка</div>'; }
}

async function shareSavedCardFromServer(shortId) {
    const baseUrl = window.location.origin + window.location.pathname.replace(/[^\/]+$/, '');
    const finalUrl = `${baseUrl}view.html?id=${shortId}`;
    if (navigator.share) {
        try { await navigator.share({ title: "Открытка", text: 'Смотри, какую открытку я сделал! 💖', url: finalUrl }); } 
        catch (err) { }
    } else {
        navigator.clipboard.writeText(finalUrl);
        showToast(window.t('toast_link_copied') || "Ссылка скопирована!", "success");
    }
}

function deleteCardFromServer(shortId) {
    const msg = window.t('confirm_del_saved') || "Точно удалить навсегда?";
    showConfirm(msg, async () => {
        const token = localStorage.getItem('otkritka_token');
        try {
            const response = await fetch(`${API_URL}/api/cards/${shortId}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
            if (response.ok) { renderSavedCards(); showToast(window.t('toast_deleted') || "Удалено", "success"); } 
            else { showToast(window.t('toast_delete_err') || "Ошибка удаления", "error"); }
        } catch (e) { showToast(window.t('toast_net_err') || "Ошибка сети", "error"); }
    });
}

// --- КОНСТРУКТОР ---
function startBuilder(bgStyle, emoji, musicUrl = "", defaultName = "") {
    currentSavedUrl = null;
    currentCardName = defaultName; 
    currentThemeBg = bgStyle;
    currentThemeEmoji = emoji || ""; 
    currentMusicUrl = musicUrl; 
    document.body.style.background = bgStyle;
    
    const oldPattern = document.getElementById('bg-pattern-layer');
    if (oldPattern) oldPattern.remove();
    if (currentThemeEmoji) {
        const pattern = document.createElement('div');
        pattern.id = 'bg-pattern-layer';
        const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80"><text x="40" y="40" font-size="30" text-anchor="middle" dominant-baseline="middle" opacity="0.15">${currentThemeEmoji}</text></svg>`;
        pattern.style.cssText = `position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:-1;background-image:url('data:image/svg+xml;utf8,${encodeURIComponent(svg)}')`;
        document.body.appendChild(pattern);
    }
    
    slides = [{ header: "", img: "", message: "" }];
    currentIndex = 0;
    
    const nameInput = document.getElementById('cardNameInput');
    if(nameInput) nameInput.value = defaultName;
    
    const interactBlock = document.getElementById('interactiveFeaturesBlock');
    if(interactBlock) {
        document.getElementById('hiddenMessageInput').value = "";
        document.getElementById('runawayBtnCheckbox').checked = false;
    }
    
    const customModal = document.getElementById('customThemeModal');
    if (customModal) customModal.style.display = 'none';
    const finishModal = document.getElementById('finishModal');
    if (finishModal) finishModal.style.display = 'none';

    updateUI();
    showScreen('screen-builder');
}

function updateUI() {
    const wordCard = window.t('word_card') || "Карточка";
    document.getElementById('slideCounter').innerText = `${wordCard} ${currentIndex + 1} / ${slides.length}`;
    
    document.getElementById('prevBtn').disabled = currentIndex === 0;
    document.getElementById('nextBtn').disabled = currentIndex === slides.length - 1;
    document.getElementById('deleteSlideBtn').disabled = slides.length === 1;

    const nameInput = document.getElementById('cardNameInput');
    const interactBlock = document.getElementById('interactiveFeaturesBlock');
    if (currentIndex === 0) {
        if(nameInput) nameInput.style.display = 'block';
        if(interactBlock) interactBlock.style.display = 'block';
    } else {
        if(nameInput) nameInput.style.display = 'none';
        if(interactBlock) interactBlock.style.display = 'none';
    }

    const currentSlide = slides[currentIndex];
    document.getElementById('headerInput').value = currentSlide.header;
    document.getElementById('messageInput').value = currentSlide.message;
    const preview = document.getElementById('imagePreview');
    const placeholder = document.getElementById('imagePlaceholderText');
    if (currentSlide.img) {
        preview.src = currentSlide.img; preview.style.display = 'block'; placeholder.style.display = 'none';
    } else {
        preview.src = ''; preview.style.display = 'none'; placeholder.style.display = 'block';
    }
}

function saveCurrentSlide() {
    slides[currentIndex].header = document.getElementById('headerInput').value;
    slides[currentIndex].message = document.getElementById('messageInput').value;
}
function prevSlide() { if (currentIndex > 0) { currentIndex--; updateUI(); } }
function nextSlide() { if (currentIndex < slides.length - 1) { currentIndex++; updateUI(); } }
function addSlide() { slides.push({ header: "", img: "", message: "" }); currentIndex = slides.length - 1; updateUI(); }
function saveCardName() { currentCardName = document.getElementById('cardNameInput').value; }

function deleteSlide() {
    if (slides.length <= 1) return;
    const msg = window.t('confirm_del_slide') || "Удалить эту карточку?";
    showConfirm(msg, () => {
        slides.splice(currentIndex, 1);
        if (currentIndex >= slides.length) currentIndex = slides.length - 1;
        updateUI();
    });
}

function openGifModal() { document.getElementById('gifModal').style.display = 'flex'; }
function closeGifModal() { document.getElementById('gifModal').style.display = 'none'; }
function renderCategoryButtons() {
    const tagsContainer = document.getElementById('categoryTags');
    if(!tagsContainer) return;
    tagsContainer.innerHTML = '';
    for (const key in myGifLibrary) {
        const btn = document.createElement('button');
        btn.innerText = window.t('cat_' + key) || myGifLibrary[key].name;
        btn.style.cssText = "padding: 8px 12px; border-radius: 15px; border: 1px solid #ff69b4; background: white; color: #ff69b4; cursor: pointer;";
        btn.onclick = () => showGifsFromCategory(key);
        tagsContainer.appendChild(btn);
    }
}
function showGifsFromCategory(categoryKey) {
    const resultsContainer = document.getElementById('gifResults');
    resultsContainer.innerHTML = ''; 
    myGifLibrary[categoryKey].urls.forEach(imgUrl => {
        const img = document.createElement('img'); img.src = imgUrl;
        img.onclick = () => { slides[currentIndex].img = imgUrl; closeGifModal(); updateUI(); };
        resultsContainer.appendChild(img);
    });
}
function useCustomUrl() {
    const url = document.getElementById('customUrlInput').value.trim();
    if (url) { slides[currentIndex].img = url; closeGifModal(); updateUI(); }
}

// --- МУЗЫКА ---
function openMusicModal() {
    document.getElementById('musicModal').style.display = 'flex';
    document.getElementById('musicSearchInput').value = ''; 
    document.getElementById('musicList').innerHTML = ''; // Очищаем старые результаты
}

function closeMusicModal() {
    document.getElementById('musicModal').style.display = 'none';
    const player = document.getElementById('previewPlayer');
    if(player) player.pause();
    currentPlayingUrl = "";
}

function renderMusicTags() {
    const tagsContainer = document.getElementById('musicTags');
    if(!tagsContainer) return;
    tagsContainer.innerHTML = '';
    for (const key in myMusicLibrary) {
        const btn = document.createElement('button');
        btn.innerText = window.t('cat_' + key) || myMusicLibrary[key].name;
        btn.style.cssText = "padding: 8px 12px; border-radius: 15px; border: 1px solid #3498db; background: white; color: #3498db; cursor: pointer;";
        btn.onclick = () => {
            Array.from(tagsContainer.children).forEach(b => { b.style.background = 'white'; b.style.color = '#3498db';});
            btn.style.background = '#3498db'; btn.style.color = 'white';
            showTracksFromCategory(key);
        };
        tagsContainer.appendChild(btn);
    }
}
function showTracksFromCategory(categoryKey) {
    const container = document.getElementById('musicList');
    container.innerHTML = ''; 
    myMusicLibrary[categoryKey].tracks.forEach(track => {
        const card = document.createElement('div');
        card.style.cssText = "display: flex; align-items: center; gap: 10px; background: #f8f9fa; padding: 10px; border-radius: 15px;";
        const playIcon = currentPlayingUrl === track.url && track.url !== "" ? '⏸️' : '▶️';
        const safeId = track.url ? track.url.replace(/[^a-zA-Z0-9]/g, '') : '';
        card.innerHTML = `
            <img src="${track.cover}" style="width: 50px; height: 50px; border-radius: 10px; object-fit: cover;">
            <div style="flex-grow: 1;"><div style="font-weight: bold; font-size: 14px;">${track.name}</div></div>
            ${track.url ? `<button onclick="togglePreview('${track.url}')" style="background:none; border:none; font-size:24px; cursor:pointer;" id="playBtn-${safeId}">${playIcon}</button>` : ''}
            <button onclick="confirmMusicSelection('${track.url}', '${track.name}')" style="background: #2ecc71; color: white; border: none; padding: 8px 15px; border-radius: 10px; font-weight: bold; cursor: pointer;">Выбрать</button>
        `;
        container.appendChild(card);
    });
}
function togglePreview(url) {
    const player = document.getElementById('previewPlayer');
    const safeId = url.replace(/[^a-zA-Z0-9]/g, '');
    document.querySelectorAll('[id^="playBtn-"]').forEach(btn => btn.innerText = '▶️');
    if (currentPlayingUrl === url) { player.pause(); currentPlayingUrl = ""; } 
    else { player.src = url; player.play(); currentPlayingUrl = url; const currentBtn = document.getElementById(`playBtn-${safeId}`); if (currentBtn) currentBtn.innerText = '⏸️'; }
}
function confirmMusicSelection(url, name) {
    customSelectedMusicUrl = url;
    const customBtn = document.getElementById('customMusicBtn');
    if(customBtn) {
        customBtn.innerText = url ? name : 'Без музыки 🔇';
        customBtn.style.background = url ? '#2ecc71' : '#95a5a6'; 
    }
    closeMusicModal();
}
function useMusicCustomUrl() {
    const urlInput = document.getElementById('customMusicUrlInput');
    const url = urlInput.value.trim();
    const btn = document.getElementById('testMusicBtn');
    if (!url) return;
    btn.innerText = "⏳..."; btn.disabled = true; urlInput.disabled = true;
    const testAudio = new Audio();
    testAudio.oncanplay = () => {
        btn.innerText = "Ок"; btn.disabled = false; urlInput.disabled = false;
        document.getElementById('previewPlayer').pause(); currentPlayingUrl = "";
        confirmMusicSelection(url, "Своя музыка 🎵"); urlInput.value = '';
    };
    testAudio.onerror = () => {
        showToast(window.t('toast_music_err') || "Ошибка", "error");
        btn.innerText = "Ок"; btn.disabled = false; urlInput.disabled = false;
    };
    testAudio.src = url;
}

// --- ФИНАЛ И ОТПРАВКА ---
function finishCard() {
    // 1. ЕСЛИ ЭТО ГОСТЬ - ОСТАНАВЛИВАЕМ И ОТПРАВЛЯЕМ НА РЕГИСТРАЦИЮ
    if (!currentUser) {
        showToast("Для сохранения и отправки открытки нужно войти в аккаунт! 🔐", "error");
        showScreen('screen-auth');
        return; 
    }

    // 2. Если авторизован - продолжаем сохранение
    const nInput = document.getElementById('cardNameInput');
    const finalName = nInput ? nInput.value.trim() : currentCardName;
    if (!finalName) { showToast(window.t('toast_need_name') || "Напишите название (на 1-й карте)!", "error"); currentIndex = 0; updateUI(); return; }
    if (slides.some(slide => !slide.img)) { showToast(window.t('toast_need_img') || "Выберите все картинки!", "error"); return; }
    document.getElementById('finishModal').style.display = 'flex';
}

function goToDashboard() { document.getElementById('finishModal').style.display = 'none'; showScreen('screen-dashboard'); renderSavedCards(); }

async function shareCard() {
    if (currentSavedUrl) {
        if (navigator.share) { try { await navigator.share({ title: currentCardName, url: currentSavedUrl }); } catch (err) {} } 
        else { navigator.clipboard.writeText(currentSavedUrl); showToast(window.t('toast_link_copied') || "Ссылка скопирована!", "success"); }
        return; 
    }

    if (isSavingCard) return;
    isSavingCard = true;

    const nInput = document.getElementById('cardNameInput');
    const hmInput = document.getElementById('hiddenMessageInput');
    const rbCheck = document.getElementById('runawayBtnCheckbox');
    
    const cardData = {
        n: (nInput && nInput.value.trim() !== "") ? nInput.value.trim() : (currentCardName || "Без названия"), 
        b: currentThemeBg || "#ffffff",
        e: currentThemeEmoji || "✨",
        mu: currentMusicUrl || "",
        hm: hmInput ? hmInput.value.trim() : "",
        rb: rbCheck ? rbCheck.checked : false,
        s: slides.map(slide => ({ h: slide.header || "", i: slide.img || "", m: slide.message || "" }))
    };

    const buttonsContainer = document.querySelector('#finishModal .generate-btn');
    const oldText = buttonsContainer ? buttonsContainer.innerText : "Отправить";
    if (buttonsContainer) buttonsContainer.innerText = "⏳...";

    try {
        const token = localStorage.getItem('otkritka_token');
        if (!token) { showToast(window.t('toast_not_auth') || "Вы не авторизованы!", "error"); return; }

        const response = await fetch(`${API_URL}/api/cards`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify(cardData)
        });

        if (response.status === 403) { document.getElementById('finishModal').style.display = 'none'; openOutOfCardsModal(); return; }
        if (!response.ok) throw new Error("Ошибка сервера");

        const data = await response.json();
        const baseUrl = window.location.origin + window.location.pathname.replace(/[^\/]+$/, '');
        currentSavedUrl = `${baseUrl}view.html?id=${data.short_id}`;

        fetchUserProfile(); 
        
        if (navigator.share) { try { await navigator.share({ title: cardData.n, url: currentSavedUrl }); } catch (err) {} } 
        else { navigator.clipboard.writeText(currentSavedUrl); showToast(window.t('toast_link_copied') || "Ссылка скопирована!", "success"); }
    } catch (err) { showToast(window.t('toast_save_err') || "Ошибка", "error"); } 
    finally { if (buttonsContainer) buttonsContainer.innerText = oldText; isSavingCard = false; }
}

function downloadCard() {
    const hmInput = document.getElementById('hiddenMessageInput');
    const rbCheck = document.getElementById('runawayBtnCheckbox');
    const blob = new Blob([generateHtmlString(currentThemeBg, slides, currentThemeEmoji, currentMusicUrl, hmInput ? hmInput.value : "", rbCheck ? rbCheck.checked : false)], { type: 'text/html' }); 
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = `${currentCardName || 'Открытка'}.html`;
    document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url);
}

// --- ЛОГИКА ВЫБОРА ЭМОДЗИ ДЛЯ "СВОЕГО ДИЗАЙНА" ---

// --- ЛОГИКА ВЫБОРА ЭМОДЗИ ДЛЯ "СВОЕГО ДИЗАЙНА" ---
function setPresetEmoji(emoji, btnElement) {
    document.getElementById('customEmojiInput').value = emoji;
    document.querySelectorAll('.emoji-preset-btn').forEach(btn => btn.style.border = '2px solid transparent');
    if(btnElement) btnElement.style.border = '2px solid #2c3e50';
    
    // МГНОВЕННО обновляем эмодзи на фоне!
    updateLivePreviewEmoji(emoji);
}

function clearPresetEmojis(inputElement) {
    document.querySelectorAll('.emoji-preset-btn').forEach(btn => btn.style.border = '2px solid transparent');
    const chars = Array.from(inputElement.value);
    if (chars.length > 1) {
        inputElement.value = chars[0];
    }
    
    // МГНОВЕННО обновляем эмодзи, когда печатаем свой!
    updateLivePreviewEmoji(inputElement.value);
}

// НОВАЯ ФУНКЦИЯ ДЛЯ ОТРИСОВКИ ЭМОДЗИ ПОЗАДИ ОКНА
function updateLivePreviewEmoji(emoji) {
    let oldPattern = document.getElementById('bg-pattern-layer');
    if (oldPattern) oldPattern.remove();
    if (emoji) {
        const pattern = document.createElement('div');
        pattern.id = 'bg-pattern-layer';
        const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80"><text x="40" y="40" font-size="30" text-anchor="middle" dominant-baseline="middle" opacity="0.15">${emoji}</text></svg>`;
        pattern.style.cssText = `position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:-1;background-image:url('data:image/svg+xml;utf8,${encodeURIComponent(svg)}')`;
        document.body.appendChild(pattern);
    }
}