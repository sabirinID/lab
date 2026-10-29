/* ##############################################################
   #  LAB MAYA — PRAKTIKUM VIRTUAL ASAM DAN BASA                #
   #  Tiga eksperimen: ukur pH (asam-basa kuat dan lemah),      #
   #  titrasi (asam kuat dan asam lemah), dan larutan penyangga.#
   #  Nilai Ka dan Kb dibulatkan untuk keperluan pembelajaran.  #
   ############################################################## */
const LAB_NS = 'http://www.w3.org/2000/svg';
const $L = id => document.getElementById(id);
const KW = 1e-14;

/* ---------- Data ---------- */
const ZAT = {
  hcl:     { id:'hcl',     nama:'HCl',     tipe:'asam', kuat:true, label:'asam kuat',                rx:'HCl → H⁺ + Cl⁻',                ion1:'H⁺',  ion2:'Cl⁻' },
  hcooh:   { id:'hcooh',   nama:'HCOOH',   tipe:'asam', K:2e-4,    label:'asam lemah (Ka = 2×10⁻⁴)', rx:'HCOOH ⇌ H⁺ + HCOO⁻',            ion1:'H⁺',  ion2:'HCOO⁻' },
  ch3cooh: { id:'ch3cooh', nama:'CH₃COOH', tipe:'asam', K:1e-5,    label:'asam lemah (Ka = 1×10⁻⁵)', rx:'CH₃COOH ⇌ H⁺ + CH₃COO⁻',        ion1:'H⁺',  ion2:'CH₃COO⁻' },
  naoh:    { id:'naoh',    nama:'NaOH',    tipe:'basa', kuat:true, label:'basa kuat',                rx:'NaOH → Na⁺ + OH⁻',              ion1:'Na⁺', ion2:'OH⁻' },
  nh3:     { id:'nh3',     nama:'NH₃',     tipe:'basa', K:1e-5,    label:'basa lemah (Kb = 1×10⁻⁵)', rx:'NH₃ + H₂O ⇌ NH₄⁺ + OH⁻',        ion1:'NH₄⁺', ion2:'OH⁻' }
};
const ZAT_IDS = ['hcl','hcooh','ch3cooh','naoh','nh3'];
const C_ZAT = [0.001, 0.01, 0.1, 1];
const IND = {
  mm:  { id:'mm',  nama:'Metil merah',    lo:4.4, hi:6.2,  stops:['#E53935','#FFD54F'], info:'merah → kuning' },
  btb: { id:'btb', nama:'Bromtimol biru', lo:6.0, hi:7.6,  stops:['#F5D142','#4CAF50','#2E6BE6'], info:'kuning → biru' },
  pp:  { id:'pp',  nama:'Fenolftalein',   lo:8.2, hi:10.0, stops:['#EEF2F8','#E83E8C'], info:'tak berwarna → merah muda' }
};
const ANALIT = { hcl:{ nama:'HCl 0,1 M', kuat:true }, ch3cooh:{ nama:'CH₃COOH 0,1 M', Ka:1e-5 } };
const BUF = { '1:1':{ nama:'1 : 1', HA:5, A:5 }, '10:1':{ nama:'10 : 1', HA:9.0909, A:0.9091 }, '1:10':{ nama:'1 : 10', HA:0.9091, A:9.0909 } };
const PHCOL = ['#E8453C','#F26A21','#FFC21A','#8BC34A','#3BA55D','#2FAF8F','#2E9BD6','#3B6FE0','#5A55D6','#7B4FC9','#9546B8'];
const SUP = { '0':'⁰','1':'¹','2':'²','3':'³','4':'⁴','5':'⁵','6':'⁶','7':'⁷','8':'⁸','9':'⁹','-':'⁻' };
const LAB_MODE = [
  { id:'ph',  nama:'Ukur pH',   kerja:'Ukur pH' },
  { id:'tit', nama:'Titrasi',   kerja:'Tambah 1 mL' },
  { id:'buf', nama:'Penyangga', kerja:'' }
];

const labS = {
  mode:'ph',
  ph:{ zat:'ch3cooh', c:0.1 }, phAnim:0, phRun:false, phRuns:[], phLast:null, phBangun:'',
  tit:{ an:'hcl', ind:'pp', V:0, hist:[] }, titDone:{ hcl:false }, titLewat:false,
  buf:{ komp:'1:1', tambah:0 }, bufSeen:{ asam:false, basa:false },
  mikro:false, catatNo:0,
  misi:[false,false,false,false,false], skor:0, m1opt:null, m2opt:null, m2key:'', m4opt:null, m5opt:null
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
function labAktif(){ const s = $L('scr-lab'); return s && s.classList.contains('active'); }
function sciP(e){ return '10' + String(e).split('').map(c => SUP[c]).join(''); }
function sci(v, d){
  d = d === undefined ? 1 : d;
  if (!(v > 0)) return '0';
  let e = Math.floor(Math.log10(v)), m = Number((v / Math.pow(10, e)).toFixed(d));
  if (m >= 10) { m /= 10; e++; }
  return (Number.isInteger(m) ? String(m) : m.toFixed(d).replace('.', ',')) + '×10' + String(e).split('').map(c => SUP[c]).join('');
}
function labTitik(n, x0, x1, y0, y1, seed, gap){
  const rng = (s => () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; })(seed >>> 0);
  let g = gap, pts = [];
  for (let a = 0; a < 8; a++) {
    pts = []; let t = 0;
    while (pts.length < n && t < 4000) { t++; const x = x0 + rng() * (x1 - x0), y = y0 + rng() * (y1 - y0); if (pts.every(p => (p[0] - x) ** 2 + (p[1] - y) ** 2 > g * g)) pts.push([x, y]); }
    if (pts.length >= n) break;
    g = Math.max(5, g - 2);
  }
  while (pts.length < n) pts.push([x0 + Math.random() * (x1 - x0), y0 + Math.random() * (y1 - y0)]);
  return pts;
}
function hex2rgb(h){ return [1, 3, 5].map(i => parseInt(h.substr(i, 2), 16)); }
function mixWarna(stops, t){
  t = labKlem(t, 0, 1);
  const n = stops.length - 1, k = Math.min(n - 1, Math.floor(t * n)), u = t * n - k;
  const a = hex2rgb(stops[k]), b = hex2rgb(stops[k + 1]);
  return 'rgb(' + a.map((v, i) => Math.round(v + (b[i] - v) * u)).join(',') + ')';
}
function warnaPH(pH){ return PHCOL[labKlem(Math.round(pH / 14 * 10), 0, 10)]; }
function warnaTeks(pH){ return pH < 6.5 ? '#FF9A8A' : (pH > 7.5 ? '#D3A6F5' : '#4ADE80'); }

