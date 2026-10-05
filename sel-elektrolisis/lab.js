/* ##############################################################
   #  LAB MAYA — PRAKTIKUM VIRTUAL SEL ELEKTROLISIS             #
   #  KATODA (−) di KIRI, ANODA (+) di KANAN, satu wadah.       #
   #  Waktu dipercepat: 1 detik nyata = 1 menit simulasi.       #
   ############################################################## */
const LAB_NS = 'http://www.w3.org/2000/svg';
const LAB_XL = 'http://www.w3.org/1999/xlink';
const $L = id => document.getElementById(id);

const F_FARADAY = 96500;     // C per mol elektron
const VM_STP = 22.4;         // L per mol gas (STP)
const LAJU = 60;             // percepatan waktu simulasi
const TABUNG_ML = 500;       // kapasitas tabung penampung gas
const NE_MAKS = 0.05;        // mol e⁻ untuk perubahan visual penuh

/* ---------- Data elektrolit dan elektrode ---------- */
const LAB_ELEKTROLIT = {
  lebur:  { id:'lebur',  nama:'NaCl',   sub:'leburan',  wujud:'lebur',   lbl:'Leburan NaCl (±800 °C)', sol:'rgba(255,150,70,.55)',
            kat:{ ion:'Na⁺', logam:'Na', Ar:23,  n:1, gol:'IA', dep:'#D5DCE4' }, an:{ ion:'Cl⁻',  jenis:'halida', X:'Cl' } },
  nacl:   { id:'nacl',   nama:'NaCl',   sub:'larutan',  wujud:'larutan', lbl:'Larutan NaCl',          sol:'rgba(190,215,255,.24)',
            kat:{ ion:'Na⁺', logam:'Na', Ar:23,  n:1, gol:'IA', dep:'#D5DCE4' }, an:{ ion:'Cl⁻',  jenis:'halida', X:'Cl' } },
  cuso4:  { id:'cuso4',  nama:'CuSO₄',  sub:'larutan',  wujud:'larutan', lbl:'Larutan CuSO₄',         sol:'rgba(60,140,255,.5)',
            kat:{ ion:'Cu²⁺', logam:'Cu', Ar:63.5, n:2, gol:null, dep:'#D9824A' }, an:{ ion:'SO₄²⁻', jenis:'oksi' } },
  na2so4: { id:'na2so4', nama:'Na₂SO₄', sub:'larutan',  wujud:'larutan', lbl:'Larutan Na₂SO₄',        sol:'rgba(200,215,240,.2)',
            kat:{ ion:'Na⁺', logam:'Na', Ar:23,  n:1, gol:'IA', dep:'#D5DCE4' }, an:{ ion:'SO₄²⁻', jenis:'oksi' } },
  ki:     { id:'ki',     nama:'KI',     sub:'larutan',  wujud:'larutan', lbl:'Larutan KI',            sol:'rgba(210,220,240,.2)',
            kat:{ ion:'K⁺',  logam:'K',  Ar:39,  n:1, gol:'IA', dep:'#D5DCE4' }, an:{ ion:'I⁻',   jenis:'halida', X:'I' } },
  agno3:  { id:'agno3',  nama:'AgNO₃',  sub:'larutan',  wujud:'larutan', lbl:'Larutan AgNO₃',         sol:'rgba(230,238,250,.2)',
            kat:{ ion:'Ag⁺', logam:'Ag', Ar:108, n:1, gol:null, dep:'#E8ECF2' }, an:{ ion:'NO₃⁻', jenis:'oksi' } }
};
const LAB_ELEKTRODE = {
  C:  { nama:'Karbon (grafit)', sim:'C',  aktif:false, sub:'inert', sw:'#4A535D', g:['#262C33','#6D7986','#262C33'] },
  Cu: { nama:'Tembaga', sim:'Cu', aktif:true, sub:'aktif', ion:'Cu²⁺', n:2, Ar:63.5, sw:'#D2824A', g:['#9A4F22','#F0AA72','#9A4F22'] },
  Ag: { nama:'Perak',   sim:'Ag', aktif:true, sub:'aktif', ion:'Ag⁺',  n:1, Ar:108,  sw:'#E6EAF0', g:['#8A909A','#F4F6FA','#8A909A'] },
  Fe: { nama:'Besi',    sim:'Fe', aktif:true, sub:'aktif', ion:'Fe²⁺', n:2, Ar:55.8, sw:'#59656D', g:['#323D45','#8C97A0','#323D45'] }
};
const LAB_ARUS = [0.5, 1.0, 2.0];

const labS = {
  elektrolit:'cuso4', kat:'C', an:'C', arus:1.0,
  power:false, ind:false, mikro:false,
  aktif:false, waktu:0, ne:0,
  catatNo:0, pernahAktif:false, hintAmati:false,
  visKey:'', eKey:'', H:null,
  misi:[false,false,false,false,false], skor:0, m5key:'', m5opt:null
};

