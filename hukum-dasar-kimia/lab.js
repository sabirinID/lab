/* ##############################################################
   #  LAB MAYA — PRAKTIKUM VIRTUAL HUKUM DASAR KIMIA            #
   #  Tiga eksperimen klasik: kekekalan massa (ruang terbuka    #
   #  dan tertutup), perbandingan tetap + kelipatan Dalton, dan #
   #  perbandingan volume gas. Neraca virtual: idealisasi.      #
   ############################################################## */
const LAB_NS = 'http://www.w3.org/2000/svg';
const $L = id => document.getElementById(id);

/* ---------- Data ---------- */
const TARE = 100.0;
const LV = {
  mg:     { nama:'Pembakaran Mg',          eq:'2Mg + O₂ → 2MgO',
            re:[{ f:'Mg', m:2.4, fase:'padat' }, { f:'O₂', m:1.6, fase:'gas', udara:true }], pr:[{ f:'MgO', m:4.0, fase:'padat' }] },
  caco3:  { nama:'CaCO₃ + HCl',            eq:'CaCO₃ + 2HCl → CaCl₂ + H₂O + CO₂',
            re:[{ f:'CaCO₃', m:10.0, fase:'padat' }, { f:'HCl', m:7.3, fase:'larutan' }], pr:[{ f:'CaCl₂', m:11.1 }, { f:'H₂O', m:1.8 }, { f:'CO₂', m:4.4, fase:'gas' }] },
  agno3:  { nama:'AgNO₃ + NaCl',           eq:'AgNO₃ + NaCl → AgCl + NaNO₃',
            re:[{ f:'AgNO₃', m:1.700 }, { f:'NaCl', m:0.585 }], pr:[{ f:'AgCl', m:1.435, fase:'endapan' }, { f:'NaNO₃', m:0.850 }] },
  nahco3: { nama:'NaHCO₃ + CH₃COOH',       eq:'NaHCO₃ + CH₃COOH → CH₃COONa + H₂O + CO₂',
            re:[{ f:'NaHCO₃', m:8.4 }, { f:'CH₃COOH', m:6.0 }], pr:[{ f:'CH₃COONa', m:8.2 }, { f:'H₂O', m:1.8 }, { f:'CO₂', m:4.4, fase:'gas' }] }
};
const LV_IDS = ['mg','caco3','agno3','nahco3'];
const PR = {
  mgo: { f:'MgO', nama:'Magnesium oksida',  A:{ f:'Mg', r:3, w:'#F26A21' }, B:{ f:'O', r:2, w:'#2E9BD6' } },
  fes: { f:'FeS', nama:'Besi(II) sulfida',  A:{ f:'Fe', r:7, w:'#A0522D' }, B:{ f:'S', r:4, w:'#F2C21B' } },
  h2o: { f:'H₂O', nama:'Air',               A:{ f:'H', r:1, w:'#E4EAF5' }, B:{ f:'O', r:8, w:'#2E9BD6' } },
  co:  { f:'CO',  nama:'Karbon monoksida',  A:{ f:'C', r:3, w:'#8B95A8' }, B:{ f:'O', r:4, w:'#E8453C' } },
  co2: { f:'CO₂', nama:'Karbon dioksida',   A:{ f:'C', r:3, w:'#8B95A8' }, B:{ f:'O', r:8, w:'#E8453C' } }
};
const PR_IDS = ['mgo','fes','h2o','co','co2'];
const N_MASSA = [1, 2, 3, 4, 5, 6, 8, 10];
const GL = {
  hcl: { eq:'H₂ + Cl₂ → 2HCl',            re:[{ f:'H₂', nu:1, w:'#2E9BD6' }, { f:'Cl₂', nu:1, w:'#3BA55D' }], pr:[{ f:'HCl', nu:2, w:'#F26A21' }] },
  nh3: { eq:'N₂ + 3H₂ → 2NH₃',            re:[{ f:'N₂', nu:1, w:'#8B95A8' }, { f:'H₂', nu:3, w:'#2E9BD6' }], pr:[{ f:'NH₃', nu:2, w:'#7B4FC9' }] },
  h2o: { eq:'2H₂ + O₂ → 2H₂O (uap)',      re:[{ f:'H₂', nu:2, w:'#2E9BD6' }, { f:'O₂', nu:1, w:'#E8453C' }], pr:[{ f:'H₂O', nu:2, w:'#4ADE80' }] },
  ch4: { eq:'CH₄ + 2O₂ → CO₂ + 2H₂O (uap)', re:[{ f:'CH₄', nu:1, w:'#8B95A8' }, { f:'O₂', nu:2, w:'#E8453C' }], pr:[{ f:'CO₂', nu:1, w:'#C0392B' }, { f:'H₂O', nu:2, w:'#4ADE80' }] }
};
const GL_IDS = ['hcl','nh3','h2o','ch4'];
const N_VOL = [5, 10, 15, 20, 30];
const LAB_MODE = [ { id:'l', nama:'Kekekalan Massa' }, { id:'p', nama:'Perb. Tetap' }, { id:'g', nama:'Perb. Volume' } ];
const T_LAV = 3.5, T_PR = 2.5, T_GL = 2.5;
const gcd = (a, b) => b ? gcd(b, a % b) : a;

const labS = {
  mode:'l',
  l:{ rx:'caco3', sys:'dua', aktif:[], t:0, run:false, started:false, res:{} },
  p:{ rx:'mgo', a:6, b:3, t:0, run:false, started:false, rows:[] },
  g:{ rx:'hcl', a:10, b:10, t:0, run:false, started:false, runs:[] },
  mikro:false, catatNo:0, dirty:true, tick:0,
  misi:[false,false,false,false,false], skor:0, m1opt:null, m2opt:null, m3opt:null, m3key:'', m4opt:null, m5opt:null, m5key:''
};

/* ---------- Utilitas ---------- */
function svEl(tag, attrs, parent){
  const e = document.createElementNS(LAB_NS, tag);
  for (const k in attrs) e.setAttribute(k, attrs[k]);
  if (parent) parent.appendChild(e);
  return e;
}
function fm(v, d){ d = d === undefined ? 3 : d; return String(Number(Number(v).toFixed(d))).replace('.', ','); }
function fx(v, d){ return Number(v).toFixed(d).replace('.', ','); }
function labKlem(v, a, b){ return Math.max(a, Math.min(b, v)); }
function labEase(f){ f = labKlem(f, 0, 1); return f * f * (3 - 2 * f); }
function lerp(a, b, t){ return a + (b - a) * t; }
function labAcak(arr){ for (let i = arr.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [arr[i], arr[j]] = [arr[j], arr[i]]; } return arr; }
function labAktif(){ const s = $L('scr-lab'); return s && s.classList.contains('active'); }
function uniq(a){ return [...new Set(a)]; }
function teks(g, x, y, str, o){
  o = o || {};
  const t = svEl('text', { x:x, y:y, 'text-anchor':o.a || 'start', 'font-size':o.s || 12, 'font-weight':o.w || 800, fill:o.c || '#fff', 'font-family':o.f || 'Figtree,sans-serif' }, g);
  t.textContent = str; return t;
}
function baris(g, y, label, nilai, warna){
  teks(g, 392, y, label, { s:11.5, w:700, c:'#AEC0E0' });
  teks(g, 696, y, nilai, { s:12.5, c:warna || '#fff', a:'end' });
}

