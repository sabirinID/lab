/* ##############################################################
   #  BAGIAN A — KONFIGURASI                                   #
   ############################################################## */
const CONFIG = {
  judul:    "Laju Reaksi",
  subJudul: "Seberapa Cepat Reaksi Berlangsung dan Mengapa",
  fase:     "Fase F • Kelas XI",
  mapel:    "Kimia",
  unit:     "Laju Reaksi",
  subUnit:  "Teori Tumbukan, Faktor-Faktor yang Memengaruhi, dan Orde Reaksi",
  tp:       "Menganalisis faktor-faktor yang memengaruhi laju reaksi berdasarkan teori tumbukan, menentukan persamaan laju dan orde reaksi dari data percobaan, serta menghitung pengaruh suhu terhadap laju reaksi.",
  logo:     "./asset/img/logo.png",
  bgJudul:  "./asset/img/bg_judul.svg",
  profil: {
    nama:     "Syahril Dimas Sabirin, S.Si., Gr.",
    instansi: "SMA Islam Al Azhar 5 Cirebon",
    surel:    "syahrildimassabirin@gmail.com",
    tahun:    "2026",
    jenis:    "Media Pembelajaran Interaktif (MPI)",
    foto:     "./asset/img/profil.jpg"
  },
  referensi: {
    materi: [
      "Badan Standar, Kurikulum, dan Asesmen Pendidikan. (2025). Keputusan Kepala BSKAP Nomor 046/H/KR/2025 tentang Capaian Pembelajaran pada Pendidikan Anak Usia Dini, Jenjang Pendidikan Dasar, dan Jenjang Pendidikan Menengah. Kementerian Pendidikan Dasar dan Menengah.",
      "Chang, R., & Goldsby, K. A. (2016). Chemistry (12th ed.). McGraw-Hill Education.",
      "Petrucci, R. H., Herring, F. G., Madura, J. D., & Bissonnette, C. (2017). General Chemistry: Principles and Modern Applications (11th ed.). Pearson."
    ],
    aset: [
      "Ilustrasi vektor (SVG) pada halaman muka dan halaman materi dibuat khusus untuk media pembelajaran ini.",
      "MyInstants. (2026). Efek suara (sound effect) yang digunakan pada media pembelajaran. Lisensi sesuai ketentuan penggunaan MyInstants. https://www.myinstants.com/"
    ],
    ai: [
      "Draf materi, soal, pembahasan, ilustrasi SVG, dan Lab Maya pada media ini disusun dengan bantuan Claude (Anthropic).",
      "Seluruh konten perlu ditinjau dan disesuaikan oleh pengembang sebelum digunakan di kelas."
    ]
  }
};

/* ##############################################################
   #  BAGIAN B — DATA MATERI BELAJAR (8 HALAMAN)                #
   ############################################################## */
const MATERI = [
  { judul:"1. Mengenal Laju Reaksi", img:"./asset/img/materi_1.svg",
    intro:"Anak-anak, ada reaksi yang selesai dalam sekejap, ada yang butuh bertahun-tahun. Bagaimana kita mengukur kecepatannya?",
    isi:"<p><b>Laju reaksi</b> adalah perubahan konsentrasi pereaksi atau produk per satuan waktu.</p><ul><li><b>v = −Δ[pereaksi] ÷ Δt = +Δ[produk] ÷ Δt</b>, satuan <b>M s⁻¹</b>.</li><li>Contoh: [A] turun dari 0,50 M menjadi 0,20 M dalam 30 s, maka v = 0,30 ÷ 30 = <b>0,010 M/s</b>.</li><li>Cepat: petasan meledak. Lambat: besi berkarat.</li></ul>",
    kuis:{ tanya:"Laju reaksi menyatakan perubahan ... per satuan waktu.", o:["konsentrasi","massa jenis"], j:0 } },

  { judul:"2. Teori Tumbukan", img:"./asset/img/materi_2.svg",
    intro:"Reaksi hanya terjadi bila partikel bertemu. Tetapi bertemu saja belum tentu cukup.",
    isi:"<p>Reaksi berlangsung bila partikel mengalami <b>tumbukan efektif</b>, yaitu:</p><ul><li>energi tumbukan <b>≥ energi aktivasi (Ea)</b>, dan</li><li><b>orientasi</b> tumbukan tepat.</li></ul><p>Makin banyak tumbukan efektif per detik, makin <b>cepat</b> reaksinya.</p>",
    kuis:{ tanya:"Tumbukan efektif memerlukan energi sama atau lebih besar dari ...", o:["energi aktivasi","energi ikatan"], j:0 } },

  { judul:"3. Konsentrasi dan Luas Permukaan", img:"./asset/img/materi_3.svg",
    intro:"Dua faktor pertama berkaitan dengan seberapa sering partikel bertemu.",
    isi:"<ul><li><b>Konsentrasi naik</b>: partikel lebih rapat, tumbukan lebih sering.</li><li><b>Luas permukaan naik</b> (serbuk): bidang sentuh lebih luas, tumbukan lebih banyak.</li><li>Serbuk Zn bereaksi lebih cepat dengan asam daripada sekeping Zn yang massanya sama.</li></ul>",
    kuis:{ tanya:"Zat padat yang bereaksi paling cepat adalah yang berbentuk ...", o:["serbuk","bongkahan"], j:0 } },

  { judul:"4. Suhu dan Katalis", img:"./asset/img/materi_4.svg",
    intro:"Dua faktor berikutnya memengaruhi seberapa banyak tumbukan yang efektif.",
    isi:"<ul><li><b>Suhu naik</b>: energi kinetik partikel naik, lebih banyak tumbukan berenergi ≥ Ea.</li><li><b>Katalis</b>: menurunkan Ea melalui jalur reaksi lain.</li><li>Katalis tidak habis bereaksi dan <b>tidak mengubah ΔH</b>.</li></ul>",
    kuis:{ tanya:"Katalis mempercepat reaksi dengan ... energi aktivasi.", o:["menurunkan","menaikkan"], j:0 } },

  { judul:"5. Persamaan Laju dan Orde Reaksi", img:"./asset/img/materi_5.svg",
    intro:"Hubungan antara laju dan konsentrasi dinyatakan dalam persamaan laju.",
    isi:"<p><b>v = k [A]<sup>m</sup> [B]<sup>n</sup></b></p><ul><li>k = tetapan laju; m dan n = orde terhadap A dan B, <b>ditentukan dari percobaan</b>.</li><li>Orde total = m + n.</li><li>Jika [A] dilipatduakan: orde 0 → laju ×1, orde 1 → ×2, orde 2 → ×4.</li></ul>",
    kuis:{ tanya:"Jika orde terhadap A adalah 2 dan [A] dilipatduakan, laju menjadi ...", o:["4 kali","2 kali"], j:0 } },

  { judul:"6. Menentukan Orde dari Data", img:"./asset/img/materi_6.svg",
    intro:"Bandingkan dua percobaan yang hanya berbeda pada satu konsentrasi.",
    isi:"<p>Data A + B → produk (v dalam M s⁻¹):</p><ul><li>(1) [A] = 0,1; [B] = 0,1; v = 2×10⁻³</li><li>(2) [A] = 0,2; [B] = 0,1; v = 8×10⁻³ (A ×2, v ×4, <b>m = 2</b>)</li><li>(3) [A] = 0,1; [B] = 0,2; v = 4×10⁻³ (B ×2, v ×2, <b>n = 1</b>)</li></ul><p><b>v = k[A]²[B]</b>; k = 2×10⁻³ ÷ (0,1² × 0,1) = <b>2 M⁻² s⁻¹</b>.</p>",
    kuis:{ tanya:"Jika konsentrasi ×2 membuat laju ×2, orde reaksinya ...", o:["1","2"], j:0 } },

  { judul:"7. Pengaruh Suhu secara Kuantitatif", img:"./asset/img/materi_7.svg",
    intro:"Seberapa besar suhu mempercepat reaksi? Ada aturan praktis yang bisa dipakai.",
    isi:"<p>Aturan umum: laju menjadi <b>2 kali</b> setiap kenaikan suhu <b>10 °C</b>.</p><ul><li><b>v₂ = v₁ × 2<sup>(T₂ − T₁)/10</sup></b></li><li><b>t₂ = t₁ ÷ 2<sup>(T₂ − T₁)/10</sup></b></li><li>Contoh: 30 °C → 50 °C, laju ×4, waktu 40 menit menjadi <b>10 menit</b>.</li></ul>",
    kuis:{ tanya:"Suhu naik 30 °C (aturan 2 kali tiap 10 °C), laju menjadi ...", o:["8 kali","6 kali"], j:0 } },

  { judul:"8. Kesimpulan", img:"./asset/img/materi_8.svg",
    intro:"Bagus, anak-anak. Sekarang rangkumlah laju reaksi sebagai satu gagasan yang utuh.",
    isi:"<ul><li>Laju = perubahan konsentrasi per waktu (M s⁻¹).</li><li>Teori tumbukan: tumbukan efektif = energi ≥ Ea dan orientasi tepat.</li><li>Dipercepat oleh <b>konsentrasi</b>, <b>luas permukaan</b>, <b>suhu</b>, dan <b>katalis</b>.</li><li>Persamaan laju v = k[A]<sup>m</sup>[B]<sup>n</sup> ditentukan dari <b>percobaan</b>.</li></ul><p><b>Pesan Pak Sabirin:</b> orde reaksi tidak bisa ditebak dari koefisien persamaan reaksi; selalu bandingkan data percobaan. Setelah ini, kunjungi <b>Lab Maya</b> untuk melihat tumbukan partikel dan menyelidiki reaksi misterius!</p>"
  }
];

