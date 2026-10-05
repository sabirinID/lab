/* ##############################################################
   #  LAB MAYA — PRAKTIKUM VIRTUAL SEL VOLTA                    #
   #  Susunan tetap: Anode (−) di KIRI, Katode (+) di KANAN.    #
   #  Susunan ini sama dengan notasi sel dan materi Belajar.    #
   ############################################################## */
const LAB_NS = 'http://www.w3.org/2000/svg';
const LAB_XL = 'http://www.w3.org/1999/xlink';
const $L = id => document.getElementById(id);

/* Data logam. g = gradasi plat [gelap, terang, gelap]; sol = warna larutan;
   ionc = warna ion; dep = warna endapan; an = anion pasangan; sw = warna chip. */
const LAB_LOGAM = {
  Mg: { nama:'Magnesium', simbol:'Mg', ion:'Mg²⁺', n:2, Eo:-2.37, g:['#7E8C88','#E3EAE7','#7E8C88'], sol:'rgba(150,230,185,.30)', ionc:'#8FE8B8', dep:'#C9D3CF', an:'SO₄²⁻', sw:'#C5CFCB' },
  Zn: { nama:'Seng',      simbol:'Zn', ion:'Zn²⁺', n:2, Eo:-0.76, g:['#6F7E88','#D3DEE6','#6F7E88'], sol:'rgba(156,201,255,.26)', ionc:'#A9D0FF', dep:'#BCC8D0', an:'SO₄²⁻', sw:'#A9B8C4' },
  Fe: { nama:'Besi',      simbol:'Fe', ion:'Fe²⁺', n:2, Eo:-0.44, g:['#323D45','#8C97A0','#323D45'], sol:'rgba(150,215,140,.32)', ionc:'#A6E59A', dep:'#7B868F', an:'SO₄²⁻', sw:'#59656D' },
  Cu: { nama:'Tembaga',   simbol:'Cu', ion:'Cu²⁺', n:2, Eo: 0.34, g:['#9A4F22','#F0AA72','#9A4F22'], sol:'rgba(70,150,255,.46)',  ionc:'#6FB2FF', dep:'#D9824A', an:'SO₄²⁻', sw:'#D2824A' },
  Ag: { nama:'Perak',     simbol:'Ag', ion:'Ag⁺',  n:1, Eo: 0.80, g:['#8A909A','#F4F6FA','#8A909A'], sol:'rgba(225,235,250,.22)', ionc:'#EEF3FB', dep:'#E8ECF2', an:'NO₃⁻',  sw:'#E6EAF0' }
};

const labS = {
  kiri:'Zn',      // Anode
  kanan:'Cu',     // Katode
  bridge:false, saklar:false,
  aktif:false, spontan:false, E:0, AN:null, KA:null,
  waktu:0, catatNo:0, pernahAktif:false, hintMakro:false,
  massa:0,        // 0..1 : kemajuan perubahan massa elektrode
  mikro:false,
  eKey:'', visKey:'',
  misi:[false,false,false,false,false], skor:0, m5key:'', m5opt:null
};

/* ---------- Utilitas ---------- */
function svEl(tag, attrs, parent){
  const e = document.createElementNS(LAB_NS, tag);
  for (const k in attrs) e.setAttribute(k, attrs[k]);
  if (parent) parent.appendChild(e);
  return e;
}
function labFmt(v, tanda){
  const s = Math.abs(v).toFixed(2).replace('.', ',');
  return tanda ? ((v < 0) ? '−' : '+') + s : s;
}
function labElektronTeks(n){ return n === 1 ? 'e⁻' : n + 'e⁻'; }
function labKpk(a, b){ let x = a, y = b; while (y) { [x, y] = [y, x % y]; } return a * b / x; }
function labReaksiTotal(A, K){
  const L = labKpk(A.n, K.n), cA = L / A.n, cK = L / K.n, c = k => k === 1 ? '' : k;
  return c(cA) + A.simbol + '(s) + ' + c(cK) + K.ion + '(aq) → ' + c(cA) + A.ion + '(aq) + ' + c(cK) + K.simbol + '(s)';
}

