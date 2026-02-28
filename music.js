// Файл: music.js
// База фоновой музыки со 100% рабочими прямыми ссылками на .mp3

const myMusicLibrary = {
    "none": {
        name: "Без музыки 🔇",
        tracks: [
            { 
                name: "Тишина (Отключить звук)", 
                url: "", 
                cover: "https://placehold.co/150x150/eeeeee/999999?text=MUTE" 
            }
        ]
    },
    "romantic": {
        name: "Романтика ❤️",
        tracks: [
            { 
                name: "Нежное пианино (Lofi)", 
                url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-16.mp3", 
                cover: "https://images.unsplash.com/photo-1520116468816-95b69f847357?w=150&q=80" 
            },
            { 
                name: "Легкий джаз", 
                url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3", 
                cover: "https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=150&q=80" 
            }
        ]
    },
    "fun": {
        name: "Веселье 🥳",
        tracks: [
            { 
                name: "Энергичный бит", 
                url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3", 
                cover: "https://images.unsplash.com/photo-1546445317-29f4545e9d53?w=150&q=80" 
            },
            { 
                name: "Поп-драйв", 
                url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3", 
                cover: "https://images.unsplash.com/photo-1493225457124-a1a2a5f5f9af?w=150&q=80" 
            }
        ]
    },
    "chill": {
        name: "Чилл / Лофи ☕",
        tracks: [
            { 
                name: "Спокойствие", 
                url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3", 
                cover: "https://images.unsplash.com/photo-1516280440502-62f54ce5983e?w=150&q=80" 
            },
            { 
                name: "Ночной город", 
                url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-13.mp3", 
                cover: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=150&q=80" 
            }
        ]
    },
    "sad": {
        name: "Грусть 🥺",
        tracks: [
            { 
                name: "Меланхолия", 
                url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-15.mp3", 
                cover: "https://images.unsplash.com/photo-1612225330812-01a9c6b355ec?w=150&q=80" 
            }
        ]
    }
};