/* ---------- Perhitungan pH ---------- */
function phZat(Z, C){
  let H, OH, alpha;
  if (Z.tipe === 'asam') {
    H = Z.kuat ? C : (-Z.K + Math.sqrt(Z.K * Z.K + 4 * Z.K * C)) / 2;
    alpha = H / C; OH = KW / H;
  } else {
    OH = Z.kuat ? C : (-Z.K + Math.sqrt(Z.K * Z.K + 4 * Z.K * C)) / 2;
    alpha = OH / C; H = KW / OH;
  }
  return { H, OH, pH:-Math.log10(H), pOH:-Math.log10(OH), alpha };
}
function phMuatan(Na, Cl, CT, Ka){
  // Na + H = OH + Cl + CT·Ka/(Ka + H)
  let lo = -1, hi = 15;
  const f = p => { const H = Math.pow(10, -p); return Na + H - KW / H - Cl - CT * Ka / (Ka + H); };
  for (let i = 0; i < 80; i++) { const mid = (lo + hi) / 2; if (f(mid) > 0) lo = mid; else hi = mid; }
  return (lo + hi) / 2;
}
function phTitrasi(an, Vb){
  const V = 20 + Vb, nb = 0.1 * Vb;
  return an === 'hcl' ? phMuatan(nb / V, 2 / V, 0, 1) : phMuatan(nb / V, 0, 2 / V, 1e-5);
}
function phPenyangga(komp, tambah){
  const K = BUF[komp], V = 50 + Math.abs(tambah), n = 0.1 * Math.abs(tambah);
  return phMuatan((K.A + (tambah > 0 ? n : 0)) / V, (tambah < 0 ? n : 0) / V, (K.HA + K.A) / V, 1e-5);
}
function phAir(tambah){
  const V = 50 + Math.abs(tambah), n = 0.1 * Math.abs(tambah);
  return phMuatan(tambah > 0 ? n / V : 0, tambah < 0 ? n / V : 0, 0, 1);
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
  if (labS.mikro) labToast('🔬 Label molekul dan ion ditampilkan.');
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
  if (labS.mode === 'ph') {
    const g1 = labSec('🧪 Zat terlarut', '', 'rx-grid cols5');
    ZAT_IDS.forEach(id => labChip(g1, ZAT[id].nama, '', labS.ph.zat === id, () => labPhPilih('zat', id)));
    const g2 = labSec('💧 Konsentrasi', 'M', 'rx-grid cols4');
    C_ZAT.forEach(c => labChip(g2, c === 1 ? '1' : sciP(Math.round(Math.log10(c))), '', labS.ph.c === c, () => labPhPilih('c', c)));
    rb.style.display = ''; rb.disabled = labS.phRun; rb.textContent = labS.phRun ? '⏳ Mengukur...' : (labS.phAnim >= 2.2 ? '↻ Ukur ulang pH' : '▶ Ukur pH');
  } else if (labS.mode === 'tit') {
    const T = labS.tit;
    const g1 = labSec('🧪 Analit (20 mL, 0,1 M)', '', 'rx-grid cols2');
    labChip(g1, 'HCl', 'asam kuat', T.an === 'hcl', () => labTitPilih('an', 'hcl'));
    labChip(g1, 'CH₃COOH', 'asam lemah', T.an === 'ch3cooh', () => labTitPilih('an', 'ch3cooh'));
    const g2 = labSec('🎨 Indikator', 'trayek pH', 'rx-grid cols3');
    Object.values(IND).forEach(i => labChip(g2, i.nama.replace('Bromtimol biru', 'BTB').replace('Metil merah', 'M. merah'), i.lo + '–' + i.hi, T.ind === i.id, () => labTitPilih('ind', i.id)));
    const g3 = labSec('💧 Tambah NaOH', 'mL', 'rx-grid cols4');
    [0.1, 0.5, 5].forEach(v => labChip(g3, '+' + labNum(v, 1), '', false, () => titTambah(v), true));
    labChip(g3, '↺', 'ulang', false, () => labTitUlang(), true);
    rb.style.display = ''; rb.disabled = false; rb.textContent = '💧 Tambah 1 mL NaOH';
  } else {
    const B = labS.buf;
    const g1 = labSec('🧪 Perbandingan HA : A⁻', 'total 10 mmol', 'rx-grid cols3');
    Object.keys(BUF).forEach(k => labChip(g1, BUF[k].nama, '', B.komp === k, () => labBufPilih('komp', k)));
    const g2 = labSec('🔴 Tambah HCl 0,1 M', 'mL', 'rx-grid cols4');
    [0, 1, 5, 10].forEach(v => labChip(g2, String(v), '', B.tambah === -v && v > 0 || (v === 0 && B.tambah === 0), () => labBufPilih('tambah', v === 0 ? 0 : -v)));
    const g3 = labSec('🔵 Tambah NaOH 0,1 M', 'mL', 'rx-grid cols4');
    [0, 1, 5, 10].forEach(v => labChip(g3, String(v), '', B.tambah === v && v > 0 || (v === 0 && B.tambah === 0), () => labBufPilih('tambah', v)));
    rb.style.display = 'none';
  }
}