/* ---------- Utilitas ---------- */
function svEl(tag, attrs, parent){
  const e = document.createElementNS(LAB_NS, tag);
  for (const k in attrs) e.setAttribute(k, attrs[k]);
  if (parent) parent.appendChild(e);
  return e;
}
function labNum(v, d){ return Number(v).toFixed(d).replace('.', ','); }
function labKpk(a, b){ let x = a, y = b; while (y) { [x, y] = [y, x % y]; } return a * b / x; }
function labSisi(list){ return list.map(([c, sp]) => (c === 1 ? '' : c) + sp).join(' + '); }
function labRingkas(s){ return s.replace(/\((aq|l|g|s)\)/g, '').replace(/ \[(anoda|katoda)\]/g, ''); }
function labTanpaTag(s){ return s.replace(/ \[(anoda|katoda)\]/g, ''); }
function labElektronTeks(n){ return n === 1 ? 'e⁻' : n + 'e⁻'; }

/* ---------- Penyetaraan reaksi total ---------- */
function labGabung(c, a){
  const L = labKpk(c.n, a.n), fc = L / c.n, fa = L / a.n;
  const re = {}, pr = {};
  const tambah = (obj, list, f) => list.forEach(([k, sp]) => { obj[sp] = (obj[sp] || 0) + k * f; });
  tambah(re, c.re, fc); tambah(re, a.re, fa); tambah(pr, c.pr, fc); tambah(pr, a.pr, fa);
  const m = Math.min(pr['H⁺(aq)'] || 0, pr['OH⁻(aq)'] || 0);
  if (m) { pr['H⁺(aq)'] -= m; pr['OH⁻(aq)'] -= m; pr['H₂O(l)'] = (pr['H₂O(l)'] || 0) + m; }
  Object.keys(re).forEach(sp => {
    if (pr[sp]) { const x = Math.min(re[sp], pr[sp]); re[sp] -= x; pr[sp] -= x; }
  });
  const susun = o => Object.keys(o).filter(k => o[k] > 0).map(k => [o[k], k]);
  return labSisi(susun(re)) + ' → ' + labSisi(susun(pr));
}

/* ---------- Mesin penentu produk elektrolisis ---------- */
function labHitung(){
  const E = LAB_ELEKTROLIT[labS.elektrolit], kEl = LAB_ELEKTRODE[labS.kat], aEl = LAB_ELEKTRODE[labS.an];
  const lebur = E.wujud === 'lebur', st = lebur ? '(l)' : '(aq)';
  let kat, an;

  // --- katoda: reduksi
  if (!lebur && E.kat.gol) {
    kat = { tipe:'gas', gas:'H₂', warna:'#FFFFFF', re:[[2,'H₂O(l)']], pr:[[1,'H₂(g)'],[2,'OH⁻(aq)']], n:2, molPerE:1/2, basa:true,
            alasan: E.kat.ion + ' (golongan ' + E.kat.gol + ') sulit direduksi dalam larutan, sehingga H₂O yang direduksi.' };
  } else {
    const m = E.kat, w = lebur ? '(l)' : '(s)', tag = aEl.aktif ? ' [katoda]' : '';
    kat = { tipe:'logam', logam:m.logam, dep:m.dep, Ar:m.Ar, re:[[1, m.ion + st]], pr:[[1, m.logam + w + tag]], n:m.n, molPerE:1/m.n,
            alasan: lebur ? 'Tidak ada air, sehingga kation langsung direduksi menjadi logam.'
                          : m.ion + ' bukan kation golongan IA/IIA/Al/Mn, sehingga direduksi menjadi logam.' };
  }

  // --- anoda: oksidasi
  if (aEl.aktif) {
    an = { tipe:'larut', logam:aEl.sim, Ar:aEl.Ar, re:[[1, aEl.sim + '(s) [anoda]']], pr:[[1, aEl.ion + st]], n:aEl.n, molPerE:1/aEl.n,
           alasan: 'Anoda ' + aEl.sim + ' bersifat aktif, sehingga logam anoda sendiri yang teroksidasi dan larut.' };
  } else if (E.an.jenis === 'halida') {
    if (E.an.X === 'I') {
      an = { tipe:'iod', re:[[2,'I⁻' + st]], pr:[[1,'I₂(aq)']], n:2, molPerE:1/2, Mr:253.8,
             alasan: 'I⁻ (halida) lebih mudah dioksidasi daripada H₂O, sehingga terbentuk I₂ yang berwarna cokelat.' };
    } else {
      an = { tipe:'gas', gas:'Cl₂', warna:'#D8F27A', re:[[2,'Cl⁻' + st]], pr:[[1,'Cl₂(g)']], n:2, molPerE:1/2,
             alasan: 'Cl⁻ (halida) lebih mudah dioksidasi daripada H₂O, sehingga terbentuk gas Cl₂.' };
    }
  } else {
    an = { tipe:'gas', gas:'O₂', warna:'#BFE3FF', re:[[2,'H₂O(l)']], pr:[[1,'O₂(g)'],[4,'H⁺(aq)']], n:4, molPerE:1/4, asam:true,
           alasan: E.an.ion + ' (sisa asam oksi) tidak dioksidasi, sehingga H₂O yang dioksidasi.' };
  }

  kat.rx = labSisi(kat.re) + ' + ' + labElektronTeks(kat.n) + ' → ' + labSisi(kat.pr);
  an.rx  = labSisi(an.re)  + ' → ' + labSisi(an.pr) + ' + ' + labElektronTeks(an.n);
  const total = labGabung(kat, an);

  // --- pengamatan
  const amati = [];
  amati.push(kat.tipe === 'gas' ? 'Katoda: gelembung gas ' + kat.gas + ' tidak berwarna.'
                                : 'Katoda: terbentuk endapan ' + kat.logam + (lebur ? ' cair berwarna perak.' : '.'));
  if (an.tipe === 'gas') amati.push('Anoda: gelembung gas ' + an.gas + (an.gas === 'Cl₂' ? ' kehijauan, berbau menyengat.' : ' tidak berwarna.'));
  else if (an.tipe === 'iod') amati.push('Anoda: larutan di sekitarnya berwarna cokelat (I₂).');
  else amati.push('Anoda ' + an.logam + ' menipis karena larut menjadi ion.');
  if (kat.basa) amati.push('Sekitar katoda bersifat basa (OH⁻ terbentuk).');
  if (an.asam) amati.push('Sekitar anoda bersifat asam (H⁺ terbentuk).');
  if (E.id === 'cuso4' && an.tipe !== 'larut') amati.push('Warna biru larutan memudar karena Cu²⁺ berkurang.');
  if (kat.tipe === 'gas' && an.tipe === 'gas' && kat.gas === 'H₂' && an.gas === 'O₂') amati.push('Volume H₂ : O₂ = 2 : 1.');

  return { E, kEl, aEl, lebur, kat, an, total, amati };
}

