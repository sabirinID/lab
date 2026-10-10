/* ##############################################################
   #  LAB MAYA — PRAKTIKUM VIRTUAL LAJU REAKSI                  #
   #  Tiga eksperimen: tumbukan partikel (konsentrasi, suhu,    #
   #  katalis), luas permukaan, dan orde reaksi.                #
   ############################################################## */
const LAB_NS = 'http://www.w3.org/2000/svg';
const $L = id => document.getElementById(id);

const R_GAS = 8.314, T_REF = 298.15;
const EA0 = 50000, EA_CAT = 46000;     // J/mol
const K25 = 0.020;                      // M⁻¹ s⁻¹ pada 25 °C tanpa katalis
const LAJU = 5;                         // percepatan waktu simulasi
const DUR = 60;                         // durasi simulasi (detik simulasi)
const BOX = { x0:40, x1:388, y0:62, y1:352 };
const K_LUAS = 0.03, V_MAX = 98;        // s⁻¹ (S = 1, 1 M) dan mL CO₂

const KONS = [0.5, 1.0, 2.0], SUHU = [25, 35, 45], A_B = [0.1, 0.2, 0.4], HCL = [0.5, 1.0, 2.0];
const LAB_LUAS = {
  bongkahan: { nama:'Bongkahan', S:1,  sub:'S = 1×' },
  butiran:   { nama:'Butiran',   S:4,  sub:'S = 4×' },
  serbuk:    { nama:'Serbuk',    S:16, sub:'S = 16×' }
};
const LAB_ORDE = {
  r1: { id:'r1', nama:'Reaksi 1', m:1, n:1, k:0.5 },
  r2: { id:'r2', nama:'Reaksi 2', m:2, n:1, k:2.0 },
  r3: { id:'r3', nama:'Reaksi 3', m:0, n:2, k:0.8 }
};
const LAB_MODE = [
  { id:'tum',  nama:'Tumbukan',      sub:'', kerja:'Mulai reaksi' },
  { id:'luas', nama:'Permukaan',     sub:'', kerja:'Mulai reaksi' },
  { id:'orde', nama:'Orde reaksi',   sub:'', kerja:'Jalankan percobaan' }
];

const labS = {
  mode:'tum',
  tum:{ conc:1.0, T:25, cat:false }, luas:{ shape:'serbuk', hcl:1.0 }, orde:{ rx:'r2', A:0.2, B:0.1 },
  ts:0, running:false, ordeDur:3,
  tumRuns:[], tumGhost:null, tumLast:null, luasRuns:[], ordeRows:{ r1:[], r2:[], r3:[] },
  done:{ tum:false, luas:false, orde:false },
  sim:{ parts:[], eff:0, tot:0, conv:0, lastConv:0, N0:10 },
  mikro:false, visKey:'', catatNo:0,
  misi:[false,false,false,false,false], skor:0, m4opt:null, m5opt:null, m5key:''
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
function labRng(seed){ let s = seed >>> 0; return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; }; }
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
function labAcak(arr){ for (let i = arr.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [arr[i], arr[j]] = [arr[j], arr[i]]; } return arr; }
function labAktif(){ const s = $L('scr-lab'); return s && s.classList.contains('active'); }