/* ##############################################################
   #  BAGIAN C — DATA BERMAIN (10 PERMAINAN)                    #
   ############################################################## */
const dataBermain = [
  { t:'jodoh', sub:'Kenali Istilah Laju Reaksi', ins:'Anak-anak, jodohkan pengertian berikut dengan istilah yang tepat!',
    pairs:[{n:1,teks:'Perubahan konsentrasi per satuan waktu'},{n:2,teks:'Tumbukan yang menghasilkan reaksi'},{n:3,teks:'Energi minimum agar reaksi terjadi'}],
    imgs:[{n:1,i:'./asset/img/game_laju.png',name:'Laju reaksi'},{n:2,i:'./asset/img/game_efektif.png',name:'Tumbukan efektif'},{n:3,i:'./asset/img/game_ea.png',name:'Energi aktivasi'}] },

  { t:'klik', sub:'Pilih yang Paling Cepat', ins:'Seng dengan massa sama direaksikan dengan asam. Bentuk seng mana yang bereaksi PALING CEPAT?',
    opsi:[
      {imgPath:'./asset/img/game_keping.png', t:'Keping', b:false, msg:'Keping memiliki luas permukaan sedang, lebih lambat daripada serbuk.'},
      {imgPath:'./asset/img/game_serbuk.png', t:'Serbuk', b:true, msg:'Benar. Serbuk memiliki luas permukaan terbesar sehingga tumbukan paling banyak.'},
      {imgPath:'./asset/img/game_batang.png', t:'Batang', b:false, msg:'Batang memiliki luas permukaan kecil, sehingga bereaksi lambat.'},
      {imgPath:'./asset/img/game_granula.png', t:'Butiran kasar', b:false, msg:'Butiran kasar lebih luas daripada batang, tetapi masih kalah dari serbuk.'}
    ] },

  { t:'urut', sub:'Urutkan Langkah Menentukan Orde', ins:'Susun langkah menentukan orde reaksi dari data percobaan!',
    urut:['Pilih dua percobaan dengan hanya satu konsentrasi yang berubah','Bandingkan perubahan laju dengan perubahan konsentrasinya','Tentukan orde terhadap pereaksi itu','Tulis persamaan laju v = k[A]ᵐ[B]ⁿ'] },

  { t:'kumpul', sub:'Kumpulkan Pemercepat Reaksi', ins:'Ketuk hanya tanda yang MEMPERCEPAT reaksi (kenaikan suhu). Hindari yang lain!',
    benar:'./asset/img/game_panas.png',
    salah:['./asset/img/game_dingin.png','./asset/img/game_encer.png'] },

  { t:'sambung', sub:'Sambung Konsep Laju Reaksi', ins:'Pilih lanjutan pernyataan yang paling tepat!',
    hasil:'Konsentrasi lebih tinggi memperbanyak tumbukan, katalis menurunkan energi aktivasi, dan permukaan lebih luas memperbanyak bidang sentuh.',
    steps:[
      { prev:'Menaikkan konsentrasi membuat tumbukan antarpartikel ...', benar:'lebih sering terjadi', salah:['lebih jarang terjadi','tidak berubah'] },
      { prev:'Katalis mempercepat reaksi dengan ... energi aktivasi.', benar:'menurunkan', salah:['menaikkan','tidak mengubah'] },
      { prev:'Memperbesar luas permukaan zat padat membuat bidang sentuh ...', benar:'lebih luas sehingga tumbukan lebih banyak', salah:['lebih sempit','tidak berpengaruh'] }
    ] },

  { t:'jodoh', sub:'Jodohkan Faktor dan Penjelasannya', ins:'Jodohkan faktor dengan penjelasan mengapa reaksi menjadi lebih cepat!',
    pairs:[{n:1,teks:'Konsentrasi dinaikkan'},{n:2,teks:'Suhu dinaikkan'},{n:3,teks:'Katalis ditambahkan'}],
    imgs:[{n:1,i:'./asset/img/game_tumbukan.png',name:'Tumbukan lebih sering'},{n:2,i:'./asset/img/game_energi.png',name:'Energi partikel naik'},{n:3,i:'./asset/img/game_ea.png',name:'Ea turun'}] },

  { t:'klik', sub:'Hitung Perubahan Laju', ins:'Reaksi berorde 1 terhadap A. Jika [A] dilipatduakan, laju reaksi menjadi ...',
    opsi:[
      {imgPath:'./asset/img/game_x2.png', t:'2 kali', b:true, msg:'Benar. Orde 1: laju sebanding dengan konsentrasi, 2¹ = 2.'},
      {imgPath:'./asset/img/game_x4.png', t:'4 kali', b:false, msg:'4 kali untuk orde 2 (2² = 4).'},
      {imgPath:'./asset/img/game_x1.png', t:'tetap', b:false, msg:'Laju tetap hanya untuk orde 0.'},
      {imgPath:'./asset/img/game_xsetengah.png', t:'½ kali', b:false, msg:'Menaikkan konsentrasi tidak akan menurunkan laju.'}
    ] },

  { t:'urut', sub:'Urutkan Teori Tumbukan', ins:'Susun urutan peristiwa menurut teori tumbukan!',
    urut:['Partikel pereaksi bergerak dan saling bertumbukan','Tumbukan harus berenergi ≥ energi aktivasi','Orientasi tumbukan harus tepat','Terbentuk kompleks teraktivasi, lalu produk'] },

  { t:'kumpul', sub:'Kumpulkan Katalis', ins:'Ketuk hanya KATALIS (tidak habis bereaksi). Hindari pereaksi dan produk!',
    benar:'./asset/img/game_katalis.png',
    salah:['./asset/img/game_pereaksi.png','./asset/img/game_produk.png'] },

  { t:'sambung', sub:'Sambung Konsep Orde Reaksi', ins:'Lengkapi konsep orde reaksi berikut!',
    hasil:'Orde 0: laju tidak bergantung pada konsentrasi; orde 1: konsentrasi ×2 membuat laju ×2; orde 2: konsentrasi ×2 membuat laju ×4.',
    steps:[
      { prev:'Pada reaksi orde 0, laju ...', benar:'tidak bergantung pada konsentrasi', salah:['sebanding dengan konsentrasi','sebanding dengan kuadrat konsentrasi'] },
      { prev:'Pada orde 1, konsentrasi dilipatduakan membuat laju ...', benar:'menjadi 2 kali', salah:['menjadi 4 kali','tetap'] },
      { prev:'Pada orde 2, konsentrasi dilipatduakan membuat laju ...', benar:'menjadi 4 kali', salah:['menjadi 2 kali','menjadi 8 kali'] }
    ] }
];

/* ##############################################################
   #  BAGIAN D — DATA BERLATIH (10 SOAL EVALUASI)               #
   ############################################################## */