/* ---------- Navigasi & panel ---------- */
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
  if (labS.mikro) labToast('🔬 Label partikel ditampilkan: ion dan elektron.');
}
function labResetProgres(){ labS.waktu = 0; labS.ne = 0; labS.m5key = ''; }

function labRenderChips(){
  const ge = $L('grid-elektrolit'); ge.innerHTML = '';
  Object.keys(LAB_ELEKTROLIT).forEach(k => {
    const e = LAB_ELEKTROLIT[k];
    const b = document.createElement('button');
    b.className = 'el-chip' + (labS.elektrolit === k ? ' aktif' : '');
    b.setAttribute('data-sfx', '');
    b.innerHTML = e.nama + '<small>' + e.sub + '</small>';
    b.onclick = () => { labS.elektrolit = k; labResetProgres(); labRenderChips(); labUpdate(); };
    ge.appendChild(b);
  });
  [['kat','grid-kat'], ['an','grid-an']].forEach(([sisi, id]) => {
    const w = $L(id); w.innerHTML = '';
    Object.keys(LAB_ELEKTRODE).forEach(k => {
      const m = LAB_ELEKTRODE[k];
      const b = document.createElement('button');
      b.className = 'logam-chip' + (labS[sisi] === k ? ' aktif' : '');
      b.setAttribute('data-sfx', '');
      b.setAttribute('aria-label', 'Elektrode ' + m.nama + ' (' + m.sub + ')');
      b.innerHTML = '<span class="sw" style="background:' + m.sw + '"></span><span class="lc-sym">' + m.sim + '</span><span class="lc-e">' + m.sub + '</span>';
      b.onclick = () => { labS[sisi] = k; labResetProgres(); labRenderChips(); labUpdate(); };
      w.appendChild(b);
    });
  });
  const ga = $L('grid-arus'); ga.innerHTML = '';
  LAB_ARUS.forEach(a => {
    const b = document.createElement('button');
    b.className = 'el-chip' + (labS.arus === a ? ' aktif' : '');
    b.setAttribute('data-sfx', '');
    b.textContent = labNum(a, 1) + ' A';
    b.onclick = () => { labS.arus = a; labResetProgres(); labRenderChips(); labUpdate(); };
    ga.appendChild(b);
  });
}
function togglePower(){
  labS.power = !labS.power;
  labUpdate();
  if (labS.power) labToast('⚡ Sumber hidup: elektron mengalir dari kutub (−) ke katoda.');
}
function toggleInd(){
  labS.ind = !labS.ind;
  labUpdate();
  if (labS.ind) labToast('🎨 Indikator universal: ungu = basa, merah = asam.');
}

/* ---------- Pembangunan elemen SVG dinamis ---------- */
const LAB_POS_KAT = [[130,320],[160,372],[300,300],[330,354],[420,330],[450,392],[580,318],[610,372],[200,396],[560,396]];
const LAB_POS_AN  = [[120,352],[175,312],[270,378],[345,322],[395,388],[440,306],[560,350],[620,330],[300,400]];

function labBuildIon(H){
  const g = $L('ionsB'); g.innerHTML = '';
  const zona = x => (x > 196 && x < 264) || (x > 480 && x < 548);
  LAB_POS_KAT.forEach((p, i) => {
    if (zona(p[0])) return;
    const o = svEl('g', { transform: 'translate(' + p[0] + ',' + p[1] + ')' }, g);
    const f = svEl('g', { class:'ion-g', style:'animation-delay:' + ((i * .55) % 4).toFixed(2) + 's;animation-duration:' + (3.6 + (i % 3) * .5) + 's' }, o);
    svEl('circle', { r:5.2, fill:'#FFA566', stroke:'rgba(255,255,255,.75)', 'stroke-width':1 }, f);
    if (i < 3) { const t = svEl('text', { class:'lbl', y:-9, 'text-anchor':'middle' }, f); t.textContent = H.E.kat.ion; }
  });
  LAB_POS_AN.forEach((p, i) => {
    if (zona(p[0])) return;
    const o = svEl('g', { transform: 'translate(' + p[0] + ',' + p[1] + ')' }, g);
    const f = svEl('g', { class:'ion-g', style:'animation-delay:' + ((i * .7 + .3) % 4).toFixed(2) + 's;animation-duration:' + (4 + (i % 3) * .4) + 's' }, o);
    svEl('rect', { x:-4, y:-4, width:8, height:8, rx:2, fill:'#8EC1FF', opacity:.9 }, f);
    if (i < 2) { const t = svEl('text', { class:'lbl', y:-8, 'text-anchor':'middle' }, f); t.textContent = H.E.an.ion; }
  });
}

