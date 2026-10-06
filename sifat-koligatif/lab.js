/* ##############################################################
   #  LAB MAYA — PRAKTIKUM VIRTUAL SIFAT KOLIGATIF LARUTAN      #
   #  Kiri: air murni (kontrol). Kanan: larutan yang dibuat.    #
   #  Empat eksperimen: tekanan uap, titik didih, titik beku,   #
   #  dan osmosis. Waktu dipercepat.                            #
   ############################################################## */
const LAB_NS = 'http://www.w3.org/2000/svg';
const $L = id => document.getElementById(id);

/* ---------- Konstanta ---------- */
const P0 = 23.8;        // tekanan uap air murni pada 25 °C (mmHg)
const KB = 0.52;        // °C/m
const KF = 1.86;        // °C/m
const RGAS = 0.082;     // L atm mol⁻¹ K⁻¹
const T_OSM = 300;      // K (27 °C)
const MR_AIR = 18;
const G_AIR = 100;      // g air pada semua eksperimen
const V_LAR = 0.1;      // L larutan (osmosis)
const LAJU = 1.5;       // detik simulasi per detik nyata
const PERBESAR_UAP = 5; // pembesaran jumlah molekul uap pada gambar

const LAB_ZAT = {
  glukosa: { nama:'Glukosa', rumus:'C₆H₁₂O₆', Mr:180,  i:1, jenis:'non',  ket:'nonelektrolit' },
  urea:    { nama:'Urea',    rumus:'CO(NH₂)₂', Mr:60,   i:1, jenis:'non',  ket:'nonelektrolit' },
  nacl:    { nama:'NaCl',    rumus:'NaCl',     Mr:58.5, i:2, jenis:'elek', ket:'elektrolit', kat:'Na⁺',  an:'Cl⁻', nAn:1 },
  cacl2:   { nama:'CaCl₂',   rumus:'CaCl₂',    Mr:111,  i:3, jenis:'elek', ket:'elektrolit', kat:'Ca²⁺', an:'Cl⁻', nAn:2 },
  alcl3:   { nama:'AlCl₃',   rumus:'AlCl₃',    Mr:133.5,i:4, jenis:'elek', ket:'elektrolit', kat:'Al³⁺', an:'Cl⁻', nAn:3 }
};
const LAB_MASSA = [0, 2, 5, 10, 20];
const LAB_MODE = [
  { id:'uap',   nama:'Tekanan uap', sub:'hukum Raoult',   kerja:'Tutup dan tunggu setimbang' },
  { id:'didih', nama:'Titik didih', sub:'pemanasan',      kerja:'Panaskan' },
  { id:'beku',  nama:'Titik beku',  sub:'pendinginan',    kerja:'Dinginkan' },
  { id:'osm',   nama:'Osmosis',     sub:'membran',        kerja:'Mulai osmosis' }
];

const labS = {
  mode:'uap', zat:'glukosa', massa:10,
  ts:0, running:false, done:{ uap:false, didih:false, beku:false, osm:false },
  runs:{ non:false, elek:false },
  mikro:false, visKey:'', catatNo:0, H:null,
  misi:[false,false,false,false,false], skor:0, m4opt:null, m5opt:null
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
  // penempatan acak berjarak; jarak minimum dikurangi bertahap bila area sempit
  let g = gap, pts = [];
  for (let attempt = 0; attempt < 8; attempt++) {
    const r = labRng(seed + attempt * 101); pts = []; let t = 0;
    while (pts.length < n && t < 4000) {
      t++;
      const x = x0 + r() * (x1 - x0), y = y0 + r() * (y1 - y0);
      if (pts.every(p => (p[0] - x) ** 2 + (p[1] - y) ** 2 > g * g)) pts.push([x, y]);
    }
    if (pts.length >= n) break;
    g = Math.max(6, g - 2);
  }
  while (pts.length < n) pts.push([x0 + Math.random() * (x1 - x0), y0 + Math.random() * (y1 - y0)]);
  return pts;
}

/* ---------- Perhitungan ---------- */
function labHitung(){
  const Z = LAB_ZAT[labS.zat], g = labS.massa;
  const nz = g / Z.Mr, i = Z.i, nEff = nz * i, nAir = G_AIR / MR_AIR;
  const Xp = nAir / (nAir + nEff), Xt = 1 - Xp;
  const P = Xp * P0, dP = P0 - P;
  const m = nz / (G_AIR / 1000);
  const dTb = KB * m * i, dTf = KF * m * i;
  const M = nz / V_LAR, pi = M * RGAS * T_OSM * i;
  return { Z, g, nz, i, nEff, nAir, Xp, Xt, P, dP, m, dTb, dTf, Tb:100 + dTb, Tf:-dTf, M, pi };
}