/* ---------- Navigasi ---------- */
function startLabMaya(){
  showScreen('scr-lab');
  labRenderChips();
  labUpdate();
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
  if (labS.mikro) labToast('🔬 Label partikel ditampilkan: ion, anion, dan elektron.');
}

/* ---------- Pemilihan logam ---------- */
function labRenderChips(){
  ['kiri','kanan'].forEach(sisi => {
    const wadah = $L('grid-' + sisi);
    wadah.innerHTML = '';
    Object.keys(LAB_LOGAM).forEach(k => {
      const m = LAB_LOGAM[k];
      const b = document.createElement('button');
      b.className = 'logam-chip' + ((labS[sisi] === k) ? ' aktif' : '');
      b.setAttribute('data-sfx', '');
      b.setAttribute('aria-label', m.nama + ', E° ' + labFmt(m.Eo, true) + ' V');
      b.innerHTML = '<span class="sw" style="background:' + m.sw + '"></span><span class="lc-sym">' + m.simbol + '</span><span class="lc-e">' + labFmt(m.Eo, true) + ' V</span>';
      b.onclick = () => { labS[sisi] = k; labS.massa = 0; labS.m5key = ''; labRenderChips(); labUpdate(); };
      wadah.appendChild(b);
    });
  });
}
function labTukar(){
  const t = labS.kiri; labS.kiri = labS.kanan; labS.kanan = t;
  labS.massa = 0; labS.m5key = '';
  labRenderChips(); labUpdate();
  labToast('⇄ Posisi Anode dan Katode ditukar.');
}
function toggleBridge(){
  labS.bridge = !labS.bridge;
  labUpdate();
  if (!labS.bridge && labS.pernahAktif) labToast('🌉 Jembatan lepas: muatan menumpuk, ion berhenti bermigrasi, arus berhenti.');
}
function toggleSaklar(){ labS.saklar = !labS.saklar; labUpdate(); }

/* ---------- Pembangunan elemen SVG dinamis ---------- */
const LAB_POS_KAT = [[80,322],[104,376],[162,302],[192,354],[217,394],[252,320],[88,398],[246,372]];
const LAB_POS_AN  = [[72,350],[98,312],[176,332],[206,308],[234,374],[264,346],[152,400]];
const LAB_GEN = [[-15,322,-46,-8],[15,342,44,-12],[-15,362,-52,10],[15,380,38,6],[-15,336,-38,-12],[15,318,54,8]];