function labBuildMigrasi(H, dur){
  const g = $L('migr'); g.innerHTML = '';
  const ys = [304, 330, 356, 382, 404, 318];
  ys.forEach((y, i) => {
    [['kat', 'M470,' + y + ' H264', '#FFA566', H.E.kat.ion, 0], ['an', 'M264,' + (y + 12) + ' H470', '#8EC1FF', H.E.an.ion, dur / 2]].forEach(([tipe, path, col, lab, off]) => {
      const o = svEl('g', {}, g);
      if (tipe === 'kat') svEl('circle', { r:5, fill:col, stroke:'#fff', 'stroke-width':1.1 }, o);
      else svEl('rect', { x:-4.5, y:-4.5, width:9, height:9, rx:2, fill:col, stroke:'#fff', 'stroke-width':1.1 }, o);
      if (i % 3 === 0) { const t = svEl('text', { class:'lbl', y:-9, 'text-anchor':'middle' }, o); t.textContent = lab; }
      const begin = -(i * dur / ys.length) - off;
      svEl('animateMotion', { dur: dur + 's', begin: begin + 's', repeatCount:'indefinite', path: path, calcMode:'linear' }, o);
      svEl('animate', { attributeName:'opacity', values:'0;1;1;0', keyTimes:'0;.12;.88;1', dur: dur + 's', begin: begin + 's', repeatCount:'indefinite' }, o);
    });
  });
}

function labBuildGelembung(H){
  const mk = (id, cx, gas, count) => {
    const g = $L(id); g.innerHTML = '';
    if (!count) return;
    for (let i = 0; i < count; i++) {
      const dx = ((i * 7) % 13) - 6, r = 3 + (i % 3) * 1.4;
      const side = (i % 2 ? 1 : -1) * (13 + (i % 3) * 3);
      svEl('circle', {
        class:'bub', cx: cx + side, cy: 388, r: r, fill: gas, 'fill-opacity':.55, stroke:'rgba(255,255,255,.9)', 'stroke-width':1.1,
        style:'--bx:' + (dx * .6) + 'px;--bd:' + (2.2 + (i % 4) * .35) + 's;animation-delay:' + (i * .31).toFixed(2) + 's'
      }, g);
    }
  };
  const mk_ = H.kat.tipe === 'gas' ? H.kat.molPerE : 0, ma = H.an.tipe === 'gas' ? H.an.molPerE : 0;
  const mx = Math.max(mk_, ma) || 1;
  mk('bubK', 230, H.kat.warna || '#fff', mk_ ? Math.max(2, Math.round(10 * mk_ / mx)) : 0);
  mk('bubA', 514, H.an.warna || '#fff',  ma ? Math.max(2, Math.round(10 * ma / mx)) : 0);
}

function labBuildGen(H){
  const gk = $L('genK'), ga = $L('genA');
  gk.innerHTML = ''; ga.innerHTML = '';
  const GEN = [[-16,322,-46,-8],[16,342,44,-12],[-16,362,-52,10],[16,380,38,6],[-16,336,-38,-12],[16,318,54,8]];
  if (H.kat.tipe === 'logam') {
    GEN.forEach((q, i) => {
      const o = svEl('g', { transform: 'translate(' + (230 + q[0]) + ',' + q[1] + ')' }, gk);
      svEl('circle', { class:'gen gen-in', r:4.4, fill:'#FFA566', stroke:'rgba(255,255,255,.8)', 'stroke-width':1,
        style:'--dx:' + q[2] + 'px;--dy:' + q[3] + 'px;animation-delay:' + (i * .5) + 's' }, o);
    });
  }
  if (H.an.tipe === 'larut') {
    GEN.forEach((q, i) => {
      const o = svEl('g', { transform: 'translate(' + (514 + q[0]) + ',' + q[1] + ')' }, ga);
      svEl('circle', { class:'gen gen-out', r:4.4, fill:'#FFA566', stroke:'rgba(255,255,255,.8)', 'stroke-width':1,
        style:'--dx:' + q[2] + 'px;--dy:' + q[3] + 'px;animation-delay:' + (i * .5) + 's' }, o);
    });
  }
}

