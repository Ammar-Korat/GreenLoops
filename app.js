/* ════════════════════════════════════════
   GreenLoop — app.js
   ════════════════════════════════════════ */

// ── DATA ──
const MATS = [
  { id: 'plastic', icon: '♻️', name: 'Plastic Bottles (PET)', rate: 8,  unit: 'EGP/kg' },
  { id: 'alum',    icon: '🥫', name: 'Aluminum Cans',         rate: 45, unit: 'EGP/kg' },
  { id: 'card',    icon: '📦', name: 'Cardboard',             rate: 6,  unit: 'EGP/kg' },
  { id: 'paper',   icon: '📄', name: 'Paper',                 rate: 4,  unit: 'EGP/kg' },
  { id: 'glass',   icon: '🍾', name: 'Glass',                 rate: 1.5,unit: 'EGP/kg' },
  { id: 'metal',   icon: '🔩', name: 'Scrap Metal',           rate: 20, unit: 'EGP/kg' },
];

const qty = {};
MATS.forEach(m => qty[m.id] = 0);

const POST_AUTH = [
  'screen-dashboard', 'screen-pickup', 'screen-payment',
  'screen-confirm', 'screen-impact', 'screen-support'
];

// ── ROUTING ──
function goTo(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  window.scrollTo(0, 0);
  document.getElementById('nav-bar').classList.toggle('show', POST_AUTH.includes(id));
  if (id === 'screen-dashboard') renderMats();
  if (id === 'screen-confirm')   updatePayout();
}

window.addEventListener('load', () => setTimeout(() => goTo('screen-s1'), 2700));

// ── SURVEY ──
function pickS1(el) {
  document.querySelectorAll('#s1-opts .s-card').forEach(c => c.classList.remove('active'));
  el.classList.add('active');
  document.getElementById('s1-next').disabled = false;
}

function pickS2(el) {
  document.querySelectorAll('#s2-opts .s-opt').forEach(c => c.classList.remove('active'));
  el.classList.add('active');
  document.getElementById('s2-next').disabled = false;
}

function toggleS3(el) {
  el.classList.toggle('active');
}

// ── AUTH TABS ──
function switchTab(t) {
  document.querySelectorAll('.auth-tab').forEach(tab => tab.classList.remove('active'));
  document.querySelectorAll('.auth-tab')[t === 'signup' ? 0 : 1].classList.add('active');
  document.getElementById('signup-form').style.display = t === 'signup' ? 'block' : 'none';
  document.getElementById('login-form').style.display  = t === 'login'  ? 'block' : 'none';
}

// ── UPLOAD ──
function handleUpload(input) {
  if (input.files && input.files[0]) {
    document.getElementById('file-name').textContent = input.files[0].name;
    document.getElementById('file-preview').classList.add('show');
  }
}

function clearFile() {
  document.getElementById('file-upload').value = '';
  document.getElementById('file-preview').classList.remove('show');
}

// ── MATERIALS ──
function renderMats() {
  document.getElementById('material-grid').innerHTML = MATS.map(m => `
    <div class="mat-card ${qty[m.id] > 0 ? 'has-qty' : ''}" id="mc-${m.id}">
      <div class="mat-icon">${m.icon}</div>
      <div class="mat-name">${m.name}</div>
      <div class="mat-rate">${m.rate} ${m.unit}</div>
      <div class="qty-row">
        <button class="qty-b" onclick="chQty('${m.id}',-1,event)">−</button>
        <div class="qty-val" id="qv-${m.id}">${qty[m.id]}</div>
        <button class="qty-b" onclick="chQty('${m.id}',1,event)">+</button>
      </div>
      <div class="qty-label">kg</div>
    </div>
  `).join('');
  calcSummary();
}

function chQty(id, d, e) {
  e.stopPropagation();
  qty[id] = Math.max(0, qty[id] + d);
  document.getElementById('qv-' + id).textContent = qty[id];
  document.getElementById('mc-' + id).classList.toggle('has-qty', qty[id] > 0);
  calcSummary();
}

function calcSummary() {
  let w = 0, v = 0;
  MATS.forEach(m => { w += qty[m.id]; v += qty[m.id] * m.rate; });
  document.getElementById('total-weight').textContent = w + ' kg';
  document.getElementById('total-value').textContent  = v.toFixed(0) + ' EGP';
}

function updatePayout() {
  let v = 0;
  MATS.forEach(m => v += qty[m.id] * m.rate);
  document.getElementById('confirm-payout').textContent = (v > 0 ? v.toFixed(0) : 215) + ' EGP';
}

// ── PICKUP ──
function pickPickup(type, el) {
  document.querySelectorAll('.p-opt').forEach(o => o.classList.remove('sel'));
  el.classList.add('sel');
  document.getElementById('p-pickup').classList.toggle('show',  type === 'pickup');
  document.getElementById('p-deliver').classList.toggle('show', type === 'deliver');
}

// ── PAYMENT ──
function pickPay(id, el) {
  document.querySelectorAll('.pm-card').forEach(c => c.classList.remove('sel'));
  document.querySelectorAll('.pm-fields').forEach(f => f.classList.remove('show'));
  el.classList.add('sel');
  document.getElementById('pf-' + id).classList.add('show');
}

// ── FAQ ──
function toggleFaq(el) {
  const a  = el.nextElementSibling;
  const ch = el.querySelector('.faq-chev');
  a.classList.toggle('open');
  ch.classList.toggle('open');
}

// ── TOAST ──
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 3000);
}

function sendMsg() {
  showToast('✅ Message sent! We'll get back to you soon.');
}
