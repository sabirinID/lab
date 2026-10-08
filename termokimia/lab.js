/* ##############################################################
   #  LAB MAYA — PRAKTIKUM VIRTUAL TERMOKIMIA                   #
   #  Tiga eksperimen: kalorimeter, Hukum Hess, energi ikatan.  #
   ############################################################## */
const LAB_NS = 'http://www.w3.org/2000/svg';
const $L = id => document.getElementById(id);

const C_AIR = 4.18;     // J g⁻¹ °C⁻¹
const T0 = 25.0;        // suhu awal (°C)
const M_AIR = 100;      // g air pada kalorimeter
const LAJU = 1.5;       // percepatan waktu kalorimeter
const DUR_KAL = 16;

/* ---------- Data ---------- */
const LAB_KAL = {
  netral: { id:'netral', nama:'Netralisasi', sub:'HCl + NaOH',  eq:'HCl(aq) + NaOH(aq) → NaCl(aq) + H₂O(l)', dH:-57.1, Mr:0,    kat:'Na⁺',  an:'Cl⁻',  padat:false },
  naoh:   { id:'naoh',   nama:'NaOH',        sub:'pelarutan',   eq:'NaOH(s) → Na⁺(aq) + OH⁻(aq)',            dH:-44.5, Mr:40,   kat:'Na⁺',  an:'OH⁻',  padat:true },
  cacl2:  { id:'cacl2',  nama:'CaCl₂',       sub:'pelarutan',   eq:'CaCl₂(s) → Ca²⁺(aq) + 2Cl⁻(aq)',         dH:-82.8, Mr:111,  kat:'Ca²⁺', an:'Cl⁻',  padat:true },
  nh4cl:  { id:'nh4cl',  nama:'NH₄Cl',       sub:'pelarutan',   eq:'NH₄Cl(s) → NH₄⁺(aq) + Cl⁻(aq)',          dH:14.8,  Mr:53.5, kat:'NH₄⁺', an:'Cl⁻',  padat:true },
  kno3:   { id:'kno3',   nama:'KNO₃',        sub:'pelarutan',   eq:'KNO₃(s) → K⁺(aq) + NO₃⁻(aq)',            dH:34.9,  Mr:101,  kat:'K⁺',   an:'NO₃⁻', padat:true }
};
const LAB_N = [0.025, 0.05, 0.10];

const LAB_HESS = {
  c: { id:'c', nama:'C → CO₂', sub:'karbon', target:'C(s) + O₂(g) → CO₂(g)', dir:-393.5,
       step:[{ eq:'C(s) + ½O₂(g) → CO(g)', dH:-110.5 }, { eq:'CO(g) + ½O₂(g) → CO₂(g)', dH:-283.0 }],
       lv:['C + O₂', 'CO + ½O₂', 'CO₂'] },
  s: { id:'s', nama:'S → SO₃', sub:'belerang', target:'S(s) + 3/2 O₂(g) → SO₃(g)', dir:-395.7,
       step:[{ eq:'S(s) + O₂(g) → SO₂(g)', dH:-296.8 }, { eq:'SO₂(g) + ½O₂(g) → SO₃(g)', dH:-98.9 }],
       lv:['S + 3/2 O₂', 'SO₂ + ½O₂', 'SO₃'] },
  n: { id:'n', nama:'N₂ → 2NO₂', sub:'nitrogen', target:'N₂(g) + 2O₂(g) → 2NO₂(g)', dir:66.4,
       step:[{ eq:'N₂(g) + O₂(g) → 2NO(g)', dH:180.6 }, { eq:'2NO(g) + O₂(g) → 2NO₂(g)', dH:-114.2 }],
       lv:['N₂ + 2O₂', '2NO + O₂', '2NO₂'] }
};

const LAB_IKAT = {
  hcl: { id:'hcl', nama:'H₂ + Cl₂', sub:'→ 2HCl', eq:'H₂ + Cl₂ → 2HCl', re:['H2','Cl2'], pr:['HCl','HCl'],
         putus:[{ b:'H–H', e:436, n:1 }, { b:'Cl–Cl', e:242, n:1 }], bentuk:[{ b:'H–Cl', e:431, n:2 }] },
  ch4: { id:'ch4', nama:'CH₄ + O₂', sub:'pembakaran', eq:'CH₄ + 2O₂ → CO₂ + 2H₂O', re:['CH4','O2','O2'], pr:['CO2','H2O','H2O'],
         putus:[{ b:'C–H', e:413, n:4 }, { b:'O=O', e:498, n:2 }], bentuk:[{ b:'C=O', e:799, n:2 }, { b:'O–H', e:463, n:4 }] },
  nh3: { id:'nh3', nama:'N₂ + H₂', sub:'→ 2NH₃', eq:'N₂ + 3H₂ → 2NH₃', re:['N2','H2','H2','H2'], pr:['NH3','NH3'],
         putus:[{ b:'N≡N', e:945, n:1 }, { b:'H–H', e:436, n:3 }], bentuk:[{ b:'N–H', e:391, n:6 }] },
  no:  { id:'no',  nama:'N₂ + O₂', sub:'→ 2NO', eq:'N₂ + O₂ → 2NO', re:['N2','O2'], pr:['NO','NO'],
         putus:[{ b:'N≡N', e:945, n:1 }, { b:'O=O', e:498, n:1 }], bentuk:[{ b:'N=O', e:631, n:2 }] }
};
const MOL = {
  H2:  { a:[['H',-13,0],['H',13,0]], k:[[0,1,1,'H–H']] },
  Cl2: { a:[['Cl',-16,0],['Cl',16,0]], k:[[0,1,1,'Cl–Cl']] },
  HCl: { a:[['H',-14,0],['Cl',12,0]], k:[[0,1,1,'H–Cl']] },
  CH4: { a:[['C',0,0],['H',-19,-17],['H',19,-17],['H',-19,17],['H',19,17]], k:[[0,1,1,'C–H'],[0,2,1,'C–H'],[0,3,1,'C–H'],[0,4,1,'C–H']] },
  O2:  { a:[['O',-13,0],['O',13,0]], k:[[0,1,2,'O=O']] },
  CO2: { a:[['O',-36,0],['C',0,0],['O',36,0]], k:[[0,1,2,'C=O'],[1,2,2,'C=O']] },
  H2O: { a:[['O',0,-7],['H',-18,13],['H',18,13]], k:[[0,1,1,'O–H'],[0,2,1,'O–H']] },
  N2:  { a:[['N',-13,0],['N',13,0]], k:[[0,1,3,'N≡N']] },
  NH3: { a:[['N',0,-9],['H',-19,13],['H',0,19],['H',19,13]], k:[[0,1,1,'N–H'],[0,2,1,'N–H'],[0,3,1,'N–H']] },
  NO:  { a:[['N',-13,0],['O',13,0]], k:[[0,1,2,'N=O']] }
};
const ATOM_WARNA = { H:'#D5DEEC', C:'#58636F', O:'#E04B4B', N:'#3B8CFF', Cl:'#1E8E5A' };
const LAB_MODE = [
  { id:'kal',  nama:'Kalorimeter',   sub:'ukur ΔT',      kerja:'Mulai reaksi' },
  { id:'hess', nama:'Hukum Hess',    sub:'jalur reaksi', kerja:'Tampilkan jalur' },
  { id:'ikat', nama:'Energi ikatan', sub:'putus dan bentuk', kerja:'Hitung energi ikatan' }
];

