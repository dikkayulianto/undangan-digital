/**
 * Inveet-style Wedding Builder Scripts
 */

const defaultWeddingConfig = {
  theme: 'champagne',
  groom: {
    nickname: 'Dimas',
    fullname: 'Dimas Arya Pratama, S.T.',
    father: 'Bpk. Bambang Sutrisno',
    mother: 'Ibu Sri Rahayu',
    order: 'Putra pertama dari Pasangan',
    instagram: 'dimasarya',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=500&q=80'
  },
  bride: {
    nickname: 'Sarah',
    fullname: 'Sarah Dania Putri, S.Ds.',
    father: 'Bpk. Hendra Gunawan',
    mother: 'Ibu Maya Novita',
    order: 'Putri kedua dari Pasangan',
    instagram: 'sarahdania',
    photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=500&q=80'
  },
  event: {
    dateDisplay: 'Sabtu, 28 Desember 2026',
    dateIso: '2026-12-28T08:00',
    akadTime: 'Pukul 08.00 - 10.00 WIB',
    akadPlace: 'Masjid Agung Al-Barkah',
    akadAddress: 'Jl. Veteran No. 45, Jakarta Pusat',
    resepsiTime: 'Pukul 11.00 - 14.00 WIB',
    resepsiPlace: 'Grand Ballroom Hotel Santika Premiere',
    resepsiAddress: 'Jl. Hayam Wuruk No. 125, Jakarta Barat',
    mapsUrl: 'https://maps.google.com/?q=Hotel+Santika+Premiere+Hayam+Wuruk+Jakarta'
  },
  gift: {
    bank1Name: 'BCA',
    bank1Number: '8801234567',
    bank1Holder: 'Dimas Arya Pratama',
    bank2Name: 'MANDIRI',
    bank2Number: '1370012345678',
    bank2Holder: 'Sarah Dania Putri',
    physicalAddress: 'Jl. Kemang Raya No. 18, RT 05/RW 02, Mampang Prapatan, Jakarta Selatan, 12730'
  },
  audioUrl: 'https://assets.mixkit.co/music/preview/mixkit-wedding-waltz-piano-music-681.mp3',
  gallery: [
    'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=85',
    'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1200&q=85',
    'https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=1200&q=85',
    'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=85',
    'https://images.unsplash.com/photo-1544078751-58fee2d8a03b?auto=format&fit=crop&w=1200&q=85'
  ]
};

/**
 * Client-side Image Compression via Canvas
 * Resizes and compresses images to JPEG DataURL to fit safely in browser storage.
 */
function compressImage(file, maxWidth = 1000, maxHeight = 1000, quality = 0.75) {
  return new Promise((resolve, reject) => {
    if (!file || !file.type.startsWith('image/')) {
      return reject(new Error('File yang dipilih bukan gambar yang valid.'));
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(dataUrl);
      };
      img.onerror = () => reject(new Error('Gagal memproses gambar.'));
      img.src = e.target.result;
    };
    reader.onerror = () => reject(new Error('Gagal membaca file dari perangkat.'));
    reader.readAsDataURL(file);
  });
}

function getConfig() {
  const saved = localStorage.getItem('wedding_config');
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      console.error('Error parsing config', e);
    }
  }
  return JSON.parse(JSON.stringify(defaultWeddingConfig));
}

