/* ##############################################################
   #  LAB MAYA — PRAKTIKUM VIRTUAL IKATAN KIMIA                 #
   #  Empat eksperimen: ikatan ion (serah-terima elektron),     #
   #  ikatan kovalen (pemakaian bersama), ikatan logam (lautan  #
   #  elektron), dan uji sifat fisik (hantar listrik, titik     #
   #  leleh, dan titik didih). Data dibulatkan dari buku acuan. #
   ############################################################## */
const LAB_NS = 'http://www.w3.org/2000/svg';
const $L = id => document.getElementById(id);

/* ---------- Data ---------- */
const KAT = {
  li:{ s:'Li', ve:1, q:1, r:76 }, na:{ s:'Na', ve:1, q:1, r:102 }, k:{ s:'K', ve:1, q:1, r:138 },
  mg:{ s:'Mg', ve:2, q:2, r:72 }, ca:{ s:'Ca', ve:2, q:2, r:100 }, al:{ s:'Al', ve:3, q:3, r:54 }
};
const ANI = { f:{ s:'F', ve:7, q:1, r:133 }, cl:{ s:'Cl', ve:7, q:1, r:181 }, o:{ s:'O', ve:6, q:2, r:140 } };
const KAT_IDS = ['li','na','k','mg','ca','al'], ANI_IDS = ['f','cl','o'];
const MP_ION = { LiF:845, LiCl:605, Li2O:1438, NaF:993, NaCl:801, Na2O:1132, KF:858, KCl:770, K2O:740, MgF2:1263, MgCl2:714, MgO:2852, CaF2:1418, CaCl2:772, CaO:2613, AlF3:1291, Al2O3:2072 };
const CATATAN_ION = { K2O:'terurai', AlF3:'menyublim', AlCl3:'kovalen kuat, menyublim ≈ 180 °C' };
const SUBS = '₀₁₂₃₄₅₆₇₈₉';
const SUPQ = { 1:'⁺', 2:'²⁺', 3:'³⁺' }, SUPA = { 1:'⁻', 2:'²⁻' };
const sub = n => n > 1 ? String(n).split('').map(d => SUBS[+d]).join('') : '';
const gcd = (a, b) => b ? gcd(b, a % b) : a;

const AT = { H:{ ve:1, r:20 }, C:{ ve:4, r:27 }, N:{ ve:5, r:27 }, O:{ ve:6, r:27 }, Cl:{ ve:7, r:30 } };
const CHI = { H:2.20, C:2.55, N:3.04, O:3.44, Cl:3.16 };
const KMOL = {
  h2:  { f:'H₂',  nama:'Hidrogen',          at:[['H',-55,0],['H',55,0]], bd:[[0,1,1]] },
  cl2: { f:'Cl₂', nama:'Klorin',            at:[['Cl',-62,0],['Cl',62,0]], bd:[[0,1,1]] },
  o2:  { f:'O₂',  nama:'Oksigen',           at:[['O',-60,0],['O',60,0]], bd:[[0,1,2]] },
  n2:  { f:'N₂',  nama:'Nitrogen',          at:[['N',-58,0],['N',58,0]], bd:[[0,1,3]] },
  hcl: { f:'HCl', nama:'Hidrogen klorida',  at:[['H',-62,0],['Cl',62,0]], bd:[[0,1,1]] },
  h2o: { f:'H₂O', nama:'Air',               at:[['O',0,-22],['H',-80,50],['H',80,50]], bd:[[0,1,1],[0,2,1]] },
  nh3: { f:'NH₃', nama:'Amonia',            at:[['N',0,-34],['H',-84,38],['H',84,38],['H',0,92]], bd:[[0,1,1],[0,2,1],[0,3,1]] },
  ch4: { f:'CH₄', nama:'Metana',            at:[['C',0,0],['H',0,-88],['H',0,88],['H',-88,0],['H',88,0]], bd:[[0,1,1],[0,2,1],[0,3,1],[0,4,1]] },
  co2: { f:'CO₂', nama:'Karbon dioksida',   at:[['O',-108,0],['C',0,0],['O',108,0]], bd:[[0,1,2],[1,2,2]] }
};
const K_IDS = ['h2','cl2','o2','n2','hcl','h2o','nh3','ch4','co2'];
const IKT = { 'H–H':{ E:436, L:74 }, 'Cl–Cl':{ E:242, L:199 }, 'O=O':{ E:498, L:121 }, 'N≡N':{ E:945, L:110 }, 'H–Cl':{ E:431, L:127 }, 'O–H':{ E:463, L:96 }, 'N–H':{ E:391, L:101 }, 'C–H':{ E:413, L:109 }, 'C=O':{ E:799, L:116 } };
const LOGAM = {
  k:  { s:'K',  ve:1, r:138, mp:63,  bp:759 },  na: { s:'Na', ve:1, r:102, mp:98,  bp:883 },
  mg: { s:'Mg', ve:2, r:72,  mp:650, bp:1090 }, al: { s:'Al', ve:3, r:54,  mp:660, bp:2519 }
};
const L_IDS = ['k','na','mg','al'];
const SAMP = {
  nacl: { f:'NaCl', nama:'Natrium klorida', tipe:'ion',    mp:801,  bp:1413, h:{ padat:false, leleh:true,  larut:true } },
  mgo:  { f:'MgO',  nama:'Magnesium oksida', tipe:'ion',   mp:2852, bp:3600, h:{ padat:false, leleh:true,  larut:null } },
  na:   { f:'Na',   nama:'Natrium',         tipe:'logam',  mp:98,   bp:883,  h:{ padat:true,  leleh:true,  larut:null } },
  cu:   { f:'Cu',   nama:'Tembaga',         tipe:'logam',  mp:1085, bp:2562, h:{ padat:true,  leleh:true,  larut:null } },
  h2o:  { f:'H₂O',  nama:'Air',             tipe:'kovalen', mp:0,   bp:100,  h:{ padat:false, leleh:false, larut:null } },
  ch4:  { f:'CH₄',  nama:'Metana',          tipe:'kovalen', mp:-182, bp:-162, h:{ padat:false, leleh:false, larut:null } },
  i2:   { f:'I₂',   nama:'Iodin',           tipe:'kovalen', mp:114, bp:184,  h:{ padat:false, leleh:false, larut:null } },
  sio2: { f:'SiO₂', nama:'Silikon dioksida', tipe:'raksasa', mp:1713, bp:2950, h:{ padat:false, leleh:false, larut:null } }
};
const U_IDS = ['nacl','mgo','na','cu','h2o','ch4','i2','sio2'];
const TIPE_NAMA = { ion:'senyawa ion', logam:'logam', kovalen:'kovalen sederhana', raksasa:'kovalen raksasa' };
const UJI = [ { id:'padat', nama:'Padat' }, { id:'leleh', nama:'Leleh' }, { id:'larut', nama:'Larutan' }, { id:'panas', nama:'Panaskan' } ];
const LAB_MODE = [ { id:'i', nama:'Ikatan Ion' }, { id:'k', nama:'Kovalen' }, { id:'l', nama:'Logam' }, { id:'u', nama:'Uji Sifat' } ];
const T_ION = 3.6, T_KOV = 3.0, T_SHEAR = 2.4, T_COND = 2.0, T_HEAT = 8.0, T_TEMPA = 2.4;

const labS = {
  mode:'i',
  i:{ me:'na', nm:'cl', t:0, run:false, started:false, formed:[], sh:{ run:false, t:0 }, shearDone:false },
  k:{ mol:'h2', t:0, run:false, started:false, formed:[] },
  l:{ me:'na', field:false, tempa:{ run:false, t:0 }, tempaDone:false, e:[], bangun:'' },
  u:{ samp:'nacl', run:null, t:0, aktif:null, res:{}, bangun:'' },
  mikro:false, catatNo:0,
  misi:[false,false,false,false,false], skor:0, m1opt:null, m1key:'', m2opt:null, m3opt:null, m4opt:null, m5opt:null, dirty:true
};

/* ---------- Utilitas ---------- */
function svEl(tag, attrs, parent){
  const e = document.createElementNS(LAB_NS, tag);
  for (const k in attrs) e.setAttribute(k, attrs[k]);
  if (parent) parent.appendChild(e);
  return e;
}
function labNum(v, d){ const s = Number(v).toFixed(d); return (Number(s) === 0 ? Number(0).toFixed(d) : s).replace('.', ','); }
function labKlem(v, a, b){ return Math.max(a, Math.min(b, v)); }
function labEase(f){ f = labKlem(f, 0, 1); return f * f * (3 - 2 * f); }
function labAcak(arr){ for (let i = arr.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [arr[i], arr[j]] = [arr[j], arr[i]]; } return arr; }
function labAktif(){ const s = $L('scr-lab'); return s && s.classList.contains('active'); }
function lerp(a, b, t){ return a + (b - a) * t; }
function rng(seed){ let s = seed >>> 0; return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; }; }
function teks(g, x, y, str, o){
  o = o || {};
  const t = svEl('text', { x:x, y:y, 'text-anchor':o.a || 'start', 'font-size':o.s || 12, 'font-weight':o.w || 800, fill:o.c || '#fff', 'font-family':o.f || 'Figtree,sans-serif' }, g);
  t.textContent = str; return t;
}
function baris(g, y, label, nilai, warna){
  teks(g, 392, y, label, { s:11.5, w:700, c:'#AEC0E0' });
  teks(g, 696, y, nilai, { s:12.5, c:warna || '#fff', a:'end' });
}

