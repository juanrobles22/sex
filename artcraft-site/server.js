'use strict';
/* ArtCraft site server — zero dependencies. Run:  node server.js
   Env: PORT, DATA_DIR (put this on a persistent disk!), ADMIN_CODE (optional, lets admin survive restarts),
        MAX_UPLOAD_MB (default 4096), TRUST_PROXY=1 (if behind nginx/Cloudflare/etc.) */
const http = require('http'), fs = require('fs'), path = require('path'), crypto = require('crypto');
const { Transform } = require('stream'), { pipeline } = require('stream/promises');

const ROOT = __dirname, PUB = path.join(ROOT, 'public');
const DATA = process.env.DATA_DIR ? path.resolve(process.env.DATA_DIR) : path.join(ROOT, 'data');
const UP = path.join(DATA, 'uploads'), STATE_F = path.join(DATA, 'state.json'), SECRET_F = path.join(DATA, 'secret.key');
const ENC_F = path.join(ROOT, 'private', 'admin.enc');
const PORT = +process.env.PORT || 3000, MAX_UPLOAD = (+process.env.MAX_UPLOAD_MB || 4096) * 1024 * 1024;
fs.mkdirSync(UP, { recursive: true });

/* ---------- persistent state ---------- */
const DEFAULT_STATE = {
  swirl: { settings: { speed: 1, boost: 1, streaks: 40, streakSpeed: 1, size: 100, radius: 100, reverse: false },
    items: [{ id: 'd1', name: '1.svg', type: 'image', src: '/media/1.svg', speed: 1 }, { id: 'd2', name: '2.svg', type: 'image', src: '/media/2.svg', speed: 1 }] },
  site: {}, audio: { src: null, name: '', volume: 0.6, enabled: true }, tube: { categories: [], videos: [] }
};
let state;
try { state = { ...DEFAULT_STATE, ...JSON.parse(fs.readFileSync(STATE_F, 'utf8')) }; } catch (e) { state = JSON.parse(JSON.stringify(DEFAULT_STATE)); }
function saveState() { const t = STATE_F + '.tmp'; fs.writeFileSync(t, JSON.stringify(state)); fs.renameSync(t, STATE_F); }
if (!fs.existsSync(STATE_F)) saveState();
let SECRET; try { SECRET = fs.readFileSync(SECRET_F); } catch (e) { SECRET = crypto.randomBytes(32); fs.writeFileSync(SECRET_F, SECRET, { mode: 0o600 }); }

/* ---------- admin: encrypted panel code + sessions ---------- */
let adminJS = null; // decrypted admin panel code, kept in memory only
function tryDecrypt(code) {
  try {
    const o = JSON.parse(fs.readFileSync(ENC_F, 'utf8'));
    const key = crypto.scryptSync(String(code), Buffer.from(o.salt, 'base64'), 32, { N: 32768, r: 8, p: 1, maxmem: 64 * 1024 * 1024 });
    const d = crypto.createDecipheriv('aes-256-gcm', key, Buffer.from(o.iv, 'base64'));
    d.setAuthTag(Buffer.from(o.tag, 'base64'));
    return Buffer.concat([d.update(Buffer.from(o.data, 'base64')), d.final()]).toString('utf8');
  } catch (e) { return null; }
}
if (process.env.ADMIN_CODE) { adminJS = tryDecrypt(process.env.ADMIN_CODE); if (!adminJS) console.warn('! ADMIN_CODE does not unlock private/admin.enc'); }
const sign = v => crypto.createHmac('sha256', SECRET).update(v).digest('hex');
const mkToken = () => { const exp = Date.now() + 7 * 864e5; return exp + '.' + sign('s' + exp); };
const cookieOf = (req, n) => ((req.headers.cookie || '').split(/;\s*/).find(c => c.startsWith(n + '=')) || '').slice(n.length + 1);
function isAdmin(req) {
  const t = cookieOf(req, 'ac_admin'), [exp, mac] = t.split('.');
  if (!exp || !mac || +exp < Date.now()) return false;
  const a = Buffer.from(mac), b = Buffer.from(sign('s' + exp));
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}
const secure = req => req.socket.encrypted || req.headers['x-forwarded-proto'] === 'https';
const hits = new Map();
const ipOf = req => (process.env.TRUST_PROXY && req.headers['x-forwarded-for'] || '').split(',')[0].trim() || req.socket.remoteAddress;

