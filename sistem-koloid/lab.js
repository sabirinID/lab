/* ##############################################################
   #  LAB MAYA — PRAKTIKUM VIRTUAL SISTEM KOLOID                #
   #  Tiga eksperimen: uji campuran (larutan, koloid, suspensi),#
   #  koagulasi (Hardy–Schulze), dan elektroforesis.            #
   #  Ukuran partikel, nilai ambang koagulasi, dan skala        #
   #  elektroforesis bersifat representatif untuk pembelajaran. #
   ############################################################## */
const LAB_NS = 'http://www.w3.org/2000/svg';
const $L = id => document.getElementById(id);

/* ---------- Data ---------- */
const SAMPEL = {
  gula:   { id:'gula',   nama:'Larutan gula',  d:0.5,   cair:'rgba(156,201,255,.28)', par:'#8EC1FF', desc:'gula + air' },
  kanji:  { id:'kanji',  nama:'Sol kanji',     d:30,    cair:'rgba(255,240,200,.5)',  par:'#E9C46A', desc:'kanji + air panas' },
  susu:   { id:'susu',   nama:'Susu',          d:80,    cair:'rgba(255,255,255,.62)', par:'#FFF3C2', desc:'lemak dan protein dalam air' },
  lumpur: { id:'lumpur', nama:'Lumpur + air',  d:20000, cair:'rgba(160,120,70,.5)',   par:'#8B5E34', desc:'tanah liat + air' },
  minyak: { id:'minyak', nama:'Minyak + air',  d:5000,  cair:'rgba(255,224,130,.32)', par:'#F2C21B', desc:'minyak dikocok dengan air' }
};
const SAMPEL_IDS = ['gula','kanji','susu','lumpur','minyak'];
const UJI = [
  { id:'senter',   nama:'Senter',   label:'Senter (Tyndall)' },
  { id:'diamkan',  nama:'Diamkan',  label:'Diamkan 24 jam' },
  { id:'saring',   nama:'Saring',   label:'Kertas saring' },
  { id:'dialisis', nama:'Dialisis', label:'Selaput dialisis' }
];
const SOL = {
  as2s3: { id:'as2s3', nama:'Sol As₂S₃',  warna:'#F2C21B', ket:'kuning', muatan:-1, els:['nacl','cacl2','alcl3'], mu:0.30 },
  feoh3: { id:'feoh3', nama:'Sol Fe(OH)₃', warna:'#C0522F', ket:'cokelat kemerahan', muatan:1, els:['nacl','k2so4','k3fecn'], mu:0.22 }
};
const ELEK = {
  nacl:   { nama:'NaCl',        thr:{ as2s3:51,   feoh3:9.25  }, ion:{ as2s3:'Na⁺',  feoh3:'Cl⁻',       val:{ as2s3:1, feoh3:1 } } },
  cacl2:  { nama:'CaCl₂',       thr:{ as2s3:0.65 },               ion:{ as2s3:'Ca²⁺', val:{ as2s3:2 } } },
  alcl3:  { nama:'AlCl₃',       thr:{ as2s3:0.093 },              ion:{ as2s3:'Al³⁺', val:{ as2s3:3 } } },
  k2so4:  { nama:'K₂SO₄',       thr:{ feoh3:0.205 },              ion:{ feoh3:'SO₄²⁻', val:{ feoh3:2 } } },
  k3fecn: { nama:'K₃[Fe(CN)₆]', thr:{ feoh3:0.096 },              ion:{ feoh3:'[Fe(CN)₆]³⁻', val:{ feoh3:3 } } }
};
const C_KOAG = [0.05, 0.1, 0.5, 5, 50, 100];
const V_FOR = [0, 10, 20, 40];
const LAB_MODE = [
  { id:'klas', nama:'Uji Campuran' },
  { id:'koag', nama:'Koagulasi' },
  { id:'for',  nama:'Elektroforesis' }
];
const T_KLAS = 1.8, T_KOAG = 2.6, T_FOR = 3.0;

const labS = {
  mode:'klas',
  klas:{ samp:'kanji', res:{}, last:null, run:false, t:0, bangun:'' },
  koag:{ sol:'as2s3', el:'alcl3', c:0.1, res:[], run:false, t:0, bangun:'', ok:null },
  fore:{ sol:'as2s3', V:20, res:[], run:false, t:0, shift:0 },
  mikro:false, catatNo:0,
  misi:[false,false,false,false,false], skor:0, m1opt:null, m2opt:null, m2key:'', m4opt:null, m4key:'', m5opt:null, m5key:''
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
function labAcak(arr){ for (let i = arr.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [arr[i], arr[j]] = [arr[j], arr[i]]; } return arr; }
function labEase(f){ f = labKlem(f, 0, 1); return f * f * (3 - 2 * f); }
function fmtC(c){ return String(c).replace('.', ','); }
function kelasD(d){ return d < 1 ? 'larutan' : (d <= 100 ? 'koloid' : 'suspensi'); }
function labTitik(n, x0, x1, y0, y1, seed, gap){
  const rng = (s => () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; })(seed >>> 0);
  let g = gap, pts = [];
  for (let a = 0; a < 8; a++) {
    pts = []; let t = 0;
    while (pts.length < n && t < 4000) { t++; const x = x0 + rng() * (x1 - x0), y = y0 + rng() * (y1 - y0); if (pts.every(p => (p[0] - x) ** 2 + (p[1] - y) ** 2 > g * g)) pts.push([x, y]); }
    if (pts.length >= n) break;
    g = Math.max(4, g - 2);
  }
  while (pts.length < n) pts.push([x0 + Math.random() * (x1 - x0), y0 + Math.random() * (y1 - y0)]);
  return pts;
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
  if (labS.mikro) labToast('🔬 Label partikel dan ion ditampilkan.');
}

