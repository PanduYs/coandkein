// ══════════════════════════════════════════════════════════════
//  CO&KEIN LOCAL SERVER
//  Run: node server.js
//  Data saved to data.json, images saved to images/
// ══════════════════════════════════════════════════════════════

const http = require('http');
const fs   = require('fs');
const path = require('path');
const os   = require('os');

const PORT     = 3000;
const ROOT     = __dirname;
const DATA_FILE = path.join(ROOT, 'data.json');
const IMG_DIR   = path.join(ROOT, 'images');

if (!fs.existsSync(IMG_DIR)) fs.mkdirSync(IMG_DIR);

const MIME = {
  '.html' : 'text/html; charset=utf-8',
  '.css'  : 'text/css',
  '.js'   : 'application/javascript',
  '.json' : 'application/json',
  '.png'  : 'image/png',
  '.jpg'  : 'image/jpeg',
  '.jpeg' : 'image/jpeg',
  '.webp' : 'image/webp',
  '.svg'  : 'image/svg+xml',
  '.ico'  : 'image/x-icon',
  '.woff2': 'font/woff2',
  '.woff' : 'font/woff',
  '.ttf'  : 'font/ttf',
};

function getIP() {
  for (const ifaces of Object.values(os.networkInterfaces()))
    for (const i of ifaces)
      if (i.family === 'IPv4' && !i.internal) return i.address;
  return 'localhost';
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', c => chunks.push(c));
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    req.on('error', reject);
  });
}

function readData() {
  try { return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8')); }
  catch { return {}; }
}
function writeData(d) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(d, null, 2), 'utf8');
}

const server = http.createServer(async (req, res) => {
  const { pathname } = new URL(req.url, 'http://x');

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') { res.writeHead(204); res.end(); return; }

  // ── GET /api/data ───────────────────────────────────────────
  if (req.method === 'GET' && pathname === '/api/data') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(readData()));
    return;
  }

  // ── POST /api/data ──────────────────────────────────────────
  if (req.method === 'POST' && pathname === '/api/data') {
    try {
      const d = JSON.parse(await readBody(req));
      writeData(d);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end('{"ok":true}');
    } catch (e) {
      res.writeHead(400);
      res.end(JSON.stringify({ error: e.message }));
    }
    return;
  }

  // ── POST /api/upload  (body: { base64: "data:image/..." }) ──
  if (req.method === 'POST' && pathname === '/api/upload') {
    try {
      const { base64 } = JSON.parse(await readBody(req));
      const m = base64.match(/^data:image\/(\w+);base64,(.+)$/s);
      if (!m) throw new Error('Invalid image data');
      const ext   = m[1] === 'jpeg' ? 'jpg' : m[1];
      const fname = `img_${Date.now()}.${ext}`;
      fs.writeFileSync(path.join(IMG_DIR, fname), Buffer.from(m[2], 'base64'));
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ url: `/images/${fname}` }));
    } catch (e) {
      res.writeHead(400);
      res.end(JSON.stringify({ error: e.message }));
    }
    return;
  }

  // ── Static files ────────────────────────────────────────────
  const fp = path.join(ROOT, pathname === '/' ? 'index.html' : pathname);
  try {
    const stat = fs.statSync(fp);
    if (stat.isFile()) {
      const mime = MIME[path.extname(fp).toLowerCase()] || 'application/octet-stream';
      res.writeHead(200, { 'Content-Type': mime });
      res.end(fs.readFileSync(fp));
      return;
    }
  } catch {}
  res.writeHead(404);
  res.end('Not found');
});

const ip = getIP();
server.listen(PORT, '0.0.0.0', () => {
  console.log('\n  ╔════════════════════════════════════╗');
  console.log('  ║       CO&KEIN LOCAL SERVER         ║');
  console.log('  ╚════════════════════════════════════╝');
  console.log(`\n  Laptop  →  http://localhost:${PORT}`);
  console.log(`  HP/Tab  →  http://${ip}:${PORT}  ← buka di HP`);
  console.log('\n  Tekan Ctrl+C untuk stop\n');
});