function labBuildSolusi(){
  ['L','R'].forEach(sd => {
    const A = LAB_LOGAM[sd === 'L' ? labS.kiri : labS.kanan];
    const mirror = (sd === 'R');
    const grp = $L('ions' + sd); grp.innerHTML = '';

    LAB_POS_KAT.forEach((p, i) => {
      const o = svEl('g', { transform: 'translate(' + (mirror ? 744 - p[0] : p[0]) + ',' + p[1] + ')' }, grp);
      const f = svEl('g', { class:'ion-g', style:'animation-delay:' + ((i * .55) % 4).toFixed(2) + 's;animation-duration:' + (3.6 + (i % 3) * .5) + 's' }, o);
      svEl('circle', { r:5.2, style:'fill:var(--ionc)', stroke:'rgba(255,255,255,.75)', 'stroke-width':1 }, f);
      if (i < 2) { const t = svEl('text', { class:'lbl', y:-9, 'text-anchor':'middle' }, f); t.textContent = A.ion; }
    });
    LAB_POS_AN.forEach((p, i) => {
      const o = svEl('g', { transform: 'translate(' + (mirror ? 744 - p[0] : p[0]) + ',' + p[1] + ')' }, grp);
      const f = svEl('g', { class:'ion-g', style:'animation-delay:' + ((i * .7 + .3) % 4).toFixed(2) + 's;animation-duration:' + (4 + (i % 3) * .4) + 's' }, o);
      svEl('rect', { x:-4, y:-4, width:8, height:8, rx:2, fill:'#CFE0FF', opacity:.85 }, f);
      if (i < 1) { const t = svEl('text', { class:'lbl', y:-8, 'text-anchor':'middle' }, f); t.textContent = A.an; }
    });

    // partikel proses di permukaan elektrode
    const gen = $L('gen' + sd); gen.innerHTML = '';
    const cx = mirror ? 614 : 130;
    LAB_GEN.forEach((q, i) => {
      const o = svEl('g', { transform: 'translate(' + (cx + q[0]) + ',' + q[1] + ')' }, gen);
      svEl('circle', {
        class: 'gen ' + (mirror ? 'gen-in' : 'gen-out'), r: 4.6, style: 'fill:var(--ionc);--dx:' + q[2] + 'px;--dy:' + q[3] + 'px;animation-delay:' + (i * .5) + 's',
        stroke: 'rgba(255,255,255,.8)', 'stroke-width': 1
      }, o);
    });
  });
}

function labMotion(parent, pathId, dur, begin, repeat){
  const am = svEl('animateMotion', { dur: dur + 's', begin: begin + 's', repeatCount: repeat || 'indefinite', calcMode: 'linear' }, parent);
  const mp = svEl('mpath', {}, am);
  mp.setAttribute('href', pathId);
  mp.setAttributeNS(LAB_XL, 'href', pathId);
  return am;
}
function labBuildJembatan(){
  const g = $L('bridgeIons'); g.innerHTML = '';
  const N = 4, dur = 6;
  const buat = (tipe, i) => {
    const kat = (tipe === 'kat');
    const o = svEl('g', {}, g);
    svEl('circle', { r:5, fill: kat ? '#F26A21' : '#5E9BFF', stroke:'#fff', 'stroke-width':1.2 }, o);
    if (i % 2 === 0) { const t = svEl('text', { class:'lbl', y:-9, 'text-anchor':'middle' }, o); t.textContent = kat ? 'K⁺' : 'NO₃⁻'; }
    const begin = -(i * dur / N) - (kat ? 0 : dur / (2 * N));
    labMotion(o, kat ? '#brPathLR' : '#brPathRL', dur, begin);
    svEl('animate', { attributeName:'opacity', values:'0;1;1;0', keyTimes:'0;.12;.88;1', dur: dur + 's', begin: begin + 's', repeatCount:'indefinite' }, o);
  };
  for (let i = 0; i < N; i++) { buat('kat', i); buat('an', i); }
}
function labElektron(){
  const g = $L('lab-elektron');
  g.innerHTML = '';
  if (!labS.aktif) return;
  const n = 10, dur = Math.max(1.8, 3.8 - labS.E * 0.45);
  for (let i = 0; i < n; i++) {
    const o = svEl('g', {}, g);
    svEl('circle', { r:6.5, fill:'#FFC21A', stroke:'#F26A21', 'stroke-width':1.6 }, o);
    if (i % 3 === 0) { const t = svEl('text', { class:'lbl', y:-10, 'text-anchor':'middle' }, o); t.textContent = 'e⁻'; }
    labMotion(o, '#ePath', dur, -(i * dur / n));
  }
}

