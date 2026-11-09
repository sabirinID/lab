/* ##############################################################
   #  BAGIAN A — KONFIGURASI                                   #
   ############################################################## */
const CONFIG = {
  judul:    "Stoikiometri",
  subJudul: "Perhitungan Mol dan Pereaksi Pembatas",
  fase:     "Fase E • Kelas X",
  mapel:    "Kimia",
  unit:     "Stoikiometri",
  subUnit:  "Konsep Mol, Persamaan Reaksi, Pereaksi Pembatas, Rendemen, dan Rumus Empiris",
  tp:       "Menerapkan konsep mol untuk menghubungkan massa, jumlah partikel, dan volume gas; menentukan pereaksi pembatas serta jumlah sisa pereaksi dan hasil reaksi; menghitung rendemen; dan menentukan rumus empiris dan rumus molekul senyawa.",
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
      "Brown, T. L., LeMay, H. E., Bursten, B. E., Murphy, C. J., Woodward, P. M., & Stoltzfus, M. W. (2018). Chemistry: The Central Science (14th ed.). Pearson."
    ],
    aset: [
      "Ilustrasi vektor (SVG) pada halaman muka dan halaman materi dibuat khusus untuk media pembelajaran ini.",
      "MyInstants. (2026). Efek suara (sound effect) yang digunakan pada media pembelajaran. Lisensi sesuai ketentuan penggunaan MyInstants. https://www.myinstants.com/"
    ],
    ai: [
      "Draf materi, soal, pembahasan, ilustrasi SVG, dan Lab Maya pada media ini disusun dengan bantuan Claude (Anthropic).",
      "Perhitungan memakai Ar yang dibulatkan (H = 1, C = 12, N = 14, O = 16, Na = 23, Mg = 24, Al = 27, S = 32, Cl = 35,5, Fe = 56), bilangan Avogadro 6,02×10²³, dan volume molar 22,4 L/mol pada STP. Pada simulasi partikel, satu titik mewakili 0,5 mol dan jumlahnya dibulatkan; angka pada tabel adalah angka eksak. Seluruh konten perlu ditinjau dan disesuaikan oleh pengembang sebelum digunakan di kelas."
    ]
  }
};

/* ##############################################################
   #  BAGIAN B — DATA MATERI BELAJAR (8 HALAMAN)                #
   ############################################################## */