/* ---------- Ukur pH ---------- */
function labPhPilih(k, v){ labS.ph[k] = v; labS.phAnim = 0; labS.phRun = false; labS.phBangun = ''; labRender(); }
function phBangunPartikel(){
  const Pz = labS.ph, Z = ZAT[Pz.zat], key = Pz.zat + '|' + Pz.c;
  if (labS.phBangun === key) return;
  labS.phBangun = key;
  const mol = $L('pMol'), cat = $L('pCat'), an = $L('pAn');
  mol.innerHTML = ''; cat.innerHTML = ''; an.innerHTML = '';
  const R = phZat(Z, Pz.c), N = Math.round(12 + (Math.log10(Pz.c) + 3) * 6);
  const ion = R.alpha >= 0.995 ? N : Math.max(R.alpha > 0.0005 ? 1 : 0, Math.round(N * R.alpha));
  const pts = labTitik(N + ion, 82, 258, 192, 396, 11 + Math.round(Pz.c * 100) + Z.id.length, 16);
  labS.phN = { ion, mol:N - ion };
  const buat = (grup, p, fn, teks, i) => { const o = svEl('g', { transform:'translate(' + p[0].toFixed(1) + ',' + p[1].toFixed(1) + ')' }, grup);
    const f = svEl('g', { class:'ion-g', style:'animation-delay:' + ((i * .37) % 4).toFixed(2) + 's;animation-duration:' + (3 + (i % 3) * .5) + 's' }, o);
    fn(f); if (i === 0 && teks) { const t = svEl('text', { class:'lbl', y:-10, 'text-anchor':'middle' }, f); t.textContent = teks; } };
  for (let i = 0; i < N - ion; i++) buat(mol, pts[i], f => svEl('circle', { r:8, fill:'#B7C2D6', stroke:'#6B7C99', 'stroke-width':1.5 }, f), Z.nama, i);
  for (let i = 0; i < ion; i++) buat(cat, pts[N - ion + i], f => svEl('circle', { r:6, fill: Z.tipe === 'asam' ? '#F26A21' : '#FFD39C', stroke:'#fff', 'stroke-width':1.3 }, f), Z.ion1, i);
  for (let i = 0; i < ion; i++) buat(an, pts[N + i], f => svEl('rect', { x:-5.5, y:-5.5, width:11, height:11, rx:2.5, fill:'#3B6CB3', stroke:'#fff', 'stroke-width':1.3 }, f), Z.ion2, i);
  $L('pEq').textContent = Z.rx;
}
function phDraw(){
  const Pz = labS.ph, Z = ZAT[Pz.zat], R = phZat(Z, Pz.c);
  phBangunPartikel();
  const f = labKlem(labS.phAnim / 2.2, 0, 1), fe = f * f * (3 - 2 * f), N = labS.phN || { ion:0, mol:0 };
  $L('pMol').querySelectorAll(':scope > g').forEach((g, i) => { g.style.display = i < Math.round(N.mol + (N.ion - Math.round(N.ion * fe))) ? '' : 'none'; });
  ['pCat','pAn'].forEach(id => $L(id).querySelectorAll(':scope > g').forEach((g, i) => { g.style.display = i < Math.round(N.ion * fe) ? '' : 'none'; }));
  const pHtampil = 7 + (R.pH - 7) * fe;
  $L('pVal').textContent = (labS.phAnim > 0 || labS.phRun) ? 'pH ' + labNum(pHtampil, 2) : 'pH —';
  $L('pVal').setAttribute('fill', warnaTeks(pHtampil)); $L('pSw').setAttribute('fill', warnaPH(pHtampil));
  $L('pLiq').setAttribute('fill', warnaPH(pHtampil)); $L('pLiq').setAttribute('fill-opacity', labS.phAnim > 0 ? 0.42 : 0.3);
  $L('pPillT').textContent = (Pz.c === 1 ? '1' : labNum(Pz.c, Pz.c < 0.01 ? 3 : 2)) + ' M ' + Z.nama;
  $L('pPill').setAttribute('fill', Z.tipe === 'asam' ? '#C0392B' : '#7B4FC9');
  const xm = 324 + labKlem(pHtampil, 0, 14) / 14 * 372;
  $L('pMk').setAttribute('points', xm + ',146 ' + (xm - 7) + ',134 ' + (xm + 7) + ',134');
  // grafik pH terhadap konsentrasi
  const xs = C_ZAT.map((c, i) => 350 + i * 113), y = p => 376 - labKlem(p, 0, 14) / 14 * 140;
  const tk = $L('pTk'); tk.innerHTML = '';
  [0, 7, 14].forEach(v => { svEl('line', { x1:332, y1:y(v), x2:696, y2:y(v), stroke:'rgba(255,255,255,.14)', 'stroke-width':1 }, tk); const t = svEl('text', { x:326, y:y(v) + 3, 'text-anchor':'end', 'font-size':9, 'font-weight':800, fill:'#AEC0E0', 'font-family':'Figtree,sans-serif' }, tk); t.textContent = v; });
  C_ZAT.forEach((c, i) => { const t = svEl('text', { x:xs[i], y:392, 'text-anchor':'middle', 'font-size':9, 'font-weight':800, fill:'#AEC0E0', 'font-family':'Figtree,sans-serif' }, tk); t.textContent = c === 1 ? '1' : sciP(Math.round(Math.log10(c))); });
  const pts = C_ZAT.map(c => phZat(Z, c).pH);
  $L('pCv').setAttribute('d', xs.map((x, i) => (i ? 'L' : 'M') + x + ',' + y(pts[i]).toFixed(1)).join(' '));
  const ref = ZAT[Z.tipe === 'asam' ? 'hcl' : 'naoh'];
  $L('pRef').setAttribute('d', Z.kuat ? '' : xs.map((x, i) => (i ? 'L' : 'M') + x + ',' + y(phZat(ref, C_ZAT[i]).pH).toFixed(1)).join(' '));
  const ci = C_ZAT.indexOf(Pz.c); $L('pCur').setAttribute('cx', xs[ci]); $L('pCur').setAttribute('cy', y(R.pH).toFixed(1));
  $L('pLeg').innerHTML = '<tspan fill="#FFC21A">━ ' + Z.nama + '</tspan>' + (Z.kuat ? '' : '    <tspan fill="#8EC1FF">┅ ' + ref.nama + ' (kuat)</tspan>');
  $L('pI1').textContent = Z.label + ' · α = ' + labNum(R.alpha * 100, R.alpha * 100 >= 10 ? 0 : 1) + '%';
  $L('pI2').textContent = '[H⁺] = ' + sci(R.H, 2) + ' M · [OH⁻] = ' + sci(R.OH, 2) + ' M';
  const st = $L('lab-status');
  st.textContent = labS.phRun ? 'Mengukur...' : (labS.phAnim >= 2.2 ? 'pH = ' + labNum(R.pH, 2) : 'Siap diukur'); st.className = 'lab-status ' + (labS.phRun || labS.phAnim >= 2.2 ? 'on' : 'off');
}
function phSelesai(){
  const Pz = labS.ph, R = phZat(ZAT[Pz.zat], Pz.c);
  labS.phLast = { zat:Pz.zat, c:Pz.c, pH:R.pH };
  labS.phRuns.push(labS.phLast);
}