/* ---------- Kinetika ---------- */
function labKTum(Tc, cat){
  const T = Tc + 273.15, Ea = cat ? EA_CAT : EA0;
  return K25 * Math.exp(-Ea / (R_GAS * T)) / Math.exp(-EA0 / (R_GAS * T_REF));
}
function labXTum(k, C0, t){ const a = k * C0 * t; return a / (1 + a); }
function labKLuas(shape, hcl){ return K_LUAS * LAB_LUAS[shape].S * hcl; }
function labVOrde(R, A, B){ return R.k * Math.pow(A, R.m) * Math.pow(B, R.n); }
function labDurasi(){ return labS.mode === 'orde' ? labS.ordeDur : DUR; }

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
  if (labS.mikro) labToast('🔬 Panah menunjukkan arah dan kelajuan partikel.');
}
function labResetRun(){ labS.ts = 0; labS.running = false; }
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
  $L('rakit-dyn').innerHTML = '';
  if (labS.mode === 'tum') {
    const g1 = labSec('🧪 Konsentrasi A dan B', 'sama untuk keduanya', 'rx-grid');
    KONS.forEach((c, i) => labChip(g1, labNum(c, 1) + ' M', '', labS.tum.conc === c, () => labPilih(() => { labS.tum.conc = c; })));
    const g2 = labSec('🌡️ Suhu', '', 'rx-grid');
    SUHU.forEach(t => labChip(g2, t + ' °C', '', labS.tum.T === t, () => labPilih(() => { labS.tum.T = t; })));
    const g3 = labSec('⚗️ Katalis', 'Ea turun 4 kJ/mol', 'rx-grid cols2');
    labChip(g3, 'Tanpa katalis', '', !labS.tum.cat, () => labPilih(() => { labS.tum.cat = false; }));
    labChip(g3, 'Dengan katalis', '', labS.tum.cat, () => labPilih(() => { labS.tum.cat = true; }));
  } else if (labS.mode === 'luas') {
    const g1 = labSec('🪨 Bentuk CaCO₃ (gelas kanan)', 'massa sama', 'rx-grid');
    Object.keys(LAB_LUAS).forEach(k => labChip(g1, LAB_LUAS[k].nama, LAB_LUAS[k].sub, labS.luas.shape === k, () => labPilih(() => { labS.luas.shape = k; })));
    const g2 = labSec('🧴 Konsentrasi HCl', 'kedua gelas', 'rx-grid');
    HCL.forEach(c => labChip(g2, labNum(c, 1) + ' M', '', labS.luas.hcl === c, () => labPilih(() => { labS.luas.hcl = c; })));
  } else {
    const g1 = labSec('🧪 Reaksi A + B → produk', 'orde belum diketahui', 'rx-grid');
    Object.values(LAB_ORDE).forEach(r => labChip(g1, r.nama, labS.ordeRows[r.id].length + ' data', labS.orde.rx === r.id, () => labPilih(() => { labS.orde.rx = r.id; })));
    const wrap = labSec('🧪 Konsentrasi awal', 'M', 'ab-wrap');
    ['A','B'].forEach(nm => {
      const row = document.createElement('div'); row.className = 'ab-row';
      row.innerHTML = '<span class="ab-lab">' + nm + '</span>';
      const g = document.createElement('div'); g.className = 'rx-grid'; row.appendChild(g); wrap.appendChild(row);
      A_B.forEach(c => labChip(g, labNum(c, 1), '', labS.orde[nm] === c, () => { labS.orde[nm] = c; labRender(); }));
    });
  }
  const rb = $L('run-btn'), mode = LAB_MODE.find(m => m.id === labS.mode);
  rb.disabled = labS.running;
  rb.textContent = labS.running ? '⏳ Berjalan...' : ((labS.mode !== 'orde' && labS.done[labS.mode] && labS.ts > 0) ? '↻ Ulangi: ' + mode.kerja : '▶ ' + mode.kerja);
}

/* ---------- Simulasi tumbukan ---------- */
function labBangunTum(){
  const P = labS.tum, N0 = Math.round(P.conc * 10);
  const g = $L('tPart'); g.innerHTML = '';
  const vg = svEl('g', { id:'tVec' }, g);
  labS.sim = { parts:[], eff:0, tot:0, conv:0, lastConv:0, N0 };
  const r = labRng(7 + N0 * 13), sp = 70 * Math.sqrt((P.T + 273.15) / T_REF);
  const pts = labTitik(2 * N0, BOX.x0 + 16, BOX.x1 - 16, BOX.y0 + 16, BOX.y1 - 16, 31 + N0, 17);
  for (let i = 0; i < 2 * N0; i++) {
    const tipe = i < N0 ? 'A' : 'B', ang = r() * 6.2832, v = sp * (.7 + r() * .6);
    const el = svEl('circle', { r:7, fill: tipe === 'A' ? '#F26A21' : '#3B8CFF', stroke:'#fff', 'stroke-width':1.5 }, g);
    const vec = svEl('line', { stroke:'#fff', 'stroke-width':2, 'stroke-linecap':'round', 'stroke-opacity':.85, class:'lbl' }, vg);
    labS.sim.parts.push({ x:pts[i][0], y:pts[i][1], vx:Math.cos(ang) * v, vy:Math.sin(ang) * v, tipe, el, vec, alive:true, rad:7 });
  }
  $L('tFx').innerHTML = '';
  labFrameTum(0);
}
function labKonversi(a, b){
  const S = labS.sim;
  const mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2;
  a.tipe = 'P'; a.rad = 9; a.x = mx; a.y = my; a.el.setAttribute('fill', '#1E8E5A'); a.el.setAttribute('r', 9);
  b.alive = false; b.el.setAttribute('visibility', 'hidden'); b.vec.setAttribute('visibility', 'hidden');
  S.conv++; S.eff++; S.lastConv = performance.now();
  const ring = svEl('circle', { cx:mx.toFixed(1), cy:my.toFixed(1), r:11, fill:'none', stroke:'#FFC21A', 'stroke-width':3, class:'fx-ring' }, $L('tFx'));
  setTimeout(() => ring.remove(), 600);
  if (typeof sfx === 'function' && Math.random() < .25) sfx('pop');
}
function labFrameTum(dt){
  const S = labS.sim, ps = S.parts; if (!ps.length) return;
  const N0 = S.N0, K = labKTum(labS.tum.T, labS.tum.cat);
  for (const p of ps) {
    if (!p.alive) continue;
    p.x += p.vx * dt; p.y += p.vy * dt;
    if (p.x < BOX.x0 + p.rad) { p.x = BOX.x0 + p.rad; p.vx = Math.abs(p.vx); }
    if (p.x > BOX.x1 - p.rad) { p.x = BOX.x1 - p.rad; p.vx = -Math.abs(p.vx); }
    if (p.y < BOX.y0 + p.rad) { p.y = BOX.y0 + p.rad; p.vy = Math.abs(p.vy); }
    if (p.y > BOX.y1 - p.rad) { p.y = BOX.y1 - p.rad; p.vy = -Math.abs(p.vy); }
  }
  const target = labS.running ? Math.floor(N0 * labXTum(K, labS.tum.conc, labS.ts)) : S.conv;
  let tabrak = null;
  for (let i = 0; i < ps.length; i++) {
    const a = ps[i]; if (!a.alive) continue;
    for (let j = i + 1; j < ps.length; j++) {
      const b = ps[j]; if (!b.alive) continue;
      const dx = b.x - a.x, dy = b.y - a.y, rr = a.rad + b.rad;
      if (dx * dx + dy * dy < rr * rr) {
        const d = Math.hypot(dx, dy) || 1, nx = dx / d, ny = dy / d;
        const vn = (b.vx - a.vx) * nx + (b.vy - a.vy) * ny;
        if (vn < 0) { a.vx += vn * nx; a.vy += vn * ny; b.vx -= vn * nx; b.vy -= vn * ny; S.tot++; if (!tabrak && a.tipe !== b.tipe && a.tipe !== 'P' && b.tipe !== 'P') tabrak = [a, b]; }
        const ov = (rr - d) / 2; a.x -= nx * ov; a.y -= ny * ov; b.x += nx * ov; b.y += ny * ov;
      }
    }
  }
  if (labS.running && S.conv < target) {
    if (tabrak) labKonversi(tabrak[0], tabrak[1]);
    else if (performance.now() - S.lastConv > 250) {
      let best = null, bd = 1e9;
      const A = ps.filter(p => p.alive && p.tipe === 'A'), B = ps.filter(p => p.alive && p.tipe === 'B');
      A.forEach(a => B.forEach(b => { const d = (a.x - b.x) ** 2 + (a.y - b.y) ** 2; if (d < bd) { bd = d; best = [a, b]; } }));
      if (best) labKonversi(best[0], best[1]);
    }
  }
  const sk = 0.28;
  for (const p of ps) {
    if (!p.alive) continue;
    p.el.setAttribute('cx', p.x.toFixed(1)); p.el.setAttribute('cy', p.y.toFixed(1));
    p.vec.setAttribute('x1', p.x.toFixed(1)); p.vec.setAttribute('y1', p.y.toFixed(1));
    p.vec.setAttribute('x2', (p.x + p.vx * sk).toFixed(1)); p.vec.setAttribute('y2', (p.y + p.vy * sk).toFixed(1));
  }
  $L('tCnt').textContent = 'Tumbukan efektif: ' + S.eff + '   ·   tumbukan total: ' + S.tot;
}
setInterval(() => { if (labAktif() && labS.mode === 'tum') labFrameTum(0.033); }, 33);