/* ---------- Ikatan ion ---------- */
function ionInfo(){
  const I = labS.i, A = KAT[I.me], B = ANI[I.nm];
  const L = A.q * B.q / gcd(A.q, B.q), nc = L / A.q, na = L / B.q;
  const formula = A.s + sub(nc) + B.s + sub(na), key = A.s + (nc > 1 ? nc : '') + B.s + (na > 1 ? na : '');
  const idx = (A.q * B.q / (A.r + B.r)) / (1 / (102 + 181));
  return { A:A, B:B, nc:nc, na:na, formula:formula, key:key, idx:idx, mp:MP_ION[key], cat:CATATAN_ION[key], e:nc * A.q };
}
function labIonPilih(k, v){ const I = labS.i; I[k] = v; I.t = 0; I.run = false; I.started = false; I.sh.run = false; I.sh.t = 0; labRender(); }
function labIonJalan(){ const I = labS.i; I.t = 0; I.run = true; I.started = true; labRenderPanel(); sfx('click'); }
function labIonTekan(){
  const I = labS.i; if (!(I.started && !I.run)) { labToast('Bentuk dulu senyawa ionnya.'); return; }
  I.sh.t = 0; I.sh.run = true; sfx('click');
}
function ionY(n){ return n === 1 ? [250] : (n === 2 ? [205, 295] : [165, 250, 335]); }
function irisanPola(nc, na, n, geser){
  const o = [], tot = nc + na;
  for (let i = 0; i < n; i++) o.push(Math.floor(((i + 1) * nc) / tot) > Math.floor((i * nc) / tot) ? 'C' : 'A');
  return o.map((_, i) => o[(i + geser) % n]);
}
function ionDraw(){
  const I = labS.i, X = ionInfo(), g = $L('iAtoms'); g.innerHTML = '';
  const f = I.started ? labKlem(I.t / T_ION, 0, 1) : 0, fe = labEase(f);
  const ys = [ionY(X.nc), ionY(X.na)];
  const rM0 = 38, rN0 = Math.max(18, X.B.r * 0.21 * 0.8), rMi = X.A.r * 0.21, rNi = X.B.r * 0.21;
  const rm = lerp(rM0, rMi, labEase((f - 0.55) / 0.25)), rn = lerp(rN0, rNi, labEase((f - 0.55) / 0.25));
  const ang = k => (-90 + 45 * k) * Math.PI / 180;
  const metals = ys[0].map(y => ({ x:92, y:y })), nons = ys[1].map(y => ({ x:272, y:y }));
  // elektron berpindah
  const orderM = [0, 1, 7, 2, 6, 3];
  const need = nons.map(() => ({ n:X.B.q, got:0 }));
  const eList = []; let jj = 0;
  metals.forEach((m, i) => { for (let k = 0; k < X.A.ve; k++) {
    while (need[jj] && need[jj].got >= need[jj].n) jj++;
    const tj = Math.min(jj, nons.length - 1); const slot = X.B.ve + need[tj].got; need[tj].got++;
    eList.push({ m:i, k:orderM[k], tj:tj, slot:slot });
  } });
  const ringM = rM0 + 9, ringN = rn + 9;
  // lingkaran atom / ion
  metals.forEach((m, i) => {
    svEl('circle', { cx:m.x, cy:m.y, r:rm, fill:'rgba(46,155,214,.14)', stroke:f > 0.7 ? '#FFB27A' : '#9CC9FF', 'stroke-width':2.5 }, g);
    teks(g, m.x, m.y + 5, X.A.s, { s:15, a:'middle', f:'Fraunces,Georgia,serif' });
    if (f >= 0.7) teks(g, m.x + rm + 4, m.y - rm + 6, SUPQ[X.A.q], { s:13, c:'#FFB27A' });
  });
  nons.forEach((m, j) => {
    svEl('circle', { cx:m.x, cy:m.y, r:rn, fill:'rgba(255,226,154,.14)', stroke:f > 0.7 ? '#8EC1FF' : '#FFE29A', 'stroke-width':2.5 }, g);
    teks(g, m.x, m.y + 5, X.B.s, { s:15, a:'middle', f:'Fraunces,Georgia,serif' });
    if (f >= 0.7) teks(g, m.x + rn + 4, m.y - rn + 6, SUPA[X.B.q], { s:13, c:'#8EC1FF' });
    for (let k = 0; k < X.B.ve; k++) svEl('circle', { cx:m.x + ringN * Math.cos(ang(k)), cy:m.y + ringN * Math.sin(ang(k)), r:3.8, fill:'#8EC1FF', stroke:'#fff', 'stroke-width':1 }, g);
  });
  const fT = labEase((f - 0.15) / 0.5);
  eList.forEach(e => {
    const m = metals[e.m], t = nons[e.tj];
    const sx = m.x + ringM * Math.cos(ang(e.k)), sy = m.y + ringM * Math.sin(ang(e.k));
    const tx = t.x + ringN * Math.cos(ang(e.slot)), ty = t.y + ringN * Math.sin(ang(e.slot));
    const px = lerp(sx, tx, fT), py = lerp(sy, ty, fT) - Math.sin(fT * Math.PI) * 26;
    svEl('circle', { cx:px, cy:py, r:4.2, fill:'#FFB27A', stroke:'#fff', 'stroke-width':1.2 }, g);
  });
  if (f >= 0.85) {
    metals.forEach((m, i) => { const t = nons[i % nons.length]; svEl('line', { x1:m.x + rm + 4, y1:m.y, x2:t.x - rn - 6, y2:t.y, stroke:'#FFE29A', 'stroke-width':1.6, 'stroke-dasharray':'4 3', opacity:fe }, g); });
    teks(g, 182, 222, 'tarik-menarik', { s:10.5, c:'#FFE29A', a:'middle' });
  }
  if (f >= 0.92) {
    [...metals.map(m => [m, rm]), ...nons.map(m => [m, rn])].forEach(([m, r]) => svEl('circle', { cx:m.x, cy:m.y, r:r + 8, fill:'none', stroke:'#4ADE80', 'stroke-width':2, 'stroke-dasharray':'5 3' }, g));
    teks(g, 190, 398, 'kedua ion mencapai konfigurasi gas mulia', { s:11, c:'#4ADE80', a:'middle' });
  } else if (!I.started) teks(g, 190, 398, 'tekan "Bentuk senyawa ion" untuk memulai', { s:11, c:'#AEC0E0', a:'middle' });
  const pre = (X.nc > 1 ? X.nc : '') + X.A.s, pn = (X.na > 1 ? X.na : '') + X.B.s;
  $L('iEq').textContent = f >= 0.7 ? (X.nc > 1 ? X.nc : '') + X.A.s + SUPQ[X.A.q] + ' + ' + (X.na > 1 ? X.na : '') + X.B.s + SUPA[X.B.q] + (f >= 0.95 ? ' → ' + X.formula : '') : pre + ' + ' + pn;
  // kartu kanan
  const r = $L('iRows'); r.innerHTML = '';
  const terbentuk = f >= 0.95;
  baris(r, 104, 'Kation', X.A.s + SUPQ[X.A.q] + '  (melepas ' + X.A.q + ' e⁻)', '#FFB27A');
  baris(r, 128, 'Anion', X.B.s + SUPA[X.B.q] + '  (menerima ' + X.B.q + ' e⁻)', '#8EC1FF');
  baris(r, 152, 'Elektron berpindah', terbentuk ? X.e + ' e⁻ per satuan rumus' : '?');
  baris(r, 176, 'Perbandingan ion', terbentuk ? X.nc + ' : ' + X.na : '?');
  baris(r, 200, 'Rumus senyawa', terbentuk ? X.formula : '?', '#4ADE80');
  baris(r, 224, 'Indeks gaya tarik (NaCl = 1)', terbentuk ? labNum(X.idx, 1) + '×' : '?');
  baris(r, 248, 'Titik leleh', terbentuk ? (X.mp ? X.mp + ' °C' + (X.cat ? ' (' + X.cat + ')' : '') : (X.cat || '—')) : '?', '#FF9A8A');
  svEl('line', { x1:392, y1:264, x2:696, y2:264, stroke:'rgba(255,255,255,.14)' }, r);
  // kisi kristal
  const lat = $L('iLat'); lat.innerHTML = '';
  if (terbentuk) {
    const sp = 32, n = 9, x0 = 544 - (n - 1) * sp / 2, rc = labKlem(X.A.r * 0.08, 5, 11), ra = labKlem(X.B.r * 0.08, 8, 15);
    const s = I.sh.run ? labKlem(I.sh.t / 1.6, 0, 1) : 0, retak = I.sh.run && I.sh.t > 1.0;
    for (let rr = 0; rr < 3; rr++) {
      const pola = irisanPola(X.nc, X.na, n, rr), yy = 296 + rr * 28 + (retak && rr > 0 ? 7 : 0), off = rr > 0 ? s * sp : 0;
      pola.forEach((t, i) => svEl('circle', { cx:x0 + i * sp + off, cy:yy, r:t === 'C' ? rc : ra, fill:t === 'C' ? '#FFB27A' : '#8EC1FF', stroke:'#fff', 'stroke-width':1.2 }, lat));
    }
    if (s > 0.55) {
      svEl('path', { d:'M388,311 L418,319 L446,309 L478,320 L510,310 L540,321 L570,309 L600,320 L632,311 L664,319 L700,310', fill:'none', stroke:'#FF5A4A', 'stroke-width':2.5, opacity:labKlem((s - 0.55) / 0.3, 0, 1) }, lat);
      for (let i = 0; i < 5; i++) teks(lat, 420 + i * 62, 312, '↯', { s:13, c:'#FF5A4A', a:'middle' });
    }
    teks(lat, 544, 386, I.sh.run ? (s > 0.55 ? 'ion sejenis berhadapan → saling tolak → pecah' : 'lapisan digeser...') : 'kisi kristal: ion berlawanan muatan berselang-seling', { s:10.5, c:I.sh.run && s > 0.55 ? '#FF9A8A' : '#AEC0E0', a:'middle' });
  } else teks(lat, 544, 340, 'kisi kristal terbentuk setelah ion terbentuk', { s:11, c:'#8FA3C7', a:'middle' });
  $L('lPillT').textContent = terbentuk ? X.formula + ' · senyawa ion' : X.A.s + ' + ' + X.B.s;
  $L('lInfo1').textContent = terbentuk ? 'Logam melepas elektron, nonlogam menerimanya' : 'Perhatikan perpindahan elektron valensi';
  $L('lInfo2').textContent = terbentuk ? 'Muatan total senyawa = 0' : ' ';
  const st = $L('lab-status'); st.textContent = I.run ? 'Elektron berpindah...' : (terbentuk ? X.formula + ' terbentuk' : 'Siap'); st.className = 'lab-status ' + (I.run || terbentuk ? 'on' : 'off');
}
function ionSelesai(){
  const I = labS.i, X = ionInfo();
  if (!I.formed.includes(X.key)) I.formed.push(X.key);
  I.last = X;
}