/* Kurva pemanasan/pendinginan bersama (laju sama untuk air dan larutan) */
const T0_PANAS = (94 - 25) / 12;
function labCPanas(t){ return t <= T0_PANAS ? 25 + 12 * t : 94 + 1.2 * (t - T0_PANAS); }
function labTBoil(T){ return T0_PANAS + (T - 94) / 1.2; }
function labCDingin(t){ return t <= 3.5 ? 25 - 6 * t : 4 - 1.0 * (t - 3.5); }
function labTFreeze(T){ return 3.5 + (4 - T) / 1.0; }

function labDurasi(H){
  switch (labS.mode) {
    case 'uap':   return 3.4;
    case 'didih': return Math.max(labTBoil(100), labTBoil(H.Tb)) + 2;
    case 'beku':  return Math.max(labTFreeze(0), labTFreeze(H.Tf)) + 4.5;
    default:      return H.pi > 0 ? 6.5 : 1.2;
  }
}

/* ---------- Navigasi ---------- */
function startLabMaya(){
  showScreen('scr-lab');
  labRender();
}
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
  if (labS.mikro) labToast('🔬 Label partikel ditampilkan: molekul, ion, dan uap.');
}
function labResetRun(){ labS.ts = 0; labS.running = false; }

function labPilih(kunci, nilai){
  labS[kunci] = nilai;
  labResetRun();
  labRender();
}

/* ---------- Panel ---------- */
function labRenderPanel(){
  const gm = $L('grid-mode'); gm.innerHTML = '';
  LAB_MODE.forEach(m => {
    const b = document.createElement('button');
    b.className = 'el-chip' + (labS.mode === m.id ? ' aktif' : '');
    b.setAttribute('data-sfx', '');
    b.innerHTML = m.nama + '<small>' + m.sub + '</small>';
    b.onclick = () => labPilih('mode', m.id);
    gm.appendChild(b);
  });
  const gz = $L('grid-zat'); gz.innerHTML = '';
  Object.keys(LAB_ZAT).forEach(k => {
    const z = LAB_ZAT[k], b = document.createElement('button');
    b.className = 'el-chip' + (labS.zat === k ? ' aktif' : '');
    b.setAttribute('data-sfx', '');
    b.innerHTML = z.nama + '<small>i = ' + z.i + '</small>';
    b.onclick = () => labPilih('zat', k);
    gz.appendChild(b);
  });
  const gs = $L('grid-massa'); gs.innerHTML = '';
  LAB_MASSA.forEach(g => {
    const b = document.createElement('button');
    b.className = 'el-chip' + (labS.massa === g ? ' aktif' : '');
    b.setAttribute('data-sfx', '');
    b.textContent = g + ' g';
    b.onclick = () => labPilih('massa', g);
    gs.appendChild(b);
  });
  const mode = LAB_MODE.find(m => m.id === labS.mode);
  const rb = $L('run-btn');
  rb.disabled = labS.running;
  rb.textContent = labS.running ? '⏳ Berjalan...' : (labS.done[labS.mode] && labS.ts > 0 ? '↻ Ulangi: ' + mode.kerja : '▶ ' + mode.kerja);
}

/* ---------- Pembangunan partikel ---------- */
function labJumlahSatuan(H){ return H.g > 0 ? labKlem(Math.round(H.nz * 25), 2, 8) : 0; }

