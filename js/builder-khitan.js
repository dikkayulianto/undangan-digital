/**
 * Script Dashboard Editor Undangan Walimatul Khitan
 */

const defaultKhitanConfig = {
  childNickname: 'Fadhil',
  childFullname: 'Muhammad Fadhil Al-Fatih',
  childOrder: 'Putra pertama dari pasangan:',
  father: 'Bpk. Ahmad Fauzi',
  mother: 'Ibu Nurul Hidayah',
  photo: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=500&q=80',
  eventDateDisplay: 'Ahad, 15 November 2026',
  eventDateIso: '2026-11-15T09:00',
  eventTime: 'Pukul 09.00 - 13.00 WIB',
  eventPlace: 'Kediaman Mempelai / Aula Al-Ikhlas',
  eventAddress: 'Jl. Cempaka Putih Timur No. 28, Jakarta Pusat',
  mapsUrl: 'https://maps.google.com/?q=Jakarta',
  bank1Name: 'BCA',
  bank1Number: '1234567890',
  bank1Holder: 'Ahmad Fauzi (Ayah)',
  physicalAddress: 'Jl. Cempaka Putih Timur No. 28, RT 02/RW 04, Cempaka Putih, Jakarta Pusat',
  audioUrl: 'https://assets.mixkit.co/music/preview/mixkit-serene-view-443.mp3',
  gallery: [
    'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1543332164-6e82f355badc?auto=format&fit=crop&w=800&q=80'
  ]
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

function getKhitanConfig() {
  const saved = localStorage.getItem('khitan_config');
  if (saved) {
    try {
      return Object.assign({}, defaultKhitanConfig, JSON.parse(saved));
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
        b.classList.remove('active', 'border-emerald-600', 'text-emerald-800', 'bg-emerald-50/70');
        b.classList.add('border-transparent', 'text-stone-500');
      });
      tabPanes.forEach(pane => pane.classList.add('hidden'));

      btn.classList.add('active', 'border-emerald-600', 'text-emerald-800', 'bg-emerald-50/70');
      btn.classList.remove('border-transparent', 'text-stone-500');
      const activePane = document.getElementById(target);
      if (activePane) activePane.classList.remove('hidden');
    });
  });

  // Populate Form Fields
  const config = getKhitanConfig();

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

  if (childPhotoInput && childPhotoPreview) {
    if (config.photo) {
      childPhotoInput.value = config.photo;
      childPhotoPreview.src = config.photo;
    }
    childPhotoInput.addEventListener('input', () => {
      if (childPhotoInput.value.trim()) childPhotoPreview.src = childPhotoInput.value.trim();
    });
  }

  if (btnUploadChildPhoto && childPhotoFile) {
    btnUploadChildPhoto.addEventListener('click', () => childPhotoFile.click());
    childPhotoFile.addEventListener('change', async () => {
      const file = childPhotoFile.files[0];
      if (file) {
        try {
          showToast('Mengompresi foto ananda...');
          const dataUrl = await compressImage(file, 800, 800, 0.75);
          childPhotoInput.value = dataUrl;
          childPhotoPreview.src = dataUrl;
          showToast('Foto ananda berhasil diunggah!');
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
          if (customBgInput) customBgInput.value = dataUrl;
          updateActiveKhitanBgCard(dataUrl);
          showToast('Background kustom khitan berhasil diunggah!');
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

      showToast(`Sedang memproses & mengompresi ${files.length} foto...`);

      let successCount = 0;
      for (const file of files) {
        try {
          const dataUrl = await compressImage(file, 1000, 1000, 0.75);
          khitanGalleryPhotos.push(dataUrl);
          successCount++;
        } catch (err) {
          console.error('Error compressing gallery photo:', err);
        }
      }

      khitanGalleryFileInput.value = '';
      renderKhitanGalleryGrid();
      showToast(`${successCount} foto berhasil diunggah ke galeri khitan!`);
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

  // Form Submit
  const builderForm = document.getElementById('khitanBuilderForm');
  builderForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const newConfig = {
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
      customBg: document.getElementById('customBgInput')?.value?.trim() || ''
    };

    if (saveKhitanConfig(newConfig)) {
      showToast('Perubahan undangan khitanan berhasil disimpan!');
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

  function generateGuestInvitation() {
    const guestName = guestInput.value.trim();
    if (!guestName) {
      alert('Silakan masukkan nama tamu terlebih dahulu.');
      return;
    }

    const currentCfg = getKhitanConfig();
    const childName = currentCfg.childFullname || 'Muhammad Fadhil Al-Fatih';
    const parents = `${currentCfg.father || 'Bpk. Ahmad Fauzi'} & ${currentCfg.mother || 'Ibu Nurul Hidayah'}`;

    let base = window.location.href.split('builder-khitan.html')[0];
    if (!base.endsWith('/')) base += '/';
    const fullInvitationUrl = `${base}khitan.html?to=${encodeURIComponent(guestName)}`;

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
});
