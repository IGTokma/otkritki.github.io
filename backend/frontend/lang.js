// СЛОВАРЬ ПЕРЕВОДОВ
const i18n = {
    ru: {
        auth_title: "Вход в аккаунт 🔐", auth_sub: "Чтобы сохранять открытки навсегда", login_ph: "Логин (без пробелов)", pass_ph: "Пароль", btn_in: "Войти ➔", btn_up: "Создать аккаунт ✨", greeting: "Привет, ", shop: "Магазин 🛍️", logout: "Выйти", themes_title: "Для кого создаем открытку?", my_cards: "Мои открытки 🗂️", back_themes: "⬅ Назад к темам", add_slide: "+ Добавить", card_name_ph: "Название открытки (напр: Маме)", int_features: "Интерактивные фишки 🪄", hidden_msg_ph: "Скрытое послание (по клику на 💖)", runaway_btn: "Убегающая кнопка 'Закрыть' 🏃‍♂️", header_ph: "Заголовок (например: Привет!)", img_ph: "Нажми, чтобы выбрать GIF", msg_ph: "Основной текст сообщения...", delete_card: "🗑️ Удалить эту карточку", btn_ready: "Готово! (Перейти к отправке)", custom_design: "Свой дизайн ✨", who_is_card: "Кому открытка?", bg_music: "Музыка фона", choose_music: "🎵 Выбрать музыку", bg_emoji: "Эмодзи для фона (1-2 шт)", bg_color: "Цвет фона", btn_create: "Создать ➔", choose_cat: "Выбери категорию:", custom_url_ph: "Или вставь свою ссылку...", btn_ok: "Ок", music_title: "Выбери музыку 🎵", music_search_ph: "Найти песню...", music_search_btn: "Поиск 🔍", music_url_ph: "Ссылка на .mp3 файл", card_ready: "Открытка готова! 💖", send_chat: "📲 Отправить в чат", download_file: "📥 Скачать файл", go_home: "🏠 На главную", shop_title: "Магазин Открыток 🛍️", shop_promo: "🎁 Первая покупка дает +3 бонусные открытки бесплатно!", out_of_cards: "Открытки закончились 😔", out_desc: "Чтобы отправить эту открытку, пополните баланс.", or_word: "или", open_shop: "Открыть магазин (Выгоднее! 🛍️)", confirm_title: "Подтверждение", confirm_yes: "Да", confirm_no: "Нет", close_btn: "✖ Закрыть",
        // --- РЕКЛАМА И УВЕДОМЛЕНИЯ ---
        watch_ad: "Смотреть рекламу (1 шт.) 📺",
        ad_title: "Рекламная пауза ⏳",
        ad_wait: "Пожалуйста, подождите...",
        toast_ad_reward: "✅ Реклама просмотрена! Начислена 1 открытка.",
        out_of_cards: "Открытки закончились 😔", 
        out_desc: "Посмотри короткую рекламу, чтобы отправить эту открытку.",
        theme_mom: "Любимой Маме 🌸", theme_love: "Любимому ❤️", theme_hb: "С Днём Рождения 🎈", theme_friend: "Для Друга ✌️", theme_sad: "Прости меня 🥺", theme_neutral: "Просто так ✨", theme_custom: "+ Свой дизайн 🎨",
        word_card: "Карточка", btn_share: "Поделиться", confirm_del_slide: "Удалить эту карточку?", confirm_del_saved: "Точно удалить навсегда?", untitled: "Без названия",
        cat_cats: "Котики 🐈", cat_love: "Любовь ❤️", cat_sad: "Грусть 🥺", cat_greetings: "Приветствия 👋", cat_fun: "Веселье 😂", cat_romantic: "Романтика 💕",
        
        // --- УВЕДОМЛЕНИЯ (TOASTS) ---
        toast_enter_cred: "Пожалуйста, введите логин и пароль!",
        toast_acc_created: "🎉 Аккаунт создан! Входим...",
        toast_net_err: "Ошибка сети. Бэкенд запущен?",
        toast_wrong_cred: "❌ Неверный логин или пароль",
        toast_err_server: "Ошибка сервера!",
        toast_buy_success: "✅ Успешно оплачено!",
        toast_buy_net_err: "Ошибка сети при покупке",
        toast_who_for: "Кому будет эта открытка?",
        toast_link_copied: "✅ Ссылка скопирована!",
        toast_deleted: "Удалено",
        toast_delete_err: "Ошибка удаления",
        toast_music_err: "Ошибка загрузки музыки",
        toast_need_name: "Напишите название (на 1-й карте)!",
        toast_need_img: "Выберите все картинки!",
        toast_not_auth: "Вы не авторизованы!",
        earn_card: "Заработать открытку 📺",
        auth_promo: "Порадуйте близких и друзей живой открыткой совершенно бесплатно!",
        toast_save_err: "Не удалось сохранить открытку"
    },
    en: {
        auth_title: "Log In 🔐", auth_sub: "To save your cards forever", login_ph: "Username (no spaces)", pass_ph: "Password", btn_in: "Log In ➔", btn_up: "Create Account ✨", greeting: "Hello, ", shop: "Shop 🛍️", logout: "Logout", themes_title: "Who is this card for?", my_cards: "My Cards 🗂️", back_themes: "⬅ Back to themes", add_slide: "+ Add slide", card_name_ph: "Card name (e.g. For Mom)", int_features: "Interactive Magic 🪄", hidden_msg_ph: "Hidden msg (appears on 💖 click)", runaway_btn: "Runaway 'Close' button 🏃‍♂️", header_ph: "Heading (e.g. Hello!)", img_ph: "Click to select GIF", msg_ph: "Main message text...", delete_card: "🗑️ Delete this card", btn_ready: "Done! (Go to send)", custom_design: "Custom Design ✨", who_is_card: "Who is it for?", bg_music: "Background Music", choose_music: "🎵 Choose Music", bg_emoji: "Background Emoji (1-2)", bg_color: "Background Color", btn_create: "Create ➔", choose_cat: "Choose category:", custom_url_ph: "Or paste your link...", btn_ok: "Ok", music_title: "Choose Music 🎵", music_search_ph: "Search song...", music_search_btn: "Search 🔍", music_url_ph: "Link to .mp3 file", card_ready: "Card is ready! 💖", send_chat: "📲 Send to chat", download_file: "📥 Download file", go_home: "🏠 Home", shop_title: "Card Shop 🛍️", shop_promo: "🎁 First purchase gives +3 bonus cards!", out_of_cards: "Out of cards 😔", out_desc: "Top up your balance to send this card.", or_word: "or", open_shop: "Open Shop (Better deal! 🛍️)", confirm_title: "Confirmation", confirm_yes: "Yes", confirm_no: "No", close_btn: "✖ Close",
        watch_ad: "Watch Ad (1 card) 📺",
        ad_title: "Advertisement ⏳",
        ad_wait: "Please wait...",
        toast_ad_reward: "✅ Ad watched! 1 card added.",
        out_of_cards: "Out of cards 😔", 
        out_desc: "Watch a short ad to send this card.",
        theme_mom: "For Mom 🌸", theme_love: "For My Love ❤️", theme_hb: "Happy Birthday 🎈", theme_friend: "For a Friend ✌️", theme_sad: "Forgive Me 🥺", theme_neutral: "Just Because ✨", theme_custom: "+ Custom Design 🎨",
        word_card: "Card", btn_share: "Share", confirm_del_slide: "Delete this card?", confirm_del_saved: "Delete permanently?", untitled: "Untitled",
        cat_cats: "Cats 🐈", cat_love: "Love ❤️", cat_sad: "Sadness 🥺", cat_greetings: "Greetings 👋", cat_fun: "Fun 😂", cat_romantic: "Romantic 💕",
        
        // --- УВЕДОМЛЕНИЯ (TOASTS) ---
        toast_enter_cred: "Please enter username and password!",
        toast_acc_created: "🎉 Account created! Logging in...",
        toast_net_err: "Network error. Is backend running?",
        toast_wrong_cred: "❌ Invalid username or password",
        toast_err_server: "Server error!",
        toast_buy_success: "✅ Successfully purchased!",
        toast_buy_net_err: "Network error during purchase",
        toast_who_for: "Who is this card for?",
        toast_link_copied: "✅ Link copied!",
        toast_deleted: "Deleted",
        toast_delete_err: "Deletion error",
        toast_music_err: "Music load error",
        toast_need_name: "Enter a name (on the 1st card)!",
        toast_need_img: "Select all images!",
        toast_not_auth: "You are not authorized!",
        auth_promo: "Delight your loved ones with a live postcard absolutely free!",
        earn_card: "Earn a card 📺",
        toast_save_err: "Failed to save card"
    },
    kz: {
        auth_title: "Кіру 🔐", auth_sub: "Ашық хаттарды мәңгі сақтау үшін", login_ph: "Логин (бос орынсыз)", pass_ph: "Құпиясөз", btn_in: "Кіру ➔", btn_up: "Тіркелу ✨", greeting: "Сәлем, ", shop: "Дүкен 🛍️", logout: "Шығу", themes_title: "Ашық хат кімге арналған?", my_cards: "Менің ашық хаттарым 🗂️", back_themes: "⬅ Артқа", add_slide: "+ Қосу", card_name_ph: "Атауы (мыс: Анама)", int_features: "Интерактивті фишкалар 🪄", hidden_msg_ph: "Жасырын хат (💖 басқанда)", runaway_btn: "Қашатын 'Жабу' батырмасы 🏃‍♂️", header_ph: "Тақырып (мысалы: Сәлем!)", img_ph: "GIF таңдау үшін басыңыз", msg_ph: "Негізгі хабарлама мәтіні...", delete_card: "🗑️ Карточканы жою", btn_ready: "Дайын! (Жіберуге өту)", custom_design: "Өз дизайным ✨", who_is_card: "Кімге арналған?", bg_music: "Фон музыкасы", choose_music: "🎵 Музыка таңдау", bg_emoji: "Фон эмодзиі (1-2 дана)", bg_color: "Фон түсі", btn_create: "Жасау ➔", choose_cat: "Санатты таңдаңыз:", custom_url_ph: "Немесе сілтемені қойыңыз...", btn_ok: "Ок", music_title: "Музыка таңдау 🎵", music_search_ph: "Өлең іздеу...", music_search_btn: "Іздеу 🔍", music_url_ph: ".mp3 файлына сілтеме", card_ready: "Ашық хат дайын! 💖", send_chat: "📲 Чатқа жіберу", download_file: "📥 Файлды жүктеу", go_home: "🏠 Басты бетке", shop_title: "Дүкен 🛍️", shop_promo: "🎁 Алғашқы сауда +3 тегін ашық хат береді!", out_of_cards: "Ашық хаттар бітті 😔", out_desc: "Бұл ашық хатты жіберу үшін теңгерімді толтырыңыз.", or_word: "немесе", open_shop: "Дүкенді ашу (Тиімдірек! 🛍️)", confirm_title: "Растау", confirm_yes: "Иә", confirm_no: "Жоқ", close_btn: "✖ Жабу",
        watch_ad: "Жарнама көру (1 дана) 📺",
        ad_title: "Жарнама ⏳",
        ad_wait: "Күте тұрыңыз...",
        toast_ad_reward: "✅ Жарнама қаралды! 1 ашық хат қосылды.",
        out_of_cards: "Ашық хаттар бітті 😔", 
        out_desc: "Бұл ашық хатты жіберу үшін қысқа жарнама көріңіз.",
        theme_mom: "Сүйікті анама 🌸", theme_love: "Сүйіктім үшін ❤️", theme_hb: "Туған күніңмен 🎈", theme_friend: "Досым үшін ✌️", theme_sad: "Кешірші мені 🥺", theme_neutral: "Жәй ғана ✨", theme_custom: "+ Өз дизайным 🎨",
        word_card: "Карточка", btn_share: "Бөлісу", confirm_del_slide: "Бұл карточканы жою керек пе?", confirm_del_saved: "Мәңгілікке жою керек пе?", untitled: "Атаусыз",
        cat_cats: "Мысықтар 🐈", cat_love: "Махаббат ❤️", cat_sad: "Мұң 🥺", cat_greetings: "Сәлемдесу 👋", cat_fun: "Көңілді 😂", cat_romantic: "Романтика 💕",
        
        // --- УВЕДОМЛЕНИЯ (TOASTS) ---
        toast_enter_cred: "Логин мен құпиясөзді енгізіңіз!",
        toast_acc_created: "🎉 Аккаунт жасалды! Кірудеміз...",
        toast_net_err: "Желі қатесі. Сервер қосылған ба?",
        toast_wrong_cred: "❌ Логин немесе құпиясөз қате",
        toast_err_server: "Сервер қатесі!",
        toast_buy_success: "✅ Сәтті төленді!",
        toast_buy_net_err: "Сатып алу кезіндегі желі қатесі",
        toast_who_for: "Бұл ашық хат кімге арналған?",
        toast_link_copied: "✅ Сілтеме көшірілді!",
        toast_deleted: "Жойылды",
        toast_delete_err: "Жою қатесі",
        toast_music_err: "Музыка жүктеу қатесі",
        toast_need_name: "Атауын жазыңыз (1-ші картада)!",
        toast_need_img: "Барлық суреттерді таңдаңыз!",
        toast_not_auth: "Сіз авторизациядан өтпедіңіз!",
        earn_card: "Ашық хат алу 📺",
        auth_promo: "Жақындарыңыз бен достарыңызды тірі ашық хатпен тегін қуантыңыз!",
        toast_save_err: "Ашық хат сақталмады"
    }
};
// ... (остальной код в lang.js остается как был)