function labBangunSolut(grup, H, area, seed, labelMax){
  grup.innerHTML = '';
  const N = labJumlahSatuan(H); if (!N) return;
  const Z = H.Z, per = Z.jenis === 'non' ? 1 : 1 + Z.nAn;
  const pts = labTitik(N * per, area[0], area[1], area[2], area[3], seed, 17);
  let k = 0;
  const buat = (x, y, tipe, label, idx) => {
    const o = svEl('g', { transform: 'translate(' + x.toFixed(1) + ',' + y.toFixed(1) + ')' }, grup);
    const f = svEl('g', { class:'ion-g', style:'animation-delay:' + ((idx * .43) % 4).toFixed(2) + 's;animation-duration:' + (3.4 + (idx % 3) * .5) + 's' }, o);
    if (tipe === 'mol') svEl('circle', { r:7, fill:'#F26A21', stroke:'#fff', 'stroke-width':1.3 }, f);
    else if (tipe === 'kat') svEl('circle', { r:6, fill:'#FFA566', stroke:'#fff', 'stroke-width':1.3 }, f);
    else svEl('rect', { x:-4.5, y:-4.5, width:9, height:9, rx:2, fill:'#8EC1FF', stroke:'#fff', 'stroke-width':1.1 }, f);
    if (idx < labelMax) { const t = svEl('text', { class:'lbl', y:-10, 'text-anchor':'middle' }, f); t.textContent = label; }
  };
  for (let u = 0; u < N; u++) {
    if (Z.jenis === 'non') buat(pts[k][0], pts[k][1], 'mol', Z.rumus, u), k++;
    else {
      buat(pts[k][0], pts[k][1], 'kat', Z.kat, u), k++;
      for (let a = 0; a < Z.nAn; a++) { buat(pts[k][0], pts[k][1], 'an', Z.an, u === 0 && a === 0 ? 0 : 99), k++; }
    }
  }
}
function labBangunAir(grup, n, area, seed, label){
  grup.innerHTML = '';
  labTitik(n, area[0], area[1], area[2], area[3], seed, 13).forEach((p, i) => {
    const o = svEl('g', { transform: 'translate(' + p[0].toFixed(1) + ',' + p[1].toFixed(1) + ')' }, grup);
    const f = svEl('g', { class:'ion-g', style:'animation-delay:' + ((i * .31) % 4).toFixed(2) + 's;animation-duration:' + (3 + (i % 4) * .4) + 's' }, o);
    svEl('circle', { r:2.8, fill:'#6DB4FF', 'fill-opacity':.85, stroke:'rgba(255,255,255,.7)', 'stroke-width':.7 }, f);
    if (label && i === 0) { const t = svEl('text', { class:'lbl', y:-7, 'text-anchor':'middle' }, f); t.textContent = 'H₂O'; }
  });
}
function labBangunVessel(S, cx, H, seed){
  const x0 = cx - 90;
  labBangunAir($L('w' + S), 30, [x0 + 8, x0 + 172, 340, 410], seed, true);
  if (S === 'R') labBangunSolut($L('sR'), H, [x0 + 12, x0 + 168, 342, 408], seed + 7, 2);
  else $L('sL').innerHTML = '';
  // uap
  const vp = $L('vp' + S); vp.innerHTML = '';
  labTitik(18, x0 + 10, x0 + 170, 264, 322, seed + 3, 15).forEach((p, i) => {
    const o = svEl('g', { transform: 'translate(' + p[0].toFixed(1) + ',' + p[1].toFixed(1) + ')', 'data-i': i, class:'vapor' }, vp);
    const f = svEl('g', { class:'ion-g', style:'animation-delay:' + ((i * .37) % 4).toFixed(2) + 's;animation-duration:' + (2.6 + (i % 3) * .5) + 's' }, o);
    svEl('circle', { r:3.3, fill:'#BFE0FF', 'fill-opacity':.95 }, f);
    if (i === 0) { const t = svEl('text', { class:'lbl', y:-8, 'text-anchor':'middle' }, f); t.textContent = 'H₂O(g)'; }
  });
  // gelembung didih
  const bb = $L('bub' + S); bb.innerHTML = '';
  for (let i = 0; i < 14; i++) {
    const r = labRng(seed + i * 13);
    svEl('circle', { class:'bubB', cx: (x0 + 14 + r() * 150).toFixed(1), cy: 408, r: (3.5 + r() * 3).toFixed(1), fill:'#fff', 'fill-opacity':.55, stroke:'#fff', 'stroke-width':1.6,
      style:'--bx:' + ((r() - .5) * 18).toFixed(1) + 'px;--bd:' + (1.2 + r() * 1.1).toFixed(2) + 's;animation-delay:' + (r() * 1.4).toFixed(2) + 's' }, bb);
  }
  // kristal es
  const ic = $L('ice' + S); ic.innerHTML = '';
  labTitik(16, x0 + 10, x0 + 170, 334, 396, seed + 5, 18).forEach((p, i) => {
    svEl('rect', { class:'kristal', x:-6, y:-6, width:12, height:12, rx:2, fill:'#fff', 'fill-opacity':.9, opacity:0,
      transform:'translate(' + p[0].toFixed(1) + ',' + p[1].toFixed(1) + ') rotate(' + (i * 23 % 60) + ')' }, ic);
  });
}
function labBangunOsm(H){
  labBangunAir($L('owL'), 16, [244, 296, 350, 408], 71, false);
  const wr = $L('owR'); wr.innerHTML = '';
  labTitik(12, 448, 500, 350, 408, 72, 13).forEach((p, i) => {
    const o = svEl('g', { transform: 'translate(' + p[0].toFixed(1) + ',' + p[1].toFixed(1) + ')' }, wr);
    const f = svEl('g', { class:'ion-g', style:'animation-delay:' + ((i * .31) % 4).toFixed(2) + 's' }, o);
    svEl('circle', { r:2.8, fill:'#6DB4FF', 'fill-opacity':.85, stroke:'rgba(255,255,255,.7)', 'stroke-width':.7 }, f);
  });
  labBangunSolut($L('osR'), H, [452, 498, 352, 406], 73, 1);
}