/* ---------- Titrasi ---------- */
function labTitPilih(k, v){
  labS.tit[k] = v;
  if (k === 'an') { labS.tit.V = 0; labS.tit.hist = []; labS.titLewat = false; }
  labRender();
}
function labTitUlang(){ labS.tit.V = 0; labS.tit.hist = []; labS.titLewat = false; labRender(); }
function titTambah(dV){
  const T = labS.tit;
  if (T.V >= 40) { labToast('Buret sudah mencapai 40 mL. Tekan ↺ untuk mengulang.'); return; }
  const target = Math.min(40, Math.round((T.V + dV) * 100) / 100);
  if (!T.hist.length) T.hist.push({ V:0, pH:phTitrasi(T.an, 0) });
  const step = 0.1; let v = T.V;
  while (v + step < target - 1e-9) { v = Math.round((v + step) * 100) / 100; T.hist.push({ V:v, pH:phTitrasi(T.an, v) }); }
  T.V = target; T.hist.push({ V:target, pH:phTitrasi(T.an, target) });
  const d = $L('tDrop'); d.setAttribute('opacity', 1); d.setAttribute('cy', 320); setTimeout(() => d.setAttribute('opacity', 0), 380);
  titEvaluasi(); labRender(); sfx('click');
}
function titEvaluasi(){
  const T = labS.tit;
  if (T.an === 'hcl' && T.V >= 19.5 && T.V <= 20.5 && !labS.misi[2]) { labS.misi[2] = true; labSkor(20, '🎉 Misi 3 selesai! Titrasi dihentikan di sekitar titik ekuivalen (' + labNum(T.V, 1) + ' mL).'); }
  if (T.an === 'ch3cooh' && T.V >= 20) labS.titLewat = true;
}
function titDraw(){
  const T = labS.tit, ind = IND[T.ind], pH = phTitrasi(T.an, T.V), V = T.V;
  $L('tBur').setAttribute('y', (78 + V * 3.96).toFixed(1)); $L('tBur').setAttribute('height', (198 - V * 3.96).toFixed(1));
  const t = (pH - ind.lo) / (ind.hi - ind.lo), warna = mixWarna(ind.stops, t);
  $L('tLiq').setAttribute('fill', warna); $L('tLiq').setAttribute('fill-opacity', T.ind === 'pp' && t <= 0.02 ? 0.35 : 0.7);
  $L('tSw').setAttribute('fill', warna);
  $L('tPH').textContent = 'pH ' + labNum(pH, 2); $L('tPH').setAttribute('fill', warnaTeks(pH));
  const berubah = t >= 0.5;
  $L('tCol').textContent = 'indikator: ' + (t <= 0.02 ? 'warna asam' : (t >= 0.98 ? 'warna basa' : 'sedang berubah'));
  $L('tSt').textContent = berubah ? 'titik akhir: ' + labNum(V, 1) + ' mL' : 'belum titik akhir';
  $L('tPillT').textContent = 'V titran = ' + labNum(V, 1) + ' mL';
  const x = v => 302 + v / 40 * 396, y = p => 376 - labKlem(p, 0, 14) / 14 * 204;
  $L('tBand').setAttribute('y', y(ind.hi).toFixed(1)); $L('tBand').setAttribute('height', ((ind.hi - ind.lo) / 14 * 204).toFixed(1));
  $L('tBandT').textContent = ind.nama + ' (' + ind.lo + '–' + ind.hi + ')'; $L('tBandT').setAttribute('y', (y(ind.hi) - 3).toFixed(1));
  const tk = $L('tTk'); tk.innerHTML = '';
  [0, 10, 20, 30, 40].forEach(v => { const tt = svEl('text', { x:x(v), y:392, 'text-anchor':'middle', 'font-size':9, 'font-weight':800, fill:'#AEC0E0', 'font-family':'Figtree,sans-serif' }, tk); tt.textContent = v; });
  [0, 7, 14].forEach(v => { svEl('line', { x1:302, y1:y(v), x2:698, y2:y(v), stroke:'rgba(255,255,255,.14)', 'stroke-width':1 }, tk); const tt = svEl('text', { x:296, y:y(v) + 3, 'text-anchor':'end', 'font-size':9, 'font-weight':800, fill:'#AEC0E0', 'font-family':'Figtree,sans-serif' }, tk); tt.textContent = v; });
  $L('tCv').setAttribute('d', T.hist.length ? T.hist.map((h, i) => (i ? 'L' : 'M') + x(h.V).toFixed(1) + ',' + y(h.pH).toFixed(1)).join(' ') : '');
  $L('tCur').setAttribute('cx', x(V)); $L('tCur').setAttribute('cy', y(pH));
  const A = ANALIT[T.an];
  $L('tEq').textContent = T.an === 'hcl' ? 'HCl + NaOH → NaCl + H₂O' : 'CH₃COOH + NaOH → CH₃COONa + H₂O';
  $L('tInfo').textContent = 'Analit: 20 mL ' + A.nama + ' · Titran: NaOH 0,1 M';
  const st = $L('lab-status'); st.textContent = V === 0 ? 'Siap menitrasi' : (berubah ? 'Titik akhir · ' + labNum(V, 2) + ' mL' : 'Titrasi berjalan'); st.className = 'lab-status ' + (V > 0 ? 'on' : 'off');
}