/* ---------- Tampilan elektrode (massa berubah seiring waktu) ---------- */
function labPlates(){
  const p = labS.massa, K = labS.KA;
  // Anode (kiri): menipis dan memendek karena Zn(s) → Zn²⁺ larut
  const wA = 26 * (1 - 0.4 * p), botA = 396 - 54 * p;
  const pl = $L('plateL'); pl.setAttribute('x', 130 - wA / 2); pl.setAttribute('width', wA); pl.setAttribute('height', botA - 158);
  const wl = $L('wetL');   wl.setAttribute('x', 130 - wA / 2); wl.setAttribute('width', wA); wl.setAttribute('height', Math.max(0, botA - 290));
  // Katode (kanan): endapan logam menebal di permukaan
  const d = 9 * p, dep = $L('depR');
  dep.setAttribute('x', 614 - 13 - d); dep.setAttribute('width', 26 + 2 * d);
  dep.setAttribute('fill', K.dep);
  dep.setAttribute('opacity', Math.min(1, p * 8).toFixed(2));
}

/* ---------- Pembaruan utama ---------- */
function labUpdate(){
  const A = LAB_LOGAM[labS.kiri];    // Anode  : kiri,  kutub (−)
  const K = LAB_LOGAM[labS.kanan];   // Katode : kanan, kutub (+)
  labS.AN = A; labS.KA = K;

  // E°sel = E°Katode − E°Anode
  labS.E = Math.round((K.Eo - A.Eo) * 100) / 100;
  labS.spontan = labS.E > 0;
  labS.aktif = !!(labS.spontan && labS.bridge && labS.saklar);
  if (labS.aktif) labS.pernahAktif = true;
  const sirkuit = labS.bridge && labS.saklar;

  const svg = $L('lab-svg');
  svg.classList.toggle('aktif', labS.aktif);

  // --- larutan, ion, dan elektrode
  const visKey = labS.kiri + '|' + labS.kanan;
  if (visKey !== labS.visKey) {
    labS.visKey = visKey;
    $L('bkL').style.setProperty('--sol', A.sol);  $L('bkL').style.setProperty('--ionc', A.ionc);
    $L('bkR').style.setProperty('--sol', K.sol);  $L('bkR').style.setProperty('--ionc', K.ionc);
    const gAn = $L('gAn').querySelectorAll('stop'), gKa = $L('gKa').querySelectorAll('stop');
    A.g.forEach((c, i) => gAn[i].setAttribute('stop-color', c));
    K.g.forEach((c, i) => gKa[i].setAttribute('stop-color', c));
    $L('symL').textContent = A.simbol; $L('symR').textContent = K.simbol;
    $L('solLblL').textContent = A.ion + '(aq)'; $L('solLblR').textContent = K.ion + '(aq)';
    $L('rxL').textContent = A.simbol + ' → ' + A.ion + ' + ' + labElektronTeks(A.n);
    $L('rxR').textContent = K.ion + ' + ' + labElektronTeks(K.n) + ' → ' + K.simbol;
    labBuildSolusi();
  }
  labPlates();
  $L('massLblL').setAttribute('opacity', labS.aktif ? 1 : 0);
  $L('massLblR').setAttribute('opacity', labS.aktif ? 1 : 0);

  // --- voltmeter: jarum + angka
  const vm = $L('vm-reading'), needle = $L('vm-needle');
  const nilai = sirkuit ? labS.E : 0;
  vm.textContent = (nilai === 0 ? '0,00' : labFmt(nilai, true)) + ' V';
  vm.setAttribute('fill', labS.aktif ? '#4ADE80' : (sirkuit && labS.E < 0 ? '#FF8A8A' : '#5C6F8F'));
  const sudut = labS.aktif ? -55 + Math.min(1, labS.E / 3.5) * 110 : (sirkuit && labS.E < 0 ? -58 : -55);
  needle.style.transform = 'rotate(' + sudut + 'deg)';

  // --- lampu
  const bright = Math.min(1, 0.4 + labS.E / 2.4);
  $L('lampBulb').setAttribute('fill', labS.aktif ? '#FFE9A8' : '#12294D');
  $L('lampBulb').setAttribute('stroke', labS.aktif ? '#FFC21A' : '#7F96BD');
  $L('lampFil').setAttribute('stroke', labS.aktif ? '#F26A21' : '#7F96BD');
  $L('lampGlow').setAttribute('r', (52 + Math.max(0, labS.E) * 8).toFixed(0));
  $L('lampGlow').style.opacity = labS.aktif ? bright.toFixed(2) : 0;
  $L('lampRays').style.opacity = labS.aktif ? bright.toFixed(2) : 0;

  // --- saklar
  const lever = $L('lab-switch-lever');
  lever.classList.toggle('tutup', labS.saklar);
  lever.setAttribute('stroke', labS.saklar ? '#FFC21A' : '#D7E1F5');

  // --- jembatan garam
  $L('lab-bridge').classList.toggle('lepas', !labS.bridge);
  $L('bridgeGhost').classList.toggle('show', !labS.bridge);
  $L('bridgeIons').setAttribute('opacity', labS.aktif ? 1 : 0);
  $L('brTagKiri').setAttribute('opacity', labS.aktif ? 1 : 0);
  $L('brTagKanan').setAttribute('opacity', labS.aktif ? 1 : 0);

  // --- aliran elektron
  const eKey = labS.aktif ? ('on|' + labS.E) : 'off';
  if (eKey !== labS.eKey) { labS.eKey = eKey; labElektron(); }
  $L('capG').setAttribute('opacity', labS.aktif ? 1 : 0);
  $L('capTxt').textContent = 'e⁻ mengalir: ' + A.simbol + ' → ' + K.simbol;

  // --- status
  const st = $L('lab-status');
  let txt, cls = 'off';
  if (labS.aktif)                 { txt = 'Sel aktif · arus mengalir ⚡'; cls = 'on'; }
  else if (labS.E < 0)            { txt = 'E°sel negatif · reaksi tidak spontan'; }
  else if (labS.E === 0)          { txt = 'E°sel = 0 · tidak ada reaksi bersih'; }
  else if (!labS.bridge)          { txt = 'E°sel positif · pasang jembatan garam'; }
  else                            { txt = 'E°sel positif · tutup saklar'; }
  st.textContent = txt; st.className = 'lab-status ' + cls;

  const tgB = $L('tg-bridge'), tgS = $L('tg-saklar');
  tgB.className = 'lab-toggle ' + (labS.bridge ? 'on' : 'off');
  tgB.textContent = '🌉 Jembatan: ' + (labS.bridge ? 'terpasang' : 'terlepas');
  tgS.className = 'lab-toggle ' + (labS.saklar ? 'on' : 'off');
  tgS.textContent = '⚡ Saklar: ' + (labS.saklar ? 'tertutup' : 'terbuka');

  labIsiData();
  labCekMisi();
  labRenderMisi();
}

