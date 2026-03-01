function generateHtmlString(bgStyle, slidesArray, backgroundEmoji = "", musicUrl = "", hiddenMessage = "", hasRunawayBtn = false) {
    let slidesHtml = '';
    slidesArray.forEach((slide, index) => {
        slidesHtml += `
        <div class="slide ${index === 0 ? 'active' : ''}">
            ${slide.header ? `<h2>${slide.header}</h2>` : ''}
            ${slide.img ? `<img src="${slide.img}" alt="Открытка">` : ''}
            ${slide.message ? `<p>${slide.message}</p>` : ''}
        </div>
        `;
    });

    return `
    <!DOCTYPE html>
    <html lang="ru">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Для тебя! ❤️</title>
        <style>
            body { margin: 0; padding: 0; background: ${bgStyle}; font-family: 'Segoe UI', sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh; overflow: hidden; }
            .card-container { background: white; border-radius: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.2); width: 90%; max-width: 400px; padding: 20px; text-align: center; position: relative; z-index: 10; }
            .slide { display: none; animation: fadeIn 0.5s ease; }
            .slide.active { display: block; }
            .slide img { max-width: 100%; border-radius: 10px; margin-bottom: 15px; }
            .slide h2 { color: #ff4757; margin-top: 0; }
            .slide p { color: #555; font-size: 16px; line-height: 1.5; }
            .nav-btn { background: #ff4757; color: white; border: none; padding: 10px 20px; border-radius: 20px; font-size: 16px; cursor: pointer; margin-top: 20px; font-weight: bold; width: 100%; transition: 0.2s; }
            .nav-btn:hover { transform: scale(1.05); }
            @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
            
            /* Плеер */
            .music-player { position: fixed; top: 20px; left: 20px; background: white; border-radius: 50%; width: 50px; height: 50px; display: flex; justify-content: center; align-items: center; box-shadow: 0 4px 10px rgba(0,0,0,0.2); cursor: pointer; z-index: 100; font-size: 24px; }
            .music-player.playing { animation: spin 3s linear infinite; }
            @keyframes spin { 100% { transform: rotate(360deg); } }
            
            /* Переключатель языков внутри открытки */
            .lang-switcher { position: fixed; bottom: 20px; left: 20px; display: flex; gap: 8px; background: rgba(255,255,255,0.7); padding: 8px 12px; border-radius: 15px; backdrop-filter: blur(5px); z-index: 1000; box-shadow: 0 4px 10px rgba(0,0,0,0.1); }
            .lang-switcher button { background: none; border: none; font-size: 20px; cursor: pointer; transition: 0.2s; opacity: 0.5; }
            .lang-switcher button.active { opacity: 1; transform: scale(1.2); }
        </style>
    </head>
    <body>
        <div class="lang-switcher">
            <button id="lang-ru" class="active" onclick="changeCardLang('ru')">🇷🇺</button>
            <button id="lang-en" onclick="changeCardLang('en')">🇬🇧</button>
            <button id="lang-kz" onclick="changeCardLang('kz')">🇰🇿</button>
        </div>

        ${backgroundEmoji ? `<div style="position:fixed; top:0; left:0; width:100%; height:100%; pointer-events:none; z-index:0; opacity:0.15; background-image:url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2280%22 height=%2280%22><text x=%2240%22 y=%2240%22 font-size=%2230%22 text-anchor=%22middle%22 dominant-baseline=%22middle%22>${encodeURIComponent(backgroundEmoji)}</text></svg>');"></div>` : ''}
        ${musicUrl ? `<div class="music-player" id="musicBtn" onclick="toggleMusic()">🎵</div><audio id="bgMusic" src="${musicUrl}" loop></audio>` : ''}

        <div class="card-container">
            ${slidesHtml}
            <button class="nav-btn" id="nextSlideBtn" onclick="nextSlide()">Далее ➔</button>
        </div>

        <script>
            // --- ВСТРОЕННЫЙ СЛОВАРЬ ОТКРЫТКИ ---
            const dict = {
                ru: { next: "Далее ➔", done: "Завершить ❤️", end_msg: "Это всё! Спасибо за просмотр ❤️", close: "✖ Закрыть", sec_title: "Секретное послание 💌", sec_btn: "Ух ты!" },
                en: { next: "Next ➔", done: "Done ❤️", end_msg: "That's all! Thanks for watching ❤️", close: "✖ Close", sec_title: "Secret Message 💌", sec_btn: "Wow!" },
                kz: { next: "Келесі ➔", done: "Аяқтау ❤️", end_msg: "Осымен бітті! Көргеніңізге рақмет ❤️", close: "✖ Жабу", sec_title: "Жасырын хат 💌", sec_btn: "Керемет!" }
            };

            // Берем язык сайта создателя, либо сохраненный язык получателя, либо русский
            let currentLang = localStorage.getItem('site_lang') || localStorage.getItem('card_lang') || 'ru';

            function changeCardLang(lang) {
                currentLang = lang;
                localStorage.setItem('card_lang', lang); // Запоминаем для будущих открыток
                
                // Переключаем визуал флажков
                document.getElementById('lang-ru').classList.remove('active');
                document.getElementById('lang-en').classList.remove('active');
                document.getElementById('lang-kz').classList.remove('active');
                document.getElementById('lang-' + lang).classList.add('active');

                // Переводим кнопки навигации
                const nextBtn = document.getElementById('nextSlideBtn');
                if (nextBtn) {
                    if (currentSlideIndex >= slides.length - 1) {
                        nextBtn.innerText = dict[lang].done;
                    } else {
                        nextBtn.innerText = dict[lang].next;
                    }
                }

                // Переводим интерактивные фишки
                const rBtn = document.getElementById('runawayBtn');
                if (rBtn) rBtn.innerText = dict[lang].close;

                const sTitle = document.getElementById('secretTitleText');
                if (sTitle) sTitle.innerText = dict[lang].sec_title;

                const sBtn = document.getElementById('secretCloseBtn');
                if (sBtn) sBtn.innerText = dict[lang].sec_btn;
            }

            // --- ЛОГИКА ОТКРЫТКИ ---
            let currentSlideIndex = 0; 
            const slides = document.querySelectorAll('.slide'); 
            const nextBtn = document.getElementById('nextSlideBtn');
            
            function nextSlide() {
                slides[currentSlideIndex].classList.remove('active');
                currentSlideIndex++;
                if (currentSlideIndex >= slides.length) { 
                    currentSlideIndex = slides.length - 1; 
                    slides[currentSlideIndex].classList.add('active'); 
                    alert(dict[currentLang].end_msg); 
                    return; 
                }
                slides[currentSlideIndex].classList.add('active');
                if (currentSlideIndex === slides.length - 1) nextBtn.innerText = dict[currentLang].done;
            }
            
            let isPlaying = false;
            function toggleMusic() { 
                const audio = document.getElementById('bgMusic'); 
                const btn = document.getElementById('musicBtn'); 
                if(isPlaying) { audio.pause(); btn.classList.remove('playing'); } 
                else { audio.play(); btn.classList.add('playing'); } 
                isPlaying = !isPlaying; 
            }

            // Мгновенный перевод при загрузке страницы
            window.onload = () => changeCardLang(currentLang);
        <\/script>

        ${hasRunawayBtn ? `<div id="runawayBtn" style="position: fixed; top: 15px; right: 15px; width: 105px; height: 32px; background: rgba(231, 76, 60, 0.9); color: white; border-radius: 8px; font-size: 13px; font-family: sans-serif; font-weight: bold; cursor: pointer; z-index: 9999; box-shadow: 0 2px 5px rgba(0,0,0,0.1); transition: top 0.2s ease, left 0.2s ease; backdrop-filter: blur(2px); user-select: none; display: flex; align-items: center; justify-content: center; box-sizing: border-box;">✖ Закрыть</div><script>const rBtn = document.getElementById('runawayBtn'); if(rBtn) { rBtn.addEventListener('mouseenter', function() { const maxX = window.innerWidth - this.offsetWidth - 20; const maxY = window.innerHeight - this.offsetHeight - 20; this.style.left = Math.max(15, Math.floor(Math.random() * maxX)) + 'px'; this.style.top = Math.max(15, Math.floor(Math.random() * maxY)) + 'px'; }); rBtn.addEventListener('click', function(e) { e.preventDefault(); }); }<\/script>` : ''}
        
        ${hiddenMessage ? `<div id="secretHeart" style="position: fixed; bottom: 20px; right: 20px; font-size: 50px; cursor: pointer; z-index: 9998; animation: pulseHeart 1.5s infinite; filter: drop-shadow(0 4px 10px rgba(255,105,180,0.5));">💖</div><div class="secret-overlay" id="secretOverlay" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.6); z-index: 9999; display: none;" onclick="closeSecret()"></div><div class="secret-modal" id="secretModal" style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: white; padding: 30px; border-radius: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.3); z-index: 10000; text-align: center; display: none; width: 300px; max-width: 80%;"><h3 id="secretTitleText" style="color: #ff4757; margin-top: 0;">Секретное послание 💌</h3><p style="font-size: 18px; color: #333;">${hiddenMessage}</p><button id="secretCloseBtn" onclick="closeSecret()" style="background: #ff4757; color: white; border: none; padding: 10px 20px; border-radius: 10px; font-weight: bold; cursor: pointer; margin-top: 15px;">Ух ты!</button></div><style>@keyframes pulseHeart { 0% { transform: scale(1); } 50% { transform: scale(1.15); } 100% { transform: scale(1); } }</style><script>document.getElementById('secretHeart').addEventListener('click', () => { document.getElementById('secretModal').style.display = 'block'; document.getElementById('secretOverlay').style.display = 'block'; }); function closeSecret() { document.getElementById('secretModal').style.display = 'none'; document.getElementById('secretOverlay').style.display = 'none'; }<\/script>` : ''}
    </body>
    </html>
    `;
}