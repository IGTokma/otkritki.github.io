// Работает с публичным iTunes API (Apple Music)
// Файл: api_music.js
async function searchOnlineMusic() {
    const input = document.getElementById('musicSearchInput');
    const term = input.value.trim();
    if (!term) return;

    const btn = input.nextElementSibling;
    const oldText = btn.innerText;
    btn.innerText = "⏳...";
    btn.disabled = true;

    const container = document.getElementById('musicList');
    container.innerHTML = '<div style="text-align:center; color:#888;">Ищем... 🔍</div>';

    try {
        // ВАЖНО: Строго HTTPS и encodeURIComponent (чтобы кириллица не ломала запрос на айфонах)
        const response = await fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(term)}&entity=song&limit=15`);
        if (!response.ok) throw new Error("Ошибка сети");
        
        const data = await response.json();
        container.innerHTML = '';
        
        if (data.results.length === 0) {
            container.innerHTML = '<div style="text-align:center; color:#888;">Ничего не найдено 😔</div>';
            return;
        }

        data.results.forEach(track => {
            const card = document.createElement('div');
            card.style.cssText = "display: flex; align-items: center; gap: 10px; background: #f8f9fa; padding: 10px; border-radius: 15px;";
            const playIcon = '▶️';
            // Защита от ошибок, если у трека нет превью
            const previewUrl = track.previewUrl || "";
            const safeId = previewUrl ? previewUrl.replace(/[^a-zA-Z0-9]/g, '') : '';
            
            card.innerHTML = `
                <img src="${track.artworkUrl100 || track.artworkUrl60 || ''}" style="width: 50px; height: 50px; border-radius: 10px; object-fit: cover; background: #ddd;">
                <div style="flex-grow: 1;">
                    <div style="font-weight: bold; font-size: 14px; color: #333;">${track.trackName}</div>
                    <div style="font-size: 12px; color: #888;">${track.artistName}</div>
                </div>
                ${previewUrl ? `<button onclick="togglePreview('${previewUrl}')" style="background:none; border:none; font-size:24px; cursor:pointer;" id="playBtn-${safeId}">${playIcon}</button>` : ''}
                <button onclick="confirmMusicSelection('${previewUrl}', '${track.trackName.replace(/'/g, "\\'")}')" style="background: #2ecc71; color: white; border: none; padding: 8px 15px; border-radius: 10px; font-weight: bold; cursor: pointer;">Выбрать</button>
            `;
            container.appendChild(card);
        });
    } catch (error) {
        container.innerHTML = '<div style="text-align:center; color:#e74c3c;">Ошибка сервера iTunes. Попробуйте позже.</div>';
    } finally {
        btn.innerText = oldText;
        btn.disabled = false;
    }
}