/* ---------- Tab Data ---------- */
function labIsiData(){
  const A = labS.AN, K = labS.KA;

  $L('d-Anode').innerHTML = '<b>' + A.nama + ' (' + A.simbol + ')</b>, elektrode kiri · <b style="color:var(--navy-3)">OKSIDASI</b>' +
    '<div class="lab-reaksi">' + A.simbol + '(s) → ' + A.ion + '(aq) + ' + labElektronTeks(A.n) + '</div>';

  $L('d-Katode').innerHTML = '<b>' + K.nama + ' (' + K.simbol + ')</b>, elektrode kanan · <b style="color:var(--orange-d)">REDUKSI</b>' +
    '<div class="lab-reaksi">' + K.ion + '(aq) + ' + labElektronTeks(K.n) + ' → ' + K.simbol + '(s)</div>';

  $L('d-total').innerHTML = labS.spontan
    ? '<div class="lab-reaksi">' + labReaksiTotal(A, K) + '</div><div class="lab-note">Jumlah elektron di kedua setengah reaksi telah disetarakan.</div>'
    : '<div class="lab-note">Tidak ada reaksi spontan pada susunan ini. Coba tukar posisi kedua logam.</div>';

  $L('d-ehitung').innerHTML = '<div class="lab-rumus">E°sel = E°Katode − E°Anode</div>' +
    '<div class="lab-reaksi">(' + labFmt(K.Eo, true) + ' V) − (' + labFmt(A.Eo, true) + ' V) = <b>' + labFmt(labS.E, true) + ' V</b></div>' +
    '<div class="lab-note">Kutub (−) voltmeter terhubung ke Anode (kiri), kutub (+) ke Katode (kanan).</div>';

  $L('d-notasi').innerHTML = '<div class="lab-reaksi">' + A.simbol + '(s) | ' + A.ion + '(aq) ‖ ' + K.ion + '(aq) | ' + K.simbol + '(s)</div>' +
    '<div class="lab-note">Urutan notasi sama dengan susunan alat: Anode | ion Anode ‖ ion Katode | Katode.</div>';

  const dS = $L('d-spontan'), dM = $L('d-makro');
  if (labS.E > 0) {
    dS.innerHTML = '<span class="sp ok">SPONTAN ⚡ (E°sel &gt; 0)</span>';
    dM.textContent = labS.aktif
      ? 'Arus mengalir. Anode (' + A.simbol + ') menipis dan Katode (' + K.simbol + ') terlapisi endapan.'
      : 'Reaksi spontan secara termodinamika, tetapi arus belum mengalir karena rangkaian belum lengkap.';
  } else if (labS.E < 0) {
    dS.innerHTML = '<span class="sp bad">TIDAK SPONTAN (E°sel &lt; 0)</span>';
    dM.textContent = 'E° Katode lebih kecil daripada E° Anode, sehingga reaksi tidak berlangsung. Tukar posisi kedua logam agar logam ber-E° lebih besar menjadi Katode.';
  } else {
    dS.innerHTML = '<span class="sp bad">TIDAK ADA REAKSI BERSIH (E°sel = 0)</span>';
    dM.textContent = 'Kedua elektrode memiliki E° yang sama, sehingga tidak ada kecenderungan reaksi bersih.';
  }
}

