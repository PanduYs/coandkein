// ══════════════════════════════════════════════════════════════
//  CO&KEIN ADMIN — STORAGE  (server-first, localStorage fallback)
// ══════════════════════════════════════════════════════════════

const PASS_KEY    = 'ck_admin_pass';
const SESSION_KEY = 'ck_session';

const DEFAULT_PASS = 'coandkein2024';
const DEFAULT_CFG  = {
  heroLine1    : 'ELEVATE',
  heroLine2    : 'YOUR AURA',
  heroDropBadge: 'DROP 004',
  dropTitle    : 'DROP 004',
  aboutTitle   : 'WE DRESS\nTHE BOLD',
  aboutBody    : 'Elevate your aura with CO & KEIN premium cuts and redefine the art of relaxed dominance. Be the calm in the chaos. Dress like you own the silence.',
  shopLink     : 'https://www.instagram.com/coandkein/',
  aboutVisualImg: '',
};
const DEFAULT_PRODUCTS = [
  { id:'p1', name:'BOXY TEE',          collection:'DROP 004', type:'Boxy T-Shirt', image:'', price:'DM FOR INFO', badge:'new',     link:'https://www.instagram.com/coandkein/', available:true },
  { id:'p2', name:'SAY MY NAME',        collection:'DROP 004', type:'Sleeveless',   image:'', price:'DM FOR INFO', badge:'new',     link:'https://www.instagram.com/coandkein/', available:true },
  { id:'p3', name:'COST OF BEING KIND', collection:'DROP 004', type:'Baby Tee',     image:'', price:'DM FOR INFO', badge:'limited', link:'https://www.instagram.com/coandkein/', available:true },
];

// ── Server-backed storage ───────────────────────────────────
let _cache    = null;
let _isServer = null;

function _checkServer() {
  if (_isServer !== null) return _isServer;
  try {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', '/api/data', false);
    xhr.send();
    _isServer = (xhr.status === 200);
    if (_isServer) _cache = JSON.parse(xhr.responseText) || {};
  } catch {
    _isServer = false;
  }
  return _isServer;
}

function _flush() {
  try {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/api/data', false);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(_cache));
  } catch {}
}

// ── Public API ──────────────────────────────────────────────
function getPass() {
  if (_checkServer()) return _cache.pass || DEFAULT_PASS;
  return localStorage.getItem(PASS_KEY) || DEFAULT_PASS;
}

function savePass(p) {
  if (_checkServer()) { _cache.pass = p; _flush(); return; }
  localStorage.setItem(PASS_KEY, p);
}

function getProducts() {
  if (_checkServer()) return _cache.products || DEFAULT_PRODUCTS;
  try {
    return JSON.parse(localStorage.getItem('ck_products')) || DEFAULT_PRODUCTS;
  } catch { return DEFAULT_PRODUCTS; }
}

function saveProducts(p) {
  if (_checkServer()) { _cache.products = p; _flush(); return; }
  localStorage.setItem('ck_products', JSON.stringify(p));
}

function getConfig() {
  if (_checkServer()) return Object.assign({}, DEFAULT_CFG, _cache.config);
  try {
    return Object.assign({}, DEFAULT_CFG, JSON.parse(localStorage.getItem('ck_config')));
  } catch { return { ...DEFAULT_CFG }; }
}

function saveConfig(c) {
  if (_checkServer()) { _cache.config = c; _flush(); return; }
  localStorage.setItem('ck_config', JSON.stringify(c));
}
