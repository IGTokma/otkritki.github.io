// --- СОСТОЯНИЕ ПРИЛОЖЕНИЯ ---
let currentUser = null;
let currentThemeBg = "#f0f2f5";
let currentThemeEmoji = ""; 
let currentMusicUrl = ""; // Музыка для текущей открытки
let customSelectedMusicUrl = ""; // Временная переменная для окна "Свой дизайн"
let currentCardName = "";
let slides = [{ header: "", img: "", message: "" }];
let currentIndex = 0;
let currentPlayingUrl = "";



// Берем музыку прямо из нашей базы myMusicLibrary
const cardThemes = [
    { id: 'mom', name: 'Любимой Маме 🌸', emoji: '🌸', bg: 'linear-gradient(135deg, #fbc2eb 0%, #a6c1ee 100%)', music: myMusicLibrary.romantic.tracks[0].url },
    { id: 'love', name: 'Любимому ❤️', emoji: '❤️', bg: 'linear-gradient(to top, #ff0844 0%, #ffb199 100%)', music: myMusicLibrary.romantic.tracks[0].url },
    { id: 'hb', name: 'С Днём Рождения 🎈', emoji: '🎈', bg: 'linear-gradient(120deg, #f6d365 0%, #fda085 100%)', music: myMusicLibrary.fun.tracks[0].url },
    { id: 'friend', name: 'Для Друга ✌️', emoji: '✌️', bg: 'linear-gradient(to right, #4facfe 0%, #00f2fe 100%)', music: myMusicLibrary.fun.tracks[0].url },
    { id: 'sad', name: 'Прости меня 🥺', emoji: '🥺', bg: 'linear-gradient(to top, #accbee 0%, #e7f0fd 100%)', music: myMusicLibrary.romantic.tracks[1].url },
    { id: 'neutral', name: 'Просто так ✨', emoji: '✨', bg: '#f0f2f5', music: "" }
];



// Гарантированный запуск при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    renderThemes();
    renderCategoryButtons();
});

// --- 1. АВТОРИЗАЦИЯ И ЭКРАНЫ ---
function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(screenId).classList.add('active');
    
    if(screenId === 'screen-dashboard') {
        document.body.style.background = '#f0f2f5';
        const pattern = document.getElementById('bg-pattern-layer');
        if (pattern) pattern.remove(); 
        renderSavedCards(); 
        
        // ДОБАВИТЬ ЭТУ СТРОЧКУ: Обновляем текст с бесплатными открытками
        updateFreeCardsDisplay(); 
    }
}

function checkAuth() {
    const savedUser = localStorage.getItem('otkritka_user');
    if (savedUser) {
        currentUser = savedUser;
        document.getElementById('userNameDisplay').innerText = currentUser;
        showScreen('screen-dashboard');
    } else {
        showScreen('screen-auth');
    }
}

function login() {
    const name = document.getElementById('usernameInput').value.trim();
    if (name.length < 2) { alert("Пожалуйста, введи свое имя!"); return; }
    localStorage.setItem('otkritka_user', name);
    checkAuth();
}

function logout() {
    localStorage.removeItem('otkritka_user');
    currentUser = null;
    document.getElementById('usernameInput').value = '';
    checkAuth();
}

// --- 2. ДАШБОРД (ТЕМЫ И БАЗА СОХРАНЕНИЙ) ---
function renderThemes() {
    const container = document.getElementById('themesContainer');
    container.innerHTML = '';
    
    cardThemes.forEach(theme => {
        const btn = document.createElement('button');
        btn.className = 'theme-tile';
        btn.innerText = theme.name;
        btn.style.background = theme.bg;
        // Передаем музыку третьим параметром
        btn.onclick = () => startBuilder(theme.bg, theme.emoji, theme.music);
        container.appendChild(btn);
    });

    const customBtn = document.createElement('button');
    customBtn.className = 'theme-tile';
    customBtn.innerHTML = '+ Свой дизайн 🎨';
    customBtn.style.background = 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)';
    customBtn.style.color = '#333';
    customBtn.onclick = () => openCustomThemeModal();
    container.appendChild(customBtn);
}