/* ---------- Panel ---------- */
function labChip(wadah, teks, sub, aktif, onclick, aksi){
  const b = document.createElement('button');
  b.className = 'el-chip' + (aktif ? ' aktif' : '') + (aksi ? ' aksi' : '');
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
function labGantiMode(id){ labS.mode = id; labRender(); }
function labRenderPanel(){
  const gm = $L('grid-mode'); gm.innerHTML = '';
  LAB_MODE.forEach(m => labChip(gm, m.nama, '', labS.mode === m.id, () => labGantiMode(m.id)));
  $L('rakit-dyn').innerHTML = '';
  const rb = $L('run-btn');
  if (labS.mode === 'klas') {
    const K = labS.klas, done = K.res[K.samp] || {};
    const g1 = labSec('🧪 Sampel campuran', '', 'rx-grid cols3');
    SAMPEL_IDS.forEach(id => labChip(g1, SAMPEL[id].nama, '', K.samp === id, () => labKlasPilih(id)));
    const g2 = labSec('🔬 Jalankan uji', 'tiap uji ± 2 detik', 'rx-grid cols4');
    UJI.forEach(u => labChip(g2, u.nama, done[u.id] ? '✓' : '', K.last === u.id && !K.run, () => labUji(u.id), true));
    rb.style.display = 'none';
  } else if (labS.mode === 'koag') {
    const G = labS.koag, S = SOL[G.sol];
    const g1 = labSec('🧪 Sol koloid', '', 'rx-grid cols2');
    Object.values(SOL).forEach(s => labChip(g1, s.nama, s.ket, G.sol === s.id, () => labKoagPilih('sol', s.id)));
    const g2 = labSec('⚡ Elektrolit', '', 'rx-grid cols3');
    S.els.forEach(e => labChip(g2, ELEK[e].nama, '', G.el === e, () => labKoagPilih('el', e)));
    const g3 = labSec('💧 Konsentrasi', 'mmol/L', 'rx-grid cols6');
    C_KOAG.forEach(c => labChip(g3, fmtC(c), '', G.c === c, () => labKoagPilih('c', c)));
    rb.style.display = ''; rb.disabled = G.run; rb.textContent = G.run ? '⏳ Menunggu...' : '▶ Tambahkan elektrolit';
  } else {
    const F = labS.fore;
    const g1 = labSec('🧪 Sol koloid', '', 'rx-grid cols2');
    Object.values(SOL).forEach(s => labChip(g1, s.nama, s.ket, F.sol === s.id, () => labForPilih('sol', s.id)));
    const g2 = labSec('🔋 Tegangan', 'volt', 'rx-grid cols4');
    V_FOR.forEach(v => labChip(g2, String(v), '', F.V === v, () => labForPilih('V', v)));
    rb.style.display = ''; rb.disabled = F.run; rb.textContent = F.run ? '⏳ Listrik mengalir...' : '▶ Alirkan listrik (10 menit)';
  }
}

/* ---------- Uji campuran ---------- */
function hasilUji(S, id){
  const d = S.d;
  if (id === 'senter')   return d >= 1   ? { ok:true,  t:'jalur cahaya terlihat' }       : { ok:false, t:'jalur cahaya tidak terlihat' };
  if (id === 'diamkan')  return d > 100  ? { ok:true,  t:'mengendap / memisah' }         : { ok:false, t:'tetap homogen' };
  if (id === 'saring')   return d > 1000 ? { ok:true,  t:'tertahan di kertas saring' }   : { ok:false, t:'lolos kertas saring' };
  return d > 2 ? { ok:true, t:'tertahan oleh selaput' } : { ok:false, t:'lolos selaput' };
}
function labKlasPilih(id){ const K = labS.klas; K.samp = id; K.last = null; K.run = false; K.t = 0; K.bangun = ''; labRender(); }
function labUji(id){
  const K = labS.klas; if (K.run) return;
  K.last = id; K.run = true; K.t = 0;
  labRenderPanel(); sfx('click');
}
function klasBangun(){
  const K = labS.klas, S = SAMPEL[K.samp];
  if (K.bangun === K.samp) return;
  K.bangun = K.samp;
  const g = $L('kPar'); g.innerHTML = '';
  const r = labKlem(1.8 + (Math.log10(S.d) + 0.4) * 1.9, 1.8, 11);
  const n = S.d < 1 ? 46 : (S.d < 100 ? 22 : (S.d < 1000 ? 18 : 9));
  const pts = labTitik(n, 108, 252, 198, 396, 31 + S.nama.length, r * 2 + 2);
  K.p = pts.map((p, i) => ({ x:p[0], y:p[1], r, fy:404 - r - (i % 3) * r * 1.7 - Math.floor(i / 12) * 0 }));
  K.p.forEach((q, i) => {
    const o = svEl('g', { transform:'translate(' + q.x.toFixed(1) + ',' + q.y.toFixed(1) + ')' }, g);
    const f = svEl('g', { class:'ion-g', style:'animation-delay:' + ((i * .31) % 4).toFixed(2) + 's' }, o);
    svEl('circle', { r:r.toFixed(1), fill:S.par, stroke:'#fff', 'stroke-width':1 }, f);
    if (i === 0) { const t = svEl('text', { class:'lbl', y:-(r + 5), 'text-anchor':'middle' }, f); t.textContent = 'd ≈ ' + (S.d < 1 ? '0,5' : S.d) + ' nm'; }
  });
  $L('kName').textContent = S.nama; $L('kPillT').textContent = S.nama.toUpperCase();
  $L('kLiq').setAttribute('fill', S.cair);
  $L('kEq').textContent = S.nama + ': ' + S.desc;
}
function klasDraw(){
  const K = labS.klas, S = SAMPEL[K.samp], res = K.res[K.samp] || {};
  klasBangun();
  const f = K.last ? labKlem(K.t / T_KLAS, 0, 1) : 0, fe = labEase(f);
  const tyn = S.d >= 1, settle = S.d > 100;
  const senter = K.last === 'senter';
  $L('kBeamL').setAttribute('opacity', senter ? (0.55 * fe).toFixed(2) : 0);
  $L('kBeamIn').setAttribute('opacity', senter ? ((tyn ? 0.62 : 0.05) * fe).toFixed(2) : 0);
  $L('kBeamR').setAttribute('opacity', senter ? (0.34 * fe).toFixed(2) : 0);
  const diam = K.last === 'diamkan' && settle;
  $L('kPar').querySelectorAll(':scope > g').forEach((g, i) => {
    const q = K.p[i], y = diam ? q.y + (q.fy - q.y) * fe : q.y;
    g.setAttribute('transform', 'translate(' + q.x.toFixed(1) + ',' + y.toFixed(1) + ')');
  });
  $L('kLiq').setAttribute('fill', diam && fe > 0.5 ? S.cair.replace(/[\d.]+\)$/, '0.16)') : S.cair);
  const x = 330 + labKlem(Math.log10(S.d) + 1, 0, 6) * 60;
  $L('kMk').setAttribute('points', x + ',100 ' + (x - 6) + ',91 ' + (x + 6) + ',91');
  $L('kMkT').setAttribute('x', x); $L('kMkT').setAttribute('y', 87); $L('kMkT').textContent = 'd ≈ ' + (S.d < 1 ? '0,5' : S.d.toLocaleString('id-ID')) + ' nm';
  UJI.forEach((u, i) => {
    const r = res[u.id], sedang = K.run && K.last === u.id;
    $L('kR' + i).textContent = sedang ? 'sedang diuji...' : (r ? r.t : 'belum diuji');
    $L('kM' + i).textContent = r && !sedang ? (r.ok ? '✓' : '✗') : ' ';
    $L('kM' + i).setAttribute('fill', r && r.ok ? '#4ADE80' : '#FF7A6B');
  });
  const n = Object.keys(res).length;
  $L('kInfo').textContent = n === 4 ? 'Keempat uji selesai. Simpulkan jenis campurannya!' : 'Uji selesai: ' + n + ' dari 4.';
  const st = $L('lab-status');
  st.textContent = K.run ? 'Menguji...' : (n === 4 ? 'Semua uji selesai' : 'Uji ' + n + '/4'); st.className = 'lab-status ' + (K.run || n > 0 ? 'on' : 'off');
}
function klasSelesai(){
  const K = labS.klas, S = SAMPEL[K.samp];
  K.res[K.samp] = K.res[K.samp] || {};
  K.res[K.samp][K.last] = hasilUji(S, K.last);
}

