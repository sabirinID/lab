/* ##############################################################
   #  LAB MAYA — PRAKTIKUM VIRTUAL STOIKIOMETRI                 #
   #  Tiga eksperimen: konsep mol (massa, partikel, volume),    #
   #  pereaksi pembatas (tabel MBS, sisa, hasil, rendemen), dan #
   #  rumus empiris. Ar dibulatkan; 1 titik partikel = 0,5 mol. #
   ############################################################## */
const LAB_NS = 'http://www.w3.org/2000/svg';
const $L = id => document.getElementById(id);

/* ---------- Data ---------- */
const AR = { H:1, C:12, N:14, O:16, Na:23, Mg:24, Al:27, S:32, Cl:35.5, Fe:56, Ca:40 };
const NA = 6.02e23, VM = 22.4;
const ZM = {
  h2o:   { f:'H₂O',      nama:'Air',               Mr:18,   hit:'(2 × 1) + 16',                gas:false },
  co2:   { f:'CO₂',      nama:'Karbon dioksida',   Mr:44,   hit:'12 + (2 × 16)',               gas:true },
  nacl:  { f:'NaCl',     nama:'Natrium klorida',   Mr:58.5, hit:'23 + 35,5',                   gas:false },
  nh3:   { f:'NH₃',      nama:'Amonia',            Mr:17,   hit:'14 + (3 × 1)',                gas:true },
  o2:    { f:'O₂',       nama:'Oksigen',           Mr:32,   hit:'2 × 16',                      gas:true },
  glu:   { f:'C₆H₁₂O₆',  nama:'Glukosa',           Mr:180,  hit:'(6 × 12) + (12 × 1) + (6 × 16)', gas:false },
  caco3: { f:'CaCO₃',    nama:'Kalsium karbonat',  Mr:100,  hit:'40 + 12 + (3 × 16)',          gas:false },
  fe:    { f:'Fe',       nama:'Besi',              Mr:56,   hit:'Ar Fe = 56',                  gas:false }
};
const ZM_IDS = ['h2o','co2','nacl','nh3','o2','glu','caco3','fe'];
const N_MOL = [0.1, 0.25, 0.5, 1, 2, 3, 5], N_MASSA = [10, 25, 50, 100];

const COL = { H:'#F4F6FA', O:'#E8453C', N:'#3B6FE0', C:'#6B7280', Mg:'#9BD83C', Cl:'#3BA55D', Al:'#B7C2D6', Fe:'#A0522D', S:'#F2C21B' };
const ICON = {
  H2:[['H',-6,0,6],['H',6,0,6]], O2:[['O',-8,0,8],['O',8,0,8]], N2:[['N',-8,0,8],['N',8,0,8]], Cl2:[['Cl',-9,0,9],['Cl',9,0,9]],
  H2O:[['O',0,0,8],['H',-9,8,5.5],['H',9,8,5.5]], NH3:[['N',0,-2,8],['H',-10,7,5.5],['H',10,7,5.5],['H',0,-13,5.5]],
  Mg:[['Mg',0,0,8]], MgO:[['Mg',-6,0,8],['O',7,0,7]], Al:[['Al',0,0,8]], Fe:[['Fe',0,0,8]], S:[['S',0,0,8]], FeS:[['Fe',-6,0,8],['S',7,0,7]],
  CH4:[['C',0,0,8],['H',-10,-7,5],['H',10,-7,5],['H',-10,8,5],['H',10,8,5]], CO2:[['O',-14,0,7],['C',0,0,8],['O',14,0,7]],
  AlCl3:[['Al',0,0,8],['Cl',-12,8,6.5],['Cl',12,8,6.5],['Cl',0,-12,6.5]]
};
const RX = {
  r1:{ eq:'2H₂ + O₂ → 2H₂O',          re:[{ k:'H2', f:'H₂', nu:2, Mr:2 }, { k:'O2', f:'O₂', nu:1, Mr:32 }],        pr:[{ k:'H2O', f:'H₂O', nu:2, Mr:18 }] },
  r2:{ eq:'N₂ + 3H₂ → 2NH₃',           re:[{ k:'N2', f:'N₂', nu:1, Mr:28 }, { k:'H2', f:'H₂', nu:3, Mr:2 }],        pr:[{ k:'NH3', f:'NH₃', nu:2, Mr:17 }] },
  r3:{ eq:'2Mg + O₂ → 2MgO',           re:[{ k:'Mg', f:'Mg', nu:2, Mr:24 }, { k:'O2', f:'O₂', nu:1, Mr:32 }],        pr:[{ k:'MgO', f:'MgO', nu:2, Mr:40 }] },
  r4:{ eq:'CH₄ + 2O₂ → CO₂ + 2H₂O',    re:[{ k:'CH4', f:'CH₄', nu:1, Mr:16 }, { k:'O2', f:'O₂', nu:2, Mr:32 }],      pr:[{ k:'CO2', f:'CO₂', nu:1, Mr:44 }, { k:'H2O', f:'H₂O', nu:2, Mr:18 }] },
  r5:{ eq:'2Al + 3Cl₂ → 2AlCl₃',       re:[{ k:'Al', f:'Al', nu:2, Mr:27 }, { k:'Cl2', f:'Cl₂', nu:3, Mr:71 }],       pr:[{ k:'AlCl3', f:'AlCl₃', nu:2, Mr:133.5 }] },
  r6:{ eq:'Fe + S → FeS',              re:[{ k:'Fe', f:'Fe', nu:1, Mr:56 }, { k:'S', f:'S', nu:1, Mr:32 }],           pr:[{ k:'FeS', f:'FeS', nu:1, Mr:88 }] }
};
const RX_IDS = ['r1','r2','r3','r4','r5','r6'];
const N_AWAL = [0.5, 1, 2, 3, 4, 5, 6], EFF = [100, 80, 60];
const EMP = {
  a:{ nama:'Senyawa A', els:[['C', 40.0], ['H', 6.7], ['O', 53.3]], Mr:180 },
  b:{ nama:'Senyawa B', els:[['Fe', 69.9], ['O', 30.1]], Mr:160 },
  c:{ nama:'Senyawa C', els:[['Na', 32.4], ['S', 22.6], ['O', 45.0]], Mr:142 },
  d:{ nama:'Senyawa D', els:[['C', 85.7], ['H', 14.3]], Mr:56 },
  e:{ nama:'Senyawa E', els:[['N', 30.4], ['O', 69.6]], Mr:92 },
  f:{ nama:'Senyawa F', els:[['Al', 52.9], ['O', 47.1]], Mr:102 }
};
const E_IDS = ['a','b','c','d','e','f'];
const TAHAP = ['Persen','Mol','Bagi','Bulatkan','Molekul'];
const LAB_MODE = [ { id:'m', nama:'Konsep Mol' }, { id:'p', nama:'Pembatas' }, { id:'e', nama:'Empiris' } ];
const SUBS = '₀₁₂₃₄₅₆₇₈₉', SUPS = { '0':'⁰','1':'¹','2':'²','3':'³','4':'⁴','5':'⁵','6':'⁶','7':'⁷','8':'⁸','9':'⁹','-':'⁻' };
const T_RX = 3.0;

