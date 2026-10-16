/* ##############################################################
   #  LAB MAYA — PRAKTIKUM VIRTUAL KELARUTAN DAN Ksp            #
   #  Tiga eksperimen: kelarutan dan ion senama, pengendapan    #
   #  (Qsp terhadap Ksp), dan pengaruh pH pada Mg(OH)₂.         #
   #  Nilai Ksp dibulatkan untuk keperluan pembelajaran.        #
   ############################################################## */
const LAB_NS = 'http://www.w3.org/2000/svg';
const $L = id => document.getElementById(id);

/* ---------- Data ---------- */
const SALTS = {
  agcl:    { id:'agcl',    nama:'AgCl',    m:1, n:1, cat:'Ag⁺',  an:'Cl⁻',    ksp:1.0e-10, warna:'#F4F6FA', senama:'NaCl',   kspF:'[Ag⁺][Cl⁻]',      katSol:'AgNO₃',   anSol:'NaCl',    eq:'AgCl(s) ⇌ Ag⁺ + Cl⁻',                  rx:'AgNO₃ + NaCl → AgCl↓ + NaNO₃' },
  ag2cro4: { id:'ag2cro4', nama:'Ag₂CrO₄', m:2, n:1, cat:'Ag⁺',  an:'CrO₄²⁻', ksp:4.0e-12, warna:'#B5423A', senama:'Na₂CrO₄', kspF:'[Ag⁺]²[CrO₄²⁻]', katSol:'AgNO₃',   anSol:'Na₂CrO₄', eq:'Ag₂CrO₄(s) ⇌ 2Ag⁺ + CrO₄²⁻',            rx:'2AgNO₃ + Na₂CrO₄ → Ag₂CrO₄↓ + 2NaNO₃' },
  caf2:    { id:'caf2',    nama:'CaF₂',    m:1, n:2, cat:'Ca²⁺', an:'F⁻',     ksp:3.2e-11, warna:'#F4F6FA', senama:'NaF',    kspF:'[Ca²⁺][F⁻]²',     katSol:'Ca(NO₃)₂', anSol:'NaF',     eq:'CaF₂(s) ⇌ Ca²⁺ + 2F⁻',                  rx:'Ca(NO₃)₂ + 2NaF → CaF₂↓ + 2NaNO₃' },
  mgoh2:   { id:'mgoh2',   nama:'Mg(OH)₂', m:1, n:2, cat:'Mg²⁺', an:'OH⁻',    ksp:1.0e-11, warna:'#F4F6FA', senama:'NaOH',   kspF:'[Mg²⁺][OH⁻]²',    katSol:'Mg(NO₃)₂', anSol:'NaOH',    eq:'Mg(OH)₂(s) ⇌ Mg²⁺ + 2OH⁻',              rx:'Mg(NO₃)₂ + 2NaOH → Mg(OH)₂↓ + 2NaNO₃' },
  pbi2:    { id:'pbi2',    nama:'PbI₂',    m:1, n:2, cat:'Pb²⁺', an:'I⁻',     ksp:4.0e-9,  warna:'#F2C21B', senama:'KI',     kspF:'[Pb²⁺][I⁻]²',     katSol:'Pb(NO₃)₂', anSol:'KI',      rx:'Pb(NO₃)₂ + 2KI → PbI₂↓ + 2KNO₃', eq:'PbI₂(s) ⇌ Pb²⁺ + 2I⁻' }
};
const SALT_IDS = ['agcl','ag2cro4','caf2','mgoh2','pbi2'];
const C_SEN = [0, 0.001, 0.01, 0.1];
const C_MIX = [1e-6, 1e-5, 1e-4, 1e-3, 1e-2];
const PH_C0 = [0.001, 0.01, 0.1], PH_VAL = [8, 9, 9.5, 10, 11];
const KSP_MG = 1.0e-11;
const LAB_MODE = [
  { id:'kel', nama:'Kelarutan',   kerja:'Ukur kelarutan' },
  { id:'qsp', nama:'Pengendapan', kerja:'Campurkan (50 mL + 50 mL)' },
  { id:'ph',  nama:'pH',          kerja:'' }
];
const SUP = { '0':'⁰','1':'¹','2':'²','3':'³','4':'⁴','5':'⁵','6':'⁶','7':'⁷','8':'⁸','9':'⁹','-':'⁻' };

const labS = {
  mode:'kel',
  kel:{ salt:'agcl', c:0 }, kelAnim:0, kelRun:false, kelRuns:[],
  qsp:{ salt:'agcl', c1:1e-4, c2:1e-4 }, qspAnim:0, qspRun:false, qspRuns:[], qspLast:null,
  ph:{ c0:0.01, pH:9.5 }, phSet:[],
  mikro:false, catatNo:0,
  misi:[false,false,false,false,false], skor:0, m2opt:null, m4opt:null, m4key:'', m5opt:null, m5key:''
};

