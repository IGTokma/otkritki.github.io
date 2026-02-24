// --- СОСТОЯНИЕ ПРИЛОЖЕНИЯ ---
let currentUser = null;
let currentThemeBg = "#f0f2f5";
let currentCardName = ""; // Название текущей открытки
let slides = [{ header: "", img: "", message: "" }];
let currentIndex = 0;

const cardThemes = [
    { id: 'mom', name: 'Любимой Маме 🌸', bg: 'linear-gradient(135deg, #fbc2eb 0%, #a6c1ee 100%)' },
    { id: 'love', name: 'Любимому / Любимой ❤️', bg: 'linear-gradient(to top, #ff0844 0%, #ffb199 100%)' },
    { id: 'hb', name: 'С Днём Рождения 🎈', bg: 'linear-gradient(120deg, #f6d365 0%, #fda085 100%)' },
    { id: 'friend', name: 'Для Друга ✌️', bg: 'linear-gradient(to right, #4facfe 0%, #00f2fe 100%)' },
    { id: 'sad', name: 'Прости меня 🥺', bg: 'linear-gradient(to top, #accbee 0%, #e7f0fd 100%)' },
    { id: 'neutral', name: 'Просто так ✨', bg: '#f0f2f5' }
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
    
    // Если вернулись в дашборд, возвращаем стандартный фон
    if(screenId === 'screen-dashboard') {
        document.body.style.background = '#f0f2f5';
        renderSavedCards(); // Обновляем базу при входе в профиль
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
        btn.onclick = () => startBuilder(theme.bg);
        container.appendChild(btn);
    });
}

// НАЧАЛО СОЗДАНИЯ (Запрос имени)
// НАЧАЛО СОЗДАНИЯ
function startBuilder(bgStyle) {
    currentCardName = ""; // Сбрасываем старое имя
    currentThemeBg = bgStyle;
    document.body.style.background = bgStyle;
    
    slides = [{ header: "", img: "", message: "" }];
    currentIndex = 0;
    
    // Очищаем инпут названия
    document.getElementById('cardNameInput').value = '';
    
    updateUI();
    showScreen('screen-builder');
}