/* ---------- Misi ---------- */
function labCekMisi(){
  const S = labS;
  if (!S.misi[0] && S.aktif && Math.abs(S.E - 1.10) < 0.005 && S.kiri === 'Zn' && S.kanan === 'Cu') {
    S.misi[0] = true;
    labSkor(20, '🎉 Misi 1 selesai! Sel Daniell Zn–Cu aktif, E°sel = +1,10 V.');
  }
  if (!S.misi[1] && S.aktif && S.E >= 1.50) {
    S.misi[1] = true;
    labSkor(20, '🎉 Misi 2 selesai! E°sel = ' + labFmt(S.E, true) + ' V (≥ 1,50 V).');
  }
  if (!S.misi[2] && !S.bridge && S.pernahAktif) {
    S.misi[2] = true;
    labSkor(20, '🎉 Misi 3 selesai! Tanpa jembatan garam, arus listrik berhenti.');
  }
}
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
function labUpdateMisiCount(){
  $L('lab-misi-count').textContent = labS.misi.filter(x => x).length + '/5';
}
function labRenderMisi(){
  ['st-m1','st-m2','st-m3','st-m4','st-m5'].forEach((id, i) => {
    const el = $L(id);
    if (el) el.textContent = labS.misi[i] ? '✅ Selesai (+20)' : '⬜ Belum selesai';
    const card = $L('misi-' + (i + 1));
    if (card) card.classList.toggle('done', labS.misi[i]);
  });

  const q4 = $L('m4-quiz');
  if (q4) {
    if (labS.misi[3]) {
      q4.innerHTML = '<div class="misi-hint ok">✅ Anode berada di kiri dan terhubung ke kutub (−) voltmeter.</div>';
    } else if (labS.aktif) {
      if (!q4.querySelector('.m-btn')) {
        q4.innerHTML = '<div class="m4-tanya">Elektrode manakah yang menjadi <b>Anode</b> pada rangkaian ini?</div>' +
          '<div class="m4-opsi">' +
          '<button class="m-btn" data-sfx onclick="labJawabM4(\'kiri\')" id="m4-kiri"></button>' +
          '<button class="m-btn" data-sfx onclick="labJawabM4(\'kanan\')" id="m4-kanan"></button></div>' +
          '<div class="feedback" id="m4-fb"></div>';
      }
      $L('m4-kiri').textContent = '⬅ KIRI (' + labS.kiri + ')';
      $L('m4-kanan').textContent = 'KANAN (' + labS.kanan + ') ➡';
    } else {
      q4.innerHTML = '<div class="misi-hint">🔒 Aktifkan sel dengan E°sel positif untuk menjawab.</div>';
    }
  }

  const q5 = $L('m5-quiz');
  if (q5) {
    if (labS.misi[4]) {
      q5.innerHTML = '<div class="misi-hint ok">✅ Notasi sel: Anode (kiri) | ion Anode ‖ ion Katode | Katode (kanan).</div>';
    } else if (labS.aktif) {
      const key = labS.kiri + '|' + labS.kanan;
      if (labS.m5key !== key || !q5.querySelector('.m-nota')) {
        labS.m5key = key;
        const An = labS.AN, Ka = labS.KA;
        labS.m5opt = [
          { t: An.simbol + '(s) | ' + An.ion + '(aq) ‖ ' + Ka.ion + '(aq) | ' + Ka.simbol + '(s)', b: true },
          { t: Ka.simbol + '(s) | ' + Ka.ion + '(aq) ‖ ' + An.ion + '(aq) | ' + An.simbol + '(s)', b: false },
          { t: An.ion + '(aq) | ' + An.simbol + '(s) ‖ ' + Ka.simbol + '(s) | ' + Ka.ion + '(aq)', b: false },
          { t: An.simbol + ' ‖ ' + An.ion + ' | ' + Ka.ion + ' ‖ ' + Ka.simbol, b: false }
        ];
        for (let i = labS.m5opt.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [labS.m5opt[i], labS.m5opt[j]] = [labS.m5opt[j], labS.m5opt[i]]; }
        q5.innerHTML = '<div class="m4-tanya">Pilih notasi sel yang tepat untuk konfigurasi selmu saat ini:</div>' +
          labS.m5opt.map((o, i) => '<button class="m-nota" data-sfx onclick="labJawabM5(' + i + ')">' + o.t + '</button>').join('') +
          '<div class="feedback" id="m5-fb"></div>';
      }
    } else {
      q5.innerHTML = '<div class="misi-hint">🔒 Aktifkan sel dengan E°sel positif untuk menjawab.</div>';
      labS.m5key = '';
    }
  }
}
function labJawabM4(sisi){
  if (labS.misi[3] || !labS.aktif) return;
  const btn = $L(sisi === 'kiri' ? 'm4-kiri' : 'm4-kanan');
  const fb = $L('m4-fb');
  if (sisi === 'kiri') {
    btn.classList.add('benar');
    if (fb) { fb.className = 'feedback show ok'; fb.textContent = 'Benar! Elektrode kiri adalah Anode (−) dan mengalami oksidasi.'; }
    labS.misi[3] = true;
    labSkor(20, '🎉 Misi 4 selesai! Kamu memahami posisi Anode dan Katode.');
  } else {
    btn.classList.add('salah');
    if (fb) { fb.className = 'feedback show no'; fb.textContent = 'Belum tepat. Elektrode tempat oksidasi (melepas elektron) adalah Anode, yaitu yang berada di kiri.'; }
    sfx('salah'); efekSalahFlash();
  }
}
function labJawabM5(i){
  if (labS.misi[4] || !labS.aktif || !labS.m5opt) return;
  const o = labS.m5opt[i];
  const btns = document.querySelectorAll('#m5-quiz .m-nota');
  const fb = $L('m5-fb');
  if (o.b) {
    btns[i].classList.add('benar');
    if (fb) { fb.className = 'feedback show ok'; fb.textContent = 'Tepat! Notasi ditulis dari Anode ke Katode, sama dengan susunan alat di meja praktikum.'; }
    labS.misi[4] = true;
    labSkor(20, '🎉 Misi 5 selesai! Kamu menguasai notasi sel Volta.');
  } else {
    btns[i].classList.add('salah'); btns[i].disabled = true;
    if (fb) { fb.className = 'feedback show no'; fb.textContent = 'Belum tepat. Ingat: notasi sel ditulis Anode | ion Anode ‖ ion Katode | Katode.'; }
    sfx('salah'); efekSalahFlash();
  }
}