/* ---------- Utilitas ---------- */
function svEl(tag, attrs, parent){
  const e = document.createElementNS(LAB_NS, tag);
  for (const k in attrs) e.setAttribute(k, attrs[k]);
  if (parent) parent.appendChild(e);
  return e;
}
function labNum(v, d){ return Number(v).toFixed(d).replace('.', ','); }
function labKlem(v, a, b){ return Math.max(a, Math.min(b, v)); }
function labAcak(arr){ for (let i = arr.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [arr[i], arr[j]] = [arr[j], arr[i]]; } return arr; }
function labRng(seed){ let s = seed >>> 0; return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; }; }
function sci(v, d){
  d = d === undefined ? 1 : d;
  if (!(v > 0)) return '0';
  let e = Math.floor(Math.log10(v)), m = Number((v / Math.pow(10, e)).toFixed(d));
  if (m >= 10) { m /= 10; e++; }
  const ms = Number.isInteger(m) ? String(m) : m.toFixed(d).replace('.', ',');
  return ms + '×10' + String(e).split('').map(c => SUP[c]).join('');
}
function sciP(e){ return '10' + String(e).split('').map(c => SUP[c]).join(''); }
function labTitik(n, x0, x1, y0, y1, seed, gap){
  let g = gap, pts = [];
  for (let a = 0; a < 8; a++) {
    const r = labRng(seed + a * 101); pts = []; let t = 0;
    while (pts.length < n && t < 4000) { t++; const x = x0 + r() * (x1 - x0), y = y0 + r() * (y1 - y0); if (pts.every(p => (p[0] - x) ** 2 + (p[1] - y) ** 2 > g * g)) pts.push([x, y]); }
    if (pts.length >= n) break;
    g = Math.max(5, g - 2);
  }
  while (pts.length < n) pts.push([x0 + Math.random() * (x1 - x0), y0 + Math.random() * (y1 - y0)]);
  return pts;
}

/* ---------- Perhitungan ---------- */
function s0(S){ return Math.pow(S.ksp / (Math.pow(S.m, S.m) * Math.pow(S.n, S.n)), 1 / (S.m + S.n)); }
function sCommon(S, c){
  if (!c) return s0(S);
  let lo = 1e-30, hi = s0(S);
  for (let i = 0; i < 200; i++) {
    const mid = Math.sqrt(lo * hi);
    if (Math.pow(S.m * mid, S.m) * Math.pow(S.n * mid + c, S.n) > S.ksp) hi = mid; else lo = mid;
  }
  return Math.sqrt(lo * hi);
}
function qspHitung(){
  const P = labS.qsp, S = SALTS[P.salt], cc = P.c1 / 2, ca = P.c2 / 2;
  const Q = Math.pow(cc, S.m) * Math.pow(ca, S.n);
  const rel = (Q - S.ksp) / S.ksp;
  return { S, cc, ca, Q, status: Math.abs(rel) < 1e-6 ? 'tepat' : (Q > S.ksp ? 'endap' : 'belum') };
}
function phHitung(){
  const { c0, pH } = labS.ph, OH = Math.pow(10, pH - 14), Q = c0 * OH * OH, csat = KSP_MG / (OH * OH);
  const endap = Q > KSP_MG * (1 + 1e-6);
  return { c0, pH, OH, Q, csat, endap, tepat: !endap && Math.abs(Q - KSP_MG) / KSP_MG < 1e-6, frac: endap ? 1 - csat / c0 : 0, pHmin: 14 + 0.5 * Math.log10(KSP_MG / c0) };
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
  if (labS.mikro) labToast('🔬 Label ion dan padatan ditampilkan.');
}

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
function labGantiMode(id){ labS.mode = id; labRender(); }
function labRenderPanel(){
  const gm = $L('grid-mode'); gm.innerHTML = '';
  LAB_MODE.forEach(m => labChip(gm, m.nama, '', labS.mode === m.id, () => labGantiMode(m.id)));
  $L('rakit-dyn').innerHTML = '';
  const rb = $L('run-btn');
  if (labS.mode === 'kel') {
    const K = labS.kel, S = SALTS[K.salt];
    const g1 = labSec('🧪 Garam sukar larut', '', 'rx-grid cols5');
    SALT_IDS.forEach(id => labChip(g1, SALTS[id].nama, '', K.salt === id, () => labKelPilih('salt', id)));
    const g2 = labSec('💧 Ion senama', S.senama + ' (M)', 'rx-grid cols4');
    C_SEN.forEach(c => labChip(g2, c === 0 ? '0' : sciP(Math.round(Math.log10(c))), '', K.c === c, () => labKelPilih('c', c)));
    rb.style.display = ''; rb.disabled = labS.kelRun; rb.textContent = labS.kelRun ? '⏳ Melarut...' : (labS.kelAnim >= 3 ? '↻ Ukur ulang kelarutan' : '▶ Ukur kelarutan');
  } else if (labS.mode === 'qsp') {
    const P = labS.qsp, S = SALTS[P.salt];
    const g1 = labSec('🧪 Garam yang terbentuk', '', 'rx-grid cols5');
    SALT_IDS.forEach(id => labChip(g1, SALTS[id].nama, '', P.salt === id, () => labQspPilih('salt', id)));
    const g2 = labSec('🟠 ' + S.katSol, 'M (50 mL)', 'rx-grid cols5');
    C_MIX.forEach(c => labChip(g2, sciP(Math.round(Math.log10(c))), '', P.c1 === c, () => labQspPilih('c1', c)));
    const g3 = labSec('🔵 ' + S.anSol, 'M (50 mL)', 'rx-grid cols5');
    C_MIX.forEach(c => labChip(g3, sciP(Math.round(Math.log10(c))), '', P.c2 === c, () => labQspPilih('c2', c)));
    rb.style.display = ''; rb.disabled = labS.qspRun; rb.textContent = labS.qspRun ? '⏳ Mencampur...' : (labS.qspAnim >= 3.5 ? '↻ Campurkan lagi' : '▶ Campurkan (50 mL + 50 mL)');
  } else {
    const H = labS.ph;
    const g1 = labSec('🧪 [Mg²⁺] awal', 'M', 'rx-grid');
    PH_C0.forEach(c => labChip(g1, labNum(c, 3), '', H.c0 === c, () => labPhPilih('c0', c)));
    const g2 = labSec('🧴 pH larutan', 'diatur dengan NaOH/HCl', 'rx-grid cols5');
    PH_VAL.forEach(v => labChip(g2, labNum(v, v % 1 ? 1 : 0), '', H.pH === v, () => labPhPilih('pH', v)));
    rb.style.display = 'none';
  }
}

