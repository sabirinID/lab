# Sel Volta: Media Pembelajaran Interaktif dan Lab Maya

Media pembelajaran Kimia Kelas XII (Fase F) dengan empat kegiatan: Belajar, Bermain, Lab Maya (praktikum virtual), dan Berlatih.

## Struktur

- `index.html` : markup seluruh layar dan SVG Lab Maya
- `styles.css` : tema visual (token warna di `:root`, selaras dengan situs Sabirin)
- `script.js`  : konfigurasi, materi, permainan, soal, audio
- `lab.js`     : logika dan visualisasi Lab Maya
- `asset/`     : gambar dan audio

## Mengubah isi

- Judul, profil, referensi: objek `CONFIG` di awal `script.js`.
- Materi, permainan, soal: `MATERI`, `dataBermain`, `dtLatih` di `script.js`.
- Data logam dan potensial reduksi: `LAB_LOGAM` di awal `lab.js`.
- Warna dan font: variabel di `:root` pada `styles.css`.

## Menjalankan

Buka `index.html` di peramban, atau `python3 -m http.server 8000`.
