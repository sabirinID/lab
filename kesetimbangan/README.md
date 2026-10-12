# Kesetimbangan Kimia: Media Pembelajaran Interaktif dan Lab Maya

Media pembelajaran Kimia Kelas XI (Fase F) dengan empat kegiatan: Belajar (8 halaman), Bermain (10 permainan), Lab Maya (3 eksperimen), dan Berlatih (10 soal).

## Struktur

- `index.html` : markup seluruh layar dan SVG Lab Maya
- `styles.css` : tema visual (selaras dengan situs Sabirin)
- `script.js`  : konfigurasi, materi, permainan, soal, audio
- `lab.js`     : simulasi N₂O₄ ⇌ 2NO₂, perhitungan Kc, dan proses Haber–Bosch
- `asset/`     : ilustrasi SVG, foto profil, audio

## Mengubah isi

- Judul, profil, referensi: objek `CONFIG` di awal `script.js`.
- Materi, permainan, soal: `MATERI`, `dataBermain`, `dtLatih` di `script.js`.
- Konstanta termodinamika dan kinetika (K298, ΔH, Kp Haber, target misi) ada di awal `lab.js`.
