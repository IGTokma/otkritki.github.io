// Файл: api_music.js
// Работает с публичным iTunes API (Apple Music)

async function searchOnlineMusic() {
    const query = document.getElementById('musicSearchInput').value.trim();
    const container = document.getElementById('musicList');
    
    if (!query) {
        alert("Введите название песни или исполнителя!");
        return;
    }

    // Показываем загрузку
    container.innerHTML = '<div style="text-align:center; padding: 20px; color: #888;">Ищем треки... ⏳</div>';

    try {
        // Делаем запрос к Apple (лимит 15 треков)
        const response = await fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(query)}&media=music&entity=song&limit=15&country=RU`);
        const data = await response.json();

        if (data.results.length === 0) {
            container.innerHTML = '<div style="text-align:center; padding: 20px; color: #888;">Ничего не найдено 😔</div>';
            return;
        }

        container.innerHTML = ''; // Очищаем контейнер

        data.results.forEach(track => {
            const previewUrl = track.previewUrl; // Ссылка на 30-сек аудио (.m4a)
            if (!previewUrl) return; // Пропускаем, если у трека нет превью

            // Apple отдает мелкие картинки 100x100, мы хакаем ссылку и просим 200x200
            const cover = track.artworkUrl100.replace('100x100bb', '200x200bb');
            const safeTitle = `${track.artistName} - ${track.trackName}`.replace(/'/g, "&apos;").replace(/"/g, "&quot;");

            const card = document.createElement('div');
            card.style.cssText = "display: flex; align-items: center; gap: 10px; background: #f8f9fa; padding: 10px; border-radius: 15px; box-shadow: 0 2px 5px rgba(0,0,0,0.05);";

            const safeId = previewUrl.replace(/[^a-zA-Z0-9]/g, '');
            const playIcon = currentPlayingUrl === previewUrl ? '⏸️' : '▶️';

            card.innerHTML = `
                <img src="${cover}" style="width: 50px; height: 50px; border-radius: 10px; object-fit: cover; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                <div style="flex-grow: 1; overflow: hidden;">
                    <div style="font-weight: bold; color: #333; font-size: 14px; white-space: nowrap; text-overflow: ellipsis; overflow: hidden;">${track.trackName}</div>
                    <div style="color: #888; font-size: 12px; white-space: nowrap; text-overflow: ellipsis; overflow: hidden;">${track.artistName}</div>
                </div>
                <button onclick="togglePreview('${previewUrl}')" style="background:none; border:none; font-size:24px; cursor:pointer; flex-shrink: 0;" id="playBtn-${safeId}">${playIcon}</button>
                <button onclick="confirmMusicSelection('${previewUrl}', '${safeTitle}')" style="background: #2ecc71; color: white; border: none; padding: 8px 15px; border-radius: 10px; font-weight: bold; cursor: pointer; flex-shrink: 0;">Выбрать</button>
            `;
            container.appendChild(card);
        });

    } catch (err) {
        console.error(err);
        container.innerHTML = '<div style="text-align:center; padding: 20px; color: red;">Ошибка сети ❌</div>';
    }
}