// --- УПРАВЛЕНИЕ КАСТОМНОЙ ТЕМОЙ ---
function openCustomThemeModal() {
    startBuilder('#f0f2f5', '', ''); 
    
    document.getElementById('customThemeModal').style.display = 'flex';
    document.getElementById('customThemeName').value = '';
    document.getElementById('customThemeEmoji').value = '';
    
    // Сбрасываем кнопку музыки к начальному виду
    customSelectedMusicUrl = ""; 
    const musicBtn = document.getElementById('customMusicBtn');
    musicBtn.innerText = '🎵 Выбрать музыку';
    musicBtn.style.background = '#3498db';
    
    document.getElementById('customThemeColor').oninput = function() {
        document.getElementById('customColorHex').innerText = this.value;
    };
}

function closeCustomThemeModal() {
    document.getElementById('customThemeModal').style.display = 'none';
    // Если передумал создавать свою тему — возвращаем обратно на главный экран
    showScreen('screen-dashboard'); 
}

function startCustomTheme() {
    const name = document.getElementById('customThemeName').value.trim();
    const emoji = document.getElementById('customThemeEmoji').value.trim();
    const color = document.getElementById('customThemeColor').value;
    
    if (!name) { alert("Пожалуйста, напиши, кому будет эта открытка!"); return; }
    
    document.getElementById('customThemeModal').style.display = 'none';
    
    // Перезапускаем с цветом, смайлом и ВЫБРАННОЙ музыкой
    startBuilder(color, emoji, customSelectedMusicUrl); 
    
    setTimeout(() => {
        const nameInput = document.getElementById('cardNameInput');
        nameInput.value = name;
        currentCardName = name; 
    }, 50);
}

// НАЧАЛО СОЗДАНИЯ (Запрос имени)
// НАЧАЛО СОЗДАНИЯ
function startBuilder(bgStyle, emoji, musicUrl = "") {
    currentCardName = ""; 
    currentThemeBg = bgStyle;
    currentThemeEmoji = emoji || ""; 
    currentMusicUrl = musicUrl; // Сохраняем музыку в память!
    
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
    document.getElementById('cardNameInput').value = '';
    
    const customModal = document.getElementById('customThemeModal');
    if (customModal) customModal.style.display = 'none';

    // ДОБАВЛЯЕМ ЭТО: Жесткий сброс финального окна при старте!
    const finishModal = document.getElementById('finishModal');
    if (finishModal) finishModal.style.display = 'none';

    updateUI();
    showScreen('screen-builder');
}

// ВЫВОД СОХРАНЕННЫХ ОТКРЫТОК
function renderSavedCards() {
    const container = document.getElementById('savedCardsContainer');
    container.innerHTML = '';
    let userCards = JSON.parse(localStorage.getItem('otkritka_cards_' + currentUser)) || [];

    if (userCards.length === 0) {
        container.innerHTML = '<p style="color:#888; font-size:14px;">У тебя пока нет сохраненных открыток.</p>';
        return;
    }

    userCards.reverse().forEach(card => {
        const div = document.createElement('div');
        div.className = 'saved-card-item';
        div.innerHTML = `
            <div class="saved-card-info">
                <h4>${card.name}</h4>
                <p>Экранов: ${card.slides.length}</p>
            </div>
            <div class="saved-card-actions">
                <button class="icon-btn" onclick="copySavedCardLink(${card.id})" title="Скопировать ссылку">🔗</button>
                <button class="icon-btn" onclick="downloadSavedCard(${card.id})" title="Скачать файл">⬇️</button>
                <button class="icon-btn delete-icon" onclick="deleteSavedCard(${card.id})" title="Удалить">🗑️</button>
            </div>
        `;
        container.appendChild(div);
    });
}