/* ---------- Kelarutan: pembangunan dan gambar ---------- */
function kelJumlahIon(s){ return labKlem(Math.round(2 + (Math.log10(s) + 9) / 6 * 20), 2, 24); }
function labKelPilih(k, v){ labS.kel[k] = v; labS.kelAnim = 0; labS.kelRun = false; labS.kelBangun = ''; labRender(); }
function kelBangun(){
  const K = labS.kel, S = SALTS[K.salt], key = K.salt + '|' + K.c;
  if (labS.kelBangun === key) return;
  labS.kelBangun = key;
  const sol = $L('kSol'), ion = $L('kIon'), ext = $L('kExt');
  sol.innerHTML = ''; ion.innerHTML = ''; ext.innerHTML = '';
  labTitik(22, 94, 266, 384, 404, 5 + K.salt.length, 12).forEach((p, i) => {
    svEl('rect', { x:p[0] - 6, y:p[1] - 5, width:12, height:10, rx:2, fill:S.warna, stroke:'#8795AD', 'stroke-width':1, transform:'rotate(' + (i * 31 % 40 - 20) + ' ' + p[0] + ' ' + p[1] + ')' }, sol);
  });
  const sc = sCommon(S, K.c), nC = kelJumlahIon(sc), nA = Math.min(34, Math.round(nC * S.n / S.m)), nE = K.c === 0 ? 0 : Math.round(4 + (Math.log10(K.c) + 3) * 4);
  labS.kelN = { nC, nA, nE };
  const buat = (grup, pts, fn, labelTeks) => pts.forEach((p, i) => {
    const o = svEl('g', { transform:'translate(' + p[0].toFixed(1) + ',' + p[1].toFixed(1) + ')', 'data-i':i }, grup);
    const f = svEl('g', { class:'ion-g', style:'animation-delay:' + ((i * .37) % 4).toFixed(2) + 's;animation-duration:' + (3 + (i % 3) * .5) + 's' }, o);
    fn(f);
    if (i === 0 && labelTeks) { const t = svEl('text', { class:'lbl', y:-10, 'text-anchor':'middle' }, f); t.textContent = labelTeks; }
  });
  const pts = labTitik(nC + nA + nE, 92, 268, 190, 372, 17 + K.salt.length + Math.round(K.c * 1000), 15);
  buat(ion, pts.slice(0, nC), f => svEl('circle', { r:5.5, fill:'#FFA566', stroke:'#fff', 'stroke-width':1.2 }, f), S.cat);
  buat(ion, pts.slice(nC, nC + nA), f => svEl('rect', { x:-4.5, y:-4.5, width:9, height:9, rx:2, fill:'#8EC1FF', stroke:'#fff', 'stroke-width':1.2 }, f), S.an);
  buat(ext, pts.slice(nC + nA), f => svEl('rect', { x:-4.5, y:-4.5, width:9, height:9, rx:2, fill:'#CFE4FF', stroke:'#FFC21A', 'stroke-width':1.6 }, f), S.an + ' dari ' + S.senama);
  $L('kEq').textContent = S.eq;
}
function kelDraw(){
  const K = labS.kel, S = SALTS[K.salt];
  kelBangun();
  const f = labKlem(labS.kelAnim / 3, 0, 1), fe = f * f * (3 - 2 * f);
  const s1 = s0(S), s2 = sCommon(S, K.c);
  const vis = (grup, pre, tot) => grup.querySelectorAll(':scope > g').forEach((g, i) => { g.style.display = i < Math.round(tot * fe) ? '' : 'none'; });
  const N = labS.kelN || { nC:0, nA:0, nE:0 };
  const gi = $L('kIon').querySelectorAll(':scope > g');
  gi.forEach((g, i) => { g.style.display = i < Math.round((N.nC + N.nA) * fe) ? '' : 'none'; });
  vis($L('kExt'), 0, N.nE);
  $L('kSol').setAttribute('opacity', (1 - 0.35 * fe).toFixed(2));
  $L('kPillT').textContent = K.c === 0 ? 'AIR MURNI' : S.senama + ' ' + labNum(K.c, 3) + ' M';
  $L('kPill').setAttribute('fill', K.c === 0 ? '#25508C' : '#F26A21');
  const px = v => 340 + (Math.log10(v) + 10) / 8 * 360;
  const w1 = (px(s1) - 340) * fe, w2 = (px(s2) - 340) * fe;
  $L('kB1').setAttribute('width', Math.max(0, w1).toFixed(1)); $L('kB2').setAttribute('width', Math.max(0, w2).toFixed(1));
  $L('kN2').textContent = K.c === 0 ? 'larutan terpilih (sama: air murni)' : 'dalam ' + S.senama + ' ' + labNum(K.c, 3) + ' M';
  $L('kV1').setAttribute('x', Math.min(340 + w1 + 6, 640)); $L('kV1').textContent = f > 0.05 ? sci(s1) + ' M' : ' ';
  $L('kV2').setAttribute('x', Math.min(340 + w2 + 6, 640)); $L('kV2').textContent = f > 0.05 ? sci(s2) + ' M' : ' ';
  // kurva s terhadap konsentrasi ion senama
  const xs = [350, 463, 577, 690], py = v => 376 - (Math.log10(v) + 10) / 8 * 136;
  const ys = C_SEN.map(c => py(sCommon(S, c)));
  $L('kCurve').setAttribute('d', xs.map((x, i) => (i ? 'L' : 'M') + x + ',' + ys[i].toFixed(1)).join(' '));
  const dots = $L('kDots'); dots.innerHTML = '';
  xs.forEach((x, i) => svEl('circle', { cx:x, cy:ys[i].toFixed(1), r:4, fill:'#FFC21A' }, dots));
  const ci = C_SEN.indexOf(K.c); $L('kCur').setAttribute('cx', xs[ci]); $L('kCur').setAttribute('cy', ys[ci].toFixed(1));
  $L('kKsp').textContent = 'Ksp ' + S.nama + ' = ' + sci(S.ksp);
  $L('kRes').textContent = 'Ksp = ' + S.kspF + (labS.kelAnim >= 3 ? '  ·  s = ' + sci(s2) + ' M' : '');
  const st = $L('lab-status');
  st.textContent = labS.kelRun ? 'Melarut...' : (labS.kelAnim >= 3 ? 'Jenuh · s = ' + sci(s2) + ' M' : 'Siap diukur'); st.className = 'lab-status ' + (labS.kelRun || labS.kelAnim >= 3 ? 'on' : 'off');
}