/* ---------- Koagulasi ---------- */
function labKoagPilih(k, v){
  const G = labS.koag; G[k] = v;
  if (k === 'sol') G.el = SOL[v].els[SOL[v].els.length - 1];
  G.run = false; G.t = 0; G.ok = null; G.bangun = ''; labRender();
}
function labKoagJalan(){
  const G = labS.koag; if (G.run) return;
  G.run = true; G.t = 0; G.ok = ELEK[G.el].thr[G.sol] !== undefined && G.c >= ELEK[G.el].thr[G.sol];
  labRenderPanel(); sfx('click');
}
function koagBangun(){
  const G = labS.koag, S = SOL[G.sol], E = ELEK[G.el], key = [G.sol, G.el, G.c].join('|');
  if (G.bangun === key) return;
  G.bangun = key;
  const gp = $L('gPar'), gi = $L('gIon'); gp.innerHTML = ''; gi.innerHTML = '';
  const pts = labTitik(14, 106, 274, 188, 380, 41 + G.sol.length, 24);
  G.p = pts.map((p, i) => { const cl = i % 3, ang = (i / 3) * 1.9; return { x:p[0], y:p[1], fx:[140, 190, 240][cl] + Math.cos(ang) * 11 * (1 + (i % 2)), fy:392 - (Math.floor(i / 3) % 2) * 13 + Math.sin(ang) * 3 }; });
  const kuat = S.muatan < 0 ? '−' : '+', fill = S.warna;
  G.p.forEach((q, i) => {
    const o = svEl('g', { transform:'translate(' + q.x.toFixed(1) + ',' + q.y.toFixed(1) + ')' }, gp);
    const f = svEl('g', { class:'ion-g', style:'animation-delay:' + ((i * .29) % 4).toFixed(2) + 's' }, o);
    svEl('circle', { r:9, fill:fill, 'fill-opacity':.95, stroke:'#fff', 'stroke-width':1.5 }, f);
    const t = svEl('text', { y:4, 'text-anchor':'middle', 'font-size':12, 'font-weight':800, fill:'#fff', 'font-family':'Figtree,sans-serif' }, f); t.textContent = kuat;
    if (i === 0) { const l = svEl('text', { class:'lbl', y:-14, 'text-anchor':'middle' }, f); l.textContent = 'partikel sol'; }
  });
  const nIon = 2 + C_KOAG.indexOf(G.c) * 2, ipts = labTitik(nIon, 100, 280, 182, 390, 7 + nIon, 16);
  ipts.forEach((p, i) => {
    const o = svEl('g', { transform:'translate(' + p[0].toFixed(1) + ',' + p[1].toFixed(1) + ')' }, gi);
    const f = svEl('g', { class:'ion-g', style:'animation-delay:' + ((i * .37) % 4).toFixed(2) + 's' }, o);
    svEl('circle', { r:4.5, fill:'#FFFFFF', stroke:'#F26A21', 'stroke-width':2 }, f);
    if (i === 0) { const l = svEl('text', { class:'lbl', y:-9, 'text-anchor':'middle' }, f); l.textContent = (E.ion[G.sol] || '') + (E.ion[G.sol] ? '' : ''); }
  });
  $L('gT').textContent = S.nama + ' + ' + E.nama + ' ' + fmtC(G.c) + ' mmol/L';
  $L('gPillT').textContent = S.nama + ' (' + S.ket + ')';
  $L('gPill').setAttribute('fill', S.muatan < 0 ? '#25508C' : '#8E3B22');
}
function koagDraw(){
  const G = labS.koag, S = SOL[G.sol], E = ELEK[G.el];
  koagBangun();
  const t = G.run || G.t > 0 ? G.t : 0;
  const fi = labKlem(t / 0.8, 0, 1), fm = G.ok ? labEase((t - 0.8) / (T_KOAG - 0.8)) : 0;
  $L('gIon').querySelectorAll(':scope > g').forEach(g => g.setAttribute('opacity', fi));
  $L('gPar').querySelectorAll(':scope > g').forEach((g, i) => {
    const q = G.p[i], x = q.x + (q.fx - q.x) * fm, y = q.y + (q.fy - q.y) * fm;
    g.setAttribute('transform', 'translate(' + x.toFixed(1) + ',' + y.toFixed(1) + ')');
  });
  $L('gLiq').setAttribute('fill', S.warna); $L('gLiq').setAttribute('fill-opacity', (0.42 - 0.3 * fm).toFixed(2));
  // grafik hasil
  const xc = c => 430 + (Math.log10(c) + 1.301) / 3.301 * 270;
  S.els.forEach((e, i) => { $L('gL' + i).textContent = ELEK[e].nama; });
  const gd = $L('gDots'); gd.innerHTML = '';
  G.res.filter(r => r.sol === G.sol).forEach(r => {
    const i = S.els.indexOf(r.el), y = 150 + i * 70, x = xc(r.c);
    if (r.ok) svEl('circle', { cx:x, cy:y, r:7, fill:'#4ADE80', stroke:'#fff', 'stroke-width':2 }, gd);
    else { const tt = svEl('text', { x:x, y:y + 5, 'text-anchor':'middle', 'font-size':15, 'font-weight':800, fill:'#FF7A6B', 'font-family':'Figtree,sans-serif' }, gd); tt.textContent = '✕'; }
  });
  const sel = !G.run && G.t >= T_KOAG;
  $L('gEq').textContent = sel ? (G.ok ? 'Menggumpal dan mengendap' : 'Sol tetap stabil') : (G.run ? 'Elektrolit ditambahkan...' : 'Pilih elektrolit dan konsentrasi');
  const ion = E.ion[G.sol];
  $L('gInfo').textContent = sel ? (ion ? 'Ion efektif: ' + ion + ' (valensi ' + E.ion.val[G.sol] + ')' : '') : 'Konsentrasi minimum penggumpal berbeda untuk tiap ion.';
  const st = $L('lab-status');
  st.textContent = G.run ? 'Menambahkan...' : (sel ? (G.ok ? 'Menggumpal ✓' : 'Stabil') : 'Siap'); st.className = 'lab-status ' + (G.run || sel ? 'on' : 'off');
}
function koagSelesai(){
  const G = labS.koag;
  G.res = G.res.filter(r => !(r.sol === G.sol && r.el === G.el && r.c === G.c));
  G.res.push({ sol:G.sol, el:G.el, c:G.c, ok:G.ok });
  if (!labS.misi[2] && G.sol === 'as2s3' && G.ok && G.c <= 0.2) { labS.misi[2] = true; labSkor(20, '🎉 Misi 3 selesai! ' + ELEK[G.el].nama + ' menggumpalkan sol hanya pada ' + fmtC(G.c) + ' mmol/L.'); }
}