const labS = {
  mode:'m',
  m:{ zat:'h2o', n:1, views:[], changes:0, m1:null, m2:null },
  p:{ rx:'r1', a:4, b:3, unit:'mol', eff:100, t:0, run:false, started:false, runs:[], last:null },
  e:{ c:'a', stage:0, flag:{}, last:null },
  mikro:false, catatNo:0, dirty:true,
  misi:[false,false,false,false,false], skor:0, m1opt:null, m1key:'', m2opt:null, m2key:'', m4opt:null, m4key:'', m5opt:null, m5key:''
};

/* ---------- Utilitas ---------- */
function svEl(tag, attrs, parent){
  const e = document.createElementNS(LAB_NS, tag);
  for (const k in attrs) e.setAttribute(k, attrs[k]);
  if (parent) parent.appendChild(e);
  return e;
}
function fm(v, d){ d = d === undefined ? 3 : d; const s = String(Number(Number(v).toFixed(d))); return s.replace('.', ','); }
function labKlem(v, a, b){ return Math.max(a, Math.min(b, v)); }
function labEase(f){ f = labKlem(f, 0, 1); return f * f * (3 - 2 * f); }
function labAcak(arr){ for (let i = arr.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [arr[i], arr[j]] = [arr[j], arr[i]]; } return arr; }
function labAktif(){ const s = $L('scr-lab'); return s && s.classList.contains('active'); }
const sub = n => n > 1 ? String(n).split('').map(d => SUBS[+d]).join('') : '';
function sci(v){
  if (!(v > 0)) return '0';
  let e = Math.floor(Math.log10(v)), m = Number((v / Math.pow(10, e)).toPrecision(4));
  if (m >= 10) { m /= 10; e++; }
  return String(m).replace('.', ',') + '×10' + String(e).split('').map(c => SUPS[c]).join('');
}
function teks(g, x, y, str, o){
  o = o || {};
  const t = svEl('text', { x:x, y:y, 'text-anchor':o.a || 'start', 'font-size':o.s || 12, 'font-weight':o.w || 800, fill:o.c || '#fff', 'font-family':o.f || 'Figtree,sans-serif' }, g);
  t.textContent = str; return t;
}
function baris(g, y, label, nilai, warna){
  teks(g, 392, y, label, { s:11.5, w:700, c:'#AEC0E0' });
  teks(g, 696, y, nilai, { s:12.5, c:warna || '#fff', a:'end' });
}
function ikon(g, key, x, y, s, op){
  (ICON[key] || []).forEach(([el, dx, dy, r]) => svEl('circle', { cx:x + dx * s, cy:y + dy * s, r:r * s, fill:COL[el], stroke:'#0E2240', 'stroke-width':0.9, opacity:op === undefined ? 1 : op }, g));
}

/* ---------- Konsep mol ---------- */
function labMolPilih(id){ const M = labS.m; M.zat = id; if (!M.views.includes(id)) M.views.push(id); labRender(); }
function labMolN(n){ const M = labS.m; M.n = n; M.changes++; labRender(); }
function labMolMassa(g){ const M = labS.m, Z = ZM[M.zat]; M.n = g / Z.Mr; M.changes++; labRender(); }
function molDraw(){
  const M = labS.m, Z = ZM[M.zat], n = M.n, g = $L('mGrp'); g.innerHTML = '';
  const massa = n * Z.Mr, N = n * NA, V = n * VM;
  const cx = 190, cy = 218;
  const kotak = (x, y, judul, nilai, satuan, col) => {
    svEl('rect', { x:x - 72, y:y - 30, width:144, height:60, rx:14, fill:col, stroke:'#fff', 'stroke-opacity':.5, 'stroke-width':1.5 }, g);
    teks(g, x, y - 10, judul, { s:11, c:'#fff', a:'middle', w:700 });
    teks(g, x, y + 10, nilai, { s:nilai.length > 12 ? 13 : 16, a:'middle' });
    teks(g, x, y + 23, satuan, { s:9.5, c:'rgba(255,255,255,.85)', a:'middle', w:700 });
  };
  [[190, 100, '× Mr', 'Mr'], [74, 332, '× 6,02×10²³', 'L'], [296, 332, '× 22,4', 'V']].forEach(([x, y, lb]) => {
    svEl('line', { x1:cx, y1:cy, x2:x, y2:y, stroke:'rgba(255,255,255,.28)', 'stroke-width':3 }, g);
    teks(g, (cx + x) / 2 + (x < cx ? -34 : (x > cx ? 34 : 38)), (cy + y) / 2 + 4, lb, { s:10.5, c:'#FFE29A', a:'middle' });
  });
  svEl('circle', { cx:cx, cy:cy, r:46, fill:'#0E2240', stroke:'#FFC21A', 'stroke-width':5 }, g);
  teks(g, cx, cy - 6, 'n', { s:24, c:'#FFC21A', a:'middle', f:'Fraunces,Georgia,serif' });
  teks(g, cx, cy + 16, fm(n) + ' mol', { s:12.5, a:'middle' });
  kotak(190, 100, 'Massa', fm(massa) + ' g', 'n × Mr', '#25508C');
  kotak(74, 332, 'Jumlah partikel', sci(N), 'n × 6,02×10²³', '#F26A21');
  kotak(296, 332, 'Volume gas (STP)', Z.gas ? fm(V) + ' L' : 'bukan gas', Z.gas ? 'n × 22,4 L/mol' : 'tidak berlaku', '#1E8E5A');
  // kartu kanan
  const r = $L('mRows'); r.innerHTML = '';
  baris(r, 104, 'Zat', Z.f + ' (' + Z.nama + ')', '#4ADE80');
  baris(r, 128, 'Mr = ' + Z.hit, String(Z.Mr).replace('.', ','));
  baris(r, 152, 'Jumlah mol (n)', fm(n) + ' mol', '#FFE29A');
  baris(r, 176, 'Massa = n × Mr', fm(massa) + ' g', '#8EC1FF');
  baris(r, 200, 'Partikel = n × 6,02×10²³', sci(N), '#FFB27A');
  baris(r, 224, 'Volume STP = n × 22,4', Z.gas ? fm(V) + ' L' : 'bukan gas', '#9FE0B8');
  if (labS.mikro) {
    teks(r, 392, 246, fm(n) + ' × ' + Z.Mr + ' = ' + fm(massa) + '  ·  ' + fm(n) + ' × 6,02×10²³ = ' + sci(N), { s:10, c:'#AEC0E0', w:700 });
  }
  svEl('line', { x1:392, y1:256, x2:696, y2:256, stroke:'rgba(255,255,255,.14)' }, r);
  const dots = Math.min(60, Math.max(1, Math.round(n * 10)));
  for (let i = 0; i < dots; i++) svEl('circle', { cx:402 + (i % 20) * 15, cy:280 + Math.floor(i / 20) * 16, r:5.2, fill:'#FFB27A', stroke:'#fff', 'stroke-width':1 }, r);
  teks(r, 544, 340, 'setiap titik mewakili 0,1 mol (' + sci(0.1 * NA) + ' partikel)', { s:10.5, c:'#AEC0E0', a:'middle' });
  teks(r, 544, 362, 'n = massa ÷ Mr = ' + fm(massa) + ' ÷ ' + String(Z.Mr).replace('.', ',') + ' = ' + fm(n) + ' mol', { s:11.5, c:'#FFE29A', a:'middle' });
  $L('lPillT').textContent = Z.f + ' · ' + fm(n) + ' mol';
  $L('lInfo1').textContent = '1 mol = Mr gram = 6,02×10²³ partikel' + (Z.gas ? ' = 22,4 L (STP)' : '');
  $L('lInfo2').textContent = 'Mol adalah jembatan antar-satuan';
  const st = $L('lab-status'); st.textContent = fm(n) + ' mol · ' + fm(massa) + ' g'; st.className = 'lab-status on';
}

