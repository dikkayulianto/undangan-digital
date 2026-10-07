/**
 * Inveet.id Style Wedding Invitation Scripts
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide Icons
  if (window.lucide) {
    lucide.createIcons();
  }

  // Target Countdown Date (Default or Custom)
  let targetWeddingDate = new Date('2026-12-28T08:00:00+07:00').getTime();

  // Audio Element
  const audio = document.getElementById('weddingAudio');
  const btnBuka = document.getElementById('btnBukaUndangan');
  const coverSection = document.getElementById('coverSection');
  const mainWrapper = document.getElementById('mainWrapper');
  const floatingMusicBtn = document.getElementById('floatingMusicBtn');
  const musicDisc = document.getElementById('musicDisc');
  const bottomNav = document.getElementById('bottomNav');

  // 1. Dynamic Guest Name from URL Parameter (?to=Nama+Tamu)
  const urlParams = new URLSearchParams(window.location.search);
  const guestNameParam = urlParams.get('to');
  const guestNameElement = document.getElementById('guestName');
  if (guestNameElement) {
    if (guestNameParam && guestNameParam.trim() !== '') {
      guestNameElement.textContent = decodeURIComponent(guestNameParam.replace(/\+/g, ' '));
    } else {
      guestNameElement.textContent = 'Tamu Undangan';
    }
  }

  // 1.5. Apply Active Theme (URL Param ?theme= takes highest priority, then localStorage config, then 'champagne')
  const themeParam = urlParams.get('theme');
  let activeTheme = 'champagne';

  const savedThemeConfig = localStorage.getItem('wedding_config');
  if (savedThemeConfig) {
    try {
      const parsedTheme = JSON.parse(savedThemeConfig);
      if (parsedTheme && parsedTheme.theme) {
        activeTheme = parsedTheme.theme;
      }
    } catch (e) {}
  }

  if (themeParam && ['champagne', 'sage', 'midnight', 'royal'].includes(themeParam.toLowerCase())) {
    activeTheme = themeParam.toLowerCase();
  }

  document.documentElement.setAttribute('data-theme', activeTheme);
  document.body.setAttribute('data-theme', activeTheme);

  // Background visual customization per theme (Purely thematic patterns & aesthetics, zero people photos)
  const desktopAmbient = document.querySelector('.hidden.lg\\:flex.fixed.inset-y-0.left-0');
  const coverSectionEl = document.getElementById('coverSection');

  const themeBackgrounds = {
    champagne: {
      url: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1600&q=85',
      deskGrad: 'linear-gradient(to right, rgba(20,18,16,0.90), rgba(20,18,16,0.68))',
      covGrad: 'linear-gradient(to bottom, rgba(28,25,23,0.50), rgba(28,25,23,0.88))'
    },
    sage: {
      url: 'https://images.unsplash.com/photo-1528183429752-a97d0bf99b5a?auto=format&fit=crop&w=1600&q=85',
      deskGrad: 'linear-gradient(to right, rgba(20,32,24,0.90), rgba(20,32,24,0.68))',
      covGrad: 'linear-gradient(to bottom, rgba(20,32,24,0.48), rgba(20,32,24,0.90))'
    },
    midnight: {
      url: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=1600&q=85',
      deskGrad: 'linear-gradient(to right, rgba(14,12,18,0.92), rgba(14,12,18,0.70))',
      covGrad: 'linear-gradient(to bottom, rgba(14,12,18,0.52), rgba(14,12,18,0.92))'
    },
    royal: {
      url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1600&q=85',
      deskGrad: 'linear-gradient(to right, rgba(13,27,42,0.92), rgba(13,27,42,0.68))',
      covGrad: 'linear-gradient(to bottom, rgba(13,27,42,0.48), rgba(13,27,42,0.92))'
    }
  };

  const currentThemeBg = themeBackgrounds[activeTheme] || themeBackgrounds.champagne;
  if (desktopAmbient) {
    desktopAmbient.style.backgroundImage = `${currentThemeBg.deskGrad}, url('${currentThemeBg.url}')`;
  }
  if (coverSectionEl) {
    coverSectionEl.style.backgroundImage = `${currentThemeBg.covGrad}, url('${currentThemeBg.url}')`;
  }

  function decodeWeddingConfigFromUrl(encoded) {
    try {
      let b64 = encoded.replace(/-/g, '+').replace(/_/g, '/');
      while (b64.length % 4) b64 += '=';
      const jsonStr = decodeURIComponent(escape(atob(b64)));
      const c = JSON.parse(jsonStr);
      return {
        theme: c.th || 'champagne',
        groom: {
          nickname: c.gn || '',
          fullname: c.gf || '',
          father: c.gfa || '',
          mother: c.gm || '',
          order: c.go || '',
          instagram: c.gi || '',
          photo: c.gp || ''
        },
        bride: {
          nickname: c.bn || '',
          fullname: c.bf || '',
          father: c.bfa || '',
          mother: c.bm || '',
          order: c.bo || '',
          instagram: c.bi || '',
          photo: c.bp || ''
        },
        event: {
          dateDisplay: c.ed || '',
          dateIso: c.ei || '',
          akadTime: c.at || '',
          akadPlace: c.ap || '',
          akadAddress: c.aa || '',
          resepsiTime: c.rt || '',
          resepsiPlace: c.rp || '',
          resepsiAddress: c.ra || '',
          mapsUrl: c.mu || ''
        },
        gift: {
          bank1Name: c.b1n || '',
          bank1Number: c.b1no || '',
          bank1Holder: c.b1h || '',
          bank2Name: c.b2n || '',
          bank2Number: c.b2no || '',
          bank2Holder: c.b2h || '',
          physicalAddress: c.pa || ''
        },
        audioUrl: c.au || '',
        customBg: c.bg || '',
        gallery: Array.isArray(c.g) && c.g.length > 0 ? c.g : undefined
      };
    } catch(e) {
      console.error('Error decoding wedding config:', e);
      return null;
    }
  }

  // 2. Load Configuration from LocalStorage or URL Parameter (?d=...)
  function loadWeddingConfig() {
    let config = null;
    const saved = localStorage.getItem('wedding_config');
    if (saved) {
      try { config = JSON.parse(saved); } catch(e) {}
    }

    const dParam = urlParams.get('d');
    if (dParam) {
      const urlConfig = decodeWeddingConfigFromUrl(dParam);
      if (urlConfig) {
        config = Object.assign({}, config || {}, urlConfig);
        try {
          localStorage.setItem('wedding_config', JSON.stringify(config));
          if (urlConfig.groom?.photo) localStorage.setItem('wedding_groom_photo', urlConfig.groom.photo);
          if (urlConfig.bride?.photo) localStorage.setItem('wedding_bride_photo', urlConfig.bride.photo);
        } catch(e) {}
      }
    }

    if (!config) {
      initAudioEngine('https://assets.mixkit.co/music/preview/mixkit-wedding-waltz-piano-music-681.mp3');
      return;
    }
    try {

      const groomNick = config.groom?.nickname || 'Dimas';
      const brideNick = config.bride?.nickname || 'Sarah';
      const coupleNames = `${groomNick} & ${brideNick}`;

      // Titles & Nicknames
      const desktopNames = document.getElementById('desktopCoupleNames');
      if (desktopNames) desktopNames.textContent = coupleNames;
      const coverNames = document.getElementById('coverCoupleNames');
      if (coverNames) coverNames.textContent = coupleNames;
      const footerNames = document.getElementById('footerCoupleNames');
      if (footerNames) footerNames.textContent = coupleNames;

      // Groom details
      if (config.groom) {
        const g = config.groom;
        const gName = document.getElementById('groomNameText');
        if (gName && g.fullname) gName.textContent = g.fullname;
        const gOrder = document.getElementById('groomOrderText');
        if (gOrder && g.order) gOrder.textContent = g.order;
        const gParents = document.getElementById('groomParentsText');
        if (gParents && (g.father || g.mother)) gParents.textContent = `${g.father || ''} & ${g.mother || ''}`;
        const gInstaText = document.getElementById('groomInstaText');
        const gInstaLink = document.getElementById('groomInstaLink');
        if (gInstaText && g.instagram) {
          gInstaText.textContent = `@${g.instagram.replace('@', '')}`;
          if (gInstaLink) gInstaLink.href = `https://instagram.com/${g.instagram.replace('@', '')}`;
        }
        const savedGPhoto = localStorage.getItem('wedding_groom_photo');
        if (savedGPhoto && savedGPhoto.trim()) g.photo = savedGPhoto.trim();
        const gPhoto = document.getElementById('groomPhotoImg');
        if (gPhoto && g.photo) gPhoto.src = g.photo;
      }

      // Bride details
      if (config.bride) {
        const b = config.bride;
        const bName = document.getElementById('brideNameText');
        if (bName && b.fullname) bName.textContent = b.fullname;
        const bOrder = document.getElementById('brideOrderText');
        if (bOrder && b.order) bOrder.textContent = b.order;
        const bParents = document.getElementById('brideParentsText');
        if (bParents && (b.father || b.mother)) bParents.textContent = `${b.father || ''} & ${b.mother || ''}`;
        const bInstaText = document.getElementById('brideInstaText');
        const bInstaLink = document.getElementById('brideInstaLink');
        if (bInstaText && b.instagram) {
          bInstaText.textContent = `@${b.instagram.replace('@', '')}`;
          if (bInstaLink) bInstaLink.href = `https://instagram.com/${b.instagram.replace('@', '')}`;
        }
        const savedBPhoto = localStorage.getItem('wedding_bride_photo');
        if (savedBPhoto && savedBPhoto.trim()) b.photo = savedBPhoto.trim();
        const bPhoto = document.getElementById('bridePhotoImg');
        if (bPhoto && b.photo) bPhoto.src = b.photo;
      }

      // Event details
      if (config.event) {
        const e = config.event;
        const deskDate = document.getElementById('desktopDateText');
        if (deskDate && e.dateDisplay) deskDate.innerHTML = `${e.dateDisplay} &bull; Jakarta`;
        const akadDate = document.getElementById('akadDateText');
        if (akadDate && e.dateDisplay) akadDate.textContent = e.dateDisplay;
        const akadTime = document.getElementById('akadTimeText');
        if (akadTime && e.akadTime) akadTime.textContent = e.akadTime;
        const akadPlace = document.getElementById('akadPlaceText');
        if (akadPlace && e.akadPlace) akadPlace.textContent = e.akadPlace;
        const akadAddress = document.getElementById('akadAddressText');
        if (akadAddress && e.akadAddress) akadAddress.textContent = e.akadAddress;

        const resepsiDate = document.getElementById('resepsiDateText');
        if (resepsiDate && e.dateDisplay) resepsiDate.textContent = e.dateDisplay;
        const resepsiTime = document.getElementById('resepsiTimeText');
        if (resepsiTime && e.resepsiTime) resepsiTime.textContent = e.resepsiTime;
        const resepsiPlace = document.getElementById('resepsiPlaceText');
        if (resepsiPlace && e.resepsiPlace) resepsiPlace.textContent = e.resepsiPlace;
        const resepsiAddress = document.getElementById('resepsiAddressText');
        if (resepsiAddress && e.resepsiAddress) resepsiAddress.textContent = e.resepsiAddress;

        const mapsBtn = document.getElementById('btnMapsLink');
        if (mapsBtn && e.mapsUrl) mapsBtn.href = e.mapsUrl;

        // Dynamic countdown target
        if (e.dateIso) {
          const customDate = new Date(e.dateIso).getTime();
          if (!isNaN(customDate)) {
            targetWeddingDate = customDate;
          }
        }
      }

      // Gift details
      if (config.gift) {
        const g = config.gift;
        if (g.bank1Name) {
          const b1Name = document.getElementById('bank1NameText');
          if (b1Name) b1Name.textContent = g.bank1Name;
        }
        if (g.bank1Number) {
          const b1Num = document.getElementById('bank1NumberText');
          if (b1Num) b1Num.textContent = g.bank1Number;
          const btn1 = document.getElementById('btnCopyBank1');
          if (btn1) btn1.setAttribute('onclick', `copyToClipboard('${g.bank1Number}', '${g.bank1Name || 'Bank 1'}')`);
        }
        if (g.bank1Holder) {
          const b1Hold = document.getElementById('bank1HolderText');
          if (b1Hold) b1Hold.textContent = `a.n ${g.bank1Holder}`;
        }

        if (g.bank2Name) {
          const b2Name = document.getElementById('bank2NameText');
          if (b2Name) b2Name.textContent = g.bank2Name;
        }
        if (g.bank2Number) {
          const b2Num = document.getElementById('bank2NumberText');
          if (b2Num) b2Num.textContent = g.bank2Number;
          const btn2 = document.getElementById('btnCopyBank2');
          if (btn2) btn2.setAttribute('onclick', `copyToClipboard('${g.bank2Number}', '${g.bank2Name || 'Bank 2'}')`);
        }
        if (g.bank2Holder) {
          const b2Hold = document.getElementById('bank2HolderText');
          if (b2Hold) b2Hold.textContent = `a.n ${g.bank2Holder}`;
        }

        if (g.physicalAddress) {
          const addr = document.getElementById('physicalAddressText');
          if (addr) addr.textContent = g.physicalAddress;
          const btnAddr = document.getElementById('btnCopyAddress');
          if (btnAddr) btnAddr.setAttribute('onclick', `copyToClipboard('${g.physicalAddress.replace(/'/g, "\\'")}', 'Alamat')`);
        }
      }

      // Gallery photos (Support dynamic uploads & custom URLs)
      if (config.gallery && Array.isArray(config.gallery) && config.gallery.length > 0) {
        const galleryGrid = document.getElementById('weddingGalleryGrid');
        if (galleryGrid) {
          galleryGrid.innerHTML = '';
          config.gallery.forEach((photoUrl, idx) => {
            const isFullWidth = (idx % 3 === 2);
            const item = document.createElement('div');
            item.className = `gallery-item cursor-pointer overflow-hidden rounded-xl shadow-md group relative h-48 ${isFullWidth ? 'col-span-2' : ''}`;
            item.setAttribute('data-full', photoUrl);
            item.innerHTML = `
              <img src="${photoUrl}" alt="Wedding Gallery ${idx + 1}" class="w-full h-full object-cover group-hover:scale-110 transition duration-500">
              <div class="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white">
                <i data-lucide="zoom-in" class="w-6 h-6"></i>
              </div>
            `;
            galleryGrid.appendChild(item);
          });
          if (window.lucide) lucide.createIcons();
        }
      }

      // Custom background override (if set by user)
      if (config.customBg && config.customBg.trim()) {
        const bgUrl = config.customBg.trim();
        if (desktopAmbient) {
          desktopAmbient.style.backgroundImage = `linear-gradient(to right, rgba(20,18,16,0.90), rgba(20,18,16,0.68)), url('${bgUrl}')`;
        }
        if (coverSectionEl) {
          coverSectionEl.style.backgroundImage = `linear-gradient(to bottom, rgba(28,25,23,0.50), rgba(28,25,23,0.88)), url('${bgUrl}')`;
        }
      }

      // Audio custom URL or SoundCloud setup
      if (config.audioUrl) {
        initAudioEngine(config.audioUrl);
      } else {
        initAudioEngine('https://assets.mixkit.co/music/preview/mixkit-wedding-waltz-piano-music-681.mp3');
      }
    } catch (err) {
      console.error('Error applying custom wedding config:', err);
    }
  }

  // 3. Audio Control (Dual Engine: HTML5 Audio & SoundCloud Widget)
  let isPlaying = false;
  let isSoundCloud = false;
  let scWidget = null;
  let scReady = false;
  let playRequested = false;

  function initAudioEngine(audioUrl) {
    if (!audioUrl) return;

    if (audioUrl.includes('soundcloud.com')) {
      isSoundCloud = true;
      const cleanUrl = audioUrl.split('?')[0]; // Strip tracking parameters
      const scFrame = document.getElementById('scPlayer');
      if (scFrame) {
        scFrame.src = `https://w.soundcloud.com/player/?url=${encodeURIComponent(cleanUrl)}&color=%23c5a880&auto_play=false&hide_related=true&show_comments=false&show_user=false&show_reposts=false&show_teaser=false&visual=false`;
        
        function setupSC() {
          if (window.SC && window.SC.Widget) {
            try {
              scWidget = SC.Widget(scFrame);
              scWidget.bind(SC.Widget.Events.READY, () => {
                scReady = true;
                if (playRequested) {
                  scWidget.play();
                }
              });
              scWidget.bind(SC.Widget.Events.PLAY, () => {
                isPlaying = true;
                if (musicDisc) musicDisc.classList.remove('paused');
                updateMusicIcon(true);
              });
              scWidget.bind(SC.Widget.Events.PAUSE, () => {
                isPlaying = false;
                if (musicDisc) musicDisc.classList.add('paused');
                updateMusicIcon(false);
              });
              scWidget.bind(SC.Widget.Events.FINISH, () => {
                if (scWidget) {
                  scWidget.seekTo(0);
                  scWidget.play();
                }
              });
            } catch (e) {
              console.error('Error initializing SoundCloud widget:', e);
            }
          } else {
            setTimeout(setupSC, 200);
          }
        }
        setupSC();
      }
    } else {
      isSoundCloud = false;
      if (audio) {
        audio.src = audioUrl;
      }
    }
  }

  function playAudio() {
    playRequested = true;
    if (isSoundCloud) {
      if (scWidget && scReady) {
        try {
          scWidget.play();
          isPlaying = true;
          if (musicDisc) musicDisc.classList.remove('paused');
          updateMusicIcon(true);
        } catch (err) {
          console.log('SoundCloud play error, fallback to HTML5:', err);
          playHtml5Audio();
        }
      } else {
        playHtml5Audio();
      }
    } else {
      playHtml5Audio();
    }
  }

  function playHtml5Audio() {
    if (audio) {
      audio.play().then(() => {
        isPlaying = true;
        if (musicDisc) musicDisc.classList.remove('paused');
        updateMusicIcon(true);
      }).catch(err => {
        console.log('Audio autoplay prevented by browser:', err);
      });
    }
  }

  function pauseAudio() {
    playRequested = false;
    if (isSoundCloud && scWidget) {
      try {
        scWidget.pause();
      } catch (err) {}
    }
    if (audio) {
      try { audio.pause(); } catch(e) {}
    }
    isPlaying = false;
    if (musicDisc) musicDisc.classList.add('paused');
    updateMusicIcon(false);
  }

  function updateMusicIcon(playing) {
    if (!floatingMusicBtn) return;
    const iconContainer = floatingMusicBtn.querySelector('.music-icon');
    if (iconContainer) {
      if (playing) {
        iconContainer.innerHTML = '<i data-lucide="disc-3" class="w-6 h-6 text-amber-900 animate-spin-slow"></i>';
      } else {
        iconContainer.innerHTML = '<i data-lucide="volume-x" class="w-6 h-6 text-stone-500"></i>';
      }
      if (window.lucide) lucide.createIcons();
    }
  }

  loadWeddingConfig();

  let isWeddingUnlocked = false;
  function unlockWeddingInvitation() {
    if (isWeddingUnlocked) return;
    isWeddingUnlocked = true;
    playAudio();

    if (floatingMusicBtn) {
      floatingMusicBtn.style.display = 'flex';
      floatingMusicBtn.classList.remove('hidden', 'pointer-events-none');
    }
    if (bottomNav) {
      bottomNav.style.display = 'flex';
      bottomNav.classList.remove('hidden', 'pointer-events-none', 'translate-y-full');
    }
    if (window.AOS) setTimeout(() => AOS.refresh(), 300);
  }

  if (btnBuka) {
    btnBuka.addEventListener('click', (e) => {
      if (e) e.preventDefault();
      unlockWeddingInvitation();
      const firstSection = document.getElementById('salamPembuka');
      if (firstSection) {
        firstSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  // Auto-unlock when user scrolls down past cover
  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
      unlockWeddingInvitation();
    }
  }, { passive: true });

  if (floatingMusicBtn) {
    floatingMusicBtn.addEventListener('click', () => {
      if (isPlaying) {
        pauseAudio();
      } else {
        playAudio();
      }
    });
  }

  // 4. Live Countdown Timer
  function updateCountdown() {
    const now = new Date().getTime();
    const distance = targetWeddingDate - now;

    if (distance < 0) {
      if (document.getElementById('days')) document.getElementById('days').textContent = '00';
      if (document.getElementById('hours')) document.getElementById('hours').textContent = '00';
      if (document.getElementById('minutes')) document.getElementById('minutes').textContent = '00';
      if (document.getElementById('seconds')) document.getElementById('seconds').textContent = '00';
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    const pad = (n) => String(n).padStart(2, '0');

    if (document.getElementById('days')) document.getElementById('days').textContent = pad(days);
    if (document.getElementById('hours')) document.getElementById('hours').textContent = pad(hours);
    if (document.getElementById('minutes')) document.getElementById('minutes').textContent = pad(minutes);
    if (document.getElementById('seconds')) document.getElementById('seconds').textContent = pad(seconds);
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);

  // 5. Copy Account Number & Toast
  window.copyToClipboard = function(text, label) {
    navigator.clipboard.writeText(text).then(() => {
      showToast(`Nomor Rekening ${label || ''} berhasil disalin!`);
    }).catch(err => {
      // Fallback
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      showToast(`Nomor Rekening ${label || ''} berhasil disalin!`);
    });
  };

  function showToast(message) {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toastMessage');
    if (!toast || !toastMessage) return;

    toastMessage.textContent = message;
    toast.classList.remove('opacity-0', 'pointer-events-none', '-translate-y-4');
    toast.classList.add('opacity-100', 'translate-y-0');

    setTimeout(() => {
      toast.classList.add('opacity-0', 'pointer-events-none', '-translate-y-4');
      toast.classList.remove('opacity-100', 'translate-y-0');
    }, 3200);
  }

  // 6. Lightbox Gallery
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const closeLightbox = document.getElementById('closeLightbox');

  document.addEventListener('click', (e) => {
    const item = e.target.closest('.gallery-item');
    if (item) {
      const src = item.getAttribute('data-full') || item.querySelector('img')?.src;
      if (src && lightbox && lightboxImg) {
        lightboxImg.src = src;
        lightbox.classList.remove('hidden');
        setTimeout(() => lightbox.classList.remove('opacity-0'), 20);
      }
    }
  });

  if (closeLightbox && lightbox) {
    closeLightbox.addEventListener('click', () => {
      lightbox.classList.add('opacity-0');
      setTimeout(() => lightbox.classList.add('hidden'), 300);
    });

    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) {
        lightbox.classList.add('opacity-0');
        setTimeout(() => lightbox.classList.add('hidden'), 300);
      }
    });
  }

  // 7. RSVP & Wishes System (LocalStorage backed)
  const defaultWishes = [
    {
      name: 'Rian & Istri',
      attendance: 'hadir',
      message: 'Selamat menempuh hidup baru! Semoga menjadi keluarga yang sakinah, mawaddah, dan warahmah. Aamiin.',
      time: '1 jam yang lalu'
    },
    {
      name: 'Anisa Maharani',
      attendance: 'hadir',
      message: 'Happy wedding yaa! Lancar sampai hari H, semoga bahagia dan langgeng selamanya.',
      time: '3 jam yang lalu'
    },
    {
      name: 'Budi Santoso',
      attendance: 'ragu',
      message: 'Selamat ya! Semoga dilancarkan semua prosesinya, Insya Allah diusahakan hadir.',
      time: 'Kemarin'
    }
  ];

  function getWishes() {
    const saved = localStorage.getItem('wedding_wishes');
    if (!saved) {
      localStorage.setItem('wedding_wishes', JSON.stringify(defaultWishes));
      return defaultWishes;
    }
    try {
      return JSON.parse(saved);
    } catch {
      return defaultWishes;
    }
  }

  function renderWishes() {
    const container = document.getElementById('wishesContainer');
    const wishesCount = document.getElementById('wishesCount');
    if (!container) return;

    const wishes = getWishes();
    if (wishesCount) wishesCount.textContent = `(${wishes.length})`;

    container.innerHTML = '';
    wishes.forEach(wish => {
      const card = document.createElement('div');
      card.className = 'p-4 rounded-xl bg-stone-50 border border-stone-200/80 shadow-sm flex flex-col gap-1.5 transition hover:shadow-md';

      let badgeHtml = '';
      if (wish.attendance === 'hadir') {
        badgeHtml = '<span class="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-full"><i data-lucide="check" class="w-3 h-3"></i> Hadir</span>';
      } else if (wish.attendance === 'tidak') {
        badgeHtml = '<span class="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-700 bg-rose-100/80 px-2 py-0.5 rounded-full"><i data-lucide="x" class="w-3 h-3"></i> Tidak Hadir</span>';
      } else {
        badgeHtml = '<span class="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700 bg-amber-100/80 px-2 py-0.5 rounded-full"><i data-lucide="help-circle" class="w-3 h-3"></i> Ragu-ragu</span>';
      }

      card.innerHTML = `
        <div class="flex items-center justify-between gap-2">
          <div class="flex items-center gap-2">
            <div class="w-8 h-8 rounded-full bg-amber-200/60 text-amber-900 font-bold flex items-center justify-center text-xs">
              ${wish.name.charAt(0).toUpperCase()}
            </div>
            <h4 class="font-semibold text-stone-800 text-sm">${escapeHtml(wish.name)}</h4>
          </div>
          ${badgeHtml}
        </div>
        <p class="text-xs text-stone-600 mt-1 leading-relaxed pl-10">${escapeHtml(wish.message)}</p>
        <span class="text-[10px] text-stone-400 self-end mt-1">${wish.time}</span>
      `;
      container.appendChild(card);
    });

    if (window.lucide) lucide.createIcons();
  }

  function escapeHtml(str) {
    return str.replace(/[&<>'"]/g, 
      tag => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        "'": '&#39;',
        '"': '&quot;'
      }[tag] || tag)
    );
  }

  const rsvpForm = document.getElementById('rsvpForm');
  if (rsvpForm) {
    rsvpForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('rsvpName').value.trim();
      const attendance = document.getElementById('rsvpStatus').value;
      const message = document.getElementById('rsvpMessage').value.trim();

      if (!name || !message) {
        alert('Mohon lengkapi nama dan ucapan Anda.');
        return;
      }

      const wishes = getWishes();
      wishes.unshift({
        name: name,
        attendance: attendance,
        message: message,
        time: 'Baru saja'
      });

      localStorage.setItem('wedding_wishes', JSON.stringify(wishes));
      renderWishes();
      rsvpForm.reset();
      showToast('Terima kasih atas konfirmasi & doa restu Anda!');
    });
  }

  renderWishes();

  // 8. Bottom Navigation Active Highlight on Scroll
  const sections = ['salamPembuka', 'mempelai', 'acara', 'galeri', 'wishesSection'];
  const navBtns = document.querySelectorAll('.nav-btn');

  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        const top = el.offsetTop - 200;
        if (window.scrollY >= top) {
          current = id;
        }
      }
    });

    navBtns.forEach(btn => {
      const target = btn.getAttribute('data-target');
      if (target === current) {
        btn.classList.add('text-amber-700', 'font-semibold');
        btn.classList.remove('text-stone-400');
      } else {
        btn.classList.remove('text-amber-700', 'font-semibold');
        btn.classList.add('text-stone-400');
      }
    });
  });
});
