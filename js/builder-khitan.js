/**
 * Script Dashboard Editor Undangan Walimatul Khitan
 */

const defaultKhitanConfig = {
  childNickname: 'Rendy',
  childFullname: 'Irendy Wijaya Saputra',
  childOrder: 'Putra Kedua dari pasangan:',
  father: 'Bpk. Wangkis Suwito',
  mother: 'Ibu Susi Dwi jayanti',
  photo: 'images/khitan/rendy-profile.jpg',
  eventDateDisplay: 'Senin, 16 November 2026',
  eventDateIso: '2026-11-16T10:00',
  eventTime: 'Pukul 10.00 WIB',
  eventPlace: 'Rumah Hajat',
  eventAddress: 'Jl. Mangga No. 12 RT 03 RW 01 Balapulang Kulon',
  mapsUrl: 'https://maps.app.goo.gl/FNjBDJMcNzKmvb6B7',
  bank1Name: 'Dana',
  bank1Number: '082134966499',
  bank1Holder: 'Susi Dwi Jayanti (Ibu)',
  physicalAddress: 'Jl. Mangga No. 12 RT 03 RW 01 Balapulang Kulon',
  audioUrl: 'audio/qalbi.mp3',
  gallery: [
    'images/khitan/rendy-galeri-1.jpg',
    'images/khitan/rendy-galeri-2.jpg',
    'images/khitan/rendy-galeri-3.jpg',
    'images/khitan/rendy-galeri-4.jpg',
    'images/khitan/rendy-galeri-5.jpg'
  ],
  theme: 'cream'
};