// НОВАЯ: Удаление сохраненной открытки (Исправленная версия)
function deleteSavedCard(cardId) {
    if(!confirm("Точно удалить эту открытку из истории?")) return;
    let userCards = JSON.parse(localStorage.getItem('otkritka_cards_' + currentUser)) || [];
    
    // Используем != вместо !==, чтобы не было конфликтов типов данных
    userCards = userCards.filter(c => c.id != cardId);
    
    localStorage.setItem('otkritka_cards_' + currentUser, JSON.stringify(userCards));
    renderSavedCards(); // Перерисовываем список
}

// НОВАЯ: Копирование ссылки из сохраненных
function copySavedCardLink(cardId) {
    let userCards = JSON.parse(localStorage.getItem('otkritka_cards_' + currentUser)) || [];
    const card = userCards.find(c => c.id === cardId);
    if(!card) return;
    
    const shortData = { b: card.bg, e: card.emoji || "", s: card.slides.map(slide => ({ h: slide.header, i: slide.img, m: slide.message })) };
    const compressedData = LZString.compressToEncodedURIComponent(JSON.stringify(shortData));
    const baseUrl = window.location.origin + window.location.pathname.replace(/[^\/]+$/, '');
    const shareUrl = `${baseUrl}view.html?c=${compressedData}`;
    
    navigator.clipboard.writeText(shareUrl);
    alert("Ссылка скопирована! Можно отправлять.");
}