const labS = {
  mode:'kal', rx:{ kal:'naoh', hess:'c', ikat:'hcl' }, n:0.05, jalur:'langsung',
  ts:0, running:false, runJalur:null,
  done:{ kal:false, hess:false, ikat:false },
  hs:{ dir:0, step:0 }, hessDone:{ c:{ langsung:false, bertahap:false }, s:{ langsung:false, bertahap:false }, n:{ langsung:false, bertahap:false } },
  kalLast:null, bondLast:null,
  mikro:false, visKey:'', catatNo:0,
  misi:[false,false,false,false,false], skor:0, m3opt:null, m3key:'', m5opt:null, m5key:''
};

/* ---------- Utilitas ---------- */
function svEl(tag, attrs, parent){
  const e = document.createElementNS(LAB_NS, tag);
  for (const k in attrs) e.setAttribute(k, attrs[k]);
  if (parent) parent.appendChild(e);
  return e;
}
function labNum(v, d){ return Number(v).toFixed(d).replace('.', ','); }
function labTanda(v, d){ return (v > 0 ? '+' : (v < 0 ? '−' : '')) + labNum(Math.abs(v), d); }
function labKlem(v, a, b){ return Math.max(a, Math.min(b, v)); }
function labRibu(v){ return Math.round(v).toLocaleString('id-ID'); }
function labRng(seed){ let s = seed >>> 0; return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; }; }
function labTitik(n, x0, x1, y0, y1, seed, gap){
  let g = gap, pts = [];
  for (let a = 0; a < 8; a++) {
    const r = labRng(seed + a * 101); pts = []; let t = 0;
    while (pts.length < n && t < 4000) { t++; const x = x0 + r() * (x1 - x0), y = y0 + r() * (y1 - y0); if (pts.every(p => (p[0] - x) ** 2 + (p[1] - y) ** 2 > g * g)) pts.push([x, y]); }
    if (pts.length >= n) break;
    g = Math.max(6, g - 2);
  }
  while (pts.length < n) pts.push([x0 + Math.random() * (x1 - x0), y0 + Math.random() * (y1 - y0)]);
  return pts;
}
function labAcak(arr){ for (let i = arr.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [arr[i], arr[j]] = [arr[j], arr[i]]; } return arr; }
function labPanah(line, head, x1, y1, x2, y2){
  line.setAttribute('x1', x1); line.setAttribute('y1', y1); line.setAttribute('x2', x2); line.setAttribute('y2', y2);
  const dx = x2 - x1, dy = y2 - y1, L = Math.hypot(dx, dy) || 1, ux = dx / L, uy = dy / L, s = 11;
  const bx = x2 - ux * s, by = y2 - uy * s;
  head.setAttribute('points', x2 + ',' + y2 + ' ' + (bx - uy * s * .5) + ',' + (by + ux * s * .5) + ' ' + (bx + uy * s * .5) + ',' + (by - ux * s * .5));
  head.style.display = L < 6 ? 'none' : '';
}

/* ---------- Perhitungan ---------- */
function labKal(){
  const R = LAB_KAL[labS.rx.kal], n = labS.n;
  const g = n * R.Mr, m = M_AIR + g;
  const dT = -n * R.dH * 1000 / (m * C_AIR);
  const q = m * C_AIR * dT / 1000;
  return { R, n, g, m, dT, T1:T0 + dT, q, dH:-q / n, eks: dT > 0 };
}
function labHess(){
  const H = LAB_HESS[labS.rx.hess];
  return { H, sum:H.step[0].dH + H.step[1].dH };
}
function labIkat(){
  const B = LAB_IKAT[labS.rx.ikat];
  const A = B.putus.reduce((s, x) => s + x.e * x.n, 0), F = B.bentuk.reduce((s, x) => s + x.e * x.n, 0);
  return { B, A, F, dH:A - F };
}
function labDurasi(){
  if (labS.mode === 'kal') return DUR_KAL;
  if (labS.mode === 'hess') return labS.runJalur === 'bertahap' ? 5.2 : 2.6;
  return 5.4;
}

/* ---------- Navigasi ---------- */
function startLabMaya(){ showScreen('scr-lab'); labRender(); }
function labTab(nama){
  document.querySelectorAll('.lab-tab').forEach(t => t.classList.toggle('active', t.dataset.tab === nama));
  ['rakit','data','misi'].forEach(n => { $L('tab-' + n).style.display = (n === nama) ? 'flex' : 'none'; });
}
function labToggleMikro(){
  labS.mikro = !labS.mikro;
  $L('lab-stage').classList.toggle('mikro', labS.mikro);
  const b = $L('lab-mode');
  b.classList.toggle('on', labS.mikro);
  b.setAttribute('aria-pressed', String(labS.mikro));
  b.textContent = '🔬 Mode Partikel: ' + (labS.mikro ? 'hidup' : 'mati');
  if (labS.mikro) labToast('🔬 Label partikel ditampilkan: ion dan energi ikatan.');
}
function labResetRun(){ labS.ts = 0; labS.running = false; labS.runJalur = null; }
function labPilih(fn){ fn(); labResetRun(); labS.visKey = ''; labRender(); }