/* ---------- Render ---------- */
function labRender(){
  const H = labHitung(); labS.H = H;
  const key = labS.mode + '|' + labS.zat + '|' + labS.massa;
  if (key !== labS.visKey) {
    labS.visKey = key;
    const svg = $L('lab-svg');
    svg.style.setProperty('--solL', 'rgba(156,201,255,.30)');
    svg.style.setProperty('--solR', H.g > 0 ? 'rgba(120,175,255,.42)' : 'rgba(156,201,255,.30)');
    labBangunVessel('L', 190, H, 11);
    labBangunVessel('R', 554, H, 29);
    labBangunOsm(H);
    const osm = labS.mode === 'osm';
    $L('scVes').style.display = osm ? 'none' : '';
    $L('scOsm').style.display = osm ? '' : 'none';
    ['L','R'].forEach(S => {
      $L('lid' + S).setAttribute('opacity', labS.mode === 'uap' ? 1 : 0);
      $L('th' + S).setAttribute('opacity', (labS.mode === 'didih' || labS.mode === 'beku') ? 1 : 0);
    });
    $L('pillTL').textContent = 'AIR MURNI' + (H.g > 0 ? '' : ' (kontrol)');
    $L('pillTR').textContent = H.g > 0 ? 'LARUTAN ' + H.Z.nama : 'AIR MURNI (kontrol)';
    $L('pillR').setAttribute('fill', H.g > 0 ? '#F26A21' : '#25508C');
    $L('subL').textContent = G_AIR + ' g air';
    $L('subR').textContent = H.g > 0 ? H.g + ' g ' + H.Z.nama + ' + ' + G_AIR + ' g air' : G_AIR + ' g air';
    $L('oPillR').textContent = H.g > 0 ? 'LARUTAN' : 'AIR MURNI';
    $L('oSub').textContent = H.g > 0 ? H.g + ' g ' + H.Z.nama + ' dalam 100 mL larutan' : 'Tambahkan zat terlarut untuk melihat osmosis';
    const judul = { uap:'TEKANAN UAP', didih:'TITIK DIDIH', beku:'TITIK BEKU' };
    $L('cmpTitle').textContent = judul[labS.mode] || '';
  }
  labRenderPanel();
  labDinamis();
  labIsiData();
  labRenderMisi();
}

