# Sifat Koligatif Larutan: Media Pembelajaran Interaktif dan Lab Maya

Media pembelajaran Kimia Kelas XII (Fase F) dengan empat kegiatan: Belajar (8 halaman), Bermain (10 permainan), Lab Maya (4 eksperimen), dan Berlatih (10 soal).

## Struktur

- `index.html` : markup seluruh layar dan SVG Lab Maya
- `styles.css` : tema visual (selaras dengan situs Sabirin)
- `script.js`  : konfigurasi, materi, permainan, soal, audio
- `lab.js`     : perhitungan dan animasi Lab Maya (tekanan uap, titik didih, titik beku, osmosis)
- `asset/`     : ilustrasi SVG, foto profil, audio

## Mengubah isi

- Judul, profil, referensi: objek `CONFIG` di awal `script.js`.
- Materi, permainan, soal: `MATERI`, `dataBermain`, `dtLatih` di `script.js`.
- Zat terlarut dan konstanta (Kb, Kf, R, P°): bagian awal `lab.js`.