/* ---------- Penyangga ---------- */
function labBufPilih(k, v){ labS.buf[k] = v; if (k === 'tambah') { if (v <= -5) labS.bufSeen.asam = true; if (v >= 5) labS.bufSeen.basa = true; } labRender(); }
function bufDraw(){
  const B = labS.buf, pW = phAir(B.tambah), pB = phPenyangga(B.komp, B.tambah);
  $L('bW').textContent = 'pH ' + labNum(pW, 2); $L('bB').textContent = 'pH ' + labNum(pB, 2);
  $L('bW').setAttribute('fill', warnaTeks(pW)); $L('bB').setAttribute('fill', warnaTeks(pB));
  $L('bLw').setAttribute('fill', warnaPH(pW)); $L('bLb').setAttribute('fill', warnaPH(pB));
  $L('bPillT').textContent = 'PENYANGGA ' + BUF[B.komp].nama;
  $L('bAdd').textContent = B.tambah === 0 ? 'tanpa penambahan' : 'tambah ' + (B.tambah < 0 ? 'HCl ' : 'NaOH ') + Math.abs(B.tambah) + ' mL';
  const x = t => 388 + (t + 10) / 20 * 312, y = p => 376 - labKlem(p, 0, 14) / 14 * 282;
  const tk = $L('bTk'); tk.innerHTML = '';
  [0, 7, 14].forEach(v => { svEl('line', { x1:388, y1:y(v), x2:700, y2:y(v), stroke:'rgba(255,255,255,.14)', 'stroke-width':1 }, tk); const t = svEl('text', { x:382, y:y(v) + 3, 'text-anchor':'end', 'font-size':9, 'font-weight':800, fill:'#AEC0E0', 'font-family':'Figtree,sans-serif' }, tk); t.textContent = v; });
  [[-10, 'HCl 10'], [-5, '5'], [0, '0'], [5, '5'], [10, 'NaOH 10']].forEach(([v, l]) => { const t = svEl('text', { x:x(v), y:392, 'text-anchor':'middle', 'font-size':9, 'font-weight':800, fill:'#AEC0E0', 'font-family':'Figtree,sans-serif' }, tk); t.textContent = l; });
  let dw = '', db = '';
  for (let t = -10; t <= 10.01; t += 0.5) { dw += (t === -10 ? 'M' : 'L') + x(t).toFixed(1) + ',' + y(phAir(t)).toFixed(1); db += (t === -10 ? 'M' : 'L') + x(t).toFixed(1) + ',' + y(phPenyangga(B.komp, t)).toFixed(1); }
  $L('bCw').setAttribute('d', dw); $L('bCb').setAttribute('d', db);
  $L('bDw').setAttribute('cx', x(B.tambah)); $L('bDw').setAttribute('cy', y(pW)); $L('bDb').setAttribute('cx', x(B.tambah)); $L('bDb').setAttribute('cy', y(pB));
  const p0 = phPenyangga(B.komp, 0);
  $L('bInfo').textContent = 'pH awal ' + labNum(p0, 2) + ' · perubahan: penyangga ' + labTanda(pB - p0, 2) + ' · air ' + labTanda(pW - 7, 2);
  const st = $L('lab-status'); st.textContent = B.tambah === 0 ? 'Pilih penambahan asam atau basa' : 'Penyangga ' + labTanda(pB - p0, 2) + ' · air ' + labTanda(pW - 7, 2); st.className = 'lab-status ' + (B.tambah === 0 ? 'off' : 'on');
}
function labTanda(v, d){ return (v > 0.0005 ? '+' : (v < -0.0005 ? '−' : '')) + labNum(Math.abs(v), d); }