function labBangunDist(){
  const P = labS.tum, TK = P.T + 273.15, th = 1.6 * TK / T_REF, emax = 14, sc = 80 / (1.6 / Math.E);
  const px = E => 424 + E * (274 / emax), py = E => 190 - E * Math.exp(-E / th) * sc * 0.72;
  const Ea = P.cat ? 6.0 : 7.5;
  let d = 'M' + px(0) + ',' + py(0);
  for (let E = 0.2; E <= emax + 0.01; E += 0.2) d += ' L' + px(E).toFixed(1) + ',' + py(E).toFixed(1);
  $L('tCurve').setAttribute('d', d);
  let pts = px(Ea).toFixed(1) + ',190';
  for (let E = Ea; E <= emax + 0.01; E += 0.2) pts += ' ' + px(E).toFixed(1) + ',' + py(E).toFixed(1);
  pts += ' ' + px(emax).toFixed(1) + ',190';
  $L('tShade').setAttribute('points', pts);
  const xe = px(Ea);
  $L('tEa').setAttribute('x1', xe); $L('tEa').setAttribute('x2', xe);
  $L('tEaT').setAttribute('x', xe); $L('tEaT').textContent = P.cat ? 'Ea (katalis)' : 'Ea';
  $L('tTx').textContent = 'T = ' + P.T + ' °C';
  const rel = labKTum(P.T, P.cat) / K25;
  $L('tRel').textContent = 'relatif terhadap 25 °C tanpa katalis: ×' + labNum(rel, 1);
}

function labChartPath(k, C0, tmax){
  let d = '';
  for (let t = 0; t <= tmax + 0.01; t += 1.5) {
    const C = C0 * (1 - labXTum(k, C0, t));
    d += (t === 0 ? 'M' : ' L') + (424 + t / DUR * 274).toFixed(1) + ',' + (380 - C / 2.0 * 100).toFixed(1);
  }
  return d;
}