const MATERI = [
  { judul:"1. Ar dan Mr", img:"./asset/img/materi_1.svg",
    intro:"Anak-anak, bagaimana kita menimbang atom yang terlalu kecil untuk dilihat?",
    isi:"<ul><li><b>Ar</b> (massa atom relatif): massa atom dibandingkan 1/12 massa atom C-12. Contoh: H = 1, C = 12, O = 16, Na = 23.</li><li><b>Mr</b> (massa molekul relatif) = jumlah Ar semua atom penyusun.</li><li>Mr H₂O = (2 × 1) + 16 = <b>18</b>; Mr CO₂ = 12 + (2 × 16) = <b>44</b>; Mr CaCO₃ = <b>100</b>.</li></ul>",
    kuis:{ tanya:"Mr H₂O (Ar H = 1, O = 16) adalah ...", o:["18","17"], j:0 } },

  { judul:"2. Konsep Mol", img:"./asset/img/materi_2.svg",
    intro:"Mol adalah 'lusin'-nya kimia: satuan untuk menghitung partikel dalam jumlah sangat besar.",
    isi:"<p><b>1 mol</b> zat mengandung <b>6,02×10²³</b> partikel (bilangan Avogadro, L).</p><ul><li>Massa 1 mol zat = <b>Mr (atau Ar) gram</b>.</li><li>n = massa ÷ Mr.</li><li>n = jumlah partikel ÷ 6,02×10²³.</li><li>Contoh: 36 g H₂O → n = 36 ÷ 18 = <b>2 mol</b>; 0,5 mol → <b>3,01×10²³</b> molekul.</li></ul>",
    kuis:{ tanya:"Jumlah mol dari 36 g H₂O adalah ...", o:["2 mol","18 mol"], j:0 } },

  { judul:"3. Volume Molar Gas", img:"./asset/img/materi_3.svg",
    intro:"Menurut Avogadro, gas bervolume sama pada suhu dan tekanan sama memiliki jumlah molekul sama.",
    isi:"<p>Pada keadaan <b>STP</b> (0 °C, 1 atm), 1 mol gas apa pun bervolume <b>22,4 L</b>.</p><ul><li>V = n × 22,4 L.</li><li>0,5 mol O₂ → 11,2 L; 0,25 mol gas → 5,6 L.</li><li>Dari massa: 44 g CO₂ (1 mol) → 22,4 L; 22 g CO₂ (0,5 mol) → 11,2 L.</li><li>Perbandingan volume gas pada reaksi sama dengan perbandingan koefisien.</li></ul>",
    kuis:{ tanya:"Volume 0,5 mol gas pada STP adalah ...", o:["11,2 L","44,8 L"], j:0 } },

  { judul:"4. Persamaan Reaksi dan Mol", img:"./asset/img/materi_4.svg",
    intro:"Koefisien reaksi bukan hanya angka penyetara, tetapi juga perbandingan mol.",
    isi:"<p>Pada <b>2H₂ + O₂ → 2H₂O</b>, perbandingan mol H₂ : O₂ : H₂O = <b>2 : 1 : 2</b>.</p><ul><li>4 mol H₂ memerlukan 2 mol O₂ dan menghasilkan 4 mol H₂O.</li><li>Langkah: (1) setarakan reaksi, (2) ubah data ke mol, (3) bandingkan dengan koefisien, (4) ubah hasil ke satuan yang diminta.</li></ul>",
    kuis:{ tanya:"Pada 2H₂ + O₂ → 2H₂O, 4 mol H₂ menghasilkan ... mol H₂O.", o:["4","2"], j:0 } },

  { judul:"5. Pereaksi Pembatas", img:"./asset/img/materi_5.svg",
    intro:"Seperti membuat sandwich: bahan yang habis lebih dulu menentukan jumlah sandwich.",
    isi:"<p><b>Pereaksi pembatas</b> adalah pereaksi yang habis lebih dahulu dan menentukan jumlah produk.</p><ul><li>Bagi mol tiap pereaksi dengan koefisiennya: yang <b>terkecil</b> adalah pembatas.</li><li>Contoh 4 mol H₂ + 3 mol O₂ (2H₂ + O₂ → 2H₂O): H₂ = 4 ÷ 2 = 2; O₂ = 3 ÷ 1 = 3. <b>H₂ pembatas</b>.</li><li>Hasil: 4 mol H₂O (72 g); sisa O₂ = 3 − 2 = <b>1 mol</b> (32 g).</li></ul>",
    kuis:{ tanya:"Pereaksi pembatas adalah pereaksi dengan n ÷ koefisien yang ...", o:["terkecil","terbesar"], j:0 } },

  { judul:"6. Rendemen", img:"./asset/img/materi_6.svg",
    intro:"Di laboratorium, hasil nyata biasanya lebih kecil daripada hasil hitungan.",
    isi:"<ul><li><b>Hasil teoritis</b>: jumlah produk maksimum dari perhitungan pereaksi pembatas.</li><li><b>Hasil nyata</b>: jumlah produk yang benar-benar diperoleh.</li><li><b>Rendemen</b> = (hasil nyata ÷ hasil teoritis) × 100%.</li><li>Contoh: teoritis 36 g H₂O, nyata 28,8 g → rendemen = 28,8 ÷ 36 × 100% = <b>80%</b>.</li></ul>",
    kuis:{ tanya:"Hasil nyata 28,8 g dan teoritis 36 g memberi rendemen ...", o:["80%","125%"], j:0 } },

  { judul:"7. Rumus Empiris dan Molekul", img:"./asset/img/materi_7.svg",
    intro:"Dari persentase massa unsur, kita dapat menebak rumus suatu senyawa.",
    isi:"<p><b>Rumus empiris</b> menyatakan perbandingan mol atom paling sederhana.</p><ul><li>Ambil 100 g senyawa → massa unsur = persentasenya.</li><li>Ubah ke mol (massa ÷ Ar), bagi dengan mol terkecil, lalu bulatkan.</li><li>C 40,0%, H 6,7%, O 53,3% → mol 3,33 : 6,7 : 3,33 = 1 : 2 : 1 → <b>CH₂O</b>.</li><li><b>Rumus molekul</b> = (rumus empiris)ₙ; Mr = 180 → n = 180 ÷ 30 = 6 → <b>C₆H₁₂O₆</b>.</li></ul>",
    kuis:{ tanya:"Rumus empiris dengan perbandingan mol C : H : O = 1 : 2 : 1 adalah ...", o:["CH₂O","C₂HO"], j:0 } },

  { judul:"8. Kesimpulan", img:"./asset/img/materi_8.svg",
    intro:"Bagus, anak-anak. Sekarang rangkumlah stoikiometri sebagai satu alur berpikir.",
    isi:"<ul><li>Mol menghubungkan massa (÷ Mr), jumlah partikel (× 6,02×10²³), dan volume gas (× 22,4 L).</li><li>Koefisien reaksi = perbandingan mol.</li><li>Pereaksi pembatas = n ÷ koefisien terkecil; sisanya berlebih.</li><li>Rendemen = nyata ÷ teoritis × 100%.</li><li>Rumus empiris dari persen massa → mol → perbandingan sederhana.</li></ul><p><b>Pesan Pak Sabirin:</b> selalu ubah ke mol dulu. Setelah ini, kunjungi <b>Lab Maya</b> untuk mengatur jumlah pereaksi dan melihat sisa serta hasil reaksinya!</p>"
  }
];