/* ---------- Pengendapan ---------- */
function labQspPilih(k, v){ labS.qsp[k] = v; labS.qspAnim = 0; labS.qspRun = false; labS.qspBangun = ''; labRender(); }
function qspBangun(){
  const P = labS.qsp, S = SALTS[P.salt], key = [P.salt, P.c1, P.c2].join('|');
  if (labS.qspBangun === key) return;
  labS.qspBangun = key;
  $L('qNA').textContent = S.katSol; $L('qNB').textContent = S.anSol;
  $L('qCA').textContent = sci(P.c1) + ' M'; $L('qCB').textContent = sci(P.c2) + ' M';
  $L('qEq').textContent = S.rx;
  const sol = $L('qSol'), flk = $L('qFlk'); sol.innerHTML = ''; flk.innerHTML = '';
  labTitik(34, 62, 218, 386, 404, 7 + P.salt.length, 9).forEach((p, i) => svEl('rect', { x:p[0] - 4, y:p[1] - 3.5, width:8, height:7, rx:1.5, fill:S.warna, stroke:'#8795AD', 'stroke-width':.8 }, sol));
  labTitik(26, 62, 218, 300, 380, 11 + P.salt.length, 14).forEach((p, i) => {
    const o = svEl('g', { transform:'translate(' + p[0].toFixed(1) + ',' + p[1].toFixed(1) + ')' }, flk);
    const f = svEl('g', { class:'ion-g', style:'animation-delay:' + ((i * .33) % 4).toFixed(2) + 's' }, o);
    svEl('rect', { x:-3.5, y:-3.5, width:7, height:7, rx:1.5, fill:S.warna, 'fill-opacity':.9 }, f);
  });
  qspTick();
}
function qspTick(){
  const g = $L('qTick'); g.innerHTML = '';
  [-14, -12, -10, -8, -6].forEach(l => {
    const x = 290 + (l + 14) / 8 * 410;
    svEl('line', { x1:x, y1:150, x2:x, y2:156, stroke:'#AEC0E0', 'stroke-width':2 }, g);
    const t = svEl('text', { x, y:168, 'text-anchor':'middle', 'font-size':9, 'font-weight':800, fill:'#AEC0E0', 'font-family':'Figtree,sans-serif' }, g); t.textContent = sciP(l);
  });
}
function qspDraw(){
  const P = labS.qsp, S = SALTS[P.salt], R = qspHitung();
  qspBangun();
  const ts = labS.qspAnim, sel = ts >= 3.5, run = labS.qspRun;
  $L('qPA').setAttribute('opacity', run && ts < 1.6 ? 1 : 0); $L('qPB').setAttribute('opacity', run && ts < 1.6 ? 1 : 0);
  const lvl = labKlem(ts / 1.6, 0, 1);
  $L('qLiq').setAttribute('y', (408 - 116 * (0.3 + 0.7 * lvl)).toFixed(1)); $L('qLiq').setAttribute('height', (116 * (0.3 + 0.7 * lvl)).toFixed(1));
  const kuat = R.status === 'endap' ? labKlem(Math.log10(R.Q / S.ksp) / 3, 0.15, 1) : 0;
  const g = labKlem((ts - 1.6) / 1.9, 0, 1);
  const nSol = Math.round(34 * kuat * g), nFlk = Math.round(26 * kuat * (g < 1 ? g : 1));
  $L('qSol').querySelectorAll(':scope > rect').forEach((r, i) => { r.style.display = i < nSol ? '' : 'none'; });
  $L('qFlk').querySelectorAll(':scope > g').forEach((r, i) => { r.style.display = i < nFlk ? '' : 'none'; });
  $L('qLiq').setAttribute('fill', R.status === 'endap' && g > 0.1 && S.id === 'pbi2' ? 'rgba(242,194,27,.28)' : 'rgba(156,201,255,.34)');
  const px = v => 290 + (Math.log10(v) + 14) / 8 * 410, xk = px(S.ksp);
  $L('qZ1').setAttribute('width', (xk - 290).toFixed(1)); $L('qZ2').setAttribute('x', xk.toFixed(1)); $L('qZ2').setAttribute('width', (700 - xk).toFixed(1));
  $L('qZt1').setAttribute('x', ((290 + xk) / 2).toFixed(1)); $L('qZt2').setAttribute('x', ((xk + 700) / 2).toFixed(1));
  $L('qKsp').setAttribute('points', xk + ',150 ' + (xk - 6) + ',162 ' + (xk + 6) + ',162'); $L('qKspT').setAttribute('x', xk); $L('qKspT').setAttribute('y', 182);
  const xq = px(R.Q), vis = sel ? 1 : 0;
  $L('qQ').setAttribute('points', xq + ',150 ' + (xq - 6) + ',140 ' + (xq + 6) + ',140'); $L('qQ').setAttribute('opacity', vis);
  $L('qQT').setAttribute('x', xq); $L('qQT').setAttribute('y', 134); $L('qQT').setAttribute('opacity', vis);
  $L('qL1').textContent = sel ? 'Setelah dicampur: [' + S.cat + '] = ' + sci(R.cc) + ' M · [' + S.an + '] = ' + sci(R.ca) + ' M' : (run ? 'Larutan sedang dicampur...' : 'Jalankan untuk mencampur larutan.');
  $L('qL2').textContent = sel ? 'Qsp = ' + S.kspF + ' = ' + sci(R.Q, 2) : ' ';
  $L('qL3').textContent = sel ? 'Ksp = ' + sci(S.ksp) : ' ';
  const v = $L('qL4');
  if (sel) {
    v.textContent = R.status === 'endap' ? 'Qsp > Ksp → MENGENDAP' : (R.status === 'tepat' ? 'Qsp = Ksp → tepat jenuh' : 'Qsp < Ksp → tidak mengendap');
    v.setAttribute('fill', R.status === 'endap' ? '#FFB27A' : (R.status === 'tepat' ? '#4ADE80' : '#8EC1FF'));
  } else v.textContent = ' ';
  $L('qPillT').textContent = sel ? (R.status === 'endap' ? 'ADA ENDAPAN' : 'TANPA ENDAPAN') : '50 mL + 50 mL';
  const st = $L('lab-status');
  st.textContent = run ? 'Mencampur...' : (sel ? (R.status === 'endap' ? 'Mengendap ✓' : 'Tidak mengendap') : 'Siap dicampur'); st.className = 'lab-status ' + (run || sel ? 'on' : 'off');
}