/* ---------- Elektroforesis ---------- */
function labForPilih(k, v){ const F = labS.fore; F[k] = v; F.run = false; F.t = 0; F.shift = 0; labRender(); }
function labForJalan(){
  const F = labS.fore; if (F.run) return;
  F.run = true; F.t = 0; F.shift = SOL[F.sol].mu * F.V;
  labRenderPanel(); sfx('click');
}
function forDraw(){
  const F = labS.fore, S = SOL[F.sol];
  const fe = F.run || F.t > 0 ? labEase(F.t / T_FOR) : 0, s = F.shift * fe;
  // sol negatif: batas kiri turun, batas kanan naik (menuju anode di kanan)
  const yl = 250 + (S.muatan < 0 ? 1 : -1) * s * 4, yr = 250 - (S.muatan < 0 ? 1 : -1) * s * 4;
  $L('fSol').setAttribute('d', 'M100,' + yl.toFixed(1) + ' H140 V340 H240 V' + yr.toFixed(1) + ' H280 V420 H100 Z');
  $L('fSol').setAttribute('fill', S.warna);
  const gp = $L('fPar'); gp.innerHTML = '';
  const tanda = S.muatan < 0 ? '−' : '+';
  const nL = Math.max(1, Math.floor((340 - yl) / 18)), nR = Math.max(1, Math.floor((340 - yr) / 18));
  const draw = (x, y) => { svEl('circle', { cx:x, cy:y, r:6, fill:S.warna, stroke:'#fff', 'stroke-width':1.2 }, gp); const t = svEl('text', { x:x, y:y + 3.5, 'text-anchor':'middle', 'font-size':9, 'font-weight':800, fill:'#fff', 'font-family':'Figtree,sans-serif' }, gp); t.textContent = tanda; };
  for (let i = 0; i < nL; i++) draw(120, 332 - i * 18);
  for (let i = 0; i < nR; i++) draw(260, 332 - i * 18);
  for (let i = 0; i < 5; i++) draw(160 + i * 18, 386 - (i % 2) * 12);
  $L('fV').textContent = F.V + ' V';
  const sel = !F.run && F.t >= T_FOR, ada = F.V > 0 && (F.run || sel);
  const kanan = S.muatan < 0;
  const a = $L('fArr'), h = $L('fArrH');
  if (ada) {
    const x1 = kanan ? 160 : 220, x2 = kanan ? 220 : 160;
    a.setAttribute('x1', x1); a.setAttribute('x2', x2); a.setAttribute('opacity', 1);
    h.setAttribute('points', kanan ? '232,376 216,368 216,384' : '148,376 164,368 164,384'); h.setAttribute('opacity', 1);
  } else { a.setAttribute('opacity', 0); h.setAttribute('opacity', 0); }
  $L('fPillT').textContent = S.nama + ' (' + S.ket + ') · ' + F.V + ' V';
  $L('fPill').setAttribute('fill', kanan ? '#25508C' : '#8E3B22');
  // grafik
  const X = v => 370 + v / 40 * 330, Y = mm => 360 - mm / 14 * 260;
  const tk = $L('fTk'); tk.innerHTML = '';
  [0, 10, 20, 30, 40].forEach(v => { const t = svEl('text', { x:X(v), y:376, 'text-anchor':'middle', 'font-size':9, 'font-weight':800, fill:'#AEC0E0', 'font-family':'Figtree,sans-serif' }, tk); t.textContent = v; });
  [0, 7, 14].forEach(v => { svEl('line', { x1:370, y1:Y(v), x2:700, y2:Y(v), stroke:'rgba(255,255,255,.14)', 'stroke-width':1 }, tk); const t = svEl('text', { x:362, y:Y(v) + 3, 'text-anchor':'end', 'font-size':9, 'font-weight':800, fill:'#AEC0E0', 'font-family':'Figtree,sans-serif' }, tk); t.textContent = v; });
  const gpts = $L('fPts'); gpts.innerHTML = '';
  Object.values(SOL).forEach(so => {
    const rs = F.res.filter(r => r.sol === so.id).sort((p, q) => p.V - q.V);
    if (!rs.length) return;
    const d = 'M' + X(0) + ',' + Y(0) + ' ' + rs.map(r => 'L' + X(r.V).toFixed(1) + ',' + Y(r.shift).toFixed(1)).join(' ');
    svEl('path', { d:d, fill:'none', stroke:so.id === 'as2s3' ? '#F2C21B' : '#E07A5F', 'stroke-width':2.5, 'stroke-dasharray':'5 4' }, gpts);
    rs.forEach(r => svEl('circle', { cx:X(r.V), cy:Y(r.shift), r:6, fill:so.id === 'as2s3' ? '#F2C21B' : '#E07A5F', stroke:'#fff', 'stroke-width':2 }, gpts));
  });
  $L('fEq').textContent = S.nama + ' dalam medan listrik, ' + F.V + ' V';
  $L('fInfo').textContent = sel || F.run ? (F.V === 0 ? 'Tanpa tegangan, batas sol tidak bergeser.' : 'Batas sol bergeser ' + labNum(s, 1) + ' mm menuju ' + (kanan ? 'anode (+)' : 'katode (−)')) : 'Pilih tegangan, lalu alirkan listrik.';
  const st = $L('lab-status');
  st.textContent = F.run ? 'Listrik mengalir...' : (sel ? (F.V === 0 ? 'Tidak bergeser' : 'Bergeser ' + labNum(F.shift, 1) + ' mm') : 'Siap'); st.className = 'lab-status ' + (F.run || sel ? 'on' : 'off');
}
function forSelesai(){
  const F = labS.fore, S = SOL[F.sol];
  F.res = F.res.filter(r => !(r.sol === F.sol && r.V === F.V));
  F.res.push({ sol:F.sol, V:F.V, shift:F.shift, ke:S.muatan < 0 ? 'anode' : 'katode' });
}