/* ---------- Kekekalan massa ---------- */
function lavMassa(rx, sys){
  const R = LV[rx], sum = a => a.reduce((s, x) => s + x.m, 0);
  const sRe = sum(R.re), sPr = sum(R.pr), udara = sum(R.re.filter(x => x.udara)), gasOut = sum(R.pr.filter(x => x.fase === 'gas'));
  return sys === 'tutup' ? { sebelum:TARE + sRe, sesudah:TARE + sPr, sRe:sRe, sPr:sPr, udara:udara, gasOut:gasOut } : { sebelum:TARE + sRe - udara, sesudah:TARE + sPr - gasOut, sRe:sRe, sPr:sPr, udara:udara, gasOut:gasOut };
}
function labLavPilih(k, v){ const L = labS.l; L[k] = v; L.t = 0; L.run = false; L.started = false; L.aktif = []; labRender(); }
function labLavJalan(){
  const L = labS.l;
  L.aktif = L.sys === 'dua' ? ['buka', 'tutup'] : [L.sys];
  L.t = 0; L.run = true; L.started = true; labRenderPanel(); sfx('click');
}
function lavSelesai(){
  const L = labS.l;
  L.aktif.forEach(k => { const M = lavMassa(L.rx, k); L.res[L.rx + '|' + k] = { sebelum:M.sebelum, sesudah:M.sesudah }; });
}
function labu(g, key, cx, y0, fs, sys){
  const R = LV[key], t = labS.tick * 0.04;
  const gasOut = R.pr.some(x => x.fase === 'gas'), udara = R.re.some(x => x.udara);
  svEl('path', { d:'M' + (cx - 14) + ',' + y0 + ' L' + (cx - 14) + ',' + (y0 + 32) + ' L' + (cx - 48) + ',' + (y0 + 100) + ' L' + (cx + 48) + ',' + (y0 + 100) + ' L' + (cx + 14) + ',' + (y0 + 32) + ' L' + (cx + 14) + ',' + y0 + ' Z', fill:'rgba(255,255,255,.12)', stroke:'#B7C9E8', 'stroke-width':3.5, 'stroke-linejoin':'round' }, g);
  if (key === 'mg') {
    const w = fs < 0.5 ? '#8B95A8' : '#F4F6FA';
    svEl('rect', { x:cx - 22, y:y0 + 90, width:44, height:7, rx:2, fill:fs < 0.2 ? '#8B95A8' : (fs < 0.9 ? '#FFE29A' : '#F4F6FA'), stroke:'#fff', 'stroke-width':1 }, g);
    if (fs > 0.3 && fs < 1) svEl('circle', { cx:cx, cy:y0 + 88, r:10 + 4 * Math.sin(t * 8), fill:'#FFE29A', opacity:.55 }, g);
    if (sys === 'tutup') for (let k = 0; k < 6; k++) svEl('circle', { cx:cx - 28 + (k % 3) * 28 + Math.sin(t * 3 + k) * 3, cy:y0 + 52 + (k % 2) * 18 + Math.cos(t * 3 + k) * 3, r:5, fill:'#E8453C', opacity:1 - fs, stroke:'#fff', 'stroke-width':1 }, g);
    if (sys === 'buka' && fs > 0.05 && fs < 1) { [-1, 1].forEach(s => { svEl('line', { x1:cx + s * 78, y1:y0 + 56, x2:cx + s * 54, y2:y0 + 68, stroke:'#E8453C', 'stroke-width':3 }, g); svEl('circle', { cx:cx + s * 54, cy:y0 + 68, r:5, fill:'#E8453C' }, g); }); teks(g, cx, y0 + 40, 'O₂ dari udara', { s:10, c:'#FFB27A', a:'middle' }); }
  } else {
    const cair = key === 'agno3' ? 'rgba(255,255,255,' + (0.12 + 0.45 * fs).toFixed(2) + ')' : (key === 'caco3' ? 'rgba(156,201,255,.4)' : 'rgba(255,226,154,.25)');
    svEl('path', { d:'M' + (cx - 38) + ',' + (y0 + 100 - 3) + ' L' + (cx + 38) + ',' + (y0 + 97) + ' L' + (cx + 30) + ',' + (y0 + 62) + ' L' + (cx - 30) + ',' + (y0 + 62) + ' Z', fill:cair }, g);
    const padat = key === 'agno3' ? fs : 1 - fs * 0.92;
    for (let k = 0; k < 6; k++) svEl('rect', { x:cx - 34 + k * 11, y:y0 + 88 + (k % 2) * 4, width:9, height:7, rx:2, fill:key === 'agno3' ? '#F4F6FA' : '#E4EAF5', opacity:padat, stroke:'#8795AD', 'stroke-width':.8 }, g);
    if (gasOut && fs > 0.04 && fs < 1) for (let k = 0; k < 5; k++) svEl('circle', { cx:cx - 20 + k * 10 + Math.sin(t * 4 + k) * 3, cy:y0 + 90 - ((t * 36 + k * 14) % 40), r:3 + (k % 2), fill:'rgba(255,255,255,.7)', stroke:'#8795AD', 'stroke-width':1 }, g);
    if (gasOut && sys === 'buka' && fs > 0.04 && fs < 1) for (let k = 0; k < 5; k++) svEl('circle', { cx:cx + Math.sin(t * 3 + k * 2) * 8, cy:y0 - 4 - ((t * 44 + k * 22) % 100), r:4, fill:'#B7C2D6', stroke:'#6B7C99', 'stroke-width':1, opacity:1 - ((t * 44 + k * 22) % 100) / 110 }, g);
    if (gasOut && sys === 'buka' && fs > 0.04) teks(g, cx + 36, y0 - 42, 'CO₂', { s:10, c:'#AEC0E0', a:'middle' });
  }
  if (sys === 'tutup') {
    svEl('rect', { x:cx - 18, y:y0 - 10, width:36, height:16, rx:4, fill:'#C0392B', stroke:'#7B241C', 'stroke-width':2 }, g);
    if (gasOut) { const rb = 6 + 22 * fs; svEl('path', { d:'M' + cx + ',' + (y0 - 10) + ' L' + cx + ',' + (y0 - 14), stroke:'#C0392B', 'stroke-width':3 }, g); svEl('ellipse', { cx:cx, cy:y0 - 14 - rb, rx:rb * 0.85, ry:rb, fill:'rgba(255,178,122,.75)', stroke:'#fff', 'stroke-width':1.5 }, g); }
  }
}
function lavDraw(){
  const L = labS.l, R = LV[L.rx], g = $L('lSet'); g.innerHTML = '';
  const f = L.started ? labKlem(L.t / T_LAV, 0, 1) : 0, fe = labEase(f);
  [['buka', 100, 'Ruang terbuka', '#FFB27A'], ['tutup', 262, 'Ruang tertutup', '#4ADE80']].forEach(([k, cx, judul, col]) => {
    const aktif = L.aktif.includes(k), res = L.res[L.rx + '|' + k];
    const fs = aktif ? fe : (res ? 1 : 0), M = lavMassa(L.rx, k);
    teks(g, cx, 112, judul, { s:14, c:col, a:'middle', f:'Fraunces,Georgia,serif' });
    labu(g, L.rx, cx, 206, fs, k);
    svEl('rect', { x:cx - 60, y:314, width:120, height:34, rx:8, fill:'#34425F', stroke:'#1D2740', 'stroke-width':3 }, g);
    svEl('rect', { x:cx - 50, y:320, width:100, height:22, rx:4, fill:'#0E2240' }, g);
    const baca = M.sebelum + (M.sesudah - M.sebelum) * fs;
    teks(g, cx, 336, fx(baca, 2) + ' g', { s:14, c:Math.abs(M.sesudah - M.sebelum) > 1e-9 && fs > 0.5 ? '#FFB27A' : '#4ADE80', a:'middle', f:'Consolas,monospace' });
    if (aktif || res) {
      teks(g, cx, 366, 'sebelum ' + fx(M.sebelum, 2) + ' g', { s:10.5, c:'#AEC0E0', a:'middle', w:700 });
      teks(g, cx, 382, 'sesudah ' + fx(M.sesudah, 2) + ' g', { s:10.5, c:'#AEC0E0', a:'middle', w:700 });
      if (fs >= 1) { const d = M.sesudah - M.sebelum; teks(g, cx, 402, Math.abs(d) < 1e-9 ? 'Δm = 0 (massa tetap)' : 'Δm = ' + (d > 0 ? '+' : '−') + fx(Math.abs(d), 2) + ' g', { s:12, c:Math.abs(d) < 1e-9 ? '#4ADE80' : '#FF9A8A', a:'middle' }); }
    } else teks(g, cx, 372, 'belum dijalankan', { s:10.5, c:'#8FA3C7', a:'middle' });
  });
  $L('lEq').textContent = R.eq;
  const r = $L('lRows'); r.innerHTML = '';
  baris(r, 100, 'Reaksi', R.nama, '#4ADE80');
  R.re.forEach((x, i) => baris(r, 124 + i * 20, (i ? '+ ' : 'Pereaksi: ') + x.f + (x.udara ? ' (dari udara)' : ''), fx(x.m, x.m < 1 ? 3 : 1) + ' g', '#8EC1FF'));
  const sRe = R.re.reduce((s, x) => s + x.m, 0), sPr = R.pr.reduce((s, x) => s + x.m, 0);
  let y = 124 + R.re.length * 20 + 4;
  baris(r, y, 'Jumlah pereaksi', fx(sRe, 3) + ' g', '#FFE29A'); y += 22;
  R.pr.forEach((x, i) => { baris(r, y, (i ? '+ ' : 'Produk: ') + x.f + (x.fase === 'gas' ? ' (gas)' : (x.fase === 'endapan' ? ' (endapan)' : '')), fx(x.m, x.m < 1 ? 3 : 1) + ' g', '#9FE0B8'); y += 20; });
  baris(r, y + 2, 'Jumlah produk', fx(sPr, 3) + ' g', '#FFE29A'); y += 26;
  svEl('line', { x1:392, y1:y - 6, x2:696, y2:y - 6, stroke:'rgba(255,255,255,.14)' }, r);
  ['tutup', 'buka'].forEach(k => {
    const res = L.res[L.rx + '|' + k], M = lavMassa(L.rx, k);
    teks(r, 392, y + 8, k === 'tutup' ? 'Ruang tertutup' : 'Ruang terbuka', { s:11.5, w:700, c:'#AEC0E0' });
    teks(r, 696, y + 8, res ? fx(M.sebelum, 2) + ' → ' + fx(M.sesudah, 2) + ' g (Δ ' + (Math.abs(M.sesudah - M.sebelum) < 1e-9 ? '0' : (M.sesudah > M.sebelum ? '+' : '−') + fx(Math.abs(M.sesudah - M.sebelum), 2)) + ')' : 'belum diuji', { s:12, a:'end', c:res ? (Math.abs(M.sesudah - M.sebelum) < 1e-9 ? '#4ADE80' : '#FF9A8A') : '#8FA3C7' });
    y += 22;
  });
  const dua = L.res[L.rx + '|tutup'] && L.res[L.rx + '|buka'];
  const M0 = lavMassa(L.rx, 'buka');
  const sebab = M0.gasOut > 0 ? 'Gas ' + R.pr.filter(x => x.fase === 'gas').map(x => x.f).join(', ') + ' (' + fx(M0.gasOut, 1) + ' g) lepas dari ruang terbuka' : (M0.udara > 0 ? 'O₂ dari udara (' + fx(M0.udara, 1) + ' g) ikut bereaksi di ruang terbuka' : 'tidak ada gas yang masuk atau keluar');
  teks(r, 544, y + 16, dua ? sebab : 'Jalankan di kedua ruang untuk membandingkan', { s:10.5, c:dua ? '#FFB27A' : '#8FA3C7', a:'middle' });
  if (dua) teks(r, 544, y + 34, 'Ruang tertutup: massa pereaksi = massa produk', { s:10.5, c:'#4ADE80', a:'middle' });
  $L('lPillT').textContent = R.nama;
  $L('lInfo1').textContent = L.started && !L.run ? (M0.gasOut > 0 || M0.udara > 0 ? 'Ruang terbuka: massa berubah karena gas' : 'Massa tetap di kedua ruang') : 'Bandingkan neraca ruang terbuka dan tertutup';
  $L('lInfo2').textContent = 'Massa total semesta tetap kekal (Lavoisier)';
  const st = $L('lab-status'); st.textContent = L.run ? 'Bereaksi...' : (L.started ? 'Selesai' : 'Siap'); st.className = 'lab-status ' + (L.run || L.started ? 'on' : 'off');
}