/* ##############################################################
   #  BAGIAN C — DATA BERMAIN (10 PERMAINAN)                    #
   ############################################################## */
const dataBermain = [
  { t:'jodoh', sub:'Jodohkan Zat dan Mr', ins:'Anak-anak, jodohkan zat dengan massa molekul relatifnya!',
    pairs:[{n:1,teks:'H₂O'},{n:2,teks:'CO₂'},{n:3,teks:'CaCO₃'}],
    imgs:[{n:1,i:'./asset/img/game_mr18.png',name:'Mr = 18'},{n:2,i:'./asset/img/game_mr44.png',name:'Mr = 44'},{n:3,i:'./asset/img/game_mr100.png',name:'Mr = 100'}] },

  { t:'klik', sub:'Satu Mol CO₂', ins:'Pilih massa CO₂ yang setara dengan 1 MOL! (Mr CO₂ = 44)',
    opsi:[
      {imgPath:'./asset/img/game_44g.png', t:'44 g', b:true, msg:'Benar. Massa 1 mol = Mr gram = 44 g.'},
      {imgPath:'./asset/img/game_22g.png', t:'22 g', b:false, msg:'22 g CO₂ adalah 0,5 mol.'},
      {imgPath:'./asset/img/game_88g.png', t:'88 g', b:false, msg:'88 g CO₂ adalah 2 mol.'},
      {imgPath:'./asset/img/game_12g.png', t:'12 g', b:false, msg:'12 g adalah Ar karbon, bukan Mr CO₂.'}
    ] },

  { t:'urut', sub:'Urutkan Langkah Pereaksi Pembatas', ins:'Susun langkah menentukan pereaksi pembatas!',
    urut:['Tulis persamaan reaksi yang setara','Ubah massa pereaksi menjadi mol','Bagi mol dengan koefisien, ambil yang terkecil','Hitung mol dan massa produk dari pereaksi pembatas'] },

  { t:'kumpul', sub:'Kumpulkan Satu Mol', ins:'Ketuk hanya 6,02×10²³ partikel (1 mol). Hindari yang lain!',
    benar:'./asset/img/game_avo.png',
    salah:['./asset/img/game_k1.png','./asset/img/game_k2.png'] },

  { t:'sambung', sub:'Sambung Volume Gas STP', ins:'Pilih volume gas pada keadaan STP!',
    hasil:'Volume gas pada STP = mol × 22,4 L: 1 mol = 22,4 L, 0,5 mol = 11,2 L, 2 mol = 44,8 L.',
    steps:[
      { prev:'1 mol gas pada STP bervolume ...', benar:'22,4 L', salah:['11,2 L','44,8 L'] },
      { prev:'0,5 mol gas pada STP bervolume ...', benar:'11,2 L', salah:['22,4 L','5,6 L'] },
      { prev:'2 mol gas pada STP bervolume ...', benar:'44,8 L', salah:['22,4 L','11,2 L'] }
    ] },

  { t:'jodoh', sub:'Jodohkan Mol dan Partikel', ins:'Jodohkan jumlah mol dengan jumlah partikelnya!',
    pairs:[{n:1,teks:'0,5 mol'},{n:2,teks:'2 mol'},{n:3,teks:'0,1 mol'}],
    imgs:[{n:1,i:'./asset/img/game_p301.png',name:'3,01×10²³'},{n:2,i:'./asset/img/game_p1204.png',name:'1,204×10²⁴'},{n:3,i:'./asset/img/game_p602.png',name:'6,02×10²²'}] },

  { t:'klik', sub:'Cari Pereaksi Pembatas', ins:'Reaksi N₂ + 3H₂ → 2NH₃ dengan 3 mol N₂ dan 6 mol H₂. Apa pereaksi pembatasnya?',
    opsi:[
      {imgPath:'./asset/img/game_h2.png', t:'H₂', b:true, msg:'Benar. N₂: 3 ÷ 1 = 3; H₂: 6 ÷ 3 = 2 (terkecil), jadi H₂ pembatas.'},
      {imgPath:'./asset/img/game_n2.png', t:'N₂', b:false, msg:'N₂ memiliki n ÷ koefisien = 3, bukan yang terkecil.'},
      {imgPath:'./asset/img/game_nh3.png', t:'NH₃', b:false, msg:'NH₃ adalah produk, bukan pereaksi.'},
      {imgPath:'./asset/img/game_none.png', t:'Tidak ada', b:false, msg:'Perbandingan 3 : 6 tidak sama dengan 1 : 3, jadi ada pembatas.'}
    ] },

  { t:'urut', sub:'Urutkan Langkah Rumus Empiris', ins:'Susun langkah menentukan rumus empiris dari persen massa!',
    urut:['Tulis persentase tiap unsur (dasar 100 g)','Ubah massa tiap unsur menjadi mol dengan Ar','Bagi semua mol dengan mol terkecil','Bulatkan menjadi perbandingan bilangan bulat'] },

  { t:'kumpul', sub:'Kumpulkan Pereaksi Pembatas', ins:'Reaksi 2H₂ + O₂ → 2H₂O dengan 1 mol H₂ dan 1 mol O₂. Ketuk hanya pereaksi pembatas (H₂)!',
    benar:'./asset/img/game_h2.png',
    salah:['./asset/img/game_o2.png','./asset/img/game_h2o.png'] },

  { t:'sambung', sub:'Sambung Istilah Rendemen', ins:'Pasangkan istilah dengan pengertiannya!',
    hasil:'Hasil teoritis adalah hitungan maksimum, hasil nyata adalah hasil percobaan, dan rendemen adalah perbandingannya dalam persen.',
    steps:[
      { prev:'Hasil teoritis adalah ...', benar:'hasil maksimum menurut perhitungan', salah:['hasil yang ditimbang di laboratorium','jumlah pereaksi berlebih'] },
      { prev:'Hasil nyata adalah ...', benar:'hasil yang benar-benar diperoleh', salah:['hasil maksimum menurut perhitungan','jumlah koefisien reaksi'] },
      { prev:'Rendemen adalah ...', benar:'hasil nyata ÷ hasil teoritis × 100%', salah:['hasil teoritis ÷ hasil nyata × 100%','mol pereaksi ÷ koefisien'] }
    ] }
];