/* ---------- pH ---------- */
function phBangun(){
  if (labS.phBangun) return; labS.phBangun = true;
  const sol = $L('pSol'); sol.innerHTML = '';
  labTitik(34, 72, 228, 384, 404, 3, 9).forEach(p => svEl('rect', { x:p[0] - 5, y:p[1] - 4, width:10, height:8, rx:2, fill:'#F4F6FA', stroke:'#8795AD', 'stroke-width':.9 }, sol));
}
function phDraw(){
  phBangun();
  const H = phHitung();
  const nF = Math.round(34 * H.frac);
  $L('pSol').querySelectorAll(':scope > rect').forEach((r, i) => { r.style.display = i < nF ? '' : 'none'; });
  const ion = $L('pIon'); ion.innerHTML = '';
  const nMg = H.endap ? 5 : 9, nOH = Math.round(3 + (H.pH - 8) * 3);
  labTitik(nMg + nOH, 76, 224, 190, 372 - Math.round(H.frac * 24), 21, 15).forEach((p, i) => {
    const o = svEl('g', { transform:'translate(' + p[0].toFixed(1) + ',' + p[1].toFixed(1) + ')' }, ion);
    const f = svEl('g', { class:'ion-g', style:'animation-delay:' + ((i * .31) % 4).toFixed(2) + 's' }, o);
    if (i < nMg) svEl('circle', { r:5.5, fill:'#FFA566', stroke:'#fff', 'stroke-width':1.2 }, f); else svEl('rect', { x:-4.5, y:-4.5, width:9, height:9, rx:2, fill:'#8EC1FF', stroke:'#fff', 'stroke-width':1.2 }, f);
    if (i === 0) { const t = svEl('text', { class:'lbl', y:-10, 'text-anchor':'middle' }, f); t.textContent = 'Mg²⁺'; }
    if (i === nMg) { const t = svEl('text', { class:'lbl', y:-10, 'text-anchor':'middle' }, f); t.textContent = 'OH⁻'; }
  });
  const warna = ['#3BA55D','#2FAF8F','#2E9BD6','#3B6FE0','#5A55D6','#7B4FC9','#9546B8'];
  const idx = labKlem(Math.round(H.pH) - 7, 0, 6);
  $L('pLiq').setAttribute('fill', warna[idx]); $L('pLiq').setAttribute('fill-opacity', .42);
  $L('pPillT').textContent = 'pH ' + labNum(H.pH, H.pH % 1 ? 1 : 0) + ' · ' + (H.endap ? labNum(H.frac * 100, 0) + '% mengendap' : (H.tepat ? 'tepat jenuh' : 'larut'));
  const xm = 290 + (H.pH - 7) * 58;
  $L('pMk').setAttribute('points', xm + ',90 ' + (xm - 7) + ',78 ' + (xm + 7) + ',78');
  $L('pMkT').setAttribute('x', xm); $L('pMkT').setAttribute('y', 150); $L('pMkT').textContent = 'pH ' + labNum(H.pH, H.pH % 1 ? 1 : 0);
  const X = p => 300 + (p - 8) / 4 * 396, Y = lg => 206 + (1 - lg) / 8 * 164;
  let d = ''; for (let p = 8; p <= 12.001; p += 0.25) d += (p === 8 ? 'M' : 'L') + X(p).toFixed(1) + ',' + Y(17 - 2 * p).toFixed(1);
  $L('pCurve').setAttribute('d', d);
  const yc = Y(Math.log10(H.c0)); $L('pLn').setAttribute('y1', yc); $L('pLn').setAttribute('y2', yc); $L('pLnT').setAttribute('y', yc - 6); $L('pLnT').textContent = '[Mg²⁺] awal = ' + labNum(H.c0, 3) + ' M';
  $L('pCur').setAttribute('cx', X(H.pH)); $L('pCur').setAttribute('cy', yc);
  $L('pEq').textContent = 'Mg(OH)₂(s) ⇌ Mg²⁺ + 2OH⁻   Ksp = ' + sci(KSP_MG);
  $L('pInfo').textContent = '[OH⁻] = ' + sci(H.OH, 2) + ' M · Qsp = ' + sci(H.Q, 2) + ' → ' + (H.endap ? 'Qsp > Ksp, mengendap' : (H.tepat ? 'Qsp = Ksp, tepat jenuh' : 'Qsp < Ksp, larut'));
  const st = $L('lab-status'); st.textContent = H.endap ? 'Mengendap ' + labNum(H.frac * 100, 0) + '%' : (H.tepat ? 'Tepat jenuh' : 'Larut sempurna'); st.className = 'lab-status ' + (H.endap ? 'on' : 'off');
}
function labPhPilih(k, v){
  labS.ph[k] = v;
  if (k === 'pH' && !labS.phSet.includes(v)) labS.phSet.push(v);
  labRender();
}