/* ---------- Ikatan kovalen ---------- */
function labKovPilih(id){ const K = labS.k; K.mol = id; K.t = 0; K.run = false; K.started = false; labRender(); }
function labKovJalan(){ const K = labS.k; K.t = 0; K.run = true; K.started = true; labRenderPanel(); sfx('click'); }
function angBeda(a, b){ return Math.abs(((a - b + 540) % 360) - 180); }
const _kl = {};
function kovLayout(key){
  if (_kl[key]) return _kl[key];
  const M = KMOL[key];
  const atoms = M.at.map(([el, x, y], i) => ({ el:el, x:x, y:y, ve:AT[el].ve, r:AT[el].r, bond:0, dirs:[], i:i }));
  M.bd.forEach(([a, b, o]) => { atoms[a].bond += o; atoms[b].bond += o; const d = Math.atan2(atoms[b].y - atoms[a].y, atoms[b].x - atoms[a].x) * 180 / Math.PI; atoms[a].dirs.push(d); atoms[b].dirs.push(d + 180); });
  atoms.forEach(a => {
    a.np = (a.ve - a.bond) / 2; a.eks = [];
    for (let k = 0; k < a.ve; k++) { const ang = (-90 + k * 360 / a.ve) * Math.PI / 180, rr = a.r + 11; a.eks.push({ fx:a.x + rr * Math.cos(ang), fy:a.y + rr * Math.sin(ang) }); }
    const cand = [-90, -45, 0, 45, 90, 135, 180, -135];
    let pil = [], bestS = -1;
    const komb = (start, cur) => {
      if (cur.length === a.np) {
        let m = 180;
        cur.forEach((c, i) => { a.dirs.forEach(d => { m = Math.min(m, angBeda(c, d)); }); cur.forEach((q, j) => { if (j > i) m = Math.min(m, angBeda(c, q)); }); });
        if (m > bestS + 1e-9) { bestS = m; pil = cur.slice(); }
        return;
      }
      for (let i = start; i < cand.length; i++) { cur.push(cand[i]); komb(i + 1, cur); cur.pop(); }
    };
    komb(0, []);
    a.pil = pil; a.dipake = 0;
  });
  const bonds = M.bd.map(([ia, ib, o]) => {
    const A = atoms[ia], B = atoms[ib], mx = (A.x + B.x) / 2, my = (A.y + B.y) / 2, L = Math.hypot(B.x - A.x, B.y - A.y) || 1, ux = (B.x - A.x) / L, uy = (B.y - A.y) / L, px = -uy, py = ux;
    const dc = CHI[B.el] - CHI[A.el];
    return { a:ia, b:ib, o:o, mx:mx, my:my, ux:ux, uy:uy, px:px, py:py, dchi:dc };
  });
  const el = [];
  const takeA = (a) => { const A = atoms[a], e = A.eks[A.dipake]; A.dipake++; return e; };
  bonds.forEach(b => {
    for (let j = 0; j < b.o; j++) {
      const off = (j - (b.o - 1) / 2) * 12, cx = b.mx + b.px * off, cy = b.my + b.py * off;
      const ea = takeA(b.a), eb = takeA(b.b);
      el.push({ fx:ea.fx, fy:ea.fy, tx:cx - b.ux * 5, ty:cy - b.uy * 5, col:'#FFB27A' });
      el.push({ fx:eb.fx, fy:eb.fy, tx:cx + b.ux * 5, ty:cy + b.uy * 5, col:'#8EC1FF' });
    }
  });
  atoms.forEach(a => {
    a.pil.forEach(p => {
      const ang = p * Math.PI / 180, rr = a.r + 11, tg = [-0.17, 0.17];
      tg.forEach(dd => { const e = a.eks[a.dipake]; a.dipake++; el.push({ fx:e.fx, fy:e.fy, tx:a.x + rr * Math.cos(ang + dd), ty:a.y + rr * Math.sin(ang + dd), col:a.i % 2 === 0 ? '#FFB27A' : '#8EC1FF' }); });
    });
  });
  return (_kl[key] = { atoms:atoms, bonds:bonds, el:el });
}
function kovBond(b, atoms){
  const A = atoms[b.a].el, B = atoms[b.b].el, o = b.o, s = o === 1 ? '–' : (o === 2 ? '=' : '≡');
  const k1 = A + s + B, k2 = B + s + A;
  return IKT[k1] ? { k:k1, d:IKT[k1] } : { k:k2, d:IKT[k2] };
}
function kovDraw(){
  const K = labS.k, M = KMOL[K.mol], Ly = kovLayout(K.mol), g = $L('kMol'); g.innerHTML = '';
  const f = K.started ? labKlem(K.t / T_KOV, 0, 1) : 0, fe = labEase(f), CXs = 190, CYs = 252;
  const polar = Ly.bonds.some(b => Math.abs(b.dchi) >= 0.4);
  Ly.bonds.forEach(b => {
    const A = Ly.atoms[b.a], B = Ly.atoms[b.b];
    svEl('line', { x1:CXs + A.x, y1:CYs + A.y, x2:CXs + B.x, y2:CYs + B.y, stroke:'#5C7298', 'stroke-width':2, opacity:0.5 }, g);
    if (f > 0.1) {
      const sh = Math.abs(b.dchi) >= 0.4 ? Math.sign(b.dchi) * 12 : 0;
      svEl('ellipse', { cx:CXs + b.mx + b.ux * sh, cy:CYs + b.my + b.uy * sh, rx:42, ry:20 + b.o * 4, transform:'rotate(' + Math.atan2(b.uy, b.ux) * 180 / Math.PI + ' ' + (CXs + b.mx + b.ux * sh) + ' ' + (CYs + b.my + b.uy * sh) + ')', fill:'url(#gCloud)', opacity:fe * 0.8 }, g);
    }
  });
  Ly.atoms.forEach(a => {
    svEl('circle', { cx:CXs + a.x, cy:CYs + a.y, r:a.r, fill:a.i % 2 === 0 ? 'rgba(255,178,122,.2)' : 'rgba(142,193,255,.2)', stroke:a.i % 2 === 0 ? '#FFB27A' : '#8EC1FF', 'stroke-width':2.5 }, g);
    teks(g, CXs + a.x, CYs + a.y + 6, a.el, { s:a.el === 'H' ? 15 : 18, a:'middle', f:'Fraunces,Georgia,serif' });
    if (f >= 0.92) {
      svEl('circle', { cx:CXs + a.x, cy:CYs + a.y, r:a.r + 22, fill:'none', stroke:'#4ADE80', 'stroke-width':1.8, 'stroke-dasharray':'4 3', opacity:.9 }, g);
      teks(g, CXs + a.x, CYs + a.y - a.r - 28, (a.ve - a.bond + 2 * a.bond) + ' e⁻', { s:10.5, c:'#4ADE80', a:'middle' });
    }
  });
  Ly.el.forEach(e => svEl('circle', { cx:CXs + lerp(e.fx, e.tx, fe), cy:CYs + lerp(e.fy, e.ty, fe), r:4.2, fill:e.col, stroke:'#fff', 'stroke-width':1.2 }, g));
  const keluar = a => { let sx = 0, sy = 0; Ly.bonds.forEach(b => { if (b.a === a.i) { sx += b.ux; sy += b.uy; } if (b.b === a.i) { sx -= b.ux; sy -= b.uy; } }); const n = Math.hypot(sx, sy); return n < 0.01 ? [0, 1] : [-sx / n, -sy / n]; };
  if (f >= 0.92 && polar) Ly.bonds.forEach(b => {
    if (Math.abs(b.dchi) < 0.4) return;
    const neg = b.dchi > 0 ? Ly.atoms[b.b] : Ly.atoms[b.a], pos = b.dchi > 0 ? Ly.atoms[b.a] : Ly.atoms[b.b];
    [[neg, 'δ−', '#8EC1FF'], [pos, 'δ+', '#FFB27A']].forEach(([at, lb, col]) => { const o = keluar(at), d = at.r + 34; teks(g, CXs + at.x + o[0] * d, CYs + at.y + o[1] * d + 4, lb, { s:12, c:col, a:'middle' }); });
  });
  if (f >= 0.92 && labS.mikro) {
    Ly.bonds.forEach(b => teks(g, CXs + b.mx + b.px * 26, CYs + b.my + b.py * 26, 'PEI', { s:10, c:'#FFE29A', a:'middle' }));
    Ly.atoms.forEach(a => { if (a.pil.length) { const p = a.pil[0] * Math.PI / 180, rr = a.r + 24; teks(g, CXs + a.x + rr * Math.cos(p), CYs + a.y + rr * Math.sin(p) + 3, 'PEB', { s:10, c:'#FFE29A', a:'middle' }); } });
  }
  if (!K.started) teks(g, CXs, 398, 'tekan "Bentuk ikatan kovalen" untuk melihat pemakaian bersama', { s:11, c:'#AEC0E0', a:'middle' });
  else if (f >= 0.92) teks(g, CXs, 398, 'setiap atom mencapai oktet (H: duplet)', { s:11, c:'#4ADE80', a:'middle' });
  // kartu kanan
  const r = $L('kRows'); r.innerHTML = '';
  const jenis = {}; Ly.bonds.forEach(b => { const kb = kovBond(b, Ly.atoms); jenis[kb.k] = (jenis[kb.k] || { n:0, d:kb.d, b:b }); jenis[kb.k].n++; });
  const tot = Ly.bonds.reduce((a, b) => a + b.o, 0), peb = Ly.atoms.reduce((a, b) => a + b.np, 0);
  const done = f >= 0.95;
  baris(r, 104, 'Rumus', M.f + ' (' + M.nama + ')', '#4ADE80');
  baris(r, 128, 'Pasangan elektron bersama', done ? tot + ' pasang' : '?');
  baris(r, 152, 'Pasangan elektron bebas (PEB)', done ? peb + ' pasang' : '?');
  let y = 176;
  Object.keys(jenis).forEach(k => {
    const J = jenis[k], dc = Math.abs(J.b.dchi), ord = J.b.o === 1 ? 'tunggal' : (J.b.o === 2 ? 'rangkap dua' : 'rangkap tiga');
    baris(r, y, 'Ikatan ' + k + (J.n > 1 ? ' ×' + J.n : ''), done ? ord : '?', '#FFB27A'); y += 24;
    baris(r, y, 'Δχ ikatan', done ? labNum(dc, 2) + (dc < 0.4 ? ' (nonpolar)' : ' (polar)') : '?'); y += 24;
    baris(r, y, 'Panjang · energi ikatan', done ? J.d.L + ' pm · ' + J.d.E + ' kJ/mol' : '?', '#FF9A8A'); y += 24;
  });
  $L('kEq').textContent = M.f + (f >= 0.95 ? ' · ' + tot + ' pasang bersama' : '');
  $L('lPillT').textContent = M.f + ' · senyawa kovalen';
  $L('lInfo1').textContent = polar ? 'Elektron lebih dekat ke atom yang lebih elektronegatif' : 'Elektron dibagi sama rata';
  $L('lInfo2').textContent = 'Pasangan bersama lebih banyak: ikatan lebih kuat';
  const st = $L('lab-status'); st.textContent = K.run ? 'Elektron dipakai bersama...' : (done ? 'Ikatan kovalen terbentuk' : 'Siap'); st.className = 'lab-status ' + (K.run || done ? 'on' : 'off');
}
function kovSelesai(){ const K = labS.k; if (!K.formed.includes(K.mol)) K.formed.push(K.mol); }

