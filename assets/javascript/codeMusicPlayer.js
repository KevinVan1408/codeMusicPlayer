const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const PlAYER_STORAGE_KEY = 'F8_PLAYER';

const controlsImage = $('.controls__image');
const heading = $('.controls__header-title-heading');
const image = $('.controls__image-img');
const audio = $('#audio');
const playPauseBtn = $('.controls__form-play-pause');
const player = $('.player');
const progressRange = $('#controls__range-input');
const nextBtn = $('.btn-next');
const prevBtn = $('.btn-prev');
const randomBtn = $('.btn-random');
const repeatBtn = $('.btn-repeat');
const playlist = $('.playlist');

const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    config: JSON.parse(localStorage.getItem(PlAYER_STORAGE_KEY)) || {},
    songs: [
        {
            name: 'Lời Đường Mật',
            singer: 'LyLy-HieuThuHai',
            path: './assets/songs/LoiDuongMat-LylyHIEUTHUHAI-6802155.mp3',          
        },
        {
            name: 'Hãy Trao Cho Anh',
            singer: 'Sơn Tùng MTP',
            path: './assets/songs/HayTraoChoAnh-SonTungMTPSnoopDogg-6010660.mp3',          
        },
        {
            name: 'Anh Thề Đấy',
            singer: 'Hương Ly',
            path: './assets/songs/AnhTheDayCover-HuongLy-7088035.mp3',                      
        },
        {
            name: 'Chờ Đợi Có Đáng Sợ',
            singer: 'Andiez',
            path: './assets/songs/ChoDoiCoDangSo-Andiez-6332589.mp3',          
        },
        {
            name: 'Có Hẹn Với Thanh Xuân',
            singer: 'Monstar',
            path: './assets/songs/cohenvoithanhxuan-MONSTAR-7050201.mp3',          
        },
        {
            name: 'Mượn Rượu Tỏ Tình',
            singer: 'Emily-BigDaddy',
            path: './assets/songs/MuonRuouToTinh-EmilyBigDaddy-5871420.mp3',          
        },
        {
            name: 'Nắm Đôi Bàn Tay',
            singer: 'KayTran',
            path: './assets/songs/NamDoiBanTay-KayTran-7042104.mp3',          
        },
        {
            name: 'So Far',
            singer: 'Binz',
            path: './assets/songs/SoFar-Binz-5521790.mp3',          
        },
    ],
    setConfig: function(key, value) {
        this.config[key] = value;
        localStorage.setItem(PlAYER_STORAGE_KEY, JSON.stringify(this.config));
    },
    render: function() {
        const _this = this;
        const html = this.songs.map(function(song, index) {
            return `<div class="playlist-song ${index === _this.currentIndex ? 'active' : ''}" data-index="${index}">
            <div class="playlist-song__image">
                <img src="./assets/image/inspiration2.jpg" alt="song-picture" class="playlist-song__image-img">
            </div>
            <div class="playlist-song__title">
                <h3 class="playlist-song__title-name">${song.name}</h3>
                <p class="playlist-song__title-author">${song.singer}</p>
            </div>
            <div class="playlist-song__setting">
                <i class="playlist-song__setting-icon fas fa-ellipsis-h"></i>
            </div>
            </div>`
        });
        playlist.innerHTML = html.join('');
    },
    defineProperties: function() {
        Object.defineProperty(this, 'currentSong', {
            get: function() {
                return this.songs[this.currentIndex];
            }
        })
    },
    handleEvent: function() {
        const _this = this;
        const controlsImageWidth = controlsImage.offsetWidth;

        // Handle for image rotated
        const controlsImageAnimate = controlsImage.animate([
            { transform: 'rotate(360deg)'}
        ], {
            duration: 10000,
            iterations: Infinity
        })
        controlsImageAnimate.pause();

        // Change when scroll
        document.onscroll = function() {
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const newControlsImageWidth = controlsImageWidth - scrollTop;
            
            controlsImage.style.width = newControlsImageWidth > 0 ? newControlsImageWidth + 'px' : 0;
            controlsImage.style.opacity = newControlsImageWidth / controlsImageWidth;
        }
        // Change when click play
        playPauseBtn.onclick = function() {
            if (_this.isPlaying) {
                audio.pause();
            }
            else {
                audio.play();
            }
        }
        // When song is isPlaying
        audio.onplay = function() {
            _this.isPlaying = true;
            player.classList.add('playing');
            controlsImageAnimate.play();
        }
        // When song is isPause
        audio.onpause = function() {
            _this.isPlaying = false;
            player.classList.remove('playing');
            controlsImageAnimate.pause();
        }
        // When the progress of song change
        audio.ontimeupdate = function() {
            if (audio.duration) {
                const progressPercentage = Math.floor(audio.currentTime / audio.duration * 100);
                progressRange.value = progressPercentage;
            }
        }
        // When song on Change
        progressRange.oninput = function(e) {
            const seekTime = Math.floor(audio.duration / 100 * e.target.value);
            audio.currentTime = seekTime;
        }
        // When next song
        nextBtn.onclick = function() {
            if (_this.isRandom) {
                _this.randomSong();
            } else {
                _this.nextSong();
            }
            audio.play();
            _this.render();
            _this.srcollToActiveSong();
        }
        // When previous song
        prevBtn.onclick = function() {
            if (_this.isRandom) {
                _this.randomSong();
            } else {
                _this.prevSong();
            }
            audio.play();
            _this.render();
            _this.srcollToActiveSong();
        }
        // When random song
        randomBtn.onclick = function() {
            _this.isRandom = !_this.isRandom;
            _this.setConfig('isRandom', _this.isRandom);
            this.classList.toggle('active', _this.isRandom);
        }
        // When repeat song
        repeatBtn.onclick = function() {
            _this.isRepeat = !_this.isRepeat;
            _this.setConfig('isRepeat', _this.isRepeat);
            this.classList.toggle('active', _this.isRepeat);
        }
        // When audio song is ended
        audio.onended = function() {
            if (_this.isRepeat) {
                audio.play();
            } else {
                nextBtn.click();
            }
        }
        // Click on playlist
        playlist.onclick = function(e) {
            const songNode = e.target.closest('.playlist-song:not(.active)');
            const optionNode = e.target.closest('.playlist-song__setting-icon');
            if (songNode || optionNode) {
                if (songNode) {
                    _this.currentIndex = Number(songNode.dataset.index);
                    _this.loadCurrentSong();
                    _this.render();
                    audio.play();
                }
            }
        }
    },
    srcollToActiveSong: function() {
        if (this.currentIndex === 0 ) {
            setTimeout(function() {
                $('.playlist-song.active').scrollIntoView({
                    behavior: 'smooth',
                    block: 'center'
                });
            }, 300)
        } else {
            setTimeout(function() {
                $('.playlist-song.active').scrollIntoView({
                    behavior: 'smooth',
                    block: 'nearest'
                });
            }, 300)
        }
    },
    loadCurrentSong: function() {
        heading.textContent = this.currentSong.name;
        image.style.backgroundImage = `url('./assets/image/inspiration2.jpg')`;
        audio.src = this.currentSong.path;
    },
    loadConfig: function() {
        this.isRandom = this.config.isRandom;
        this.isRepeat = this.config.isRepeat;
    },
    nextSong: function() {
        this.currentIndex++;
        if (this.currentIndex >= this.songs.length) {
            this.currentIndex = 0;
        }
        this.loadCurrentSong();
    },
    prevSong: function() {
        this.currentIndex--;
        if (this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1;
        }
        this.loadCurrentSong();
    },
    randomSong: function() {
        let newIndex;
        do
        {
            newIndex = Math.floor(Math.random() * this.songs.length);
        } while (newIndex === this.currentIndex)
        this.currentIndex = newIndex;
        this.loadCurrentSong();
    },
    start: function () {
        this.loadConfig();
        this.defineProperties();
        this.handleEvent();
        this.loadCurrentSong();
        this.render();
        // Display this btn at the beginning
        randomBtn.classList.toggle('active', this.isRandom);
        repeatBtn.classList.toggle('active', this.isRepeat);
    },
};

app.start();