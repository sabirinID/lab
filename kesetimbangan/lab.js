/* ##############################################################
   #  LAB MAYA — PRAKTIKUM VIRTUAL KESETIMBANGAN KIMIA          #
   #  Tiga eksperimen: kesetimbangan dinamis N₂O₄ ⇌ 2NO₂        #
   #  (suhu, volume, konsentrasi), perhitungan Kc, dan proses   #
   #  Haber–Bosch.                                              #
   ############################################################## */
const LAB_NS = 'http://www.w3.org/2000/svg';
const $L = id => document.getElementById(id);
const R_GAS = 8.314;

/* ---------- Data ---------- */
const K298 = 0.0046, DH_LE = 57200;        // N₂O₄ ⇌ 2NO₂
const KF25 = 0.020, EAF = 30000, CAT_F = 5;
const SPEED = 4, DT = 0.05;                // detik simulasi per detik nyata, langkah integrasi
const LE_T = [25, 50, 75, 100], LE_V = [0.5, 1.0, 2.0];
const C1_AWAL = 0.020;                      // M N₂O₄ awal pada V = 1 L
const KC_TRUE = 64;                         // H₂ + I₂ ⇌ 2HI (nilai disembunyikan dari siswa)
const KC_C = [0.10, 0.20, 0.30];
const HAB_T = [350, 400, 450, 500, 550], HAB_P = [50, 100, 200, 300];
const HAB_TARGET = { hasil:30, laju:0.25 };
const LAB_MODE = [
  { id:'le',  nama:'Setimbang', kerja:'Mulai reaksi' },
  { id:'kc',  nama:'Hitung Kc', kerja:'Hitung kesetimbangan' },
  { id:'hab', nama:'Haber–Bosch', kerja:'' }
];