// --- 3. БИЛДЕР (ОТКРЫТКА) ---
function updateUI() {
    document.getElementById('slideCounter').innerText = `Карточка ${currentIndex + 1} / ${slides.length}`;
    document.getElementById('prevBtn').disabled = currentIndex === 0;
    document.getElementById('nextBtn').disabled = currentIndex === slides.length - 1;

    // НОВОЕ: Показываем поле названия только на 1-м слайде
    const nameInput = document.getElementById('cardNameInput');
    if (currentIndex === 0) {
        nameInput.style.display = 'block';
        nameInput.value = currentCardName; // Подтягиваем имя, если оно уже введено
    } else {
        nameInput.style.display = 'none';
    }

    // НОВОЕ: Отключаем кнопку удаления, если остался всего 1 слайд
    document.getElementById('deleteSlideBtn').disabled = slides.length === 1;

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

// НОВОЕ: Сохранение названия открытки
function saveCardName() {
    currentCardName = document.getElementById('cardNameInput').value;
}

// НОВОЕ: Удаление текущего слайда
function deleteSlide() {
    if (slides.length <= 1) return; // Защита: нельзя удалить последнюю карточку
    
    if(confirm("Точно удалить эту карточку?")) {
        slides.splice(currentIndex, 1); // Удаляем из массива
        
        // Если удалили последнюю в списке, сдвигаемся на шаг назад
        if (currentIndex >= slides.length) {
            currentIndex = slides.length - 1;
        }
        updateUI();
    }
}

function openGifModal() { document.getElementById('gifModal').style.display = 'flex'; }
function closeGifModal() { document.getElementById('gifModal').style.display = 'none'; }

function renderCategoryButtons() {
    const tagsContainer = document.getElementById('categoryTags');
    tagsContainer.innerHTML = '';
    for (const key in myGifLibrary) {
        const btn = document.createElement('button');
        btn.innerText = myGifLibrary[key].name;
        btn.style.cssText = "padding: 8px 12px; border-radius: 15px; border: 1px solid #ff69b4; background: white; color: #ff69b4; cursor: pointer; transition: 0.2s;";
        btn.onclick = () => showGifsFromCategory(key);
        tagsContainer.appendChild(btn);
    }
}

function showGifsFromCategory(categoryKey) {
    const resultsContainer = document.getElementById('gifResults');
    resultsContainer.innerHTML = ''; 
    myGifLibrary[categoryKey].urls.forEach(imgUrl => {
        const img = document.createElement('img');
        img.src = imgUrl;
        img.onclick = () => { slides[currentIndex].img = imgUrl; closeGifModal(); updateUI(); };
        resultsContainer.appendChild(img);
    });
}
function useCustomUrl() {
    const url = document.getElementById('customUrlInput').value.trim();
    if (url) { slides[currentIndex].img = url; closeGifModal(); updateUI(); }
}


// --- 4. ФИНАЛ, ОПЛАТА И ОТПРАВКА ---
// НОВОЕ: Отображение счетчика бесплатных открыток
function updateFreeCardsDisplay() {
    let count = parseInt(localStorage.getItem('otkritka_free_cards_' + currentUser)) || 0;
    const displayEl = document.getElementById('freeCardsDisplay');
    if (displayEl) {
        if (count > 0) {
            displayEl.innerHTML = `🎁 У тебя есть <b>${count}</b> бесплатные открытки!`;
            displayEl.style.display = 'block';
        } else {
            displayEl.style.display = 'none';
        }
    }
}

// НОВОЕ: Вспомогательная функция для сохранения в базу (чтобы не дублировать код)
function saveCardToDatabase() {
    let userCards = JSON.parse(localStorage.getItem('otkritka_cards_' + currentUser)) || [];
    const isAlreadySaved = userCards.some(c => c.name === currentCardName && c.slides.length === slides.length);
    
    if (!isAlreadySaved) {
        userCards.push({
            id: Date.now(),
            name: currentCardName,
            bg: currentThemeBg,
            emoji: currentThemeEmoji,
            musicUrl: currentMusicUrl, // Обязательно сохраняем и музыку!
            slides: JSON.parse(JSON.stringify(slides))
        });
        localStorage.setItem('otkritka_cards_' + currentUser, JSON.stringify(userCards));
    }
}

// ОБНОВЛЕНО: Логика кнопки "Готово"
// ОБНОВЛЕНО: Логика кнопки "Готово" со строгим списанием
function finishCard() {
    if (!currentCardName || currentCardName.trim() === "") {
        alert("Пожалуйста, придумай название для открытки (на первой карточке)!");
        currentIndex = 0; updateUI(); return;
    }
    if (slides.some(slide => !slide.img)) { 
        alert("Пожалуйста, выбери картинки для всех карточек!"); return; 
    }
    
    // Показываем модалку
    document.getElementById('finishModal').style.display = 'flex';

    // Читаем количество бесплатных попыток
    let freeCards = parseInt(localStorage.getItem('otkritka_free_cards_' + currentUser)) || 0;

    if (freeCards > 0) {
        // ЕСЛИ ЕСТЬ БЕСПЛАТНЫЕ ПОПЫТКИ:
        document.getElementById('paywallStep').style.display = 'none';
        document.getElementById('actionStep').style.display = 'block';
        
        // Проверяем, не сохраняли ли мы ее уже (защита от двойного списания)
        let userCards = JSON.parse(localStorage.getItem('otkritka_cards_' + currentUser)) || [];
        const isAlreadySaved = userCards.some(c => c.name === currentCardName && c.slides.length === slides.length);
        
        if (!isAlreadySaved) {
            saveCardToDatabase(); // Сохраняем в историю
            freeCards--; // Списываем 1 попытку
            localStorage.setItem('otkritka_free_cards_' + currentUser, freeCards); // Записываем остаток
        }
    } else {
        // ЕСЛИ БЕСПЛАТНЫХ ПОПЫТОК НЕТ:
        document.getElementById('paywallStep').style.display = 'block';
        document.getElementById('actionStep').style.display = 'none';
    }
}

function closeFinishModal() { 
    document.getElementById('finishModal').style.display = 'none'; 
}

// ОБНОВЛЕНО: Симуляция оплаты с начислением бонуса
function simulatePayment() {
    document.getElementById('paywallStep').style.display = 'none';
    document.getElementById('actionStep').style.display = 'block';
    
    // Сохраняем оплаченную открытку
    saveCardToDatabase();
    
    // Начисляем 3 подарочные открытки на будущее
    let freeCards = parseInt(localStorage.getItem('otkritka_free_cards_' + currentUser)) || 0;
    freeCards += 3;
    localStorage.setItem('otkritka_free_cards_' + currentUser, freeCards);
    
    alert("🎉 Оплата прошла успешно! В подарок вы получаете 3 бесплатные открытки!");
}

function goToDashboard() {
    closeFinishModal();
    showScreen('screen-dashboard');
}


// Кнопка скачивания из текущего билдера
function downloadCard() {
    const blob = new Blob([generateHtmlString(currentThemeBg, slides, currentThemeEmoji, currentMusicUrl)], { type: 'text/html' }); // Добавили эмодзи
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = `${currentCardName}.html`;
    document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url);
}

