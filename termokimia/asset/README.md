# Termokimia: Media Pembelajaran Interaktif dan Lab Maya

Media pembelajaran Kimia Kelas XI (Fase F) dengan empat kegiatan: Belajar (8 halaman), Bermain (10 permainan), Lab Maya (3 eksperimen), dan Berlatih (10 soal).

## Struktur

- `index.html` : markup seluruh layar dan SVG Lab Maya
- `styles.css` : tema visual (selaras dengan situs Sabirin)
- `script.js`  : konfigurasi, materi, permainan, soal, audio
- `lab.js`     : kalorimeter, Hukum Hess, dan energi ikatan
- `asset/`     : ilustrasi SVG, foto profil, audio

## Mengubah isi

- Judul, profil, referensi: objek `CONFIG` di awal `script.js`.
- Materi, permainan, soal: `MATERI`, `dataBermain`, `dtLatih` di `script.js`.
- Reaksi kalorimeter, jalur Hess, dan energi ikatan: `LAB_KAL`, `LAB_HESS`, `LAB_IKAT` di awal `lab.js`.