const labS = {
  mode:'le',
  le:{ T:25, V:1.0, cat:false, c1:C1_AWAL, c2:0, t:0, started:false, eq:false, hist:[], events:[], pending:null, eqLog:[], tempOk:false, volOk:false },
  kc:{ a:0.10, b:0.10 }, kcAnim:0, kcRun:false, kcLast:null,
  hab:{ T:450, P:200, cat:true },
  mikro:false, catatNo:0,
  misi:[false,false,false,false,false], skor:0, m2opt:null, m3opt:null, m4opt:null, m4key:''
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
function labAktif(){ const s = $L('scr-lab'); return s && s.classList.contains('active'); }
function labSig(v){ // tiga angka penting dengan koma desimal
  if (v === 0) return '0';
  const d = v >= 100 ? 0 : (v >= 10 ? (Math.abs(v - Math.round(v)) < 0.05 ? 0 : 1) : (v >= 1 ? 2 : (v >= 0.1 ? 3 : 4)));
  return Number(v).toFixed(d).replace('.', ',');
}
function labGeom(el, y, h){
  el.setAttribute('y', y); el.setAttribute('height', h);
  el.style.y = y + 'px'; el.style.height = h + 'px';
}

/* ---------- Termodinamika dan kinetika ---------- */
function leK(Tc){ return K298 * Math.exp(-DH_LE / R_GAS * (1 / (Tc + 273.15) - 1 / 298.15)); }
function leKf(Tc, cat){ return KF25 * Math.exp(-EAF / R_GAS * (1 / (Tc + 273.15) - 1 / 298.15)) * (cat ? CAT_F : 1); }
function leQ(S){ return S.c1 > 1e-10 ? S.c2 * S.c2 / S.c1 : (S.c2 > 0 ? Infinity : 0); }
function leSetimbang(S){ const K = leK(S.T), Q = leQ(S); return S.t > 0 && Math.abs(Q - K) / K < 0.02; }

function habKp(Tc){ return 4.5e-5 * Math.exp(92400 / R_GAS * (1 / (Tc + 273.15) - 1 / 723.15)); }
function habHasil(Tc, P){
  const target = habKp(Tc) * P * P;
  const f = xi => { const n = 4 - 2 * xi; return Math.pow(2 * xi / n, 2) / (((1 - xi) / n) * Math.pow((3 - 3 * xi) / n, 3)); };
  let lo = 1e-12, hi = 1 - 1e-12;
  for (let i = 0; i < 80; i++) { const mid = (lo + hi) / 2; if (f(mid) < target) lo = mid; else hi = mid; }
  const xi = (lo + hi) / 2;
  return 2 * xi / (4 - 2 * xi) * 100;
}
function habLaju(Tc, cat){
  const T = Tc + 273.15, Ea = cat ? 100000 : 230000;
  return Math.exp(-Ea / (R_GAS * T)) / Math.exp(-100000 / (R_GAS * 723.15));
}
function kcHitung(a, b){
  const A = 60, B = -64 * (a + b), C = 64 * a * b;
  const x = (-B - Math.sqrt(B * B - 4 * A * C)) / (2 * A);
  return { x, h:a - x, i:b - x, hi:2 * x };
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
  if (labS.mikro) labToast('🔬 Label molekul N₂O₄ dan NO₂ ditampilkan.');
  leSinkronDots(true);
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
  if (labS.mode === 'le') {
    const L = labS.le;
    const g1 = labSec('🌡️ Suhu', 'K berubah', 'rx-grid cols4');
    LE_T.forEach(t => labChip(g1, t + ' °C', '', L.T === t, () => leUbahT(t)));
    const g2 = labSec('📏 Volume', '0,5 = ditekan · 2,0 = ditarik', 'rx-grid');
    LE_V.forEach((v, i) => labChip(g2, labNum(v, 1) + ' L', '', L.V === v, () => leUbahV(v)));
    const g3 = labSec('🧪 Tambah 10 mmol / katalis', 'laju ×5', 'rx-grid cols2');
    labChip(g3, '+ N₂O₄', '', false, () => leTambah('c1'), true);
    labChip(g3, '+ NO₂', '', false, () => leTambah('c2'), true);
    labChip(g3, 'Tanpa katalis', '', !L.cat, () => leKatalis(false));
    labChip(g3, 'Dengan katalis', '', L.cat, () => leKatalis(true));
    rb.style.display = ''; rb.textContent = L.started ? '↻ Mulai ulang dari N₂O₄ murni' : '▶ Mulai reaksi';
  } else if (labS.mode === 'kc') {
    const g1 = labSec('🧪 [H₂] mula-mula', 'M', 'rx-grid');
    KC_C.forEach(c => labChip(g1, labNum(c, 2), '', labS.kc.a === c, () => labKcPilih('a', c)));
    const g2 = labSec('🧪 [I₂] mula-mula', 'M', 'rx-grid');
    KC_C.forEach(c => labChip(g2, labNum(c, 2), '', labS.kc.b === c, () => labKcPilih('b', c)));
    rb.style.display = ''; rb.disabled = labS.kcRun; rb.textContent = labS.kcRun ? '⏳ Berjalan...' : (labS.kcAnim >= 5.5 ? '↻ Ulangi: Hitung kesetimbangan' : '▶ Hitung kesetimbangan');
  } else {
    const H = labS.hab;
    const g1 = labSec('🌡️ Suhu reaktor', '', 'rx-grid cols5');
    HAB_T.forEach(t => labChip(g1, t + '°C', '', H.T === t, () => labHabPilih('T', t)));
    const g2 = labSec('⚙️ Tekanan', 'atm', 'rx-grid cols4');
    HAB_P.forEach(p => labChip(g2, String(p), '', H.P === p, () => labHabPilih('P', p)));
    const g3 = labSec('⚗️ Katalis', '', 'rx-grid cols2');
    labChip(g3, 'Tanpa katalis', '', !H.cat, () => labHabPilih('cat', false));
    labChip(g3, 'Katalis Fe', '', H.cat, () => labHabPilih('cat', true));
    rb.style.display = 'none';
  }
}

/* ---------- Kesetimbangan dinamis: gangguan ---------- */
function leCatatEvent(tipe, label){
  const L = labS.le;
  L.events.push({ t:L.t, label });
  if (L.events.length > 14) L.events.shift();
  L.eq = false;
  L.pending = { tipe, t:L.t, T0:L.T, V0:L.V, c1:L.c1, c2:L.c2, n2:L.c2 * L.V };
}
function leUbahT(t){
  const L = labS.le; if (L.T === t) return;
  const naik = t > L.T;
  leCatatEvent('T', naik ? 'T↑' : 'T↓');
  L.pending.naik = naik; L.T = t;
  labRender(); sfx('click');
}
function leUbahV(v){
  const L = labS.le; if (L.V === v) return;
  const kecil = v < L.V;
  leCatatEvent('V', kecil ? 'V↓' : 'V↑');
  L.pending.kecil = kecil;
  L.c1 *= L.V / v; L.c2 *= L.V / v; L.V = v;
  labRender(); sfx('click');
}
function leTambah(k){
  const L = labS.le;
  leCatatEvent('add', k === 'c1' ? '+N₂O₄' : '+NO₂');
  L[k] += 0.010 / L.V;
  if (!L.started) L.started = true;
  labRender(); sfx('click');
}
function leKatalis(v){
  const L = labS.le; if (L.cat === v) return;
  leCatatEvent('cat', v ? 'kat.' : 'tanpa');
  L.cat = v; labRender();
}

/* ---------- Kesetimbangan dinamis: partikel ---------- */
const leDots = { a:[], b:[] };
function leGeom(){ const H = 140 * labS.le.V, top = 384 - H; return { H, top }; }
function leSinkronDots(paksa){
  const L = labS.le, g = $L('leP'), { top } = leGeom();
  if (paksa) { g.innerHTML = ''; leDots.a = []; leDots.b = []; }
  const nA = Math.round(L.c1 * L.V * 1000 * 0.9), nB = Math.round(L.c2 * L.V * 1000 * 0.9);
  const buat = (lst, n, tipe) => {
    while (lst.length < n) {
      const gr = svEl('g', {}, g);
      const r = tipe === 'a' ? 6.5 : 4.2;
      svEl('circle', { r, fill: tipe === 'a' ? '#E8EEF8' : '#D8924E', stroke:'#fff', 'stroke-width': tipe === 'a' ? 1.3 : .8 }, gr);
      if (labS.mikro && lst.length === 0) { const t = svEl('text', { class:'lbl', y:-9, 'text-anchor':'middle' }, gr); t.textContent = tipe === 'a' ? 'N₂O₄' : 'NO₂'; }
      const ang = Math.random() * 6.283, v = 28 + Math.random() * 30 + (L.T - 25) * 0.25;
      lst.push({ x:86 + Math.random() * 208, y:top + 8 + Math.random() * (376 - top - 8), vx:Math.cos(ang) * v, vy:Math.sin(ang) * v, el:gr });
    }
    while (lst.length > n) lst.pop().el.remove();
  };
  buat(leDots.a, nA, 'a'); buat(leDots.b, nB, 'b');
}
function leFrameDots(dt){
  const { top } = leGeom();
  [leDots.a, leDots.b].forEach(lst => lst.forEach(p => {
    p.x += p.vx * dt; p.y += p.vy * dt;
    if (p.x < 82) { p.x = 82; p.vx = Math.abs(p.vx); } if (p.x > 298) { p.x = 298; p.vx = -Math.abs(p.vx); }
    if (p.y < top + 8) { p.y = top + 8; p.vy = Math.abs(p.vy); } if (p.y > 376) { p.y = 376; p.vy = -Math.abs(p.vy); }
    p.el.setAttribute('transform', 'translate(' + p.x.toFixed(1) + ',' + p.y.toFixed(1) + ')');
  }));
}
setInterval(() => { if (labAktif() && labS.mode === 'le') leFrameDots(0.033); }, 33);

/* ---------- Kesetimbangan dinamis: simulasi ---------- */
function leTick(){
  const L = labS.le;
  if (!L.started) return;
  const k = leKf(L.T, L.cat), kb = k / leK(L.T);
  for (let i = 0; i < Math.round(SPEED * 0.05 / DT); i++) {
    const rf = k * L.c1, rb = kb * L.c2 * L.c2;
    L.c1 = Math.max(0, L.c1 + (-rf + rb) * DT);
    L.c2 = Math.max(0, L.c2 + 2 * (rf - rb) * DT);
    L.t += DT;
  }
  L.hist.push({ t:L.t, c1:L.c1, c2:L.c2 });
  if (L.hist.length > 3000) L.hist.shift();
  const eq = leSetimbang(L);
  if (eq && !L.eq && (!L.pending || L.t - L.pending.t >= 2)) { L.eq = true; leSaatSetimbang(); }
  else if (!eq) L.eq = false;
}
function leSaatSetimbang(){
  const L = labS.le;
  const K = leK(L.T);
  L.eqLog.push({ T:L.T, V:L.V, c1:L.c1, c2:L.c2, K });
  if (L.eqLog.length > 6) L.eqLog.shift();
  if (!labS.misi[0]) { labS.misi[0] = true; labSkor(20, '🎉 Misi 1 selesai! Laju maju = laju balik: kesetimbangan dinamis.'); }
  const p = L.pending;
  if (p) {
    if (p.tipe === 'T' && p.naik && L.c2 > p.c2 + 1e-4) L.tempOk = true;
    if (p.tipe === 'V' && p.kecil && L.c2 * L.V < p.n2 - 1e-5) L.volOk = true;
    L.pending = null;
  }
  labRenderMisi(); labIsiData();
}
function leDraw(){
  const L = labS.le, { H, top } = leGeom();
  labGeom($L('leGas'), top, H); labGeom($L('clipGasR'), top, H);
  $L('lePis').style.y = (top - 14) + 'px'; $L('lePis').setAttribute('y', top - 14);
  $L('leRod').style.y = '84px'; $L('leRod').style.height = Math.max(8, top - 14 - 84) + 'px'; $L('leRod').setAttribute('height', Math.max(8, top - 14 - 84));
  $L('leGas').setAttribute('fill-opacity', (labKlem(L.c2 / 0.045, 0, 1) * 0.85).toFixed(2));
  $L('leGlow').setAttribute('opacity', (labKlem((L.T - 25) / 75, 0, 1) * 0.9).toFixed(2));
  $L('leV').textContent = 'V = ' + labNum(L.V, 1) + ' L';
  $L('leTt').textContent = 'T = ' + L.T + ' °C';
  leSinkronDots(false);
  // grafik
  const win = 100, t0 = Math.max(0, L.t - win), px = t => 372 + (t - t0) / win * 328, py = c => 200 - Math.min(c, 0.0875) / 0.0875 * 105;
  const pts = L.hist.filter(h => h.t >= t0);
  const path = k => pts.map((h, i) => (i ? 'L' : 'M') + px(h.t).toFixed(1) + ',' + py(h[k]).toFixed(1)).join(' ');
  $L('leL1').setAttribute('d', pts.length ? path('c1') : ''); $L('leL2').setAttribute('d', pts.length ? path('c2') : '');
  const ev = $L('leEv'); ev.innerHTML = '';
  L.events.filter(e => e.t >= t0).forEach(e => {
    const x = px(e.t);
    svEl('line', { x1:x, y1:92, x2:x, y2:200, stroke:'#FFC21A', 'stroke-width':1.4, 'stroke-dasharray':'4 3' }, ev);
    const t = svEl('text', { x:x + 3, y:100, 'font-size':9.5, 'font-weight':800, fill:'#FFC21A', 'font-family':'Figtree,sans-serif' }, ev); t.textContent = e.label;
  });
  // laju
  const k = leKf(L.T, L.cat), kb = k / leK(L.T), rf = k * L.c1, rb = kb * L.c2 * L.c2, mx = Math.max(rf, rb, 1e-12);
  $L('leRf').setAttribute('width', (270 * rf / mx).toFixed(1)); $L('leRb').setAttribute('width', (270 * rb / mx).toFixed(1));
  $L('leRfT').textContent = labNum(rf * 1000, 2) + ' mM/s'; $L('leRbT').textContent = labNum(rb * 1000, 2) + ' mM/s';
  // Q dan K
  const K = leK(L.T), Q = leQ(L), eq = L.started && leSetimbang(L);
  $L('leQK').textContent = 'Q = ' + (Q === Infinity ? '∞' : labNum(Q, 4)) + '    K = ' + labNum(K, 4);
  const dir = $L('leDir');
  if (!L.started) { dir.textContent = 'Tekan "Mulai reaksi"'; dir.setAttribute('fill', '#AEC0E0'); }
  else if (eq) { dir.textContent = 'Setimbang: laju maju = laju balik'; dir.setAttribute('fill', '#4ADE80'); }
  else if (Q < K) { dir.textContent = 'Q < K: bergeser ke kanan →'; dir.setAttribute('fill', '#FFB27A'); }
  else { dir.textContent = '← Q > K: bergeser ke kiri'; dir.setAttribute('fill', '#8EC1FF'); }
  $L('leInfo').textContent = '[N₂O₄] = ' + labNum(L.c1, 4) + ' M · [NO₂] = ' + labNum(L.c2, 4) + ' M · terurai ' + labNum(L.c2 / (2 * (L.c1 + L.c2 / 2)) * 100, 0) + '%';
  const st = $L('lab-status');
  st.textContent = !L.started ? 'Siap dijalankan' : (eq ? 'Setimbang ✓' : 'Menuju setimbang...'); st.className = 'lab-status ' + (!L.started ? 'off' : 'on');
}
setInterval(() => { if (labS.mode === 'le' && labAktif()) { leTick(); leDraw(); } }, 50);

function leMulaiUlang(){
  const L = labS.le;
  L.c1 = C1_AWAL / L.V; L.c2 = 0; L.t = 0; L.started = true; L.eq = false; L.hist = []; L.events = []; L.pending = null;
  leSinkronDots(true); labRender(); sfx('click');
}

/* ---------- Hitung Kc ---------- */
function labKcPilih(k, v){ labS.kc[k] = v; labS.kcAnim = 0; labS.kcRun = false; labRender(); }
function kcDraw(){
  const { a, b } = labS.kc, E = kcHitung(a, b), ts = labS.kcAnim;
  const p = ts <= 0 ? 0 : labKlem((1 - Math.exp(-0.9 * ts)) / (1 - Math.exp(-0.9 * 5.5)), 0, 1);
  const val = [a - E.x * p, b - E.x * p, 2 * E.x * p], sk = 190 / 0.32;
  ['kcB1','kcB2','kcB3'].forEach((id, i) => {
    const h = val[i] * sk; $L(id).setAttribute('y', (384 - h).toFixed(1)); $L(id).setAttribute('height', h.toFixed(1));
    $L('kcV' + (i + 1)).setAttribute('y', (376 - h).toFixed(1)); $L('kcV' + (i + 1)).textContent = labNum(val[i], 3);
  });
  const g = $L('kcTab'); g.innerHTML = '';
  const baris = [[128, [labNum(a, 2), labNum(b, 2), '0'], true], [178, ['−' + labNum(E.x, 2), '−' + labNum(E.x, 2), '+' + labNum(2 * E.x, 2)], ts >= 1.8], [228, [labNum(E.h, 2), labNum(E.i, 2), labNum(E.hi, 2)], ts >= 3.8]];
  baris.forEach(([y, vs, tampil]) => { if (tampil) [470, 560, 650].forEach((x, i) => { const t = svEl('text', { x, y:y + 5 }, g); t.textContent = vs[i]; }); });
  const selesai = !labS.kcRun && ts >= 5.5;
  $L('kcSub').textContent = selesai ? 'Hitung Kc dari baris S, lalu jawab di tab Misi.' : (labS.kcRun ? 'Menuju kesetimbangan...' : 'Jalankan, lalu hitung Kc dari tabel.');
  $L('kcRes').textContent = labS.misi[3] ? 'Kc = ' + labNum(KC_TRUE, 0) : 'Kc = ?';
  const st = $L('lab-status'); st.textContent = selesai ? 'Selesai · tabel setimbang siap' : (labS.kcRun ? 'Berjalan...' : 'Siap dijalankan'); st.className = 'lab-status ' + (selesai || labS.kcRun ? 'on' : 'off');
}

/* ---------- Haber–Bosch ---------- */
function labHabPilih(k, v){ labS.hab[k] = v; labRender(); }
function habDraw(){
  const H = labS.hab, hasil = habHasil(H.T, H.P), laju = habLaju(H.T, H.cat), kp = habKp(H.T);
  $L('habT').textContent = H.T + ' °C'; $L('habP').textContent = H.P + ' atm';
  $L('habGlow').setAttribute('opacity', (0.15 + labKlem((H.T - 300) / 300, 0, 1) * 0.8).toFixed(2));
  const fe = $L('habFe'); if (!fe.childNodes.length || fe.dataset.cat !== String(H.cat)) {
    fe.innerHTML = ''; fe.dataset.cat = String(H.cat);
    if (H.cat) for (let i = 0; i < 30; i++) { svEl('circle', { cx:(116 + (i % 6) * 19 + (Math.floor(i / 6) % 2) * 8).toFixed(1), cy:(264 + Math.floor(i / 6) * 17).toFixed(1), r:5, fill:'#58616E', stroke:'#C9D3E6', 'stroke-width':1 }, fe); }
  }
  $L('habFeT').textContent = H.cat ? 'katalis Fe' : 'tanpa katalis';
  $L('habYB').setAttribute('width', (380 * labKlem(hasil / 60, 0, 1)).toFixed(1));
  const yx = 276 + 380 * 30 / 60; $L('habYTg').setAttribute('x1', yx); $L('habYTg').setAttribute('x2', yx);
  $L('habYT').textContent = labNum(hasil, 1) + ' %   (target ≥ ' + HAB_TARGET.hasil + '%)';
  const lg = Math.log10(Math.max(laju, 1e-30)), wr = labKlem((lg + 3) / 4, 0, 1);
  $L('habRB').setAttribute('width', (380 * wr).toFixed(1));
  const rx = 276 + 380 * (Math.log10(HAB_TARGET.laju) + 3) / 4; $L('habRTg').setAttribute('x1', rx); $L('habRTg').setAttribute('x2', rx);
  $L('habRT').textContent = (laju >= 0.001 ? '×' + labNum(laju, laju >= 1 ? 1 : 2) : '≈ 0') + '   (target ≥ ' + labNum(HAB_TARGET.laju, 2) + ')';
  const wk = laju < 1e-6 ? 'tak praktis (bertahun-tahun)' : (laju < 0.05 ? 'sangat lama' : (laju < HAB_TARGET.laju ? 'lama' : (laju < 2 ? 'sedang' : 'cepat')));
  $L('habWT').textContent = 'Waktu mencapai setimbang: ' + wk;
  const cx = T => 292 + (T - 300) / 300 * 408, cy = y => 380 - labKlem(y, 0, 1) * 130;
  let dy = '', dr = '';
  for (let T = 300; T <= 600; T += 10) {
    dy += (T === 300 ? 'M' : 'L') + cx(T).toFixed(1) + ',' + cy(habHasil(T, H.P) / 80).toFixed(1);
    dr += (T === 300 ? 'M' : 'L') + cx(T).toFixed(1) + ',' + cy((Math.log10(Math.max(habLaju(T, H.cat), 1e-30)) + 3) / 4).toFixed(1);
  }
  $L('habCY').setAttribute('d', dy); $L('habCR').setAttribute('d', dr);
  $L('habCur').setAttribute('x1', cx(H.T)); $L('habCur').setAttribute('x2', cx(H.T));
  $L('habDY').setAttribute('cx', cx(H.T)); $L('habDY').setAttribute('cy', cy(hasil / 80));
  $L('habDR').setAttribute('cx', cx(H.T)); $L('habDR').setAttribute('cy', cy((lg + 3) / 4));
  $L('habInfo').textContent = 'Kp = ' + kp.toExponential(2).replace('.', ',').replace('e-', ' × 10⁻').replace('e+', ' × 10') + ' atm⁻² · makin tinggi T, Kp makin kecil';
  const ok = hasil >= HAB_TARGET.hasil && laju >= HAB_TARGET.laju && H.cat;
  const st = $L('lab-status'); st.textContent = ok ? 'Kondisi memenuhi target ✓' : 'Cari kompromi hasil dan laju'; st.className = 'lab-status ' + (ok ? 'on' : 'off');
  if (ok && !labS.misi[4]) { labS.misi[4] = true; labSkor(20, '🎉 Misi 5 selesai! ' + H.T + ' °C, ' + H.P + ' atm, Fe: hasil ' + labNum(hasil, 1) + '% dan laju ×' + labNum(laju, 2) + '.'); }
}

/* ---------- Render ---------- */
function labRender(){
  const m = labS.mode;
  $L('scLe').style.display = m === 'le' ? '' : 'none';
  $L('scKc').style.display = m === 'kc' ? '' : 'none';
  $L('scHab').style.display = m === 'hab' ? '' : 'none';
  labRenderPanel();
  if (m === 'le') { leSinkronDots(false); leDraw(); }
  if (m === 'kc') kcDraw();
  if (m === 'hab') habDraw();
  labIsiData(); labRenderMisi();
}

/* ---------- Eksekusi ---------- */
function labJalankan(){
  if (labS.mode === 'le') { leMulaiUlang(); return; }
  if (labS.mode === 'kc') {
    if (labS.kcRun) return;
    labS.kcAnim = 0; labS.kcRun = true; labRenderPanel(); sfx('click');
  }
}
setInterval(() => {
  if (!labS.kcRun) return;
  labS.kcAnim += 0.1;
  if (labS.kcAnim >= 5.5) {
    labS.kcAnim = 5.5; labS.kcRun = false;
    const E = kcHitung(labS.kc.a, labS.kc.b);
    labS.kcLast = { a:labS.kc.a, b:labS.kc.b, h:E.h, i:E.i, hi:E.hi };
    labRenderPanel(); labIsiData(); labRenderMisi();
  }
  if (labS.mode === 'kc') kcDraw();
}, 100);

/* ---------- Tab Data ---------- */
function labIsiData(){
  const info = $L('d-info'), hit = $L('d-hitung'), it = $L('d-info-t'), ht = $L('d-hitung-t'), am = $L('d-amati');
  const a = [];
  if (labS.mode === 'le') {
    const L = labS.le, K = leK(L.T), k = leKf(L.T, L.cat), Q = leQ(L);
    it.textContent = '🧪 Kondisi sistem'; ht.textContent = '🧮 Q dibandingkan dengan K';
    info.innerHTML = '<div class="hasil-baris">N₂O₄(g) ⇌ 2NO₂(g)  ΔH = +57 kJ<br>T = ' + L.T + ' °C · V = ' + labNum(L.V, 1) + ' L<br>' + (L.cat ? 'dengan katalis (laju ×5, K tetap)' : 'tanpa katalis') + '<br>K = [NO₂]² ÷ [N₂O₄] = <b>' + labNum(K, 4) + '</b></div>';
    hit.innerHTML = '<div class="hasil-baris">[N₂O₄] = ' + labNum(L.c1, 4) + ' M<br>[NO₂] = ' + labNum(L.c2, 4) + ' M<br>Q = ' + labNum(L.c2, 4) + '² ÷ ' + labNum(L.c1, 4) + ' = <b>' + (Q === Infinity ? '∞' : labNum(Q, 4)) + '</b><br>' + (!L.started ? 'Belum dijalankan.' : (leSetimbang(L) ? 'Q = K: <b>setimbang</b>.' : (Q < K ? 'Q &lt; K: bergeser ke <b>kanan</b>.' : 'Q &gt; K: bergeser ke <b>kiri</b>.'))) + '</div>' +
      (L.eqLog.length ? '<div class="lab-note">Riwayat setimbang: ' + L.eqLog.slice(-3).map(e => e.T + ' °C, ' + labNum(e.V, 1) + ' L → [NO₂] ' + labNum(e.c2, 4) + ' M, K ' + labNum(e.K, 4)).join(' | ') + '</div>' : '');
    a.push('Suhu naik: warna makin cokelat (NO₂ bertambah) dan K membesar karena reaksi ke kanan endoterm.');
    a.push('Volume diperkecil: warna sesaat lebih pekat, lalu memudar karena kesetimbangan bergeser ke N₂O₄ (mol gas lebih sedikit).');
    a.push('Katalis mempercepat tercapainya setimbang tetapi tidak mengubah posisi setimbang maupun K.');
  } else if (labS.mode === 'kc') {
    const { a: A, b: B } = labS.kc, E = kcHitung(A, B), sel = labS.kcAnim >= 5.5;
    it.textContent = '🧪 Reaksi'; ht.textContent = '🧮 Tabel M–R–S';
    info.innerHTML = '<div class="hasil-baris">H₂(g) + I₂(g) ⇌ 2HI(g)<br>Mula-mula: [H₂] = ' + labNum(A, 2) + ' M; [I₂] = ' + labNum(B, 2) + ' M; [HI] = 0<br>Kc = [HI]² ÷ ([H₂][I₂])</div>';
    hit.innerHTML = sel ? '<div class="hasil-baris">Reaksi: H₂ −' + labNum(E.x, 3) + '; I₂ −' + labNum(E.x, 3) + '; HI +' + labNum(2 * E.x, 3) + '<br>Setimbang:<br>[H₂] = ' + labNum(E.h, 3) + ' M<br>[I₂] = ' + labNum(E.i, 3) + ' M<br>[HI] = ' + labNum(E.hi, 3) + ' M<br>' + (labS.misi[3] ? 'Kc = <b>' + labNum(KC_TRUE, 0) + '</b>' : 'Substitusikan ke rumus Kc untuk mendapatkan nilainya.') + '</div>' : '<div class="lab-note">Jalankan eksperimen untuk mengisi tabel M–R–S.</div>';
    a.push('Perubahan pada baris R sebanding dengan koefisien: 1 : 1 : 2.');
    a.push('Pada suhu yang sama, Kc tetap walaupun konsentrasi mula-mula berbeda.');
  } else {
    const H = labS.hab, hasil = habHasil(H.T, H.P), laju = habLaju(H.T, H.cat);
    it.textContent = '🧪 Kondisi reaktor'; ht.textContent = '🧮 Hasil dan laju';
    info.innerHTML = '<div class="hasil-baris">N₂ + 3H₂ ⇌ 2NH₃  ΔH = −92 kJ<br>T = ' + H.T + ' °C · P = ' + H.P + ' atm<br>' + (H.cat ? 'katalis Fe' : 'tanpa katalis') + '<br>Umpan N₂ : H₂ = 1 : 3</div>';
    hit.innerHTML = '<div class="hasil-baris">Hasil NH₃ saat setimbang = <b>' + labNum(hasil, 1) + ' %</b><br>Laju relatif = <b>' + (laju >= 0.001 ? '×' + labNum(laju, 2) : '≈ 0') + '</b> (acuan: 450 °C dengan Fe)<br>Kp(T) = ' + habKp(H.T).toExponential(2).replace('.', ',') + ' atm⁻²</div>';
    a.push('Suhu naik: laju naik tetapi hasil turun (reaksi eksoterm).');
    a.push('Tekanan naik: hasil naik (4 mol gas menjadi 2 mol gas).');
    a.push('Katalis Fe mempercepat tanpa mengubah hasil pada keadaan setimbang.');
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
  const L = labS.le;
  if (!labS.m2opt) labS.m2opt = labAcak([
    { t:'Reaksi ke kanan bersifat endoterm (ΔH > 0), sehingga K membesar', b:true },
    { t:'Reaksi ke kanan bersifat eksoterm (ΔH < 0)', b:false },
    { t:'Kenaikan suhu menambah jumlah N₂O₄', b:false },
    { t:'Kenaikan suhu bekerja seperti katalis', b:false }]);
  labKuis('m2-quiz', labS.misi[1], 'Kenaikan suhu menggeser kesetimbangan ke arah reaksi endoterm.', L.tempOk, 'Naikkan suhu dan tunggu setimbang baru.', 'Mengapa kenaikan suhu membuat campuran makin cokelat (NO₂ bertambah)?', labS.m2opt, 'labJawabM2', 'm2', 'm2');
  if (!labS.m3opt) labS.m3opt = labAcak([
    { t:'Bergeser ke kiri (N₂O₄), karena sisi kiri memiliki jumlah mol gas lebih sedikit (1 mol dibanding 2 mol)', b:true },
    { t:'Bergeser ke kanan (NO₂), karena sisi kanan memiliki jumlah mol gas lebih banyak', b:false },
    { t:'Tidak bergeser, karena volume tidak memengaruhi kesetimbangan', b:false },
    { t:'Bergeser ke kiri, karena K bertambah kecil', b:false }]);
  labKuis('m3-quiz', labS.misi[2], 'Tekanan naik menggeser ke sisi dengan jumlah mol gas lebih sedikit.', L.volOk, 'Perkecil volume dan tunggu setimbang baru.', 'Volume diperkecil dan sistem setimbang kembali. Bagaimana pergeseran kesetimbangannya?', labS.m3opt, 'labJawabM3', 'm3', 'm3');
  const K = labS.kcLast;
  if (K && !labS.misi[3]) {
    const kk = JSON.stringify([K.a, K.b]);
    if (labS.m4key !== kk || !$L('m4-quiz').querySelector('.m-nota')) {
      labS.m4key = kk;
      const benar = K.hi * K.hi / (K.h * K.i), s1 = K.hi / (K.h * K.i), s2 = (K.h * K.i) / (K.hi * K.hi), s3 = K.hi * K.hi / (K.h + K.i);
      labS.m4opt = labAcak([{ t:labSig(benar), b:true }, { t:labSig(s1), b:false }, { t:labSig(s2), b:false }, { t:labSig(s3), b:false }]);
    }
  }
  const tanya4 = K ? 'Dari tabel setimbang: [H₂] = ' + labNum(K.h, 3) + ' M, [I₂] = ' + labNum(K.i, 3) + ' M, [HI] = ' + labNum(K.hi, 3) + ' M. Berapa Kc?' : '';
  labS.m4kuis = labKuis('m4-quiz', labS.misi[3], 'Kc = [HI]² ÷ ([H₂][I₂]) = ' + labNum(KC_TRUE, 0) + ' (tetap pada suhu yang sama).', !!K, 'Selesaikan eksperimen Hitung Kc terlebih dahulu.', tanya4, labS.m4opt || [], 'labJawabM4', labS.m4key, labS.m4kuis);
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
function labJawabM2(i){ labJawab('m2-quiz', labS.m2opt, i, 'm2-fb', 'Tepat! Karena reaksi ke kanan menyerap kalor, kenaikan suhu menggesernya ke kanan.', 'Belum tepat. Perhatikan tanda ΔH reaksi N₂O₄ → 2NO₂.', 1, '🎉 Misi 2 selesai! Kamu memahami pengaruh suhu.'); }
function labJawabM3(i){ labJawab('m3-quiz', labS.m3opt, i, 'm3-fb', 'Benar! Tekanan naik menggeser ke sisi dengan jumlah mol gas lebih sedikit.', 'Belum tepat. Bandingkan jumlah mol gas di kiri dan kanan persamaan.', 2, '🎉 Misi 3 selesai! Kamu memahami pengaruh tekanan.'); }
function labJawabM4(i){ labJawab('m4-quiz', labS.m4opt, i, 'm4-fb', 'Tepat! Koefisien HI (2) menjadi pangkat pada rumus Kc.', 'Belum tepat. Kc = [HI]² ÷ ([H₂][I₂]): produk di atas, pangkat sesuai koefisien.', 3, '🎉 Misi 4 selesai! Kc = ' + labNum(KC_TRUE, 0) + '.'); }

/* ---------- LKPD, reset, toast, selesai ---------- */
function labCatat(){
  labS.catatNo++;
  const item = document.createElement('div'); item.className = 'lab-log-item';
  let isi = '';
  if (labS.mode === 'le') { const L = labS.le; isi = '<b>Setimbang</b> · ' + L.T + ' °C, ' + labNum(L.V, 1) + ' L, ' + (L.cat ? 'katalis' : 'tanpa katalis') + '<br>[N₂O₄] = ' + labNum(L.c1, 4) + ' M · [NO₂] = ' + labNum(L.c2, 4) + ' M · K = ' + labNum(leK(L.T), 4); }
  else if (labS.mode === 'kc') { const { a, b } = labS.kc, E = kcHitung(a, b); isi = '<b>Hitung Kc</b> · mula-mula ' + labNum(a, 2) + ' dan ' + labNum(b, 2) + ' M<br>setimbang [H₂] = ' + labNum(E.h, 3) + ', [I₂] = ' + labNum(E.i, 3) + ', [HI] = ' + labNum(E.hi, 3); }
  else { const H = labS.hab; isi = '<b>Haber–Bosch</b> · ' + H.T + ' °C, ' + H.P + ' atm, ' + (H.cat ? 'Fe' : 'tanpa katalis') + '<br>hasil NH₃ ' + labNum(habHasil(H.T, H.P), 1) + '% · laju ×' + labNum(habLaju(H.T, H.cat), 2); }
  item.innerHTML = '<b>No. ' + labS.catatNo + '</b> · ' + isi;
  const log = $L('lab-log'); log.insertBefore(item, log.firstChild);
  while (log.children.length > 10) log.removeChild(log.lastChild);
  labToast('📓 Pengamatan berhasil dicatat ke LKPD!');
}
function labReset(){
  labS.mode = 'le';
  labS.le = { T:25, V:1.0, cat:false, c1:C1_AWAL, c2:0, t:0, started:false, eq:false, hist:[], events:[], pending:null, eqLog:[], tempOk:false, volOk:false };
  labS.kc = { a:0.10, b:0.10 }; labS.kcAnim = 0; labS.kcRun = false; labS.kcLast = null;
  labS.hab = { T:450, P:200, cat:true };
  leSinkronDots(true); labRender();
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
  else if (s >= 60) kal = 'Bagus! Terus berlatih menganalisis kesetimbangan.';
  else kal = 'Ayo selesaikan semua misi untuk meraih skor penuh!';
  $L('lab-akhir-kal').textContent = kal;
  openModal('modal-lab'); sfx('win');
}

(function labInit(){
  if (!$L('scr-lab')) return;
  labRender(); labUpdateMisiCount();
})();
