// ══════════════════════════════════════════════════════════════
//  CO&KEIN — STORAGE
//  Priority: 1) local server  2) data.json (GitHub Pages)  3) localStorage
// ══════════════════════════════════════════════════════════════

let _cache = null;

async function initData() {
  if (_cache) return;
  // 1. Local server (node server.js)
  try {
    const r = await fetch('/api/data');
    if (r.ok) { _cache = await r.json(); return; }
  } catch {}
  // 2. Static data.json (GitHub Pages / npx serve)
  try {
    const r = await fetch('data.json');
    if (r.ok) { _cache = await r.json(); return; }
  } catch {}
  // 3. Fallback localStorage
  _cache = {};
}

function getProducts() {
  if (_cache && _cache.products) return _cache.products;
  try {
    const v = localStorage.getItem('ck_products');
    return v ? JSON.parse(v) : DEFAULT_PRODUCTS;
  } catch { return DEFAULT_PRODUCTS; }
}

function getConfig() {
  if (_cache && _cache.config) return Object.assign({}, DEFAULT_CONFIG, _cache.config);
  try {
    const v = localStorage.getItem('ck_config');
    return v ? Object.assign({}, DEFAULT_CONFIG, JSON.parse(v)) : { ...DEFAULT_CONFIG };
  } catch { return { ...DEFAULT_CONFIG }; }
}