/* ---------- LKPD, reset, toast, selesai ---------- */
function labCatat(){
  labS.catatNo++;
  const K = labS.KA, A = labS.AN;
  const item = document.createElement('div');
  item.className = 'lab-log-item';
  item.innerHTML = '<b>No. ' + labS.catatNo + '</b> · ⏱ ' + labS.waktu + ' dtk<br>' +
    'Anode (−): ' + A.simbol + ' · Katode (+): ' + K.simbol + ' · E°sel = ' + labFmt(labS.E, true) + ' V · ' +
    (labS.aktif ? 'sel AKTIF (e⁻: ' + A.simbol + ' → ' + K.simbol + ')'
      : (labS.E > 0 ? 'reaksi spontan tetapi rangkaian belum aktif'
        : (labS.E < 0 ? 'tidak spontan' : 'tidak ada reaksi bersih'))) + '<br>' +
    'Notasi: ' + A.simbol + '(s)|' + A.ion + '‖' + K.ion + '|' + K.simbol + '(s)';
  const log = $L('lab-log');
  log.insertBefore(item, log.firstChild);
  while (log.children.length > 10) log.removeChild(log.lastChild);
  labToast('📓 Pengamatan berhasil dicatat ke LKPD!');
}
function labReset(){
  labS.kiri = 'Zn'; labS.kanan = 'Cu';
  labS.bridge = false; labS.saklar = false;
  labS.waktu = 0; labS.massa = 0; labS.m5key = '';
  labRenderChips();
  labUpdate();
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
  let kal; const s = labS.skor;
  if (s >= 100) kal = 'Luar biasa! Kamu layak menyandang gelar Kimiawan Muda. ⚗️';
  else if (s >= 80) kal = 'Sangat baik! Sedikit lagi menuju sempurna.';
  else if (s >= 60) kal = 'Bagus! Terus berlatih merakit sel Volta.';
  else kal = 'Ayo selesaikan semua misi untuk meraih skor penuh!';
  $L('lab-akhir-kal').textContent = kal;
  openModal('modal-lab');
  sfx('win');
}

/* Pewaktu: selama sel aktif, massa Anode berkurang dan Katode bertambah */
setInterval(() => {
  if (!labS.aktif) return;
  labS.waktu++;
  labS.massa = Math.min(1, labS.massa + 0.0125);
  labPlates();
  const dm = $L('d-makro');
  if (dm) dm.textContent = 'Arus mengalir · e⁻ bergerak dari Anode (' + labS.AN.simbol + ') ke Katode (' + labS.KA.simbol + ') · ⏱ ' + labS.waktu + ' dtk';
  if (labS.waktu === 8 && !labS.hintMakro) {
    labS.hintMakro = true;
    labToast('👀 Amati: Anode menipis, Katode terlapisi endapan.');
  }
}, 1000);

/* Inisialisasi */
(function labInit(){
  if (!$L('scr-lab')) return;
  labBuildJembatan();
  labRenderChips();
  labUpdate();
  labUpdateMisiCount();
})();