/* ---------- Render ---------- */
function labRender(){
  const m = labS.mode;
  $L('scKlas').style.display = m === 'klas' ? '' : 'none';
  $L('scKoag').style.display = m === 'koag' ? '' : 'none';
  $L('scFor').style.display = m === 'for' ? '' : 'none';
  labRenderPanel();
  if (m === 'klas') klasDraw(); if (m === 'koag') koagDraw(); if (m === 'for') forDraw();
  labIsiData(); labRenderMisi();
}

/* ---------- Eksekusi ---------- */
function labJalankan(){ if (labS.mode === 'koag') labKoagJalan(); else if (labS.mode === 'for') labForJalan(); }
setInterval(() => {
  const K = labS.klas, G = labS.koag, F = labS.fore;
  if (K.run) {
    K.t += 0.1;
    if (K.t >= T_KLAS) { K.t = T_KLAS; K.run = false; klasSelesai(); labRenderPanel(); labIsiData(); labRenderMisi(); }
    if (labS.mode === 'klas') klasDraw();
  }
  if (G.run) {
    G.t += 0.1;
    if (G.t >= T_KOAG) { G.t = T_KOAG; G.run = false; koagSelesai(); labRenderPanel(); labIsiData(); labRenderMisi(); }
    if (labS.mode === 'koag') koagDraw();
  }
  if (F.run) {
    F.t += 0.1;
    if (F.t >= T_FOR) { F.t = T_FOR; F.run = false; forSelesai(); labRenderPanel(); labIsiData(); labRenderMisi(); }
    if (labS.mode === 'for') forDraw();
  }
}, 100);

