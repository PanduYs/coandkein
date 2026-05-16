// ══════════════════════════════════════════════════════════════
//  CO&KEIN ADMIN — STORAGE
// ══════════════════════════════════════════════════════════════

const PASS_KEY    = 'ck_admin_pass';
const SESSION_KEY = 'ck_session';
const GH_TOKEN_KEY = 'ck_gh_token';
const GH_REPO     = 'PanduYs/coandkein';
const GH_FILE     = 'data.json';

const DEFAULT_PASS = 'coandkein2024';
const DEFAULT_CFG  = {
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

// ── localStorage helpers ────────────────────────────────────
function getPass() {
  return localStorage.getItem(PASS_KEY) || DEFAULT_PASS;
}
function savePass(p) {
  localStorage.setItem(PASS_KEY, p);
}
function getProducts() {
  try {
    return JSON.parse(localStorage.getItem('ck_products')) || DEFAULT_PRODUCTS;
  } catch { return DEFAULT_PRODUCTS; }
}
function saveProducts(p) {
  localStorage.setItem('ck_products', JSON.stringify(p));
}
function getConfig() {
  try {
    return Object.assign({}, DEFAULT_CFG, JSON.parse(localStorage.getItem('ck_config')));
  } catch { return { ...DEFAULT_CFG }; }
}
function saveConfig(c) {
  localStorage.setItem('ck_config', JSON.stringify(c));
}

// ── GitHub Auto-Sync ────────────────────────────────────────
async function syncToGitHub() {
  const token = localStorage.getItem(GH_TOKEN_KEY);
  if (!token) return false;

  try {
    const data = {
      products: getProducts(),
      config  : getConfig(),
      pass    : getPass(),
    };

    // Get current file SHA (required by GitHub API to update)
    const getResp = await fetch(
      'https://api.github.com/repos/' + GH_REPO + '/contents/' + GH_FILE,
      { headers: { 'Authorization': 'token ' + token, 'Accept': 'application/vnd.github.v3+json' } }
    );
    const fileInfo = await getResp.json();

    // UTF-8 safe base64 encode
    const content = btoa(unescape(encodeURIComponent(JSON.stringify(data, null, 2))));

    const putResp = await fetch(
      'https://api.github.com/repos/' + GH_REPO + '/contents/' + GH_FILE,
      {
        method : 'PUT',
        headers: {
          'Authorization': 'token ' + token,
          'Content-Type' : 'application/json',
          'Accept'       : 'application/vnd.github.v3+json',
        },
        body: JSON.stringify({
          message: 'update via admin panel',
          content : content,
          sha     : fileInfo.sha,
        }),
      }
    );

    return putResp.ok;
  } catch (e) {
    console.error('GitHub sync error:', e);
    return false;
  }
}