/* ---------- Pereaksi pembatas ---------- */
function labRxPilih(id){ const P = labS.p; P.rx = id; P.t = 0; P.run = false; P.started = false; labRender(); }
function labRxSet(k, v){ const P = labS.p; P[k] = v; P.t = 0; P.run = false; P.started = false; labRender(); }
function labRxJalan(){ const P = labS.p; P.t = 0; P.run = true; P.started = true; labRenderPanel(); sfx('click'); }
function rxHitung(){
  const P = labS.p, R = RX[P.rx], n = [P.a, P.b];
  const rasio = R.re.map((s, i) => n[i] / s.nu), xi = Math.min(...rasio);
  const lim = rasio.map((r, i) => Math.abs(r - xi) < 1e-9 ? i : -1).filter(i => i >= 0);
  const pakai = R.re.map(s => s.nu * xi), sisa = R.re.map((s, i) => Math.max(0, n[i] - pakai[i]));
  const hasil = R.pr.map(s => s.nu * xi);
  return { R:R, n:n, rasio:rasio, xi:xi, lim:lim, pakai:pakai, sisa:sisa, hasil:hasil };
}
function posisiKisi(counts, bx0){
  const out = []; let row = 0; const cols = 5, cw = 26, ch = 26, x0 = bx0 + 8 + (146 - 16 - cols * cw) / 2 + cw / 2, yb = 356 - 16;
  counts.forEach((c, si) => { for (let i = 0; i < c; i++) out.push({ s:si, i:i, x:x0 + (i % cols) * cw, y:yb - (row + Math.floor(i / cols)) * ch }); row += Math.ceil(c / cols); });
  return out;
}
function rxDraw(){
  const P = labS.p, H = rxHitung(), R = H.R, f = P.started ? labKlem(P.t / T_RX, 0, 1) : 0, fe = labEase(f), done = f >= 1;
  const bl = $L('pBL'), br = $L('pBR'); bl.innerHTML = ''; br.innerHTML = '';
  const u = 0.5, cnt = v => Math.round(v / u);
  const cL = H.n.map(cnt), cons = H.pakai.map(cnt);
  posisiKisi(cL, 34).forEach(p => { const gone = p.i < cons[p.s]; ikon(bl, R.re[p.s].k, p.x, p.y, 0.8, gone ? 1 - 0.85 * fe : 1); });
  const remC = H.sisa.map(cnt), prC = H.hasil.map(cnt);
  const posR = posisiKisi(remC.concat(prC), 204);
  posR.forEach(p => {
    if (p.s < R.re.length) ikon(br, R.re[p.s].k, p.x, p.y, 0.8, P.started ? 1 : 0.0);
    else if (p.i < Math.round(prC[p.s - R.re.length] * fe)) ikon(br, R.pr[p.s - R.re.length].k, p.x, p.y, 0.8, 1);
  });
  if (!P.started) teks(br, 275, 240, 'jalankan reaksi', { s:11, c:'#8FA3C7', a:'middle' });
  // legenda
  const lg = $L('pLeg'); lg.innerHTML = '';
  const spesies = R.re.concat(R.pr);
  spesies.forEach((s, i) => { const x = 40 + i * (spesies.length > 3 ? 82 : 108); ikon(lg, s.k, x, 382, 0.8); teks(lg, x + 16, 386, s.f, { s:11, c:'#fff' }); });
  teks(lg, 190, 410, '● = 0,5 mol (dibulatkan)', { s:10, c:'#7F93B5', a:'middle', w:700 });
  $L('pEq').textContent = R.eq;
  // tabel MBS
  const t = $L('pTab'); t.innerHTML = '';
  const nsp = spesies.length, cx = nsp === 4 ? [490, 550, 610, 670] : [500, 576, 652];
  teks(t, 392, 100, 'Spesies', { s:11, w:700, c:'#AEC0E0' });
  spesies.forEach((s, i) => teks(t, cx[i], 100, (s.nu > 1 ? s.nu : '') + s.f, { s:13, a:'middle', c:i < R.re.length ? '#8EC1FF' : '#9FE0B8', f:'Fraunces,Georgia,serif' }));
  const baris3 = [['Mula-mula', i => i < 2 ? fm(H.n[i]) : '0', '#fff', true], ['Bereaksi', i => i < 2 ? '−' + fm(H.pakai[i]) : '+' + fm(H.hasil[i - 2]), '#FFB27A', done], ['Sisa/hasil', i => i < 2 ? fm(H.sisa[i]) : fm(H.hasil[i - 2]), '#4ADE80', done], ['Massa (g)', i => fm((i < 2 ? H.sisa[i] : H.hasil[i - 2]) * spesies[i].Mr), '#FFE29A', done]];
  baris3.forEach(([lb, fn, col, tampil], ri) => {
    const y = 124 + ri * 24;
    teks(t, 392, y, lb, { s:11, w:700, c:'#AEC0E0' });
    spesies.forEach((s, i) => teks(t, cx[i], y, tampil ? fn(i) : '?', { s:12.5, a:'middle', c:tampil ? col : '#8FA3C7' }));
  });
  svEl('line', { x1:392, y1:218, x2:696, y2:218, stroke:'rgba(255,255,255,.14)' }, t);
  R.re.forEach((s, i) => {
    const y = 238 + i * 20, pem = H.lim.includes(i) && done;
    teks(t, 392, y, 'n ÷ koefisien ' + s.f, { s:11, w:700, c:'#AEC0E0' });
    teks(t, 696, y, done ? fm(H.n[i]) + ' ÷ ' + s.nu + ' = ' + fm(H.rasio[i]) : '?', { s:12, a:'end', c:pem ? '#FFB27A' : '#fff' });
  });
  const lim = H.lim.map(i => R.re[i].f).join(' dan ');
  teks(t, 392, 290, 'Pereaksi pembatas', { s:11.5, w:700, c:'#AEC0E0' });
  teks(t, 696, 290, done ? (H.lim.length === 2 ? 'tidak ada (habis bersamaan)' : lim) : '?', { s:14, a:'end', c:'#FFB27A' });
  const iS = H.sisa.findIndex(v => v > 1e-9);
  teks(t, 392, 314, 'Pereaksi sisa', { s:11.5, w:700, c:'#AEC0E0' });
  teks(t, 696, 314, done ? (iS >= 0 ? R.re[iS].f + ' ' + fm(H.sisa[iS]) + ' mol (' + fm(H.sisa[iS] * R.re[iS].Mr) + ' g)' : 'tidak ada') : '?', { s:12.5, a:'end', c:'#FF9A8A' });
  const pr0 = R.pr[0], teo = H.hasil[0] * pr0.Mr, nyata = teo * P.eff / 100;
  teks(t, 392, 338, 'Hasil teoritis ' + pr0.f, { s:11.5, w:700, c:'#AEC0E0' });
  teks(t, 696, 338, done ? fm(teo) + ' g (' + fm(H.hasil[0]) + ' mol)' : '?', { s:12.5, a:'end', c:'#9FE0B8' });
  teks(t, 392, 362, 'Hasil nyata (rendemen ' + P.eff + '%)', { s:11.5, w:700, c:'#AEC0E0' });
  teks(t, 696, 362, done ? fm(nyata) + ' g' : '?', { s:12.5, a:'end', c:'#FFE29A' });
  if (done && labS.mikro) teks(t, 544, 386, 'xi = min(' + H.rasio.map(x => fm(x)).join('; ') + ') = ' + fm(H.xi), { s:10, a:'middle', c:'#AEC0E0', w:700 });
  $L('lPillT').textContent = R.eq.split(' → ')[0] + ' · ' + fm(P.a) + ' + ' + fm(P.b) + ' mol';
  $L('lInfo1').textContent = done ? (H.lim.length === 2 ? 'Kedua pereaksi habis tepat (stoikiometris)' : 'Pembatas: ' + lim + ' · sisa ' + (iS >= 0 ? R.re[iS].f : '-')) : 'Atur jumlah awal lalu jalankan reaksi';
  $L('lInfo2').textContent = 'Pembatas = n ÷ koefisien terkecil';
  const st = $L('lab-status'); st.textContent = P.run ? 'Bereaksi...' : (done ? 'Pembatas: ' + (H.lim.length === 2 ? 'tidak ada' : lim) : 'Siap'); st.className = 'lab-status ' + (P.run || done ? 'on' : 'off');
}
function rxSelesai(){
  const P = labS.p, H = rxHitung();
  P.last = { rx:P.rx, a:P.a, b:P.b, lim:H.lim.slice(), stoik:H.lim.length === 2 };
  P.runs.push(P.last);
  if (!labS.misi[2] && H.lim.length === 2 && H.xi > 0) { labS.misi[2] = true; labSkor(20, '🎉 Misi 3 selesai! Kedua pereaksi habis tepat dalam campuran stoikiometris.'); }
}