/* ---------- Render ---------- */
function labRender(){
  const m = labS.mode;
  $L('scKel').style.display = m === 'kel' ? '' : 'none';
  $L('scQsp').style.display = m === 'qsp' ? '' : 'none';
  $L('scPh').style.display = m === 'ph' ? '' : 'none';
  labRenderPanel();
  if (m === 'kel') kelDraw(); if (m === 'qsp') qspDraw(); if (m === 'ph') phDraw();
  labIsiData(); labRenderMisi();
}

/* ---------- Eksekusi ---------- */
function labJalankan(){
  if (labS.mode === 'kel') { if (labS.kelRun) return; labS.kelAnim = 0; labS.kelRun = true; labRenderPanel(); sfx('click'); }
  else if (labS.mode === 'qsp') { if (labS.qspRun) return; labS.qspAnim = 0; labS.qspRun = true; labRenderPanel(); sfx('click'); }
}
function kelSelesai(){
  const K = labS.kel, S = SALTS[K.salt];
  labS.kelRuns.push({ salt:K.salt, c:K.c, s:sCommon(S, K.c) });
  const adaAir = labS.kelRuns.some(r => r.salt === K.salt && r.c === 0), adaSen = labS.kelRuns.some(r => r.salt === K.salt && r.c > 0);
  if (!labS.misi[0] && adaAir && adaSen) { labS.misi[0] = true; labSkor(20, '🎉 Misi 1 selesai! Ion senama menurunkan kelarutan ' + S.nama + '.'); }
}
function qspSelesai(){
  const R = qspHitung(), P = labS.qsp;
  labS.qspLast = { salt:P.salt, c1:P.c1, c2:P.c2, Q:R.Q, status:R.status, ksp:R.S.ksp };
  labS.qspRuns.push(labS.qspLast);
  const lst = labS.qspRuns.filter(r => r.salt === P.salt);
  if (!labS.misi[2] && lst.some(r => r.status === 'endap') && lst.some(r => r.status === 'belum')) { labS.misi[2] = true; labSkor(20, '🎉 Misi 3 selesai! Kamu menemukan batas pengendapan ' + SALTS[P.salt].nama + '.'); }
}
setInterval(() => {
  if (labS.kelRun) {
    labS.kelAnim += 0.1;
    if (labS.kelAnim >= 3) { labS.kelAnim = 3; labS.kelRun = false; kelSelesai(); labRenderPanel(); labIsiData(); labRenderMisi(); }
    if (labS.mode === 'kel') kelDraw();
  }
  if (labS.qspRun) {
    labS.qspAnim += 0.1;
    if (labS.qspAnim >= 3.5) { labS.qspAnim = 3.5; labS.qspRun = false; qspSelesai(); labRenderPanel(); labIsiData(); labRenderMisi(); }
    if (labS.mode === 'qsp') qspDraw();
  }
}, 100);