function labMotion(parent, pathId, dur, begin){
  const am = svEl('animateMotion', { dur: dur + 's', begin: begin + 's', repeatCount:'indefinite', calcMode:'linear' }, parent);
  const mp = svEl('mpath', {}, am);
  mp.setAttribute('href', pathId);
  mp.setAttributeNS(LAB_XL, 'href', pathId);
}
function labElektron(){
  const g = $L('lab-elektron'); g.innerHTML = '';
  if (!labS.aktif) return;
  const dur = Math.max(1.8, 4.4 - labS.arus * 1.2), n = 5;
  ['#ePathK', '#ePathA'].forEach((pid, k) => {
    for (let i = 0; i < n; i++) {
      const o = svEl('g', {}, g);
      svEl('circle', { r:6.5, fill:'#FFC21A', stroke:'#F26A21', 'stroke-width':1.6 }, o);
      if (i === 0) { const t = svEl('text', { class:'lbl', y:-10, 'text-anchor':'middle' }, o); t.textContent = 'e⁻'; }
      labMotion(o, pid, dur, -(i * dur / n) - (k ? dur / 3 : 0));
    }
  });
  labBuildMigrasi(labS.H, dur * 1.6);
}

/* ---------- Visual dinamis berdasarkan progres ---------- */
function labProgres(){
  const H = labS.H; if (!H) return;
  const p = Math.min(1, labS.ne / NE_MAKS);

  // tabung gas
  const ml = (side) => labS.ne * side.molPerE * VM_STP * 1000;
  if (H.kat.tipe === 'gas') {
    const f = Math.min(1, ml(H.kat) / TABUNG_ML);
    $L('gasK').style.transform = 'scaleY(' + f.toFixed(3) + ')';
    $L('gasKln').style.transform = 'translateY(' + (148 * f).toFixed(1) + 'px)'; $L('gasKln').style.opacity = f > .02 ? 1 : 0;
    $L('gasKlbl').classList.toggle('show', f > .12);
  }
  if (H.an.tipe === 'gas') {
    const f = Math.min(1, ml(H.an) / TABUNG_ML);
    $L('gasA').style.transform = 'scaleY(' + f.toFixed(3) + ')';
    $L('gasAln').style.transform = 'translateY(' + (148 * f).toFixed(1) + 'px)'; $L('gasAln').style.opacity = f > .02 ? 1 : 0;
    $L('gasAlbl').classList.toggle('show', f > .12);
  }
  if (H.kat.tipe !== 'gas') { $L('gasK').style.transform = 'scaleY(0)'; $L('gasKln').style.opacity = 0; }
  if (H.an.tipe !== 'gas') { $L('gasA').style.transform = 'scaleY(0)'; $L('gasAln').style.opacity = 0; }

  // endapan di katoda
  const dep = $L('depK');
  if (H.kat.tipe === 'logam') {
    const d = 8 * p;
    dep.setAttribute('x', 230 - 11 - d); dep.setAttribute('width', 22 + 2 * d);
    dep.setAttribute('fill', H.kat.dep);
    dep.setAttribute('opacity', Math.min(1, p * 8).toFixed(2));
  } else dep.setAttribute('opacity', 0);

  // anoda aktif: menipis dan memendek
  const pa = $L('plateA'), wa = $L('wetA');
  let w = 22, bot = 396;
  if (H.an.tipe === 'larut') { w = 22 * (1 - 0.42 * p); bot = 396 - 54 * p; }
  pa.setAttribute('x', 514 - w / 2); pa.setAttribute('width', w); pa.setAttribute('height', bot - 158);
  wa.setAttribute('x', 514 - w / 2); wa.setAttribute('width', w); wa.setAttribute('height', Math.max(0, bot - 282));

  // warna larutan memudar (Cu²⁺ berkurang bila anoda inert)
  const pudar = (H.E.id === 'cuso4' && H.an.tipe !== 'larut') ? (1 - 0.55 * p) : 1;
  $L('solG').style.opacity = pudar.toFixed(2);

  // halo indikator dan iodin
  $L('haloK').setAttribute('opacity', (labS.ind && H.kat.basa) ? Math.min(.9, p * 3).toFixed(2) : 0);
  const haA = H.an.tipe === 'iod' ? Math.min(.95, p * 3) : ((labS.ind && H.an.asam) ? Math.min(.9, p * 3) : 0);
  $L('haloA').setAttribute('opacity', haA.toFixed(2));
}