// ВЫВОД СОХРАНЕННЫХ ОТКРЫТОК
function renderSavedCards() {
    const container = document.getElementById('savedCardsContainer');
    container.innerHTML = '';
    
    // Достаем карточки конкретного пользователя
    let userCards = JSON.parse(localStorage.getItem('otkritka_cards_' + currentUser)) || [];

    if (userCards.length === 0) {
        container.innerHTML = '<p style="color:#888; font-size:14px;">У тебя пока нет сохраненных открыток.</p>';
        return;
    }

    // Рисуем карточки (от новых к старым)
    userCards.reverse().forEach(card => {
        const div = document.createElement('div');
        div.className = 'saved-card-item';
        div.innerHTML = `
            <div class="saved-card-info">
                <h4>${card.name}</h4>
                <p>Экранов: ${card.slides.length}</p>
            </div>
            <button class="download-mini-btn" onclick="downloadSavedCard(${card.id})">Скачать</button>
        `;
        container.appendChild(div);
    });
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
function finishCard() {
    // Проверка названия открытки
    if (!currentCardName || currentCardName.trim() === "") {
        alert("Пожалуйста, придумай название для открытки (на первой карточке)!");
        currentIndex = 0; // Возвращаем пользователя на 1-й слайд
        updateUI();
        return;
    }

    if (slides.some(slide => !slide.img)) { 
        alert("Пожалуйста, выбери картинки для всех карточек!"); 
        return; 
    }
    
    document.getElementById('paywallStep').style.display = 'block';
    document.getElementById('actionStep').style.display = 'none';
    document.getElementById('finishModal').style.display = 'flex';
}

function closeFinishModal() { document.getElementById('finishModal').style.display = 'none'; }

// ПОКУПКА И СОХРАНЕНИЕ В БАЗУ
function simulatePayment() {
    document.getElementById('paywallStep').style.display = 'none';
    document.getElementById('actionStep').style.display = 'block';
    
    // Сохраняем открытку в локальную базу данных
    let userCards = JSON.parse(localStorage.getItem('otkritka_cards_' + currentUser)) || [];
    
    // Проверка: чтобы не сохранять одну и ту же открытку дважды, если юзер нажал "Готово" еще раз
    const isAlreadySaved = userCards.some(c => c.name === currentCardName && c.slides.length === slides.length);
    
    if (!isAlreadySaved) {
        userCards.push({
            id: Date.now(), // Уникальный ID
            name: currentCardName,
            bg: currentThemeBg,
            slides: JSON.parse(JSON.stringify(slides)) // Копируем массив слайдов
        });
        localStorage.setItem('otkritka_cards_' + currentUser, JSON.stringify(userCards));
    }
}

// ГЕНЕРАТОР HTML (Формат Stories - работает везде, без JS, со свайпами)
function generateHtmlString(bgStyle, slidesArray) {
    let allSlidesHtml = '';
    
    slidesArray.forEach((slide, index) => {
        // Указываем ссылку на следующую карточку (или никуда, если это последняя)
        const nextSlideId = index < slidesArray.length - 1 ? `#slide-${index + 1}` : `#slide-end`;
        const btnText = index === slidesArray.length - 1 ? "Завершить 💖" : "Далее ➔";
        
        allSlidesHtml += `
        <div class="slide" id="slide-${index}">
            <div class="card">
                <h2>${slide.header}</h2>
                <div class="img-wrapper"><img src="${slide.img}" alt="gif"></div>
                <div class="text-wrapper"><p>${slide.message}</p></div>
                <a href="${nextSlideId}" class="next-btn">${btnText}</a>
            </div>
        </div>`;
    });

    // Финальный слайд (Конец)
    allSlidesHtml += `
        <div class="slide" id="slide-end">
            <div class="card">
                <h2>Конец! 🎉</h2>
                <div class="img-wrapper"><img src="https://media.tenor.com/e2ZILKKbZIkAAAAj/peach-goma.gif"></div>
                <div class="text-wrapper"><p>Надеюсь, тебе понравилось!</p></div>
            </div>
        </div>`;

    return `<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>Для тебя! ❤️</title>
    <style>
        /* СБРОС И ФОН */
        html, body {
            margin: 0; padding: 0; width: 100%; height: 100%;
            background: ${bgStyle}; font-family: 'Segoe UI', sans-serif;
            overflow: hidden; /* Запрещаем скролл всей страницы */
        }

        /* КОНТЕЙНЕР-КАРУСЕЛЬ (Свайпы) */
        #app {
            width: 100%; height: 100%;
            display: flex;
            overflow-x: auto; /* Горизонтальная прокрутка */
            overflow-y: hidden;
            scroll-snap-type: x mandatory; /* Магнитятся к центру */
            scroll-behavior: smooth; /* Плавный переход по клику на кнопку */
            -webkit-overflow-scrolling: touch;
        }
        
        /* Прячем уродливую полосу прокрутки внизу */
        #app::-webkit-scrollbar { display: none; }
        #app { -ms-overflow-style: none; scrollbar-width: none; }

        /* ОДИН ЭКРАН (100% ширины и высоты) */
        .slide {
            min-width: 100vw; height: 100%;
            display: flex; justify-content: center; align-items: center;
            scroll-snap-align: center; /* Центрируем при свайпе */
            padding: 20px; box-sizing: border-box; /* Отступы от краев телефона */
        }

        /* САМА БЕЛАЯ КАРТОЧКА */
        .card {
            background: white; border-radius: 20px; padding: 25px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
            width: 100%; max-width: 380px; 
            height: 100%; max-height: 600px; /* Жестко ограничиваем высоту для Android */
            display: flex; flex-direction: column; box-sizing: border-box;
        }

        /* ЗАГОЛОВОК */
        h2 { color: #333; margin: 0 0 15px 0; text-align: center; flex-shrink: 0; }

        /* БЛОК КАРТИНКИ (сжимается сам, если надо) */
        .img-wrapper {
            flex-grow: 1; /* Занимает всё свободное место */
            display: flex; justify-content: center; align-items: center;
            min-height: 120px; overflow: hidden; margin-bottom: 15px;
        }
        img { max-width: 100%; max-height: 100%; object-fit: contain; border-radius: 15px; }

        /* БЛОК ТЕКСТА (свой внутренний скролл, если текста много) */
        .text-wrapper {
            flex-shrink: 0; max-height: 35%; overflow-y: auto; 
            margin-bottom: 15px; text-align: center;
        }
        .text-wrapper::-webkit-scrollbar { display: none; }
        p { color: #555; font-size: 18px; line-height: 1.4; white-space: pre-wrap; margin: 0; }

        /* КНОПКА (Сделана через ссылку <a>) */
        .next-btn {
            display: block; background: #ff69b4; color: white; text-decoration: none;
            padding: 15px 25px; text-align: center; border-radius: 25px;
            font-size: 16px; font-weight: bold; flex-shrink: 0; transition: 0.2s;
            box-shadow: 0 4px 15px rgba(255, 105, 180, 0.4);
        }
        .next-btn:active { transform: scale(0.95); }

        /* Подсказка внизу для тех, кто не понял про свайп */
        .swipe-hint {
            position: absolute; bottom: 10px; left: 0; width: 100%;
            text-align: center; color: rgba(255,255,255,0.7); font-size: 12px; pointer-events: none;
        }
    </style>
</head>
<body>
    <!-- ВЕСЬ КОНТЕНТ УЖЕ В HTML, JS НЕ НУЖЕН -->
    <div id="app">
        ${allSlidesHtml}
    </div>
    <div class="swipe-hint">Можно листать пальцем ↔</div>
</body>
</html>`;
}

// Кнопка скачивания из текущего билдера
function downloadCard() {
    const blob = new Blob([generateHtmlString(currentThemeBg, slides)], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = `${currentCardName}.html`;
    document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url);
}

// Кнопка скачивания старой открытки из профиля
function downloadSavedCard(cardId) {
    let userCards = JSON.parse(localStorage.getItem('otkritka_cards_' + currentUser)) || [];
    const card = userCards.find(c => c.id === cardId);
    if(card) {
        const blob = new Blob([generateHtmlString(card.bg, card.slides)], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a'); a.href = url; a.download = `${card.name}.html`;
        document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url);
    }
}

// Кнопка отправки напрямую
async function shareCard() {
    // 1. Укорачиваем названия ключей для экономии места
    const shortData = {
        b: currentThemeBg,
        s: slides.map(slide => ({
            h: slide.header,
            i: slide.img,
            m: slide.message
        }))
    };

    // 2. Сжимаем в очень плотную строку (магия LZ-String)
    const compressedData = LZString.compressToEncodedURIComponent(JSON.stringify(shortData));
    
    // 3. Формируем короткую ссылку (параметр теперь называется 'c')
    const baseUrl = window.location.origin + window.location.pathname.replace(/[^\/]+$/, '');
    const shareUrl = `${baseUrl}view.html?c=${compressedData}`;

    // 4. Отправляем
    if (navigator.share) {
        try { 
            await navigator.share({ 
                title: currentCardName, 
                text: 'Смотри, какую открытку я сделал! 💖', 
                url: shareUrl 
            }); 
        } 
        catch (err) { console.log('Отмена отправки', err); }
    } else {
        navigator.clipboard.writeText(shareUrl);
        alert("Ссылка скопирована! Отправь её другу: \n\n" + shareUrl);
    }
}

// НОВОЕ: Переход домой после успешной покупки и скачивания
function goToDashboard() {
    closeFinishModal();
    showScreen('screen-dashboard');
}