/* ---------- Tab Data ---------- */
function labIsiData(){
  const info = $L('d-info'), hit = $L('d-hitung'), it = $L('d-info-t'), ht = $L('d-hitung-t'), am = $L('d-amati');
  const a = [];
  if (labS.mode === 'klas') {
    const K = labS.klas, S = SAMPEL[K.samp], res = K.res[K.samp] || {};
    it.textContent = '🧪 Sampel'; ht.textContent = '🧮 Hasil uji';
    info.innerHTML = '<div class="hasil-baris">' + S.nama + ' (' + S.desc + ')<br>Diameter representatif d ≈ ' + (S.d < 1 ? '0,5' : S.d.toLocaleString('id-ID')) + ' nm<br>Batas: larutan &lt; 1 nm · koloid 1–100 nm · suspensi &gt; 100 nm</div>';
    hit.innerHTML = '<div class="hasil-baris">' + UJI.map(u => u.label + ': ' + (res[u.id] ? '<b>' + res[u.id].t + '</b>' : '—')).join('<br>') + '</div>' + (Object.keys(res).length === 4 ? '<div class="lab-note">Kesimpulan: <b>' + kelasD(S.d) + '</b> (d ≈ ' + (S.d < 1 ? '0,5' : S.d.toLocaleString('id-ID')) + ' nm).</div>' : '');
    a.push('Partikel koloid menghamburkan cahaya, partikel larutan terlalu kecil untuk itu.');
    a.push('Suspensi mengendap dan tertahan kertas saring; koloid tidak, tetapi tertahan selaput dialisis.');
  } else if (labS.mode === 'koag') {
    const G = labS.koag, S = SOL[G.sol], E = ELEK[G.el], sel = !G.run && G.t >= T_KOAG;
    it.textContent = '🧪 Percobaan'; ht.textContent = '🧮 Hasil';
    info.innerHTML = '<div class="hasil-baris">' + S.nama + ' (' + S.ket + '), bermuatan ' + (S.muatan < 0 ? 'negatif' : 'positif') + '<br>Elektrolit: ' + E.nama + ' ' + fmtC(G.c) + ' mmol/L</div>';
    const riwayat = G.res.filter(r => r.sol === G.sol).map(r => ELEK[r.el].nama + ' ' + fmtC(r.c) + ' mmol/L → ' + (r.ok ? 'menggumpal' : 'stabil'));
    hit.innerHTML = '<div class="hasil-baris">' + (sel ? (G.ok ? '<b>Menggumpal</b> pada konsentrasi ini.' : '<b>Tidak menggumpal</b> pada konsentrasi ini.') : 'Tambahkan elektrolit untuk melihat hasil.') + '</div>' + (riwayat.length ? '<div class="lab-note">Riwayat: ' + riwayat.join(' | ') + '</div>' : '');
    a.push('Ion yang efektif berlawanan muatan dengan sol.');
    a.push('Makin tinggi valensi ion, makin rendah konsentrasi yang cukup untuk menggumpalkan sol.');
  } else {
    const F = labS.fore, S = SOL[F.sol];
    it.textContent = '🧪 Elektroforesis'; ht.textContent = '🧮 Data pergeseran';
    info.innerHTML = '<div class="hasil-baris">' + S.nama + ' dalam tabung U<br>Katode (−) di kiri, anode (+) di kanan<br>Tegangan: ' + F.V + ' V, waktu: 10 menit</div>';
    hit.innerHTML = '<div class="hasil-baris">' + (F.res.length ? F.res.slice().sort((p, q) => p.sol.localeCompare(q.sol) || p.V - q.V).map(r => SOL[r.sol].nama + ', ' + r.V + ' V: ' + (r.V === 0 ? 'diam' : labNum(r.shift, 1) + ' mm → ' + r.ke)).join('<br>') : 'Belum ada data.') + '</div><div class="lab-note">Skala pergeseran bersifat ilustratif; pola linear terhadap tegangan sesuai teori.</div>';
    a.push('Arah pergeseran menunjukkan tanda muatan partikel sol.');
    a.push('Pergeseran sebanding dengan tegangan yang diberikan.');
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
  // M1: Tyndall pada koloid
  if (!labS.m1opt) labS.m1opt = labAcak([
    { t:'Partikel koloid cukup besar untuk menghamburkan cahaya, partikel larutan terlalu kecil', b:true },
    { t:'Koloid menyerap seluruh cahaya senter', b:false },
    { t:'Larutan sejati tidak mengandung partikel sama sekali', b:false },
    { t:'Koloid lebih panas daripada larutan', b:false }]);
  const K = labS.klas;
  const ada1 = ['kanji', 'susu'].some(id => K.res[id] && K.res[id].senter);
  labKuis('m1-quiz', labS.misi[0], 'Hamburan cahaya oleh partikel koloid disebut efek Tyndall.', ada1, 'Sorotkan senter ke sol kanji atau susu.',
    'Jalur cahaya senter terlihat jelas dalam sol kanji dan susu, tetapi tidak dalam larutan gula. Mengapa?', labS.m1opt, 'labJawabM1', 'm1', 'm1');
  // M2: penggolongan
  const lengkap = (K.res[K.samp] && Object.keys(K.res[K.samp]).length === 4) ? K.samp : SAMPEL_IDS.find(id => K.res[id] && Object.keys(K.res[id]).length === 4);
  if (lengkap && labS.m2key !== lengkap) {
    labS.m2key = lengkap;
    const benar = kelasD(SAMPEL[lengkap].d);
    labS.m2opt = labAcak([{ t:benar, b:true }].concat(['larutan', 'koloid', 'suspensi'].filter(x => x !== benar).map(t => ({ t, b:false })).concat([{ t:'tidak dapat disimpulkan', b:false }]).slice(0, 3)));
  }
  const rs = lengkap ? K.res[lengkap] : null;
  labS.m2kuis = labKuis('m2-quiz', labS.misi[1], 'Ukuran partikel menentukan jenis campuran.', !!lengkap, 'Lakukan keempat uji pada satu sampel.',
    rs ? 'Hasil uji ' + SAMPEL[lengkap].nama + ': ' + UJI.map(u => u.nama.toLowerCase() + ' → ' + rs[u.id].t).join('; ') + '. Campuran ini tergolong ...' : '', labS.m2opt || [], 'labJawabM2', labS.m2key, labS.m2kuis);
  // M4: Hardy–Schulze
  const G = labS.koag;
  const solM4 = Object.keys(SOL).find(s => new Set(G.res.filter(r => r.sol === s).map(r => r.el)).size >= 3);
  if (solM4 && labS.m4key !== solM4) {
    labS.m4key = solM4;
    labS.m4opt = labAcak([
      { t:'Ion berlawanan muatan dengan valensi lebih tinggi lebih efektif menetralkan muatan koloid (Hardy–Schulze)', b:true },
      { t:'Ion bermuatan sama dengan sol lebih efektif menggumpalkannya', b:false },
      { t:'Semua elektrolit sama efektifnya karena sama-sama larut', b:false },
      { t:'Ion bervalensi lebih rendah selalu lebih efektif', b:false }]);
  }
  const tanyaM4 = solM4 === 'feoh3' ? 'Pada sol Fe(OH)₃, K₃[Fe(CN)₆] menggumpalkan pada konsentrasi jauh lebih rendah daripada NaCl. Mengapa?' : 'Pada sol As₂S₃, AlCl₃ menggumpalkan pada konsentrasi jauh lebih rendah daripada NaCl. Mengapa?';
  labS.m4kuis = labKuis('m4-quiz', labS.misi[3], 'Semakin tinggi valensi ion berlawanan muatan, semakin efektif koagulasinya.', !!solM4, 'Coba ketiga elektrolit pada satu sol.',
    tanyaM4, labS.m4opt || [], 'labJawabM4', labS.m4key, labS.m4kuis);
  // M5: muatan sol
  const F = labS.fore, adaBoth = Object.keys(SOL).every(s => F.res.some(r => r.sol === s && r.V > 0));
  const terakhir = F.res.slice().reverse().find(r => r.V > 0);
  if (adaBoth && terakhir) {
    const key = terakhir.sol + '|' + terakhir.ke;
    if (labS.m5key !== key) { labS.m5key = key; const benar = terakhir.ke === 'anode' ? 'negatif' : 'positif'; labS.m5opt = labAcak([{ t:benar, b:true }, { t:benar === 'negatif' ? 'positif' : 'negatif', b:false }, { t:'netral', b:false }, { t:'bergantung pada warna sol', b:false }]); }
  }
  labS.m5kuis = labKuis('m5-quiz', labS.misi[4], 'Sol bermuatan berlawanan dengan elektrode tujuannya.', adaBoth && !!terakhir, 'Jalankan elektroforesis (V > 0) untuk kedua sol.',
    terakhir ? SOL[terakhir.sol].nama + ' bergeser menuju ' + (terakhir.ke === 'anode' ? 'anode (+)' : 'katode (−)') + '. Muatan partikel sol tersebut ...' : '', labS.m5opt || [], 'labJawabM5', labS.m5key, labS.m5kuis);
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
function labJawabM1(i){ labJawab('m1-quiz', labS.m1opt, i, 'm1-fb', 'Tepat! Itulah efek Tyndall.', 'Belum tepat. Pikirkan ukuran partikel dibandingkan panjang gelombang cahaya.', 0, '🎉 Misi 1 selesai! Kamu memahami efek Tyndall.'); }
function labJawabM2(i){ labJawab('m2-quiz', labS.m2opt, i, 'm2-fb', 'Benar! Gabungkan semua hasil uji untuk menggolongkan campuran.', 'Belum tepat. Periksa hasil uji: Tyndall, pengendapan, kertas saring, dan selaput.', 1, '🎉 Misi 2 selesai! Kamu bisa menggolongkan campuran.'); }
function labJawabM4(i){ labJawab('m4-quiz', labS.m4opt, i, 'm4-fb', 'Tepat! Itulah aturan Hardy–Schulze.', 'Belum tepat. Perhatikan muatan sol, lalu bandingkan valensi ion penggumpal.', 3, '🎉 Misi 4 selesai! Kamu memahami aturan Hardy–Schulze.'); }
function labJawabM5(i){ labJawab('m5-quiz', labS.m5opt, i, 'm5-fb', 'Benar! Partikel bermuatan menuju elektrode yang berlawanan muatan.', 'Belum tepat. Partikel tertarik ke elektrode yang muatannya berlawanan.', 4, '🎉 Misi 5 selesai! Kamu bisa menentukan muatan sol.'); }

/* ---------- LKPD, reset, toast, selesai ---------- */
function labCatat(){
  labS.catatNo++;
  const item = document.createElement('div'); item.className = 'lab-log-item';
  let isi = '';
  if (labS.mode === 'klas') { const K = labS.klas, S = SAMPEL[K.samp], res = K.res[K.samp] || {}; isi = '<b>Uji campuran</b> · ' + S.nama + ' (d ≈ ' + (S.d < 1 ? '0,5' : S.d) + ' nm)<br>' + UJI.map(u => u.nama + ': ' + (res[u.id] ? res[u.id].t : '—')).join(' · '); }
  else if (labS.mode === 'koag') { const G = labS.koag, last = G.res.filter(r => r.sol === G.sol).slice(-1)[0]; isi = '<b>Koagulasi</b> · ' + SOL[G.sol].nama + '<br>' + (last ? ELEK[last.el].nama + ' ' + fmtC(last.c) + ' mmol/L → ' + (last.ok ? 'menggumpal' : 'stabil') : 'belum ada percobaan'); }
  else { const F = labS.fore, last = F.res.filter(r => r.sol === F.sol).slice(-1)[0]; isi = '<b>Elektroforesis</b> · ' + SOL[F.sol].nama + '<br>' + (last ? last.V + ' V → ' + (last.V === 0 ? 'diam' : labNum(last.shift, 1) + ' mm menuju ' + last.ke) : 'belum ada percobaan'); }
  item.innerHTML = '<b>No. ' + labS.catatNo + '</b> · ' + isi;
  const log = $L('lab-log'); log.insertBefore(item, log.firstChild);
  while (log.children.length > 10) log.removeChild(log.lastChild);
  labToast('📓 Pengamatan berhasil dicatat ke LKPD!');
}
function labReset(){
  labS.mode = 'klas';
  labS.klas = { samp:'kanji', res:{}, last:null, run:false, t:0, bangun:'' };
  labS.koag = { sol:'as2s3', el:'alcl3', c:0.1, res:[], run:false, t:0, bangun:'', ok:null };
  labS.fore = { sol:'as2s3', V:20, res:[], run:false, t:0, shift:0 };
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
  else if (s >= 60) kal = 'Bagus! Terus berlatih menganalisis sistem koloid.';
  else kal = 'Ayo selesaikan semua misi untuk meraih skor penuh!';
  $L('lab-akhir-kal').textContent = kal;
  openModal('modal-lab'); sfx('win');
}

(function labInit(){
  if (!$L('scr-lab')) return;
  labRender(); labUpdateMisiCount();
})();