const dtLatih = [
  { t:'pg', soal:'Laju reaksi dinyatakan sebagai ...',
    opsi:['perubahan konsentrasi per satuan waktu','perubahan suhu per satuan waktu','perubahan massa per satuan volume','jumlah seluruh tumbukan partikel','energi aktivasi per mol'], j:0,
    msg:'Laju reaksi adalah perubahan konsentrasi pereaksi atau produk per satuan waktu, dengan satuan M s⁻¹.' },

  { t:'bs', soal:'Katalis mempercepat reaksi dengan cara menaikkan energi aktivasi.', j:false,
    msg:'Pernyataan salah. Katalis menurunkan energi aktivasi melalui jalur reaksi alternatif, sehingga lebih banyak tumbukan yang efektif.' },

  { t:'pg',
    stimulus:'<b>Perhatikan:</b> Pada reaksi A → B, konsentrasi A turun dari 0,50 M menjadi 0,20 M dalam waktu 30 detik.',
    soal:'Laju reaksi rata-rata terhadap A adalah ...',
    opsi:['0,010 M/s','0,0067 M/s','0,017 M/s','0,023 M/s','0,10 M/s'], j:0,
    msg:'v = −Δ[A] ÷ Δt = (0,50 − 0,20) ÷ 30 = 0,30 ÷ 30 = 0,010 M/s.' },

  { t:'pg',
    stimulus:'<b>Data percobaan A + B → produk:</b><br>(1) [A] = 0,1 M; [B] = 0,1 M; v = 3×10⁻³ M/s<br>(2) [A] = 0,2 M; [B] = 0,1 M; v = 12×10⁻³ M/s<br>(3) [A] = 0,1 M; [B] = 0,2 M; v = 6×10⁻³ M/s',
    soal:'Persamaan laju reaksi tersebut adalah ...',
    opsi:['v = k[A]²[B]','v = k[A][B]²','v = k[A][B]','v = k[A]²','v = k[B]'], j:0,
    msg:'Percobaan 1 dan 2: [A] ×2, v ×4, sehingga orde A = 2. Percobaan 1 dan 3: [B] ×2, v ×2, sehingga orde B = 1. Jadi v = k[A]²[B].' },

  { t:'pg_kompleks',
    soal:'Pilih semua tindakan yang dapat mempercepat reaksi.',
    opsi:['Menaikkan suhu','Menurunkan konsentrasi pereaksi','Menggunakan serbuk, bukan keping','Menambahkan katalis yang sesuai','Menurunkan suhu'], j:[0,2,3],
    msg:'Suhu naik, luas permukaan lebih besar, dan katalis meningkatkan jumlah tumbukan efektif. Konsentrasi dan suhu yang lebih rendah justru memperlambat reaksi.' },

  { t:'drag_word', soal:'Lengkapi kalimat berikut: tumbukan efektif terjadi bila energi partikel lebih besar atau sama dengan <span class="blank-slot" data-id="1">___</span>, dengan orientasi yang <span class="blank-slot" data-id="2">___</span>, dan katalis <span class="blank-slot" data-id="3">___</span> energi aktivasi reaksi.', w:['energi aktivasi','tepat','menurunkan','menaikkan','acak'], j:['energi aktivasi','tepat','menurunkan'],
    msg:'Tumbukan efektif memerlukan energi ≥ Ea dan orientasi yang tepat; katalis menurunkan Ea.' },

  { t:'pg',
    stimulus:'<b>Perhatikan:</b> Laju reaksi menjadi 2 kali setiap kenaikan suhu 10 °C. Pada 30 °C reaksi selesai dalam 40 menit.',
    soal:'Waktu yang diperlukan reaksi pada 50 °C adalah ...',
    opsi:['10 menit','20 menit','80 menit','5 menit','160 menit'], j:0,
    msg:'ΔT = 20 °C, sehingga laju ×2² = ×4. Waktu menjadi 40 ÷ 4 = 10 menit.' },

  { t:'pg', soal:'Reaksi berorde 2 terhadap A. Jika [A] dijadikan 3 kali semula, laju reaksi menjadi ...',
    opsi:['9 kali','3 kali','6 kali','27 kali','1/3 kali'], j:0,
    msg:'Orde 2: laju sebanding [A]². Maka laju menjadi 3² = 9 kali semula.' },

  { t:'pg',
    stimulus:'<b>Perhatikan:</b> Reaksi A + B → produk mengikuti v = k[A][B]. Pada [A] = 0,2 M dan [B] = 0,5 M, laju reaksi 0,04 M/s.',
    soal:'Nilai tetapan laju k adalah ...',
    opsi:['0,4 M⁻¹ s⁻¹','0,04 M⁻¹ s⁻¹','4 M⁻¹ s⁻¹','0,008 M⁻¹ s⁻¹','0,2 M⁻¹ s⁻¹'], j:0,
    msg:'k = v ÷ ([A][B]) = 0,04 ÷ (0,2 × 0,5) = 0,04 ÷ 0,1 = 0,4 M⁻¹ s⁻¹.' },

  { t:'jodoh', soal:'Jodohkan faktor dengan pengaruhnya terhadap tumbukan!',
    pairs:[{n:1,t:'Konsentrasi dinaikkan'},{n:2,t:'Suhu dinaikkan'},{n:3,t:'Katalis ditambahkan'}],
    imgs:[{n:1,i:'./asset/img/latih_tumbukan.png',name:'Tumbukan lebih sering'},{n:2,i:'./asset/img/latih_energi.png',name:'Energi partikel naik'},{n:3,i:'./asset/img/latih_ea.png',name:'Ea turun'}],
    msg:'Konsentrasi tinggi memperbanyak tumbukan, suhu tinggi menaikkan energi partikel, dan katalis menurunkan energi aktivasi.' }
];

/* ##############################################################
   #  BAGIAN E — UTILITAS DASAR                                #
   ############################################################## */
function shuffle(a){ for(let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; } return a; }

function showScreen(id){
  document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}
function goJudul(){ stopKumpul(); showScreen('scr-judul'); }
function goMenu(){ stopKumpul(); showScreen('scr-menu'); }

function fitStage(){
  const s=Math.min(window.innerWidth/1280, window.innerHeight/720);
  const st=document.getElementById('stage');
  st.style.transform='scale('+s+')';
  st.style.left=Math.max(0,(window.innerWidth-1280*s)/2)+'px';
  st.style.top=Math.max(0,(window.innerHeight-720*s)/2)+'px';
}