/* ---------- Tab Data ---------- */
function labIsiData(){
  const info = $L('d-info'), hit = $L('d-hitung'), it = $L('d-info-t'), ht = $L('d-hitung-t'), am = $L('d-amati');
  const a = [];
  if (labS.mode === 'kel') {
    const K = labS.kel, S = SALTS[K.salt], s1 = s0(S), s2 = sCommon(S, K.c), rel = { 1:'s²', 4:'4s³' }, tipe = S.m + S.n === 2 ? 'Ksp = s²' : 'Ksp = 4s³';
    it.textContent = '🧪 Garam dan pelarut'; ht.textContent = '🧮 Kelarutan (s)';
    info.innerHTML = '<div class="hasil-baris">' + S.eq + '<br>Ksp = ' + S.kspF + ' = ' + sci(S.ksp) + '<br>Tipe garam: ' + tipe + '<br>Pelarut: ' + (K.c === 0 ? 'air murni' : S.senama + ' ' + labNum(K.c, 3) + ' M (ion senama ' + S.an + ')') + '</div>';
    hit.innerHTML = '<div class="hasil-baris">s (air murni) = <b>' + sci(s1) + ' M</b><br>' + (K.c > 0 ? 's (ion senama) = <b>' + sci(s2) + ' M</b><br>Penurunan: ×' + sci(s2 / s1) + '<br>' : '') + '</div>' +
      (labS.kelRuns.length ? '<div class="lab-note">Hasil ukur: ' + labS.kelRuns.slice(-4).map(r => SALTS[r.salt].nama + (r.c ? ' (' + sciP(Math.round(Math.log10(r.c))) + ' M)' : '') + ' → ' + sci(r.s) + ' M').join(' | ') + '</div>' : '');
    a.push('Ion senama menggeser kesetimbangan ke arah padatan sehingga kelarutan menurun.');
    a.push('Nilai Ksp tidak berubah; yang berubah adalah kelarutan.');
    a.push('Garam beda tipe tidak bisa dibandingkan hanya dari Ksp: bandingkan nilai s.');
  } else if (labS.mode === 'qsp') {
    const P = labS.qsp, S = SALTS[P.salt], R = qspHitung(), sel = labS.qspAnim >= 3.5;
    it.textContent = '🧪 Larutan yang dicampur'; ht.textContent = '🧮 Qsp setelah pencampuran';
    info.innerHTML = '<div class="hasil-baris">50 mL ' + S.katSol + ' ' + sci(P.c1) + ' M<br>50 mL ' + S.anSol + ' ' + sci(P.c2) + ' M<br>Volume total 100 mL → konsentrasi menjadi setengah</div>';
    hit.innerHTML = sel ? '<div class="hasil-baris">[' + S.cat + '] = ' + sci(R.cc) + ' M<br>[' + S.an + '] = ' + sci(R.ca) + ' M<br>Qsp = ' + S.kspF + ' = <b>' + sci(R.Q, 2) + '</b><br>Ksp = ' + sci(S.ksp) + '<br>' + (R.status === 'endap' ? '<b>Qsp > Ksp → mengendap</b>' : (R.status === 'tepat' ? '<b>Qsp = Ksp → tepat jenuh</b>' : '<b>Qsp < Ksp → tidak mengendap</b>')) + '</div>' : '<div class="lab-note">Campurkan larutan untuk menghitung Qsp.</div>';
    a.push('Gunakan konsentrasi setelah pencampuran, bukan konsentrasi awal.');
    a.push('Garam beda tipe memerlukan konsentrasi ion yang berbeda untuk mengendap.');
  } else {
    const H = phHitung();
    it.textContent = '🧪 Larutan Mg²⁺'; ht.textContent = '🧮 Qsp pada pH ini';
    info.innerHTML = '<div class="hasil-baris">Mg(OH)₂(s) ⇌ Mg²⁺ + 2OH⁻<br>Ksp = [Mg²⁺][OH⁻]² = ' + sci(KSP_MG) + '<br>[Mg²⁺] awal = ' + labNum(H.c0, 3) + ' M · pH = ' + labNum(H.pH, H.pH % 1 ? 1 : 0) + '</div>';
    hit.innerHTML = '<div class="hasil-baris">pOH = ' + labNum(14 - H.pH, H.pH % 1 ? 1 : 0) + ' → [OH⁻] = ' + sci(H.OH, 2) + ' M<br>Qsp = [Mg²⁺][OH⁻]² = <b>' + sci(H.Q, 2) + '</b><br>' + (H.endap ? '<b>Qsp > Ksp</b>: mengendap ' + labNum(H.frac * 100, 0) + '%' : (H.tepat ? '<b>Qsp = Ksp</b>: tepat jenuh' : '<b>Qsp < Ksp</b>: larut sempurna')) + '</div>';
    a.push('pH naik: [OH⁻] naik, Qsp naik, endapan bertambah.');
    a.push('Konsentrasi Mg²⁺ awal lebih besar: endapan mulai terbentuk pada pH lebih rendah.');
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
  // M2: Ksp tidak sama dengan s
  if (!labS.m2opt) labS.m2opt = labAcak([
    { t:'Tipenya berbeda (Ksp = s² dan Ksp = 4s³), sehingga Ksp tidak dapat dibandingkan langsung', b:true },
    { t:'AgCl memiliki massa molar lebih besar', b:false },
    { t:'Nilai Ksp Ag₂CrO₄ pasti lebih besar daripada AgCl', b:false },
    { t:'Ag₂CrO₄ tidak membentuk kesetimbangan', b:false }]);
  const bisa2 = labS.kelRuns.some(r => r.salt === 'agcl' && r.c === 0) && labS.kelRuns.some(r => r.salt === 'ag2cro4' && r.c === 0);
  labKuis('m2-quiz', labS.misi[1], 'Bandingkan nilai s (bukan Ksp) untuk garam beda tipe.', bisa2, 'Ukur AgCl dan Ag₂CrO₄ dalam air murni.',
    'AgCl (Ksp 1×10⁻¹⁰) memiliki Ksp lebih besar daripada Ag₂CrO₄ (4×10⁻¹²), tetapi kelarutan AgCl (1×10⁻⁵ M) lebih kecil daripada Ag₂CrO₄ (1×10⁻⁴ M). Mengapa?', labS.m2opt, 'labJawabM2', 'm2', 'm2');
  // M4: verdict dari percobaan terakhir
  const L = labS.qspLast;
  if (L && !labS.misi[3]) {
    const key = [L.salt, L.c1, L.c2].join('|');
    if (labS.m4key !== key || !$L('m4-quiz').querySelector('.m-nota')) {
      labS.m4key = key;
      const q = sci(L.Q, 2), k = sci(L.ksp);
      const benar = L.status === 'endap' ? 'Qsp (' + q + ') > Ksp (' + k + '): terbentuk endapan' : (L.status === 'tepat' ? 'Qsp = Ksp: larutan tepat jenuh' : 'Qsp (' + q + ') < Ksp (' + k + '): tidak terbentuk endapan');
      const salah = [
        L.status === 'endap' ? 'Qsp (' + q + ') < Ksp (' + k + '): tidak terbentuk endapan' : 'Qsp (' + q + ') > Ksp (' + k + '): terbentuk endapan',
        L.status === 'tepat' ? 'Qsp (' + q + ') > Ksp (' + k + '): terbentuk endapan' : 'Qsp = Ksp: larutan tepat jenuh',
        'Tidak dapat disimpulkan karena volume campuran berubah'];
      labS.m4opt = labAcak([{ t:benar, b:true }].concat(salah.map(t => ({ t, b:false }))));
    }
  }
  labS.m4kuis = labKuis('m4-quiz', labS.misi[3], 'Qsp > Ksp: mengendap; Qsp < Ksp: tidak mengendap.', !!L, 'Campurkan dua larutan terlebih dahulu.',
    L ? 'Untuk ' + SALTS[L.salt].nama + ' dengan [' + SALTS[L.salt].cat + '] dan [' + SALTS[L.salt].an + '] awal ' + sci(L.c1) + ' M dan ' + sci(L.c2) + ' M, apa kesimpulannya?' : '', labS.m4opt || [], 'labJawabM4', labS.m4key, labS.m4kuis);
  // M5: pH awal pengendapan
  const H = phHitung();
  if (labS.m5key !== String(H.c0) || !labS.m5opt) {
    labS.m5key = String(H.c0);
    const p = H.pHmin, f = x => labNum(x, 1);
    labS.m5opt = labAcak([{ t:f(p), b:true }, { t:f(14 - p), b:false }, { t:f(p + 1), b:false }, { t:f(p - 1), b:false }]);
    const q = $L('m5-quiz'); if (q) q.innerHTML = '';
  }
  labS.m5kuis = labKuis('m5-quiz', labS.misi[4], 'pH awal pengendapan dihitung dari [OH⁻] = √(Ksp ÷ [Mg²⁺]).', labS.phSet.length >= 2, 'Ubah pH minimal dua kali pada eksperimen pH.',
    'Untuk [Mg²⁺] = ' + labNum(H.c0, 3) + ' M dan Ksp Mg(OH)₂ = 1×10⁻¹¹, pada pH berapakah endapan mulai terbentuk?', labS.m5opt, 'labJawabM5', labS.m5key, labS.m5kuis);
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
function labJawabM2(i){ labJawab('m2-quiz', labS.m2opt, i, 'm2-fb', 'Tepat! Tipe garam berbeda sehingga rumus Ksp-nya juga berbeda; bandingkan s.', 'Belum tepat. Perhatikan rumus hubungan s dan Ksp untuk tiap tipe garam.', 1, '🎉 Misi 2 selesai! Ksp tidak sama dengan kelarutan.'); }
function labJawabM4(i){ labJawab('m4-quiz', labS.m4opt, i, 'm4-fb', 'Benar! Bandingkan Qsp (setelah dicampur) dengan Ksp.', 'Belum tepat. Qsp > Ksp berarti mengendap, Qsp < Ksp berarti tidak mengendap.', 3, '🎉 Misi 4 selesai! Kamu bisa memprediksi pengendapan.'); }
function labJawabM5(i){ labJawab('m5-quiz', labS.m5opt, i, 'm5-fb', 'Tepat! [OH⁻] = √(Ksp ÷ [Mg²⁺]), lalu pH = 14 − pOH.', 'Belum tepat. Hitung [OH⁻]² = Ksp ÷ [Mg²⁺], ambil akar, lalu ubah ke pOH dan pH.', 4, '🎉 Misi 5 selesai! Kamu memahami pengaruh pH pada kelarutan.'); }

/* ---------- LKPD, reset, toast, selesai ---------- */
function labCatat(){
  labS.catatNo++;
  const item = document.createElement('div'); item.className = 'lab-log-item';
  let isi = '';
  if (labS.mode === 'kel') { const K = labS.kel, S = SALTS[K.salt]; isi = '<b>Kelarutan</b> · ' + S.nama + ' dalam ' + (K.c ? S.senama + ' ' + labNum(K.c, 3) + ' M' : 'air murni') + '<br>s = ' + sci(sCommon(S, K.c)) + ' M · Ksp = ' + sci(S.ksp); }
  else if (labS.mode === 'qsp') { const P = labS.qsp, R = qspHitung(); isi = '<b>Pengendapan</b> · ' + R.S.nama + ' · ' + sci(P.c1) + ' M + ' + sci(P.c2) + ' M<br>Qsp = ' + sci(R.Q, 2) + ' · Ksp = ' + sci(R.S.ksp) + ' → ' + (R.status === 'endap' ? 'mengendap' : (R.status === 'tepat' ? 'tepat jenuh' : 'tidak mengendap')); }
  else { const H = phHitung(); isi = '<b>pH</b> · [Mg²⁺] = ' + labNum(H.c0, 3) + ' M, pH = ' + labNum(H.pH, H.pH % 1 ? 1 : 0) + '<br>Qsp = ' + sci(H.Q, 2) + ' → ' + (H.endap ? 'mengendap ' + labNum(H.frac * 100, 0) + '%' : (H.tepat ? 'tepat jenuh' : 'larut')); }
  item.innerHTML = '<b>No. ' + labS.catatNo + '</b> · ' + isi;
  const log = $L('lab-log'); log.insertBefore(item, log.firstChild);
  while (log.children.length > 10) log.removeChild(log.lastChild);
  labToast('📓 Pengamatan berhasil dicatat ke LKPD!');
}
function labReset(){
  labS.mode = 'kel';
  labS.kel = { salt:'agcl', c:0 }; labS.kelAnim = 0; labS.kelRun = false; labS.kelRuns = []; labS.kelBangun = '';
  labS.qsp = { salt:'agcl', c1:1e-4, c2:1e-4 }; labS.qspAnim = 0; labS.qspRun = false; labS.qspRuns = []; labS.qspLast = null; labS.qspBangun = '';
  labS.ph = { c0:0.01, pH:9.5 }; labS.phSet = [];
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
  else if (s >= 60) kal = 'Bagus! Terus berlatih menganalisis kelarutan.';
  else kal = 'Ayo selesaikan semua misi untuk meraih skor penuh!';
  $L('lab-akhir-kal').textContent = kal;
  openModal('modal-lab'); sfx('win');
}

(function labInit(){
  if (!$L('scr-lab')) return;
  labRender(); labUpdateMisiCount();
})();