/* ---------- Perbandingan tetap ---------- */
function labPrPilih(id){ const P = labS.p; P.rx = id; P.t = 0; P.run = false; P.started = false; labRender(); }
function labPrSet(k, v){ const P = labS.p; P[k] = v; P.t = 0; P.run = false; P.started = false; labRender(); }
function labPrJalan(){ const P = labS.p; P.t = 0; P.run = true; P.started = true; labRenderPanel(); sfx('click'); }
function prHitung(){
  const P = labS.p, C = PR[P.rx], k = Math.min(P.a / C.A.r, P.b / C.B.r);
  const ra = C.A.r * k, rb = C.B.r * k;
  return { C:C, k:k, ra:ra, rb:rb, prod:ra + rb, sa:P.a - ra, sb:P.b - rb };
}
function prSelesai(){
  const P = labS.p, H = prHitung();
  P.rows.push({ rx:P.rx, a:P.a, b:P.b, ra:H.ra, rb:H.rb, prod:H.prod, sa:H.sa, sb:H.sb });
}
function prDraw(){
  const P = labS.p, H = prHitung(), C = H.C, g = $L('pBars'); g.innerHTML = '';
  const f = P.started ? labKlem(P.t / T_PR, 0, 1) : 0, fe = labEase(f), base = 340, u = 10;
  svEl('line', { x1:30, y1:base, x2:350, y2:base, stroke:'#AEC0E0', 'stroke-width':2 }, g);
  const bar = (x, w, h, y, col, hatch) => { svEl('rect', { x:x, y:y, width:w, height:Math.max(h, 0), fill:col, stroke:'#fff', 'stroke-width':1.5, rx:2 }, g); if (hatch) svEl('rect', { x:x, y:y, width:w, height:Math.max(h, 0), fill:'url(#hatch)' }, g); };
  teks(g, 80, 100, 'Sebelum', { s:11, c:'#8EC1FF', a:'middle' }); teks(g, 270, 100, 'Sesudah', { s:11, c:'#4ADE80', a:'middle' });
  bar(46, 44, P.a * u, base - P.a * u, C.A.w); teks(g, 68, base - P.a * u - 6, P.a + ' g', { s:11.5, a:'middle' }); teks(g, 68, base + 18, C.A.f, { s:13, a:'middle', c:C.A.w, f:'Fraunces,Georgia,serif' });
  bar(104, 44, P.b * u, base - P.b * u, C.B.w); teks(g, 126, base - P.b * u - 6, P.b + ' g', { s:11.5, a:'middle' }); teks(g, 126, base + 18, C.B.f, { s:13, a:'middle', c:C.B.w, f:'Fraunces,Georgia,serif' });
  svEl('line', { x1:160, y1:240, x2:182, y2:240, stroke:'#FFB27A', 'stroke-width':4 }, g); svEl('polygon', { points:'188,240 178,233 178,247', fill:'#FFB27A' }, g);
  const ha = H.ra * u * fe, hb = H.rb * u * fe;
  bar(200, 52, ha, base - ha, C.A.w); bar(200, 52, hb, base - ha - hb, C.B.w);
  if (f > 0.4) { teks(g, 226, base - ha / 2 + 4, C.A.f + ' ' + fm(H.ra, 2), { s:10, a:'middle', c:C.A.f === 'H' ? '#0E2240' : '#fff' }); teks(g, 226, base - ha - hb / 2 + 4, C.B.f + ' ' + fm(H.rb, 2), { s:10, a:'middle', c:'#fff' }); teks(g, 226, base - ha - hb - 8, C.f + ' ' + fm(H.prod, 2) + ' g', { s:11.5, a:'middle', c:'#FFE29A' }); }
  teks(g, 226, base + 18, 'produk', { s:11.5, a:'middle', c:'#4ADE80' });
  if (H.sa > 1e-9) { const h = H.sa * u * fe; bar(268, 36, h, base - h, C.A.w, true); teks(g, 286, base - h - 6, fm(H.sa, 2) + ' g', { s:11, a:'middle', c:'#FF9A8A' }); teks(g, 286, base + 18, 'sisa ' + C.A.f, { s:11.5, a:'middle', c:'#FF9A8A' }); }
  if (H.sb > 1e-9) { const h = H.sb * u * fe; bar(312, 36, h, base - h, C.B.w, true); teks(g, 330, base - h - 6, fm(H.sb, 2) + ' g', { s:11, a:'middle', c:'#FF9A8A' }); teks(g, 330, base + 18, 'sisa ' + C.B.f, { s:11.5, a:'middle', c:'#FF9A8A' }); }
  teks(g, 190, 380, f >= 1 ? (H.sa < 1e-9 && H.sb < 1e-9 ? 'keduanya habis tepat' : 'unsur ' + (H.sa > H.sb ? C.A.f : C.B.f) + ' berlebih dan tersisa') : 'atur massa unsur lalu jalankan', { s:11, c:'#AEC0E0', a:'middle' });
  $L('pEq').textContent = C.A.f + ' + ' + C.B.f + ' → ' + C.f;
  // tabel
  const t = $L('pTab'); t.innerHTML = '';
  const cx = [420, 472, 532, 598, 668];
  ['A (g)', 'B (g)', 'Hasil (g)', 'Sisa', 'A ÷ B bereaksi'].forEach((h, i) => teks(t, cx[i], 98, h.replace('A', C.A.f).replace('B', C.B.f), { s:10.5, a:'middle', c:'#AEC0E0', w:700 }));
  svEl('line', { x1:392, y1:106, x2:696, y2:106, stroke:'rgba(255,255,255,.2)' }, t);
  const rows = P.rows.filter(r => r.rx === P.rx).slice(-5);
  rows.forEach((r, i) => {
    const y = 124 + i * 22;
    [fm(r.a, 1), fm(r.b, 1), fm(r.prod, 2), r.sa > 1e-9 ? C.A.f + ' ' + fm(r.sa, 2) : (r.sb > 1e-9 ? C.B.f + ' ' + fm(r.sb, 2) : '—'), fm(r.ra / r.rb, 3)].forEach((v, j) => teks(t, cx[j], y, v, { s:11.5, a:'middle', c:j === 4 ? '#FFB27A' : '#fff' }));
  });
  if (!rows.length) teks(t, 544, 140, 'belum ada data: jalankan percobaan', { s:11, a:'middle', c:'#8FA3C7' });
  svEl('line', { x1:392, y1:240, x2:696, y2:240, stroke:'rgba(255,255,255,.14)' }, t);
  const konst = rows.length >= 2 && rows.every(r => Math.abs(r.ra / r.rb - rows[0].ra / rows[0].rb) < 1e-9);
  teks(t, 392, 262, 'Rasio massa ' + C.A.f + ' ÷ ' + C.B.f + ' bereaksi', { s:11.5, w:700, c:'#AEC0E0' });
  teks(t, 696, 262, rows.length ? fm(rows[rows.length - 1].ra / rows[rows.length - 1].rb, 3) : '?', { s:13, a:'end', c:'#FFB27A' });
  teks(t, 392, 286, 'Rasio selalu sama?', { s:11.5, w:700, c:'#AEC0E0' });
  teks(t, 696, 286, rows.length >= 2 ? (konst ? 'ya: perbandingan tetap' : 'tidak') : 'butuh ≥ 2 data', { s:12, a:'end', c:konst ? '#4ADE80' : '#8FA3C7' });
  const co = P.rows.find(r => r.rx === 'co'), co2 = P.rows.find(r => r.rx === 'co2');
  svEl('line', { x1:392, y1:302, x2:696, y2:302, stroke:'rgba(255,255,255,.14)' }, t);
  teks(t, 544, 322, 'Hukum kelipatan perbandingan (Dalton)', { s:10.5, a:'middle', c:'#AEC0E0', w:700 });
  teks(t, 392, 346, 'Massa O per 12 g C: CO', { s:11.5, w:700, c:'#AEC0E0' }); teks(t, 696, 346, co ? fm(12 * co.rb / co.ra, 1) + ' g' : '?', { s:12.5, a:'end' });
  teks(t, 392, 368, 'Massa O per 12 g C: CO₂', { s:11.5, w:700, c:'#AEC0E0' }); teks(t, 696, 368, co2 ? fm(12 * co2.rb / co2.ra, 1) + ' g' : '?', { s:12.5, a:'end' });
  if (labS.mikro && rows.length) { const r = rows[rows.length - 1]; teks(t, 544, 392, 'k = min(' + fm(r.a / C.A.r, 3) + '; ' + fm(r.b / C.B.r, 3) + ') = ' + fm(Math.min(r.a / C.A.r, r.b / C.B.r), 3), { s:10, a:'middle', c:'#AEC0E0', w:700 }); }
  $L('lPillT').textContent = C.f + ' · ' + C.nama;
  $L('lInfo1').textContent = f >= 1 ? (H.sa < 1e-9 && H.sb < 1e-9 ? 'Kedua unsur habis tepat' : 'Unsur berlebih tersisa, rasio bereaksi tetap') : 'Variasikan massa unsur dan bandingkan rasio';
  $L('lInfo2').textContent = 'Senyawa tertentu: perbandingan massa unsur tetap';
  const st = $L('lab-status'); st.textContent = P.run ? 'Bereaksi...' : (f >= 1 ? 'Hasil ' + fm(H.prod, 2) + ' g' : 'Siap'); st.className = 'lab-status ' + (P.run || f >= 1 ? 'on' : 'off');
}