/* --- Placeholder gambar otomatis (jika aset belum tersedia) --- */
function phSVG(txt,sub,w,h,bg1,bg2){
  w=w||200; h=h||200; bg1=bg1||'#EEF2F8'; bg2=bg2||'#D7DEEA';
  const fs = txt.length>3 ? Math.min(w,h)*0.22 : Math.min(w,h)*0.42;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${bg1}"/><stop offset="1" stop-color="${bg2}"/></linearGradient></defs><rect width="${w}" height="${h}" rx="18" fill="url(#g)"/><text x="50%" y="${sub?h*0.46:h*0.52}" dominant-baseline="middle" text-anchor="middle" font-size="${fs}" font-weight="900" fill="#0E2240" font-family="Arial, sans-serif">${txt}</text>${sub?`<text x="50%" y="${h*0.8}" text-anchor="middle" font-size="${Math.max(11,w*0.075)}" font-weight="700" fill="#5A6B84" font-family="Arial, sans-serif">${sub}</text>`:''}</svg>`;
  return 'data:image/svg+xml;utf8,'+encodeURIComponent(svg);
}
function imgErr(el){
  if(!el || el.dataset.errDone) return;
  el.dataset.errDone='1';
  const src=el.getAttribute('src')||'';
  let url;
  if(/bg_judul/i.test(src)){
    const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="1280" height="720"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#16315A"/><stop offset=".55" stop-color="#0E2240"/><stop offset="1" stop-color="#0A1830"/></linearGradient></defs><rect width="1280" height="720" fill="url(#g)"/><circle cx="180" cy="140" r="110" fill="rgba(255,255,255,.05)"/><circle cx="1080" cy="580" r="160" fill="rgba(255,255,255,.05)"/><circle cx="950" cy="110" r="60" fill="rgba(212,238,255,.08)"/><circle cx="320" cy="620" r="80" fill="rgba(255,255,255,.04)"/></svg>`;
    url='data:image/svg+xml;utf8,'+encodeURIComponent(svg);
  } else if(/profil/i.test(src)){
    url=phSVG('👨‍🏫','Pengembang',160,200,'#FFF1E6','#FFD9BD');
  } else {
    let t='🧪', s='';
    const R=[
      [/game_laju/i,'v','Laju reaksi'],[/game_efektif/i,'⚡','Tumbukan efektif'],[/game_ea\./i,'Ea','Energi aktivasi'],
      [/game_keping/i,'Zn','Keping'],[/game_serbuk/i,'Zn','Serbuk'],[/game_batang/i,'Zn','Batang'],[/game_granula/i,'Zn','Butiran kasar'],
      [/game_panas/i,'🔥','Suhu naik'],[/game_dingin/i,'❄️','Suhu turun'],[/game_encer/i,'💧','Diencerkan'],
      [/game_tumbukan|latih_tumbukan/i,'⇄','Tumbukan lebih sering'],[/game_energi|latih_energi/i,'🌡️','Energi partikel naik'],[/latih_ea/i,'Ea','Ea turun'],
      [/game_xsetengah/i,'×½','kali'],[/game_x2/i,'×2','kali'],[/game_x4/i,'×4','kali'],[/game_x1/i,'×1','tetap'],
      [/game_katalis/i,'Kat','Katalis'],[/game_pereaksi/i,'A+B','Pereaksi'],[/game_produk/i,'P','Produk'],
      [/belajar/i,'📖','Belajar'],[/bermain/i,'🎮','Bermain'],[/berlatih/i,'✍️','Berlatih'],[/materi/i,'🧪','Materi']
    ];
    for(const r of R){ const m=src.match(r[0]); if(m){ t=r[1].replace('$1',m[1]||''); s=r[2]; break; } }
    url=phSVG(t,s,200,200);
  }
  el.src=url;
}

/* --- Efek suara (WebAudio, tanpa file eksternal) --- */
let audioCtx=null, soundOn=true, volume=10;
function ensureCtx(){
  if(!audioCtx){ try{ audioCtx=new (window.AudioContext||window.webkitAudioContext)(); }catch(e){ audioCtx=null; } }
  if(audioCtx && audioCtx.state==='suspended') audioCtx.resume();
}
function tone(freq,dur,type,gain,delay){
  if(!soundOn||!audioCtx) return;
  const t0=audioCtx.currentTime+(delay||0);
  const o=audioCtx.createOscillator(), g=audioCtx.createGain();
  o.type=type||'sine'; o.frequency.value=freq;
  o.connect(g); g.connect(audioCtx.destination);
  g.gain.setValueAtTime((gain||.15)*volume,t0);
  g.gain.exponentialRampToValueAtTime(.001,t0+dur);
  o.start(t0); o.stop(t0+dur+.05);
}
function sfx(n){
  ensureCtx();
  if(!soundOn||!audioCtx) return;
  switch(n){
    case 'click': tone(620,.07,'triangle',.10); break;
    case 'pop': tone(880,.06,'square',.07); break;
    case 'benar': tone(523,.12,'sine',.16); tone(659,.12,'sine',.16,.10); tone(784,.22,'sine',.16,.20); break;
    case 'salah': tone(220,.22,'sawtooth',.10); tone(160,.28,'sawtooth',.09,.12); break;
    case 'win': [523,659,784,1046,1318].forEach((f,i)=>tone(f,.16,'sine',.14,i*.12)); break;
  }
}
function toggleSound(){
  soundOn=!soundOn;
  document.getElementById('sound-toggle').textContent = soundOn?'🔊':'🔇';
  if(soundOn) sfx('click');
}
function changeVolume(v){ volume=parseFloat(v); }

/* --- Efek visual --- */
function efekSalahFlash(){
  const e=document.getElementById('efek-salah');
  e.classList.add('nyala');
  setTimeout(()=>e.classList.remove('nyala'),120);
}
function confettiBurst(x,y,n,host){
  const scr=host||document.querySelector('.screen.active');
  if(!scr) return;
  const warna=['#F26A21','#FFC21A','#FFFFFF','#16315A','#FF9A5C','#FFD86B','#2E7DD1'];
  for(let i=0;i<(n||24);i++){
    const d=document.createElement('div');
    d.className='confetti';
    d.style.left=x+'px'; d.style.top=y+'px';
    d.style.background=warna[i%warna.length];
    d.style.borderRadius=Math.random()>.5?'50%':'3px';
    d.style.setProperty('--tx',(Math.random()*480-240)+'px');
    d.style.setProperty('--ty',(Math.random()*-280-60)+'px');
    scr.appendChild(d);
    setTimeout(()=>d.remove(),1600);
  }
}
let gToastEl=null, gToastT=null;
function showToast(msg){
  if(!gToastEl){
    gToastEl=document.createElement('div');
    gToastEl.className='lab-toast';
    gToastEl.style.top='96px'; gToastEl.style.zIndex='70';
    document.getElementById('stage').appendChild(gToastEl);
  }
  gToastEl.textContent=msg;
  gToastEl.classList.add('show');
  clearTimeout(gToastT);
  gToastT=setTimeout(()=>gToastEl.classList.remove('show'),2600);
}

/* ##############################################################
   #  BAGIAN F — IDENTITAS & MODAL                              #
   ############################################################## */
let siswa={nama:'',sekolah:'',kelas:''};
let akhirDari='';
function openModal(id){ document.getElementById(id).classList.add('show'); }
function closeModal(id){ document.getElementById(id).classList.remove('show'); }
function simpanIdentitas(){
  const nama=document.getElementById('in-nama').value.trim();
  const pesan=document.getElementById('login-pesan');
  if(!nama){ pesan.style.display='block'; sfx('salah'); efekSalahFlash(); return; }
  siswa={ nama:nama, sekolah:document.getElementById('in-sekolah').value.trim(), kelas:document.getElementById('in-kelas').value.trim() };
  pesan.style.display='none';
  closeModal('modal-login');
  document.getElementById('audio-widget').style.display='flex';
  goMenu();
  showToast('👋 Selamat belajar, '+siswa.nama+'!');
}
function tampilAkhir(judul,skor,kal,dari){
  akhirDari=dari||akhirDari;
  document.getElementById('akhir-judul').textContent=judul;
  const sa=document.getElementById('akhir-skor');
  if(skor==null){ sa.style.display='none'; } else { sa.style.display='block'; sa.textContent=skor; }
  document.getElementById('akhir-kal').textContent=kal;
  document.getElementById('akhir-ident').textContent=(siswa.nama||'Siswa')+(siswa.kelas?' • Kelas '+siswa.kelas:'')+(siswa.sekolah?' • '+siswa.sekolah:'');
  openModal('modal-akhir');
  sfx('win');
  confettiBurst(640,280,30);
}
function ulangi(){
  closeModal('modal-akhir');
  if(akhirDari==='berlatih') startBerlatih();
  else if(akhirDari==='bermain') startBermain();
  else goMenu();
}

/* ##############################################################
   #  BAGIAN G — MESIN BELAJAR                                  #
   ############################################################## */
let belajarIdx=0;
function startBelajar(){ belajarIdx=0; renderBelajar(); showScreen('scr-belajar'); }
function belajarPrev(){ if(belajarIdx>0){ belajarIdx--; renderBelajar(); } }
function belajarNext(){
  if(belajarIdx<MATERI.length-1){ belajarIdx++; renderBelajar(); }
  else{
    akhirDari='belajar';
    tampilAkhir('📖 Belajar Selesai', null, 'Materi Laju Reaksi telah kamu pelajari. Lanjutkan ke Bermain atau praktikum di Lab Maya! 🔬', 'belajar');
  }
}
function renderBelajar(){
  const m=MATERI[belajarIdx];
  document.getElementById('belajar-sub').textContent=m.judul;
  document.getElementById('belajar-plabel').textContent=(belajarIdx+1)+'/'+MATERI.length;
  document.getElementById('belajar-pfill').style.width=((belajarIdx+1)/MATERI.length*100)+'%';
  document.getElementById('belajar-prev').disabled=(belajarIdx===0);
  document.getElementById('belajar-next').textContent=(belajarIdx===MATERI.length-1)?'Selesai Belajar 🏁':'Selanjutnya ▶';
  document.getElementById('belajar-content').innerHTML=`
    <div class="belajar-frame">
      <div class="belajar-img-sisi"><img src="${m.img}" alt="Ilustrasi ${m.judul}" onerror="imgErr(this)"></div>
      <div class="belajar-teks-sisi">
        <h2>${m.judul}</h2>
        <div class="belajar-intro">${m.intro}</div>
        <div class="belajar-isi">${m.isi}</div>
        ${m.kuis?kuisMiniHTML(m.kuis):''}
      </div>
    </div>`;
}
function kuisMiniHTML(k){
  return `<div class="belajar-kuis">
    <p class="bk-tanya">🧠 Cek Pemahaman: ${k.tanya}</p>
    <div class="bk-opsi">${k.o.map((o,i)=>`<button class="btn btn-biru" data-sfx onclick="jawabKuisMini(this,${i===k.j})">${o}</button>`).join('')}</div>
    <div class="feedback" id="fb-kuismini"></div>
  </div>`;
}
function jawabKuisMini(btn,benar){
  const fb=document.getElementById('fb-kuismini');
  if(benar){
    btn.style.background='linear-gradient(135deg,#1E8E5A,#146B42)';
    fb.className='feedback show ok'; fb.textContent='🎉 Benar sekali! Kamu siap melanjutkan.';
    sfx('benar'); confettiBurst(600,280,16);
  }else{
    btn.style.background='linear-gradient(135deg,#D64545,#A62B2B)';
    fb.className='feedback show no'; fb.textContent='💡 Belum tepat. Baca kembali materi di atas, lalu coba lagi!';
    sfx('salah'); efekSalahFlash();
  }
}

/* ##############################################################
   #  BAGIAN H — MESIN BERMAIN                                  #
   ############################################################## */
let bmainIdx=0, bmainSkor=0, bmainSelesai=false;
let curKlik=null, curUrut=null, sb={step:0,built:[]}, kp={running:false};

function startBermain(){
  bmainIdx=0; bmainSkor=0;
  document.getElementById('skor-bermain-angka').textContent='0';
  renderBermain();
  showScreen('scr-bermain');
}
function bermainPrev(){ if(bmainIdx>0){ bmainIdx--; renderBermain(); } }
function bermainNext(){
  if(!bmainSelesai) return;
  if(bmainIdx<dataBermain.length-1){ bmainIdx++; renderBermain(); }
  else{
    let kal; const s=bmainSkor;
    if(s>=90) kal='Luar biasa! Kamu mahir bermain sambil belajar Sel Elektrolisis. 🎮';
    else if(s>=60) kal='Bagus! Terus asah pemahamanmu melalui permainan ini.';
    else kal='Keren sudah mencoba! Ulangi permainan untuk meraih skor lebih baik.';
    tampilAkhir('🎮 Bermain Selesai', s, kal, 'bermain');
  }
}
function renderBermain(){
  stopKumpul();
  const d=dataBermain[bmainIdx];
  bmainSelesai=false;
  document.getElementById('bermain-next').disabled=true;
  document.getElementById('bermain-prev').disabled=(bmainIdx===0);
  document.getElementById('bermain-next').textContent=(bmainIdx===dataBermain.length-1)?'Selesai Bermain 🏁':'Selanjutnya ▶';
  document.getElementById('bermain-sub').textContent=d.sub;
  document.getElementById('bermain-plabel').textContent=(bmainIdx+1)+'/'+dataBermain.length;
  document.getElementById('bermain-pfill').style.width=((bmainIdx+1)/dataBermain.length*100)+'%';
  const c=document.getElementById('bermain-content');
  if(d.t==='jodoh'){
    c.innerHTML=jodohHTML(d);
    initJodoh(()=>{
      const fb=document.getElementById('fb-jodoh');
      fb.className='feedback show ok';
      fb.textContent='🎉 Semua pasangan berhasil dijodohkan!';
      completeBermain();
    });
  }
  else if(d.t==='klik'){ curKlik=d; c.innerHTML=gameKlikHTML(d); }
  else if(d.t==='urut'){
    let ord=shuffle(d.urut.map((_,i)=>i));
    if(ord.length>1 && ord.every((v,i)=>v===i)) ord=shuffle(ord);
    curUrut={d:d, order:ord, ok:false};
    c.innerHTML=gameUrutHTML(d);
    renderUrutList();
  }
  else if(d.t==='kumpul'){ c.innerHTML=gameKumpulHTML(d); startKumpul(d); }
  else if(d.t==='sambung'){ sb={step:0,built:[]}; c.innerHTML=gameSambungHTML(d); drawSambung(); }
}
function completeBermain(){
  if(bmainSelesai) return;
  bmainSelesai=true;
  stopKumpul();
  document.getElementById('bermain-next').disabled=false;
  bmainSkor+=10;
  document.getElementById('skor-bermain-angka').textContent=bmainSkor;
  sfx('win');
  confettiBurst(620,240,26);
}

/* --- Game: JODOH (dipakai juga oleh Berlatih) --- */
let jodohState=null;
function jodohHTML(d){
  const ins=d.ins||d.soal||'';
  return `<div class="akt-instruksi">${ins}</div>
  <div class="jodoh-wrap" id="jodoh-wrap">
    <svg id="jodoh-svg" viewBox="0 0 100 100" preserveAspectRatio="none" style="position:absolute; inset:0; width:100%; height:100%; z-index:1; pointer-events:none;"></svg>
    <div class="jodoh-kol jk-kiri">
      ${d.pairs.map(p=>`<button class="pair-item" data-n="${p.n}" data-sfx>${p.n}. ${p.teks||p.t}</button>`).join('')}
    </div>
    <div class="jodoh-kol jk-kanan">
      ${shuffle(d.imgs.slice()).map(im=>`<button class="pair-item" data-n="${im.n}" data-sfx><img class="img-pair" src="${im.i}" alt="${im.name}" onerror="imgErr(this)"><span>${im.name}</span></button>`).join('')}
    </div>
  </div>
  <div class="feedback" id="fb-jodoh"></div>`;
}
function initJodoh(onAllDone){
  const wrap=document.getElementById('jodoh-wrap');
  if(!wrap) return;
  jodohState={selA:null,selB:null,done:0,wrong:0,total:wrap.querySelectorAll('.jk-kiri .pair-item').length,lines:[]};
  wrap.querySelectorAll('.pair-item').forEach(btn=>{
    btn.addEventListener('click',()=>{
      if(btn.classList.contains('locked')||btn.classList.contains('salah')) return;
      const kiri=btn.parentElement.classList.contains('jk-kiri');
      if(kiri){ if(jodohState.selA) jodohState.selA.classList.remove('sel'); jodohState.selA=btn; }
      else{ if(jodohState.selB) jodohState.selB.classList.remove('sel'); jodohState.selB=btn; }
      btn.classList.add('sel');
      const a=jodohState.selA, b=jodohState.selB;
      if(a&&b){
        if(a.dataset.n===b.dataset.n){
          a.classList.remove('sel'); b.classList.remove('sel');
          a.classList.add('locked'); b.classList.add('locked');
          jodohState.lines.push(+a.dataset.n);
          jodohState.done++;
          drawJodohLines();
          sfx('benar');
          const fb=document.getElementById('fb-jodoh');
          fb.className='feedback show ok';
          fb.textContent='✅ Tepat! Pasangan benar ('+jodohState.done+'/'+jodohState.total+')';
          jodohState.selA=jodohState.selB=null;
          if(jodohState.done>=jodohState.total && onAllDone) onAllDone(jodohState.wrong);
        }else{
          jodohState.wrong++;
          a.classList.add('salah'); b.classList.add('salah');
          sfx('salah'); efekSalahFlash();
          setTimeout(()=>{
            a.classList.remove('salah','sel'); b.classList.remove('salah','sel');
            if(jodohState.selA===a) jodohState.selA=null;
            if(jodohState.selB===b) jodohState.selB=null;
          },480);
        }
      }
    });
  });
}
function drawJodohLines(){
  const wrap=document.getElementById('jodoh-wrap');
  const svg=document.getElementById('jodoh-svg');
  if(!wrap||!svg||!jodohState) return;
  const wr=wrap.getBoundingClientRect();
  const sc=(wr.width/wrap.offsetWidth)||1;
  svg.setAttribute('viewBox','0 0 '+wrap.offsetWidth+' '+wrap.offsetHeight);
  svg.innerHTML=jodohState.lines.map(n=>{
    const a=wrap.querySelector('.jk-kiri .pair-item[data-n="'+n+'"]');
    const b=wrap.querySelector('.jk-kanan .pair-item[data-n="'+n+'"]');
    if(!a||!b) return '';
    const ra=a.getBoundingClientRect(), rb=b.getBoundingClientRect();
    const x1=(ra.right-wr.left)/sc-8, y1=(ra.top+ra.height/2-wr.top)/sc;
    const x2=(rb.left-wr.left)/sc+8, y2=(rb.top+rb.height/2-wr.top)/sc;
    return '<line class="jodoh-line" x1="'+x1.toFixed(1)+'" y1="'+y1.toFixed(1)+'" x2="'+x2.toFixed(1)+'" y2="'+y2.toFixed(1)+'" stroke="#F26A21" stroke-width="5" stroke-linecap="round"/>';
  }).join('');
}

/* --- Game: KLIK (pilih objek) --- */
function gameKlikHTML(d){
  return `<div class="akt-instruksi">${d.ins}</div>
  <div class="scene-grid" style="flex:1;">${d.opsi.map((o,i)=>`
    <button class="obj-card" data-sfx onclick="klikJawab(this,${i})">
      <img class="img-obj" src="${o.imgPath}" alt="" onerror="imgErr(this)">
      <span>${o.t}</span>
    </button>`).join('')}
  </div>
  <div class="feedback" id="fb-klik"></div>`;
}
function klikJawab(btn,i){
  if(bmainSelesai) return;
  const d=curKlik, o=d.opsi[i];
  const fb=document.getElementById('fb-klik');
  if(o.b){
    btn.classList.add('benar');
    fb.className='feedback show ok'; fb.textContent='🎉 '+o.msg;
    completeBermain();
  }else{
    btn.classList.add('salah');
    sfx('salah'); efekSalahFlash();
    fb.className='feedback show no'; fb.textContent='💡 '+o.msg;
    setTimeout(()=>btn.classList.remove('salah'),900);
  }
}

/* --- Game: URUT (susun urutan) --- */
function gameUrutHTML(d){
  return `<div class="akt-instruksi">${d.ins}</div>
  <div style="flex:1; overflow-y:auto; padding-right:6px;" id="urut-list"></div>
  <div style="text-align:center; margin-top:10px;">
    <button class="btn btn-kuning" data-sfx style="height:52px; padding:0 32px; font-size:18px;" onclick="urutPeriksa()">✅ Periksa Urutan</button>
  </div>
  <div class="feedback" id="fb-urut"></div>`;
}
function renderUrutList(){
  if(!curUrut) return;
  const d=curUrut.d, order=curUrut.order;
  const list=document.getElementById('urut-list');
  if(!list) return;
  list.innerHTML=order.map((idx,pos)=>`
    <div class="urut-item ${curUrut.ok?'ok':''}">
      <div class="num">${pos+1}</div>
      <span>${d.urut[idx]}</span>
      <button class="btn btn-kuning" data-sfx ${pos===0?'disabled':''} onclick="urutGeser(${pos},-1)" title="Naik">▲</button>
      <button class="btn btn-kuning" data-sfx ${pos===order.length-1?'disabled':''} onclick="urutGeser(${pos},1)" title="Turun">▼</button>
    </div>`).join('');
}
function urutGeser(pos,dir){
  if(!curUrut) return;
  const o=curUrut.order, j=pos+dir;
  if(j<0||j>=o.length) return;
  [o[pos],o[j]]=[o[j],o[pos]];
  renderUrutList();
}
function urutPeriksa(){
  if(bmainSelesai||!curUrut) return;
  const d=curUrut.d, o=curUrut.order;
  const fb=document.getElementById('fb-urut');
  const ok=o.every((idx,i)=>idx===i);
  if(ok){
    curUrut.ok=true; renderUrutList();
    fb.className='feedback show ok'; fb.textContent='🎉 Urutan tepat! Alur prosesnya sudah kamu kuasai.';
    completeBermain();
  }else{
    fb.className='feedback show no'; fb.textContent='💡 Belum tepat. Geser kartu dengan tombol ▲▼ sesuai urutan yang benar.';
    sfx('salah'); efekSalahFlash();
  }
}

/* --- Game: KUMPUL (ketuk berwaktu) --- */
function gameKumpulHTML(d){
  return `<div class="akt-instruksi">${d.ins}</div>
  <div class="kumpul-hud">
    <div class="hud-box hud-time">⏱ <span id="kp-time">25</span> detik</div>
    <div class="hud-box hud-coll">🎯 <span id="kp-coll">0</span> / <span id="kp-need">6</span></div>
  </div>
  <div class="kumpul-area" id="kp-area"></div>
  <div class="feedback" id="fb-kp"></div>
  <div id="kp-ctrl" style="text-align:center; margin-top:10px;"></div>`;
}
function startKumpul(d){
  stopKumpul();
  kp={d:d, time:25, coll:0, need:6, running:true, timeT:null, spawnT:null};
  document.getElementById('kp-need').textContent=kp.need;
  document.getElementById('kp-ctrl').innerHTML='';
  const fb=document.getElementById('fb-kp');
  if(fb) fb.className='feedback';
  updateKpHUD();
  kp.timeT=setInterval(()=>{
    kp.time--; updateKpHUD();
    if(kp.time<=0){ stopKumpul(); evaluasiKumpul(); }
  },1000);
  kp.spawnT=setInterval(()=>spawnFlag(),750);
  spawnFlag();
}
function updateKpHUD(){
  const t=document.getElementById('kp-time'), c=document.getElementById('kp-coll');
  if(t) t.textContent=Math.max(0,kp.time);
  if(c) c.textContent=kp.coll;
}
function spawnFlag(){
  if(!kp.running) return;
  const area=document.getElementById('kp-area');
  if(!area){ stopKumpul(); return; }
  const d=kp.d;
  const isBenar=Math.random()<0.55;
  const src=isBenar? d.benar : d.salah[Math.floor(Math.random()*d.salah.length)];
  const f=document.createElement('div');
  f.className='kumpul-flag';
  f.dataset.b=isBenar?'1':'0';
  const ar=area.offsetWidth, ah=area.offsetHeight;
  f.style.left=Math.max(6,Math.random()*(ar-100))+'px';
  f.style.top=Math.max(6,Math.random()*(ah-100))+'px';
  f.innerHTML='<img src="'+src+'" alt="" onerror="imgErr(this)">';
  f.addEventListener('click',()=>{
    if(!kp.running) return;
    if(f.dataset.b==='1'){
      kp.coll++; sfx('pop'); updateKpHUD();
      f.remove();
      if(kp.coll>=kp.need){ stopKumpul(); menangKumpul(); }
    }else{
      kp.coll=Math.max(0,kp.coll-1);
      sfx('salah'); efekSalahFlash(); updateKpHUD();
      f.remove();
    }
  });
  area.appendChild(f);
  setTimeout(()=>{ if(f.parentNode) f.remove(); },2600);
}
function menangKumpul(){
  const fb=document.getElementById('fb-kp');
  fb.className='feedback show ok';
  fb.textContent='🎉 Hebat! Kamu berhasil mengumpulkan '+kp.need+' simbol yang tepat.';
  completeBermain();
}
function evaluasiKumpul(){
  if(kp.coll>=kp.need){ menangKumpul(); return; }
  const fb=document.getElementById('fb-kp');
  fb.className='feedback show no';
  fb.textContent='⏱ Waktu habis! Target belum tercapai (terkumpul '+kp.coll+'/'+kp.need+'). Yuk coba lagi!';
  const ctrl=document.getElementById('kp-ctrl');
  if(ctrl) ctrl.innerHTML='<button class="btn btn-kuning" data-sfx style="height:52px; padding:0 32px; font-size:18px;" onclick="startKumpul(kp.d)">🔁 Coba Lagi</button>';
}
function stopKumpul(){
  if(kp.timeT) clearInterval(kp.timeT);
  if(kp.spawnT) clearInterval(kp.spawnT);
  kp.timeT=null; kp.spawnT=null; kp.running=false;
}

/* --- Game: SAMBUNG (lanjutkan kalimat) --- */
function gameSambungHTML(d){
  return `<div class="akt-instruksi">${d.ins}</div>
  <div class="sambung-lirik" id="sb-lirik"></div>
  <div class="sambung-opsi" id="sb-opsi"></div>
  <div class="feedback" id="fb-sb"></div>`;
}
function drawSambung(){
  const d=dataBermain[bmainIdx], st=d.steps[sb.step];
  const built=sb.built.length? sb.built.join(' ')+' ':'';
  document.getElementById('sb-lirik').innerHTML=built+'<span style="border-bottom:5px dashed #FFC21A; padding:0 12px;">'+st.prev+' ...?</span>';
  document.getElementById('sb-opsi').innerHTML=shuffle([{t:st.benar,b:true}].concat(st.salah.map(s=>({t:s,b:false})))).map(o=>'<button class="sambung-btn" data-sfx onclick="sbJawab(this,'+o.b+')">'+o.t+'</button>').join('');
}
function sbJawab(btn,b){
  if(b){
    btn.classList.add('benar'); sfx('benar');
    sb.built.push(btn.textContent); sb.step++;
    const d=dataBermain[bmainIdx];
    if(sb.step>=d.steps.length){
      document.getElementById('sb-lirik').innerHTML='💡 <b>Kesimpulan:</b> '+d.hasil;
      document.getElementById('sb-opsi').innerHTML='';
      completeBermain();
    }else setTimeout(drawSambung,650);
  }else{
    btn.classList.add('salah'); btn.disabled=true;
    sfx('salah'); efekSalahFlash();
  }
}

/* ##############################################################
   #  BAGIAN I — MESIN BERLATIH                                 #
   ############################################################## */
let latihIdx=0, latihSkor=0, latihAnswered=false;
let dw={attempts:0};

function startBerlatih(){
  latihIdx=0; latihSkor=0;
  updateSkorLatih();
  renderLatih();
  showScreen('scr-berlatih');
}
function berlatihPrev(){ if(latihIdx>0){ latihIdx--; renderLatih(); } }
function berlatihNext(){
  if(!latihAnswered) return;
  if(latihIdx<dtLatih.length-1){ latihIdx++; renderLatih(); }
  else{
    let kal; const s=latihSkor;
    if(s>=90) kal='Luar biasa! Pemahamanmu tentang Laju Reaksi sangat mantap. ⚗️';
    else if(s>=70) kal='Bagus! Sedikit lagi menuju sempurna.';
    else if(s>=50) kal='Cukup baik. Pelajari kembali bagian yang belum dikuasai, ya!';
    else kal='Jangan menyerah! Baca ulang materi Belajar, lalu coba Berlatih lagi.';
    tampilAkhir('📝 Berlatih Selesai', s, kal, 'berlatih');
  }
}
function updateSkorLatih(){ document.getElementById('skor-berlatih-angka').textContent=latihSkor; }
function renderLatih(){
  const d=dtLatih[latihIdx];
  latihAnswered=false;
  document.getElementById('berlatih-next').disabled=true;
  document.getElementById('berlatih-prev').disabled=(latihIdx===0);
  document.getElementById('berlatih-next').textContent=(latihIdx===dtLatih.length-1)?'Lihat Hasil 🏁':'Selanjutnya ▶';
  const jenis={pg:'Pilihan Ganda',bs:'Benar / Salah',drag_word:'Isi Rumpang',pg_kompleks:'PG Kompleks',jodoh:'Jodohkan'}[d.t]||'Soal';
  document.getElementById('berlatih-sub').textContent='Soal '+(latihIdx+1)+' — '+jenis;
  document.getElementById('berlatih-plabel').textContent=(latihIdx+1)+'/'+dtLatih.length;
  document.getElementById('berlatih-pfill').style.width=((latihIdx+1)/dtLatih.length*100)+'%';
  const c=document.getElementById('berlatih-content');
  if(d.t==='pg') c.innerHTML=latihPGHTML(d);
  else if(d.t==='bs') c.innerHTML=latihBSHTML(d);
  else if(d.t==='drag_word'){ c.innerHTML=latihDWHTML(d); initDW(); }
  else if(d.t==='pg_kompleks') c.innerHTML=latihPGKHTML(d);
  else if(d.t==='jodoh'){
    c.innerHTML=jodohHTML(d);
    initJodoh((wrong)=>{
      const dd=dtLatih[latihIdx];
      latihAnswered=true;
      const pts=(wrong===0)?10:5;
      latihSkor+=pts; updateSkorLatih();
      const fb=document.getElementById('fb-jodoh');
      fb.className='feedback show ok';
      fb.textContent=(wrong===0?'🎉 Sempurna! ':'🎉 Selesai! ')+dd.msg;
      document.getElementById('berlatih-next').disabled=false;
      sfx('win'); confettiBurst(600,260,22);
    });
  }
}
function latihPGHTML(d){
  const opsi=d.opsi.map((o,i)=>'<button class="opsi" data-sfx onclick="latihPGJawab('+i+')"><span class="bul">'+String.fromCharCode(65+i)+'</span><span>'+o+'</span></button>').join('');
  if(d.stimulus){
    return `<div class="soal-split">
      <div class="soal-kiri">
        <div class="soal-label">Soal ${latihIdx+1} dari ${dtLatih.length}</div>
        <div class="soal-teks">${d.soal}</div>
        <div class="soal-stimulus">${d.stimulus}</div>
      </div>
      <div class="opsi-kanan">
        <div class="opsi-list">${opsi}</div>
        <div class="feedback" id="fb-latih"></div>
      </div>
    </div>`;
  }
  return '<div class="center-col"><div class="soal">'+d.soal+'</div><div class="opsi-grid" style="align-content:center">'+opsi+'</div><div class="feedback" id="fb-latih"></div></div>';
}
function latihPGJawab(i){
  if(latihAnswered) return;
  const d=dtLatih[latihIdx];
  const btns=document.querySelectorAll('#berlatih-content .opsi');
  const fb=document.getElementById('fb-latih');
  latihAnswered=true;
  btns.forEach(b=>b.classList.add('dim'));
  if(i===d.j){
    btns[i].classList.add('benar');
    fb.className='feedback show ok'; fb.textContent='🎉 Benar! '+d.msg;
    latihSkor+=10; updateSkorLatih();
    sfx('benar'); confettiBurst(600,260,22);
  }else{
    btns[i].classList.add('salah'); btns[d.j].classList.add('benar');
    fb.className='feedback show no'; fb.textContent='💡 Belum tepat. '+d.msg;
    sfx('salah'); efekSalahFlash();
  }
  document.getElementById('berlatih-next').disabled=false;
}
function latihBSHTML(d){
  return `<div class="center-col" style="align-items:center; text-align:center;">
    <div class="soal" style="text-align:left; align-self:stretch;">${d.soal}</div>
    <div style="font-weight:800; color:#5A6B84; font-size:16px; margin-bottom:14px;">Tentukan apakah pernyataan di atas BENAR atau SALAH!</div>
    <div class="bs-grid" style="width:100%; max-width:720px;">
      <button class="bs-btn bs-benar" data-sfx onclick="latihBSJawab(true)">✔ BENAR</button>
      <button class="bs-btn bs-salah" data-sfx onclick="latihBSJawab(false)">✘ SALAH</button>
    </div>
    <div class="feedback" id="fb-latih"></div>
  </div>`;
}
function latihBSJawab(val){
  if(latihAnswered) return;
  const d=dtLatih[latihIdx];
  latihAnswered=true;
  document.querySelectorAll('#berlatih-content .bs-btn').forEach(b=>b.style.pointerEvents='none');
  const fb=document.getElementById('fb-latih');
  if(val===d.j){
    fb.className='feedback show ok'; fb.textContent='🎉 Benar! '+d.msg;
    latihSkor+=10; updateSkorLatih();
    sfx('benar'); confettiBurst(600,260,22);
  }else{
    fb.className='feedback show no';
    fb.textContent='💡 Belum tepat. Pernyataan ini sebenarnya '+(d.j?'BENAR':'SALAH')+'. '+d.msg;
    sfx('salah'); efekSalahFlash();
  }
  document.getElementById('berlatih-next').disabled=false;
}
function latihDWHTML(d){
  return `<div class="center-col" style="align-items:center;">
    <div class="kalimat-drag" style="width:100%; text-align:left;">${d.soal}</div>
    <div class="word-pool" id="dw-pool">${d.w.map((w,i)=>'<button class="word-btn" data-sfx data-w="'+w+'" onclick="dwPilih('+i+')">'+w+'</button>').join('')}</div>
    <div><button class="btn btn-kuning" data-sfx style="height:54px; padding:0 34px; font-size:19px;" onclick="dwPeriksa()">✅ Periksa Jawaban</button></div>
    <div class="feedback" id="fb-latih"></div>
  </div>`;
}
function initDW(){
  dw={attempts:0};
  document.querySelectorAll('#berlatih-content .blank-slot').forEach(slot=>{
    slot.addEventListener('click',()=>{
      if(!slot.classList.contains('terisi')) return;
      const w=slot.dataset.word;
      slot.classList.remove('terisi','salah-slot');
      slot.textContent='___';
      delete slot.dataset.word;
      const btn=document.querySelector('#dw-pool .word-btn[data-w="'+w+'"]');
      if(btn) btn.classList.remove('dipakai');
    });
  });
}
function dwPilih(i){
  const btn=document.querySelectorAll('#dw-pool .word-btn')[i];
  if(!btn||btn.classList.contains('dipakai')) return;
  const slot=[...document.querySelectorAll('#berlatih-content .blank-slot')].find(s=>!s.classList.contains('terisi'));
  if(!slot) return;
  slot.textContent=btn.textContent;
  slot.dataset.word=btn.textContent;
  slot.classList.add('terisi');
  btn.classList.add('dipakai');
  sfx('pop');
}
function dwPeriksa(){
  if(latihAnswered) return;
  const d=dtLatih[latihIdx];
  const slots=[...document.querySelectorAll('#berlatih-content .blank-slot')];
  if(slots.some(s=>!s.classList.contains('terisi'))){ showToast('💡 Lengkapi semua isian dulu!'); return; }
  dw.attempts++;
  const fb=document.getElementById('fb-latih');
  const allOk=slots.every((s,i)=>s.dataset.word===d.j[i]);
  if(allOk){
    latihAnswered=true;
    latihSkor+=(dw.attempts===1)?10:5;
    updateSkorLatih();
    fb.className='feedback show ok'; fb.textContent='🎉 '+(dw.attempts===1?'Benar!':'Tepat! ')+' '+d.msg;
    document.getElementById('berlatih-next').disabled=false;
    sfx('benar'); confettiBurst(600,260,22);
  }else{
    slots.forEach((s,i)=>{ if(s.dataset.word!==d.j[i]) s.classList.add('salah-slot'); });
    fb.className='feedback show no';
    fb.textContent='💡 Belum tepat. '+d.msg+' Klik isian yang bertanda merah untuk mengembalikan kata, lalu susun ulang.';
    sfx('salah'); efekSalahFlash();
  }
}
function latihPGKHTML(d){
  return `<div class="center-col">
    <div class="soal">${d.soal}<small style="display:block; font-size:15px; font-weight:700; color:#5A6B84; margin-top:6px;">✔ Pilih semua pernyataan yang benar, lalu tekan Periksa!</small></div>
    <div class="opsi-grid" style="align-content:center;">${d.opsi.map((o,i)=>'<button class="opsi opsi-kompleks" data-sfx onclick="this.classList.toggle(\'terpilih\')"><span class="bul">'+String.fromCharCode(65+i)+'</span><span>'+o+'</span></button>').join('')}</div>
    <div style="text-align:center;"><button class="btn btn-kuning" data-sfx style="height:54px; padding:0 34px; font-size:19px;" onclick="pgkPeriksa()">✅ Periksa Jawaban</button></div>
    <div class="feedback" id="fb-latih"></div>
  </div>`;
}
function pgkPeriksa(){
  if(latihAnswered) return;
  const d=dtLatih[latihIdx];
  const btns=[...document.querySelectorAll('#berlatih-content .opsi')];
  const sel=btns.map((b,i)=>b.classList.contains('terpilih')?i:-1).filter(i=>i>=0);
  if(sel.length===0){ showToast('💡 Pilih minimal satu jawaban!'); return; }
  const fb=document.getElementById('fb-latih');
  const setJ=new Set(d.j);
  const ok=(sel.length===d.j.length)&&sel.every(i=>setJ.has(i));
  latihAnswered=true;
  btns.forEach((b,i)=>{
    b.style.pointerEvents='none';
    if(setJ.has(i)) b.classList.add('benar');
    else if(b.classList.contains('terpilih')) b.classList.add('salah');
  });
  if(ok){
    fb.className='feedback show ok'; fb.textContent='🎉 Benar! '+d.msg;
    latihSkor+=10; updateSkorLatih();
    sfx('benar'); confettiBurst(600,260,22);
  }else{
    fb.className='feedback show no';
    fb.textContent='💡 Belum tepat. '+d.msg+' (Jawaban benar ditandai hijau.)';
    sfx('salah'); efekSalahFlash();
  }
  document.getElementById('berlatih-next').disabled=false;
}

/* ##############################################################
   #  BAGIAN K — INISIALISASI                                   #
   ############################################################## */
(function init(){
  const set=(id,v)=>{ const e=document.getElementById(id); if(e) e.textContent=v; };
  set('cfg-judul',CONFIG.judul);
  set('cfg-subjudul',CONFIG.subJudul);
  set('cfg-judul-menu',CONFIG.judul);
  set('cfg-fase',CONFIG.fase);
  set('cfg-mapel',CONFIG.mapel);
  set('cfg-unit',CONFIG.unit);
  set('cfg-subunit',CONFIG.subUnit);
  set('cfg-tp',CONFIG.tp);
  set('cfg-nama',CONFIG.profil.nama);
  set('cfg-instansi',CONFIG.profil.instansi);
  set('cfg-surel',CONFIG.profil.surel);
  set('cfg-tahun','Copyright@'+CONFIG.profil.tahun);
  set('cfg-jenis',CONFIG.profil.jenis);
  const fill=(id,arr)=>{ const ul=document.getElementById(id); if(ul) ul.innerHTML=arr.map(x=>'<li>'+x+'</li>').join(''); };
  fill('cfg-ref-materi',CONFIG.referensi.materi);
  fill('cfg-ref-aset',CONFIG.referensi.aset);
  fill('cfg-ref-ai',CONFIG.referensi.ai);

  /* Fallback gambar: tangani yang gagal dimuat + pasang listener untuk yang belakangan error */
  document.querySelectorAll('img').forEach(im=>{
    if(im.complete && im.naturalWidth===0) imgErr(im);
    else im.addEventListener('error',()=>imgErr(im));
  });

  /* Delegasi efek suara klik untuk semua elemen [data-sfx] */
  document.addEventListener('click',e=>{
    const t=e.target.closest('[data-sfx]');
    if(t && t.getAttribute('data-sfx')!=='no') sfx('click');
  },true);
  document.addEventListener('pointerdown',ensureCtx,{passive:true});

  /* Skala stage agar pas layar */
  fitStage();
  window.addEventListener('resize',()=>{ fitStage(); drawJodohLines(); });

})();

/* ============================================================
   TAMBAHAN: SCRIPT BACKSOUND (MUSIK LATAR)
   Sumber utama: ./asset/audio/backsound.mp3
   Fallback: audio WAV tertanam agar HTML tetap dapat digunakan
   walaupun folder asset/audio belum tersedia.
   ============================================================ */
(function initBacksound() {
  const BGM_SRC = './asset/audio/backsound.mp3';
  const BGM_FALLBACK = '';            // cadangan opsional; kosong = tidak dipakai
  const BGM_VOL_AWAL = 1;
  const bgm = document.getElementById('bgm');
  const btnBgm = document.getElementById('btn-bgm');
  const slider = document.getElementById('bgm-volume');
  if (!bgm || !btnBgm || !slider) return;

  let bgmAktif = false;
  let sumberFallback = false;

  function setUI(on) {
    bgmAktif = on;
    btnBgm.textContent = on ? '🎵' : '🔇';
    btnBgm.classList.toggle('playing', on);
    btnBgm.title = on ? 'Backsound: ON — klik untuk mematikan' : 'Backsound: OFF — klik untuk menyalakan';
  }

  function pasangSumberFallback() {
    if (sumberFallback || !BGM_FALLBACK) return;
    sumberFallback = true;
    bgm.src = BGM_FALLBACK;
    bgm.load();
  }

  bgm.preload = 'auto';
  bgm.loop = true;
  bgm.volume = BGM_VOL_AWAL;
  slider.value = String(BGM_VOL_AWAL * 100);
  bgm.src = BGM_SRC;

  bgm.addEventListener('error', () => {
    if (!sumberFallback) pasangSumberFallback();
  });

  bgm.addEventListener('ended', () => setUI(false));

  window.toggleBacksound = function() {
    if (bgmAktif) {
      bgm.pause();
      setUI(false);
      return;
    }
    bgm.play().then(() => setUI(true)).catch(() => {
      if (!sumberFallback) {
        pasangSumberFallback();
        bgm.play().then(() => setUI(true)).catch(() => {});
      }
    });
  };

  window.ubahVolumeBacksound = function(nilai) {
    bgm.volume = Math.max(0, Math.min(1, Number(nilai) / 100));
  };

  // Browser biasanya melarang autoplay. Mulai setelah interaksi pertama.
  function autoStart(e) {
    if (e.target.closest('#bgm-widget')) return;
    if (bgmAktif) return;
    bgm.play().then(() => {
      setUI(true);
      document.removeEventListener('pointerdown', autoStart, true);
    }).catch(() => {
      if (!sumberFallback) {
        pasangSumberFallback();
        bgm.play().then(() => {
          setUI(true);
          document.removeEventListener('pointerdown', autoStart, true);
        }).catch(() => {});
      }
    });
  }
  document.addEventListener('pointerdown', autoStart, true);

  setUI(false);
})();
/* =============== AKHIR SCRIPT BACKSOUND =============== */