function saveConfig(cfg) {
  try {
    localStorage.setItem('wedding_config', JSON.stringify(cfg));
    return true;
  } catch (err) {
    console.error('Storage error:', err);
    alert('Penyimpanan browser penuh. Coba kurangi jumlah foto atau gunakan ukuran yang lebih kecil.');
    return false;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  if (window.lucide) lucide.createIcons();

  // Tab navigation
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabPanes = document.querySelectorAll('.tab-pane');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.getAttribute('data-tab');
      tabBtns.forEach(b => {
        b.classList.remove('active', 'border-amber-600', 'text-amber-700', 'bg-amber-50/70');
        b.classList.add('border-transparent', 'text-stone-500');
      });
      tabPanes.forEach(pane => pane.classList.add('hidden'));

      btn.classList.add('active', 'border-amber-600', 'text-amber-700', 'bg-amber-50/70');
      btn.classList.remove('border-transparent', 'text-stone-500');
      const activePane = document.getElementById(target);
      if (activePane) activePane.classList.remove('hidden');
    });
  });

  // Populate Form Fields
  const config = getConfig();

  // Theme selection setup
  const selectedThemeInput = document.getElementById('selectedTheme');
  const themeCards = document.querySelectorAll('.theme-card');

  function applyThemeSelection(themeName) {
    if (selectedThemeInput) selectedThemeInput.value = themeName;
    themeCards.forEach(card => {
      const val = card.getAttribute('data-theme-val');
      const checkEl = card.querySelector('.theme-check');
      if (val === themeName) {
        card.classList.add('selected', 'border-amber-600');
        card.classList.remove('border-stone-200');
        if (checkEl) checkEl.classList.remove('hidden');
      } else {
        card.classList.remove('selected', 'border-amber-600');
        card.classList.add('border-stone-200');
        if (checkEl) checkEl.classList.add('hidden');
      }
    });
  }

  // Read URL parameters (from homepage simulator or pricing table)
  const urlParams = new URLSearchParams(window.location.search);
  const tierParam = urlParams.get('tier') || 'free';
  const groomParam = urlParams.get('groom');
  const brideParam = urlParams.get('bride');
  const themeParam = urlParams.get('theme');

  // Handle tier badge
  const tierBadge = document.getElementById('currentTierBadge');
  if (tierBadge) {
    if (tierParam === 'vip') {
      tierBadge.innerHTML = '<span class="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span><span>Paket Sapphire VIP</span>';
      tierBadge.className = 'inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-900 border border-amber-300 text-xs font-semibold shadow-sm';
    } else if (tierParam === 'silver') {
      tierBadge.innerHTML = '<span class="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span><span>Paket Silver</span>';
      tierBadge.className = 'inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-900 border border-blue-200 text-xs font-semibold shadow-sm';
    } else {
      tierBadge.innerHTML = '<span class="w-2 h-2 rounded-full bg-emerald-500"></span><span>Paket Uji Coba Gratis</span>';
      tierBadge.className = 'inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-stone-100 text-stone-700 border border-stone-300 text-xs font-medium';
    }
  }

  // Pre-fill names from simulator if provided
  if (groomParam) {
    if (!config.groom) config.groom = {};
    config.groom.nickname = decodeURIComponent(groomParam);
    config.groom.fullname = decodeURIComponent(groomParam);
  }
  if (brideParam) {
    if (!config.bride) config.bride = {};
    config.bride.nickname = decodeURIComponent(brideParam);
    config.bride.fullname = decodeURIComponent(brideParam);
  }
  if (themeParam && ['champagne', 'sage', 'midnight', 'royal'].includes(themeParam.toLowerCase())) {
    config.theme = themeParam.toLowerCase();
  }

  applyThemeSelection(config.theme || 'champagne');

  themeCards.forEach(card => {
    card.addEventListener('click', () => {
      const themeVal = card.getAttribute('data-theme-val');
      applyThemeSelection(themeVal);
      showToast(`Tema ${card.querySelector('h3').textContent} dipilih! Tekan Simpan Perubahan.`);
    });
  });

  // Background Cover Customization (Without people photos)
  const customBgInput = document.getElementById('customBgInput');
  const customBgFile = document.getElementById('customBgFile');
  const btnUploadCustomBg = document.getElementById('btnUploadCustomBg');
  const presetBgCards = document.querySelectorAll('.preset-bg-card');

  if (customBgInput) {
    customBgInput.value = config.customBg || '';
  }

  function updateActiveBgCard(val) {
    presetBgCards.forEach(card => {
      const bg = card.getAttribute('data-bg') || '';
      if (bg === val) {
        card.classList.add('border-amber-600', 'bg-amber-50/50');
        card.classList.remove('border-stone-200', 'bg-white');
      } else {
        card.classList.remove('border-amber-600', 'bg-amber-50/50');
        card.classList.add('border-stone-200', 'bg-white');
      }
    });
  }

  updateActiveBgCard(config.customBg || '');

  presetBgCards.forEach(card => {
    card.addEventListener('click', () => {
      const bg = card.getAttribute('data-bg') || '';
      if (customBgInput) customBgInput.value = bg;
      updateActiveBgCard(bg);
      showToast('Gaya background dipilih! Klik "Simpan Perubahan".');
    });
  });

  if (customBgInput) {
    customBgInput.addEventListener('input', () => {
      updateActiveBgCard(customBgInput.value.trim());
    });
  }

  if (btnUploadCustomBg && customBgFile) {
    btnUploadCustomBg.addEventListener('click', () => customBgFile.click());
    customBgFile.addEventListener('change', async () => {
      const file = customBgFile.files[0];
      if (file) {
        try {
          showToast('Mengompresi background kustom...');
          const dataUrl = await compressImage(file, 1600, 1600, 0.80);
          if (customBgInput) customBgInput.value = dataUrl;
          updateActiveBgCard(dataUrl);
          showToast('Background kustom berhasil diunggah!');
        } catch (err) {
          alert(err.message || 'Gagal memproses gambar.');
        }
      }
    });
  }

  // Groom
  document.getElementById('groomNickname').value = config.groom?.nickname || '';
  document.getElementById('groomFullname').value = config.groom?.fullname || '';
  document.getElementById('groomFather').value = config.groom?.father || '';
  document.getElementById('groomMother').value = config.groom?.mother || '';
  document.getElementById('groomOrder').value = config.groom?.order || '';
  document.getElementById('groomInstagram').value = config.groom?.instagram || '';
  // Groom Photo Preview Setup
  const groomPhotoInput = document.getElementById('groomPhoto');
  const groomPhotoPreview = document.getElementById('groomPhotoPreview');
  const groomPhotoFile = document.getElementById('groomPhotoFile');
  const btnUploadGroomPhoto = document.getElementById('btnUploadGroomPhoto');

  if (groomPhotoInput && groomPhotoPreview) {
    if (config.groom?.photo) {
      groomPhotoInput.value = config.groom.photo;
      groomPhotoPreview.src = config.groom.photo;
    }
    groomPhotoInput.addEventListener('input', () => {
      if (groomPhotoInput.value.trim()) groomPhotoPreview.src = groomPhotoInput.value.trim();
    });
  }

  if (btnUploadGroomPhoto && groomPhotoFile) {
    btnUploadGroomPhoto.addEventListener('click', () => groomPhotoFile.click());
    groomPhotoFile.addEventListener('change', async () => {
      const file = groomPhotoFile.files[0];
      if (file) {
        try {
          showToast('Mengompresi foto mempelai pria...');
          const dataUrl = await compressImage(file, 800, 800, 0.75);
          groomPhotoInput.value = dataUrl;
          groomPhotoPreview.src = dataUrl;
          showToast('Foto mempelai pria berhasil diunggah!');
        } catch (err) {
          alert(err.message || 'Gagal memproses foto.');
        }
      }
    });
  }

  // Bride Photo Preview Setup
  const bridePhotoInput = document.getElementById('bridePhoto');
  const bridePhotoPreview = document.getElementById('bridePhotoPreview');
  const bridePhotoFile = document.getElementById('bridePhotoFile');
  const btnUploadBridePhoto = document.getElementById('btnUploadBridePhoto');

  if (bridePhotoInput && bridePhotoPreview) {
    if (config.bride?.photo) {
      bridePhotoInput.value = config.bride.photo;
      bridePhotoPreview.src = config.bride.photo;
    }
    bridePhotoInput.addEventListener('input', () => {
      if (bridePhotoInput.value.trim()) bridePhotoPreview.src = bridePhotoInput.value.trim();
    });
  }

  if (btnUploadBridePhoto && bridePhotoFile) {
    btnUploadBridePhoto.addEventListener('click', () => bridePhotoFile.click());
    bridePhotoFile.addEventListener('change', async () => {
      const file = bridePhotoFile.files[0];
      if (file) {
        try {
          showToast('Mengompresi foto mempelai wanita...');
          const dataUrl = await compressImage(file, 800, 800, 0.75);
          bridePhotoInput.value = dataUrl;
          bridePhotoPreview.src = dataUrl;
          showToast('Foto mempelai wanita berhasil diunggah!');
        } catch (err) {
          alert(err.message || 'Gagal memproses foto.');
        }
      }
    });
  }

  // ================= GALLERY MANAGEMENT =================
  let galleryPhotos = (config.gallery && Array.isArray(config.gallery) && config.gallery.length > 0)
    ? [...config.gallery]
    : [...defaultWeddingConfig.gallery];

  const galleryPreviewGrid = document.getElementById('galleryPreviewGrid');
  const galleryCountBadge = document.getElementById('galleryCountBadge');
  const galleryFileInput = document.getElementById('galleryFileInput');
  const btnTriggerGalleryUpload = document.getElementById('btnTriggerGalleryUpload');
  const galleryUrlInput = document.getElementById('galleryUrlInput');
  const btnAddGalleryUrl = document.getElementById('btnAddGalleryUrl');
  const btnClearAllGallery = document.getElementById('btnClearAllGallery');

  function renderGalleryGrid() {
    if (!galleryPreviewGrid) return;
    galleryPreviewGrid.innerHTML = '';

    if (galleryCountBadge) {
      galleryCountBadge.textContent = `${galleryPhotos.length} Foto`;
    }

    if (galleryPhotos.length === 0) {
      galleryPreviewGrid.innerHTML = `
        <div class="col-span-full py-8 text-center text-stone-400 bg-stone-50 rounded-2xl border border-dashed border-stone-200">
          <p class="text-xs">Belum ada foto galeri. Silakan upload foto dari HP atau PC Anda.</p>
        </div>
      `;
      return;
    }

    galleryPhotos.forEach((src, idx) => {
      const card = document.createElement('div');
      card.className = 'relative group rounded-2xl overflow-hidden shadow-sm border border-stone-200 bg-stone-100 aspect-square';
      card.innerHTML = `
        <img src="${src}" alt="Foto Galeri ${idx + 1}" class="w-full h-full object-cover group-hover:scale-105 transition duration-300">
        <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 opacity-0 group-hover:opacity-100 transition flex flex-col justify-between p-2">
          <div class="flex justify-between items-center">
            <span class="px-2 py-0.5 rounded-md bg-black/60 text-white text-[10px] font-bold">#${idx + 1}</span>
            <button type="button" class="btn-delete-photo w-7 h-7 rounded-full bg-red-600 hover:bg-red-700 text-white flex items-center justify-center shadow transition" data-idx="${idx}" title="Hapus Foto">
              <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
            </button>
          </div>
          <span class="text-[10px] text-white/80 truncate">Tersimpan</span>
        </div>
      `;
      galleryPreviewGrid.appendChild(card);
    });

    if (window.lucide) lucide.createIcons();

    // Bind delete buttons
    galleryPreviewGrid.querySelectorAll('.btn-delete-photo').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const delIdx = parseInt(btn.getAttribute('data-idx'), 10);
        galleryPhotos.splice(delIdx, 1);
        renderGalleryGrid();
        showToast('Foto berhasil dihapus.');
      });
    });
  }

  renderGalleryGrid();

  // Upload Multiple Files
  if (btnTriggerGalleryUpload && galleryFileInput) {
    btnTriggerGalleryUpload.addEventListener('click', () => galleryFileInput.click());
    galleryFileInput.addEventListener('change', async () => {
      const files = Array.from(galleryFileInput.files);
      if (files.length === 0) return;

      showToast(`Sedang memproses & mengompresi ${files.length} foto...`);

      let successCount = 0;
      for (const file of files) {
        try {
          const dataUrl = await compressImage(file, 1000, 1000, 0.75);
          galleryPhotos.push(dataUrl);
          successCount++;
        } catch (err) {
          console.error('Error compressing gallery photo:', err);
        }
      }

      galleryFileInput.value = ''; // Reset input
      renderGalleryGrid();
      showToast(`${successCount} foto berhasil diunggah ke galeri!`);
    });
  }

  // Add via URL
  if (btnAddGalleryUrl && galleryUrlInput) {
    btnAddGalleryUrl.addEventListener('click', () => {
      const url = galleryUrlInput.value.trim();
      if (!url) {
        alert('Silakan masukkan link URL gambar terlebih dahulu.');
        return;
      }
      galleryPhotos.push(url);
      galleryUrlInput.value = '';
      renderGalleryGrid();
      showToast('Foto dari link berhasil ditambahkan ke galeri!');
    });
  }

  // Clear All Gallery
  if (btnClearAllGallery) {
    btnClearAllGallery.addEventListener('click', () => {
      if (confirm('Yakin ingin menghapus seluruh foto galeri?')) {
        galleryPhotos = [];
        renderGalleryGrid();
        showToast('Semua foto galeri telah dihapus.');
      }
    });
  }

  // Event
  document.getElementById('eventDateDisplay').value = config.event?.dateDisplay || '';
  document.getElementById('eventDateIso').value = config.event?.dateIso || '';
  document.getElementById('akadTime').value = config.event?.akadTime || '';
  document.getElementById('akadPlace').value = config.event?.akadPlace || '';
  document.getElementById('akadAddress').value = config.event?.akadAddress || '';
  document.getElementById('resepsiTime').value = config.event?.resepsiTime || '';
  document.getElementById('resepsiPlace').value = config.event?.resepsiPlace || '';
  document.getElementById('resepsiAddress').value = config.event?.resepsiAddress || '';
  document.getElementById('mapsUrl').value = config.event?.mapsUrl || '';

  // Gift
  document.getElementById('bank1Name').value = config.gift?.bank1Name || '';
  document.getElementById('bank1Number').value = config.gift?.bank1Number || '';
  document.getElementById('bank1Holder').value = config.gift?.bank1Holder || '';
  document.getElementById('bank2Name').value = config.gift?.bank2Name || '';
  document.getElementById('bank2Number').value = config.gift?.bank2Number || '';
  document.getElementById('bank2Holder').value = config.gift?.bank2Holder || '';
  document.getElementById('physicalAddress').value = config.gift?.physicalAddress || '';

  // Audio Handler (SoundCloud & MP3 Preview)
  const audioUrlInput = document.getElementById('audioUrl');
  const audioFormatBadge = document.getElementById('audioFormatBadge');
  const btnTestAudio = document.getElementById('btnTestAudio');
  const btnTestAudioText = document.getElementById('btnTestAudioText');
  const builderTestAudio = document.getElementById('builderTestAudio');
  const builderScPlayer = document.getElementById('builderScPlayer');
  let builderScWidget = null;
  let isTestingAudio = false;

  function updateAudioFormatBadge(url) {
    if (!audioFormatBadge) return;
    const clean = (url || '').trim().toLowerCase();
    if (!clean) {
      audioFormatBadge.className = 'hidden';
      return;
    }

    if (clean.includes('soundcloud.com')) {
      audioFormatBadge.textContent = '🎵 SoundCloud Track (Didukung Penuh)';
      audioFormatBadge.className = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-orange-100 text-orange-800 border border-orange-300';
    } else if (clean.endsWith('.mp3') || clean.includes('.mp3?') || clean.endsWith('.m4a') || clean.endsWith('.ogg')) {
      audioFormatBadge.textContent = '🎵 Direct Audio MP3';
      audioFormatBadge.className = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300';
    } else {
      audioFormatBadge.textContent = '🎵 URL Audio Online';
      audioFormatBadge.className = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-300';
    }
  }

  function stopAllTestAudio() {
    isTestingAudio = false;
    if (builderTestAudio) {
      builderTestAudio.pause();
      builderTestAudio.currentTime = 0;
    }
    if (builderScWidget && typeof builderScWidget.pause === 'function') {
      try {
        builderScWidget.pause();
      } catch (e) {}
    }
    if (btnTestAudioText) btnTestAudioText.textContent = 'Tes Putar';
    if (btnTestAudio) {
      const icon = btnTestAudio.querySelector('i');
      if (icon) icon.setAttribute('data-lucide', 'play');
      if (window.lucide) lucide.createIcons();
    }
  }

  if (audioUrlInput) {
    audioUrlInput.value = config.audioUrl || '';
    updateAudioFormatBadge(audioUrlInput.value);

    audioUrlInput.addEventListener('input', () => {
      stopAllTestAudio();
      updateAudioFormatBadge(audioUrlInput.value);
    });
  }

  // Preset song buttons
  document.querySelectorAll('.preset-song-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const url = btn.getAttribute('data-url');
      if (url && audioUrlInput) {
        stopAllTestAudio();
        audioUrlInput.value = url;
        updateAudioFormatBadge(url);
        showToast('Musik dipilih! Klik "Tes Putar" untuk mendengarkan atau "Simpan Perubahan".');
      }
    });
  });

  // Test button
  if (btnTestAudio && audioUrlInput) {
    btnTestAudio.addEventListener('click', () => {
      const targetUrl = audioUrlInput.value.trim();
      if (!targetUrl) {
        alert('Silakan masukkan link musik terlebih dahulu.');
        return;
      }

      if (isTestingAudio) {
        stopAllTestAudio();
        return;
      }

      const isSoundCloud = targetUrl.toLowerCase().includes('soundcloud.com');

      if (isSoundCloud) {
        // Init SoundCloud test widget
        if (builderScPlayer) {
          const cleanUrl = targetUrl.split('?')[0];
          const embedSrc = `https://w.soundcloud.com/player/?url=${encodeURIComponent(cleanUrl)}&auto_play=false&hide_related=true&show_comments=false&show_user=false&show_reposts=false&show_teaser=false&visual=false`;
          
          if (!builderScPlayer.src || !builderScPlayer.src.includes(encodeURIComponent(cleanUrl))) {
            builderScPlayer.src = embedSrc;
          }

          if (window.SC && window.SC.Widget) {
            builderScWidget = window.SC.Widget(builderScPlayer);
            builderScWidget.bind(window.SC.Widget.Events.READY, () => {
              builderScWidget.play();
            });
            builderScWidget.bind(window.SC.Widget.Events.PLAY, () => {
              isTestingAudio = true;
              if (btnTestAudioText) btnTestAudioText.textContent = 'Berhenti Putar';
              const icon = btnTestAudio.querySelector('i');
              if (icon) icon.setAttribute('data-lucide', 'square');
              if (window.lucide) lucide.createIcons();
            });
            builderScWidget.bind(window.SC.Widget.Events.PAUSE, () => {
              stopAllTestAudio();
            });
            builderScWidget.bind(window.SC.Widget.Events.FINISH, () => {
              stopAllTestAudio();
            });
            try {
              builderScWidget.play();
            } catch(e) {}
          } else {
            alert('Widget SoundCloud sedang dimuat, silakan coba 2 detik lagi.');
          }
        }
      } else {
        // Direct MP3
        if (builderTestAudio) {
          builderTestAudio.src = targetUrl;
          builderTestAudio.play().then(() => {
            isTestingAudio = true;
            if (btnTestAudioText) btnTestAudioText.textContent = 'Berhenti Putar';
            const icon = btnTestAudio.querySelector('i');
            if (icon) icon.setAttribute('data-lucide', 'square');
            if (window.lucide) lucide.createIcons();
          }).catch(err => {
            console.error('Audio play error:', err);
            alert('Gagal memutar audio. Pastikan URL valid dan dapat diakses publik.');
          });

          builderTestAudio.onended = () => {
            stopAllTestAudio();
          };
        }
      }
    });
  }

  // Handle Form Submit
  const builderForm = document.getElementById('builderForm');
  builderForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const newConfig = {
      theme: selectedThemeInput ? selectedThemeInput.value : 'champagne',
      groom: {
        nickname: document.getElementById('groomNickname').value.trim(),
        fullname: document.getElementById('groomFullname').value.trim(),
        father: document.getElementById('groomFather').value.trim(),
        mother: document.getElementById('groomMother').value.trim(),
        order: document.getElementById('groomOrder').value.trim(),
        instagram: document.getElementById('groomInstagram').value.trim().replace('@', ''),
        photo: document.getElementById('groomPhoto').value.trim()
      },
      bride: {
        nickname: document.getElementById('brideNickname').value.trim(),
        fullname: document.getElementById('brideFullname').value.trim(),
        father: document.getElementById('brideFather').value.trim(),
        mother: document.getElementById('brideMother').value.trim(),
        order: document.getElementById('brideOrder').value.trim(),
        instagram: document.getElementById('brideInstagram').value.trim().replace('@', ''),
        photo: document.getElementById('bridePhoto').value.trim()
      },
      gallery: galleryPhotos,
      event: {
        dateDisplay: document.getElementById('eventDateDisplay').value.trim(),
        dateIso: document.getElementById('eventDateIso').value.trim(),
        akadTime: document.getElementById('akadTime').value.trim(),
        akadPlace: document.getElementById('akadPlace').value.trim(),
        akadAddress: document.getElementById('akadAddress').value.trim(),
        resepsiTime: document.getElementById('resepsiTime').value.trim(),
        resepsiPlace: document.getElementById('resepsiPlace').value.trim(),
        resepsiAddress: document.getElementById('resepsiAddress').value.trim(),
        mapsUrl: document.getElementById('mapsUrl').value.trim()
      },
      gift: {
        bank1Name: document.getElementById('bank1Name').value.trim(),
        bank1Number: document.getElementById('bank1Number').value.trim(),
        bank1Holder: document.getElementById('bank1Holder').value.trim(),
        bank2Name: document.getElementById('bank2Name').value.trim(),
        bank2Number: document.getElementById('bank2Number').value.trim(),
        bank2Holder: document.getElementById('bank2Holder').value.trim(),
        physicalAddress: document.getElementById('physicalAddress').value.trim()
      },
      audioUrl: document.getElementById('audioUrl').value.trim(),
      customBg: document.getElementById('customBgInput')?.value?.trim() || ''
    };

    if (saveConfig(newConfig)) {
      showToast('Perubahan berhasil disimpan! Foto dan data undangan telah diperbarui.');
    }
  });

  // Handle Reset
  const btnReset = document.getElementById('btnReset');
  if (btnReset) {
    btnReset.addEventListener('click', () => {
      if (confirm('Apakah Anda yakin ingin mengembalikan semua data dan tema ke pengaturan default?')) {
        saveConfig(defaultWeddingConfig);
        location.reload();
      }
    });
  }

  // Toast Function
  function showToast(msg) {
    const toast = document.getElementById('builderToast');
    const toastMsg = document.getElementById('builderToastMsg');
    if (toast && toastMsg) {
      toastMsg.textContent = msg;
      toast.classList.remove('opacity-0', 'pointer-events-none', '-translate-y-4');
      toast.classList.add('opacity-100', 'translate-y-0');

      setTimeout(() => {
        toast.classList.add('opacity-0', 'pointer-events-none', '-translate-y-4');
        toast.classList.remove('opacity-100', 'translate-y-0');
      }, 3500);
    }
  }

  // 4. Guest Invitation & WhatsApp Link Generator
  const guestInput = document.getElementById('guestInput');
  const btnGenerateLink = document.getElementById('btnGenerateLink');
  const generatedResultBox = document.getElementById('generatedResultBox');
  const generatedUrlInput = document.getElementById('generatedUrlInput');
  const generatedWaPreview = document.getElementById('generatedWaPreview');
  const btnCopyUrl = document.getElementById('btnCopyUrl');
  const btnCopyWaText = document.getElementById('btnCopyWaText');
  const btnOpenWa = document.getElementById('btnOpenWa');

  function generateGuestInvitation() {
    const guestName = guestInput.value.trim();
    if (!guestName) {
      alert('Silakan masukkan nama tamu terlebih dahulu.');
      return;
    }

    const currentCfg = getConfig();
    const groomNick = currentCfg.groom?.nickname || 'Dimas';
    const brideNick = currentCfg.bride?.nickname || 'Sarah';
    const activeTheme = currentCfg.theme || 'champagne';

    // Base URL resolution
    let base = window.location.href.split('builder.html')[0];
    if (!base.endsWith('/')) base += '/';
    
    let fullInvitationUrl = `${base}invitation.html?to=${encodeURIComponent(guestName)}`;
    if (activeTheme !== 'champagne') {
      fullInvitationUrl += `&theme=${encodeURIComponent(activeTheme)}`;
    }

    // WhatsApp Message Template
    const waMessage = 
`Kepada Yth.
Bapak/Ibu/Saudara/i *${guestName}*

Tanpa mengurangi rasa hormat, perkenankan kami mengundang Bapak/Ibu/Saudara/i untuk menghadiri hari bahagia pernikahan kami:

*${groomNick} & ${brideNick}*

Berikut tautan undangan digital kami untuk melihat detail acara:
${fullInvitationUrl}

Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu.

Terima kasih.
Salam hangat,
*${groomNick} & ${brideNick}*`;

    generatedUrlInput.value = fullInvitationUrl;
    generatedWaPreview.value = waMessage;
    generatedResultBox.classList.remove('hidden');

    // Setup direct WhatsApp link
    const waEncoded = encodeURIComponent(waMessage);
    btnOpenWa.href = `https://api.whatsapp.com/send?text=${waEncoded}`;
    btnOpenWa.target = '_blank';
  }

  if (btnGenerateLink) {
    btnGenerateLink.addEventListener('click', generateGuestInvitation);
  }

  if (btnCopyUrl) {
    btnCopyUrl.addEventListener('click', () => {
      navigator.clipboard.writeText(generatedUrlInput.value).then(() => {
        showToast('Tautan undangan berhasil disalin!');
      });
    });
  }

  if (btnCopyWaText) {
    btnCopyWaText.addEventListener('click', () => {
      navigator.clipboard.writeText(generatedWaPreview.value).then(() => {
        showToast('Teks pesan WhatsApp berhasil disalin!');
      });
    });
  }
});
