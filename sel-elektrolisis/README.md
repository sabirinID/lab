# Sel Elektrolisis: Media Pembelajaran Interaktif dan Lab Maya

Media pembelajaran Kimia Kelas XII (Fase F) dengan empat kegiatan: Belajar (8 halaman), Bermain (10 permainan), Lab Maya (praktikum virtual), dan Berlatih (10 soal).

## Struktur

- `index.html` : markup seluruh layar dan SVG Lab Maya
- `styles.css` : tema visual (token warna di `:root`, selaras dengan situs Sabirin)
- `script.js`  : konfigurasi, materi, permainan, soal, audio
- `lab.js`     : mesin dan visualisasi Lab Maya elektrolisis
- `asset/img/` : ilustrasi SVG materi dan layar judul, foto profil
- `asset/audio/` : musik latar dan efek suara

## Mengubah isi

- Judul, profil, referensi: objek `CONFIG` di awal `script.js`.
- Materi, permainan, soal: `MATERI`, `dataBermain`, `dtLatih` di `script.js`.
- Elektrolit dan elektrode Lab Maya: `LAB_ELEKTROLIT` dan `LAB_ELEKTRODE` di awal `lab.js`.
- Aturan produk elektrolisis: fungsi `labHitung()` di `lab.js`.

## Menjalankan

Buka `index.html` di peramban, atau `python3 -m http.server 8000`.