/* ---------- Render ---------- */
function labRender(){
  const m = labS.mode;
  $L('scPh').style.display = m === 'ph' ? '' : 'none';
  $L('scTit').style.display = m === 'tit' ? '' : 'none';
  $L('scBuf').style.display = m === 'buf' ? '' : 'none';
  labRenderPanel();
  if (m === 'ph') phDraw(); if (m === 'tit') titDraw(); if (m === 'buf') bufDraw();
  labIsiData(); labRenderMisi();
}

/* ---------- Eksekusi ---------- */
function labJalankan(){
  if (labS.mode === 'ph') { if (labS.phRun) return; labS.phAnim = 0; labS.phRun = true; labRenderPanel(); sfx('click'); }
  else if (labS.mode === 'tit') titTambah(1);
}
setInterval(() => {
  if (!labS.phRun) return;
  labS.phAnim += 0.1;
  if (labS.phAnim >= 2.2) { labS.phAnim = 2.2; labS.phRun = false; phSelesai(); labRenderPanel(); labIsiData(); labRenderMisi(); }
  if (labS.mode === 'ph') phDraw();
}, 100);

/* ---------- Tab Data ---------- */
function labIsiData(){
  const info = $L('d-info'), hit = $L('d-hitung'), it = $L('d-info-t'), ht = $L('d-hitung-t'), am = $L('d-amati');
  const a = [];
  if (labS.mode === 'ph') {
    const P = labS.ph, Z = ZAT[P.zat], R = phZat(Z, P.c), sel = labS.phAnim >= 2.2;
    it.textContent = '🧪 Larutan'; ht.textContent = '🧮 Perhitungan pH';
    info.innerHTML = '<div class="hasil-baris">' + Z.rx + '<br>' + labNum(P.c, P.c < 0.01 ? 3 : 2) + ' M ' + Z.nama + ' (' + Z.label + ')</div>';
    let rumus;
    if (Z.tipe === 'asam') rumus = Z.kuat ? '[H⁺] = Ma = ' + sci(P.c) + ' M<br>pH = −log [H⁺]' : '[H⁺] = √(Ka × Ma)<br>= √(' + sci(Z.K) + ' × ' + sci(P.c) + ') ≈ ' + sci(Math.sqrt(Z.K * P.c), 2) + ' M<br>pH = −log [H⁺]';
    else rumus = Z.kuat ? '[OH⁻] = Mb = ' + sci(P.c) + ' M<br>pOH = −log [OH⁻]; pH = 14 − pOH' : '[OH⁻] = √(Kb × Mb)<br>= √(' + sci(Z.K) + ' × ' + sci(P.c) + ') ≈ ' + sci(Math.sqrt(Z.K * P.c), 2) + ' M<br>pOH = −log [OH⁻]; pH = 14 − pOH';
    hit.innerHTML = sel ? '<div class="hasil-baris">' + rumus + '<br>pH ≈ <b>' + labNum(R.pH, 2) + '</b><br>α = <b>' + labNum(R.alpha * 100, R.alpha * 100 >= 10 ? 0 : 1) + '%</b></div><div class="lab-note">Perhitungan eksak (tanpa pendekatan) dipakai pada simulasi.</div>' : '<div class="lab-note">Ukur pH untuk menampilkan perhitungan.</div>';
    a.push('Asam atau basa kuat terionisasi sempurna (α = 100%); yang lemah hanya sebagian kecil.');
    a.push('Pada konsentrasi sama, asam kuat memiliki pH lebih rendah daripada asam lemah.');
  } else if (labS.mode === 'tit') {
    const T = labS.tit, pH = phTitrasi(T.an, T.V);
    it.textContent = '🧪 Titrasi'; ht.textContent = '🧮 Data titrasi';
    info.innerHTML = '<div class="hasil-baris">20 mL ' + ANALIT[T.an].nama + ' dititrasi NaOH 0,1 M<br>Indikator: ' + IND[T.ind].nama + ' (' + IND[T.ind].info + ')<br>Titik ekuivalen: Ma·Va = Mb·Vb</div>';
    hit.innerHTML = '<div class="hasil-baris">V NaOH = ' + labNum(T.V, 2) + ' mL<br>mol NaOH = ' + labNum(0.1 * T.V, 2) + ' mmol<br>mol analit = 2,00 mmol<br>pH = <b>' + labNum(pH, 2) + '</b></div>' + (T.V >= 19.9 && T.V <= 20.1 ? '<div class="lab-note">Volume ini mendekati titik ekuivalen (mol H⁺ = mol OH⁻).</div>' : '');
    a.push('pH melonjak tajam di sekitar titik ekuivalen.');
    a.push('Pilih indikator yang trayek pH-nya berada pada lonjakan kurva.');
  } else {
    const B = labS.buf, pB = phPenyangga(B.komp, B.tambah), pW = phAir(B.tambah);
    it.textContent = '🧪 Penyangga'; ht.textContent = '🧮 Perbandingan pH';
    info.innerHTML = '<div class="hasil-baris">50 mL penyangga CH₃COOH (HA) dan CH₃COO⁻ (A⁻)<br>HA : A⁻ = ' + BUF[B.komp].nama + ' (total 10 mmol), Ka = 1×10⁻⁵<br>pH awal = pKa + log([A⁻] ÷ [HA]) = ' + labNum(phPenyangga(B.komp, 0), 2) + '</div>';
    hit.innerHTML = '<div class="hasil-baris">Penambahan: ' + (B.tambah === 0 ? 'tidak ada' : (B.tambah < 0 ? 'HCl ' : 'NaOH ') + Math.abs(B.tambah) + ' mL 0,1 M') + '<br>pH penyangga = <b>' + labNum(pB, 2) + '</b><br>pH air murni = <b>' + labNum(pW, 2) + '</b></div>';
    a.push('Air murni berubah drastis, penyangga hampir tidak berubah.');
    a.push('Kapasitas penyangga habis bila salah satu komponen (HA atau A⁻) habis.');
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
  // M1
  if (!labS.m1opt) labS.m1opt = labAcak([
    { t:'CH₃COOH hanya terionisasi sebagian, sehingga [H⁺] jauh lebih kecil', b:true },
    { t:'CH₃COOH memiliki konsentrasi yang lebih kecil', b:false },
    { t:'HCl tidak terionisasi dalam air', b:false },
    { t:'CH₃COOH merupakan basa', b:false }]);
  const ada = (z, c) => labS.phRuns.some(r => r.zat === z && r.c === c);
  labKuis('m1-quiz', labS.misi[0], 'Asam lemah terionisasi sebagian, asam kuat sempurna.', ada('hcl', 0.1) && ada('ch3cooh', 0.1), 'Ukur HCl 0,1 M dan CH₃COOH 0,1 M.',
    'HCl 0,1 M dan CH₃COOH 0,1 M berkonsentrasi sama, tetapi pH-nya berbeda (1 dan 3). Mengapa?', labS.m1opt, 'labJawabM1', 'm1', 'm1');
  // M2
  const L2 = labS.phLast;
  if (L2 && !labS.misi[1]) {
    const key = L2.zat + '|' + L2.c;
    if (labS.m2key !== key || !$L('m2-quiz').querySelector('.m-nota')) {
      labS.m2key = key;
      const Z = ZAT[L2.zat], f = v => labNum(v, 1), p = Number(L2.pH.toFixed(1));
      const kuat = Z.tipe === 'asam' ? -Math.log10(L2.c) : 14 + Math.log10(L2.c);
      let kandidat = [14 - p, Z.kuat ? p + 1 : kuat, p + 2, p - 1, p + 3];
      const set = new Set([f(p)]), salah = [];
      kandidat.forEach(v => { const s = f(v); if (v >= 0 && v <= 14 && !set.has(s) && salah.length < 3) { set.add(s); salah.push(s); } });
      let w = 1; while (salah.length < 3) { const s = f(p + w * 0.5); if (!set.has(s) && p + w * 0.5 <= 14) { set.add(s); salah.push(s); } w++; if (w > 40) break; }
      labS.m2opt = labAcak([{ t:f(p), b:true }].concat(salah.map(t => ({ t, b:false }))));
    }
  }
  const Z2 = L2 ? ZAT[L2.zat] : null;
  labS.m2kuis = labKuis('m2-quiz', labS.misi[1], 'Gunakan rumus yang sesuai dengan kekuatan asam atau basa.', !!L2, 'Ukur satu larutan terlebih dahulu.',
    L2 ? 'Berapa pH larutan ' + labNum(L2.c, L2.c < 0.01 ? 3 : 2) + ' M ' + Z2.nama + ' (' + Z2.label + ')?' : '', labS.m2opt || [], 'labJawabM2', labS.m2key, labS.m2kuis);
  // M4
  if (!labS.m4opt) labS.m4opt = labAcak([
    { t:'Garam CH₃COONa terhidrolisis dan menghasilkan OH⁻ (CH₃COO⁻ + H₂O ⇌ CH₃COOH + OH⁻)', b:true },
    { t:'NaOH masih tersisa berlebih pada titik ekuivalen', b:false },
    { t:'CH₃COOH adalah asam kuat', b:false },
    { t:'Indikator mengubah pH larutan', b:false }]);
  labKuis('m4-quiz', labS.misi[3], 'Titik ekuivalen asam lemah–basa kuat memiliki pH lebih dari 7.', labS.titLewat, 'Titrasi CH₃COOH sampai lewat 20 mL.',
    'Pada titik ekuivalen titrasi CH₃COOH dengan NaOH, pH larutan lebih besar dari 7 (sekitar 8,85). Mengapa?', labS.m4opt, 'labJawabM4', 'm4', 'm4');
  // M5
  if (!labS.m5opt) labS.m5opt = labAcak([
    { t:'A⁻ menetralkan H⁺ yang ditambahkan, dan HA menetralkan OH⁻ yang ditambahkan', b:true },
    { t:'Penyangga tidak bereaksi dengan asam maupun basa', b:false },
    { t:'Air dalam penyangga menyerap seluruh H⁺ dan OH⁻', b:false },
    { t:'pH penyangga selalu tepat 7', b:false }]);
  labKuis('m5-quiz', labS.misi[4], 'Pasangan asam-basa konjugasi menjaga pH tetap stabil.', labS.bufSeen.asam && labS.bufSeen.basa, 'Tambahkan HCl dan NaOH (≥ 5 mL) pada penyangga.',
    'Mengapa pH larutan penyangga hampir tidak berubah saat ditambah sedikit asam atau basa?', labS.m5opt, 'labJawabM5', 'm5', 'm5');
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
function labJawabM1(i){ labJawab('m1-quiz', labS.m1opt, i, 'm1-fb', 'Tepat! Asam lemah terionisasi sebagian sehingga [H⁺] lebih kecil.', 'Belum tepat. Konsentrasi keduanya sama; yang berbeda adalah derajat ionisasinya.', 0, '🎉 Misi 1 selesai! Kamu membedakan asam kuat dan lemah.'); }
function labJawabM2(i){ labJawab('m2-quiz', labS.m2opt, i, 'm2-fb', 'Benar! Rumus pH sesuai dengan jenis dan kekuatan larutannya.', 'Belum tepat. Periksa: asam atau basa? kuat atau lemah? Lalu hitung [H⁺] atau [OH⁻].', 1, '🎉 Misi 2 selesai! Kamu bisa menghitung pH.'); }
function labJawabM4(i){ labJawab('m4-quiz', labS.m4opt, i, 'm4-fb', 'Tepat! Anion asam lemah bereaksi dengan air dan menghasilkan OH⁻.', 'Belum tepat. Pada titik ekuivalen, asam dan basa sudah habis bereaksi menjadi garam.', 3, '🎉 Misi 4 selesai! Kamu memahami hidrolisis pada titik ekuivalen.'); }
function labJawabM5(i){ labJawab('m5-quiz', labS.m5opt, i, 'm5-fb', 'Benar! Penyangga memiliki dua komponen yang saling melengkapi.', 'Belum tepat. Penyangga bereaksi dengan asam dan basa tambahan.', 4, '🎉 Misi 5 selesai! Kamu memahami cara kerja penyangga.'); }

/* ---------- LKPD, reset, toast, selesai ---------- */
function labCatat(){
  labS.catatNo++;
  const item = document.createElement('div'); item.className = 'lab-log-item';
  let isi = '';
  if (labS.mode === 'ph') { const P = labS.ph, Z = ZAT[P.zat], R = phZat(Z, P.c); isi = '<b>Ukur pH</b> · ' + labNum(P.c, P.c < 0.01 ? 3 : 2) + ' M ' + Z.nama + ' (' + Z.label + ')<br>pH = ' + labNum(R.pH, 2) + ' · α = ' + labNum(R.alpha * 100, 1) + '%'; }
  else if (labS.mode === 'tit') { const T = labS.tit; isi = '<b>Titrasi</b> · ' + ANALIT[T.an].nama + ' · ' + IND[T.ind].nama + '<br>V NaOH = ' + labNum(T.V, 2) + ' mL · pH = ' + labNum(phTitrasi(T.an, T.V), 2); }
  else { const B = labS.buf; isi = '<b>Penyangga</b> · HA : A⁻ = ' + BUF[B.komp].nama + ' · tambah ' + (B.tambah === 0 ? 'tidak ada' : (B.tambah < 0 ? 'HCl ' : 'NaOH ') + Math.abs(B.tambah) + ' mL') + '<br>pH penyangga = ' + labNum(phPenyangga(B.komp, B.tambah), 2) + ' · air = ' + labNum(phAir(B.tambah), 2); }
  item.innerHTML = '<b>No. ' + labS.catatNo + '</b> · ' + isi;
  const log = $L('lab-log'); log.insertBefore(item, log.firstChild);
  while (log.children.length > 10) log.removeChild(log.lastChild);
  labToast('📓 Pengamatan berhasil dicatat ke LKPD!');
}
function labReset(){
  labS.mode = 'ph';
  labS.ph = { zat:'ch3cooh', c:0.1 }; labS.phAnim = 0; labS.phRun = false; labS.phRuns = []; labS.phLast = null; labS.phBangun = '';
  labS.tit = { an:'hcl', ind:'pp', V:0, hist:[] }; labS.titLewat = false;
  labS.buf = { komp:'1:1', tambah:0 }; labS.bufSeen = { asam:false, basa:false };
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
  else if (s >= 60) kal = 'Bagus! Terus berlatih menganalisis asam dan basa.';
  else kal = 'Ayo selesaikan semua misi untuk meraih skor penuh!';
  $L('lab-akhir-kal').textContent = kal;
  openModal('modal-lab'); sfx('win');
}

(function labInit(){
  if (!$L('scr-lab')) return;
  labRender(); labUpdateMisiCount();
})();