/* ---------- Rumus empiris ---------- */
function labEmpPilih(id){ const E = labS.e; E.c = id; E.stage = 0; labRender(); }
function labEmpTahap(i){ const E = labS.e; E.stage = i; labCatatEmp(); labRender(); }
function labEmpNext(){ const E = labS.e; E.stage = E.stage >= 4 ? 0 : E.stage + 1; labCatatEmp(); labRender(); }
function labCatatEmp(){ const E = labS.e; if (E.stage >= 2) { E.flag[E.c] = true; E.last = E.c; } }
function empHitung(id){
  const C = EMP[id], mol = C.els.map(([s, p]) => p / AR[s]), mn = Math.min(...mol), rasio = mol.map(x => x / mn);
  let k = 1; for (let kk = 1; kk <= 5; kk++) { if (rasio.every(x => Math.abs(x * kk - Math.round(x * kk)) < 0.12)) { k = kk; break; } }
  const ints = rasio.map(x => Math.round(x * k)), Mre = C.els.reduce((a, [s], i) => a + AR[s] * ints[i], 0), n = Math.round(C.Mr / Mre);
  const fx = (arr) => C.els.map(([s], i) => s + sub(arr[i])).join('');
  return { C:C, mol:mol, rasio:rasio, k:k, ints:ints, Mre:Mre, n:n, emp:fx(ints), molf:fx(ints.map(v => v * n)) };
}
function empDraw(){
  const E = labS.e, X = empHitung(E.c), st = E.stage, g = $L('eBars'); g.innerHTML = '';
  $L('eTitle').textContent = X.C.nama + ' · ' + TAHAP[st];
  const n = X.C.els.length, xs = n === 3 ? [80, 190, 300] : [110, 270], base = 340, tinggi = 190;
  const nilai = X.C.els.map(([s, p], i) => st === 0 ? p : (st === 1 ? X.mol[i] : (st === 2 ? X.rasio[i] : X.ints[i] * (st >= 3 ? 1 : 1))));
  const maks = Math.max(...nilai);
  svEl('line', { x1:30, y1:base, x2:350, y2:base, stroke:'#AEC0E0', 'stroke-width':2 }, g);
  const warna = ['#F26A21', '#2E9BD6', '#3BA55D'];
  X.C.els.forEach(([s, p], i) => {
    const h = st === 4 ? 0 : (nilai[i] / maks) * tinggi;
    if (st < 4) {
      svEl('rect', { x:xs[i] - 28, y:base - h, width:56, height:h, rx:8, fill:warna[i], 'fill-opacity':.85, stroke:'#fff', 'stroke-width':1.5 }, g);
      const txt = st === 0 ? fm(p, 1) + ' g' : (st === 1 ? fm(X.mol[i], 2) + ' mol' : (st === 2 ? fm(X.rasio[i], 2) : (X.k > 1 && st === 3 ? fm(X.rasio[i], 2) + ' × ' + X.k + ' = ' + X.ints[i] : String(X.ints[i]))));
      teks(g, xs[i], base - h - 8, txt, { s:11.5, a:'middle' });
    }
    teks(g, xs[i], base + 22, s, { s:17, a:'middle', f:'Fraunces,Georgia,serif', c:warna[i] });
    if (st === 3) for (let k = 0; k < X.ints[i]; k++) svEl('circle', { cx:xs[i] - ((X.ints[i] - 1) * 10) + k * 20, cy:base - 120, r:8, fill:warna[i], stroke:'#fff', 'stroke-width':1.5 }, g);
  });
  if (st === 4) {
    teks(g, 190, 160, X.molf, { s:40, a:'middle', f:'Fraunces,Georgia,serif', c:'#4ADE80' });
    teks(g, 190, 196, 'rumus molekul', { s:12, a:'middle', c:'#AEC0E0' });
    teks(g, 190, 250, '(' + X.emp + ')' + (X.n > 1 ? SUPS[String(X.n)] ? '' : '' : ''), { s:20, a:'middle', f:'Fraunces,Georgia,serif', c:'#FFE29A' });
    teks(g, 190, 278, 'n = ' + X.C.Mr + ' ÷ ' + X.Mre + ' = ' + X.n, { s:13, a:'middle' });
    teks(g, 190, 306, 'rumus empiris: ' + X.emp, { s:13, a:'middle', c:'#FFB27A' });
  }
  teks(g, 190, 380, ['persen massa = gram dalam 100 g sampel', 'mol = gram ÷ Ar', 'bagi semua mol dengan yang terkecil', 'bulatkan menjadi bilangan bulat sederhana', 'rumus molekul = (rumus empiris)ₙ'][st], { s:10.5, c:'#AEC0E0', a:'middle', w:700 });
  // kartu kanan
  const r = $L('eRows'); r.innerHTML = '';
  TAHAP.forEach((t, i) => {
    const x = 398 + i * 72;
    svEl('circle', { cx:x, cy:100, r:11, fill:i <= st ? '#F26A21' : 'rgba(255,255,255,.14)', stroke:i === st ? '#fff' : 'none', 'stroke-width':2 }, r);
    teks(r, x, 104, String(i + 1), { s:11, a:'middle' });
    teks(r, x, 124, t, { s:9.5, a:'middle', c:i === st ? '#FFB27A' : '#8FA3C7' });
  });
  const baris2 = [];
  X.C.els.forEach(([s, p], i) => {
    const ar = AR[s];
    if (st === 0) baris2.push([s + ': ' + fm(p, 1) + '% → ' + fm(p, 1) + ' g (dari 100 g)', '#fff']);
    if (st === 1) baris2.push([s + ': ' + fm(p, 1) + ' ÷ ' + String(ar).replace('.', ',') + ' = ' + fm(X.mol[i], 3) + ' mol', '#fff']);
    if (st === 2) baris2.push([s + ': ' + fm(X.mol[i], 3) + ' ÷ ' + fm(Math.min(...X.mol), 3) + ' = ' + fm(X.rasio[i], 2), '#fff']);
    if (st === 3) baris2.push([s + ': ' + (X.k > 1 ? fm(X.rasio[i], 2) + ' × ' + X.k + ' ≈ ' : '≈ ') + X.ints[i], '#fff']);
  });
  if (st <= 3) baris2.forEach(([tx, c], i) => teks(r, 392, 160 + i * 28, tx, { s:12.5, c:c }));
  if (st === 2 && X.k > 1) teks(r, 392, 160 + X.C.els.length * 28 + 6, 'Ada hasil bagi berbentuk pecahan (misalnya 1,5): kalikan ' + X.k, { s:11, c:'#FFB27A' });
  if (st === 3) { teks(r, 392, 160 + X.C.els.length * 28 + 6, 'Rumus empiris:', { s:12, c:'#AEC0E0' }); teks(r, 696, 160 + X.C.els.length * 28 + 6, X.emp, { s:20, a:'end', c:'#4ADE80', f:'Fraunces,Georgia,serif' }); }
  if (st === 4) {
    teks(r, 392, 160, 'Rumus empiris: ' + X.emp, { s:12.5 });
    teks(r, 392, 188, 'Mr rumus empiris = ' + X.C.els.map(([s], i) => AR[s] + ' × ' + X.ints[i]).join(' + ') + ' = ' + X.Mre, { s:11, c:'#fff' });
    teks(r, 392, 216, 'Mr senyawa (diketahui) = ' + X.C.Mr, { s:12.5 });
    teks(r, 392, 244, 'n = ' + X.C.Mr + ' ÷ ' + X.Mre + ' = ' + X.n, { s:12.5, c:'#FFE29A' });
    teks(r, 392, 276, 'Rumus molekul: ' + X.molf, { s:17, c:'#4ADE80', f:'Fraunces,Georgia,serif' });
  }
  $L('lPillT').textContent = X.C.nama + ' · tahap ' + (st + 1) + ' dari 5';
  $L('lInfo1').textContent = st >= 3 ? 'Rumus empiris: ' + X.emp : 'Ikuti kelima tahap perhitungan';
  $L('lInfo2').textContent = st >= 4 ? 'Rumus molekul: ' + X.molf : ' ';
  const s2 = $L('lab-status'); s2.textContent = 'Tahap ' + (st + 1) + ': ' + TAHAP[st]; s2.className = 'lab-status on';
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
  if (labS.mikro) labToast('🔬 Substitusi angka pada rumus ditampilkan.');
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
  if (labS.mode === 'm') {
    const M = labS.m;
    const g1 = labSec('🧪 Zat', '', 'rx-grid cols4');
    ZM_IDS.forEach(id => labChip(g1, ZM[id].f, '', M.zat === id, () => labMolPilih(id)));
    const g2 = labSec('⚖️ Jumlah mol', 'mol', 'rx-grid cols4');
    N_MOL.forEach(v => labChip(g2, fm(v), '', Math.abs(M.n - v) < 1e-9, () => labMolN(v)));
    const g3 = labSec('🧂 Atau massa', 'gram', 'rx-grid cols4');
    N_MASSA.forEach(v => labChip(g3, String(v), 'g', Math.abs(M.n - v / ZM[M.zat].Mr) < 1e-9, () => labMolMassa(v)));
    rb.style.display = 'none';
  } else if (labS.mode === 'p') {
    const P = labS.p, R = RX[P.rx];
    const g1 = labSec('⚗️ Reaksi', '', 'rx-grid cols3');
    RX_IDS.forEach(id => labChip(g1, RX[id].eq.split(' → ')[0], '', P.rx === id, () => labRxPilih(id)));
    const gu = labSec('📏 Satuan jumlah awal', '', 'rx-grid cols2');
    labChip(gu, 'mol', '', P.unit === 'mol', () => labRxSet('unit', 'mol'));
    labChip(gu, 'gram', '', P.unit === 'gram', () => labRxSet('unit', 'gram'));
    ['a', 'b'].forEach((k, i) => {
      const s = R.re[i], g = labSec(s.f + ' (' + (i ? 'kedua' : 'pertama') + ')', P.unit === 'mol' ? 'mol' : 'gram (Mr = ' + String(s.Mr).replace('.', ',') + ')', 'rx-grid cols7');
      N_AWAL.forEach(v => labChip(g, P.unit === 'mol' ? fm(v) : fm(v * s.Mr, 1), '', Math.abs(P[k] - v) < 1e-9, () => labRxSet(k, v)));
    });
    const ge = labSec('📉 Rendemen', '%', 'rx-grid cols3');
    EFF.forEach(v => labChip(ge, v + '%', '', P.eff === v, () => labRxSet('eff', v)));
    rb.style.display = ''; rb.disabled = P.run; rb.textContent = P.run ? '⏳ Bereaksi...' : '▶ Jalankan reaksi';
  } else {
    const E = labS.e;
    const g1 = labSec('🧪 Senyawa', '', 'rx-grid cols3');
    E_IDS.forEach(id => labChip(g1, EMP[id].nama.replace('Senyawa ', ''), 'Senyawa', E.c === id, () => labEmpPilih(id)));
    const g2 = labSec('🪜 Tahap', '', 'rx-grid cols5');
    TAHAP.forEach((t, i) => labChip(g2, String(i + 1), t, E.stage === i, () => labEmpTahap(i)));
    rb.style.display = ''; rb.disabled = false; rb.textContent = E.stage >= 4 ? '↺ Ulangi dari tahap 1' : '▶ Tahap berikutnya';
  }
}
function labRender(){
  const m = labS.mode;
  $L('scM').style.display = m === 'm' ? '' : 'none';
  $L('scP').style.display = m === 'p' ? '' : 'none';
  $L('scE').style.display = m === 'e' ? '' : 'none';
  if (m === 'm' && !labS.m.views.includes(labS.m.zat)) labS.m.views.push(labS.m.zat);
  labRenderPanel();
  labDrawMode();
  labIsiData(); labRenderMisi();
}
function labDrawMode(){ const m = labS.mode; if (m === 'm') molDraw(); else if (m === 'p') rxDraw(); else empDraw(); labS.dirty = false; }
function labJalankan(){ if (labS.mode === 'p') labRxJalan(); else if (labS.mode === 'e') labEmpNext(); }