/* ---------- Ikatan logam ---------- */
function labLogamPilih(id){ labS.l.me = id; labS.l.bangun = ''; labRender(); }
function labMedan(){ labS.l.field = !labS.l.field; labRender(); }
function labTempa(){ const L = labS.l; if (L.tempa.run) return; L.tempa.t = 0; L.tempa.run = true; sfx('click'); }
function logamBangun(){
  const L = labS.l, M = LOGAM[L.me];
  if (L.bangun === L.me) return;
  L.bangun = L.me; const r = rng(7 + M.ve); L.e = [];
  const n = 24 * M.ve;
  for (let i = 0; i < n; i++) L.e.push({ x:60 + r() * 270, y:126 + r() * 170, a:r() * 6.28 });
}
function logamDraw(){
  const L = labS.l, M = LOGAM[L.me], g = $L('lLat'); g.innerHTML = '';
  logamBangun();
  const sp = 52, rows = 4, cols = 6, x0 = 60, y0 = 140;
  const s = L.tempa.run ? labEase(L.tempa.t / 1.6) : 0, ft = L.tempa.run ? L.tempa.t : 0;
  svEl('rect', { x:30, y:112, width:320, height:196, rx:14, fill:'rgba(46,155,214,.1)', stroke:'#9CC9FF', 'stroke-width':2 }, g);
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
    const off = r < 2 ? s * sp : 0;
    const x = x0 + c * sp + off, y = y0 + r * 50;
    if (x > 345) continue;
    svEl('circle', { cx:x, cy:y, r:15, fill:'#F26A21', stroke:'#fff', 'stroke-width':2 }, g);
    teks(g, x, y + 5, M.ve > 1 ? M.ve + '+' : '+', { s:12, a:'middle' });
  }
  // elektron bebas
  L.e.forEach(e => {
    e.a += (Math.random() - 0.5) * 1.4;
    e.x += Math.cos(e.a) * 1.7 + (L.field ? 2.6 : 0); e.y += Math.sin(e.a) * 1.7;
    if (e.x > 344) e.x = 36; if (e.x < 36) e.x = 344; e.y = labKlem(e.y, 118, 302);
    svEl('circle', { cx:e.x, cy:e.y, r:3.4, fill:'#8EC1FF', stroke:'#0E2240', 'stroke-width':0.8 }, g);
  });
  if (labS.mikro) { teks(g, 60, 128, 'kation logam', { s:10, c:'#FFB27A' }); teks(g, 270, 300, 'elektron bebas', { s:10, c:'#8EC1FF' }); }
  if (ft > 0.2 && s < 1) { teks(g, 190, 100, '→  gaya  →', { s:11, c:'#FFB27A', a:'middle' }); teks(g, 190, 322, '←  gaya  ←', { s:11, c:'#FFB27A', a:'middle' }); }
  // rangkaian listrik
  svEl('rect', { x:12, y:322, width:22, height:34, rx:4, fill:'#1B3A6B', stroke:'#8EC1FF', 'stroke-width':2 }, g); teks(g, 23, 344, '−', { s:20, a:'middle', c:'#8EC1FF' });
  svEl('rect', { x:346, y:322, width:22, height:34, rx:4, fill:'#1B3A6B', stroke:'#FF9A8A', 'stroke-width':2 }, g); teks(g, 357, 344, '+', { s:18, a:'middle', c:'#FF9A8A' });
  svEl('path', { d:'M23,322 V312 M357,322 V312', stroke:'#C9D3E6', 'stroke-width':3, fill:'none' }, g);
  svEl('path', { d:'M23,356 V372 H150 M230,372 H357 V356', stroke:'#C9D3E6', 'stroke-width':3, fill:'none' }, g);
  svEl('circle', { cx:190, cy:372, r:30, fill:'url(#gGlow)', opacity:L.field ? 1 : 0 }, g);
  svEl('circle', { cx:190, cy:372, r:16, fill:L.field ? '#FFE29A' : '#1B3A6B', stroke:'#C9D3E6', 'stroke-width':3 }, g);
  teks(g, 190, 404, L.field ? 'lampu menyala: elektron mengalir ke kutub +' : 'medan listrik mati', { s:10.5, c:L.field ? '#FFE29A' : '#8FA3C7', a:'middle' });
  $L('lEq').textContent = M.s + ' · ' + (24 * M.ve) + ' elektron valensi bebas';
  const r = $L('lRows'); r.innerHTML = '';
  baris(r, 104, 'Logam', M.s, '#4ADE80');
  baris(r, 128, 'Elektron valensi per atom', String(M.ve));
  baris(r, 152, 'Jari-jari ion', M.r + ' pm');
  const q = (M.ve / M.r) / (1 / 102);
  baris(r, 176, 'Kerapatan muatan q/r (Na = 1)', labNum(q, 2) + '×');
  baris(r, 200, 'Titik leleh', M.mp + ' °C', '#FF9A8A');
  baris(r, 224, 'Titik didih', M.bp + ' °C', '#FF9A8A');
  svEl('line', { x1:392, y1:242, x2:696, y2:242, stroke:'rgba(255,255,255,.14)' }, r);
  teks(r, 544, 262, 'Titik leleh logam (°C)', { s:10.5, c:'#AEC0E0', a:'middle' });
  L_IDS.forEach((id, i) => {
    const y = 274 + i * 28, m = LOGAM[id];
    teks(r, 392, y + 13, m.s + ' (' + m.ve + ' e⁻)', { s:11.5, c:id === L.me ? '#FFE29A' : '#AEC0E0' });
    svEl('rect', { x:470, y:y, width:190, height:16, rx:8, fill:'rgba(255,255,255,.1)' }, r);
    svEl('rect', { x:470, y:y, width:Math.max(8, 190 * m.mp / 700), height:16, rx:8, fill:id === L.me ? '#F26A21' : '#3B6CB3' }, r);
    teks(r, 696, y + 13, String(m.mp), { s:11.5, a:'end', c:id === L.me ? '#FFE29A' : '#AEC0E0' });
  });
  $L('lPillT').textContent = M.s + ' · ikatan logam';
  $L('lInfo1').textContent = 'Kation logam berendam dalam lautan elektron';
  $L('lInfo2').textContent = L.tempa.run && s >= 1 ? 'lapisan bergeser, ikatan logam tetap utuh' : 'Aktifkan medan listrik atau tempa logam';
  const st = $L('lab-status'); st.textContent = L.tempa.run ? 'Ditempa...' : (L.field ? 'Arus mengalir' : 'Siap'); st.className = 'lab-status ' + (L.tempa.run || L.field ? 'on' : 'off');
}