function downloadSavedCard(cardId) {
    let userCards = JSON.parse(localStorage.getItem('otkritka_cards_' + currentUser)) || [];
    const card = userCards.find(c => c.id === cardId);
    
    if(card) {
        // Достаем музыку из сохраненной карточки (если ее нет, передаем пустую строку)
        const music = card.musicUrl || ""; 
        
        // Передаем музыку 4-м параметром
        const blob = new Blob([generateHtmlString(card.bg, card.slides, card.emoji, music)], { type: 'text/html' }); 
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a'); 
        a.href = url; 
        a.download = `${card.name}.html`;
        
        document.body.appendChild(a); 
        a.click(); 
        document.body.removeChild(a); 
        URL.revokeObjectURL(url);
    }
}

// Кнопка отправки напрямую
async function shareCard() {
    // 1. Укорачиваем названия ключей для экономии места
    const shortData = {
        b: currentThemeBg,
        e: currentThemeEmoji, // Эмодзи
        mu: currentMusicUrl,  // НОВОЕ: Упаковываем музыку в ссылку под ключом 'mu'
        s: slides.map(slide => ({ h: slide.header, i: slide.img, m: slide.message }))
    };

    // 2. Сжимаем в строку
    const compressedData = LZString.compressToEncodedURIComponent(JSON.stringify(shortData));
    
    // 3. Формируем короткую ссылку
    const baseUrl = window.location.origin + window.location.pathname.replace(/[^\/]+$/, '');
    const shareUrl = `${baseUrl}view.html?c=${compressedData}`;

    // 4. Отправляем
    if (navigator.share) {
        try { 
            await navigator.share({ title: currentCardName, text: 'Смотри, какую открытку я сделал! 💖', url: shareUrl }); 
        } catch (err) { 
            console.log('Отмена отправки', err); 
        }
    } else {
        navigator.clipboard.writeText(shareUrl);
        alert("Ссылка скопирована! Отправь её другу: \n\n" + shareUrl);
    }
}



// --- ОКНО ВЫБОРА МУЗЫКИ ---
// --- ОКНО ВЫБОРА МУЗЫКИ (С ПРОСЛУШИВАНИЕМ И ТЕГАМИ) ---

function openMusicModal() {
    document.getElementById('musicModal').style.display = 'flex';
    renderMusicTags();
    showTracksFromCategory('romantic'); // По умолчанию открываем романтику
}

function closeMusicModal() {
    document.getElementById('musicModal').style.display = 'none';
    // Обязательно выключаем музыку при закрытии окна!
    const player = document.getElementById('previewPlayer');
    player.pause();
    currentPlayingUrl = "";
}