setInterval(() => {
  if (!labAktif()) return;
  const P = labS.p;
  if (P.run) {
    P.t += 0.04;
    if (P.t >= T_RX) { P.t = T_RX; P.run = false; rxSelesai(); labRenderPanel(); labIsiData(); labRenderMisi(); }
    if (labS.mode === 'p') rxDraw();
  }
}, 40);

/* ---------- Tab Data ---------- */
function labIsiData(){
  const info = $L('d-info'), hit = $L('d-hitung'), it = $L('d-info-t'), ht = $L('d-hitung-t'), am = $L('d-amati');
  const a = [];
  if (labS.mode === 'm') {
    const M = labS.m, Z = ZM[M.zat], n = M.n;
    it.textContent = '🧪 Zat'; ht.textContent = '🧮 Perhitungan';
    info.innerHTML = '<div class="hasil-baris">' + Z.f + ' (' + Z.nama + ')<br>Mr = ' + Z.hit + ' = <b>' + String(Z.Mr).replace('.', ',') + '</b></div>';
    hit.innerHTML = '<div class="hasil-baris">n = <b>' + fm(n) + ' mol</b><br>Massa = ' + fm(n) + ' × ' + Z.Mr + ' = <b>' + fm(n * Z.Mr) + ' g</b><br>Partikel = ' + fm(n) + ' × 6,02×10²³ = <b>' + sci(n * NA) + '</b><br>Volume (STP) = ' + (Z.gas ? fm(n) + ' × 22,4 = <b>' + fm(n * VM) + ' L</b>' : 'tidak berlaku (bukan gas)') + '</div>';
    a.push('Mol menghubungkan massa, jumlah partikel, dan volume gas.');
    a.push('Massa 1 mol zat (g) sama dengan angka Mr-nya.');
  } else if (labS.mode === 'p') {
    const P = labS.p, H = rxHitung(), R = H.R, done = P.started && !P.run;
    it.textContent = '🧪 Reaksi'; ht.textContent = '🧮 Hasil';
    info.innerHTML = '<div class="hasil-baris">' + R.eq + '<br>Mula-mula: ' + R.re[0].f + ' ' + fm(P.a) + ' mol (' + fm(P.a * R.re[0].Mr) + ' g); ' + R.re[1].f + ' ' + fm(P.b) + ' mol (' + fm(P.b * R.re[1].Mr) + ' g)</div>';
    hit.innerHTML = done ? '<div class="hasil-baris">n ÷ koefisien: ' + R.re.map((s, i) => s.f + ' = ' + fm(H.rasio[i])).join(' · ') + '<br>Pembatas: <b>' + (H.lim.length === 2 ? 'tidak ada (stoikiometris)' : R.re[H.lim[0]].f) + '</b><br>' + R.pr.map((s, i) => s.f + ' = ' + fm(H.hasil[i]) + ' mol (' + fm(H.hasil[i] * s.Mr) + ' g)').join('<br>') + '</div><div class="lab-note">Rendemen ' + labS.p.eff + '%: hasil nyata ' + R.pr[0].f + ' = ' + fm(H.hasil[0] * R.pr[0].Mr * P.eff / 100) + ' g.</div>' : '<div class="lab-note">Jalankan reaksi untuk melihat hasil.</div>';
    a.push('Pereaksi pembatas habis lebih dahulu dan menentukan jumlah produk.');
    a.push('Pereaksi yang tersisa disebut pereaksi berlebih.');
  } else {
    const X = empHitung(labS.e.c), st = labS.e.stage;
    it.textContent = '🧪 Senyawa'; ht.textContent = '🧮 Perhitungan';
    info.innerHTML = '<div class="hasil-baris">' + X.C.nama + ': ' + X.C.els.map(([s, p]) => s + ' ' + fm(p, 1) + '%').join(', ') + '<br>Mr senyawa = ' + X.C.Mr + '</div>';
    hit.innerHTML = '<div class="hasil-baris">Mol: ' + X.C.els.map(([s], i) => s + ' ' + fm(X.mol[i], 3)).join(' · ') + '<br>' + (st >= 2 ? 'Perbandingan: ' + X.C.els.map(([s], i) => s + ' ' + fm(X.rasio[i], 2)).join(' : ') + '<br>' : '') + (st >= 3 ? 'Rumus empiris: <b>' + X.emp + '</b><br>' : '') + (st >= 4 ? 'Rumus molekul: <b>' + X.molf + '</b>' : '') + '</div>';
    a.push('Rumus empiris adalah perbandingan atom paling sederhana.');
    a.push('Rumus molekul = (rumus empiris)ₙ dengan n = Mr senyawa ÷ Mr empiris.');
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
function uniq(arr){ return [...new Set(arr)]; }
function labRenderMisi(){
  ['st-m1','st-m2','st-m3','st-m4','st-m5'].forEach((id, i) => {
    const el = $L(id); if (el) el.textContent = labS.misi[i] ? '✅ Selesai (+20)' : '⬜ Belum selesai';
    const card = $L('misi-' + (i + 1)); if (card) card.classList.toggle('done', labS.misi[i]);
  });
  const M = labS.m;
  // M1: mol dari massa
  const ok1 = M.views.length >= 2;
  if (ok1 && !labS.m1opt) {
    const id = M.views[M.views.length - 1], Z = ZM[id], k = [2, 3, 5, 0.5][M.views.length % 4], m = k * Z.Mr;
    const salah = uniq([fm(m * Z.Mr), fm(m), fm(Z.Mr / m), fm(k * 2)]).filter(x => x !== fm(k)).slice(0, 3);
    labS.m1opt = labAcak([{ t:fm(k) + ' mol', b:true }].concat(salah.map(t => ({ t:t + ' mol', b:false }))));
    labS.m1key = id + '|' + k; labS.m1tanya = 'Berapa mol yang terdapat dalam ' + fm(m) + ' g ' + Z.f + ' (Mr = ' + String(Z.Mr).replace('.', ',') + ')?';
  }
  labKuis('m1-quiz', labS.misi[0], 'n = massa ÷ Mr.', ok1, 'Amati minimal dua zat pada Konsep Mol.', labS.m1tanya || '', labS.m1opt || [], 'labJawabM1', 'm1', 'm1');
  // M2: jumlah partikel
  const ok2 = M.changes >= 3;
  if (ok2 && !labS.m2opt) {
    const n = [0.5, 2, 0.1, 3][M.changes % 4], benar = sci(n * NA);
    const salah = uniq([sci(n * NA / 10), sci(n * NA * 10), sci(n * NA * 2), sci(n * NA / 2)]).filter(x => x !== benar).slice(0, 3);
    labS.m2opt = labAcak([{ t:benar, b:true }].concat(salah.map(t => ({ t, b:false }))));
    labS.m2tanya = 'Berapa jumlah partikel pada ' + fm(n) + ' mol suatu zat?';
  }
  labKuis('m2-quiz', labS.misi[1], 'Partikel = n × 6,02×10²³.', ok2, 'Ubah jumlah mol minimal 3 kali.', labS.m2tanya || '', labS.m2opt || [], 'labJawabM2', 'm2', 'm2');
  // M4: pereaksi pembatas pada reaksi terakhir
  const P = labS.p, L = P.last;
  if (P.runs.length >= 2 && L) {
    const key = L.rx + '|' + L.a + '|' + L.b + '|' + P.runs.length;
    if (labS.m4key !== key) {
      labS.m4key = key; const R = RX[L.rx];
      const benar = L.stoik ? 'tidak ada, kedua pereaksi habis bersamaan' : R.re[L.lim[0]].f;
      const kand = [R.re[0].f, R.re[1].f, 'tidak ada, kedua pereaksi habis bersamaan', 'tidak dapat ditentukan'].filter(x => x !== benar);
      labS.m4opt = labAcak([{ t:benar, b:true }].concat(labAcak(kand).slice(0, 3).map(t => ({ t, b:false }))));
      labS.m4tanya = 'Reaksi ' + R.eq + ' dijalankan dengan ' + fm(L.a) + ' mol ' + R.re[0].f + ' dan ' + fm(L.b) + ' mol ' + R.re[1].f + '. Pereaksi pembatasnya adalah ...';
    }
  }
  labS.m4kuis = labKuis('m4-quiz', labS.misi[3], 'Pembatas = n ÷ koefisien terkecil.', P.runs.length >= 2 && !!L, 'Jalankan dua reaksi dengan jumlah awal berbeda.', labS.m4tanya || '', labS.m4opt || [], 'labJawabM4', labS.m4key, labS.m4kuis);
  // M5: rumus empiris
  const E = labS.e, ok5 = !!E.last;
  if (ok5 && labS.m5key !== E.last) {
    labS.m5key = E.last; const X = empHitung(E.last), C = X.C;
    const benar = X.emp, salah = [];
    const alt = [C.els.map(([s], i) => s + sub(X.rasio[i] > 1.2 ? Math.round(X.rasio[i] * 2) : 1)).join(''), C.els.map(([s], i) => s + sub(X.ints[C.els.length - 1 - i])).join(''), C.els.map(([s], i) => s + sub(X.ints[i] * 2)).join(''), C.els.map(([s]) => s).join(''), C.els.map(([s], i) => s + sub(Math.max(1, X.ints[i] + 1))).join('')];
    uniq(alt).filter(x => x !== benar).forEach(x => { if (salah.length < 3) salah.push(x); });
    labS.m5opt = labAcak([{ t:benar, b:true }].concat(salah.map(t => ({ t, b:false }))));
    labS.m5tanya = X.C.nama + ' mengandung ' + C.els.map(([s, p]) => s + ' ' + fm(p, 1) + '%').join(', ') + '. Rumus empirisnya adalah ...';
  }
  labS.m5kuis = labKuis('m5-quiz', labS.misi[4], 'Rumus empiris dari perbandingan mol atom.', ok5, 'Ikuti tahap sampai tahap 3 (Bagi).', labS.m5tanya || '', labS.m5opt || [], 'labJawabM5', labS.m5key, labS.m5kuis);
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
function labJawabM1(i){ labJawab('m1-quiz', labS.m1opt, i, 'm1-fb', 'Tepat! n = massa ÷ Mr.', 'Belum tepat. Gunakan n = massa ÷ Mr.', 0, '🎉 Misi 1 selesai! Kamu mengubah massa menjadi mol.'); }
function labJawabM2(i){ labJawab('m2-quiz', labS.m2opt, i, 'm2-fb', 'Benar! Jumlah partikel = n × 6,02×10²³.', 'Belum tepat. Kalikan mol dengan bilangan Avogadro.', 1, '🎉 Misi 2 selesai! Kamu menghitung jumlah partikel.'); }
function labJawabM4(i){ labJawab('m4-quiz', labS.m4opt, i, 'm4-fb', 'Tepat! Pembatas adalah n ÷ koefisien yang terkecil.', 'Belum tepat. Hitung n ÷ koefisien untuk tiap pereaksi lalu bandingkan.', 3, '🎉 Misi 4 selesai! Kamu menentukan pereaksi pembatas.'); }
function labJawabM5(i){ labJawab('m5-quiz', labS.m5opt, i, 'm5-fb', 'Benar! Bagi mol dengan yang terkecil lalu bulatkan.', 'Belum tepat. Ubah persen ke mol dulu, lalu bagi dengan mol terkecil.', 4, '🎉 Misi 5 selesai! Kamu menentukan rumus empiris.'); }

/* ---------- LKPD, reset, toast, selesai ---------- */
function labCatat(){
  labS.catatNo++;
  const item = document.createElement('div'); item.className = 'lab-log-item';
  let isi = '';
  if (labS.mode === 'm') { const M = labS.m, Z = ZM[M.zat]; isi = '<b>Konsep mol</b> · ' + Z.f + ' (Mr ' + String(Z.Mr).replace('.', ',') + ')<br>n = ' + fm(M.n) + ' mol · ' + fm(M.n * Z.Mr) + ' g · ' + sci(M.n * NA) + ' partikel'; }
  else if (labS.mode === 'p') { const P = labS.p, H = rxHitung(); isi = '<b>Pembatas</b> · ' + RX[P.rx].eq + '<br>' + fm(P.a) + ' mol + ' + fm(P.b) + ' mol → pembatas: ' + (H.lim.length === 2 ? 'tidak ada' : H.R.re[H.lim[0]].f) + ' · ' + H.R.pr[0].f + ' ' + fm(H.hasil[0]) + ' mol'; }
  else { const X = empHitung(labS.e.c); isi = '<b>Rumus empiris</b> · ' + X.C.nama + '<br>' + X.emp + ' → rumus molekul ' + X.molf; }
  item.innerHTML = '<b>No. ' + labS.catatNo + '</b> · ' + isi;
  const log = $L('lab-log'); log.insertBefore(item, log.firstChild);
  while (log.children.length > 10) log.removeChild(log.lastChild);
  labToast('📓 Pengamatan berhasil dicatat ke LKPD!');
}
function labReset(){
  labS.mode = 'm';
  labS.m = { zat:'h2o', n:1, views:[], changes:0, m1:null, m2:null };
  labS.p = { rx:'r1', a:4, b:3, unit:'mol', eff:100, t:0, run:false, started:false, runs:[], last:null };
  labS.e = { c:'a', stage:0, flag:{}, last:null };
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
  else if (s >= 60) kal = 'Bagus! Terus berlatih berhitung dengan mol.';
  else kal = 'Ayo selesaikan semua misi untuk meraih skor penuh!';
  $L('lab-akhir-kal').textContent = kal;
  openModal('modal-lab'); sfx('win');
}

(function labInit(){
  if (!$L('scr-lab')) return;
  labRender(); labUpdateMisiCount();
})();