/* ---------- Uji sifat ---------- */
function labUjiPilih(id){ const U = labS.u; U.samp = id; U.run = null; U.aktif = null; U.t = 0; U.bangun = ''; labRender(); }
function labUjiJalan(id){
  const U = labS.u; if (U.run) return;
  U.aktif = id; U.run = id; U.t = 0; labRenderPanel(); sfx('click');
}
function panasModel(S){
  const sp = S.bp - S.mp, T0 = (S.mp - 60 > 25) ? 25 : S.mp - Math.max(60, 0.6 * sp), T1 = S.bp + Math.max(60, 0.5 * sp), pl = [1.0, 1.4];
  return { T0:T0, T1:T1, pl:pl, rate:(T1 - T0) / (T_HEAT - pl[0] - pl[1]) };
}
function panasDi(S, t){
  const m = panasModel(S); let tt = t;
  const d1 = (S.mp - m.T0) / m.rate;
  if (tt <= d1) return { T:m.T0 + m.rate * tt, ph:'padat', fr:0 };
  tt -= d1; if (tt <= m.pl[0]) return { T:S.mp, ph:'melebur', fr:tt / m.pl[0] };
  tt -= m.pl[0]; const d2 = (S.bp - S.mp) / m.rate;
  if (tt <= d2) return { T:S.mp + m.rate * tt, ph:'cair', fr:1 };
  tt -= d2; if (tt <= m.pl[1]) return { T:S.bp, ph:'mendidih', fr:tt / m.pl[1] };
  tt -= m.pl[1]; return { T:Math.min(m.T1, S.bp + m.rate * tt), ph:'gas', fr:1 };
}
function ujiBangun(){
  const U = labS.u;
  if (U.bangun === U.samp) return;
  U.bangun = U.samp; const r = rng(31 + U.samp.length * 7), n = 32; U.p = [];
  for (let i = 0; i < n; i++) U.p.push({ s:{ x:112 + (i % 8) * 22, y:394 - Math.floor(i / 8) * 20 }, l:{ x:112 + r() * 156, y:318 + r() * 72 }, g:{ x:112 + r() * 156, y:262 + r() * 130 } });
}
function partikel(g, S, p, i, t, fase, fr){
  const rnk = i / 32, amp = fase === 'padat' ? 1.1 : (fase === 'cair' ? 3 : 6);
  let q = fase === 'padat' ? p.s : (fase === 'cair' ? p.l : p.g);
  if (fase === 'melebur') q = rnk < fr ? p.l : p.s;
  if (fase === 'mendidih') q = rnk < fr ? p.g : p.l;
  const a = fase === 'melebur' ? (rnk < fr ? 3 : 1.1) : (fase === 'mendidih' ? (rnk < fr ? 6 : 3) : amp);
  const x = q.x + Math.sin(t * 6 + i) * a, y = q.y + Math.cos(t * 5 + i * 1.3) * a;
  if (S.tipe === 'ion') svEl(i % 2 ? 'circle' : 'rect', i % 2 ? { cx:x, cy:y, r:7, fill:'#FFB27A', stroke:'#fff', 'stroke-width':1 } : { x:x - 7, y:y - 7, width:14, height:14, rx:3, fill:'#8EC1FF', stroke:'#fff', 'stroke-width':1 }, g);
  else if (S.tipe === 'logam') { svEl('circle', { cx:x, cy:y, r:8, fill:'#F26A21', stroke:'#fff', 'stroke-width':1 }, g); svEl('circle', { cx:x + 9, cy:y - 5, r:2.6, fill:'#8EC1FF' }, g); }
  else if (S.tipe === 'kovalen') { svEl('circle', { cx:x - 5, cy:y, r:5.5, fill:'#B7C2D6', stroke:'#6B7C99', 'stroke-width':1 }, g); svEl('circle', { cx:x + 5, cy:y, r:5.5, fill:'#B7C2D6', stroke:'#6B7C99', 'stroke-width':1 }, g); }
  else svEl('circle', { cx:x, cy:y, r:6, fill:'#9AA7BF', stroke:'#4B5B7A', 'stroke-width':1.2 }, g);
}
function ujiDraw(){
  const U = labS.u, S = SAMP[U.samp], g = $L('uSet'); g.innerHTML = '';
  ujiBangun();
  const aktif = U.aktif, t = U.t, f = U.run ? labKlem(t / (U.run === 'panas' ? T_HEAT : T_COND), 0, 1) : (aktif ? 1 : 0);
  const kond = (aktif && aktif !== 'panas') ? S.h[aktif] : null;
  // fase wadah
  let fase = 'padat', fr = 0, Tnow = 25;
  if (aktif === 'leleh') fase = 'cair'; if (aktif === 'larut') fase = 'cair';
  if (aktif === 'panas') { const d = panasDi(S, f * T_HEAT); fase = d.ph; fr = d.fr; Tnow = d.T; }
  // rangkaian
  svEl('path', { d:'M135,246 V112 H170 M210,112 H245 V246', stroke:'#C9D3E6', 'stroke-width':3, fill:'none' }, g);
  svEl('rect', { x:170, y:100, width:12, height:24, rx:2, fill:'#C9D3E6' }, g); svEl('rect', { x:198, y:94, width:12, height:36, rx:2, fill:'#C9D3E6' }, g);
  teks(g, 190, 90, 'baterai', { s:10, c:'#8FA3C7', a:'middle' });
  const nyala = kond === true && f > 0.3;
  svEl('circle', { cx:135, cy:176, r:36, fill:'url(#gGlow)', opacity:nyala ? 1 : 0 }, g);
  svEl('circle', { cx:135, cy:176, r:18, fill:nyala ? '#FFE29A' : '#1B3A6B', stroke:'#C9D3E6', 'stroke-width':3 }, g);
  teks(g, 135, 212, 'lampu', { s:10, c:'#8FA3C7', a:'middle' });
  // elektrode
  svEl('rect', { x:129, y:246, width:12, height:84, rx:3, fill:'#B8C4D8', stroke:'#8795AD', 'stroke-width':1.5 }, g);
  svEl('rect', { x:239, y:246, width:12, height:84, rx:3, fill:'#B8C4D8', stroke:'#8795AD', 'stroke-width':1.5 }, g);
  // wadah
  const wet = aktif === 'larut' ? 'rgba(86,170,255,.3)' : (fase === 'cair' || fase === 'mendidih' ? 'rgba(255,178,122,.25)' : (fase === 'gas' ? 'rgba(255,255,255,.05)' : 'rgba(255,255,255,.06)'));
  const g2 = svEl('g', { 'clip-path':'url(#clipU)' }, g);
  if (aktif === 'larut') {
    svEl('rect', { x:100, y:286, width:180, height:120, fill:wet }, g2);
    if (kond !== null) { const bag = svEl('g', {}, g2); const r = rng(5); for (let i = 0; i < 20; i++) { const x = 112 + r() * 156 + Math.sin(t * 4 + i) * 3, y = 296 + r() * 90 + Math.cos(t * 3 + i) * 3; if (S.tipe === 'ion') svEl(i % 2 ? 'circle' : 'rect', i % 2 ? { cx:x, cy:y, r:6, fill:'#FFB27A', stroke:'#fff' } : { x:x - 6, y:y - 6, width:12, height:12, rx:3, fill:'#8EC1FF', stroke:'#fff' }, bag); else svEl('circle', { cx:x, cy:y, r:6, fill:'#9AA7BF' }, bag); } }
    else teks(g2, 190, 340, 'tidak larut / bereaksi', { s:12, c:'#FF9A8A', a:'middle' });
  } else {
    if (fase === 'cair' || fase === 'mendidih' || fase === 'melebur') svEl('rect', { x:100, y:fase === 'melebur' ? 330 : 312, width:180, height:100, fill:wet }, g2);
    U.p.forEach((p, i) => partikel(g2, S, p, i, t, fase, fr));
  }
  svEl('path', { d:'M100,246 V394 Q100,406 112,406 H268 Q280,406 280,394 V246', fill:'none', stroke:'#fff', 'stroke-opacity':.75, 'stroke-width':4.5, 'stroke-linecap':'round' }, g);
  // nyala api + termometer saat memanaskan
  if (aktif === 'panas') {
    const k = 0.7 + 0.3 * Math.sin(t * 14);
    svEl('path', { d:'M170,432 C160,416 176,410 180,394 C186,408 204,414 196,432 Z', fill:'#F26A21', opacity:0.9 * k }, g);
    svEl('path', { d:'M180,432 C176,420 186,416 188,406 C192,416 198,422 194,432 Z', fill:'#FFE29A' }, g);
    const m = panasModel(S), hh = labKlem((Tnow - m.T0) / (m.T1 - m.T0), 0, 1);
    svEl('rect', { x:300, y:150, width:16, height:230, rx:8, fill:'#fff', 'fill-opacity':.14, stroke:'#fff', 'stroke-width':2 }, g);
    svEl('rect', { x:304, y:376 - 222 * hh, width:8, height:222 * hh + 4, rx:4, fill:'#FF5A4A' }, g);
    svEl('circle', { cx:308, cy:388, r:13, fill:'#FF5A4A', stroke:'#fff', 'stroke-width':2 }, g);
    teks(g, 308, 138, labNum(Tnow, 0) + ' °C', { s:13, c:'#FFB27A', a:'middle' });
    teks(g, 190, 240, fase === 'padat' ? 'padat' : (fase === 'melebur' ? 'melebur (suhu tetap)' : (fase === 'cair' ? 'cair' : (fase === 'mendidih' ? 'mendidih (suhu tetap)' : 'gas'))), { s:11.5, c:'#FFE29A', a:'middle' });
  } else if (aktif) teks(g, 190, 240, aktif === 'padat' ? 'sampel padat' : (aktif === 'leleh' ? 'sampel meleleh' : 'dilarutkan dalam air'), { s:11.5, c:'#FFE29A', a:'middle' });
  else teks(g, 190, 240, 'pilih uji pada panel', { s:11.5, c:'#8FA3C7', a:'middle' });
  // kartu hantar
  const r = $L('uRows'); r.innerHTML = '';
  const res = U.res[U.samp] || {};
  [['padat', 'Padat'], ['leleh', 'Leleh'], ['larut', 'Larutan']].forEach(([id, nm], i) => {
    const y = 104 + i * 26, v = res[id];
    teks(r, 392, y, nm, { s:12, w:700, c:'#AEC0E0' });
    let txt = 'belum diuji', col = '#8FA3C7';
    if (v === true) { txt = '✓ menghantar listrik'; col = '#4ADE80'; } else if (v === false) { txt = '✗ tidak menghantar'; col = '#FF9A8A'; } else if (v === null) { txt = 'tidak berlaku (tidak larut/bereaksi)'; col = '#FFE29A'; }
    teks(r, 696, y, txt, { s:12, c:col, a:'end' });
  });
  teks(r, 392, 182, res.panas ? 'Titik leleh ' + S.mp + ' °C · titik didih ' + S.bp + ' °C' : 'Titik leleh/didih: panaskan sampel', { s:11.5, c:res.panas ? '#FFB27A' : '#8FA3C7' });
  // kurva pemanasan
  const c = $L('uCurve'); c.innerHTML = '';
  const m = panasModel(S), X = tt => 420 + tt / T_HEAT * 280, Y = T => 380 - (T - m.T0) / (m.T1 - m.T0) * 148;
  svEl('line', { x1:420, y1:380, x2:700, y2:380, stroke:'#AEC0E0', 'stroke-width':2 }, c); svEl('line', { x1:420, y1:380, x2:420, y2:228, stroke:'#AEC0E0', 'stroke-width':2 }, c);
  [[S.mp, 'leleh ' + S.mp + ' °C', '#7FB5FF'], [S.bp, 'didih ' + S.bp + ' °C', '#FF9A8A']].forEach(([T, lb, col]) => {
    svEl('line', { x1:420, y1:Y(T), x2:700, y2:Y(T), stroke:col, 'stroke-width':1.2, 'stroke-dasharray':'4 3', opacity:.7 }, c);
    teks(c, 416, Y(T) + 4, lb, { s:9.5, c:col, a:'end' });
  });
  teks(c, 560, 398, 'waktu pemanasan →', { s:10, c:'#8FA3C7', a:'middle' });
  const tampil = aktif === 'panas' ? f * T_HEAT : (res.panas ? T_HEAT : 0);
  if (tampil > 0) {
    let d = ''; for (let k = 0; k <= 80; k++) { const tt = tampil * k / 80, T = panasDi(S, tt).T; d += (k ? 'L' : 'M') + X(tt).toFixed(1) + ',' + Y(T).toFixed(1); }
    svEl('path', { d:d, fill:'none', stroke:'#FFC21A', 'stroke-width':3.2, 'stroke-linejoin':'round' }, c);
    const cur = panasDi(S, tampil); svEl('circle', { cx:X(tampil), cy:Y(cur.T), r:5.5, fill:'#F26A21', stroke:'#fff', 'stroke-width':2 }, c);
  } else teks(c, 560, 310, 'jalankan "Panaskan" untuk melihat kurva', { s:11, c:'#8FA3C7', a:'middle' });
  $L('lPillT').textContent = S.f + ' · ' + TIPE_NAMA[S.tipe];
  $L('lInfo1').textContent = aktif === 'panas' ? 'Suhu tetap selama zat berubah wujud' : 'Uji hantar listrik dan titik leleh/didih';
  $L('lInfo2').textContent = ujiBandingTeks();
  const st = $L('lab-status'); st.textContent = U.run ? 'Menguji...' : (aktif ? 'Uji selesai' : 'Siap'); st.className = 'lab-status ' + (U.run || aktif ? 'on' : 'off');
}
function ujiBandingTeks(){
  const U = labS.u, d = Object.keys(U.res).filter(k => U.res[k].panas);
  if (d.length < 2) return 'Panaskan beberapa zat untuk membandingkan titik lelehnya';
  return 'Urutan titik leleh: ' + d.sort((a, b) => SAMP[b].mp - SAMP[a].mp).map(k => SAMP[k].f).join(' > ');
}
function ujiSelesai(){
  const U = labS.u, id = U.run; U.run = null;
  U.res[U.samp] = U.res[U.samp] || {};
  if (id === 'panas') U.res[U.samp].panas = true; else U.res[U.samp][id] = SAMP[U.samp].h[id];
}