/* ---------- Pembaruan utama ---------- */
function labUpdate(){
  const H = labHitung(); labS.H = H;
  labS.aktif = !!labS.power;
  if (labS.aktif) labS.pernahAktif = true;
  const svg = $L('lab-svg');
  svg.classList.toggle('aktif', labS.aktif);

  // --- penampilan statis (hanya bila konfigurasi berubah)
  const key = labS.elektrolit + '|' + labS.kat + '|' + labS.an;
  if (key !== labS.visKey) {
    labS.visKey = key;
    const bk = $L('bk');
    bk.style.setProperty('--sol', H.E.sol);
    bk.style.setProperty('--gasK', H.kat.warna || '#fff');
    bk.style.setProperty('--gasA', H.an.warna || '#fff');
    const gK = $L('gEK').querySelectorAll('stop'), gA = $L('gEA').querySelectorAll('stop');
    H.kEl.g.forEach((c, i) => gK[i].setAttribute('stop-color', c));
    H.aEl.g.forEach((c, i) => gA[i].setAttribute('stop-color', c));
    $L('symK').textContent = H.kEl.sim; $L('symA').textContent = H.aEl.sim;
    $L('elLbl').textContent = H.E.lbl;
    $L('rxK').textContent = labRingkas(H.kat.rx); $L('rxA').textContent = labRingkas(H.an.rx);
    const tK = H.kat.tipe === 'gas', tA = H.an.tipe === 'gas';
    $L('tubeK').setAttribute('opacity', tK ? 1 : 0); $L('tgK').setAttribute('opacity', tK ? 1 : 0);
    $L('tubeA').setAttribute('opacity', tA ? 1 : 0); $L('tgA').setAttribute('opacity', tA ? 1 : 0);
    $L('gasKlbl').textContent = H.kat.gas || ''; $L('gasAlbl').textContent = H.an.gas || '';
    $L('gasK').style.transform = 'scaleY(0)'; $L('gasA').style.transform = 'scaleY(0)';
    $L('gasKln').style.transform = 'translateY(0)'; $L('gasAln').style.transform = 'translateY(0)';
    $L('gasKlbl').classList.remove('show'); $L('gasAlbl').classList.remove('show');
    const stops = $L('gHA').querySelectorAll('stop');
    stops.forEach(s => s.setAttribute('stop-color', H.an.tipe === 'iod' ? '#7A4A1E' : '#FF4D4D'));
    $L('heat').setAttribute('opacity', H.lebur ? 1 : 0);
    $L('flames').setAttribute('opacity', H.lebur ? 1 : 0);
    labBuildIon(H); labBuildGelembung(H); labBuildGen(H);
    labS.eKey = '';
  }

  // --- sumber arus dan saklar
  const lever = $L('lab-switch-lever');
  lever.classList.toggle('tutup', labS.power);
  lever.setAttribute('stroke', labS.power ? '#FFC21A' : '#D7E1F5');
  $L('src-i').textContent = (labS.power ? labNum(labS.arus, 2) : '0,00') + ' A';
  $L('src-i').setAttribute('fill', labS.power ? '#4ADE80' : '#5C6F8F');
  $L('src-v').setAttribute('fill', labS.power ? '#BFD2F2' : '#7F96BD');

  // --- aliran elektron dan migrasi ion
  const eKey = labS.aktif ? ('on|' + labS.arus + '|' + key) : 'off';
  if (eKey !== labS.eKey) { labS.eKey = eKey; labElektron(); }
  $L('migr').setAttribute('opacity', labS.aktif ? 1 : 0);
  $L('capG').setAttribute('opacity', labS.aktif ? 1 : 0);
  $L('dirLbl').setAttribute('opacity', labS.aktif ? 1 : 0);

  // --- status & tombol
  const st = $L('lab-status');
  st.textContent = labS.aktif ? 'Elektrolisis berlangsung ⚡' : 'Sumber arus mati';
  st.className = 'lab-status ' + (labS.aktif ? 'on' : 'off');
  const tp = $L('tg-power'), ti = $L('tg-ind');
  tp.className = 'lab-toggle ' + (labS.power ? 'on' : 'off');
  tp.textContent = '⚡ Sumber: ' + (labS.power ? 'hidup' : 'mati');
  ti.className = 'lab-toggle ' + (labS.ind ? 'on' : 'off');
  ti.textContent = '🎨 Indikator: ' + (labS.ind ? 'hidup' : 'mati');

  labProgres();
  labIsiData();
  labCekMisi();
  labRenderMisi();
}

/* ---------- Tab Data ---------- */
function labIsiData(){
  const H = labS.H;
  $L('d-katoda').innerHTML = 'Elektrode <b>' + H.kEl.nama + ' (' + H.kEl.sim + ')</b>' +
    '<div class="lab-reaksi">' + labTanpaTag(H.kat.rx) + '</div><div class="lab-alasan">' + H.kat.alasan + '</div>';
  $L('d-anoda').innerHTML = 'Elektrode <b>' + H.aEl.nama + ' (' + H.aEl.sim + ')</b>' +
    '<div class="lab-reaksi">' + labTanpaTag(H.an.rx) + '</div><div class="lab-alasan">' + H.an.alasan + '</div>';
  $L('d-total').innerHTML = '<div class="lab-reaksi">' + H.total + '</div>' +
    '<div class="lab-note">Jumlah elektron kedua setengah reaksi disetarakan, lalu H⁺ + OH⁻ dinetralkan bila perlu.</div>';

  const fa = $L('d-faraday');
  if (labS.ne <= 0) {
    fa.innerHTML = '<div class="lab-note">Nyalakan sumber arus untuk melihat perhitungan. Waktu dipercepat: 1 detik nyata = 1 menit simulasi.</div>';
  } else {
    const t = labS.waktu * LAJU, Q = labS.arus * t, ne = labS.ne;
    let s = 'I = ' + labNum(labS.arus, 1) + ' A, t = ' + labNum(t / 60, 0) + ' menit (' + t + ' s)<br>' +
            'Q = I × t = ' + Math.round(Q).toLocaleString('id-ID') + ' C<br>' +
            'n(e⁻) = Q ÷ 96.500 = <b>' + labNum(ne, 4) + ' mol</b><br>';
    const sisi = (nama, d) => {
      const mol = ne * d.molPerE;
      if (d.tipe === 'logam') return nama + ': n(' + d.logam + ') = n(e⁻) ÷ ' + d.n + ' = ' + labNum(mol, 4) + ' mol<br>&nbsp;&nbsp;m = ' + labNum(mol, 4) + ' × ' + d.Ar + ' = <b>' + labNum(mol * d.Ar, 3) + ' g</b> terbentuk<br>';
      if (d.tipe === 'larut') return nama + ': n(' + d.logam + ') = n(e⁻) ÷ ' + d.n + ' = ' + labNum(mol, 4) + ' mol<br>&nbsp;&nbsp;m = ' + labNum(mol, 4) + ' × ' + d.Ar + ' = <b>' + labNum(mol * d.Ar, 3) + ' g</b> larut<br>';
      if (d.tipe === 'iod') return nama + ': n(I₂) = n(e⁻) ÷ 2 = ' + labNum(mol, 4) + ' mol<br>&nbsp;&nbsp;m = ' + labNum(mol, 4) + ' × 254 = <b>' + labNum(mol * d.Mr, 3) + ' g</b> I₂<br>';
      const penyebut = Math.round(1 / d.molPerE);
      return nama + ': n(' + d.gas + ') = n(e⁻) ÷ ' + penyebut + ' = ' + labNum(mol, 4) + ' mol<br>&nbsp;&nbsp;V (STP) = ' + labNum(mol, 4) + ' × 22,4 = <b>' + labNum(mol * VM_STP * 1000, 1) + ' mL</b><br>';
    };
    s += sisi('Katoda', H.kat) + sisi('Anoda', H.an);
    fa.innerHTML = '<div class="lab-faraday">' + s + '</div>';
  }
  $L('d-amati').innerHTML = H.amati.map(x => '• ' + x).join('<br>');
}