let currentLang = localStorage.getItem('site_lang') || 'ru';

// СПЕЦИАЛЬНАЯ ФУНКЦИЯ ДЛЯ JS (Достает перевод по ключу)
window.t = function(key) {
    return i18n[currentLang] && i18n[currentLang][key] ? i18n[currentLang][key] : "";
};

function changeLang(lang) {
    currentLang = lang;
    localStorage.setItem('site_lang', lang);
    applyTranslations();
}

function applyTranslations() {
    const dict = i18n[currentLang];
    
    // Переводим HTML
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (dict[key]) {
            if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') el.placeholder = dict[key]; 
            else el.innerText = dict[key]; 
        }
    });
    
    document.querySelectorAll('.lang-btn').forEach(btn => {
        if(btn.getAttribute('data-lang') === currentLang) {
            btn.style.opacity = '1'; btn.style.transform = 'scale(1.1)';
        } else {
            btn.style.opacity = '0.5'; btn.style.transform = 'scale(1)';
        }
    });
    
    const greetingBase = document.getElementById('greetingTextBase');
    if(greetingBase) greetingBase.innerText = dict.greeting;

    // ПРИНУДИТЕЛЬНО ПЕРЕРИСОВЫВАЕМ ЭЛЕМЕНТЫ СКРИПТА СРАЗУ ПОСЛЕ СМЕНЫ ЯЗЫКА!
    if (window.renderThemes) window.renderThemes();
    if (window.updateUI) window.updateUI();
    if (window.renderCategoryButtons) window.renderCategoryButtons();
    if (window.renderMusicTags) window.renderMusicTags();
    if (window.renderSavedCards) window.renderSavedCards();
}

document.addEventListener('DOMContentLoaded', applyTranslations);