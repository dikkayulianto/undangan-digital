/**
 * Inveet Landing Page Scripts & Interactive Simulator
 */

document.addEventListener('DOMContentLoaded', () => {
  if (window.lucide) {
    lucide.createIcons();
  }

  // 1. Interactive Simulator Logic (Uji Coba Versi Gratis Langsung di Homepage)
  const simGroom = document.getElementById('simGroom');
  const simBride = document.getElementById('simBride');
  const simDate = document.getElementById('simDate');
  const simThemeSelects = document.querySelectorAll('.sim-theme-btn');
  const simBtnContinue = document.getElementById('simBtnContinue');

  // Preview elements
  const previewNames = document.getElementById('previewNames');
  const previewDate = document.getElementById('previewDate');
  const previewPhone = document.getElementById('previewPhone');
  const previewCoverImg = document.getElementById('previewCoverImg');
  const previewBtn = document.getElementById('previewBtn');

  let selectedTheme = 'champagne';

  const themePresets = {
    champagne: {
      accentText: 'text-amber-800',
      bgClass: 'bg-[#faf8f5]',
      btnBg: 'bg-gradient-to-r from-amber-600 to-amber-700',
      coverOverlay: 'linear-gradient(to bottom, rgba(28,25,23,0.35), rgba(28,25,23,0.85))',
      imgUrl: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=400&q=80'
    },
    sage: {
      accentText: 'text-emerald-900',
      bgClass: 'bg-[#f5f8f5]',
      btnBg: 'bg-gradient-to-r from-emerald-700 to-emerald-800',
      coverOverlay: 'linear-gradient(to bottom, rgba(20,32,24,0.4), rgba(20,32,24,0.85))',
      imgUrl: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=400&q=80'
    },
    midnight: {
      accentText: 'text-pink-200',
      bgClass: 'bg-[#171715]',
      btnBg: 'bg-gradient-to-r from-rose-400 to-rose-600 text-stone-900',
      coverOverlay: 'linear-gradient(to bottom, rgba(14,13,16,0.5), rgba(14,13,16,0.92))',
      imgUrl: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=400&q=80'
    },
    royal: {
      accentText: 'text-blue-900',
      bgClass: 'bg-[#f5f7fa]',
      btnBg: 'bg-gradient-to-r from-blue-700 to-blue-900',
      coverOverlay: 'linear-gradient(to bottom, rgba(13,27,42,0.45), rgba(13,27,42,0.9))',
      imgUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=400&q=80'
    }
  };

  function updateSimulatorPreview() {
    const groom = simGroom ? (simGroom.value.trim() || 'Dimas') : 'Dimas';
    const bride = simBride ? (simBride.value.trim() || 'Sarah') : 'Sarah';
    const dateVal = simDate ? (simDate.value.trim() || '28 Desember 2026') : '28 Desember 2026';

    if (previewNames) {
      previewNames.textContent = `${groom} & ${bride}`;
    }
    if (previewDate) {
      previewDate.textContent = dateVal;
    }

    const preset = themePresets[selectedTheme] || themePresets.champagne;
    if (previewPhone) {
      previewPhone.className = `w-full h-full rounded-[2.5rem] overflow-hidden flex flex-col justify-between p-6 text-center text-white relative transition-colors duration-300 shadow-2xl`;
      previewPhone.style.backgroundImage = `${preset.coverOverlay}, url('${preset.imgUrl}')`;
      previewPhone.style.backgroundSize = 'cover';
      previewPhone.style.backgroundPosition = 'center';
    }

    if (previewBtn) {
      previewBtn.className = `w-full py-2.5 px-4 rounded-xl font-semibold text-xs tracking-wider shadow-lg flex items-center justify-center gap-2 transition ${preset.btnBg}`;
    }

    // Update Continue Link
    if (simBtnContinue) {
      simBtnContinue.href = `builder.html?tier=free&groom=${encodeURIComponent(groom)}&bride=${encodeURIComponent(bride)}&theme=${encodeURIComponent(selectedTheme)}`;
    }
  }

  if (simGroom) simGroom.addEventListener('input', updateSimulatorPreview);
  if (simBride) simBride.addEventListener('input', updateSimulatorPreview);
  if (simDate) simDate.addEventListener('input', updateSimulatorPreview);

  simThemeSelects.forEach(btn => {
    btn.addEventListener('click', () => {
      simThemeSelects.forEach(b => {
        b.classList.remove('active', 'ring-2', 'ring-amber-500', 'border-amber-500', 'bg-amber-50');
        b.classList.add('border-stone-200');
      });
      btn.classList.add('active', 'ring-2', 'ring-amber-500', 'border-amber-500', 'bg-amber-50');
      btn.classList.remove('border-stone-200');

      selectedTheme = btn.getAttribute('data-theme') || 'champagne';
      updateSimulatorPreview();
    });
  });

  updateSimulatorPreview();

  // 2. FAQ Accordion Toggle
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const trigger = item.querySelector('.faq-trigger');
    const content = item.querySelector('.faq-content');
    const icon = item.querySelector('.faq-icon');

    if (trigger && content) {
      trigger.addEventListener('click', () => {
        const isOpen = !content.classList.contains('hidden');
        // Close all
        faqItems.forEach(other => {
          const c = other.querySelector('.faq-content');
          const ic = other.querySelector('.faq-icon');
          if (c) c.classList.add('hidden');
          if (ic) ic.style.transform = 'rotate(0deg)';
        });

        if (!isOpen) {
          content.classList.remove('hidden');
          if (icon) icon.style.transform = 'rotate(180deg)';
        }
      });
    }
  });

  // 3. Mobile Navigation Menu Toggle
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
    });

    mobileMenu.querySelectorAll('a, button').forEach(item => {
      item.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
      });
    });
  }

  // 4. Modal Pilih Kategori (Pernikahan vs Khitanan)
  const categoryModal = document.getElementById('categoryModal');
  const closeCategoryModal = document.getElementById('closeCategoryModal');
  const openCategoryBtns = document.querySelectorAll('.btn-open-category-modal');

  function openModal() {
    if (categoryModal) {
      categoryModal.classList.remove('hidden');
      document.body.classList.add('overflow-hidden');
    }
  }

  function closeModal() {
    if (categoryModal) {
      categoryModal.classList.add('hidden');
      document.body.classList.remove('overflow-hidden');
    }
  }

  openCategoryBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openModal();
    });
  });

  if (closeCategoryModal) {
    closeCategoryModal.addEventListener('click', closeModal);
  }

  if (categoryModal) {
    categoryModal.addEventListener('click', (e) => {
      if (e.target === categoryModal) {
        closeModal();
      }
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && categoryModal && !categoryModal.classList.contains('hidden')) {
      closeModal();
    }
  });

  // 5. Showcase Category Tab Switcher (Wedding vs Khitan)
  const showcaseTabWedding = document.getElementById('showcaseTabWedding');
  const showcaseTabKhitan = document.getElementById('showcaseTabKhitan');
  const showcaseWeddingGrid = document.getElementById('showcaseWeddingGrid');
  const showcaseKhitanGrid = document.getElementById('showcaseKhitanGrid');

  if (showcaseTabWedding && showcaseTabKhitan && showcaseWeddingGrid && showcaseKhitanGrid) {
    showcaseTabWedding.addEventListener('click', () => {
      // Show Wedding Grid
      showcaseWeddingGrid.classList.remove('hidden');
      showcaseKhitanGrid.classList.add('hidden');

      // Update button styles
      showcaseTabWedding.className = 'px-5 py-2.5 rounded-full text-xs font-bold transition flex items-center gap-2 bg-amber-800 text-white shadow-md';
      showcaseTabKhitan.className = 'px-5 py-2.5 rounded-full text-xs font-bold transition flex items-center gap-2 bg-white text-stone-700 border border-stone-300 hover:bg-stone-100';
    });

    showcaseTabKhitan.addEventListener('click', () => {
      // Show Khitan Grid
      showcaseKhitanGrid.classList.remove('hidden');
      showcaseWeddingGrid.classList.add('hidden');

      // Update button styles
      showcaseTabKhitan.className = 'px-5 py-2.5 rounded-full text-xs font-bold transition flex items-center gap-2 bg-emerald-800 text-white shadow-md';
      showcaseTabWedding.className = 'px-5 py-2.5 rounded-full text-xs font-bold transition flex items-center gap-2 bg-white text-stone-700 border border-stone-300 hover:bg-stone-100';
    });
  }
});