/* ---------- Navigasi dan panel ---------- */
function startLabMaya(){ showScreen('scr-lab'); labRender(); }
function labTab(nama){
  document.querySelectorAll('.lab-tab').forEach(t => t.classList.toggle('active', t.dataset.tab === nama));
  ['rakit','data','misi'].forEach(n => { $L('tab-' + n).style.display = (n === nama) ? 'flex' : 'none'; });
}
function labToggleMikro(){
  labS.mikro = !labS.mikro; labS.dirty = true;
  const b = $L('lab-mode');
  b.classList.toggle('on', labS.mikro);
  b.setAttribute('aria-pressed', String(labS.mikro));
  b.textContent = '🔬 Mode Label: ' + (labS.mikro ? 'hidup' : 'mati');
  if (labS.mikro) labToast('🔬 Label tambahan ditampilkan.');
}
function labChip(wadah, teksx, subx, aktif, onclick, aksi){
  const b = document.createElement('button');
  b.className = 'el-chip' + (aktif ? ' aktif' : '') + (aksi ? ' aksi' : '');
  b.setAttribute('data-sfx', '');
  b.innerHTML = teksx + (subx ? '<small>' + subx + '</small>' : '');
  b.onclick = onclick;
  wadah.appendChild(b);
}
function labSec(judul, ket, kelas){
  const s = document.createElement('div'); s.className = 'lab-sec';
  s.innerHTML = '<div class="lab-sec-title">' + judul + (ket ? ' <span class="lab-sec-note">' + ket + '</span>' : '') + '</div>';
  const g = document.createElement('div'); g.className = kelas; s.appendChild(g);
  $L('rakit-dyn').appendChild(s);
  return g;
}
function labGantiMode(id){ labS.mode = id; labRender(); }
function labRenderPanel(){
  const gm = $L('grid-mode'); gm.innerHTML = ''; gm.style.gridTemplateColumns = 'repeat(2,1fr)';
  LAB_MODE.forEach(m => labChip(gm, m.nama, '', labS.mode === m.id, () => labGantiMode(m.id)));
  $L('rakit-dyn').innerHTML = '';
  const rb = $L('run-btn');
  if (labS.mode === 'i') {
    const I = labS.i;
    const g1 = labSec('⚙️ Logam (melepas e⁻)', '', 'rx-grid cols6');
    KAT_IDS.forEach(id => labChip(g1, KAT[id].s, '', I.me === id, () => labIonPilih('me', id)));
    const g2 = labSec('⚗️ Nonlogam (menerima e⁻)', '', 'rx-grid cols3');
    ANI_IDS.forEach(id => labChip(g2, ANI[id].s, '', I.nm === id, () => labIonPilih('nm', id)));
    const g3 = labSec('🔨 Uji kristal', '', 'rx-grid cols2');
    labChip(g3, '💥 Beri tekanan', 'geser lapisan ion', false, labIonTekan, true);
    rb.style.display = ''; rb.disabled = I.run; rb.textContent = I.run ? '⏳ Elektron berpindah...' : '▶ Bentuk senyawa ion';
  } else if (labS.mode === 'k') {
    const K = labS.k;
    const g1 = labSec('🧪 Molekul', '', 'rx-grid cols5');
    K_IDS.forEach(id => labChip(g1, KMOL[id].f, '', K.mol === id, () => labKovPilih(id)));
    rb.style.display = ''; rb.disabled = K.run; rb.textContent = K.run ? '⏳ Elektron dipakai bersama...' : '▶ Bentuk ikatan kovalen';
  } else if (labS.mode === 'l') {
    const L = labS.l;
    const g1 = labSec('⚙️ Logam', '', 'rx-grid cols4');
    L_IDS.forEach(id => labChip(g1, LOGAM[id].s, LOGAM[id].ve + ' e⁻', L.me === id, () => labLogamPilih(id)));
    const g2 = labSec('🔬 Uji sifat', '', 'rx-grid cols2');
    labChip(g2, '⚡ Medan listrik', L.field ? 'hidup' : 'mati', L.field, labMedan, true);
    labChip(g2, '🔨 Tempa', 'geser lapisan atom', false, labTempa, true);
    rb.style.display = 'none';
  } else {
    const U = labS.u, done = U.res[U.samp] || {};
    const g1 = labSec('🧪 Sampel', '', 'rx-grid cols4');
    U_IDS.forEach(id => labChip(g1, SAMP[id].f, '', U.samp === id, () => labUjiPilih(id)));
    const g2 = labSec('🔬 Jalankan uji', '', 'rx-grid cols4');
    UJI.forEach(u => labChip(g2, u.nama, done[u.id] !== undefined ? '✓' : '', U.aktif === u.id && !U.run, () => labUjiJalan(u.id), true));
    rb.style.display = 'none';
  }
}
function labRender(){
  const m = labS.mode;
  $L('scI').style.display = m === 'i' ? '' : 'none';
  $L('scK').style.display = m === 'k' ? '' : 'none';
  $L('scL').style.display = m === 'l' ? '' : 'none';
  $L('scU').style.display = m === 'u' ? '' : 'none';
  labRenderPanel();
  labDrawMode();
  labIsiData(); labRenderMisi();
}
function labDrawMode(){ const m = labS.mode; if (m === 'i') ionDraw(); else if (m === 'k') kovDraw(); else if (m === 'l') logamDraw(); else ujiDraw(); labS.dirty = false; }
function labJalankan(){ if (labS.mode === 'i') labIonJalan(); else if (labS.mode === 'k') labKovJalan(); }