/* ---------- Visual dinamis berdasar waktu simulasi ---------- */
function labMerkuri(S, T, lo, hi){
  const frac = labKlem((T - lo) / (hi - lo), 0, 1), tinggi = 4 + frac * 212;
  const hg = $L('hg' + S);
  hg.setAttribute('y', (396 - tinggi).toFixed(1)); hg.setAttribute('height', tinggi.toFixed(1));
}
function labDinamis(){
  const H = labS.H, ts = labS.ts, mode = labS.mode;
  let status = 'Siap dijalankan', cls = 'off';
  if (labS.running) { status = 'Berjalan...'; cls = 'on'; }
  else if (labS.done[mode] && ts > 0) { status = 'Selesai'; cls = 'on'; }

  if (mode === 'uap') {
    const s = labKlem(ts / 3, 0, 1);
    const vP = P0 * s, vS = H.P * s;
    [['L', vP], ['R', vS]].forEach(([S, v]) => {
      $L('needle' + S).style.transform = 'rotate(' + (-120 + 240 * labKlem(v / 30, 0, 1)).toFixed(1) + 'deg)';
      $L('gT' + S).textContent = labNum(v, 2);
    });
    const nP = Math.round(16 * s), nS = Math.round(16 * s * labKlem(1 - PERBESAR_UAP * H.dP / P0, 0, 1));
    [['L', nP], ['R', nS]].forEach(([S, n]) => {
      $L('vp' + S).querySelectorAll('.vapor').forEach((e, i) => { e.style.display = i < n ? '' : 'none'; });
    });
    labKartu(vP, vS, 3, 'ΔP = ' + labNum(H.dP, 2) + ' mmHg', s >= 1, 2, 'mmHg');
    if (s >= 1) status = 'Selesai · ΔP = ' + labNum(H.dP, 2) + ' mmHg';
  }

  if (mode === 'didih') {
    const C = labCPanas(ts), Tp = Math.min(C, 100), Ts = Math.min(C, H.Tb);
    const bP = C >= 100, bS = C >= H.Tb && ts > 0;
    [['L', Tp, bP], ['R', Ts, bS]].forEach(([S, T, b]) => {
      labMerkuri(S, T, 20, 110);
      $L('tT' + S).textContent = labNum(T, 1) + ' °C';
      $L('v' + S).classList.toggle('boilon', b && ts > 0);
      $L('vp' + S).style.display = (b && ts > 0) ? '' : 'none';
      $L('heat' + S).setAttribute('opacity', labS.running ? 1 : 0);
    });
    labKartu(Tp, Ts, 4, 'ΔTb = ' + labNum(H.dTb, 2) + ' °C', C >= H.Tb && ts > 0, 1, '°C');
    if (!labS.running && labS.done.didih && ts > 0) status = 'Selesai · ΔTb = ' + labNum(H.dTb, 2) + ' °C';
  } else {
    ['L','R'].forEach(S => { $L('v' + S).classList.remove('boilon'); $L('heat' + S).setAttribute('opacity', 0); $L('vp' + S).style.display = (mode === 'uap') ? '' : 'none'; });
  }

  if (mode === 'beku') {
    const C = labCDingin(ts), Tp = Math.max(C, 0), Ts = Math.max(C, H.Tf);
    const pP = labKlem((ts - labTFreeze(0)) / 4, 0, 1), pS = H.g > 0 ? labKlem((ts - labTFreeze(H.Tf)) / 4, 0, 1) : pP;
    [['L', Tp, pP], ['R', Ts, pS]].forEach(([S, T, p]) => {
      labMerkuri(S, T, -20, 30);
      $L('tT' + S).textContent = labNum(T, 1) + ' °C';
      $L('iceOv' + S).setAttribute('opacity', (.55 * p).toFixed(2));
      $L('ice' + S).querySelectorAll('.kristal').forEach(k => k.setAttribute('opacity', p.toFixed(2)));
    });
    labKartu(Tp, Ts, 13, 'ΔTf = ' + labNum(H.dTf, 2) + ' °C', pS >= 1 && ts > 0, 1, '°C');
    if (!labS.running && labS.done.beku && ts > 0) status = 'Selesai · ΔTf = ' + labNum(H.dTf, 2) + ' °C';
  } else {
    ['L','R'].forEach(S => { $L('iceOv' + S).setAttribute('opacity', 0); $L('ice' + S).querySelectorAll('.kristal').forEach(k => k.setAttribute('opacity', 0)); });
  }

  if (mode === 'osm') {
    const s = labKlem(ts / 6, 0, 1), pi = H.pi * s;
    $L('needleO').style.transform = 'rotate(' + (-120 + 240 * labKlem(pi / 150, 0, 1)).toFixed(1) + 'deg)';
    $L('gTO').textContent = labNum(pi, 1);
    const Dmax = H.pi > 0 ? Math.min(100, 14 * Math.sqrt(H.pi)) : 0, D = Dmax * s;
    const yL = 300 + D / 2, yR = 300 - D / 2;
    $L('oLa').setAttribute('y', yL.toFixed(1)); $L('oLa').setAttribute('height', (412 - yL).toFixed(1));
    $L('oRa').setAttribute('y', yR.toFixed(1)); $L('oRa').setAttribute('height', (412 - yR).toFixed(1));
    $L('oLnL').setAttribute('y1', yL.toFixed(1)); $L('oLnL').setAttribute('y2', yL.toFixed(1));
    $L('oLnR').setAttribute('y1', yR.toFixed(1)); $L('oLnR').setAttribute('y2', yR.toFixed(1));
    $L('oBr').setAttribute('opacity', D > 4 ? 1 : 0);
    $L('oBrL').setAttribute('y1', yR.toFixed(1)); $L('oBrL').setAttribute('y2', yL.toFixed(1));
    $L('oBrT').setAttribute('y', ((yL + yR) / 2 + 4).toFixed(1));
    $L('flow').setAttribute('opacity', (labS.running && H.pi > 0) ? 1 : 0);
    if (!labS.running && labS.done.osm && ts > 0) status = H.pi > 0 ? 'Selesai · π = ' + labNum(H.pi, 1) + ' atm' : 'Selesai · tidak ada aliran';
    if (labS.done.osm && ts > 0 && H.pi > 0) $L('oSub').textContent = 'Air mengalir ke larutan · π = ' + labNum(H.pi, 1) + ' atm (tinggi kolom tidak berskala)';
  }

  const st = $L('lab-status');
  st.textContent = status; st.className = 'lab-status ' + cls;
}

/* Kartu perbandingan di tengah: batang disetel supaya selisih tampak */
function labKartu(a, b, ref, deltaTeks, selesai, desimal, satuan){
  const diff = b - a;
  const geser = Math.abs(diff) > 0.005 ? Math.sign(diff) * Math.max(4, Math.abs(diff) / ref * 60) : 0;
  $L('cmpAv').textContent = labNum(a, desimal === 2 ? 2 : 1) + ' ' + satuan;
  $L('cmpBv').textContent = labNum(b, desimal === 2 ? 2 : 1) + ' ' + satuan;
  $L('cmpAb').setAttribute('width', 70);
  $L('cmpBb').setAttribute('width', labKlem(70 + geser, 10, 118).toFixed(1));
  $L('cmpD').textContent = selesai ? deltaTeks : '...';
}