function renderMusicTags() {
    const tagsContainer = document.getElementById('musicTags');
    tagsContainer.innerHTML = '';
    
    for (const key in myMusicLibrary) {
        const btn = document.createElement('button');
        btn.innerText = myMusicLibrary[key].name;
        btn.style.cssText = "padding: 8px 12px; border-radius: 15px; border: 1px solid #3498db; background: white; color: #3498db; cursor: pointer; transition: 0.2s;";
        btn.onclick = () => {
            // Подсвечиваем активный тег
            Array.from(tagsContainer.children).forEach(b => b.style.background = 'white');
            Array.from(tagsContainer.children).forEach(b => b.style.color = '#3498db');
            btn.style.background = '#3498db';
            btn.style.color = 'white';
            
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
        // Красивый стиль карточки трека
        card.style.cssText = "display: flex; align-items: center; gap: 10px; background: #f8f9fa; padding: 10px; border-radius: 15px; box-shadow: 0 2px 5px rgba(0,0,0,0.05);";
        
        // Кнопка Play/Pause и картинка
        const playIcon = currentPlayingUrl === track.url && track.url !== "" ? '⏸️' : '▶️';
        
        card.innerHTML = `
            <img src="${track.cover}" style="width: 50px; height: 50px; border-radius: 10px; object-fit: cover;">
            <div style="flex-grow: 1;">
                <div style="font-weight: bold; color: #333; font-size: 14px;">${track.name}</div>
            </div>
            ${track.url ? `<button onclick="togglePreview('${track.url}')" style="background:none; border:none; font-size:24px; cursor:pointer;" id="playBtn-${track.url.replace(/[^a-zA-Z0-9]/g, '')}">${playIcon}</button>` : ''}
            <button onclick="confirmMusicSelection('${track.url}', '${track.name}')" style="background: #2ecc71; color: white; border: none; padding: 8px 15px; border-radius: 10px; font-weight: bold; cursor: pointer;">Выбрать</button>
        `;
        container.appendChild(card);
    });
}

// Предпрослушивание трека
function togglePreview(url) {
    const player = document.getElementById('previewPlayer');
    const safeId = url.replace(/[^a-zA-Z0-9]/g, ''); // Делаем ID безопасным

    // 1. Сбрасываем все кнопки Play обратно на ▶️
    document.querySelectorAll('[id^="playBtn-"]').forEach(btn => {
        btn.innerText = '▶️';
    });

    if (currentPlayingUrl === url) {
        // Если нажали на то, что уже играет - ставим на паузу
        player.pause();
        currentPlayingUrl = "";
    } else {
        // Если включили новый трек
        player.src = url;
        player.play();
        currentPlayingUrl = url;
        
        // Меняем иконку именно у нажатой кнопки на ⏸️
        const currentBtn = document.getElementById(`playBtn-${safeId}`);
        if (currentBtn) currentBtn.innerText = '⏸️';
    }
}

// Подтверждение выбора музыки
function confirmMusicSelection(url, name) {
    customSelectedMusicUrl = url;
    
    // Обновляем главную кнопку в меню "Свой дизайн"
    const customBtn = document.getElementById('customMusicBtn');
    customBtn.innerText = url ? name : 'Без музыки 🔇';
    customBtn.style.background = url ? '#2ecc71' : '#95a5a6'; 
    
    closeMusicModal();
}

// --- ДОБАВИТЬ ВНИЗ ФАЙЛА builder.js ---

// Проверка и добавление пользовательской ссылки на музыку
function useMusicCustomUrl() {
    const urlInput = document.getElementById('customMusicUrlInput');
    const url = urlInput.value.trim();
    const btn = document.getElementById('testMusicBtn');

    if (!url) return;

    // Включаем режим загрузки
    btn.innerText = "⏳...";
    btn.disabled = true;
    urlInput.disabled = true;

    // Создаем тестовый аудиоплеер для проверки ссылки
    const testAudio = new Audio();
    
    // Если музыка загрузилась и готова играть:
    testAudio.oncanplay = () => {
        btn.innerText = "Ок";
        btn.disabled = false;
        urlInput.disabled = false;
        
        // Останавливаем предпрослушку из базы, если она играла
        document.getElementById('previewPlayer').pause();
        currentPlayingUrl = "";
        
        // Подтверждаем выбор!
        confirmMusicSelection(url, "Своя музыка 🎵");
        urlInput.value = '';
    };

    // Если сервер сбросил соединение, файл не найден или это не прямая ссылка:
    testAudio.onerror = () => {
        alert("❌ Ошибка: Не удалось загрузить музыку.\n\nУбедись, что ссылка ведет напрямую на файл .mp3, а не на страницу с плеером (как YouTube или Яндекс.Музыка), и сервер разрешает скачивание.");
        btn.innerText = "Ок";
        btn.disabled = false;
        urlInput.disabled = false;
    };

    // Пытаемся загрузить (именно эта строчка запускает проверку)
    testAudio.src = url;
}