/* ---------- Misi ---------- */
function labCekMisi(){
  const S = labS;
  if (!S.aktif) return;
  if (!S.misi[0] && S.elektrolit === 'cuso4' && S.kat === 'C' && S.an === 'C') {
    S.misi[0] = true; labSkor(20, '🎉 Misi 1 selesai! Cu mengendap di katoda dan O₂ terbentuk di anoda.');
  }
  if (!S.misi[1] && S.elektrolit === 'na2so4' && S.kat === 'C' && S.an === 'C') {
    S.misi[1] = true; labSkor(20, '🎉 Misi 2 selesai! Air terurai menjadi H₂ dan O₂ dengan perbandingan 2 : 1.');
  }
  if (!S.misi[2] && S.elektrolit === 'agno3' && S.kat === 'Fe' && S.an === 'Ag') {
    S.misi[2] = true; labSkor(20, '🎉 Misi 3 selesai! Besi tersepuh perak: anoda Ag larut, Ag mengendap di katoda.');
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
function labUpdateMisiCount(){ $L('lab-misi-count').textContent = labS.misi.filter(x => x).length + '/5'; }

function labRenderMisi(){
  ['st-m1','st-m2','st-m3','st-m4','st-m5'].forEach((id, i) => {
    const el = $L(id);
    if (el) el.textContent = labS.misi[i] ? '✅ Selesai (+20)' : '⬜ Belum selesai';
    const card = $L('misi-' + (i + 1));
    if (card) card.classList.toggle('done', labS.misi[i]);
  });
  const H = labS.H;

  const q4 = $L('m4-quiz');
  if (q4) {
    if (labS.misi[3]) {
      q4.innerHTML = '<div class="misi-hint ok">✅ Anoda berada di kanan dan terhubung ke kutub (+) sumber arus.</div>';
    } else if (labS.aktif) {
      if (!q4.querySelector('.m-btn')) {
        q4.innerHTML = '<div class="m4-tanya">Elektrode di sisi mana yang terhubung ke kutub <b>POSITIF (+)</b> sumber?</div>' +
          '<div class="m4-opsi"><button class="m-btn" data-sfx onclick="labJawabM4(\'kiri\')" id="m4-kiri"></button>' +
          '<button class="m-btn" data-sfx onclick="labJawabM4(\'kanan\')" id="m4-kanan"></button></div><div class="feedback" id="m4-fb"></div>';
      }
      $L('m4-kiri').textContent = '⬅ KIRI (' + H.kEl.sim + ')';
      $L('m4-kanan').textContent = 'KANAN (' + H.aEl.sim + ') ➡';
    } else {
      q4.innerHTML = '<div class="misi-hint">🔒 Nyalakan sumber arus untuk menjawab.</div>';
    }
  }

  const q5 = $L('m5-quiz');
  if (q5) {
    if (labS.misi[4]) {
      q5.innerHTML = '<div class="misi-hint ok">✅ Reduksi di katoda: ' + labRingkas(H.kat.rx) + '</div>';
    } else if (labS.aktif) {
      const key = labS.elektrolit + '|' + labS.kat + '|' + labS.an;
      if (labS.m5key !== key || !q5.querySelector('.m-nota')) {
        labS.m5key = key;
        const E = H.E, benar = labRingkas(H.kat.rx);
        const alt = (H.kat.tipe === 'gas') ? (E.kat.ion + ' + ' + labElektronTeks(E.kat.n) + ' → ' + E.kat.logam)
                                           : '2H₂O + 2e⁻ → H₂ + 2OH⁻';
        const balik = labRingkas(labSisi(H.kat.pr)) + ' → ' + labRingkas(labSisi(H.kat.re)) + ' + ' + labElektronTeks(H.kat.n);
        const opts = [benar, labRingkas(H.an.rx), alt, balik].filter((v, i, a) => a.indexOf(v) === i)
          .map(t => ({ t: t, b: t === benar }));
        for (let i = opts.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [opts[i], opts[j]] = [opts[j], opts[i]]; }
        labS.m5opt = opts;
        q5.innerHTML = '<div class="m4-tanya">Pilih setengah reaksi yang terjadi di <b>KATODA</b>:</div>' +
          opts.map((o, i) => '<button class="m-nota" data-sfx onclick="labJawabM5(' + i + ')">' + o.t + '</button>').join('') +
          '<div class="feedback" id="m5-fb"></div>';
      }
    } else {
      q5.innerHTML = '<div class="misi-hint">🔒 Nyalakan sumber arus untuk menjawab.</div>';
      labS.m5key = '';
    }
  }
}
function labJawabM4(sisi){
  if (labS.misi[3] || !labS.aktif) return;
  const btn = $L(sisi === 'kiri' ? 'm4-kiri' : 'm4-kanan'), fb = $L('m4-fb');
  if (sisi === 'kanan') {
    btn.classList.add('benar');
    if (fb) { fb.className = 'feedback show ok'; fb.textContent = 'Benar! Anoda terhubung ke kutub (+) dan menjadi tempat oksidasi.'; }
    labS.misi[3] = true;
    labSkor(20, '🎉 Misi 4 selesai! Kamu memahami polaritas sel elektrolisis.');
  } else {
    btn.classList.add('salah');
    if (fb) { fb.className = 'feedback show no'; fb.textContent = 'Belum tepat. Katoda terhubung ke kutub (−); kutub (+) terhubung ke anoda di sisi kanan.'; }
    sfx('salah'); efekSalahFlash();
  }
}
function labJawabM5(i){
  if (labS.misi[4] || !labS.aktif || !labS.m5opt) return;
  const o = labS.m5opt[i], btns = document.querySelectorAll('#m5-quiz .m-nota'), fb = $L('m5-fb');
  if (o.b) {
    btns[i].classList.add('benar');
    if (fb) { fb.className = 'feedback show ok'; fb.textContent = 'Tepat! Di katoda terjadi reduksi: elektron berada di sisi pereaksi.'; }
    labS.misi[4] = true;
    labSkor(20, '🎉 Misi 5 selesai! Kamu menguasai reaksi di katoda.');
  } else {
    btns[i].classList.add('salah'); btns[i].disabled = true;
    if (fb) { fb.className = 'feedback show no'; fb.textContent = 'Belum tepat. Reduksi menerima elektron, jadi e⁻ ada di sisi kiri tanda panah.'; }
    sfx('salah'); efekSalahFlash();
  }
}

/* ---------- LKPD, reset, toast, selesai ---------- */
function labCatat(){
  labS.catatNo++;
  const H = labS.H, item = document.createElement('div');
  item.className = 'lab-log-item';
  item.innerHTML = '<b>No. ' + labS.catatNo + '</b> · ⏱ ' + labNum(labS.waktu * LAJU / 60, 0) + ' menit (simulasi)<br>' +
    H.E.lbl + ' · katoda ' + H.kEl.sim + ' · anoda ' + H.aEl.sim + ' · I = ' + labNum(labS.arus, 1) + ' A<br>' +
    'Katoda: ' + labRingkas(H.kat.rx) + '<br>Anoda: ' + labRingkas(H.an.rx) + '<br>n(e⁻) = ' + labNum(labS.ne, 4) + ' mol';
  const log = $L('lab-log');
  log.insertBefore(item, log.firstChild);
  while (log.children.length > 10) log.removeChild(log.lastChild);
  labToast('📓 Pengamatan berhasil dicatat ke LKPD!');
}
function labReset(){
  Object.assign(labS, { elektrolit:'cuso4', kat:'C', an:'C', arus:1.0, power:false, ind:false });
  labResetProgres();
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
  const s = labS.skor;
  let kal;
  if (s >= 100) kal = 'Luar biasa! Kamu layak menyandang gelar Kimiawan Muda. ⚗️';
  else if (s >= 80) kal = 'Sangat baik! Sedikit lagi menuju sempurna.';
  else if (s >= 60) kal = 'Bagus! Terus berlatih melakukan elektrolisis.';
  else kal = 'Ayo selesaikan semua misi untuk meraih skor penuh!';
  $L('lab-akhir-kal').textContent = kal;
  openModal('modal-lab');
  sfx('win');
}

/* Pewaktu: selama sumber hidup, elektron mengalir dan zat terbentuk */
setInterval(() => {
  if (!labS.aktif) return;
  labS.waktu++;
  labS.ne += labS.arus * LAJU / F_FARADAY;
  labProgres();
  labIsiData();
  if (labS.waktu === 8 && !labS.hintAmati) {
    labS.hintAmati = true;
    labToast('👀 Amati tabung gas, endapan, dan perubahan warna larutan.');
  }
}, 1000);

(function labInit(){
  if (!$L('scr-lab')) return;
  labRenderChips();
  labUpdate();
  labUpdateMisiCount();
})();