/* ---------- Loop animasi ---------- */
setInterval(() => {
  if (!labAktif()) return;
  const dt = 0.04, I = labS.i, K = labS.k, L = labS.l, U = labS.u;
  let ubah = false;
  if (I.run) { I.t += dt; ubah = true; if (I.t >= T_ION) { I.t = T_ION; I.run = false; ionSelesai(); labRenderPanel(); labIsiData(); labRenderMisi(); } }
  if (I.sh.run) { I.sh.t += dt; ubah = true; if (I.sh.t >= T_SHEAR) { I.sh.run = false; labS.i.shearDone = true; labIsiData(); labRenderMisi(); } }
  if (K.run) { K.t += dt; ubah = true; if (K.t >= T_KOV) { K.t = T_KOV; K.run = false; kovSelesai(); labRenderPanel(); labIsiData(); labRenderMisi(); } }
  if (L.tempa.run) { L.tempa.t += dt; if (L.tempa.t >= T_TEMPA) { L.tempa.run = false; L.tempaDone = true; labIsiData(); labRenderMisi(); } }
  if (U.run) { U.t += dt; ubah = true; const T = U.run === 'panas' ? T_HEAT : T_COND; if (U.t >= T) { U.t = T; ujiSelesai(); labRenderPanel(); labIsiData(); labRenderMisi(); } }
  if (labS.mode === 'l') { logamDraw(); return; }
  if (labS.mode === 'u' && U.aktif) { ujiDraw(); return; }
  if (ubah || labS.dirty) labDrawMode();
}, 40);

/* ---------- Tab Data ---------- */
function labIsiData(){
  const info = $L('d-info'), hit = $L('d-hitung'), it = $L('d-info-t'), ht = $L('d-hitung-t'), am = $L('d-amati');
  const a = [];
  if (labS.mode === 'i') {
    const X = ionInfo(), I = labS.i, ok = I.started && !I.run;
    it.textContent = '🧪 Senyawa ion'; ht.textContent = '🧮 Hasil';
    info.innerHTML = '<div class="hasil-baris">' + X.A.s + ' (logam) + ' + X.B.s + ' (nonlogam)<br>' + X.A.s + ': melepas ' + X.A.q + ' e⁻ → ' + X.A.s + SUPQ[X.A.q] + '<br>' + X.B.s + ': menerima ' + X.B.q + ' e⁻ → ' + X.B.s + SUPA[X.B.q] + '</div>';
    hit.innerHTML = ok ? '<div class="hasil-baris">Rumus: <b>' + X.formula + '</b> (' + X.nc + ' : ' + X.na + ')<br>Indeks gaya tarik ≈ ' + labNum(X.idx, 1) + '× NaCl<br>Titik leleh: ' + (X.mp ? X.mp + ' °C' + (X.cat ? ' (' + X.cat + ')' : '') : (X.cat || '—')) + '</div><div class="lab-note">Indeks = q⁺q⁻ ÷ (r⁺ + r⁻), relatif terhadap NaCl.</div>' : '<div class="lab-note">Bentuk senyawa untuk melihat rumus.</div>';
    a.push('Rumus ditentukan agar muatan total nol (silang muatan).');
    a.push('Ion bermuatan lebih besar dan lebih kecil menarik lebih kuat: titik lelehnya cenderung lebih tinggi.');
  } else if (labS.mode === 'k') {
    const K = labS.k, M = KMOL[K.mol], Ly = kovLayout(K.mol);
    it.textContent = '🧪 Molekul'; ht.textContent = '🧮 Ikatan';
    info.innerHTML = '<div class="hasil-baris">' + M.f + ' (' + M.nama + ')<br>Elektron valensi: ' + Ly.atoms.map(x => x.el + ' = ' + x.ve).join(', ') + '</div>';
    const rows = []; const seen = {};
    Ly.bonds.forEach(b => { const kb = kovBond(b, Ly.atoms); if (seen[kb.k]) return; seen[kb.k] = 1; rows.push(kb.k + ': ' + (b.o === 1 ? 'tunggal' : (b.o === 2 ? 'rangkap dua' : 'rangkap tiga')) + ', ' + kb.d.L + ' pm, ' + kb.d.E + ' kJ/mol, Δχ = ' + labNum(Math.abs(b.dchi), 2)); });
    hit.innerHTML = '<div class="hasil-baris">' + rows.join('<br>') + '</div>';
    a.push('Pasangan yang dipakai bersama dihitung untuk kedua atom (oktet atau duplet).');
    a.push('Rangkap tiga N≡N (945 kJ/mol) lebih kuat dan pendek daripada tunggal.');
  } else if (labS.mode === 'l') {
    const L = labS.l, M = LOGAM[L.me];
    it.textContent = '🧪 Logam'; ht.textContent = '🧮 Data';
    info.innerHTML = '<div class="hasil-baris">' + M.s + ': ' + M.ve + ' elektron valensi, jari-jari ion ' + M.r + ' pm</div>';
    hit.innerHTML = '<div class="hasil-baris">Titik leleh ' + M.mp + ' °C · titik didih ' + M.bp + ' °C<br>Medan listrik: ' + (L.field ? 'hidup (elektron mengalir)' : 'mati') + '</div>';
    a.push('Elektron valensi bebas bergerak di antara kation logam.');
    a.push('Saat ditempa, lapisan bergeser tetapi lautan elektron tetap mengikat kation.');
  } else {
    const U = labS.u, S = SAMP[U.samp], res = U.res[U.samp] || {};
    it.textContent = '🧪 Sampel'; ht.textContent = '🧮 Hasil uji';
    info.innerHTML = '<div class="hasil-baris">' + S.f + ' (' + S.nama + ')<br>Jenis: ' + TIPE_NAMA[S.tipe] + '</div>';
    const fx = v => v === true ? 'menghantar' : (v === false ? 'tidak menghantar' : (v === null ? 'tidak berlaku' : '—'));
    hit.innerHTML = '<div class="hasil-baris">Padat: ' + fx(res.padat) + '<br>Leleh: ' + fx(res.leleh) + '<br>Larutan: ' + fx(res.larut) + '<br>' + (res.panas ? 'Titik leleh ' + S.mp + ' °C · titik didih ' + S.bp + ' °C' : 'Titik leleh/didih: belum diukur') + '</div>';
    a.push('Padatan ion tidak menghantar listrik; leburan dan larutannya menghantar.');
    a.push('Logam menghantar listrik dalam semua wujud; kovalen sederhana tidak menghantar.');
  }
  am.innerHTML = a.map(x => '• ' + x).join('<br>');
}