/* ---------- Perbandingan volume ---------- */
function labGlPilih(id){ const G = labS.g; G.rx = id; G.t = 0; G.run = false; G.started = false; labRender(); }
function labGlSet(k, v){ const G = labS.g; G[k] = v; G.t = 0; G.run = false; G.started = false; labRender(); }
function labGlJalan(){ const G = labS.g; G.t = 0; G.run = true; G.started = true; labRenderPanel(); sfx('click'); }
function glHitung(){
  const G = labS.g, R = GL[G.rx], V = [G.a, G.b], xi = Math.min(V[0] / R.re[0].nu, V[1] / R.re[1].nu);
  const pakai = R.re.map(s => s.nu * xi), sisa = R.re.map((s, i) => V[i] - pakai[i]), hasil = R.pr.map(s => s.nu * xi);
  return { R:R, V:V, xi:xi, pakai:pakai, sisa:sisa, hasil:hasil };
}
function glSelesai(){ const G = labS.g, H = glHitung(); G.runs.push({ rx:G.rx, a:G.a, b:G.b, pakai:H.pakai.slice(), hasil:H.hasil.slice() }); }
function silinder(g, x, base, vol, maks, w, col, label, fe, tampil){
  const h = vol / maks * 170 * (tampil === undefined ? 1 : tampil);
  svEl('rect', { x:x, y:base - 176, width:44, height:176, rx:6, fill:'rgba(255,255,255,.08)', stroke:'#8795AD', 'stroke-width':3 }, g);
  svEl('rect', { x:x + 2, y:base - h, width:40, height:Math.max(h, 0), rx:2, fill:col, opacity:.5 }, g);
  const n = Math.round(vol * (tampil === undefined ? 1 : tampil) / 5);
  for (let k = 0; k < n; k++) svEl('circle', { cx:x + 12 + (k % 2) * 20 + Math.sin(labS.tick * 0.25 + k) * 1.2, cy:base - 12 - Math.floor(k / 2) * 16, r:5, fill:col, stroke:'#fff', 'stroke-width':1.2 }, g);
  teks(g, x + 22, base + 18, label, { s:12, a:'middle', c:col, f:'Fraunces,Georgia,serif' });
  teks(g, x + 22, base + 34, fm(vol * (tampil === undefined ? 1 : tampil), 1) + ' L', { s:11, a:'middle' });
}
function glDraw(){
  const G = labS.g, H = glHitung(), R = H.R, g = $L('gCyl'); g.innerHTML = '';
  const f = G.started ? labKlem(G.t / T_GL, 0, 1) : 0, fe = labEase(f), base = 340;
  const maks = Math.max(G.a, G.b, ...H.hasil, 5);
  teks(g, 80, 104, 'Sebelum', { s:11, c:'#8EC1FF', a:'middle' }); teks(g, 262, 104, 'Sesudah', { s:11, c:'#4ADE80', a:'middle' });
  silinder(g, 40, base, G.a, maks, 44, R.re[0].w, R.re[0].f, fe); silinder(g, 100, base, G.b, maks, 44, R.re[1].w, R.re[1].f, fe);
  svEl('line', { x1:156, y1:240, x2:176, y2:240, stroke:'#FFB27A', 'stroke-width':4 }, g); svEl('polygon', { points:'182,240 172,233 172,247', fill:'#FFB27A' }, g);
  const sisaIdx = H.sisa.findIndex(v => v > 1e-9);
  const aft = [];
  if (sisaIdx >= 0) aft.push({ v:H.sisa[sisaIdx], c:R.re[sisaIdx].w, f:R.re[sisaIdx].f + ' sisa', tamp:1 });
  R.pr.forEach((p, i) => aft.push({ v:H.hasil[i], c:p.w, f:p.f, tamp:fe }));
  aft.forEach((a, i) => silinder(g, 196 + i * 56, base, a.v, maks, 44, a.c, a.f, fe, a.tamp));
  teks(g, 190, 392, f >= 1 ? 'T dan P sama: volume berbanding bilangan bulat' : '● = 5 L · volume sama → jumlah molekul sama', { s:10.5, c:'#AEC0E0', a:'middle' });
  $L('gEq').textContent = R.eq;
  const r = $L('gRows'); r.innerHTML = '';
  const done = f >= 1;
  baris(r, 100, 'Reaksi', R.eq, '#4ADE80');
  baris(r, 124, 'Volume mula-mula ' + R.re[0].f, fm(G.a) + ' L', '#8EC1FF');
  baris(r, 148, 'Volume mula-mula ' + R.re[1].f, fm(G.b) + ' L', '#8EC1FF');
  svEl('line', { x1:392, y1:162, x2:696, y2:162, stroke:'rgba(255,255,255,.14)' }, r);
  baris(r, 184, 'Volume ' + R.re[0].f + ' bereaksi', done ? fm(H.pakai[0]) + ' L' : '?', '#FFB27A');
  baris(r, 208, 'Volume ' + R.re[1].f + ' bereaksi', done ? fm(H.pakai[1]) + ' L' : '?', '#FFB27A');
  R.pr.forEach((p, i) => baris(r, 232 + i * 24, 'Volume ' + p.f + ' terbentuk', done ? fm(H.hasil[i]) + ' L' : '?', '#9FE0B8'));
  const nb = 232 + R.pr.length * 24;
  baris(r, nb, 'Gas berlebih', done ? (sisaIdx >= 0 ? R.re[sisaIdx].f + ' ' + fm(H.sisa[sisaIdx]) + ' L' : 'tidak ada') : '?', '#FF9A8A');
  const v = [H.pakai[0], H.pakai[1], ...H.hasil], dv = v.reduce((a, b) => gcd(a, Math.round(b)), 0) || 1;
  baris(r, nb + 24, 'Perbandingan volume (sederhana)', done ? v.map(x => fm(Math.round(x) / dv, 2)).join(' : ') : '?', '#FFE29A');
  if (labS.mikro && done) teks(r, 544, nb + 48, 'xi = min(' + R.re.map((s, i) => fm(H.V[i] / s.nu, 2)).join('; ') + ') = ' + fm(H.xi, 2) + ' (volume ÷ koefisien)', { s:10, a:'middle', c:'#AEC0E0', w:700 });
  teks(r, 544, 392, 'Avogadro: volume gas ∝ jumlah molekul ∝ koefisien', { s:10.5, a:'middle', c:'#AEC0E0' });
  $L('lPillT').textContent = R.eq.split(' → ')[0] + ' · ' + fm(G.a) + ' L + ' + fm(G.b) + ' L';
  $L('lInfo1').textContent = done ? 'Perbandingan volume = perbandingan koefisien' : 'Atur volume gas lalu jalankan reaksi';
  $L('lInfo2').textContent = 'Syarat: suhu dan tekanan sama';
  const st = $L('lab-status'); st.textContent = G.run ? 'Bereaksi...' : (done ? 'Selesai' : 'Siap'); st.className = 'lab-status ' + (G.run || done ? 'on' : 'off');
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
  b.textContent = '🔬 Mode Rumus: ' + (labS.mikro ? 'hidup' : 'mati');
  if (labS.mikro) labToast('🔬 Rincian perhitungan ditampilkan.');
  labRender();
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
  const gm = $L('grid-mode'); gm.innerHTML = '';
  LAB_MODE.forEach(m => labChip(gm, m.nama, '', labS.mode === m.id, () => labGantiMode(m.id)));
  $L('rakit-dyn').innerHTML = '';
  const rb = $L('run-btn');
  if (labS.mode === 'l') {
    const L = labS.l;
    const g1 = labSec('⚗️ Reaksi', '', 'rx-grid cols2');
    LV_IDS.forEach(id => labChip(g1, LV[id].nama, '', L.rx === id, () => labLavPilih('rx', id)));
    const g2 = labSec('🏺 Ruang percobaan', '', 'rx-grid cols3');
    [['buka', 'Terbuka'], ['tutup', 'Tertutup'], ['dua', 'Keduanya']].forEach(([id, nm]) => labChip(g2, nm, '', L.sys === id, () => labLavPilih('sys', id)));
    rb.style.display = ''; rb.disabled = L.run; rb.textContent = L.run ? '⏳ Bereaksi...' : '▶ Jalankan reaksi';
  } else if (labS.mode === 'p') {
    const P = labS.p, C = PR[P.rx];
    const g1 = labSec('⚗️ Senyawa', '', 'rx-grid cols5');
    PR_IDS.forEach(id => labChip(g1, PR[id].f, '', P.rx === id, () => labPrPilih(id)));
    const ga = labSec('Massa ' + C.A.f, 'gram', 'rx-grid cols8');
    N_MASSA.forEach(v => labChip(ga, String(v), '', P.a === v, () => labPrSet('a', v)));
    const gb = labSec('Massa ' + C.B.f, 'gram', 'rx-grid cols8');
    N_MASSA.forEach(v => labChip(gb, String(v), '', P.b === v, () => labPrSet('b', v)));
    rb.style.display = ''; rb.disabled = P.run; rb.textContent = P.run ? '⏳ Bereaksi...' : '▶ Jalankan percobaan';
  } else {
    const G = labS.g, R = GL[G.rx];
    const g1 = labSec('⚗️ Reaksi gas', '', 'rx-grid cols2');
    GL_IDS.forEach(id => labChip(g1, GL[id].eq.split(' → ')[0], '', G.rx === id, () => labGlPilih(id)));
    [['a', R.re[0].f], ['b', R.re[1].f]].forEach(([k, nm]) => { const g = labSec('Volume ' + nm, 'liter', 'rx-grid cols5'); N_VOL.forEach(v => labChip(g, String(v), '', G[k] === v, () => labGlSet(k, v))); });
    rb.style.display = ''; rb.disabled = G.run; rb.textContent = G.run ? '⏳ Bereaksi...' : '▶ Jalankan reaksi';
  }
}
function labRender(){
  const m = labS.mode;
  $L('scL').style.display = m === 'l' ? '' : 'none';
  $L('scP').style.display = m === 'p' ? '' : 'none';
  $L('scG').style.display = m === 'g' ? '' : 'none';
  labRenderPanel();
  labDrawMode();
  labIsiData(); labRenderMisi();
}
function labDrawMode(){ const m = labS.mode; if (m === 'l') lavDraw(); else if (m === 'p') prDraw(); else glDraw(); labS.dirty = false; }
function labJalankan(){ if (labS.mode === 'l') labLavJalan(); else if (labS.mode === 'p') labPrJalan(); else labGlJalan(); }

