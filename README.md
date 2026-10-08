# Virtual Lab Kimia

Landing page dan empat topik praktikum virtual (Lab Maya).

## Struktur

- `index.html`, `styles.css`, `script.js` : landing page
- `assets/` : logo, foto, dan cuplikan layar kedua lab
- `sel-volta/` : Media Pembelajaran dan Lab Maya Sel Volta
- `sel-elektrolisis/` : Media Pembelajaran dan Lab Maya Sel Elektrolisis
- `sifat-koligatif/` : Media Pembelajaran dan Lab Maya Sifat Koligatif Larutan
- `termokimia/` : Media Pembelajaran dan Lab Maya Termokimia

## Menambah topik baru

1. Salin salah satu folder topik (mis. `sel-volta/`) menjadi folder baru.
2. Ganti isi `CONFIG`, `MATERI`, `dataBermain`, dan `dtLatih` di `script.js` topik tersebut.
3. Duplikasi satu blok `<article class="topic ...">` di `index.html` dan ubah tautannya.
4. Ambil cuplikan layar lab untuk `assets/` dan perbarui angka statistik pada kartu.

## Menjalankan

Buka `index.html` di peramban, atau jalankan `python3 -m http.server 8000` dari folder ini.