/* ---------- Misi ---------- */
function labSkor(p, msg){
  labS.skor += p;
  $L('lab-skor-angka').textContent = labS.skor;
  labUpdateMisiCount(); labRenderMisi(); labToast(msg);
  confettiBurst(400, 280, 26, $L('scr-lab')); sfx('win');
  if (labS.misi.every(x => x)) {
    $L('lab-selesai-btn').disabled = false;
    setTimeout(() => { if ($L('scr-lab').classList.contains('active')) labSelesai(); }, 1000);
  }
}
function labUpdateMisiCount(){ $L('lab-misi-count').textContent = labS.misi.filter(x => x).length + '/5'; }
function labKuis(idKotak, selesai, pesanOk, bisa, kunci, tanya, opsi, fnJawab, kunciState, kunciLama){
  const q = $L(idKotak); if (!q) return kunciLama;
  if (selesai) { q.innerHTML = '<div class="misi-hint ok">✅ ' + pesanOk + '</div>'; return kunciLama; }
  if (!bisa) { q.innerHTML = '<div class="misi-hint">🔒 ' + kunci + '</div>'; return kunciLama; }
  if (kunciLama !== kunciState || !q.querySelector('.m-nota')) {
    q.innerHTML = '<div class="m4-tanya">' + tanya + '</div>' + opsi.map((o, i) => '<button class="m-nota" style="font-family:inherit" data-sfx onclick="' + fnJawab + '(' + i + ')">' + o.t + '</button>').join('') + '<div class="feedback" id="' + idKotak.replace('-quiz', '-fb') + '"></div>';
  }
  return kunciState;
}
function labRenderMisi(){
  ['st-m1','st-m2','st-m3','st-m4','st-m5'].forEach((id, i) => {
    const el = $L(id); if (el) el.textContent = labS.misi[i] ? '✅ Selesai (+20)' : '⬜ Belum selesai';
    const card = $L('misi-' + (i + 1)); if (card) card.classList.toggle('done', labS.misi[i]);
  });
  // M1: rumus senyawa ion
  const I = labS.i, X = I.last;
  if (X && I.formed.length >= 2 && labS.m1key !== X.key) {
    labS.m1key = X.key;
    const A = X.A.s, B = X.B.s;
    const kandidat = [A + B, A + B + '₂', A + '₂' + B, A + '₂' + B + '₃', A + B + '₃', A + '₃' + B + '₂'].filter(c => c !== X.formula);
    labS.m1opt = labAcak([{ t:X.formula, b:true }].concat(labAcak([...new Set(kandidat)]).slice(0, 3).map(t => ({ t, b:false }))));
  }
  labS.m1kuis = labKuis('m1-quiz', labS.misi[0], 'Muatan total senyawa ion harus nol (silang muatan).', I.formed.length >= 2 && !!X, 'Bentuk dua senyawa ion yang berbeda.',
    X ? A_(X) : '', labS.m1opt || [], 'labJawabM1', labS.m1key, labS.m1kuis);
  // M2
  if (!labS.m2opt) labS.m2opt = labAcak([
    { t:'N₂ memakai 3 pasang elektron bersama, sedangkan O₂ hanya 2 pasang', b:true },
    { t:'Atom N lebih kecil sehingga elektronnya berpindah ke atom lain', b:false },
    { t:'N₂ berikatan ion', b:false },
    { t:'O₂ memiliki lebih banyak pasangan elektron bersama', b:false }]);
  labKuis('m2-quiz', labS.misi[1], 'Makin banyak pasangan bersama, ikatan makin kuat dan pendek.', labS.k.formed.includes('o2') && labS.k.formed.includes('n2'), 'Bentuk O₂ dan N₂ pada Ikatan Kovalen.',
    'Ikatan N≡N (945 kJ/mol; 110 pm) lebih kuat dan lebih pendek daripada O=O (498 kJ/mol; 121 pm). Mengapa?', labS.m2opt, 'labJawabM2', 'm2', 'm2');
  // M3
  if (!labS.m3opt) labS.m3opt = labAcak([
    { t:'Ikatan ion yang kuat antar-ion harus diputus pada NaCl, sedangkan zat kovalen sederhana hanya memutus gaya antarmolekul yang lemah', b:true },
    { t:'Ikatan kovalen dalam molekul harus diputus saat zat kovalen meleleh', b:false },
    { t:'NaCl tersusun dari molekul yang sangat besar', b:false },
    { t:'Zat kovalen tidak memiliki gaya tarik apa pun', b:false }]);
  const U = labS.u, kov = ['h2o', 'ch4', 'i2'].some(k => U.res[k] && U.res[k].panas);
  labKuis('m3-quiz', labS.misi[2], 'Titik leleh senyawa ion jauh lebih tinggi daripada kovalen sederhana.', !!(U.res.nacl && U.res.nacl.panas) && kov, 'Panaskan NaCl dan satu zat kovalen (H₂O, CH₄, atau I₂).',
    'Titik leleh NaCl (801 °C) jauh lebih tinggi daripada H₂O (0 °C), CH₄ (−182 °C), dan I₂ (114 °C). Mengapa?', labS.m3opt, 'labJawabM3', 'm3', 'm3');
  // M4
  if (!labS.m4opt) labS.m4opt = labAcak([
    { t:'Pada logam, lautan elektron tetap mengikat kation saat lapisan bergeser; pada kristal ion, ion sejenis berhadapan dan saling tolak', b:true },
    { t:'Logam tidak memiliki gaya tarik antaratom', b:false },
    { t:'Kristal ion mengandung elektron bebas yang membuatnya lunak', b:false },
    { t:'Kedua zat pecah dengan cara yang sama', b:false }]);
  labKuis('m4-quiz', labS.misi[3], 'Logam dapat ditempa, kristal ion getas.', labS.i.shearDone && labS.l.tempaDone, 'Beri tekanan pada kristal ion dan tempa logam.',
    'Mengapa logam dapat ditempa, sedangkan kristal ion pecah (getas) bila ditekan?', labS.m4opt, 'labJawabM4', 'm4', 'm4');
  // M5
  if (!labS.m5opt) labS.m5opt = labAcak([
    { t:'Padatan: ion terkunci dalam kisi; leburan dan larutan: ion bebas bergerak membawa muatan', b:true },
    { t:'Padatan NaCl mengandung elektron bebas seperti logam', b:false },
    { t:'Leburan NaCl berubah menjadi logam', b:false },
    { t:'Ion hanya ada saat NaCl berwujud padat', b:false }]);
  const rn = U.res.nacl || {};
  labKuis('m5-quiz', labS.misi[4], 'Ion yang bebas bergerak membawa arus listrik.', rn.padat !== undefined && rn.leleh !== undefined && rn.larut !== undefined, 'Uji NaCl padat, leleh, dan larutan.',
    'NaCl tidak menghantar listrik saat padat, tetapi menghantar saat meleleh atau dilarutkan. Mengapa?', labS.m5opt, 'labJawabM5', 'm5', 'm5');
}
function A_(X){
  return 'Atom ' + X.A.s + ' melepas ' + X.A.q + ' e⁻ menjadi ' + X.A.s + SUPQ[X.A.q] + ' dan atom ' + X.B.s + ' menerima ' + X.B.q + ' e⁻ menjadi ' + X.B.s + SUPA[X.B.q] + '. Rumus senyawa yang terbentuk adalah ...';
}
function labJawab(idKuis, opsi, i, fbId, okMsg, noMsg, idx, skorMsg){
  if (labS.misi[idx] || !opsi) return;
  const o = opsi[i], btns = document.querySelectorAll('#' + idKuis + ' .m-nota'), fb = $L(fbId);
  if (o.b) {
    btns[i].classList.add('benar');
    if (fb) { fb.className = 'feedback show ok'; fb.textContent = okMsg; }
    labS.misi[idx] = true; labSkor(20, skorMsg);
  } else {
    btns[i].classList.add('salah'); btns[i].disabled = true;
    if (fb) { fb.className = 'feedback show no'; fb.textContent = noMsg; }
    sfx('salah'); efekSalahFlash();
  }
}
function labJawabM1(i){ labJawab('m1-quiz', labS.m1opt, i, 'm1-fb', 'Tepat! Muatan positif dan negatif harus seimbang.', 'Belum tepat. Jumlah muatan kation dan anion harus sama dengan nol.', 0, '🎉 Misi 1 selesai! Kamu bisa menyusun rumus senyawa ion.'); }
function labJawabM2(i){ labJawab('m2-quiz', labS.m2opt, i, 'm2-fb', 'Benar! Pasangan bersama yang lebih banyak membuat ikatan lebih kuat.', 'Belum tepat. Hitung jumlah pasangan elektron bersama pada tiap molekul.', 1, '🎉 Misi 2 selesai! Kamu membandingkan kekuatan ikatan kovalen.'); }
function labJawabM3(i){ labJawab('m3-quiz', labS.m3opt, i, 'm3-fb', 'Tepat! Yang diputus saat meleleh berbeda pada kedua jenis zat.', 'Belum tepat. Bedakan ikatan di dalam molekul dengan gaya antarmolekul.', 2, '🎉 Misi 3 selesai! Kamu memahami titik leleh senyawa ion.'); }
function labJawabM4(i){ labJawab('m4-quiz', labS.m4opt, i, 'm4-fb', 'Benar! Struktur kedua zat menentukan responsnya terhadap tekanan.', 'Belum tepat. Pikirkan apa yang terjadi saat lapisan bergeser.', 3, '🎉 Misi 4 selesai! Kamu membedakan logam dan kristal ion.'); }
function labJawabM5(i){ labJawab('m5-quiz', labS.m5opt, i, 'm5-fb', 'Tepat! Pembawa muatan pada senyawa ion adalah ion yang bebas bergerak.', 'Belum tepat. Apa pembawa muatan pada senyawa ion?', 4, '🎉 Misi 5 selesai! Kamu memahami daya hantar senyawa ion.'); }

/* ---------- LKPD, reset, toast, selesai ---------- */
function labCatat(){
  labS.catatNo++;
  const item = document.createElement('div'); item.className = 'lab-log-item';
  let isi = '';
  if (labS.mode === 'i') { const X = ionInfo(); isi = '<b>Ikatan ion</b> · ' + X.A.s + ' + ' + X.B.s + ' → ' + X.formula + '<br>' + X.nc + ' : ' + X.na + ' · indeks gaya tarik ' + labNum(X.idx, 1) + '× · titik leleh ' + (X.mp ? X.mp + ' °C' : '—'); }
  else if (labS.mode === 'k') { const M = KMOL[labS.k.mol]; isi = '<b>Ikatan kovalen</b> · ' + M.f + ' (' + M.nama + ')<br>' + M.bd.reduce((a, b) => a + b[2], 0) + ' pasang elektron bersama'; }
  else if (labS.mode === 'l') { const M = LOGAM[labS.l.me]; isi = '<b>Ikatan logam</b> · ' + M.s + ' (' + M.ve + ' e⁻ valensi)<br>titik leleh ' + M.mp + ' °C · medan listrik ' + (labS.l.field ? 'hidup' : 'mati'); }
  else { const U = labS.u, S = SAMP[U.samp], r = U.res[U.samp] || {}, fx = v => v === true ? 'hantar' : (v === false ? 'tidak' : (v === null ? 'n/a' : '—')); isi = '<b>Uji sifat</b> · ' + S.f + ' (' + TIPE_NAMA[S.tipe] + ')<br>padat: ' + fx(r.padat) + ' · leleh: ' + fx(r.leleh) + ' · larutan: ' + fx(r.larut) + (r.panas ? ' · mp ' + S.mp + ' °C, bp ' + S.bp + ' °C' : ''); }
  item.innerHTML = '<b>No. ' + labS.catatNo + '</b> · ' + isi;
  const log = $L('lab-log'); log.insertBefore(item, log.firstChild);
  while (log.children.length > 10) log.removeChild(log.lastChild);
  labToast('📓 Pengamatan berhasil dicatat ke LKPD!');
}
function labReset(){
  labS.mode = 'i';
  labS.i = { me:'na', nm:'cl', t:0, run:false, started:false, formed:[], sh:{ run:false, t:0 }, shearDone:false };
  labS.k = { mol:'h2', t:0, run:false, started:false, formed:[] };
  labS.l = { me:'na', field:false, tempa:{ run:false, t:0 }, tempaDone:false, e:[], bangun:'' };
  labS.u = { samp:'nacl', run:null, t:0, aktif:null, res:{}, bangun:'' };
  labRender();
  labToast('🔄 Praktikum dikembalikan ke kondisi awal.');
}
let labToastT = null;
function labToast(msg){
  const t = $L('lab-toast');
  if (!t) { showToast(msg); return; }
  t.textContent = msg; t.classList.add('show');
  clearTimeout(labToastT); labToastT = setTimeout(() => t.classList.remove('show'), 2800);
}
function labSelesai(){
  if (!labS.misi.every(x => x)) { labToast('Selesaikan kelima misi dulu ya! 💪'); return; }
  $L('lab-akhir-skor').textContent = labS.skor;
  const s = labS.skor;
  let kal;
  if (s >= 100) kal = 'Luar biasa! Kamu layak menyandang gelar Kimiawan Muda. ⚗️';
  else if (s >= 80) kal = 'Sangat baik! Sedikit lagi menuju sempurna.';
  else if (s >= 60) kal = 'Bagus! Terus berlatih menganalisis ikatan kimia.';
  else kal = 'Ayo selesaikan semua misi untuk meraih skor penuh!';
  $L('lab-akhir-kal').textContent = kal;
  openModal('modal-lab'); sfx('win');
}

(function labInit(){
  if (!$L('scr-lab')) return;
  labRender(); labUpdateMisiCount();
})();
