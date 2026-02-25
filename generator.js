// Файл: generator.js
// Отвечает только за сборку финального HTML-кода открытки
// ГЕНЕРАТОР HTML (Формат Stories - работает везде, без JS, со свайпами)
// В функции generateHtmlString добавляем параметр emoji и CSS для паттерна
// ГЕНЕРАТОР HTML (С добавленным дождем из эмодзи)
function generateHtmlString(bgStyle, slidesArray, emoji = "", musicUrl = "") {
    let allSlidesHtml = '';
    
    // 1. Генерируем карточки
    slidesArray.forEach((slide, index) => {
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

    // 2. Генерируем дождь из эмодзи
    let rainHtml = '';
    if (emoji) {
        for (let i = 0; i < 30; i++) {
            const left = Math.floor(Math.random() * 100);
            const delay = (Math.random() * 2).toFixed(2);
            const duration = (2 + Math.random() * 3).toFixed(2);
            const size = (1.5 + Math.random() * 1.5).toFixed(1);
            rainHtml += `<div class="emoji-drop" style="left: ${left}%; animation-duration: ${duration}s; animation-delay: ${delay}s; font-size: ${size}rem;">${emoji}</div>`;
        }
    }

    // 3. Финальный слайд
    allSlidesHtml += `
        <div class="slide" id="slide-end" style="position: relative; overflow: hidden;">
            ${rainHtml}
            <div class="card" style="z-index: 10;">
                <h2>Конец! 🎉</h2>
                <div class="img-wrapper"><img src="https://media.tenor.com/e2ZILKKbZIkAAAAj/peach-goma.gif"></div>
                <div class="text-wrapper"><p>Надеюсь, тебе понравилось!</p></div>
            </div>
        </div>`;

    // 4. Паттерн фона
    let patternCss = "";
    if (emoji) {
        const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80"><text x="40" y="40" font-size="30" text-anchor="middle" dominant-baseline="middle" opacity="0.15">${emoji}</text></svg>`;
        patternCss = `body::before { content: ''; position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: -1; pointer-events: none; background-image: url('data:image/svg+xml;utf8,${encodeURIComponent(svg)}'); }`;
    }

    // 5. Блок музыки (HTML + Скрипт + Кнопка)
    let musicHtml = "";
    let musicScript = "";
    if (musicUrl) {
        // Добавляем тег аудио и плавающую кнопку
        musicHtml = `
            <audio id="bgMusic" loop src="${musicUrl}"></audio>
            <button id="musicBtn" class="music-btn">🔊</button>
        `;
        // Скрипт, который включит музыку при первом касании экрана
        musicScript = `
            <script>
                const music = document.getElementById('bgMusic');
                const musicBtn = document.getElementById('musicBtn');
                let musicStarted = false;

                // Запуск при свайпе или клике
                const startMusic = () => {
                    if (!musicStarted) {
                        music.play().catch(() => console.log('Автовоспроизведение заблокировано браузером'));
                        musicStarted = true;
                    }
                };
                document.body.addEventListener('click', startMusic, {once: true});
                document.body.addEventListener('touchstart', startMusic, {once: true});

                // Логика кнопки Вкл/Выкл
                musicBtn.addEventListener('click', (e) => {
                    e.stopPropagation(); // Чтобы клик по кнопке не проваливался ниже
                    if (music.muted) {
                        music.muted = false;
                        musicBtn.innerText = '🔊';
                    } else {
                        music.muted = true;
                        musicBtn.innerText = '🔇';
                    }
                });
            </script>
        `;
    }

    return `<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>Для тебя! ❤️</title>
    <style>
        html, body { margin: 0; padding: 0; width: 100%; height: 100%; background: ${bgStyle}; font-family: 'Segoe UI', sans-serif; overflow: hidden; }
        ${patternCss} 
        #app { width: 100%; height: 100%; display: flex; overflow-x: auto; overflow-y: hidden; scroll-snap-type: x mandatory; scroll-behavior: smooth; -webkit-overflow-scrolling: touch; }
        #app::-webkit-scrollbar { display: none; }
        .slide { min-width: 100vw; height: 100%; display: flex; justify-content: center; align-items: center; scroll-snap-align: center; padding: 20px; box-sizing: border-box; }
        .card { background: white; border-radius: 20px; padding: 25px; box-shadow: 0 10px 30px rgba(0,0,0,0.2); width: 100%; max-width: 380px; height: 100%; max-height: 600px; display: flex; flex-direction: column; box-sizing: border-box; }
        h2 { color: #333; margin: 0 0 15px 0; text-align: center; flex-shrink: 0; }
        .img-wrapper { flex-grow: 1; display: flex; justify-content: center; align-items: center; min-height: 120px; overflow: hidden; margin-bottom: 15px; }
        img { max-width: 100%; max-height: 100%; object-fit: contain; border-radius: 15px; }
        .text-wrapper { flex-shrink: 0; max-height: 35%; overflow-y: auto; margin-bottom: 15px; text-align: center; }
        .text-wrapper::-webkit-scrollbar { display: none; }
        p { color: #555; font-size: 18px; line-height: 1.4; white-space: pre-wrap; margin: 0; }
        .next-btn { display: block; background: #ff69b4; color: white; text-decoration: none; padding: 15px 25px; text-align: center; border-radius: 25px; font-size: 16px; font-weight: bold; flex-shrink: 0; transition: 0.2s; box-shadow: 0 4px 15px rgba(255, 105, 180, 0.4); }
        .next-btn:active { transform: scale(0.95); }
        .swipe-hint { position: absolute; bottom: 10px; left: 0; width: 100%; text-align: center; color: rgba(255,255,255,0.7); font-size: 12px; pointer-events: none; }
        
        /* Стили кнопки музыки */
        .music-btn {
            position: fixed; top: 20px; right: 20px; z-index: 1000;
            background: rgba(255,255,255,0.9); border: none; border-radius: 50%;
            width: 45px; height: 45px; font-size: 20px; cursor: pointer;
            box-shadow: 0 4px 10px rgba(0,0,0,0.15); display: flex;
            justify-content: center; align-items: center; transition: 0.2s;
        }
        .music-btn:active { transform: scale(0.9); }

        .emoji-drop { position: absolute; top: -10%; opacity: 0; pointer-events: none; animation: fallAndSpin linear infinite; }
        @keyframes fallAndSpin { 0% { transform: translateY(0) rotate(0deg); opacity: 1; } 80% { opacity: 1; } 100% { transform: translateY(110vh) rotate(360deg); opacity: 0; } }
    </style>
</head>
<body>
    ${musicHtml}
    <div id="app">${allSlidesHtml}</div>
    <div class="swipe-hint">Можно листать пальцем ↔</div>
    ${musicScript}
</body>
</html>`;
}