/* ##############################################################
   #  BAGIAN D — DATA BERLATIH (10 SOAL EVALUASI)               #
   ############################################################## */
const dtLatih = [
  { t:'jodoh', soal:'Jodohkan besaran yang dicari dengan rumus perhitungannya!',
    pairs:[{n:1,t:'Mol dari massa'},{n:2,t:'Mol dari jumlah partikel'},{n:3,t:'Mol gas pada STP'}],
    imgs:[{n:1,i:'./asset/img/latih_massa.png',name:'n = massa ÷ Mr'},{n:2,i:'./asset/img/latih_partikel.png',name:'n = N ÷ 6,02×10²³'},{n:3,i:'./asset/img/latih_volume.png',name:'n = V ÷ 22,4'}],
    msg:'n = massa ÷ Mr; n = jumlah partikel ÷ 6,02×10²³; n = V (STP) ÷ 22,4 L/mol.' },

  { t:'bs', soal:'Satu mol gas apa pun pada keadaan STP bervolume 22,4 L.', j:true,
    msg:'Pernyataan benar. Menurut hukum Avogadro, volume molar semua gas pada STP (0 °C, 1 atm) adalah 22,4 L/mol.' },

  { t:'pg',
    stimulus:'<b>Perhatikan:</b> Sebanyak 36 g H₂O (Mr = 18).',
    soal:'Jumlah mol H₂O tersebut adalah ...',
    opsi:['2 mol','0,5 mol','18 mol','648 mol','4 mol'], j:0,
    msg:'n = massa ÷ Mr = 36 ÷ 18 = 2 mol.' },

  { t:'pg',
    soal:'Jumlah partikel dalam 0,5 mol zat adalah ...',
    opsi:['3,01×10²³','6,02×10²³','1,204×10²⁴','3,01×10²²','6,02×10²²'], j:0,
    msg:'N = n × 6,02×10²³ = 0,5 × 6,02×10²³ = 3,01×10²³ partikel.' },

  { t:'pg',
    soal:'Volume 0,25 mol gas pada keadaan STP adalah ...',
    opsi:['5,6 L','2,8 L','11,2 L','22,4 L','89,6 L'], j:0,
    msg:'V = n × 22,4 = 0,25 × 22,4 = 5,6 L.' },

  { t:'pg',
    stimulus:'<b>Perhatikan:</b> Sebanyak 4 mol H₂ direaksikan dengan 3 mol O₂ menurut 2H₂ + O₂ → 2H₂O.',
    soal:'Pereaksi pembatas pada reaksi tersebut adalah ...',
    opsi:['H₂','O₂','H₂O','H₂ dan O₂ sama-sama habis','tidak ada'], j:0,
    msg:'H₂: 4 ÷ 2 = 2; O₂: 3 ÷ 1 = 3. Nilai terkecil dimiliki H₂, sehingga H₂ pembatas. Sisa O₂ = 3 − 2 = 1 mol.' },

  { t:'pg_kompleks',
    soal:'Pilih semua pernyataan yang benar tentang pereaksi pembatas.',
    opsi:['Habis bereaksi lebih dahulu','Menentukan jumlah produk yang terbentuk','Selalu memiliki mol terbesar','Memiliki nilai n ÷ koefisien terkecil','Selalu memiliki massa terkecil'], j:[0,1,3],
    msg:'Pereaksi pembatas ditentukan oleh n ÷ koefisien terkecil, bukan oleh mol atau massa terbesar atau terkecil.' },

  { t:'drag_word', soal:'Lengkapi kalimat berikut: pada N₂ + 3H₂ → 2NH₃, perbandingan mol N₂ : H₂ : NH₃ adalah <span class="blank-slot" data-id="1">___</span>. Jika tersedia 2 mol N₂ dan 3 mol H₂, pereaksi pembatasnya <span class="blank-slot" data-id="2">___</span> dan NH₃ yang terbentuk <span class="blank-slot" data-id="3">___</span> mol.', w:['1 : 3 : 2','H₂','2','N₂','3 : 1 : 2','3'], j:['1 : 3 : 2','H₂','2'],
    msg:'Perbandingan sesuai koefisien (1 : 3 : 2). N₂: 2 ÷ 1 = 2; H₂: 3 ÷ 3 = 1, sehingga H₂ pembatas dan NH₃ = (2/3) × 3 = 2 mol.' },

  { t:'pg',
    stimulus:'<b>Perhatikan:</b> Sebanyak 2,4 g Mg (Ar = 24) dibakar dengan O₂ berlebih: 2Mg + O₂ → 2MgO (Mr MgO = 40).',
    soal:'Massa MgO yang terbentuk adalah ...',
    opsi:['4 g','2,4 g','40 g','0,4 g','8 g'], j:0,
    msg:'n Mg = 2,4 ÷ 24 = 0,1 mol. Perbandingan Mg : MgO = 2 : 2, sehingga MgO = 0,1 mol × 40 = 4 g.' },

  { t:'pg',
    stimulus:'<b>Perhatikan:</b> Suatu senyawa mengandung C 40,0%, H 6,7%, dan O 53,3% (Ar C = 12, H = 1, O = 16).',
    soal:'Rumus empiris senyawa tersebut adalah ...',
    opsi:['CH₂O','C₂H₄O','CHO','C₂HO','CH₄O'], j:0,
    msg:'Mol C : H : O = 40/12 : 6,7/1 : 53,3/16 = 3,33 : 6,7 : 3,33 = 1 : 2 : 1, jadi rumus empirisnya CH₂O.' }
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
      [/game_mr18/i,'18','Mr H₂O'],[/game_mr44/i,'44','Mr CO₂'],[/game_mr100/i,'100','Mr CaCO₃'],
      [/game_44g/i,'44 g','1 mol CO₂'],[/game_22g/i,'22 g','0,5 mol CO₂'],[/game_88g/i,'88 g','2 mol CO₂'],[/game_12g/i,'12 g','Ar karbon'],
      [/game_avo/i,'6,02×10²³','1 mol'],[/game_k1/i,'6,02×10²²','0,1 mol'],[/game_k2/i,'6,02×10²⁴','10 mol'],
      [/game_p301/i,'3,01×10²³','0,5 mol'],[/game_p1204/i,'1,204×10²⁴','2 mol'],[/game_p602/i,'6,02×10²²','0,1 mol'],
      [/game_h2o/i,'H₂O','Produk'],[/game_h2/i,'H₂','Hidrogen'],[/game_n2/i,'N₂','Nitrogen'],[/game_nh3/i,'NH₃','Amonia'],[/game_o2/i,'O₂','Oksigen'],[/game_none/i,'∅','Tidak ada'],
      [/latih_massa/i,'g ÷ Mr','Mol dari massa'],[/latih_partikel/i,'N ÷ L','Mol dari partikel'],[/latih_volume/i,'V ÷ 22,4','Mol gas STP'],
      [/belajar/i,'📖','Belajar'],[/bermain/i,'🎮','Bermain'],[/berlatih/i,'✍️','Berlatih'],[/materi/i,'🧪','Materi']
    ];
    for(const r of R){ const m=src.match(r[0]); if(m){ t=r[1]; s=r[2]; break; } }
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
    tampilAkhir('📖 Belajar Selesai', null, 'Materi Stoikiometri telah kamu pelajari. Lanjutkan ke Bermain atau praktikum di Lab Maya! 🔬', 'belajar');
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
    if(s>=90) kal='Luar biasa! Pemahamanmu tentang Stoikiometri sangat mantap. ⚗️';
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
