/* ##############################################################
   #  LAB MAYA — PRAKTIKUM VIRTUAL BENTUK MOLEKUL (3D)          #
   #  Tiga eksperimen: VSEPR 3D, hibridisasi orbital, dan       #
   #  kepolaran molekul. Mesin 3D sederhana (rotasi dan         #
   #  proyeksi perspektif) tanpa pustaka eksternal.             #
   #  Sudut aktual dibulatkan dari data buku acuan.             #
   ############################################################## */
const LAB_NS = 'http://www.w3.org/2000/svg';
const $L = id => document.getElementById(id);
const S3 = Math.sqrt(3) / 2;
const CX = 190, CY = 262, BL = 118, FOC = 700, SZ = 1.25;

/* ---------- Data geometri ---------- */
const nrm = v => { const n = Math.hypot(v[0], v[1], v[2]) || 1; return [v[0] / n, v[1] / n, v[2] / n]; };
const DIRS = {
  linear: [[1,0,0],[-1,0,0]],
  trig:   [[1,0,0],[-.5,S3,0],[-.5,-S3,0]],
  tetra:  [[1,1,1],[1,-1,-1],[-1,1,-1],[-1,-1,1]].map(nrm),
  tbp:    [[1,0,0],[-.5,S3,0],[-.5,-S3,0],[0,0,1],[0,0,-1]],
  oct:    [[1,0,0],[-1,0,0],[0,1,0],[0,-1,0],[0,0,1],[0,0,-1]]
};
const GEO_NAMA = { linear:'linear', trig:'segitiga planar', tetra:'tetrahedral', tbp:'bipiramida trigonal', oct:'oktahedral' };
const WARNA = { H:'#F4F6FA', Be:'#9BD83C', B:'#E89AA7', C:'#6B7280', N:'#3B6FE0', O:'#E8453C', F:'#8BC34A', P:'#F26A21', S:'#F2C21B', Cl:'#3BA55D', Br:'#A33B2E', Xe:'#3E9BB0', X:'#9CC2F5', A:'#F26A21' };
const JARI = { H:11, Be:15, B:15, C:16, N:15, O:15, F:13, P:18, S:18, Cl:17, Br:19, Xe:20, X:14, A:18 };
const GELAP = ['H','F','S','B','Be','X'];
const CHI = { H:2.20, Be:1.57, B:2.04, C:2.55, N:3.04, O:3.44, F:3.98, P:2.19, S:2.58, Cl:3.16, Br:2.96, Xe:2.60 };
const LOBE = ['#F2C21B','#F26A21','#2E9BD6','#3BA55D','#9546B8','#E8453C'];

// grp: kelompok ikatan yang didorong menjauh dari PEB: [indeks ikatan, [pasangan sudut], target°]
const MOL = {
  becl2: { f:'BeCl₂', nama:'Berilium klorida',       c:'Be', lig:['Cl','Cl'],     geo:'linear', lp:[],      axe:'AX₂',   bentuk:'linear',                 ideal:'180°',          aktual:'180°',              hib:'sp' },
  bf3:   { f:'BF₃',   nama:'Boron trifluorida',      c:'B',  lig:['F','F','F'],   geo:'trig',   lp:[],      axe:'AX₃',   bentuk:'segitiga planar',        ideal:'120°',          aktual:'120°',              hib:'sp²' },
  so2:   { f:'SO₂',   nama:'Belerang dioksida',      c:'S',  lig:['O','O'],       geo:'trig',   lp:[2],     axe:'AX₂E',  bentuk:'bengkok (V)',            ideal:'120°',          aktual:'≈ 119°',            hib:'sp²', grp:[[[0,1],[0,1],119]] },
  ch4:   { f:'CH₄',   nama:'Metana',                 c:'C',  lig:['H','H','H','H'], geo:'tetra', lp:[],     axe:'AX₄',   bentuk:'tetrahedral',            ideal:'109,5°',        aktual:'109,5°',            hib:'sp³' },
  nh3:   { f:'NH₃',   nama:'Amonia',                 c:'N',  lig:['H','H','H'],   geo:'tetra',  lp:[3],     axe:'AX₃E',  bentuk:'piramida trigonal',      ideal:'109,5°',        aktual:'≈ 107°',            hib:'sp³', grp:[[[0,1,2],[0,1],107]] },
  h2o:   { f:'H₂O',   nama:'Air',                    c:'O',  lig:['H','H'],       geo:'tetra',  lp:[2,3],   axe:'AX₂E₂', bentuk:'bengkok (V)',            ideal:'109,5°',        aktual:'≈ 104,5°',          hib:'sp³', grp:[[[0,1],[0,1],104.5]] },
  pcl5:  { f:'PCl₅',  nama:'Fosfor pentaklorida',    c:'P',  lig:['Cl','Cl','Cl','Cl','Cl'], geo:'tbp', lp:[], axe:'AX₅',   bentuk:'bipiramida trigonal',    ideal:'90° dan 120°',  aktual:'90° dan 120°',      hib:'sp³d' },
  sf4:   { f:'SF₄',   nama:'Belerang tetrafluorida', c:'S',  lig:['F','F','F','F'], geo:'tbp',  lp:[2],     axe:'AX₄E',  bentuk:'jungkat-jungkit (seesaw)', ideal:'90° dan 120°', aktual:'≈ 173° dan ≈ 102°', hib:'sp³d', grp:[[[0,1],[0,1],101.6],[[2,3],[2,3],173.1]] },
  clf3:  { f:'ClF₃',  nama:'Klorin trifluorida',     c:'Cl', lig:['F','F','F'],   geo:'tbp',    lp:[1,2],   axe:'AX₃E₂', bentuk:'bentuk T',               ideal:'90°',           aktual:'≈ 87,5°',           hib:'sp³d', grp:[[[1,2],[0,1],87.5]] },
  xef2:  { f:'XeF₂',  nama:'Xenon difluorida',       c:'Xe', lig:['F','F'],       geo:'tbp',    lp:[0,1,2], axe:'AX₂E₃', bentuk:'linear',                 ideal:'180°',          aktual:'180°',              hib:'sp³d' },
  sf6:   { f:'SF₆',   nama:'Belerang heksafluorida', c:'S',  lig:['F','F','F','F','F','F'], geo:'oct', lp:[], axe:'AX₆',  bentuk:'oktahedral',             ideal:'90°',           aktual:'90°',               hib:'sp³d²' },
  brf5:  { f:'BrF₅',  nama:'Brom pentafluorida',     c:'Br', lig:['F','F','F','F','F'], geo:'oct', lp:[4],   axe:'AX₅E',  bentuk:'piramida segi empat',    ideal:'90°',           aktual:'≈ 85°',             hib:'sp³d²', grp:[[[0,1,2,3],[4,0],84.8]] },
  xef4:  { f:'XeF₄',  nama:'Xenon tetrafluorida',    c:'Xe', lig:['F','F','F','F'], geo:'oct',  lp:[4,5],   axe:'AX₄E₂', bentuk:'segi empat planar',      ideal:'90°',           aktual:'90°',               hib:'sp³d²' },
  co2:   { f:'CO₂',   nama:'Karbon dioksida',        c:'C',  lig:['O','O'],       geo:'linear', lp:[],      axe:'AX₂',   bentuk:'linear',                 ideal:'180°',          aktual:'180°',              hib:'sp' },
  chcl3: { f:'CHCl₃', nama:'Kloroform',              c:'C',  lig:['H','Cl','Cl','Cl'], geo:'tetra', lp:[],  axe:'AX₄',   bentuk:'tetrahedral',            ideal:'109,5°',        aktual:'≈ 109,5°',          hib:'sp³' },
  ccl4:  { f:'CCl₄',  nama:'Karbon tetraklorida',    c:'C',  lig:['Cl','Cl','Cl','Cl'], geo:'tetra', lp:[], axe:'AX₄',   bentuk:'tetrahedral',            ideal:'109,5°',        aktual:'109,5°',            hib:'sp³' }
};
const V_IDS = ['becl2','bf3','so2','ch4','nh3','h2o','pcl5','sf4','clf3','xef2','sf6','brf5','xef4'];
const H_IDS = ['becl2','bf3','ch4','nh3','h2o','pcl5','sf6'];
const P_IDS = ['co2','so2','bf3','nh3','h2o','ch4','chcl3','ccl4','sf4','xef2'];
const AXE_TABEL = { '2,0':'becl2','3,0':'bf3','2,1':'so2','4,0':'ch4','3,1':'nh3','2,2':'h2o','5,0':'pcl5','4,1':'sf4','3,2':'clf3','2,3':'xef2','6,0':'sf6','5,1':'brf5','4,2':'xef4' };
const HB = {
  becl2: { n:2, s:2, p:[0,0,0], d:[],    ps:1, pp:[1,0,0], pd:[],    hy:'sp',    hE:[1,1] },
  bf3:   { n:2, s:2, p:[1,0,0], d:[],    ps:1, pp:[1,1,0], pd:[],    hy:'sp²',   hE:[1,1,1] },
  ch4:   { n:2, s:2, p:[1,1,0], d:[],    ps:1, pp:[1,1,1], pd:[],    hy:'sp³',   hE:[1,1,1,1] },
  nh3:   { n:2, s:2, p:[1,1,1], d:[],    ps:2, pp:[1,1,1], pd:[],    hy:'sp³',   hE:[2,1,1,1] },
  h2o:   { n:2, s:2, p:[2,1,1], d:[],    ps:2, pp:[2,1,1], pd:[],    hy:'sp³',   hE:[2,2,1,1] },
  pcl5:  { n:3, s:2, p:[1,1,1], d:[0],   ps:1, pp:[1,1,1], pd:[1],   hy:'sp³d',  hE:[1,1,1,1,1] },
  sf6:   { n:3, s:2, p:[2,1,1], d:[0,0], ps:1, pp:[1,1,1], pd:[1,1], hy:'sp³d²', hE:[1,1,1,1,1,1] }
};
const SUPN = { '0':'⁰','1':'¹','2':'²','3':'³','4':'⁴','5':'⁵','6':'⁶' };
const TAHAP = ['Dasar','Promosi','Hibrida','Ikatan'];
const LAB_MODE = [ { id:'v', nama:'VSEPR 3D' }, { id:'h', nama:'Hibridisasi' }, { id:'p', nama:'Kepolaran' } ];
const POOL_BENTUK = ['linear','segitiga planar','tetrahedral','bengkok (V)','piramida trigonal','bipiramida trigonal','jungkat-jungkit (seesaw)','bentuk T','oktahedral','piramida segi empat','segi empat planar'];