setInterval(() => {
  if (!labAktif()) return;
  labS.tick++;
  const L = labS.l, P = labS.p, G = labS.g;
  if (L.run) { L.t += 0.04; if (L.t >= T_LAV) { L.t = T_LAV; L.run = false; lavSelesai(); labRenderPanel(); labIsiData(); labRenderMisi(); } if (labS.mode === 'l') lavDraw(); }
  else if (labS.mode === 'l' && L.started && L.t < T_LAV + 1) lavDraw();
  if (P.run) { P.t += 0.04; if (P.t >= T_PR) { P.t = T_PR; P.run = false; prSelesai(); labRenderPanel(); labIsiData(); labRenderMisi(); } if (labS.mode === 'p') prDraw(); }
  if (G.run) { G.t += 0.04; if (G.t >= T_GL) { G.t = T_GL; G.run = false; glSelesai(); labRenderPanel(); labIsiData(); labRenderMisi(); } if (labS.mode === 'g') glDraw(); }
  else if (labS.mode === 'g' && G.started && G.t >= T_GL && labS.tick % 4 === 0) glDraw();
}, 40);

/* ---------- Tab Data ---------- */
function labIsiData(){
  const info = $L('d-info'), hit = $L('d-hitung'), it = $L('d-info-t'), ht = $L('d-hitung-t'), am = $L('d-amati');
  const a = [];
  if (labS.mode === 'l') {
    const L = labS.l, R = LV[L.rx];
    it.textContent = '🧪 Reaksi'; ht.textContent = '🧮 Neraca massa';
    info.innerHTML = '<div class="hasil-baris">' + R.eq + '<br>Pereaksi: ' + R.re.map(x => x.f + ' ' + fm(x.m) + ' g').join(' + ') + '<br>Produk: ' + R.pr.map(x => x.f + ' ' + fm(x.m) + ' g').join(' + ') + '</div>';
    const rr = ['tutup', 'buka'].map(k => { const r = L.res[L.rx + '|' + k], M = lavMassa(L.rx, k); return (k === 'tutup' ? 'Tertutup' : 'Terbuka') + ': ' + (r ? fx(M.sebelum, 2) + ' → ' + fx(M.sesudah, 2) + ' g' : 'belum diuji'); });
    hit.innerHTML = '<div class="hasil-baris">' + rr.join('<br>') + '</div><div class="lab-note">Massa labu kosong dan sumbat dianggap 100,00 g; kekuatan apung udara diabaikan.</div>';
    a.push('Ruang tertutup: massa total tetap.');
    a.push('Ruang terbuka: massa berubah bila ada gas yang masuk atau keluar.');
  } else if (labS.mode === 'p') {
    const P = labS.p, C = PR[P.rx], H = prHitung();
    it.textContent = '🧪 Senyawa'; ht.textContent = '🧮 Perhitungan';
    info.innerHTML = '<div class="hasil-baris">' + C.f + ' (' + C.nama + ')<br>' + C.A.f + ' ' + fm(P.a) + ' g + ' + C.B.f + ' ' + fm(P.b) + ' g</div>';
    hit.innerHTML = '<div class="hasil-baris">Bereaksi: ' + C.A.f + ' ' + fm(H.ra, 2) + ' g + ' + C.B.f + ' ' + fm(H.rb, 2) + ' g<br>Hasil: ' + C.f + ' ' + fm(H.prod, 2) + ' g<br>Sisa: ' + (H.sa > 1e-9 ? C.A.f + ' ' + fm(H.sa, 2) + ' g' : (H.sb > 1e-9 ? C.B.f + ' ' + fm(H.sb, 2) + ' g' : 'tidak ada')) + '</div>';
    a.push('Pada senyawa tertentu, perbandingan massa unsur yang bereaksi selalu tetap.');
    a.push('Unsur berlebih tidak ikut bereaksi dan menjadi sisa.');
  } else {
    const G = labS.g, H = glHitung(), R = H.R;
    it.textContent = '🧪 Reaksi gas'; ht.textContent = '🧮 Perhitungan';
    info.innerHTML = '<div class="hasil-baris">' + R.eq + '<br>' + R.re[0].f + ' ' + fm(G.a) + ' L, ' + R.re[1].f + ' ' + fm(G.b) + ' L (T dan P sama)</div>';
    hit.innerHTML = '<div class="hasil-baris">Bereaksi: ' + R.re.map((s, i) => s.f + ' ' + fm(H.pakai[i]) + ' L').join(' · ') + '<br>Terbentuk: ' + R.pr.map((s, i) => s.f + ' ' + fm(H.hasil[i]) + ' L').join(' · ') + '</div>';
    a.push('Perbandingan volume gas yang bereaksi = perbandingan koefisien.');
    a.push('Pada T dan P sama, volume sama berarti jumlah molekul sama.');
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
  const L = labS.l, P = labS.p, G = labS.g;
  // M1
  if (!labS.m1opt) labS.m1opt = labAcak([
    { t:'Gas CO₂ hasil reaksi lepas ke udara, sehingga massa yang ditimbang di ruang terbuka berkurang', b:true },
    { t:'Hukum kekekalan massa tidak berlaku pada ruang terbuka', b:false },
    { t:'Sebagian zat padat lenyap menjadi energi', b:false },
    { t:'Neraca di ruang terbuka rusak', b:false }]);
  const ok1 = (L.res['caco3|buka'] && L.res['caco3|tutup']) || (L.res['nahco3|buka'] && L.res['nahco3|tutup']);
  labKuis('m1-quiz', labS.misi[0], 'Massa total tetap, gas yang lepas membawa sebagian massa.', !!ok1, 'Jalankan CaCO₃ + HCl atau NaHCO₃ + CH₃COOH di ruang terbuka dan tertutup.',
    'Pada reaksi pelepas gas, massa di ruang terbuka turun, sedangkan di ruang tertutup tetap. Mengapa?', labS.m1opt, 'labJawabM1', 'm1', 'm1');
  // M2
  if (!labS.m2opt) labS.m2opt = labAcak([
    { t:'Mg menyerap O₂ dari udara membentuk MgO, sehingga massa zat yang ditimbang bertambah', b:true },
    { t:'Mg berubah menjadi unsur lain yang lebih berat', b:false },
    { t:'Massa bertambah karena energi panas', b:false },
    { t:'Hukum Lavoisier salah untuk logam', b:false }]);
  labKuis('m2-quiz', labS.misi[1], 'Massa Mg + massa O₂ yang diserap = massa MgO.', !!L.res['mg|buka'], 'Jalankan pembakaran Mg di ruang terbuka.',
    'Pita Mg dibakar di ruang terbuka: 2,4 g menjadi 4,0 g MgO. Mengapa massanya bertambah?', labS.m2opt, 'labJawabM2', 'm2', 'm2');
  // M3
  const grup = PR_IDS.find(id => uniq(P.rows.filter(r => r.rx === id).map(r => r.a + '|' + r.b)).length >= 3);
  if (grup && labS.m3key !== grup) {
    labS.m3key = grup; const C = PR[grup];
    const benar = C.A.r + ' : ' + C.B.r;
    const kand = [C.B.r + ' : ' + C.A.r, '1 : 1', (C.A.r + 1) + ' : ' + C.B.r, C.A.r + ' : ' + (C.B.r + 1), '2 : 3'].filter(x => x !== benar);
    labS.m3opt = labAcak([{ t:benar, b:true }].concat(uniq(kand).slice(0, 3).map(t => ({ t, b:false }))));
    labS.m3tanya = 'Dari tiga percobaan, rasio massa ' + C.A.f + ' ÷ ' + C.B.f + ' yang bereaksi selalu sama. Perbandingan massa ' + C.A.f + ' : ' + C.B.f + ' dalam ' + C.f + ' adalah ...';
  }
  labS.m3kuis = labKuis('m3-quiz', labS.misi[2], 'Itulah hukum perbandingan tetap (Proust).', !!grup, 'Jalankan tiga percobaan berbeda untuk satu senyawa.', labS.m3tanya || '', labS.m3opt || [], 'labJawabM3', labS.m3key, labS.m3kuis);
  // M4
  if (!labS.m4opt) labS.m4opt = labAcak([
    { t:'1 : 2 (bilangan bulat sederhana)', b:true },
    { t:'2 : 3', b:false }, { t:'1 : 1', b:false }, { t:'1 : 3', b:false }]);
  const ok4 = P.rows.some(r => r.rx === 'co') && P.rows.some(r => r.rx === 'co2');
  labKuis('m4-quiz', labS.misi[3], 'Hukum kelipatan perbandingan (Dalton).', ok4, 'Jalankan CO dan CO₂.',
    'Per 12 g C, CO mengandung 16 g O dan CO₂ mengandung 32 g O. Perbandingan massa O pada kedua senyawa adalah ...', labS.m4opt, 'labJawabM4', 'm4', 'm4');
  // M5
  const Lg = G.runs[G.runs.length - 1];
  if (G.runs.length >= 2 && Lg) {
    const key = Lg.rx + '|' + Lg.a + '|' + Lg.b + '|' + G.runs.length;
    if (labS.m5key !== key) {
      labS.m5key = key; const R = GL[Lg.rx], v = Lg.a * R.re[1].nu / R.re[0].nu;
      const benar = fm(v) + ' L', kand = uniq([fm(Lg.a) + ' L', fm(Lg.a * 2) + ' L', fm(Lg.a / 2) + ' L', fm(Lg.a * 3) + ' L', fm(Lg.a * R.re[0].nu / R.re[1].nu) + ' L']).filter(x => x !== benar);
      labS.m5opt = labAcak([{ t:benar, b:true }].concat(kand.slice(0, 3).map(t => ({ t, b:false }))));
      labS.m5tanya = 'Pada ' + R.eq + ', berapa liter ' + R.re[1].f + ' yang tepat bereaksi dengan ' + fm(Lg.a) + ' L ' + R.re[0].f + ' (T dan P sama)?';
    }
  }
  labS.m5kuis = labKuis('m5-quiz', labS.misi[4], 'Volume berbanding sebagai koefisien reaksi.', G.runs.length >= 2 && !!Lg, 'Jalankan dua reaksi gas.', labS.m5tanya || '', labS.m5opt || [], 'labJawabM5', labS.m5key, labS.m5kuis);
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
function labJawabM1(i){ labJawab('m1-quiz', labS.m1opt, i, 'm1-fb', 'Tepat! Gas yang lepas membawa sebagian massa.', 'Belum tepat. Perhatikan apa yang keluar dari labu terbuka.', 0, '🎉 Misi 1 selesai! Kamu menjelaskan selisih massa.'); }
function labJawabM2(i){ labJawab('m2-quiz', labS.m2opt, i, 'm2-fb', 'Benar! O₂ dari udara ikut menjadi bagian MgO.', 'Belum tepat. Dari mana atom oksigen dalam MgO berasal?', 1, '🎉 Misi 2 selesai! Kamu memahami penambahan massa.'); }
function labJawabM3(i){ labJawab('m3-quiz', labS.m3opt, i, 'm3-fb', 'Tepat! Perbandingan massa unsur dalam senyawa selalu tetap.', 'Belum tepat. Bandingkan massa kedua unsur yang bereaksi pada tiap percobaan.', 2, '🎉 Misi 3 selesai! Kamu menemukan perbandingan tetap.'); }
function labJawabM4(i){ labJawab('m4-quiz', labS.m4opt, i, 'm4-fb', 'Benar! 16 : 32 = 1 : 2.', 'Belum tepat. Bagi 16 dengan 32 lalu sederhanakan.', 3, '🎉 Misi 4 selesai! Kamu membuktikan hukum Dalton.'); }
function labJawabM5(i){ labJawab('m5-quiz', labS.m5opt, i, 'm5-fb', 'Tepat! Gunakan perbandingan koefisien.', 'Belum tepat. Perbandingan volume sama dengan perbandingan koefisien.', 4, '🎉 Misi 5 selesai! Kamu menerapkan hukum Gay-Lussac.'); }

/* ---------- LKPD, reset, toast, selesai ---------- */
function labCatat(){
  labS.catatNo++;
  const item = document.createElement('div'); item.className = 'lab-log-item';
  let isi = '';
  if (labS.mode === 'l') { const L = labS.l, R = LV[L.rx]; const rr = ['tutup', 'buka'].map(k => { const r = L.res[L.rx + '|' + k], M = lavMassa(L.rx, k); return (k === 'tutup' ? 'tertutup ' : 'terbuka ') + (r ? fx(M.sebelum, 2) + ' → ' + fx(M.sesudah, 2) : '—'); }); isi = '<b>Kekekalan massa</b> · ' + R.nama + '<br>' + rr.join(' · '); }
  else if (labS.mode === 'p') { const P = labS.p, C = PR[P.rx], H = prHitung(); isi = '<b>Perbandingan tetap</b> · ' + C.f + '<br>' + C.A.f + ' ' + fm(P.a) + ' g + ' + C.B.f + ' ' + fm(P.b) + ' g → ' + fm(H.prod, 2) + ' g; rasio bereaksi ' + fm(H.ra / H.rb, 3); }
  else { const G = labS.g, H = glHitung(); isi = '<b>Perbandingan volume</b> · ' + H.R.eq + '<br>' + fm(G.a) + ' L + ' + fm(G.b) + ' L → ' + H.R.pr.map((s, i) => s.f + ' ' + fm(H.hasil[i]) + ' L').join(', '); }
  item.innerHTML = '<b>No. ' + labS.catatNo + '</b> · ' + isi;
  const log = $L('lab-log'); log.insertBefore(item, log.firstChild);
  while (log.children.length > 10) log.removeChild(log.lastChild);
  labToast('📓 Pengamatan berhasil dicatat ke LKPD!');
}
function labReset(){
  labS.mode = 'l';
  labS.l = { rx:'caco3', sys:'dua', aktif:[], t:0, run:false, started:false, res:{} };
  labS.p = { rx:'mgo', a:6, b:3, t:0, run:false, started:false, rows:[] };
  labS.g = { rx:'hcl', a:10, b:10, t:0, run:false, started:false, runs:[] };
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
  else if (s >= 60) kal = 'Bagus! Terus berlatih memahami hukum dasar kimia.';
  else kal = 'Ayo selesaikan semua misi untuk meraih skor penuh!';
  $L('lab-akhir-kal').textContent = kal;
  openModal('modal-lab'); sfx('win');
}

(function labInit(){
  if (!$L('scr-lab')) return;
  labRender(); labUpdateMisiCount();
})();