/* ---------- helpers ---------- */
const send = (res, code, obj, h = {}) => { const b = Buffer.from(JSON.stringify(obj)); res.writeHead(code, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store', 'Content-Length': b.length, ...h }); res.end(b); };
const readBody = (req, max) => new Promise((ok, no) => { let n = 0; const a = []; req.on('data', c => { n += c.length; if (n > max) { no(Object.assign(new Error('Too large'), { code: 413 })); req.destroy(); } else a.push(c); }); req.on('end', () => ok(Buffer.concat(a))); req.on('error', no); });
const readJSON = async (req, max = 5e6) => { try { return JSON.parse((await readBody(req, max)).toString() || '{}'); } catch (e) { throw Object.assign(new Error('Bad JSON'), { code: 400 }); } };
const safe = (base, rel) => { try { const p = path.normalize(path.join(base, decodeURIComponent(rel))); return p.startsWith(base + path.sep) ? p : null; } catch (e) { return null; } };
const MIME = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.gif': 'image/gif', '.webp': 'image/webp', '.avif': 'image/avif', '.ico': 'image/x-icon', '.mp4': 'video/mp4', '.m4v': 'video/mp4', '.webm': 'video/webm', '.mov': 'video/quicktime', '.ogv': 'video/ogg', '.mp3': 'audio/mpeg', '.m4a': 'audio/mp4', '.wav': 'audio/wav', '.ogg': 'audio/ogg', '.aac': 'audio/aac', '.flac': 'audio/flac', '.txt': 'text/plain; charset=utf-8' };
const ALLOWED = new Set(['.jpg', '.jpeg', '.png', '.gif', '.webp', '.avif', '.svg', '.mp4', '.m4v', '.webm', '.mov', '.ogv', '.mp3', '.m4a', '.wav', '.ogg', '.aac', '.flac']);

function serveFile(req, res, file, extra = {}) {
  fs.stat(file, (e, st) => {
    if (e || !st.isFile()) { res.writeHead(404); return res.end('Not found'); }
    const h = { 'Content-Type': MIME[path.extname(file).toLowerCase()] || 'application/octet-stream', 'Accept-Ranges': 'bytes', ...extra };
    let start = 0, end = st.size - 1, code = 200;
    const m = /bytes=(\d*)-(\d*)/.exec(req.headers.range || '');
    if (m && (m[1] || m[2])) {
      if (m[1] === '') start = Math.max(0, st.size - +m[2]); else { start = +m[1]; if (m[2]) end = Math.min(+m[2], end); }
      if (start > end || start >= st.size) { res.writeHead(416, { 'Content-Range': 'bytes */' + st.size }); return res.end(); }
      code = 206; h['Content-Range'] = `bytes ${start}-${end}/${st.size}`;
    }
    h['Content-Length'] = end - start + 1; res.writeHead(code, h);
    if (req.method === 'HEAD') return res.end();
    fs.createReadStream(file, { start, end }).on('error', () => res.destroy()).pipe(res);
  });
}

/* ---------- API ---------- */
async function api(req, res, u, p) {
  const m = req.method;
  if (m === 'GET' && p === '/api/state') return send(res, 200, state);
  if (m === 'GET' && p === '/api/me') return send(res, 200, { admin: isAdmin(req) });
  if (m !== 'GET' && req.headers['x-ac'] !== '1') return send(res, 403, { error: 'Bad request' });

  if (m === 'POST' && p === '/api/login') {
    const ip = ipOf(req), now = Date.now(), h = (hits.get(ip) || []).filter(t => now - t < 600000);
    if (h.length >= 8) return send(res, 429, { error: 'Too many attempts. Try again in 10 minutes.' });
    const { code } = await readJSON(req, 1e4);
    const js = typeof code === 'string' && code.length < 200 ? tryDecrypt(code) : null;
    if (!js) { h.push(now); hits.set(ip, h); await new Promise(r => setTimeout(r, 500)); return send(res, 401, { error: 'Wrong code' }); }
    adminJS = js; hits.delete(ip);
    return send(res, 200, { ok: true }, { 'Set-Cookie': `ac_admin=${mkToken()}; Path=/; HttpOnly; SameSite=Strict; Max-Age=604800${secure(req) ? '; Secure' : ''}` });
  }
  if (m === 'POST' && p === '/api/logout') return send(res, 200, { ok: true }, { 'Set-Cookie': 'ac_admin=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0' });
  if (!isAdmin(req)) return send(res, 401, { error: 'Admin only' });

  if (m === 'PUT' && p.startsWith('/api/state/')) {
    const sec = p.slice(11);
    if (!['swirl', 'site', 'audio', 'tube'].includes(sec)) return send(res, 404, { error: 'Unknown section' });
    const body = await readJSON(req);
    if (!body || typeof body !== 'object' || Array.isArray(body)) return send(res, 400, { error: 'Bad data' });
    state[sec] = body; saveState(); return send(res, 200, { ok: true });
  }
  if (m === 'POST' && p === '/api/upload') {
    const name = u.searchParams.get('name') || 'file', ext = path.extname(name).toLowerCase();
    if (!ALLOWED.has(ext)) { req.resume(); return send(res, 415, { error: 'File type not allowed: ' + (ext || 'none') }); }
    const base = path.basename(name, ext).normalize('NFKD').replace(/[^\w.-]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 40) || 'file';
    const fn = crypto.randomBytes(5).toString('hex') + '-' + base + ext, tmp = path.join(UP, fn + '.part');
    let n = 0;
    const lim = new Transform({ transform(c, _, cb) { n += c.length; n > MAX_UPLOAD ? cb(Object.assign(new Error('File too large (limit ' + Math.round(MAX_UPLOAD / 1048576) + ' MB)'), { code: 413 })) : cb(null, c); } });
    try { await pipeline(req, lim, fs.createWriteStream(tmp)); fs.renameSync(tmp, path.join(UP, fn)); }
    catch (e) { fs.unlink(tmp, () => {}); return send(res, e.code === 413 ? 413 : 500, { error: e.message }); }
    return send(res, 200, { src: '/uploads/' + fn, name, size: n });
  }
  if (m === 'POST' && p === '/api/delete-file') {
    const { src } = await readJSON(req, 1e4);
    if (typeof src === 'string' && src.startsWith('/uploads/')) { const f = safe(UP, src.slice(9)); if (f) fs.unlink(f, () => {}); }
    return send(res, 200, { ok: true });
  }
  send(res, 404, { error: 'Not found' });
}

/* ---------- server ---------- */
http.createServer(async (req, res) => {
  try {
    const u = new URL(req.url, 'http://x'), p = u.pathname;
    res.setHeader('X-Content-Type-Options', 'nosniff'); res.setHeader('Referrer-Policy', 'same-origin');
    if (p.startsWith('/api/')) return await api(req, res, u, p);
    if (p === '/admin.js') { // the admin panel code only ever leaves the server for a logged-in admin
      if (!isAdmin(req) || !adminJS) { res.writeHead(401, { 'Cache-Control': 'no-store' }); return res.end('Login required'); }
      res.writeHead(200, { 'Content-Type': 'text/javascript; charset=utf-8', 'Cache-Control': 'no-store' }); return res.end(adminJS);
    }
    if (req.method !== 'GET' && req.method !== 'HEAD') { res.writeHead(405); return res.end(); }
    if (p.startsWith('/uploads/')) {
      const f = safe(UP, p.slice(9)); if (!f || f.endsWith('.part')) { res.writeHead(404); return res.end(); }
      return serveFile(req, res, f, { 'Cache-Control': 'public, max-age=31536000, immutable', 'Content-Security-Policy': "sandbox; default-src 'none'; media-src 'self'; img-src 'self'; style-src 'unsafe-inline'" });
    }
    const rel = p === '/' ? '/index.html' : /^\/tube\/?$/.test(p) ? '/tube.html' : p;
    const f = safe(PUB, rel);
    if (!f || path.basename(f).startsWith('.')) { res.writeHead(404); return res.end('Not found'); }
    serveFile(req, res, f, { 'Cache-Control': rel.startsWith('/media/') ? 'public, max-age=3600' : 'no-cache' });
  } catch (e) {
    if (e.code !== 413 && e.code !== 400) console.error(e);
    if (!res.headersSent) send(res, e.code === 413 ? 413 : e.code === 400 ? 400 : 500, { error: e.message || 'Server error' }); else res.end();
  }
}).listen(PORT, () => console.log(`ArtCraft site running → http://localhost:${PORT}   (data: ${DATA})`));