/* ---------- Luas permukaan ---------- */
function labBangunLuas(){
  const L_ = { L:{ cx:190, shape:'bongkahan' }, R:{ cx:554, shape:labS.luas.shape } };
  ['L','R'].forEach(S => {
    const cx = L_[S].cx, shape = L_[S].shape, g = $L('lSolid' + S); g.innerHTML = '';
    const base = svEl('g', {}, g);
    const w = (n, pts, tf) => svEl('polygon', { points:pts, fill:'#C9D3E0', stroke:'#8795AD', 'stroke-width':1.5, transform:tf || '' }, base);
    if (shape === 'bongkahan') {
      w(1, (cx - 38) + ',418 ' + (cx - 44) + ',384 ' + (cx - 20) + ',364 ' + (cx + 14) + ',368 ' + (cx + 42) + ',390 ' + (cx + 38) + ',418');
    } else if (shape === 'butiran') {
      labTitik(7, cx - 66, cx + 66, 392, 412, 5 + cx, 24).forEach((p, i) => {
        const r = 11 + (i % 3) * 2;
        w(1, (p[0] - r) + ',' + (p[1] + 6) + ' ' + (p[0] - r + 3) + ',' + (p[1] - r) + ' ' + (p[0] + r - 2) + ',' + (p[1] - r + 3) + ' ' + (p[0] + r) + ',' + (p[1] + 6));
      });
    } else {
      labTitik(44, cx - 70, cx + 70, 396, 416, 9 + cx, 7).forEach(p => svEl('rect', { x:p[0] - 2.6, y:p[1] - 2.6, width:5.2, height:5.2, rx:1, fill:'#C9D3E0', stroke:'#8795AD', 'stroke-width':.8 }, base));
    }
    const t = svEl('text', { class:'lbl', x:cx, y:360, 'text-anchor':'middle' }, g); t.textContent = 'CaCO₃(s)';
    // gelembung CO₂
    const bb = $L('lBub' + S); bb.innerHTML = '';
    const k = labKLuas(shape, labS.luas.hcl), dur = labKlem(2.6 / Math.sqrt(k / K_LUAS), .5, 3);
    for (let i = 0; i < 14; i++) {
      const r = labRng(cx + i * 17);
      svEl('circle', { class:'bubB', cx:(cx - 60 + r() * 120).toFixed(1), cy:404, r:(3 + r() * 3).toFixed(1), fill:'#fff', 'fill-opacity':.55, stroke:'#fff', 'stroke-width':1.5,
        style:'--bx:' + ((r() - .5) * 14).toFixed(1) + 'px;--bd:' + (dur * (.7 + r() * .6)).toFixed(2) + 's;animation-delay:' + (r() * dur).toFixed(2) + 's' }, bb);
    }
  });
  $L('lPillTR').textContent = LAB_LUAS[labS.luas.shape].nama.toUpperCase();
  $L('lPillTL').textContent = 'BONGKAHAN (acuan)';
  $L('lab-svg').style.setProperty('--solL', 'rgba(156,201,255,.34)');
}