/* ---------- Eksekusi eksperimen ---------- */
function labJalankan(){
  if (labS.running) return;
  const H = labS.H;
  if (labS.mode === 'osm' && H.g === 0) { labToast('💧 Tambahkan zat terlarut agar osmosis terjadi.'); return; }
  labS.ts = 0; labS.running = true;
  labRenderPanel(); labDinamis();
  sfx('click');
}
function labSelesaiRun(){
  const H = labS.H, mode = labS.mode;
  labS.done[mode] = true;
  if (H.g > 0) { if (H.Z.jenis === 'non') labS.runs.non = true; else labS.runs.elek = true; }
  labRenderPanel();
  labIsiData();
  if (mode === 'uap'   && H.g > 0 && !labS.misi[0]) { labS.misi[0] = true; labSkor(20, '🎉 Misi 1 selesai! Tekanan uap larutan lebih rendah daripada air murni.'); }
  if (mode === 'didih' && H.dTb >= 1 && !labS.misi[1]) { labS.misi[1] = true; labSkor(20, '🎉 Misi 2 selesai! ΔTb = ' + labNum(H.dTb, 2) + ' °C (≥ 1,0 °C).'); }
  if (mode === 'beku'  && H.dTf >= 3 && !labS.misi[2]) { labS.misi[2] = true; labSkor(20, '🎉 Misi 3 selesai! ΔTf = ' + labNum(H.dTf, 2) + ' °C (≥ 3,0 °C).'); }
  labRenderMisi();
}
setInterval(() => {
  if (!labS.running) return;
  const dur = labDurasi(labS.H);
  labS.ts += 0.1 * LAJU;
  if (labS.ts >= dur) { labS.ts = dur; labS.running = false; labDinamis(); labSelesaiRun(); return; }
  labDinamis();
}, 100);