/* ---------- Panel ---------- */
function labChip(wadah, teks, sub, aktif, onclick){
  const b = document.createElement('button');
  b.className = 'el-chip' + (aktif ? ' aktif' : '');
  b.setAttribute('data-sfx', '');
  b.innerHTML = teks + (sub ? '<small>' + sub + '</small>' : '');
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
function labRenderPanel(){
  const gm = $L('grid-mode'); gm.innerHTML = '';
  LAB_MODE.forEach(m => labChip(gm, m.nama, m.sub, labS.mode === m.id, () => labPilih(() => { labS.mode = m.id; })));
  const dyn = $L('rakit-dyn'); dyn.innerHTML = '';
  if (labS.mode === 'kal') {
    const g1 = labSec('🧪 Reaksi', 'dalam 100 g air', 'rx-grid');
    Object.values(LAB_KAL).forEach(r => labChip(g1, r.nama, r.sub, labS.rx.kal === r.id, () => labPilih(() => { labS.rx.kal = r.id; })));
    const g2 = labSec('⚖️ Jumlah zat', 'mol', 'rx-grid');
    LAB_N.forEach(n => {
      const R = LAB_KAL[labS.rx.kal];
      labChip(g2, labNum(n, n === 0.10 ? 2 : (n === 0.05 ? 2 : 3)) + ' mol', R.padat ? labNum(n * R.Mr, 1) + ' g' : 'tiap larutan', labS.n === n, () => labPilih(() => { labS.n = n; }));
    });
  } else if (labS.mode === 'hess') {
    const g1 = labSec('🧪 Reaksi yang dicari ΔH-nya', '', 'rx-grid');
    Object.values(LAB_HESS).forEach(r => labChip(g1, r.nama, r.sub, labS.rx.hess === r.id, () => labPilih(() => { labS.rx.hess = r.id; labS.hs = { dir:0, step:0 }; })));
    const g2 = labSec('🛤️ Jalur', 'tampilkan keduanya', 'rx-grid cols2');
    labChip(g2, 'Langsung', '1 tahap', labS.jalur === 'langsung', () => { labS.jalur = 'langsung'; labRenderPanel(); });
    labChip(g2, 'Bertahap', '2 tahap', labS.jalur === 'bertahap', () => { labS.jalur = 'bertahap'; labRenderPanel(); });
  } else {
    const g1 = labSec('🧪 Reaksi', '', 'rx-grid empat');
    Object.values(LAB_IKAT).forEach(r => labChip(g1, r.nama, r.sub, labS.rx.ikat === r.id, () => labPilih(() => { labS.rx.ikat = r.id; })));
  }
  const mode = LAB_MODE.find(m => m.id === labS.mode);
  const rb = $L('run-btn');
  rb.disabled = labS.running;
  const selesai = (labS.mode === 'hess') ? labS.hessDone[labS.rx.hess][labS.jalur] : (labS.done[labS.mode] && labS.ts > 0);
  rb.textContent = labS.running ? '⏳ Berjalan...' : (selesai ? '↻ Ulangi: ' + mode.kerja : '▶ ' + mode.kerja);
}

/* ---------- Pembangunan visual ---------- */
function labBangunKal(K){
  const solid = $L('kSolid'); solid.innerHTML = '';
  const ion = $L('kIon'); ion.innerHTML = '';
  const N = Math.round(K.n / 0.025 * 2);
  if (K.R.padat) {
    labTitik(N * 2, 134, 266, 388, 410, 5, 11).forEach((p, i) => {
      svEl('rect', { x:p[0] - 4, y:p[1] - 4, width:8, height:8, rx:1.5, fill:'#fff', 'fill-opacity':.92, transform:'rotate(' + (i * 29 % 50) + ' ' + p[0] + ' ' + p[1] + ')' }, solid);
    });
  }
  const pts = labTitik(N * 2, 134, 266, 318, 404, 9, 15);
  pts.forEach((p, i) => {
    const o = svEl('g', { transform: 'translate(' + p[0].toFixed(1) + ',' + p[1].toFixed(1) + ')' }, ion);
    const f = svEl('g', { class:'ion-g', style:'animation-delay:' + ((i * .37) % 4).toFixed(2) + 's;animation-duration:' + (3 + (i % 3) * .5) + 's' }, o);
    if (i % 2 === 0) svEl('circle', { r:5.2, fill:'#FFA566', stroke:'#fff', 'stroke-width':1 }, f);
    else svEl('rect', { x:-4, y:-4, width:8, height:8, rx:2, fill:'#8EC1FF', stroke:'#fff', 'stroke-width':1 }, f);
    if (i < 2) { const t = svEl('text', { class:'lbl', y:-9, 'text-anchor':'middle' }, f); t.textContent = i === 0 ? K.R.kat : K.R.an; }
  });
  $L('kEq').textContent = K.R.eq;
  $L('kInfo').textContent = 'm larutan = ' + labNum(K.m, 1) + ' g · n = ' + labNum(K.n, K.n === 0.025 ? 3 : 2) + ' mol · c = 4,18 J/g°C';
  $L('lab-svg').style.setProperty('--solK', 'rgba(120,175,255,.42)');
}

function labGambarMol(grup, daftar, y, cx, skala){
  // menghitung lebar tiap molekul
  const lebar = k => { const M = MOL[k]; const xs = M.a.map(a => a[1]); return (Math.max(...xs) - Math.min(...xs) + 34) * skala; };
  const GAP = 26, PANAH = 56;
  const reW = daftar.re.map(lebar), prW = daftar.pr.map(lebar);
  const tot = reW.reduce((a, b) => a + b, 0) + (reW.length - 1) * GAP + PANAH + prW.reduce((a, b) => a + b, 0) + (prW.length - 1) * GAP;
  let x = cx - tot / 2;
  const els = { re:[], pr:[] };
  const gambar = (k, w, tipe) => {
    const M = MOL[k], mx = x + w / 2;
    const g = svEl('g', { transform: 'translate(' + mx.toFixed(1) + ',' + y + ') scale(' + skala + ')' }, grup);
    M.k.forEach(bd => {
      const a = M.a[bd[0]], b = M.a[bd[1]];
      const n = bd[2], dx = b[1] - a[1], dy = b[2] - a[2], L = Math.hypot(dx, dy), nx = -dy / L, ny = dx / L;
      for (let i = 0; i < n; i++) {
        const off = (i - (n - 1) / 2) * 4;
        const ln = svEl('line', { x1:a[1] + nx * off, y1:a[2] + ny * off, x2:b[1] + nx * off, y2:b[2] + ny * off, stroke:'#AEC0E0', 'stroke-width':3, 'stroke-linecap':'round' }, g);
        els[tipe].push(ln);
      }
    });
    M.a.forEach(a => {
      const r = a[0] === 'H' ? 9 : 12.5;
      svEl('circle', { cx:a[1], cy:a[2], r:r, fill:ATOM_WARNA[a[0]], stroke:'#fff', 'stroke-width':1.6 }, g);
      const t = svEl('text', { x:a[1], y:a[2] + 4, 'text-anchor':'middle', 'font-size':a[0] === 'H' ? 10 : 11.5, 'font-weight':800, fill:a[0] === 'H' ? '#0E2240' : '#fff', 'font-family':'Figtree,sans-serif' }, g);
      t.textContent = a[0];
    });
    const bonds = [...new Set(M.k.map(b => b[3]))];
    const lab = svEl('text', { class:'lbl', x:mx.toFixed(1), y: y + 34 * skala + 8, 'text-anchor':'middle' }, grup);
    lab.textContent = bonds.map(bn => bn + ' ' + (daftar.energi[bn] || '')).join(', ');
    x += w;
  };
  daftar.re.forEach((k, i) => {
    gambar(k, reW[i], 're');
    if (i < reW.length - 1) { const t = svEl('text', { x:x + GAP / 2, y:y + 8, 'text-anchor':'middle', 'font-size':22, 'font-weight':800, fill:'#fff', 'font-family':'Figtree,sans-serif' }, grup); t.textContent = '+'; x += GAP; }
  });
  const ar = svEl('g', {}, grup);
  svEl('line', { x1:x + 8, y1:y, x2:x + PANAH - 14, y2:y, stroke:'#fff', 'stroke-width':4, 'stroke-linecap':'round' }, ar);
  svEl('polygon', { points:(x + PANAH - 6) + ',' + y + ' ' + (x + PANAH - 18) + ',' + (y - 7) + ' ' + (x + PANAH - 18) + ',' + (y + 7), fill:'#fff' }, ar);
  x += PANAH;
  daftar.pr.forEach((k, i) => {
    gambar(k, prW[i], 'pr');
    if (i < prW.length - 1) { const t = svEl('text', { x:x + GAP / 2, y:y + 8, 'text-anchor':'middle', 'font-size':22, 'font-weight':800, fill:'#fff', 'font-family':'Figtree,sans-serif' }, grup); t.textContent = '+'; x += GAP; }
  });
  return els;
}
function labBangunIkat(I){
  const g = $L('bMol'); g.innerHTML = '';
  const energi = {};
  I.B.putus.concat(I.B.bentuk).forEach(x => { energi[x.b] = x.e; });
  labS.bondEls = labGambarMol(g, { re:I.B.re, pr:I.B.pr, energi }, 128, 372, 1.15);
  $L('bEq').textContent = I.B.eq;
  const susun = lst => lst.map(x => x.n + '×' + x.b + ' (' + x.e + ')').join(' + ');
  $L('bL1').textContent = 'Putus: ' + susun(I.B.putus) + ' = ' + labRibu(I.A);
  $L('bL2').textContent = 'Terbentuk: ' + susun(I.B.bentuk) + ' = ' + labRibu(I.F);
  $L('bL3').textContent = '';
}
function labBangunHess(){
  const { H } = labHess();
  const hs = [0, H.step[0].dH, H.dir];
  const hmax = Math.max(...hs), hmin = Math.min(...hs);
  const y = v => 112 + (hmax - v) / ((hmax - hmin) || 1) * 232;
  const yA = y(hs[0]), yB = y(hs[1]), yC = y(hs[2]);
  labS.hy = { yA, yB, yC };
  const set = (id, a) => { const e = $L(id); for (const k in a) e.setAttribute(k, a[k]); };
  set('hLA', { y1:yA, y2:yA }); set('hLB', { y1:yB, y2:yB }); set('hLC', { y1:yC, y2:yC });
  set('hTA', { y:yA - 14 }); set('hTB', { y:yB - 14 }); set('hTC', { y:yC + 24 });
  $L('hTA').textContent = H.lv[0]; $L('hTB').textContent = H.lv[1]; $L('hTC').textContent = H.lv[2];
  $L('hTgt').textContent = H.target;
  const old = $L('hGd'); if (old) old.remove();
  const gd = svEl('g', { id:'hGd' }, $L('scHess'));
  $L('scHess').insertBefore(gd, $L('hLA'));
  const gl = (x1, y1, x2, y2) => svEl('line', { x1, y1, x2, y2, stroke:'rgba(255,255,255,.3)', 'stroke-width':1.3, 'stroke-dasharray':'4 3' }, gd);
  gl(210, yA, 240, yA); gl(240, yB, 270, yB); gl(390, yB, 420, yB); gl(420, yC, 450, yC);
  gl(210, yA, 640, yA); gl(570, yC, 640, yC);
}

/* ---------- Render ---------- */
function labRender(){
  const mode = labS.mode;
  const key = mode + '|' + labS.rx.kal + '|' + labS.n + '|' + labS.rx.hess + '|' + labS.rx.ikat;
  if (key !== labS.visKey) {
    labS.visKey = key;
    $L('scKal').style.display = mode === 'kal' ? '' : 'none';
    $L('scHess').style.display = mode === 'hess' ? '' : 'none';
    $L('scBond').style.display = mode === 'ikat' ? '' : 'none';
    if (mode === 'kal') labBangunKal(labKal());
    if (mode === 'hess') labBangunHess();
    if (mode === 'ikat') labBangunIkat(labIkat());
  }
  labRenderPanel();
  labDinamis();
  labIsiData();
  labRenderMisi();
}

/* ---------- Visual dinamis ---------- */
function labDinamis(){
  const ts = labS.ts;
  let status = 'Siap dijalankan', cls = 'off';
  if (labS.running) { status = 'Berjalan...'; cls = 'on'; }

  if (labS.mode === 'kal') {
    const K = labKal();
    const norm = 1 - Math.exp(-DUR_KAL / 3.5);
    const p = labKlem((1 - Math.exp(-ts / 3.5)) / norm, 0, 1);
    const T = T0 + K.dT * p;
    $L('kT').textContent = labNum(T, 1) + ' °C';
    $L('kT').setAttribute('fill', Math.abs(K.dT * p) < 0.05 ? '#fff' : (K.dT > 0 ? '#FFB27A' : '#8EC1FF'));
    const h = 4 + labKlem((T - 10) / 40, 0, 1) * 212;
    $L('kHg').setAttribute('y', (396 - h).toFixed(1)); $L('kHg').setAttribute('height', h.toFixed(1));
    $L('kStir').classList.toggle('stir-a', labS.running);
    $L('kSolid').setAttribute('opacity', (1 - p).toFixed(2));
    $L('kIon').setAttribute('opacity', (p).toFixed(2));
    $L('kOut').setAttribute('opacity', (K.dT > 0 && ts > 0.8) ? 1 : 0);
    $L('kIn').setAttribute('opacity', (K.dT < 0 && ts > 0.8) ? 1 : 0);
    // diagram entalpi
    const s = K.dT > 0 ? 1 : -1, dmax = labKlem(18 + Math.abs(K.q) / 8.3 * 70, 18, 90), d = dmax * p;
    const yR = 180 - s * d / 2, yP = 180 + s * d / 2;
    $L('kLvR').setAttribute('y1', yR); $L('kLvR').setAttribute('y2', yR);
    $L('kLvP').setAttribute('y1', yP); $L('kLvP').setAttribute('y2', yP);
    $L('kLvC').setAttribute('d', 'M520,' + yR + ' C555,' + yR + ' 555,' + yP + ' 590,' + yP);
    $L('kLvRt').setAttribute('y', yR - 12); $L('kLvPt').setAttribute('y', yP + (s > 0 ? 24 : -12));
    labPanah($L('kAr'), $L('kArH'), 555, yR + s * 3, 555, yP - s * 3);
    $L('kDHt').textContent = p >= 0.999 ? 'ΔH = −q ÷ n = ' + labTanda(K.dH, 1) + ' kJ/mol' : 'ΔH belum dihitung';
    // kurva suhu
    const lo = Math.min(T0, K.T1) - 1.5, hi = Math.max(T0, K.T1) + 1.5, rng = Math.max(hi - lo, 4);
    const yy = Tv => 388 - (Tv - lo) / rng * 66;
    $L('kT0').setAttribute('y1', yy(T0)); $L('kT0').setAttribute('y2', yy(T0));
    const pts = [];
    const steps = Math.max(1, Math.round(ts / 0.4));
    for (let i = 0; i <= steps; i++) {
      const t = ts * i / steps, pp = labKlem((1 - Math.exp(-t / 3.5)) / norm, 0, 1);
      pts.push((420 + t / DUR_KAL * 276).toFixed(1) + ',' + yy(T0 + K.dT * pp).toFixed(1));
    }
    $L('kLine').setAttribute('points', ts > 0 ? pts.join(' ') : '');
    if (!labS.running && labS.done.kal && ts > 0) status = 'Selesai · ΔT = ' + labTanda(K.dT, 2) + ' °C';
  }

  if (labS.mode === 'hess') {
    const { H } = labHess(), hy = labS.hy || { yA:130, yB:200, yC:330 };
    const dp = labS.hs.dir, sp = labS.hs.step;
    const p1 = labKlem(sp, 0, 1), p2 = labKlem(sp - 1, 0, 1);
    labPanah($L('hD'), $L('hDh'), 640, hy.yA, 640, hy.yA + (hy.yC - hy.yA) * dp);
    labPanah($L('hS1'), $L('hS1h'), 240, hy.yA, 240, hy.yA + (hy.yB - hy.yA) * p1);
    labPanah($L('hS2'), $L('hS2h'), 420, hy.yB, 420, hy.yB + (hy.yC - hy.yB) * p2);
    const vis = (id, on) => { $L(id).style.opacity = on ? 1 : 0; };
    $L('hDt1').setAttribute('x', 652); $L('hDt1').setAttribute('y', (hy.yA + hy.yC) / 2 - 4);
    $L('hDt2').setAttribute('x', 652); $L('hDt2').setAttribute('y', (hy.yA + hy.yC) / 2 + 14);
    $L('hDt1').textContent = 'ΔH'; $L('hDt2').textContent = labTanda(H.dir, 1);
    vis('hDt1', dp >= 1); vis('hDt2', dp >= 1);
    $L('hS1t').setAttribute('x', 232); $L('hS1t').setAttribute('y', (hy.yA + hy.yB) / 2 + 4); $L('hS1t').textContent = 'ΔH₁ = ' + labTanda(H.step[0].dH, 1); vis('hS1t', p1 >= 1);
    $L('hS2t').setAttribute('x', 412); $L('hS2t').setAttribute('y', (hy.yB + hy.yC) / 2 + 4); $L('hS2t').textContent = 'ΔH₂ = ' + labTanda(H.step[1].dH, 1); vis('hS2t', p2 >= 1);
    $L('hRes1').textContent = dp >= 1 ? 'Jalur langsung: ΔH = ' + labTanda(H.dir, 1) + ' kJ' : ' ';
    $L('hRes2').textContent = sp >= 2 ? 'Jalur bertahap: ' + labTanda(H.step[0].dH, 1) + ' + (' + labTanda(H.step[1].dH, 1) + ') = ' + labTanda(labHess().sum, 1) + ' kJ' : ' ';
    if (dp >= 1 && sp >= 2) status = 'Selesai · kedua jalur sama';
    else if (!labS.running && (dp >= 1 || sp >= 2)) status = 'Satu jalur selesai';
  }

  if (labS.mode === 'ikat') {
    const I = labIkat();
    const pA = labKlem(ts / 2, 0, 1), pB = labKlem((ts - 2) / 2, 0, 1), hasil = ts >= 4.2;
    const skala = 170 / Math.max(I.A, I.F);
    const hA = I.A * skala * pA, hB = I.F * skala * pB;
    $L('bA').setAttribute('y', (400 - hA).toFixed(1)); $L('bA').setAttribute('height', hA.toFixed(1));
    $L('bB').setAttribute('y', (400 - hB).toFixed(1)); $L('bB').setAttribute('height', hB.toFixed(1));
    $L('bAv').setAttribute('y', (392 - hA).toFixed(1)); $L('bAv').textContent = pA > 0 ? labRibu(I.A * pA) + ' kJ' : ' ';
    $L('bBv').setAttribute('y', (392 - hB).toFixed(1)); $L('bBv').textContent = pB > 0 ? labRibu(I.F * pB) + ' kJ' : ' ';
    ['bCard','bDH','bDH2'].forEach(id => $L(id).setAttribute('opacity', hasil ? 1 : 0));
    $L('bDH').textContent = 'ΔH = ' + labTanda(I.dH, 0) + ' kJ';
    $L('bDH2').textContent = I.dH < 0 ? 'Eksoterm: energi dilepas lebih besar' : 'Endoterm: energi diserap lebih besar';
    $L('bDH2').setAttribute('fill', I.dH < 0 ? '#FFB27A' : '#8EC1FF');
    $L('bL3').textContent = hasil ? 'ΔH = ' + labRibu(I.A) + ' − ' + labRibu(I.F) + ' = ' + labTanda(I.dH, 0) + ' kJ' : '';
    const els = labS.bondEls || { re:[], pr:[] };
    els.re.forEach(l => { l.setAttribute('stroke', ts > 0 && ts < 2 ? '#FF8A4A' : (ts >= 2 ? '#5C6F8F' : '#AEC0E0')); l.setAttribute('stroke-dasharray', ts >= 2 ? '2 5' : ''); });
    els.pr.forEach(l => { l.setAttribute('stroke', ts >= 2 ? '#6FB2FF' : '#5C6F8F'); });
    if (!labS.running && labS.done.ikat && ts > 0) status = 'Selesai · ΔH = ' + labTanda(I.dH, 0) + ' kJ';
  }
  const st = $L('lab-status'); st.textContent = status; st.className = 'lab-status ' + (status.indexOf('Selesai') === 0 || status === 'Berjalan...' ? 'on' : 'off');
}

/* ---------- Eksekusi ---------- */
function labJalankan(){
  if (labS.running) return;
  labS.ts = 0; labS.running = true;
  if (labS.mode === 'hess') {
    labS.runJalur = labS.jalur;
    if (labS.jalur === 'langsung') labS.hs.dir = 0; else labS.hs.step = 0;
  }
  labRenderPanel(); labDinamis();
  sfx('click');
}
function labSelesaiRun(){
  const mode = labS.mode;
  if (mode === 'kal') {
    const K = labKal();
    labS.done.kal = true;
    labS.kalLast = { rx:K.R.id, n:K.n, q:K.q, dT:K.dT, dH:K.dH, eks:K.eks };
    if (K.eks && !labS.misi[0]) { labS.misi[0] = true; labSkor(20, '🎉 Misi 1 selesai! Suhu naik: reaksi eksoterm (ΔH negatif).'); }
    if (!K.eks && !labS.misi[1]) { labS.misi[1] = true; labSkor(20, '🎉 Misi 2 selesai! Suhu turun: reaksi endoterm (ΔH positif).'); }
  } else if (mode === 'hess') {
    labS.done.hess = true;
    labS.hs[labS.runJalur === 'langsung' ? 'dir' : 'step'] = labS.runJalur === 'langsung' ? 1 : 2;
    labS.hessDone[labS.rx.hess][labS.runJalur] = true;
    const d = labS.hessDone[labS.rx.hess];
    if (d.langsung && d.bertahap && !labS.misi[3]) { labS.misi[3] = true; labSkor(20, '🎉 Misi 4 selesai! Kedua jalur menghasilkan ΔH yang sama: ' + labTanda(labHess().sum, 1) + ' kJ.'); }
  } else {
    const I = labIkat();
    labS.done.ikat = true;
    labS.bondLast = { rx:I.B.id, A:I.A, F:I.F, dH:I.dH };
  }
  labS.running = false;
  labRenderPanel(); labDinamis(); labIsiData(); labRenderMisi();
}
setInterval(() => {
  if (!labS.running) return;
  const dur = labDurasi();
  labS.ts += 0.1 * (labS.mode === 'kal' ? LAJU : 1);
  if (labS.mode === 'hess') {
    if (labS.runJalur === 'langsung') labS.hs.dir = labKlem(labS.ts / 2.2, 0, 1);
    else labS.hs.step = labKlem(labS.ts / 2.2, 0, 2);
  }
  if (labS.ts >= dur) { labS.ts = dur; labSelesaiRun(); return; }
  labDinamis();
}, 100);

/* ---------- Tab Data ---------- */
function labIsiData(){
  const info = $L('d-info'), hit = $L('d-hitung'), it = $L('d-info-t'), ht = $L('d-hitung-t'), am = $L('d-amati');
  const am_ = [];
  if (labS.mode === 'kal') {
    const K = labKal(), sel = labS.done.kal && labS.ts > 0;
    it.textContent = '🧪 Data percobaan'; ht.textContent = '🧮 Perhitungan kalorimetri';
    info.innerHTML = '<div class="hasil-baris">' + K.R.eq + '<br>n = ' + labNum(K.n, 3) + ' mol' + (K.R.padat ? ' (' + labNum(K.g, 2) + ' g)' : '') + '<br>m larutan = ' + labNum(K.m, 2) + ' g<br>T awal = ' + labNum(T0, 1) + ' °C</div>';
    if (!sel) hit.innerHTML = '<div class="lab-note">Jalankan reaksi untuk mendapatkan suhu akhir, lalu hitung q dan ΔH.</div>';
    else hit.innerHTML = '<div class="hasil-baris">T akhir = ' + labNum(K.T1, 2) + ' °C<br>ΔT = ' + labTanda(K.dT, 2) + ' °C<br>q = m × c × ΔT<br>= ' + labNum(K.m, 1) + ' × 4,18 × ' + labNum(K.dT, 2) + ' = ' + labRibu(K.q * 1000) + ' J<br>= <b>' + labTanda(K.q, 2) + ' kJ</b> (diserap larutan)<br>ΔH = −q ÷ n = −(' + labNum(K.q, 2) + ') ÷ ' + labNum(K.n, 3) + '<br>= <b>' + labTanda(K.dH, 1) + ' kJ/mol</b></div>';
    if (sel) am_.push(K.eks ? 'Suhu larutan naik ' + labNum(K.dT, 2) + ' °C: reaksi melepas kalor (eksoterm), ΔH negatif.' : 'Suhu larutan turun ' + labNum(-K.dT, 2) + ' °C: reaksi menyerap kalor (endoterm), ΔH positif.');
    else am_.push('Belum ada pengamatan. Jalankan reaksi.');
  } else if (labS.mode === 'hess') {
    const { H, sum } = labHess(), d = labS.hessDone[H.id];
    it.textContent = '🧪 Reaksi dan tahapnya'; ht.textContent = '🧮 Penjumlahan ΔH';
    info.innerHTML = '<div class="hasil-baris"><b>Target:</b> ' + H.target + '<br><b>Tahap 1:</b> ' + H.step[0].eq + '<br><b>Tahap 2:</b> ' + H.step[1].eq + '</div>';
    hit.innerHTML = '<div class="hasil-baris">' + (d.langsung ? 'Langsung: ΔH = <b>' + labTanda(H.dir, 1) + ' kJ</b><br>' : 'Langsung: (belum ditampilkan)<br>') +
      (d.bertahap ? 'Bertahap: ΔH₁ + ΔH₂<br>= ' + labTanda(H.step[0].dH, 1) + ' + (' + labTanda(H.step[1].dH, 1) + ') = <b>' + labTanda(sum, 1) + ' kJ</b>' : 'Bertahap: (belum ditampilkan)') +
      (d.langsung && d.bertahap ? '<br><br><b>Kedua jalur sama</b>: Hukum Hess terbukti.' : '') + '</div>';
    am_.push(d.langsung && d.bertahap ? 'ΔH jalur langsung dan bertahap sama, meski jalurnya berbeda.' : 'Tampilkan jalur langsung dan bertahap, lalu bandingkan ΔH-nya.');
  } else {
    const I = labIkat(), sel = labS.done.ikat && labS.ts > 0;
    it.textContent = '🧪 Ikatan yang terlibat'; ht.textContent = '🧮 Perhitungan energi ikatan';
    const susun = lst => lst.map(x => x.n + ' × ' + x.b + ' (' + x.e + ')').join(' + ');
    info.innerHTML = '<div class="hasil-baris"><b>Reaksi:</b> ' + I.B.eq + '<br><b>Putus:</b> ' + susun(I.B.putus) + '<br><b>Terbentuk:</b> ' + susun(I.B.bentuk) + '<br>(energi dalam kJ/mol)</div>';
    if (!sel) hit.innerHTML = '<div class="lab-note">Jalankan eksperimen untuk melihat perhitungan.</div>';
    else hit.innerHTML = '<div class="hasil-baris">Σ putus = <b>' + labRibu(I.A) + ' kJ</b><br>Σ terbentuk = <b>' + labRibu(I.F) + ' kJ</b><br>ΔH = ' + labRibu(I.A) + ' − ' + labRibu(I.F) + ' = <b>' + labTanda(I.dH, 0) + ' kJ</b></div>';
    am_.push(sel ? (I.dH < 0 ? 'Energi yang dilepas saat membentuk ikatan lebih besar daripada energi untuk memutus ikatan: reaksi eksoterm.' : 'Energi untuk memutus ikatan lebih besar daripada energi yang dilepas: reaksi endoterm.') : 'Belum ada pengamatan. Jalankan eksperimen.');
  }
  am.innerHTML = am_.map(x => '• ' + x).join('<br>');
}

/* ---------- Misi ---------- */
function labSkor(p, msg){
  labS.skor += p;
  $L('lab-skor-angka').textContent = labS.skor;
  labUpdateMisiCount();
  labRenderMisi();
  labToast(msg);
  confettiBurst(400, 280, 26, $L('scr-lab'));
  sfx('win');
  if (labS.misi.every(x => x)) {
    $L('lab-selesai-btn').disabled = false;
    setTimeout(() => { if ($L('scr-lab').classList.contains('active')) labSelesai(); }, 1000);
  }
}
function labUpdateMisiCount(){ $L('lab-misi-count').textContent = labS.misi.filter(x => x).length + '/5'; }

function labRenderMisi(){
  ['st-m1','st-m2','st-m3','st-m4','st-m5'].forEach((id, i) => {
    const el = $L(id);
    if (el) el.textContent = labS.misi[i] ? '✅ Selesai (+20)' : '⬜ Belum selesai';
    const card = $L('misi-' + (i + 1)); if (card) card.classList.toggle('done', labS.misi[i]);
  });

  const q3 = $L('m3-quiz');
  if (q3) {
    const L = labS.kalLast;
    if (labS.misi[2]) q3.innerHTML = '<div class="misi-hint ok">✅ ΔH = −q ÷ n: tanda ΔH berlawanan dengan arah perubahan suhu.</div>';
    else if (L) {
      const key = JSON.stringify([L.rx, L.n]);
      if (labS.m3key !== key || !q3.querySelector('.m-nota')) {
        labS.m3key = key;
        const v = L.dH, f = x => labTanda(x, 1) + ' kJ/mol';
        const opts = [{ t:f(v), b:true }, { t:f(-v), b:false }, { t:f(v * 2), b:false }, { t:f(v / 2), b:false }];
        labS.m3opt = labAcak(opts);
        q3.innerHTML = '<div class="m4-tanya">Data terakhir: suhu larutan ' + (L.dT > 0 ? 'naik' : 'turun') + ' ' + labNum(Math.abs(L.dT), 2) + ' °C, q = ' + labNum(Math.abs(L.q), 2) + ' kJ ' + (L.dT > 0 ? 'dilepas reaksi' : 'diserap reaksi') + ', n = ' + labNum(L.n, 3) + ' mol. Berapa ΔH reaksi per mol?</div>' +
          labS.m3opt.map((o, i) => '<button class="m-nota" style="font-family:inherit" data-sfx onclick="labJawabM3(' + i + ')">' + o.t + '</button>').join('') + '<div class="feedback" id="m3-fb"></div>';
      }
    } else q3.innerHTML = '<div class="misi-hint">🔒 Selesaikan satu percobaan Kalorimeter terlebih dahulu.</div>';
  }

  const q5 = $L('m5-quiz');
  if (q5) {
    const B = labS.bondLast;
    if (labS.misi[4]) q5.innerHTML = '<div class="misi-hint ok">✅ ΔH = Σ energi putus − Σ energi terbentuk.</div>';
    else if (B) {
      const key = B.rx;
      if (labS.m5key !== key || !q5.querySelector('.m-nota')) {
        labS.m5key = key;
        const m = Math.abs(B.dH), eks = B.dH < 0;
        const opts = [
          { t:(eks ? 'Eksoterm, ΔH = −' : 'Endoterm, ΔH = +') + labRibu(m) + ' kJ', b:true },
          { t:(eks ? 'Endoterm, ΔH = +' : 'Eksoterm, ΔH = −') + labRibu(m) + ' kJ', b:false },
          { t:(eks ? 'Eksoterm, ΔH = +' : 'Endoterm, ΔH = −') + labRibu(m) + ' kJ', b:false },
          { t:'Tidak ada perubahan entalpi, ΔH = 0', b:false }
        ];
        labS.m5opt = labAcak(opts);
        q5.innerHTML = '<div class="m4-tanya">Energi ikatan putus = ' + labRibu(B.A) + ' kJ dan energi ikatan terbentuk = ' + labRibu(B.F) + ' kJ. Reaksi ini bersifat ...</div>' +
          labS.m5opt.map((o, i) => '<button class="m-nota" style="font-family:inherit" data-sfx onclick="labJawabM5(' + i + ')">' + o.t + '</button>').join('') + '<div class="feedback" id="m5-fb"></div>';
      }
    } else q5.innerHTML = '<div class="misi-hint">🔒 Selesaikan satu eksperimen Energi ikatan terlebih dahulu.</div>';
  }
}
function labJawabM3(i){
  if (labS.misi[2] || !labS.m3opt) return;
  const o = labS.m3opt[i], btns = document.querySelectorAll('#m3-quiz .m-nota'), fb = $L('m3-fb');
  if (o.b) {
    btns[i].classList.add('benar');
    if (fb) { fb.className = 'feedback show ok'; fb.textContent = 'Tepat! ΔH = −q ÷ n; suhu ' + (labS.kalLast.dT > 0 ? 'naik berarti ΔH negatif.' : 'turun berarti ΔH positif.'); }
    labS.misi[2] = true; labSkor(20, '🎉 Misi 3 selesai! Kamu bisa menghitung ΔH dari data kalorimeter.');
  } else {
    btns[i].classList.add('salah'); btns[i].disabled = true;
    if (fb) { fb.className = 'feedback show no'; fb.textContent = 'Belum tepat. Hitung q = m × c × ΔT, lalu ΔH = −q ÷ n. Perhatikan tandanya.'; }
    sfx('salah'); efekSalahFlash();
  }
}
function labJawabM5(i){
  if (labS.misi[4] || !labS.m5opt) return;
  const o = labS.m5opt[i], btns = document.querySelectorAll('#m5-quiz .m-nota'), fb = $L('m5-fb');
  if (o.b) {
    btns[i].classList.add('benar');
    if (fb) { fb.className = 'feedback show ok'; fb.textContent = 'Benar! ΔH = energi putus − energi terbentuk.'; }
    labS.misi[4] = true; labSkor(20, '🎉 Misi 5 selesai! Kamu memahami energi ikatan.');
  } else {
    btns[i].classList.add('salah'); btns[i].disabled = true;
    if (fb) { fb.className = 'feedback show no'; fb.textContent = 'Belum tepat. Bandingkan kedua energi: jika yang dilepas lebih besar, ΔH negatif.'; }
    sfx('salah'); efekSalahFlash();
  }
}

/* ---------- LKPD, reset, toast, selesai ---------- */
function labCatat(){
  labS.catatNo++;
  const item = document.createElement('div'); item.className = 'lab-log-item';
  let isi = '';
  if (labS.mode === 'kal') { const K = labKal(); isi = '<b>Kalorimeter</b> · ' + K.R.nama + ' (' + K.R.sub + '), n = ' + labNum(K.n, 3) + ' mol<br>ΔT = ' + labTanda(K.dT, 2) + ' °C · q = ' + labTanda(K.q, 2) + ' kJ · ΔH = ' + labTanda(K.dH, 1) + ' kJ/mol'; }
  else if (labS.mode === 'hess') { const { H, sum } = labHess(); isi = '<b>Hukum Hess</b> · ' + H.target + '<br>langsung ' + labTanda(H.dir, 1) + ' kJ; bertahap ' + labTanda(sum, 1) + ' kJ'; }
  else { const I = labIkat(); isi = '<b>Energi ikatan</b> · ' + I.B.eq + '<br>putus ' + labRibu(I.A) + ' − terbentuk ' + labRibu(I.F) + ' = ' + labTanda(I.dH, 0) + ' kJ'; }
  item.innerHTML = '<b>No. ' + labS.catatNo + '</b> · ' + isi;
  const log = $L('lab-log'); log.insertBefore(item, log.firstChild);
  while (log.children.length > 10) log.removeChild(log.lastChild);
  labToast('📓 Pengamatan berhasil dicatat ke LKPD!');
}
function labReset(){
  Object.assign(labS, { mode:'kal', n:0.05, jalur:'langsung' });
  labS.rx = { kal:'naoh', hess:'c', ikat:'hcl' };
  labS.hs = { dir:0, step:0 };
  labS.hessDone = { c:{ langsung:false, bertahap:false }, s:{ langsung:false, bertahap:false }, n:{ langsung:false, bertahap:false } };
  labS.done = { kal:false, hess:false, ikat:false };
  labResetRun(); labS.visKey = '';
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
  else if (s >= 60) kal = 'Bagus! Terus berlatih mengukur kalor reaksi.';
  else kal = 'Ayo selesaikan semua misi untuk meraih skor penuh!';
  $L('lab-akhir-kal').textContent = kal;
  openModal('modal-lab'); sfx('win');
}

(function labInit(){
  if (!$L('scr-lab')) return;
  labRender(); labUpdateMisiCount();
})();