const labS = {
  mode:'v',
  v:{ mol:'nh3', custom:null }, vSeen:[], vLast:null,
  h:{ mol:'ch4', stage:0 }, hFlag:{},
  p:{ mol:'co2' }, pSeen:[],
  cam:{ yaw:0.35, pitch:-0.22, auto:true, drag:false }, dirty:true,
  mikro:false, catatNo:0,
  misi:[false,false,false,false,false], skor:0, m2key:'', m2opt:null, m3opt:null, m4key:'', m4opt:null, m1opt:null, m5opt:null
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
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const angDeg = (a, b) => Math.acos(labKlem(dot(nrm(a), nrm(b)), -1, 1)) * 180 / Math.PI;
const addV = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
const mulV = (a, k) => [a[0] * k, a[1] * k, a[2] * k];

/* ---------- Geometri molekul ---------- */
const _geo = {};
function geometri(key){
  if (_geo[key]) return _geo[key];
  const M = MOL[key], D = DIRS[M.geo];
  const bonded = D.map((_, i) => i).filter(i => !M.lp.includes(i));
  let vb = bonded.map(i => D[i].slice());
  if (M.lp.length && M.grp) {
    let u = [0, 0, 0]; M.lp.forEach(i => { u = addV(u, D[i]); }); u = nrm(u);
    M.grp.forEach(([bonds, pr, tgt]) => {
      let lo = 0, hi = 1.5;
      for (let it = 0; it < 60; it++) {
        const mid = (lo + hi) / 2;
        const v2 = vb.map((v, i) => bonds.includes(i) ? nrm(addV(v, mulV(u, -mid))) : v);
        if (angDeg(v2[pr[0]], v2[pr[1]]) > tgt) lo = mid; else hi = mid;
      }
      const k = (lo + hi) / 2;
      vb = vb.map((v, i) => bonds.includes(i) ? nrm(addV(v, mulV(u, -k))) : v);
    });
  }
  return (_geo[key] = { vb, lp:M.lp.map(i => D[i].slice()), lig:M.lig, c:M.c, all:vb.concat(M.lp.map(i => D[i])) });
}
function vKey(){
  const V = labS.v;
  if (V.custom) return AXE_TABEL[V.custom.x + ',' + V.custom.e] || null;
  return V.mol;
}

/* ---------- Mesin 3D ---------- */
function rot(p, yaw, pitch){
  const x1 = p[0] * Math.cos(yaw) + p[2] * Math.sin(yaw), z1 = -p[0] * Math.sin(yaw) + p[2] * Math.cos(yaw);
  return [x1, p[1] * Math.cos(pitch) - z1 * Math.sin(pitch), p[1] * Math.sin(pitch) + z1 * Math.cos(pitch)];
}
function proj(p){ const s = FOC / (FOC + p[2]); return { x:CX + p[0] * s, y:CY - p[1] * s, s, z:p[2] }; }
function P3(v, k){ const c = labS.cam; return proj(rot(mulV(v, k), c.yaw, c.pitch)); }
function ensureGrad(el){
  const id = 'g_' + el;
  if ($L(id)) return id;
  const g = svEl('radialGradient', { id:id, cx:'35%', cy:'30%', r:'75%' }, $L('gdefs'));
  const col = WARNA[el] || '#9CC2F5';
  svEl('stop', { offset:0, 'stop-color':'#ffffff', 'stop-opacity':.95 }, g); svEl('stop', { offset:.35, 'stop-color':col }, g); svEl('stop', { offset:1, 'stop-color':col, 'stop-opacity':.78 }, g);
  return id;
}
function itemAtom(items, p, el, f){ items.push({ t:'atom', z:p.z + 0.1, x:p.x, y:p.y, r:(JARI[el] || 14) * SZ * p.s * (f || 1), el:el }); }
function itemBond(items, p0, p1, w){ items.push({ t:'bond', z:(p0.z + p1.z) / 2, x0:p0.x, y0:p0.y, x1:p1.x, y1:p1.y, w:w || 5 }); }
function itemLobe(items, p0, p1, w, col, op, z, extra){
  items.push(Object.assign({ t:'lobe', z:z === undefined ? (p0.z + p1.z) / 2 : z, x0:p0.x, y0:p0.y, x1:p1.x, y1:p1.y, w:w * SZ * ((p0.s + p1.s) / 2), col:col, op:op }, extra || {}));
}
function itemArrow(items, p0, p1, col, w, hs, z){ items.push({ t:'arrow', z:z === undefined ? Math.min(p0.z, p1.z) - 5 : z, x0:p0.x, y0:p0.y, x1:p1.x, y1:p1.y, col:col, w:w, hs:hs }); }
function itemText(items, p, txt, col, z){ items.push({ t:'txt', z:z === undefined ? p.z - 9 : z, x:p.x, y:p.y, txt:txt, col:col }); }
function drawItem(it, g){
  if (it.t === 'bond') {
    svEl('line', { x1:it.x0, y1:it.y0, x2:it.x1, y2:it.y1, stroke:'#7B8AA6', 'stroke-width':it.w + 2, 'stroke-linecap':'round' }, g);
    svEl('line', { x1:it.x0, y1:it.y0, x2:it.x1, y2:it.y1, stroke:'#DDE5F4', 'stroke-width':it.w - 1, 'stroke-linecap':'round' }, g);
  } else if (it.t === 'atom') {
    svEl('circle', { cx:it.x, cy:it.y, r:it.r, fill:'url(#' + ensureGrad(it.el) + ')', stroke:'rgba(14,34,64,.55)', 'stroke-width':1.2 }, g);
    const t = svEl('text', { x:it.x, y:it.y + it.r * 0.28, 'text-anchor':'middle', 'font-size':Math.max(9, it.r * 0.72), 'font-weight':800, fill:GELAP.includes(it.el) ? '#0E2240' : '#fff', 'font-family':'Figtree,Arial,sans-serif' }, g);
    t.textContent = it.el;
  } else if (it.t === 'lobe') {
    const dx = it.x1 - it.x0, dy = it.y1 - it.y0, L = Math.hypot(dx, dy), a = Math.atan2(dy, dx) * 180 / Math.PI;
    const ry = it.w, rx = Math.max(L / 2, ry * 0.85), cx = (it.x0 + it.x1) / 2, cy = (it.y0 + it.y1) / 2;
    svEl('ellipse', { cx:cx, cy:cy, rx:rx, ry:ry, transform:'rotate(' + a + ' ' + cx + ' ' + cy + ')', fill:it.col, 'fill-opacity':it.op, stroke:it.col, 'stroke-opacity':.9, 'stroke-width':1.4 }, g);
    if (it.pair) { svEl('circle', { cx:cx - 4, cy:cy, r:2.6, fill:'#7A5200' }, g); svEl('circle', { cx:cx + 4, cy:cy, r:2.6, fill:'#7A5200' }, g); }
  } else if (it.t === 'arrow') {
    const dx = it.x1 - it.x0, dy = it.y1 - it.y0, L = Math.hypot(dx, dy) || 1, ux = dx / L, uy = dy / L, hs = it.hs;
    svEl('line', { x1:it.x0, y1:it.y0, x2:it.x1 - ux * hs * 0.6, y2:it.y1 - uy * hs * 0.6, stroke:it.col, 'stroke-width':it.w, 'stroke-linecap':'round' }, g);
    svEl('polygon', { points:it.x1 + ',' + it.y1 + ' ' + (it.x1 - ux * hs - uy * hs * .55) + ',' + (it.y1 - uy * hs + ux * hs * .55) + ' ' + (it.x1 - ux * hs + uy * hs * .55) + ',' + (it.y1 - uy * hs - ux * hs * .55), fill:it.col }, g);
  } else if (it.t === 'txt') {
    const t = svEl('text', { x:it.x, y:it.y, 'text-anchor':'middle', 'font-size':10.5, 'font-weight':800, fill:it.col, 'font-family':'Figtree,sans-serif', stroke:'#0E2240', 'stroke-width':3, 'paint-order':'stroke' }, g);
    t.textContent = it.txt;
  }
}
function render3D(){
  const g = $L('g3d'); g.innerHTML = '';
  const items = labS.mode === 'v' ? itemsV() : (labS.mode === 'h' ? itemsH() : itemsP());
  items.sort((a, b) => b.z - a.z).forEach(it => drawItem(it, g));
  labS.dirty = false;
}
function atomPusat(items, key, f){
  const c = labS.cam, p0 = proj(rot([0, 0, 0], c.yaw, c.pitch));
  items.push({ t:'atom', z:p0.z, x:p0.x, y:p0.y, r:(JARI[key] || 18) * SZ * 1.15 * (f || 1), el:key });
}
function dasarMolekul(items, G, opts){
  const mk = labS.mikro;
  G.vb.forEach((v, i) => {
    const p = P3(v, BL);
    itemBond(items, P3([0, 0, 0], 0), p, 5);
    itemAtom(items, p, G.lig[i], 1);
    if (mk) { const m = P3(v, BL * 0.5); itemText(items, { x:m.x, y:m.y - 7, z:m.z }, 'PEI', '#9CC2F5'); }
  });
  if (opts.lp) G.lp.forEach(v => {
    itemLobe(items, P3([0, 0, 0], 0), P3(v, BL * 0.72), 17, '#FFE29A', 0.6, undefined, { pair:true });
    if (mk) { const m = P3(v, BL * 0.9); itemText(items, { x:m.x, y:m.y - 10, z:m.z }, 'PEB', '#FFE29A'); }
  });
}
function itemsV(){
  const items = [], k = vKey();
  if (!k) return items;
  const G = geometri(k), M = MOL[k];
  const custom = !!labS.v.custom;
  const G2 = custom ? Object.assign({}, G, { lig:G.lig.map(() => 'X') }) : G;
  dasarMolekul(items, G2, { lp:true });
  atomPusat(items, custom ? 'A' : M.c, 1);
  return items;
}

/* ---------- Hibridisasi (3D) ---------- */
function itemsH(){
  const items = [], H = labS.h, G = geometri(H.mol), M = MOL[H.mol], st = H.stage, mk = labS.mikro;
  const O = P3([0, 0, 0], 0);
  if (st <= 1) {
    items.push({ t:'lobe', z:O.z + 40, x0:O.x, y0:O.y, x1:O.x, y1:O.y, w:34 * O.s, col:'#FFE29A', op:0.28 });
    const eks = [[[1,0,0], 'px'], [[0,1,0], 'py'], [[0,0,1], 'pz']];
    eks.forEach(([v, nm]) => {
      [1, -1].forEach(sg => {
        const p = P3(mulV(v, sg), BL * 0.62);
        itemLobe(items, O, p, 13, sg > 0 ? '#2E9BD6' : '#E8453C', 0.5, p.z + 1);
      });
      if (mk) { const m = P3(v, BL * 0.78); itemText(items, { x:m.x, y:m.y, z:m.z }, nm, '#AEC0E0'); }
    });
    if (mk) itemText(items, { x:O.x, y:O.y - 40 * O.s, z:O.z - 80 }, 's', '#FFE29A');
  } else {
    G.all.forEach((v, i) => {
      const lpIdx = i >= G.vb.length, col = lpIdx ? '#FFE29A' : LOBE[i % 6];
      const pe = P3(v, BL * 0.9), pb = P3(v, -BL * 0.26);
      itemLobe(items, O, pe, 17, col, lpIdx ? 0.6 : 0.5, pe.z - 0.2, { pair:lpIdx });
      itemLobe(items, O, pb, 8, col, 0.4, pb.z);
      if (mk) { const m = P3(v, BL * 0.62); itemText(items, { x:m.x, y:m.y - 12, z:m.z }, lpIdx ? 'PEB' : M.hib, lpIdx ? '#FFE29A' : '#fff'); }
    });
    if (st >= 3) G.vb.forEach((v, i) => { const p = P3(v, BL * 1.08); itemAtom(items, p, G.lig[i], 0.85); });
  }
  atomPusat(items, M.c, st <= 1 ? 0.8 : 0.7);
  return items;
}

/* ---------- Kepolaran (3D) ---------- */
function dipolMol(key){
  const G = geometri(key), c = MOL[key].c;
  let net = [0, 0, 0]; const vs = [];
  G.vb.forEach((v, i) => { const d = CHI[G.lig[i]] - CHI[c]; vs.push({ v:v, d:d, lig:G.lig[i] }); net = addV(net, mulV(v, d)); });
  return { vs:vs, net:net, mag:Math.hypot(net[0], net[1], net[2]) };
}
function itemsP(){
  const items = [], key = labS.p.mol, G = geometri(key), M = MOL[key], D = dipolMol(key);
  dasarMolekul(items, G, { lp:true });
  atomPusat(items, M.c, 1);
  D.vs.forEach(b => {
    let s0 = BL * 0.34, e0 = BL * 0.34 + 24 * Math.abs(b.d) + 8;
    if (b.d < 0) { const t = s0; s0 = e0; e0 = t; }
    itemArrow(items, P3(b.v, s0), P3(b.v, e0), '#FF5A4A', 3.5, 8, -400);
  });
  if (D.mag > 0.05) { const u = nrm(D.net); itemArrow(items, P3([0, 0, 0], 0), P3(u, 26 * D.mag + 30), '#FFB27A', 6, 13, -420); }
  return items;
}

/* ---------- Navigasi ---------- */
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
  b.textContent = '🔬 Mode Label: ' + (labS.mikro ? 'hidup' : 'mati');
  if (labS.mikro) labToast('🔬 Label PEI, PEB, dan orbital ditampilkan.');
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
function labGantiMode(id){ labS.mode = id; labCatatLihat(); labRender(); }
function labRenderPanel(){
  const gm = $L('grid-mode'); gm.innerHTML = '';
  LAB_MODE.forEach(m => labChip(gm, m.nama, '', labS.mode === m.id, () => labGantiMode(m.id)));
  $L('rakit-dyn').innerHTML = '';
  const rb = $L('run-btn');
  if (labS.mode === 'v') {
    const V = labS.v;
    const g1 = labSec('🧪 Molekul contoh', '', 'rx-grid cols5');
    V_IDS.forEach(id => labChip(g1, MOL[id].f, '', !V.custom && V.mol === id, () => labVPilih(id)));
    const cur = V.custom || (() => { const M = MOL[V.mol]; return { x:M.lig.length, e:M.lp.length }; })();
    const g2 = labSec('⚛️ Rakit: PEI (X)', 'pasangan ikatan', 'rx-grid cols5');
    [2, 3, 4, 5, 6].forEach(x => labChip(g2, String(x), '', V.custom && cur.x === x, () => labVRakit('x', x, cur)));
    const g3 = labSec('✨ Rakit: PEB (E)', 'pasangan bebas', 'rx-grid cols4');
    [0, 1, 2, 3].forEach(e => labChip(g3, String(e), '', V.custom && cur.e === e, () => labVRakit('e', e, cur)));
    rb.style.display = 'none';
  } else if (labS.mode === 'h') {
    const H = labS.h;
    const g1 = labSec('🧪 Molekul', '', 'rx-grid cols4');
    H_IDS.forEach(id => labChip(g1, MOL[id].f, '', H.mol === id, () => labHPilih('mol', id)));
    const g2 = labSec('🪜 Tahap', '', 'rx-grid cols4');
    TAHAP.forEach((t, i) => labChip(g2, t, String(i + 1), H.stage === i, () => labHPilih('stage', i)));
    rb.style.display = ''; rb.disabled = false; rb.textContent = H.stage >= 3 ? '↺ Ulangi dari tahap 1' : '▶ Tahap berikutnya';
  } else {
    const g1 = labSec('🧪 Molekul', '', 'rx-grid cols5');
    P_IDS.forEach(id => labChip(g1, MOL[id].f, '', labS.p.mol === id, () => labPPilih(id)));
    rb.style.display = 'none';
  }
  const gt = labSec('🎥 Tampilan', '', 'rx-grid cols2');
  labChip(gt, '🔄 Putar otomatis', labS.cam.auto ? 'hidup' : 'mati', labS.cam.auto, () => { labS.cam.auto = !labS.cam.auto; labRender(); }, true);
  labChip(gt, '↺ Reset sudut', 'pandangan awal', false, () => { labS.cam.yaw = 0.35; labS.cam.pitch = -0.22; labS.dirty = true; }, true);
}

/* ---------- VSEPR ---------- */
function labCatatLihat(){
  if (labS.mode === 'v') { const k = vKey(); if (k) { if (!labS.vSeen.includes(k)) labS.vSeen.push(k); labS.vLast = k; } }
  if (labS.mode === 'p') { if (!labS.pSeen.includes(labS.p.mol)) labS.pSeen.push(labS.p.mol); }
  if (labS.mode === 'h' && labS.h.stage >= 2) labS.hFlag[labS.h.mol] = true;
}
function labVPilih(id){ labS.v.mol = id; labS.v.custom = null; labCatatLihat(); labRender(); }
function labVRakit(k, v, cur){
  const c = { x:cur.x, e:cur.e }; c[k] = v;
  labS.v.custom = c; labCatatLihat(); labRender();
}
function vDraw(){
  const V = labS.v, k = vKey(), rows = $L('vRows'), dots = $L('vDots');
  rows.innerHTML = ''; dots.innerHTML = '';
  const cur = V.custom || { x:MOL[V.mol].lig.length, e:MOL[V.mol].lp.length };
  if (!k) {
    $L('vNot').textContent = 'AX' + (cur.x > 1 ? ({ 2:'₂',3:'₃',4:'₄',5:'₅',6:'₆' }[cur.x] || '') : '') + (cur.e > 0 ? 'E' + (cur.e > 1 ? ({ 2:'₂',3:'₃' }[cur.e]) : '') : '');
    $L('vBent').textContent = 'susunan tidak ada';
    $L('vWarn').textContent = cur.x + cur.e > 6 ? 'Domain melebihi 6: tidak dikenal pada materi ini.' : 'Kombinasi PEI dan PEB ini tidak membentuk geometri stabil.';
    $L('lPillT').textContent = 'tidak tersedia'; $L('vInfo').textContent = 'Ubah jumlah PEI atau PEB.';
    const st0 = $L('lab-status'); st0.textContent = 'Susunan tidak valid'; st0.className = 'lab-status off';
    return;
  }
  const M = MOL[k], dom = M.lig.length + M.lp.length;
  $L('vWarn').textContent = ' ';
  $L('vNot').textContent = M.axe; $L('vBent').textContent = M.bentuk;
  const R = [['PEI (ikatan)', M.lig.length], ['PEB (bebas)', M.lp.length], ['Domain elektron', dom], ['Geometri domain', GEO_NAMA[M.geo]], ['Sudut ideal', M.ideal], ['Sudut aktual', M.aktual], ['Hibridisasi', M.hib], [V.custom ? 'Contoh' : 'Nama', V.custom ? M.f + ' (' + M.nama + ')' : M.nama]];
  R.forEach((r, i) => {
    const y = 184 + i * 24;
    const a = svEl('text', { x:392, y:y, 'font-size':11.5, 'font-weight':700, fill:'#AEC0E0', 'font-family':'Figtree,sans-serif' }, rows); a.textContent = r[0];
    const b = svEl('text', { x:696, y:y, 'text-anchor':'end', 'font-size':12.5, 'font-weight':800, fill:i === 5 ? '#FFB27A' : '#fff', 'font-family':'Figtree,sans-serif' }, rows); b.textContent = r[1];
  });
  for (let i = 0; i < M.lig.length; i++) svEl('circle', { cx:402 + i * 18, cy:384, r:6, fill:'#9CC2F5', stroke:'#fff', 'stroke-width':1.5 }, dots);
  for (let i = 0; i < M.lp.length; i++) svEl('circle', { cx:402 + (M.lig.length + i) * 18, cy:384, r:6, fill:'#FFE29A', stroke:'#B27A00', 'stroke-width':1.5 }, dots);
  const t = svEl('text', { x:696, y:388, 'text-anchor':'end', 'font-size':10.5, 'font-weight':700, fill:'#AEC0E0', 'font-family':'Figtree,sans-serif' }, dots); t.textContent = '● PEI   ● PEB';
  $L('lPillT').textContent = V.custom ? 'Rakitan · ' + M.axe : M.f + ' · ' + M.axe;
  $L('vInfo').textContent = M.lp.length ? 'PEB menolak lebih kuat: sudut ikatan mengecil' : 'Tanpa PEB: sudut mengikuti geometri domain';
  const st = $L('lab-status'); st.textContent = M.bentuk; st.className = 'lab-status on';
}

/* ---------- Hibridisasi ---------- */
function labHPilih(k, v){ labS.h[k] = v; if (k === 'mol') labS.h.stage = Math.min(labS.h.stage, 3); labCatatLihat(); labRender(); }
function labHNext(){ const H = labS.h; H.stage = H.stage >= 3 ? 0 : H.stage + 1; labCatatLihat(); labRender(); }
function hKotak(g, x, y, e, w, h, warna, hl, lp){
  svEl('rect', { x:x, y:y, width:w, height:h, rx:5, fill:'#fff', stroke:hl ? '#F26A21' : '#0E2240', 'stroke-width':hl ? 3 : 2.2 }, g);
  const put = (dx, ch, col) => { const t = svEl('text', { x:x + w / 2 + dx, y:y + h * 0.72, 'text-anchor':'middle', 'font-size':h * 0.7, 'font-weight':800, fill:col, 'font-family':'Figtree,sans-serif' }, g); t.textContent = ch; };
  if (e === 1) put(0, '↑', warna || '#F26A21');
  if (e === 2) { put(-6, '↑', warna || '#F26A21'); put(6, '↓', lp ? (warna || '#B27A00') : '#2E6BB3'); }
}
function hDraw(){
  const H = labS.h, M = MOL[H.mol], D = HB[H.mol], g = $L('hOrb'), steps = $L('hSteps');
  g.innerHTML = ''; steps.innerHTML = '';
  const st = H.stage, n = D.n, nL = M.lp.length, nX = M.lig.length;
  TAHAP.forEach((t, i) => {
    const x = 410 + i * 86;
    svEl('circle', { cx:x, cy:100, r:11, fill:i <= st ? '#F26A21' : 'rgba(255,255,255,.14)', stroke:i === st ? '#fff' : 'none', 'stroke-width':2 }, steps);
    const a = svEl('text', { x:x, y:104, 'text-anchor':'middle', 'font-size':11, 'font-weight':800, fill:'#fff', 'font-family':'Figtree,sans-serif' }, steps); a.textContent = i + 1;
    const b = svEl('text', { x:x, y:124, 'text-anchor':'middle', 'font-size':10, 'font-weight':800, fill:i === st ? '#FFB27A' : '#8FA3C7', 'font-family':'Figtree,sans-serif' }, steps); b.textContent = t;
    if (i < 3) svEl('line', { x1:x + 14, y1:100, x2:x + 72, y2:100, stroke:i < st ? '#F26A21' : 'rgba(255,255,255,.2)', 'stroke-width':2 }, steps);
  });
  const sh = (c, nn) => nn + c;
  const lab = (x, y, txt, col, sz, anchor) => { const t = svEl('text', { x:x, y:y, 'text-anchor':anchor || 'start', 'font-size':sz || 12, 'font-weight':800, fill:col || '#AEC0E0', 'font-family':'Figtree,sans-serif' }, g); t.textContent = txt; };
  const W = 38, Ht = 34, gap = 6;
  const rowD = D.d.length, yD = 150, yP = rowD ? 214 : 190, yS = rowD ? 280 : 262;
  const sP = st === 0 ? D.s : D.ps, pP = st === 0 ? D.p : D.pp, dP = st === 0 ? D.d : D.pd;
  if (st <= 1) {
    const hlP = (i) => st === 1 && D.ps !== D.s && pP[i] > D.p[i];
    lab(392, yS + 22, n + 's', '#AEC0E0'); hKotak(g, 440, yS, sP, W, Ht, '#F26A21', false);
    lab(392, yP + 22, n + 'p', '#AEC0E0'); pP.forEach((e, i) => hKotak(g, 440 + i * (W + gap), yP, e, W, Ht, '#F26A21', hlP(i)));
    if (rowD) { lab(392, yD + 22, n + 'd', '#AEC0E0'); dP.forEach((e, i) => hKotak(g, 440 + i * (W + gap), yD, e, W, Ht, '#F26A21', st === 1 && e > D.d[i])); }
    if (st === 1 && D.ps !== D.s) {
      const tx = 440 + 3 * (W + gap) + 12;
      svEl('path', { d:'M' + (440 + W / 2) + ',' + (yS - 2) + ' C' + (440 + W / 2) + ',' + (yP + 80) + ' ' + (tx - 40) + ',' + (yP + 90) + ' ' + (tx - 40) + ',' + (yP + Ht + 6), fill:'none', stroke:'#F26A21', 'stroke-width':3, 'stroke-dasharray':'5 4' }, g);
      lab(tx + 6, (yS + yP) / 2 + 18, 'promosi', '#FFB27A', 11);
    }
  } else {
    const nh = D.hE.length, tot = nh * (W + gap) - gap, x0 = 544 - tot / 2, yH = st === 3 ? 170 : 210;
    lab(392, yH + 22, D.hy, '#4ADE80', 14);
    D.hE.forEach((e, i) => {
      const lp = e === 2 && i < nL;
      if (st === 3 && !lp) { hKotak(g, x0 + i * (W + gap), yH, 1, W, Ht, '#F26A21', false); const t2 = svEl('text', { x:x0 + i * (W + gap) + W / 2 + 7, y:yH + Ht * 0.72, 'text-anchor':'middle', 'font-size':Ht * 0.7, 'font-weight':800, fill:'#2E6BB3', 'font-family':'Figtree,sans-serif' }, g); t2.textContent = ''; }
      else hKotak(g, x0 + i * (W + gap), yH, e, W, Ht, lp ? '#B27A00' : '#F26A21', false, lp);
      if (st === 3 && !lp) {
        const t = svEl('text', { x:x0 + i * (W + gap) + W / 2 + 7, y:yH + Ht * 0.72, 'text-anchor':'middle', 'font-size':Ht * 0.7, 'font-weight':800, fill:'#2E6BB3', 'font-family':'Figtree,sans-serif' }, g); t.textContent = '↓';
        svEl('line', { x1:x0 + i * (W + gap) + W / 2, y1:yH + Ht + 46, x2:x0 + i * (W + gap) + W / 2, y2:yH + Ht + 6, stroke:'#2E6BB3', 'stroke-width':2.5 }, g);
        svEl('rect', { x:x0 + i * (W + gap) + 4, y:yH + Ht + 46, width:W - 8, height:22, rx:5, fill:'#fff', stroke:'#2E6BB3', 'stroke-width':2 }, g);
        const t3 = svEl('text', { x:x0 + i * (W + gap) + W / 2, y:yH + Ht + 62, 'text-anchor':'middle', 'font-size':12, 'font-weight':800, fill:'#2E6BB3', 'font-family':'Figtree,sans-serif' }, g); t3.textContent = M.lig[Math.max(0, i - nL)];
      }
    });
    if (st === 3) lab(544, yH + Ht + 92, 'ikatan σ: tumpang tindih orbital hibrida dengan orbital ligan', '#AEC0E0', 10.5, 'middle');
    if (nL) lab(544, yH - 12, nL + ' orbital berisi PEB (sepasang elektron)', '#FFE29A', 10.5, 'middle');
  }
  const cfg = 'Konfigurasi valensi ' + M.c + ': ' + n + 's' + SUPN[D.s] + ' ' + n + 'p' + SUPN[D.p.reduce((a, b) => a + b, 0)] + (D.d.length ? ' ' + n + 'd⁰' : '');
  const tungg = (D.ps === D.s ? D.p : D.pp).concat(D.ps === D.s ? [] : []);
  const hitungTunggal = (s, p, d) => (s === 1 ? 1 : 0) + p.filter(e => e === 1).length + d.filter(e => e === 1).length;
  const teks = [
    [cfg, 'Elektron tunggal: ' + hitungTunggal(D.s, D.p, D.d) + ' (ikatan yang dibutuhkan: ' + nX + ')'],
    [D.ps !== D.s ? 'Satu elektron ' + n + 's dipromosikan ke orbital kosong' : 'Tidak perlu promosi', D.ps !== D.s ? 'Kini ada ' + hitungTunggal(D.ps, D.pp, D.pd) + ' elektron tunggal untuk membentuk ' + nX + ' ikatan' : 'Elektron tunggal sudah cukup untuk ' + nX + ' ikatan' + (nL ? ' (dan ' + nL + ' PEB)' : '')],
    ['Orbital s' + (D.p.length ? ' + p' : '') + (D.d.length ? ' + d' : '') + ' bercampur menjadi ' + D.hE.length + ' orbital ' + D.hy, 'Energinya setara dan arahnya mengikuti geometri ' + GEO_NAMA[M.geo]],
    ['Orbital hibrida + orbital ligan → ikatan σ', nL ? nL + ' orbital hibrida ditempati PEB, bentuk molekul ' + M.bentuk : 'Bentuk molekul: ' + M.bentuk + ', sudut ' + M.aktual]
  ][st];
  $L('hD1').textContent = teks[0]; $L('hD2').textContent = teks[1]; $L('hD3').textContent = '';
  $L('hTitle').textContent = 'DIAGRAM ORBITAL ' + M.f + ' · tahap ' + (st + 1) + ' dari 4';
  $L('lPillT').textContent = M.f + ' · atom pusat ' + M.c + ' · ' + M.hib;
  $L('hInfo').textContent = st >= 2 ? M.lig.length + nL + ' domain elektron → ' + M.hib : 'Ikuti keempat tahap hibridisasi';
  const s = $L('lab-status'); s.textContent = 'Tahap ' + (st + 1) + ': ' + TAHAP[st]; s.className = 'lab-status on';
}

/* ---------- Kepolaran ---------- */
function labPPilih(id){ labS.p.mol = id; labCatatLihat(); labRender(); }
function pDraw(){
  const key = labS.p.mol, M = MOL[key], D = dipolMol(key), rows = $L('pRows');
  rows.innerHTML = '';
  const add = (y, a, b, col) => {
    const t1 = svEl('text', { x:392, y:y, 'font-size':11.5, 'font-weight':700, fill:'#AEC0E0', 'font-family':'Figtree,sans-serif' }, rows); t1.textContent = a;
    const t2 = svEl('text', { x:696, y:y, 'text-anchor':'end', 'font-size':12, 'font-weight':800, fill:col || '#fff', 'font-family':'Figtree,sans-serif' }, rows); t2.textContent = b;
  };
  add(100, 'Atom pusat', M.c + ' (χ = ' + labNum(CHI[M.c], 2) + ')');
  const uniq = [...new Set(M.lig)];
  uniq.forEach((l, i) => { const d = CHI[l] - CHI[M.c]; add(124 + i * 24, 'Ikatan ' + M.c + '–' + l + ' (χ ' + l + ' = ' + labNum(CHI[l], 2) + ')', 'Δχ = ' + labNum(Math.abs(d), 2) + ' → ' + (d > 0 ? l : M.c), '#FF9A8A'); });
  add(124 + uniq.length * 24, 'Bentuk molekul', M.bentuk + (M.lp.length ? ' (ada ' + M.lp.length + ' PEB)' : ''));
  const pol = D.mag > 0.05;
  $L('pFill').setAttribute('width', (labKlem(D.mag / 3, 0, 1) * 304).toFixed(1));
  $L('pVal').textContent = labNum(D.mag, 2);
  $L('pVerd').textContent = pol ? 'POLAR' : 'NONPOLAR'; $L('pVerd').setAttribute('fill', pol ? '#FF9A8A' : '#4ADE80');
  const bedaLigan = uniq.length > 1;
  $L('pExp').textContent = pol ? 'Dipol ikatan tidak saling meniadakan' : 'Dipol ikatan saling meniadakan';
  $L('pExp2').textContent = pol ? (M.lp.length ? 'PEB membuat bentuk tidak simetris' : (bedaLigan ? 'Atom terikat tidak identik, dipol tidak seimbang' : 'Bentuk tidak simetris')) : 'Bentuk simetris, resultan dipol = 0';
  $L('lPillT').textContent = M.f + ' · ' + M.bentuk;
  $L('pInfo').textContent = 'Panah merah: dipol ikatan · panah oranye: resultan';
  const s = $L('lab-status'); s.textContent = pol ? 'Polar' : 'Nonpolar'; s.className = 'lab-status on';
}

/* ---------- Render ---------- */
function labRender(){
  const m = labS.mode;
  $L('scV').style.display = m === 'v' ? '' : 'none';
  $L('scH').style.display = m === 'h' ? '' : 'none';
  $L('scP').style.display = m === 'p' ? '' : 'none';
  labCatatLihat();
  labRenderPanel();
  if (m === 'v') vDraw(); if (m === 'h') hDraw(); if (m === 'p') pDraw();
  labS.dirty = true;
  labIsiData(); labRenderMisi();
}
function labJalankan(){ if (labS.mode === 'h') labHNext(); }

/* ---------- Interaksi 3D ---------- */
function labInitDrag(){
  const z = $L('dragZone'); if (!z) return;
  let sx = 0, sy = 0, d = false;
  z.addEventListener('pointerdown', e => { d = true; sx = e.clientX; sy = e.clientY; labS.cam.drag = true; try { z.setPointerCapture(e.pointerId); } catch (x) {} z.style.cursor = 'grabbing'; });
  z.addEventListener('pointermove', e => { if (!d) return; labS.cam.yaw += (e.clientX - sx) * 0.012; labS.cam.pitch = labKlem(labS.cam.pitch + (e.clientY - sy) * 0.012, -1.5, 1.5); sx = e.clientX; sy = e.clientY; labS.dirty = true; });
  const up = () => { d = false; labS.cam.drag = false; z.style.cursor = 'grab'; };
  z.addEventListener('pointerup', up); z.addEventListener('pointercancel', up);
}
setInterval(() => {
  if (!labAktif()) return;
  const c = labS.cam;
  if (c.auto && !c.drag) { c.yaw += 0.016; labS.dirty = true; }
  if (labS.dirty) render3D();
}, 40);

/* ---------- Tab Data ---------- */
function labIsiData(){
  const info = $L('d-info'), hit = $L('d-hitung'), it = $L('d-info-t'), ht = $L('d-hitung-t'), am = $L('d-amati');
  const a = [];
  if (labS.mode === 'v') {
    const k = vKey(), V = labS.v;
    it.textContent = '🧪 Susunan elektron'; ht.textContent = '🧮 Analisis VSEPR';
    if (!k) { info.innerHTML = '<div class="hasil-baris">Kombinasi ini tidak tersedia.</div>'; hit.innerHTML = ''; }
    else {
      const M = MOL[k], dom = M.lig.length + M.lp.length;
      info.innerHTML = '<div class="hasil-baris">' + (V.custom ? 'Susunan rakitan · contoh: ' + M.f + ' (' + M.nama + ')' : M.f + ' (' + M.nama + ')') + '<br>PEI = ' + M.lig.length + ' · PEB = ' + M.lp.length + ' · domain = ' + dom + '<br>Notasi: <b>' + M.axe + '</b></div>';
      hit.innerHTML = '<div class="hasil-baris">Geometri domain: <b>' + GEO_NAMA[M.geo] + '</b><br>Bentuk molekul: <b>' + M.bentuk + '</b><br>Sudut ideal: ' + M.ideal + '<br>Sudut aktual: <b>' + M.aktual + '</b><br>Hibridisasi: ' + M.hib + '</div>';
    }
    a.push('Domain elektron menentukan geometri, sedangkan posisi atom menentukan bentuk molekul.');
    a.push('Semakin banyak PEB, semakin kecil sudut ikatan karena PEB menolak lebih kuat.');
  } else if (labS.mode === 'h') {
    const H = labS.h, M = MOL[H.mol], D = HB[H.mol];
    it.textContent = '🧪 Atom pusat'; ht.textContent = '🧮 Hibridisasi';
    info.innerHTML = '<div class="hasil-baris">' + M.f + ' · atom pusat ' + M.c + '<br>' + M.axe + ' · domain = ' + (M.lig.length + M.lp.length) + '</div>';
    hit.innerHTML = '<div class="hasil-baris">Hibridisasi: <b>' + M.hib + '</b> (' + D.hE.length + ' orbital hibrida)<br>Geometri: ' + GEO_NAMA[M.geo] + '<br>Bentuk: ' + M.bentuk + '<br>Tahap: ' + (H.stage + 1) + ' (' + TAHAP[H.stage] + ')</div>';
    a.push('Jumlah orbital hibrida sama dengan jumlah domain elektron.');
    a.push('Pada NH₃ dan H₂O, sebagian orbital sp³ ditempati PEB.');
  } else {
    const key = labS.p.mol, M = MOL[key], D = dipolMol(key);
    it.textContent = '🧪 Molekul'; ht.textContent = '🧮 Resultan dipol';
    info.innerHTML = '<div class="hasil-baris">' + M.f + ' (' + M.nama + ')<br>Bentuk: ' + M.bentuk + '</div>';
    hit.innerHTML = '<div class="hasil-baris">Resultan dipol ≈ <b>' + labNum(D.mag, 2) + '</b> (satuan relatif)<br>Kesimpulan: <b>' + (D.mag > 0.05 ? 'polar' : 'nonpolar') + '</b></div><div class="lab-note">Dipol ikatan dihitung dari selisih keelektronegatifan Pauling; PEB tidak dimasukkan.</div>';
    a.push('Ikatan polar tidak otomatis membuat molekul polar.');
    a.push('Bentuk simetris dengan atom terikat identik menghasilkan resultan dipol nol.');
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
    { t:'PEB menolak lebih kuat daripada PEI, sehingga PEI terdorong mendekat', b:true },
    { t:'PEB tidak ikut menolak pasangan elektron lain', b:false },
    { t:'Atom O lebih besar daripada atom C', b:false },
    { t:'Ikatan O–H lebih panjang daripada ikatan C–H', b:false }]);
  labKuis('m1-quiz', labS.misi[0], 'Tolakan PEB lebih kuat daripada PEI, sehingga sudut mengecil.', labS.vSeen.includes('h2o'), 'Tampilkan H₂O pada VSEPR 3D.',
    'Geometri domain H₂O tetrahedral (109,5°), tetapi sudut H–O–H hanya sekitar 104,5°. Mengapa?', labS.m1opt, 'labJawabM1', 'm1', 'm1');
  // M2
  if (labS.vSeen.length >= 3 && labS.vLast && labS.m2key !== labS.vLast) {
    labS.m2key = labS.vLast;
    const M = MOL[labS.vLast], benar = M.bentuk;
    const salah = labAcak(POOL_BENTUK.filter(x => x !== benar)).slice(0, 3);
    labS.m2opt = labAcak([{ t:benar, b:true }].concat(salah.map(t => ({ t, b:false }))));
  }
  const L2 = labS.vLast ? MOL[labS.vLast] : null;
  labS.m2kuis = labKuis('m2-quiz', labS.misi[1], 'Bentuk molekul ditentukan dari PEI dan PEB.', labS.vSeen.length >= 3 && !!L2, 'Amati minimal 3 susunan berbeda.',
    L2 ? 'Atom pusat dengan ' + L2.lig.length + ' PEI dan ' + L2.lp.length + ' PEB (' + L2.axe + ') memiliki bentuk molekul ...' : '', labS.m2opt || [], 'labJawabM2', labS.m2key, labS.m2kuis);
  // M3
  if (!labS.m3opt) labS.m3opt = labAcak([
    { t:'Satu orbital 2s dan tiga orbital 2p bercampur menjadi 4 orbital sp³ yang setara', b:true },
    { t:'Empat orbital 2p bercampur menjadi 4 orbital sp³', b:false },
    { t:'Orbital 2s tidak dipakai sama sekali dalam ikatan', b:false },
    { t:'Karbon mengikat H dengan 2 orbital s dan 2 orbital p yang berbeda energi', b:false }]);
  labKuis('m3-quiz', labS.misi[2], 'Pencampuran 1 s + 3 p menghasilkan 4 orbital sp³ setara.', !!labS.hFlag.ch4, 'Tampilkan CH₄ sampai tahap 3 (Hibrida).',
    'Mengapa keempat ikatan C–H pada CH₄ identik?', labS.m3opt, 'labJawabM3', 'm3', 'm3');
  // M4
  const kun4 = labS.hFlag.nh3 ? 'nh3' : (labS.hFlag.h2o ? 'h2o' : null);
  if (kun4 && labS.m4key !== kun4) {
    labS.m4key = kun4;
    labS.m4opt = labAcak([
      { t:kun4 === 'nh3' ? 'Satu dari empat orbital sp³ ditempati PEB sehingga hanya 3 yang berikatan' : 'Dua dari empat orbital sp³ ditempati PEB sehingga hanya 2 yang berikatan', b:true },
      { t:'Atom pusat tidak berhibridisasi', b:false },
      { t:'Hibridisasinya sp² sehingga bentuknya datar', b:false },
      { t:'PEB membuat jumlah domain menjadi 3', b:false }]);
  }
  labS.m4kuis = labKuis('m4-quiz', labS.misi[3], 'PEB menempati orbital hibrida, sehingga bentuk molekul berbeda dari geometri domain.', !!kun4, 'Tampilkan NH₃ atau H₂O sampai tahap 3.',
    kun4 === 'h2o' ? 'H₂O berhibridisasi sp³ (4 domain), tetapi bentuknya bengkok, bukan tetrahedral. Mengapa?' : 'NH₃ berhibridisasi sp³ (4 domain), tetapi bentuknya piramida trigonal, bukan tetrahedral. Mengapa?', labS.m4opt || [], 'labJawabM4', labS.m4key, labS.m4kuis);
  // M5
  if (!labS.m5opt) labS.m5opt = labAcak([
    { t:'CO₂ linear sehingga dipol C=O saling meniadakan, sedangkan H₂O bengkok sehingga dipol O–H tidak saling meniadakan', b:true },
    { t:'Ikatan C=O nonpolar, ikatan O–H polar', b:false },
    { t:'CO₂ tidak memiliki ikatan polar', b:false },
    { t:'H₂O polar karena massanya lebih besar', b:false }]);
  labKuis('m5-quiz', labS.misi[4], 'Bentuk simetris meniadakan dipol, bentuk bengkok tidak.', labS.pSeen.includes('co2') && labS.pSeen.includes('h2o'), 'Tampilkan CO₂ dan H₂O pada Kepolaran.',
    'Ikatan C=O dan O–H sama-sama polar. Mengapa CO₂ nonpolar tetapi H₂O polar?', labS.m5opt, 'labJawabM5', 'm5', 'm5');
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
function labJawabM1(i){ labJawab('m1-quiz', labS.m1opt, i, 'm1-fb', 'Tepat! PEB menolak lebih kuat sehingga sudut mengecil.', 'Belum tepat. Bandingkan kekuatan tolakan PEB dan PEI.', 0, '🎉 Misi 1 selesai! Kamu memahami pengaruh PEB.'); }
function labJawabM2(i){ labJawab('m2-quiz', labS.m2opt, i, 'm2-fb', 'Benar! Bentuk molekul dilihat dari posisi atom, bukan PEB.', 'Belum tepat. Hitung PEI dan PEB, tentukan geometri domain, lalu abaikan PEB.', 1, '🎉 Misi 2 selesai! Kamu bisa meramalkan bentuk molekul.'); }
function labJawabM3(i){ labJawab('m3-quiz', labS.m3opt, i, 'm3-fb', 'Tepat! Empat orbital sp³ setara, masing-masing 1 elektron.', 'Belum tepat. Hibridisasi mencampur orbital s dan p menjadi orbital baru yang setara.', 2, '🎉 Misi 3 selesai! Kamu memahami orbital sp³.'); }
function labJawabM4(i){ labJawab('m4-quiz', labS.m4opt, i, 'm4-fb', 'Benar! PEB menempati orbital hibrida tetapi tidak membentuk ikatan.', 'Belum tepat. Hitung dulu domain elektron dan orbital yang ditempati PEB.', 3, '🎉 Misi 4 selesai! Kamu menghubungkan hibridisasi dan PEB.'); }
function labJawabM5(i){ labJawab('m5-quiz', labS.m5opt, i, 'm5-fb', 'Tepat! Kepolaran ditentukan oleh bentuk dan resultan dipol.', 'Belum tepat. Pikirkan arah vektor dipol pada masing-masing bentuk.', 4, '🎉 Misi 5 selesai! Kamu memahami kepolaran molekul.'); }

/* ---------- LKPD, reset, toast, selesai ---------- */
function labCatat(){
  labS.catatNo++;
  const item = document.createElement('div'); item.className = 'lab-log-item';
  let isi = '';
  if (labS.mode === 'v') { const k = vKey(); isi = k ? '<b>VSEPR</b> · ' + MOL[k].f + ' (' + MOL[k].axe + ')<br>Bentuk: ' + MOL[k].bentuk + ' · sudut ' + MOL[k].aktual + ' · ' + MOL[k].hib : '<b>VSEPR</b> · susunan tidak valid'; }
  else if (labS.mode === 'h') { const H = labS.h, M = MOL[H.mol]; isi = '<b>Hibridisasi</b> · ' + M.f + ' · tahap ' + (H.stage + 1) + ' (' + TAHAP[H.stage] + ')<br>Atom pusat ' + M.c + ': ' + M.hib + ', bentuk ' + M.bentuk; }
  else { const M = MOL[labS.p.mol], D = dipolMol(labS.p.mol); isi = '<b>Kepolaran</b> · ' + M.f + ' (' + M.bentuk + ')<br>Resultan dipol ≈ ' + labNum(D.mag, 2) + ' → ' + (D.mag > 0.05 ? 'polar' : 'nonpolar'); }
  item.innerHTML = '<b>No. ' + labS.catatNo + '</b> · ' + isi;
  const log = $L('lab-log'); log.insertBefore(item, log.firstChild);
  while (log.children.length > 10) log.removeChild(log.lastChild);
  labToast('📓 Pengamatan berhasil dicatat ke LKPD!');
}
function labReset(){
  labS.mode = 'v';
  labS.v = { mol:'nh3', custom:null }; labS.vSeen = []; labS.vLast = null;
  labS.h = { mol:'ch4', stage:0 }; labS.hFlag = {};
  labS.p = { mol:'co2' }; labS.pSeen = [];
  labS.cam.yaw = 0.35; labS.cam.pitch = -0.22;
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
  else if (s >= 60) kal = 'Bagus! Terus berlatih menganalisis bentuk molekul.';
  else kal = 'Ayo selesaikan semua misi untuk meraih skor penuh!';
  $L('lab-akhir-kal').textContent = kal;
  openModal('modal-lab'); sfx('win');
}

(function labInit(){
  if (!$L('scr-lab')) return;
  labInitDrag();
  labRender(); labUpdateMisiCount();
})();