/* ---------- Tab Data ---------- */
function labIsiData(){
  const H = labS.H, Z = H.Z;
  const dz = $L('d-zat');
  if (H.g === 0) {
    dz.innerHTML = '<div class="lab-note">Belum ada zat terlarut: kedua wadah berisi air murni (kontrol). Pilih massa lebih dari 0 g.</div>';
  } else {
    dz.innerHTML = '<div class="hasil-baris"><b>' + Z.nama + ' (' + Z.rumus + ')</b>, ' + H.g + ' g, Mr = ' + Z.Mr + ' (' + Z.ket + ')<br>' +
      'n = ' + H.g + ' ÷ ' + Z.Mr + ' = ' + labNum(H.nz, 4) + ' mol<br>' +
      'i = ' + Z.i + '  →  n × i = <b>' + labNum(H.nEff, 4) + ' mol partikel</b><br>' +
      'm = n ÷ 0,1 kg = <b>' + labNum(H.m, 3) + ' molal</b></div>';
  }
  const hs = $L('d-hasil'), jt = $L('d-hasil-t');
  let t = '', s = '';
  if (labS.mode === 'uap') {
    jt.textContent = '📈 Penurunan tekanan uap';
    s = 'n air = 100 ÷ 18 = ' + labNum(H.nAir, 3) + ' mol<br>X pelarut = ' + labNum(H.nAir, 3) + ' ÷ (' + labNum(H.nAir, 3) + ' + ' + labNum(H.nEff, 4) + ') = ' + labNum(H.Xp, 4) +
        '<br>P = X × P° = ' + labNum(H.Xp, 4) + ' × 23,8 = <b>' + labNum(H.P, 2) + ' mmHg</b><br>ΔP = 23,8 − ' + labNum(H.P, 2) + ' = <b>' + labNum(H.dP, 2) + ' mmHg</b>';
  } else if (labS.mode === 'didih') {
    jt.textContent = '🔥 Kenaikan titik didih';
    s = 'ΔTb = Kb × m × i<br>= 0,52 × ' + labNum(H.m, 3) + ' × ' + H.i + ' = <b>' + labNum(H.dTb, 2) + ' °C</b><br>Tb = 100 + ' + labNum(H.dTb, 2) + ' = <b>' + labNum(H.Tb, 2) + ' °C</b>';
  } else if (labS.mode === 'beku') {
    jt.textContent = '❄️ Penurunan titik beku';
    s = 'ΔTf = Kf × m × i<br>= 1,86 × ' + labNum(H.m, 3) + ' × ' + H.i + ' = <b>' + labNum(H.dTf, 2) + ' °C</b><br>Tf = 0 − ' + labNum(H.dTf, 2) + ' = <b>' + labNum(H.Tf, 2) + ' °C</b>';
  } else {
    jt.textContent = '💧 Tekanan osmotik';
    s = 'M = n ÷ 0,1 L = ' + labNum(H.M, 3) + ' mol/L<br>T = 27 + 273 = 300 K<br>π = M × R × T × i<br>= ' + labNum(H.M, 3) + ' × 0,082 × 300 × ' + H.i + ' = <b>' + labNum(H.pi, 1) + ' atm</b>';
  }
  hs.innerHTML = '<div class="hasil-baris">' + s + '</div>';
  $L('d-const').innerHTML = 'P° air (25 °C) = 23,8 mmHg · Kb = 0,52 °C/m · Kf = 1,86 °C/m · R = 0,082 L atm mol⁻¹ K⁻¹. Waktu dipercepat. Jumlah molekul uap pada gambar diperbesar ' + PERBESAR_UAP + '× agar selisihnya terlihat; tinggi kolom osmosis tidak berskala.';
  const am = [];
  if (H.g === 0) am.push('Tanpa zat terlarut, kedua wadah menunjukkan nilai yang sama.');
  else if (labS.mode === 'uap') { am.push('Larutan: tekanan uap ' + labNum(H.P, 2) + ' mmHg, lebih rendah ' + labNum(H.dP, 2) + ' mmHg daripada air murni.'); am.push('Partikel zat terlarut menempati permukaan sehingga lebih sedikit molekul air yang menguap.'); }
  else if (labS.mode === 'didih') { am.push('Air murni mendidih lebih dulu pada 100 °C; larutan baru mendidih pada ' + labNum(H.Tb, 2) + ' °C.'); }
  else if (labS.mode === 'beku') { am.push('Air murni mulai membeku pada 0 °C; larutan baru membeku pada ' + labNum(H.Tf, 2) + ' °C.'); }
  else am.push('Air murni mengalir melalui membran ke larutan; permukaan larutan naik sampai terbentuk tekanan balik π = ' + labNum(H.pi, 1) + ' atm.');
  if (H.g > 0 && Z.jenis === 'elek') am.push('Karena ' + Z.nama + ' terion menjadi ' + Z.i + ' partikel, efeknya ' + Z.i + '× lebih besar daripada nonelektrolit semolal.');
  $L('d-amati').innerHTML = am.map(x => '• ' + x).join('<br>');
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
function labAcak(arr){ for (let i = arr.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [arr[i], arr[j]] = [arr[j], arr[i]]; } return arr; }

function labRenderMisi(){
  ['st-m1','st-m2','st-m3','st-m4','st-m5'].forEach((id, i) => {
    const el = $L(id);
    if (el) el.textContent = labS.misi[i] ? '✅ Selesai (+20)' : '⬜ Belum selesai';
    const card = $L('misi-' + (i + 1));
    if (card) card.classList.toggle('done', labS.misi[i]);
  });

  const q4 = $L('m4-quiz');
  if (q4) {
    if (labS.misi[3]) q4.innerHTML = '<div class="misi-hint ok">✅ NaCl memberi 2 partikel (i = 2), sehingga efeknya 2× glukosa semolal.</div>';
    else if (labS.runs.non && labS.runs.elek) {
      if (!q4.querySelector('.m-nota')) {
        labS.m4opt = labAcak([
          { t:'NaCl, karena menghasilkan 2 partikel per satuan rumus (i = 2)', b:true },
          { t:'Glukosa, karena molekulnya lebih besar', b:false },
          { t:'Sama, karena molalitasnya sama', b:false },
          { t:'Glukosa, karena tidak terionisasi', b:false }
        ]);
        q4.innerHTML = '<div class="m4-tanya">Pada molalitas yang sama, larutan mana yang titik bekunya lebih rendah, dan mengapa?</div>' +
          labS.m4opt.map((o, i) => '<button class="m-nota" style="font-family:inherit" data-sfx onclick="labJawabM4(' + i + ')">' + o.t + '</button>').join('') + '<div class="feedback" id="m4-fb"></div>';
      }
    } else q4.innerHTML = '<div class="misi-hint">🔒 Selesaikan satu eksperimen dengan nonelektrolit dan satu dengan elektrolit (massa &gt; 0).</div>';
  }

  const q5 = $L('m5-quiz');
  if (q5) {
    if (labS.misi[4]) q5.innerHTML = '<div class="misi-hint ok">✅ Pelarut mengalir dari larutan encer (air murni) ke larutan pekat.</div>';
    else if (labS.done.osm && labS.H && labS.H.g > 0) {
      if (!q5.querySelector('.m-nota')) {
        labS.m5opt = labAcak([
          { t:'Dari air murni ke larutan', b:true },
          { t:'Dari larutan ke air murni', b:false },
          { t:'Tidak ada aliran', b:false },
          { t:'Bergantung pada jenis zat saja', b:false }
        ]);
        q5.innerHTML = '<div class="m4-tanya">Ke mana air mengalir pada percobaan osmosis tadi?</div>' +
          labS.m5opt.map((o, i) => '<button class="m-nota" style="font-family:inherit" data-sfx onclick="labJawabM5(' + i + ')">' + o.t + '</button>').join('') + '<div class="feedback" id="m5-fb"></div>';
      }
    } else q5.innerHTML = '<div class="misi-hint">🔒 Selesaikan eksperimen Osmosis dengan zat terlarut (massa &gt; 0).</div>';
  }
}
function labJawabM4(i){
  if (labS.misi[3] || !labS.m4opt) return;
  const o = labS.m4opt[i], btns = document.querySelectorAll('#m4-quiz .m-nota'), fb = $L('m4-fb');
  if (o.b) {
    btns[i].classList.add('benar');
    if (fb) { fb.className = 'feedback show ok'; fb.textContent = 'Tepat! NaCl terion menjadi Na⁺ dan Cl⁻, jadi partikelnya dua kali lebih banyak.'; }
    labS.misi[3] = true; labSkor(20, '🎉 Misi 4 selesai! Kamu memahami faktor van\'t Hoff.');
  } else {
    btns[i].classList.add('salah'); btns[i].disabled = true;
    if (fb) { fb.className = 'feedback show no'; fb.textContent = 'Belum tepat. Yang menentukan adalah jumlah partikel, bukan ukuran molekul.'; }
    sfx('salah'); efekSalahFlash();
  }
}
function labJawabM5(i){
  if (labS.misi[4] || !labS.m5opt) return;
  const o = labS.m5opt[i], btns = document.querySelectorAll('#m5-quiz .m-nota'), fb = $L('m5-fb');
  if (o.b) {
    btns[i].classList.add('benar');
    if (fb) { fb.className = 'feedback show ok'; fb.textContent = 'Benar! Pelarut mengalir dari larutan yang lebih encer ke yang lebih pekat.'; }
    labS.misi[4] = true; labSkor(20, '🎉 Misi 5 selesai! Kamu memahami arah osmosis.');
  } else {
    btns[i].classList.add('salah'); btns[i].disabled = true;
    if (fb) { fb.className = 'feedback show no'; fb.textContent = 'Belum tepat. Perhatikan permukaan mana yang naik pada gambar.'; }
    sfx('salah'); efekSalahFlash();
  }
}

/* ---------- LKPD, reset, toast, selesai ---------- */
function labCatat(){
  labS.catatNo++;
  const H = labS.H, mode = LAB_MODE.find(m => m.id === labS.mode);
  const item = document.createElement('div');
  item.className = 'lab-log-item';
  let hasil = '';
  if (H.g === 0) hasil = 'kontrol: air murni';
  else if (labS.mode === 'uap') hasil = 'P = ' + labNum(H.P, 2) + ' mmHg, ΔP = ' + labNum(H.dP, 2);
  else if (labS.mode === 'didih') hasil = 'Tb = ' + labNum(H.Tb, 2) + ' °C, ΔTb = ' + labNum(H.dTb, 2);
  else if (labS.mode === 'beku') hasil = 'Tf = ' + labNum(H.Tf, 2) + ' °C, ΔTf = ' + labNum(H.dTf, 2);
  else hasil = 'π = ' + labNum(H.pi, 1) + ' atm';
  item.innerHTML = '<b>No. ' + labS.catatNo + '</b> · ' + mode.nama + '<br>' + (H.g > 0 ? H.Z.nama + ' ' + H.g + ' g (i = ' + H.i + ')' : 'tanpa zat terlarut') +
    ' dalam 100 g air · m = ' + labNum(H.m, 3) + '<br>' + hasil;
  const log = $L('lab-log');
  log.insertBefore(item, log.firstChild);
  while (log.children.length > 10) log.removeChild(log.lastChild);
  labToast('📓 Pengamatan berhasil dicatat ke LKPD!');
}
function labReset(){
  Object.assign(labS, { mode:'uap', zat:'glukosa', massa:10 });
  labResetRun();
  labS.done = { uap:false, didih:false, beku:false, osm:false };
  labRender();
  labToast('🔄 Praktikum dikembalikan ke kondisi awal.');
}
let labToastT = null;
function labToast(msg){
  const t = $L('lab-toast');
  if (!t) { showToast(msg); return; }
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(labToastT);
  labToastT = setTimeout(() => t.classList.remove('show'), 2800);
}
function labSelesai(){
  if (!labS.misi.every(x => x)) { labToast('Selesaikan kelima misi dulu ya! 💪'); return; }
  $L('lab-akhir-skor').textContent = labS.skor;
  const s = labS.skor;
  let kal;
  if (s >= 100) kal = 'Luar biasa! Kamu layak menyandang gelar Kimiawan Muda. ⚗️';
  else if (s >= 80) kal = 'Sangat baik! Sedikit lagi menuju sempurna.';
  else if (s >= 60) kal = 'Bagus! Terus berlatih membandingkan larutan.';
  else kal = 'Ayo selesaikan semua misi untuk meraih skor penuh!';
  $L('lab-akhir-kal').textContent = kal;
  openModal('modal-lab');
  sfx('win');
}

(function labInit(){
  if (!$L('scr-lab')) return;
  labRender();
  labUpdateMisiCount();
})();