/**
 * Client-side Image Compression via Canvas
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

// Upload helper to Vercel Serverless Function / Cloud CDN
async function uploadImageToServer(dataUrl, filename) {
  try {
    const res = await fetch('/api/upload', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image: dataUrl, filename: filename || `khitan-${Date.now()}.jpg` })
    });
    if (res.ok) {
      const data = await res.json();
      if (data && data.url) {
        return data.url;
      }
    }
  } catch (err) {
    console.warn('API upload tidak tersedia, menggunakan data lokal:', err);
  }
  return dataUrl;
}

// Encode config into compact URL parameter so guests can view on any device
function encodeKhitanConfigForUrl(cfg) {
  const compact = {
    th: cfg.theme || 'cream',
    nn: cfg.childNickname || '',
    fn: cfg.childFullname || '',
    o: cfg.childOrder || '',
    f: cfg.father || '',
    m: cfg.mother || '',
    p: (cfg.photo && cfg.photo.startsWith('http')) ? cfg.photo : '',
    d: cfg.eventDateDisplay || '',
    di: cfg.eventDateIso || '',
    t: cfg.eventTime || '',
    pl: cfg.eventPlace || '',
    a: cfg.eventAddress || '',
    mu: cfg.mapsUrl || '',
    b1n: cfg.bank1Name || '',
    b1no: cfg.bank1Number || '',
    b1h: cfg.bank1Holder || '',
    pa: cfg.physicalAddress || '',
    au: cfg.audioUrl || '',
    bg: (cfg.customBg && cfg.customBg.startsWith('http')) ? cfg.customBg : ''
  };
  try {
    const jsonStr = JSON.stringify(compact);
    return btoa(unescape(encodeURIComponent(jsonStr)))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
  } catch(e) {
    console.error('Error encoding khitan config:', e);
    return '';
  }
}

function getKhitanConfig() {
  const saved = localStorage.getItem('khitan_config');
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      if (parsed.photo && parsed.photo.includes('unsplash.com')) delete parsed.photo;
      if (parsed.gallery && Array.isArray(parsed.gallery) && parsed.gallery.some(p => p.includes('unsplash.com'))) delete parsed.gallery;
      return Object.assign({}, defaultKhitanConfig, parsed);
    } catch (e) {
      console.error('Error parsing khitan config', e);
    }
  }
  return JSON.parse(JSON.stringify(defaultKhitanConfig));
}

function saveKhitanConfig(cfg) {
  try {
    localStorage.setItem('khitan_config', JSON.stringify(cfg));
    return true;
  } catch (err) {
    console.error('Khitan storage error:', err);
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
        b.classList.remove('active', 'border-amber-600', 'text-amber-900', 'bg-amber-50/70', 'border-emerald-600', 'text-emerald-800', 'bg-emerald-50/70');
        b.classList.add('border-transparent', 'text-stone-500');
      });
      tabPanes.forEach(pane => pane.classList.add('hidden'));

      btn.classList.add('active', 'border-amber-600', 'text-amber-900', 'bg-amber-50/70');
      btn.classList.remove('border-transparent', 'text-stone-500');
      const activePane = document.getElementById(target);
      if (activePane) activePane.classList.remove('hidden');
    });
  });

  // Populate Form Fields
  const config = getKhitanConfig();

  // Bright Theme Selection
  const themeInput = document.getElementById('selectedKhitanTheme');
  const themeCards = document.querySelectorAll('.theme-khitan-card');

  function updateKhitanThemeUI(selected) {
    if (themeInput) themeInput.value = selected;
    themeCards.forEach(card => {
      const val = card.getAttribute('data-theme-val');
      const check = card.querySelector('.theme-khitan-check');
      if (val === selected) {
        card.classList.add('border-amber-600', 'selected');
        card.classList.remove('border-stone-200');
        if (check) check.classList.remove('hidden');
      } else {
        card.classList.remove('border-amber-600', 'selected');
        card.classList.add('border-stone-200');
        if (check) check.classList.add('hidden');
      }
    });
  }

  const currentTheme = config.theme || 'cream';
  updateKhitanThemeUI(currentTheme);

  themeCards.forEach(card => {
    card.addEventListener('click', () => {
      const val = card.getAttribute('data-theme-val');
      updateKhitanThemeUI(val);
      const cur = getKhitanConfig();
      cur.theme = val;
      saveKhitanConfig(cur);
      const themeLabel = val === 'cream' ? 'Warm Cream & Gold' : (val === 'sage' ? 'Sage Terang' : 'Royal Ivory');
      showToast(`Tema terang "${themeLabel}" dipilih!`);
    });
  });

  // Child & Parents
  document.getElementById('childNickname').value = config.childNickname || '';
  document.getElementById('childFullname').value = config.childFullname || '';
  document.getElementById('childOrder').value = config.childOrder || '';
  document.getElementById('fatherName').value = config.father || '';
  document.getElementById('motherName').value = config.mother || '';

  // Child Photo Setup
  const childPhotoInput = document.getElementById('childPhoto');
  const childPhotoPreview = document.getElementById('childPhotoPreview');
  const childPhotoFile = document.getElementById('childPhotoFile');
  const btnUploadChildPhoto = document.getElementById('btnUploadChildPhoto');

  // Check direct photo key
  const savedDirectChildPhoto = localStorage.getItem('khitan_child_photo');
  if (savedDirectChildPhoto && childPhotoInput && childPhotoPreview) {
    childPhotoInput.value = savedDirectChildPhoto;
    childPhotoPreview.src = savedDirectChildPhoto;
  } else if (childPhotoInput && childPhotoPreview && config.photo) {
    childPhotoInput.value = config.photo;
    childPhotoPreview.src = config.photo;
  }

  if (childPhotoInput && childPhotoPreview) {
    childPhotoInput.addEventListener('input', () => {
      const val = childPhotoInput.value.trim();
      if (val) {
        childPhotoPreview.src = val;
        try {
          localStorage.setItem('khitan_child_photo', val);
          const cur = getKhitanConfig();
          cur.photo = val;
          saveKhitanConfig(cur);
        } catch(e) {}
      }
    });
  }

  if (btnUploadChildPhoto && childPhotoFile) {
    btnUploadChildPhoto.addEventListener('click', () => childPhotoFile.click());
    childPhotoFile.addEventListener('change', async () => {
      const file = childPhotoFile.files[0];
      if (file) {
        try {
          showToast('Mengompresi & menyiapkan foto ananda...');
          const dataUrl = await compressImage(file, 600, 600, 0.72);
          childPhotoPreview.src = dataUrl;
          childPhotoInput.value = dataUrl;
          
          showToast('Mengunggah foto ke Cloud CDN...');
          const cloudUrl = await uploadImageToServer(dataUrl, file.name);
          if (cloudUrl && cloudUrl.startsWith('http')) {
            childPhotoInput.value = cloudUrl;
            childPhotoPreview.src = cloudUrl;
            localStorage.setItem('khitan_child_photo', cloudUrl);
            const cur = getKhitanConfig();
            cur.photo = cloudUrl;
            saveKhitanConfig(cur);
            showToast('Foto berhasil diunggah ke CDN & disimpan!');
          } else {
            localStorage.setItem('khitan_child_photo', dataUrl);
            const cur = getKhitanConfig();
            cur.photo = dataUrl;
            saveKhitanConfig(cur);
            showToast('Foto berhasil disimpan secara lokal!');
          }
        } catch (err) {
          alert(err.message || 'Gagal memproses foto.');
        }
      }
    });
  }

  // ================= BACKGROUND COVER KHITAN MANAGEMENT =================
  const customBgInput = document.getElementById('customBgInput');
  const customBgFile = document.getElementById('customBgFile');
  const btnUploadCustomBg = document.getElementById('btnUploadCustomBg');
  const presetKhitanBgCards = document.querySelectorAll('.preset-khitan-bg-card');

  if (customBgInput) {
    customBgInput.value = config.customBg || '';
  }

  function updateActiveKhitanBgCard(val) {
    presetKhitanBgCards.forEach(card => {
      const bg = card.getAttribute('data-bg') || '';
      if (bg === val) {
        card.classList.add('border-emerald-600', 'bg-emerald-50/50');
        card.classList.remove('border-stone-200', 'bg-white');
      } else {
        card.classList.remove('border-emerald-600', 'bg-emerald-50/50');
        card.classList.add('border-stone-200', 'bg-white');
      }
    });
  }

  updateActiveKhitanBgCard(config.customBg || '');

  presetKhitanBgCards.forEach(card => {
    card.addEventListener('click', () => {
      const bg = card.getAttribute('data-bg') || '';
      if (customBgInput) customBgInput.value = bg;
      updateActiveKhitanBgCard(bg);
      showToast('Gaya background khitan dipilih! Klik "Simpan Perubahan".');
    });
  });

  if (customBgInput) {
    customBgInput.addEventListener('input', () => {
      updateActiveKhitanBgCard(customBgInput.value.trim());
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
          showToast('Mengunggah background ke Cloud CDN...');
          const cloudUrl = await uploadImageToServer(dataUrl, file.name);
          const finalBg = (cloudUrl && cloudUrl.startsWith('http')) ? cloudUrl : dataUrl;
          if (customBgInput) customBgInput.value = finalBg;
          updateActiveKhitanBgCard(finalBg);
          const cur = getKhitanConfig();
          cur.customBg = finalBg;
          saveKhitanConfig(cur);
          showToast('Background kustom khitan berhasil disimpan!');
        } catch (err) {
          alert(err.message || 'Gagal memproses gambar.');
        }
      }
    });
  }

  // ================= GALLERY KHITAN MANAGEMENT =================
  let khitanGalleryPhotos = (config.gallery && Array.isArray(config.gallery) && config.gallery.length > 0)
    ? [...config.gallery]
    : [...defaultKhitanConfig.gallery];

  const khitanGalleryPreviewGrid = document.getElementById('khitanGalleryPreviewGrid');
  const khitanGalleryCountBadge = document.getElementById('khitanGalleryCountBadge');
  const khitanGalleryFileInput = document.getElementById('khitanGalleryFileInput');
  const btnTriggerKhitanGalleryUpload = document.getElementById('btnTriggerKhitanGalleryUpload');
  const khitanGalleryUrlInput = document.getElementById('khitanGalleryUrlInput');
  const btnAddKhitanGalleryUrl = document.getElementById('btnAddKhitanGalleryUrl');
  const btnClearAllKhitanGallery = document.getElementById('btnClearAllKhitanGallery');

  function renderKhitanGalleryGrid() {
    if (!khitanGalleryPreviewGrid) return;
    khitanGalleryPreviewGrid.innerHTML = '';

    if (khitanGalleryCountBadge) {
      khitanGalleryCountBadge.textContent = `${khitanGalleryPhotos.length} Foto`;
    }

    if (khitanGalleryPhotos.length === 0) {
      khitanGalleryPreviewGrid.innerHTML = `
        <div class="col-span-full py-8 text-center text-stone-400 bg-stone-50 rounded-2xl border border-dashed border-stone-200">
          <p class="text-xs">Belum ada foto galeri khitan. Silakan upload dari HP atau PC Anda.</p>
        </div>
      `;
      return;
    }

    khitanGalleryPhotos.forEach((src, idx) => {
      const card = document.createElement('div');
      card.className = 'relative group rounded-2xl overflow-hidden shadow-sm border border-stone-200 bg-stone-100 aspect-square';
      card.innerHTML = `
        <img src="${src}" alt="Foto Khitan ${idx + 1}" class="w-full h-full object-cover group-hover:scale-105 transition duration-300">
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
      khitanGalleryPreviewGrid.appendChild(card);
    });

    if (window.lucide) lucide.createIcons();

    // Bind delete buttons
    khitanGalleryPreviewGrid.querySelectorAll('.btn-delete-photo').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const delIdx = parseInt(btn.getAttribute('data-idx'), 10);
        khitanGalleryPhotos.splice(delIdx, 1);
        renderKhitanGalleryGrid();
        showToast('Foto galeri khitan berhasil dihapus.');
      });
    });
  }

  renderKhitanGalleryGrid();

  // Upload Multiple Files for Khitan Gallery
  if (btnTriggerKhitanGalleryUpload && khitanGalleryFileInput) {
    btnTriggerKhitanGalleryUpload.addEventListener('click', () => khitanGalleryFileInput.click());
    khitanGalleryFileInput.addEventListener('change', async () => {
      const files = Array.from(khitanGalleryFileInput.files);
      if (files.length === 0) return;

      showToast(`Sedang memproses & mengunggah ${files.length} foto ke Cloud CDN...`);

      let successCount = 0;
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        try {
          showToast(`Mengunggah foto ${i + 1}/${files.length} ke Cloud CDN...`);
          const dataUrl = await compressImage(file, 1000, 1000, 0.75);
          const cloudUrl = await uploadImageToServer(dataUrl, file.name);
          const finalUrl = (cloudUrl && cloudUrl.startsWith('http')) ? cloudUrl : dataUrl;
          khitanGalleryPhotos.push(finalUrl);
          successCount++;
        } catch (err) {
          console.error('Error uploading gallery photo:', err);
        }
      }

      khitanGalleryFileInput.value = '';
      renderKhitanGalleryGrid();
      const cur = getKhitanConfig();
      cur.gallery = khitanGalleryPhotos;
      saveKhitanConfig(cur);
      showToast(`${successCount} foto berhasil diunggah ke CDN & disimpan!`);
    });
  }

  // Add via URL
  if (btnAddKhitanGalleryUrl && khitanGalleryUrlInput) {
    btnAddKhitanGalleryUrl.addEventListener('click', () => {
      const url = khitanGalleryUrlInput.value.trim();
      if (!url) {
        alert('Silakan masukkan link URL gambar terlebih dahulu.');
        return;
      }
      khitanGalleryPhotos.push(url);
      khitanGalleryUrlInput.value = '';
      renderKhitanGalleryGrid();
      showToast('Foto dari link berhasil ditambahkan ke galeri!');
    });
  }

  // Clear All
  if (btnClearAllKhitanGallery) {
    btnClearAllKhitanGallery.addEventListener('click', () => {
      if (confirm('Yakin ingin menghapus seluruh foto galeri khitan?')) {
        khitanGalleryPhotos = [];
        renderKhitanGalleryGrid();
        showToast('Semua foto galeri telah dihapus.');
      }
    });
  }

  // Event
  document.getElementById('eventDateDisplay').value = config.eventDateDisplay || '';
  document.getElementById('eventDateIso').value = config.eventDateIso || '';
  document.getElementById('eventTime').value = config.eventTime || '';
  document.getElementById('eventPlace').value = config.eventPlace || '';
  document.getElementById('eventAddress').value = config.eventAddress || '';
  document.getElementById('mapsUrl').value = config.mapsUrl || '';

  // Gift
  document.getElementById('bank1Name').value = config.bank1Name || '';
  document.getElementById('bank1Number').value = config.bank1Number || '';
  document.getElementById('bank1Holder').value = config.bank1Holder || '';
  document.getElementById('physicalAddress').value = config.physicalAddress || '';

  // Audio Handler (YouTube, SoundCloud & MP3 Preview)
  const audioUrlInput = document.getElementById('audioUrl');
  const audioFormatBadge = document.getElementById('audioFormatBadge');
  const btnTestAudio = document.getElementById('btnTestAudio');
  const btnTestAudioText = document.getElementById('btnTestAudioText');
  const builderTestAudio = document.getElementById('builderTestAudio');
  const builderScPlayer = document.getElementById('builderScPlayer');
  let builderScWidget = null;
  let builderYtPlayerInstance = null;
  let isTestingAudio = false;

  function extractYouTubeId(url) {
    if (!url) return null;
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/i);
    return match ? match[1] : null;
  }

  function updateAudioFormatBadge(url) {
    if (!audioFormatBadge) return;
    const clean = (url || '').trim();
    if (!clean) {
      audioFormatBadge.className = 'hidden';
      return;
    }

    const ytId = extractYouTubeId(clean);
    if (ytId) {
      audioFormatBadge.textContent = '🎵 YouTube Audio (Didukung Penuh)';
      audioFormatBadge.className = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-800 border border-red-300';
    } else if (clean.toLowerCase().includes('soundcloud.com')) {
      audioFormatBadge.textContent = '🎵 SoundCloud Track (Didukung Penuh)';
      audioFormatBadge.className = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-orange-100 text-orange-800 border border-orange-300';
    } else if (clean.toLowerCase().endsWith('.mp3') || clean.toLowerCase().includes('.mp3?') || clean.startsWith('audio/')) {
      audioFormatBadge.textContent = '🎵 Direct Audio MP3';
      audioFormatBadge.className = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300';
    } else {
      audioFormatBadge.textContent = '🎵 URL Audio Online';
      audioFormatBadge.className = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-300';
    }
  }

  function setTestingAudioActive(active) {
    isTestingAudio = active;
    if (btnTestAudioText) btnTestAudioText.textContent = active ? 'Berhenti Putar' : 'Tes Putar';
    if (btnTestAudio) {
      const icon = btnTestAudio.querySelector('i');
      if (icon) icon.setAttribute('data-lucide', active ? 'square' : 'play');
      if (window.lucide) lucide.createIcons();
    }
  }

  function stopAllTestAudio() {
    setTestingAudioActive(false);
    if (builderTestAudio) {
      builderTestAudio.pause();
      builderTestAudio.currentTime = 0;
    }
    if (builderScWidget && typeof builderScWidget.pause === 'function') {
      try { builderScWidget.pause(); } catch (e) {}
    }
    if (builderYtPlayerInstance && typeof builderYtPlayerInstance.pauseVideo === 'function') {
      try { builderYtPlayerInstance.pauseVideo(); } catch (e) {}
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

      const ytId = extractYouTubeId(targetUrl);
      const isSoundCloud = targetUrl.toLowerCase().includes('soundcloud.com');

      if (ytId) {
        // YouTube Audio Engine
        function startYt() {
          if (window.YT && window.YT.Player) {
            if (builderYtPlayerInstance && typeof builderYtPlayerInstance.loadVideoById === 'function') {
              builderYtPlayerInstance.loadVideoById(ytId);
              builderYtPlayerInstance.playVideo();
              setTestingAudioActive(true);
            } else {
              builderYtPlayerInstance = new YT.Player('builderYtPlayer', {
                height: '10',
                width: '10',
                videoId: ytId,
                playerVars: { autoplay: 1, controls: 0 },
                events: {
                  onReady: () => {
                    builderYtPlayerInstance.playVideo();
                    setTestingAudioActive(true);
                  },
                  onStateChange: (e) => {
                    if (e.data === YT.PlayerState.PLAYING) {
                      setTestingAudioActive(true);
                    } else if (e.data === YT.PlayerState.PAUSED || e.data === YT.PlayerState.ENDED) {
                      setTestingAudioActive(false);
                    }
                  }
                }
              });
            }
          } else {
            alert('YouTube Player sedang dimuat, silakan coba 2 detik lagi.');
          }
        }
        startYt();
      } else if (isSoundCloud) {
        // Init SoundCloud test widget
        if (builderScPlayer) {
          const cleanUrl = targetUrl.split('?')[0];
          const embedSrc = `https://w.soundcloud.com/player/?url=${encodeURIComponent(cleanUrl)}&auto_play=true&hide_related=true&show_comments=false&show_user=false&show_reposts=false&show_teaser=false&visual=false`;
          
          if (!builderScPlayer.src || !builderScPlayer.src.includes(encodeURIComponent(cleanUrl))) {
            builderScPlayer.src = embedSrc;
          }

          function connectScWidget() {
            if (window.SC && window.SC.Widget) {
              builderScWidget = window.SC.Widget(builderScPlayer);
              builderScWidget.bind(window.SC.Widget.Events.READY, () => {
                builderScWidget.play();
                setTestingAudioActive(true);
              });
              builderScWidget.bind(window.SC.Widget.Events.PLAY, () => {
                setTestingAudioActive(true);
              });
              builderScWidget.bind(window.SC.Widget.Events.PAUSE, () => {
                setTestingAudioActive(false);
              });
              builderScWidget.bind(window.SC.Widget.Events.FINISH, () => {
                setTestingAudioActive(false);
              });
              try {
                builderScWidget.play();
                setTestingAudioActive(true);
              } catch(e) {}
            } else {
              alert('Widget SoundCloud sedang dimuat, silakan coba 2 detik lagi.');
            }
          }
          connectScWidget();
        }
      } else {
        // Direct MP3
        if (builderTestAudio) {
          builderTestAudio.src = targetUrl;
          builderTestAudio.play().then(() => {
            setTestingAudioActive(true);
          }).catch(err => {
            console.error('Audio play error:', err);
            alert('Gagal memutar audio. Pastikan URL valid dan dapat diakses publik.');
          });

          builderTestAudio.onended = () => {
            setTestingAudioActive(false);
          };
        }
      }
    });
  }

  // Auto-sync local base64 images to permanent Cloud CDN
  async function syncLocalImagesToCloud(cfg) {
    let changed = false;
    // 1. Sync child photo
    if (cfg.photo && cfg.photo.startsWith('data:image/')) {
      showToast('Mengunggah foto ananda ke Cloud CDN...');
      try {
        const cloudUrl = await uploadImageToServer(cfg.photo, 'foto-ananda.jpg');
        if (cloudUrl && cloudUrl.startsWith('http')) {
          cfg.photo = cloudUrl;
          const photoInput = document.getElementById('childPhoto');
          if (photoInput) photoInput.value = cloudUrl;
          const photoPrev = document.getElementById('childPhotoPreview');
          if (photoPrev) photoPrev.src = cloudUrl;
          localStorage.setItem('khitan_child_photo', cloudUrl);
          changed = true;
        }
      } catch (e) {}
    }

    // 2. Sync custom background
    if (cfg.customBg && cfg.customBg.startsWith('data:image/')) {
      showToast('Mengunggah background kustom ke Cloud CDN...');
      try {
        const cloudUrl = await uploadImageToServer(cfg.customBg, 'background-kustom.jpg');
        if (cloudUrl && cloudUrl.startsWith('http')) {
          cfg.customBg = cloudUrl;
          const bgInput = document.getElementById('customBgInput');
          if (bgInput) bgInput.value = cloudUrl;
          changed = true;
        }
      } catch (e) {}
    }

    // 3. Sync gallery photos
    if (cfg.gallery && Array.isArray(cfg.gallery)) {
      for (let i = 0; i < cfg.gallery.length; i++) {
        if (cfg.gallery[i] && cfg.gallery[i].startsWith('data:image/')) {
          showToast(`Mengunggah foto galeri ${i + 1}/${cfg.gallery.length} ke Cloud CDN...`);
          try {
            const cloudUrl = await uploadImageToServer(cfg.gallery[i], `galeri-${i + 1}.jpg`);
            if (cloudUrl && cloudUrl.startsWith('http')) {
              cfg.gallery[i] = cloudUrl;
              khitanGalleryPhotos[i] = cloudUrl;
              changed = true;
            }
          } catch (e) {}
        }
      }
      if (changed) renderKhitanGalleryGrid();
    }

    if (changed) {
      saveKhitanConfig(cfg);
    }
    return cfg;
  }

  // Trigger auto-sync on load if any local base64 images exist
  setTimeout(() => {
    const cur = getKhitanConfig();
    const hasLocal = (cur.photo && cur.photo.startsWith('data:image/')) ||
                    (cur.customBg && cur.customBg.startsWith('data:image/')) ||
                    (cur.gallery && cur.gallery.some(g => g && g.startsWith('data:image/')));
    if (hasLocal) {
      syncLocalImagesToCloud(cur);
    }
  }, 1200);

  // Form Submit
  const builderForm = document.getElementById('khitanBuilderForm');
  builderForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    let newConfig = {
      childNickname: document.getElementById('childNickname').value.trim(),
      childFullname: document.getElementById('childFullname').value.trim(),
      childOrder: document.getElementById('childOrder').value.trim(),
      father: document.getElementById('fatherName').value.trim(),
      mother: document.getElementById('motherName').value.trim(),
      photo: document.getElementById('childPhoto').value.trim(),
      gallery: khitanGalleryPhotos,
      eventDateDisplay: document.getElementById('eventDateDisplay').value.trim(),
      eventDateIso: document.getElementById('eventDateIso').value.trim(),
      eventTime: document.getElementById('eventTime').value.trim(),
      eventPlace: document.getElementById('eventPlace').value.trim(),
      eventAddress: document.getElementById('eventAddress').value.trim(),
      mapsUrl: document.getElementById('mapsUrl').value.trim(),
      bank1Name: document.getElementById('bank1Name').value.trim(),
      bank1Number: document.getElementById('bank1Number').value.trim(),
      bank1Holder: document.getElementById('bank1Holder').value.trim(),
      physicalAddress: document.getElementById('physicalAddress').value.trim(),
      audioUrl: document.getElementById('audioUrl').value.trim(),
      customBg: document.getElementById('customBgInput')?.value?.trim() || '',
      theme: document.getElementById('selectedKhitanTheme')?.value || 'cream'
    };

    newConfig = await syncLocalImagesToCloud(newConfig);

    if (saveKhitanConfig(newConfig)) {
      showToast('Perubahan undangan khitanan berhasil disimpan & online!');
    }
  });

  // Reset
  const btnReset = document.getElementById('btnReset');
  if (btnReset) {
    btnReset.addEventListener('click', () => {
      if (confirm('Kembalikan semua data undangan khitanan ke default?')) {
        saveKhitanConfig(defaultKhitanConfig);
        location.reload();
      }
    });
  }

  // Toast
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

  // Generator Tamu WhatsApp Khusus Khitan
  const guestInput = document.getElementById('guestInput');
  const btnGenerateLink = document.getElementById('btnGenerateLink');
  const generatedResultBox = document.getElementById('generatedResultBox');
  const generatedUrlInput = document.getElementById('generatedUrlInput');
  const generatedWaPreview = document.getElementById('generatedWaPreview');
  const btnCopyUrl = document.getElementById('btnCopyUrl');
  const btnCopyWaText = document.getElementById('btnCopyWaText');
  const btnOpenWa = document.getElementById('btnOpenWa');

  async function generateGuestInvitation() {
    const guestName = guestInput.value.trim();
    if (!guestName) {
      alert('Silakan masukkan nama tamu terlebih dahulu.');
      return;
    }

    const currentCfg = getKhitanConfig();

    // Auto-upload photo if still a local data URL
    if (currentCfg.photo && currentCfg.photo.startsWith('data:image/')) {
      showToast('Mengunggah foto ananda ke Cloud CDN...');
      try {
        const cloudUrl = await uploadImageToServer(currentCfg.photo, 'foto-ananda.jpg');
        if (cloudUrl && cloudUrl.startsWith('http')) {
          currentCfg.photo = cloudUrl;
          const photoInput = document.getElementById('childPhoto');
          if (photoInput) photoInput.value = cloudUrl;
          localStorage.setItem('khitan_child_photo', cloudUrl);
          saveKhitanConfig(currentCfg);
        }
      } catch (err) {
        console.warn('Gagal upload foto:', err);
      }
    }

    const childName = currentCfg.childFullname || 'Irendy Wijaya Saputra';
    const parents = `${currentCfg.father || 'Bpk. Wangkis Suwito'} & ${currentCfg.mother || 'Ibu Susi Dwi jayanti'}`;

    // Base URL resolution (clean origin - avoids 404 folder nesting)
    const baseOrigin = window.location.origin;
    let fullInvitationUrl = `${baseOrigin}/khitan.html?to=${encodeURIComponent(guestName)}`;
    if (currentCfg.theme && currentCfg.theme !== 'cream') {
      fullInvitationUrl += `&theme=${encodeURIComponent(currentCfg.theme)}`;
    }

    const waMessage = 
`Kepada Yth.
Bapak/Ibu/Saudara/i *${guestName}*

Assalamu'alaikum Warahmatullahi Wabarakatuh.

Dengan memohon rahmat dan ridho Allah Subhanahu Wa Ta'ala, kami mengundang Bapak/Ibu/Saudara/i untuk menghadiri acara Tasyakuran Walimatul Khitan putra kami:

*${childName}*

Berikut tautan undangan digital kami untuk melihat detail acara:
${fullInvitationUrl}

Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir serta memberikan doa restu kepada ananda.

Terima kasih.
Wassalamu'alaikum Warahmatullahi Wabarakatuh.

Salam hormat,
*${parents}*`;

    generatedUrlInput.value = fullInvitationUrl;
    generatedWaPreview.value = waMessage;
    generatedResultBox.classList.remove('hidden');

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
        showToast('Teks WhatsApp Walimatul Khitan berhasil disalin!');
      });
    });
  }

  const btnCopyGeneralUrl = document.getElementById('btnCopyGeneralUrl');
  if (btnCopyGeneralUrl) {
    btnCopyGeneralUrl.addEventListener('click', async () => {
      const currentCfg = getKhitanConfig();
      if (currentCfg.photo && currentCfg.photo.startsWith('data:image/')) {
        showToast('Mengunggah foto ananda ke Cloud CDN...');
        try {
          const cloudUrl = await uploadImageToServer(currentCfg.photo, 'foto-ananda.jpg');
          if (cloudUrl && cloudUrl.startsWith('http')) {
            currentCfg.photo = cloudUrl;
            const photoInput = document.getElementById('childPhoto');
            if (photoInput) photoInput.value = cloudUrl;
            localStorage.setItem('khitan_child_photo', cloudUrl);
            saveKhitanConfig(currentCfg);
          }
        } catch (err) {}
      }

      let generalUrl = `${window.location.origin}/khitan.html`;
      if (currentCfg.theme && currentCfg.theme !== 'cream') {
        generalUrl += `?theme=${encodeURIComponent(currentCfg.theme)}`;
      }
      navigator.clipboard.writeText(generalUrl).then(() => {
        showToast('Link undangan umum (siap share grup WA) berhasil disalin!');
      });
    });
  }
});