/* ---------- Render ---------- */
function labRender(){
  const mode = labS.mode;
  const key = [mode, JSON.stringify(labS.tum), JSON.stringify(labS.luas), labS.orde.rx].join('|');
  if (key !== labS.visKey) {
    labS.visKey = key;
    $L('scTum').style.display = mode === 'tum' ? '' : 'none';
    $L('scLuas').style.display = mode === 'luas' ? '' : 'none';
    $L('scOrde').style.display = mode === 'orde' ? '' : 'none';
    if (mode === 'tum') {
      const P = labS.tum, k = labKTum(P.T, P.cat);
      labBangunTum(); labBangunDist();
      $L('tInfo').textContent = 'Ea = ' + (P.cat ? '46' : '50') + ' kJ/mol · k = ' + labNum(k, 3) + ' M⁻¹ s⁻¹ · [A]₀ = [B]₀ = ' + labNum(P.conc, 1) + ' M';
      $L('tEq').textContent = 'A + B → P   (v = k [A][B])';
    }
    if (mode === 'luas') { labBangunLuas(); }
    if (mode === 'orde') { $L('oRx').textContent = LAB_ORDE[labS.orde.rx].nama.toUpperCase(); }
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

  if (labS.mode === 'tum') {
    const P = labS.tum, k = labKTum(P.T, P.cat);
    $L('tLine').setAttribute('d', ts > 0 ? labChartPath(k, P.conc, ts) : '');
    $L('tGhost').setAttribute('d', labS.tumGhost ? labChartPath(labS.tumGhost.k, labS.tumGhost.conc, DUR) : '');
    $L('tVec').style.display = labS.mikro ? '' : 'none';
    if (!labS.running && labS.done.tum && ts > 0) status = 'Selesai · v₀ = ' + labNum(k * P.conc * P.conc, 4) + ' M/s';
  }

  if (labS.mode === 'luas') {
    const kL = labKLuas('bongkahan', labS.luas.hcl), kR = labKLuas(labS.luas.shape, labS.luas.hcl);
    const VL = V_MAX * (1 - Math.exp(-kL * ts)), VR = V_MAX * (1 - Math.exp(-kR * ts));
    [['L', VL], ['R', VR]].forEach(([S, V]) => {
      $L('lGas' + S).style.transform = 'scaleY(' + labKlem(V / 100, 0, 1).toFixed(3) + ')';
      $L('lMl' + S).textContent = labNum(V, 0) + ' mL';
      const sisa = Math.pow(Math.max(0.02, 1 - V / V_MAX), 1 / 3);
      const cx = S === 'L' ? 190 : 554;
      $L('lSolid' + S).firstChild.setAttribute('transform', 'translate(' + cx + ',418) scale(' + sisa.toFixed(3) + ') translate(' + (-cx) + ',-418)');
      $L('lB' + S).classList.toggle('boilon', labS.running && V < V_MAX * 0.97);
    });
    const curve = (k) => { let d = ''; for (let t = 0; t <= ts + 0.01; t += 1.5) d += (t === 0 ? 'M' : ' L') + (310 + t / DUR * 126).toFixed(1) + ',' + (296 - V_MAX * (1 - Math.exp(-k * t)) / 100 * 146).toFixed(1); return d; };
    $L('lCurL').setAttribute('d', ts > 0 ? curve(kL) : ''); $L('lCurR').setAttribute('d', ts > 0 ? curve(kR) : '');
    $L('lV0L').textContent = 'bongkahan: v₀ = ' + labNum(V_MAX * kL, 1) + ' mL/s';
    $L('lV0R').textContent = LAB_LUAS[labS.luas.shape].nama.toLowerCase() + ': v₀ = ' + labNum(V_MAX * kR, 1) + ' mL/s';
    if (!labS.running && labS.done.luas && ts > 0) status = 'Selesai · v₀ ×' + labNum(kR / kL, 0) + ' lebih besar';
  }

  if (labS.mode === 'orde') {
    const O = labS.orde;
    $L('oAt').textContent = 'A ' + labNum(O.A, 1) + ' M'; $L('oBt').textContent = 'B ' + labNum(O.B, 1) + ' M';
    const p = labS.running ? labKlem(ts / labS.ordeDur, 0, 1) : 0;
    $L('oProd').setAttribute('opacity', (p * .85).toFixed(2));
    $L('oTimer').textContent = labNum(labS.running ? ts : 0, 1) + ' s';
    const rows = labS.ordeRows[O.rx], g = $L('oRows'); g.innerHTML = '';
    rows.slice(0, 7).forEach((r, i) => {
      const y = 140 + i * 34, ok = i === rows.length - 1;
      if (ok) svEl('rect', { x:240, y:y - 18, width:462, height:28, rx:7, fill:'rgba(255,194,26,.14)' }, g);
      [[252, String(i + 1)], [340, labNum(r.A, 1)], [430, labNum(r.B, 1)], [590, labNum(r.v * 1000, 2)]].forEach(([x, tx]) => {
        const t = svEl('text', { x, y:y + 1, 'text-anchor':'middle', 'font-size':14, 'font-weight':800, fill:'#fff', 'font-family':'Figtree,sans-serif' }, g); t.textContent = tx;
      });
    });
    $L('oHint').textContent = rows.length < 3 ? 'Ubah satu konsentrasi saja, lalu bandingkan laju awalnya. (' + rows.length + '/3 data)' : 'Data cukup. Bandingkan laju saat satu konsentrasi dilipatduakan.';
    if (!labS.running && labS.done.orde) status = 'Selesai · ' + rows.length + ' data';
  }
  const st = $L('lab-status'); st.textContent = status; st.className = 'lab-status ' + (status.indexOf('Selesai') === 0 || status === 'Berjalan...' ? 'on' : 'off');
}

/* ---------- Eksekusi ---------- */
function labJalankan(){
  if (labS.running) return;
  if (labS.mode === 'orde') {
    const O = labS.orde, rows = labS.ordeRows[O.rx];
    if (rows.some(r => r.A === O.A && r.B === O.B)) { labToast('📋 Kombinasi ini sudah ada di tabel. Ubah [A] atau [B].'); return; }
    if (rows.length >= 7) { labToast('📋 Tabel penuh. Gunakan Reset untuk memulai ulang.'); return; }
    labS.ordeDur = labKlem(5 * (0.004 / labVOrde(LAB_ORDE[O.rx], O.A, O.B)), 0.8, 4.5);
  } else if (labS.mode === 'tum') {
    labS.tumGhost = labS.tumLast;
    labBangunTum();
  }
  labS.ts = 0; labS.running = true;
  labRenderPanel(); labDinamis();
  sfx('click');
}
function labSelesaiRun(){
  const mode = labS.mode;
  labS.running = false; labS.done[mode] = true;
  if (mode === 'tum') {
    const P = labS.tum, run = { conc:P.conc, T:P.T, cat:P.cat, k:labKTum(P.T, P.cat) };
    labS.tumLast = run;
    const S = labS.sim, target = Math.floor(S.N0 * labXTum(run.k, P.conc, DUR));
    while (S.conv < target) {
      const A = S.parts.filter(p => p.alive && p.tipe === 'A'), B = S.parts.filter(p => p.alive && p.tipe === 'B');
      if (!A.length || !B.length) break;
      labKonversi(A[0], B.reduce((m, b) => ((b.x - A[0].x) ** 2 + (b.y - A[0].y) ** 2 < (m.x - A[0].x) ** 2 + (m.y - A[0].y) ** 2 ? b : m), B[0]));
    }
    labFrameTum(0);
    const lain = labS.tumRuns.slice();
    labS.tumRuns.push(run);
    const adaBeda = f => lain.some(f);
    if (!labS.misi[0] && adaBeda(e => e.T === run.T && e.cat === run.cat && e.conc !== run.conc)) { labS.misi[0] = true; labSkor(20, '🎉 Misi 1 selesai! Konsentrasi lebih tinggi: reaksi lebih cepat.'); }
    if (!labS.misi[1] && adaBeda(e => e.conc === run.conc && e.cat === run.cat && e.T !== run.T)) { labS.misi[1] = true; labSkor(20, '🎉 Misi 2 selesai! Suhu lebih tinggi: reaksi lebih cepat.'); }
    if (!labS.misi[2] && adaBeda(e => e.conc === run.conc && e.T === run.T && e.cat !== run.cat)) { labS.misi[2] = true; labSkor(20, '🎉 Misi 3 selesai! Katalis menurunkan Ea sehingga reaksi lebih cepat.'); }
  } else if (mode === 'luas') {
    labS.luasRuns.push({ shape:labS.luas.shape, hcl:labS.luas.hcl });
  } else {
    const O = labS.orde, v = labVOrde(LAB_ORDE[O.rx], O.A, O.B);
    labS.ordeRows[O.rx].push({ A:O.A, B:O.B, v });
  }
  labRenderPanel(); labDinamis(); labIsiData(); labRenderMisi();
}
setInterval(() => {
  if (!labS.running) return;
  labS.ts += 0.1 * (labS.mode === 'orde' ? 1 : LAJU);
  const dur = labDurasi();
  if (labS.ts >= dur) { labS.ts = dur; labDinamis(); labSelesaiRun(); return; }
  labDinamis();
}, 100);

/* ---------- Tab Data ---------- */
function labIsiData(){
  const info = $L('d-info'), hit = $L('d-hitung'), it = $L('d-info-t'), ht = $L('d-hitung-t'), am = $L('d-amati');
  const a = [];
  if (labS.mode === 'tum') {
    const P = labS.tum, k = labKTum(P.T, P.cat), v0 = k * P.conc * P.conc, th = 1 / (k * P.conc);
    it.textContent = '🧪 Kondisi reaksi'; ht.textContent = '🧮 Kinetika';
    info.innerHTML = '<div class="hasil-baris">A + B → P<br>[A]₀ = [B]₀ = ' + labNum(P.conc, 1) + ' M<br>T = ' + P.T + ' °C · ' + (P.cat ? 'dengan katalis (Ea = 46 kJ/mol)' : 'tanpa katalis (Ea = 50 kJ/mol)') + '</div>';
    hit.innerHTML = '<div class="hasil-baris">k = ' + labNum(k, 3) + ' M⁻¹ s⁻¹<br>v₀ = k[A]₀[B]₀ = <b>' + labNum(v0, 4) + ' M/s</b><br>t½ = 1 ÷ (k[A]₀) = <b>' + labNum(th, 1) + ' s</b><br>k relatif ×' + labNum(k / K25, 1) + ' (acuan 25 °C, tanpa katalis)</div>' +
      (labS.tumRuns.length ? '<div class="lab-note">Riwayat: ' + labS.tumRuns.slice(-4).map((r, i) => (labNum(r.conc, 1) + ' M, ' + r.T + ' °C, ' + (r.cat ? 'katalis' : 'tanpa') + ' → v₀ ' + labNum(r.k * r.conc * r.conc, 4))).join(' | ') + '</div>' : '');
    a.push('Konsentrasi lebih tinggi: partikel lebih rapat, tumbukan lebih sering.');
    a.push('Suhu lebih tinggi: partikel lebih cepat dan lebih banyak yang berenergi ≥ Ea.');
    a.push('Katalis menurunkan Ea, sehingga lebih banyak tumbukan efektif.');
  } else if (labS.mode === 'luas') {
    const kL = labKLuas('bongkahan', labS.luas.hcl), kR = labKLuas(labS.luas.shape, labS.luas.hcl);
    it.textContent = '🧪 Kondisi reaksi'; ht.textContent = '🧮 Laju awal';
    info.innerHTML = '<div class="hasil-baris">CaCO₃ (massa sama) + HCl ' + labNum(labS.luas.hcl, 1) + ' M<br>Kiri: bongkahan (S = 1×)<br>Kanan: ' + LAB_LUAS[labS.luas.shape].nama.toLowerCase() + ' (' + LAB_LUAS[labS.luas.shape].sub + ')</div>';
    hit.innerHTML = '<div class="hasil-baris">v₀ kiri = ' + labNum(V_MAX * kL, 1) + ' mL/s<br>v₀ kanan = ' + labNum(V_MAX * kR, 1) + ' mL/s<br>Perbandingan = <b>×' + labNum(kR / kL, 1) + '</b><br>Volume akhir CO₂ sama (' + labNum(V_MAX, 0) + ' mL): jumlah CaCO₃ sama.</div>';
    a.push('Laju sebanding dengan luas permukaan, tetapi hasil akhir (jumlah CO₂) tidak berubah.');
  } else {
    const O = labS.orde, rows = labS.ordeRows[O.rx];
    it.textContent = '🧪 ' + LAB_ORDE[O.rx].nama; ht.textContent = '🧮 Perbandingan percobaan';
    info.innerHTML = '<div class="hasil-baris">A + B → produk<br>Persamaan laju: v = k[A]<sup>m</sup>[B]<sup>n</sup> (m dan n belum diketahui)<br>Data terkumpul: ' + rows.length + '</div>';
    const pairs = [];
    for (let i = 0; i < rows.length; i++) for (let j = i + 1; j < rows.length; j++) {
      const r1 = rows[i], r2 = rows[j];
      if (r1.B === r2.B && r1.A !== r2.A) pairs.push('Percobaan ' + (i + 1) + ' dan ' + (j + 1) + ': [A] ×' + labNum(r2.A / r1.A, 1) + ', v ×' + labNum(r2.v / r1.v, 2));
      else if (r1.A === r2.A && r1.B !== r2.B) pairs.push('Percobaan ' + (i + 1) + ' dan ' + (j + 1) + ': [B] ×' + labNum(r2.B / r1.B, 1) + ', v ×' + labNum(r2.v / r1.v, 2));
    }
    hit.innerHTML = pairs.length ? '<div class="hasil-baris">' + pairs.join('<br>') + '</div><div class="lab-note">Orde = pangkat yang menghubungkan perubahan konsentrasi dan perubahan laju.</div>'
      : '<div class="lab-note">Lakukan minimal dua percobaan yang hanya berbeda pada satu konsentrasi.</div>';
    a.push('Orde tidak bisa ditebak dari koefisien, hanya dari data percobaan.');
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

function labRenderMisi(){
  ['st-m1','st-m2','st-m3','st-m4','st-m5'].forEach((id, i) => {
    const el = $L(id); if (el) el.textContent = labS.misi[i] ? '✅ Selesai (+20)' : '⬜ Belum selesai';
    const card = $L('misi-' + (i + 1)); if (card) card.classList.toggle('done', labS.misi[i]);
  });
  const q4 = $L('m4-quiz');
  if (q4) {
    if (labS.misi[3]) q4.innerHTML = '<div class="misi-hint ok">✅ Luas permukaan lebih besar memperbanyak tumbukan, sehingga laju lebih besar.</div>';
    else if (labS.luasRuns.some(r => r.shape !== 'bongkahan')) {
      if (!q4.querySelector('.m-nota')) {
        labS.m4opt = labAcak([
          { t:'Luas permukaannya lebih besar sehingga tumbukan lebih banyak', b:true },
          { t:'Energi aktivasinya lebih kecil', b:false },
          { t:'Massanya lebih besar', b:false },
          { t:'Serbuk bertindak sebagai katalis', b:false }
        ]);
        q4.innerHTML = '<div class="m4-tanya">Mengapa serbuk CaCO₃ bereaksi lebih cepat daripada bongkahan dengan massa sama?</div>' +
          labS.m4opt.map((o, i) => '<button class="m-nota" style="font-family:inherit" data-sfx onclick="labJawabM4(' + i + ')">' + o.t + '</button>').join('') + '<div class="feedback" id="m4-fb"></div>';
      }
    } else q4.innerHTML = '<div class="misi-hint">🔒 Selesaikan eksperimen Luas permukaan dengan butiran atau serbuk.</div>';
  }
  const q5 = $L('m5-quiz');
  if (q5) {
    const kandidat = Object.keys(labS.ordeRows).filter(k => labS.ordeRows[k].length >= 3).sort((a, b) => labS.ordeRows[b].length - labS.ordeRows[a].length)[0];
    if (labS.misi[4]) q5.innerHTML = '<div class="misi-hint ok">✅ Orde ditentukan dari perbandingan data percobaan, bukan dari koefisien.</div>';
    else if (kandidat) {
      const R = LAB_ORDE[kandidat], key = kandidat;
      if (labS.m5key !== key || !q5.querySelector('.m-nota')) {
        labS.m5key = key;
        const f = (m, n) => 'v = k' + (m ? '[A]' + (m > 1 ? '<sup>' + m + '</sup>' : '') : '') + (n ? '[B]' + (n > 1 ? '<sup>' + n + '</sup>' : '') : '');
        const semua = [[1,1],[2,1],[1,2],[0,2],[2,0],[1,0],[0,1]].filter(c => !(c[0] === R.m && c[1] === R.n));
        const opts = labAcak(semua).slice(0, 3).map(c => ({ t:f(c[0], c[1]), b:false }));
        opts.push({ t:f(R.m, R.n), b:true });
        labS.m5opt = labAcak(opts);
        q5.innerHTML = '<div class="m4-tanya">Berdasarkan data <b>' + R.nama + '</b>, persamaan lajunya adalah ...</div>' +
          labS.m5opt.map((o, i) => '<button class="m-nota" style="font-family:inherit" data-sfx onclick="labJawabM5(' + i + ')">' + o.t + '</button>').join('') + '<div class="feedback" id="m5-fb"></div>';
      }
    } else q5.innerHTML = '<div class="misi-hint">🔒 Kumpulkan minimal 3 percobaan pada satu reaksi di eksperimen Orde reaksi.</div>';
  }
}
function labJawabM4(i){
  if (labS.misi[3] || !labS.m4opt) return;
  const o = labS.m4opt[i], btns = document.querySelectorAll('#m4-quiz .m-nota'), fb = $L('m4-fb');
  if (o.b) {
    btns[i].classList.add('benar');
    if (fb) { fb.className = 'feedback show ok'; fb.textContent = 'Tepat! Bidang sentuh yang lebih luas memperbanyak tumbukan antara partikel pereaksi.'; }
    labS.misi[3] = true; labSkor(20, '🎉 Misi 4 selesai! Kamu memahami pengaruh luas permukaan.');
  } else {
    btns[i].classList.add('salah'); btns[i].disabled = true;
    if (fb) { fb.className = 'feedback show no'; fb.textContent = 'Belum tepat. Jenis zat dan massanya sama; yang berbeda hanya bentuknya.'; }
    sfx('salah'); efekSalahFlash();
  }
}
function labJawabM5(i){
  if (labS.misi[4] || !labS.m5opt) return;
  const o = labS.m5opt[i], btns = document.querySelectorAll('#m5-quiz .m-nota'), fb = $L('m5-fb');
  if (o.b) {
    btns[i].classList.add('benar');
    if (fb) { fb.className = 'feedback show ok'; fb.textContent = 'Benar! Kamu menentukan orde dari perbandingan data percobaan.'; }
    labS.misi[4] = true; labSkor(20, '🎉 Misi 5 selesai! Reaksi misterius terpecahkan.');
  } else {
    btns[i].classList.add('salah'); btns[i].disabled = true;
    if (fb) { fb.className = 'feedback show no'; fb.textContent = 'Belum tepat. Bandingkan dua percobaan yang hanya mengubah satu konsentrasi: laju ×2 berarti orde 1, ×4 berarti orde 2, tetap berarti orde 0.'; }
    sfx('salah'); efekSalahFlash();
  }
}

/* ---------- LKPD, reset, toast, selesai ---------- */
function labCatat(){
  labS.catatNo++;
  const item = document.createElement('div'); item.className = 'lab-log-item';
  let isi = '';
  if (labS.mode === 'tum') { const P = labS.tum, k = labKTum(P.T, P.cat); isi = '<b>Tumbukan</b> · ' + labNum(P.conc, 1) + ' M, ' + P.T + ' °C, ' + (P.cat ? 'dengan katalis' : 'tanpa katalis') + '<br>k = ' + labNum(k, 3) + ' · v₀ = ' + labNum(k * P.conc * P.conc, 4) + ' M/s'; }
  else if (labS.mode === 'luas') { const kR = labKLuas(labS.luas.shape, labS.luas.hcl); isi = '<b>Luas permukaan</b> · ' + LAB_LUAS[labS.luas.shape].nama + ' vs bongkahan, HCl ' + labNum(labS.luas.hcl, 1) + ' M<br>v₀ = ' + labNum(V_MAX * kR, 1) + ' mL/s (×' + labNum(kR / labKLuas('bongkahan', labS.luas.hcl), 0) + ')'; }
  else { const rows = labS.ordeRows[labS.orde.rx]; isi = '<b>Orde reaksi</b> · ' + LAB_ORDE[labS.orde.rx].nama + '<br>' + rows.length + ' percobaan; terakhir [A] = ' + (rows.length ? labNum(rows[rows.length - 1].A, 1) : '-') + ', [B] = ' + (rows.length ? labNum(rows[rows.length - 1].B, 1) : '-'); }
  item.innerHTML = '<b>No. ' + labS.catatNo + '</b> · ' + isi;
  const log = $L('lab-log'); log.insertBefore(item, log.firstChild);
  while (log.children.length > 10) log.removeChild(log.lastChild);
  labToast('📓 Pengamatan berhasil dicatat ke LKPD!');
}
function labReset(){
  labS.mode = 'tum';
  labS.tum = { conc:1.0, T:25, cat:false }; labS.luas = { shape:'serbuk', hcl:1.0 }; labS.orde = { rx:'r2', A:0.2, B:0.1 };
  labS.ordeRows = { r1:[], r2:[], r3:[] }; labS.tumRuns = []; labS.tumGhost = null; labS.tumLast = null; labS.luasRuns = [];
  labS.done = { tum:false, luas:false, orde:false };
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
  else if (s >= 60) kal = 'Bagus! Terus berlatih menyelidiki laju reaksi.';
  else kal = 'Ayo selesaikan semua misi untuk meraih skor penuh!';
  $L('lab-akhir-kal').textContent = kal;
  openModal('modal-lab'); sfx('win');
}

(function labInit(){
  if (!$L('scr-lab')) return;
  labRender(); labUpdateMisiCount();
})();
