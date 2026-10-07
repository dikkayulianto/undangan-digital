# 💍 Undangan Digital Platform (Inveet Style)

Platform undangan digital mandiri berbasis web yang terinspirasi dari **Inveet.id**. Dibuat menggunakan arsitektur **100% Client-Side Statis (HTML5, Tailwind CSS, Vanilla JS)** sehingga sangat cepat, ringan, bebas biaya database, dan dapat langsung dideploy ke hosting mana saja (Vercel, Netlify, GitHub Pages, cPanel).

![Status](https://img.shields.io/badge/status-ready--to--publish-success)
![Tech Stack](https://img.shields.io/badge/tech-HTML5%20%7C%20TailwindCSS%20%7C%20VanillaJS-blue)
![Audio Engine](https://img.shields.io/badge/audio-SoundCloud%20Widget%20%7C%20HTML5-orange)

---

## ✨ Fitur Utama

### 1. 💒 Undangan Pernikahan (The Wedding)
- **4 Pilihan Tema Eksklusif**:
  - *Champagne Gold* (Klasik Mewah & Renda Antik)
  - *Sage Botanical* (Hijau Alami Eukaliptus)
  - *Midnight Rose* (Gelap Obsidian Eksklusif)
  - *Royal Navy & Silver* (Biru Kerajaan Modern)
- **Background Estetis Sesuai Tema**: Bebas dari foto orang lain, murni ornamen damask, bunga, atau marmer mewah.
- **Profil Mempelai & Keluarga**: Foto kedua mempelai, nama lengkap, nama orang tua, dan link akun Instagram.
- **Sesi Acara Lengkap**: Tanggal acara, hitung mundur (countdown), sesi Akad Nikah & Resepsi, serta navigasi Google Maps.
- **Amplop Digital & Kado Fisik**: Rekening bank dengan tombol 1-klik salin nomor rekening dan alamat pengiriman kado.
- **Galeri Foto Pre-Wedding**: Dilengkapi lightbox popup untuk memperbesar foto.

### 2. 🌙 Undangan Tasyakuran Walimatul Khitan
- Didesain khusus untuk momen khitanan ananda dengan nuansa Islami yang hangat dan santun.
- Tema *Emerald Islamic* berlatar mosaik geometris kubah masjid.
- Doa keberkahan anak dalam tulisan Arab & terjemahan.
- Profil ananda, nama orang tua, galeri foto tasyakuran, dan penerimaan hadiah.

### 3. 🎵 Dual Audio Engine (SoundCloud & MP3)
- **Dukungan Penuh SoundCloud API**: Bebas memasukkan lagu apa saja langsung dari link web SoundCloud (misal: Maher Zain, Harris J, Nasyid, atau lagu pop).
- **Pembersihan Link Otomatis**: Menghapus parameter pelacak share link SoundCloud secara otomatis.
- **Floating Vinyl Disc**: Piringan hitam berputar saat lagu bermain, bisa diklik untuk pause/play, dan otomatis berulang (*loop*).
- **Fallback HTML5 Audio**: Tetap mendukung tautan file `.mp3` langsung.

### 4. 🎛️ Live Editor / Builder Interaktif
- **Pengaturan Lengkap**: Ubah tema, teks mempelai/anak, lokasi acara, nomor rekening, hingga musik latar.
- **Upload Foto Langsung dari HP / Laptop**: Dilengkapi sistem kompresi canvas otomatis di browser sehingga foto ringan dan cepat dimuat oleh tamu.
- **Tes Putar Musik**: Dengarkan preview musik sebelum disimpan.

### 5. 💬 Generator Tautan Tamu & WhatsApp
- Buat tautan personal untuk setiap nama tamu undangan (`?to=Nama+Tamu`).
- Template pesan WhatsApp sopan siap kirim dan salin dengan satu klik.

### 6. 📊 Dashboard Pengguna (SaaS Style)
- Tampilan panel pengguna untuk memantau semua undangan aktif.
- Statistik kunjungan tamu, konfirmasi kehadiran (RSVP), dan buku tamu masuk.
- Ekspor data buku tamu ke format CSV / Excel.
- Akun demo siap pakai (*Rizky Pratama - Paket Sapphire VIP*).

---

## 📂 Struktur File

```text
├── index.html              # Landing page utama, showcase tema, & simulasi gratis
├── dashboard.html          # Dashboard pengguna untuk kelola undangan & buku tamu
├── login.html              # Halaman login akun pengguna (fitur demo 1-klik)
├── invitation.html         # Template publik undangan pernikahan
├── khitan.html             # Template publik undangan walimatul khitan
├── builder.html            # Editor / dashboard kustomisasi undangan pernikahan
├── builder-khitan.html     # Editor / dashboard kustomisasi undangan khitanan
├── css/
│   └── style.css           # Styling tambahan, animasi piringan hitam, & scrollbar
├── js/
│   ├── app.js              # Script utama undangan pernikahan & SoundCloud player
│   ├── builder.js          # Script editor pernikahan & kompresi foto galeri
│   ├── builder-khitan.js   # Script editor khitanan & kompresi foto galeri
│   └── landing.js          # Script simulator interaktif di landing page
└── README.md               # Dokumentasi proyek
```

---

## 🚀 Panduan Menjalankan di Lokal (Localhost)

Karena website ini 100% statis, Anda dapat menjalankannya menggunakan web server lokal apa pun:

### Menggunakan Python:
```bash
# Di dalam folder proyek:
python -m http.server 8000
```
Buka di browser: `http://localhost:8000`

### Menggunakan VS Code Live Server:
Klik kanan pada file `index.html` lalu pilih **Open with Live Server**.

---

## 🌐 Panduan Publish ke Web Hosting

### Opsi 1: Vercel / Netlify (Sangat Direkomendasikan - Gratis & Otomatis)
1. Hubungkan repository GitHub ini (`dikkayulianto/undangan-digital`) ke akun **Vercel** atau **Netlify**.
2. Framework preset: **Other** / **Static Site**.
3. Build command: Kosongkan (tidak memerlukan proses build).
4. Output directory: `.` (root folder).
5. Klik **Deploy** — website langsung online ber-SSL (HTTPS)!

### Opsi 2: GitHub Pages (Gratis)
1. Buka repository ini di GitHub: `Settings` > `Pages`.
2. Pada bagian **Branch**, pilih `main` dan folder `/(root)`.
3. Klik **Save**. Tunggu sekitar 1 menit, undangan Anda langsung aktif di `https://dikkayulianto.github.io/undangan-digital/`.

### Opsi 3: Hosting cPanel Biasa
1. Buka File Manager di cPanel hosting Anda.
2. Masuk ke folder `public_html`.
3. Unggah seluruh isi file proyek ini.

---

## 📝 Lisensi & Kredit
- Desain terinspirasi oleh **Inveet.id**.
- Ikon oleh **Lucide Icons**.
- Widget Musik oleh **SoundCloud Widget API**.
- Tipografi oleh **Google Fonts** (*Plus Jakarta Sans* & *Cormorant Garamond*).
