'use strict';
/* Re-encrypts the admin panel with YOUR admin code (the code is not stored anywhere).
   Usage:  ADMIN_CODE='your-code' node tools/encrypt-admin.js
   Reads tools/admin.src.js, writes private/admin.enc */
const fs = require('fs'), path = require('path'), crypto = require('crypto');
const code = process.env.ADMIN_CODE;
if (!code || code.length < 12) { console.error('Set ADMIN_CODE (12+ characters) first.'); process.exit(1); }
const src = fs.readFileSync(path.join(__dirname, 'admin.src.js'));
const salt = crypto.randomBytes(16), iv = crypto.randomBytes(12);
const key = crypto.scryptSync(code, salt, 32, { N: 32768, r: 8, p: 1, maxmem: 64 * 1024 * 1024 });
const c = crypto.createCipheriv('aes-256-gcm', key, iv);
const data = Buffer.concat([c.update(src), c.final()]);
fs.mkdirSync(path.join(__dirname, '..', 'private'), { recursive: true });
fs.writeFileSync(path.join(__dirname, '..', 'private', 'admin.enc'), JSON.stringify({ v: 1, alg: 'aes-256-gcm+scrypt', salt: salt.toString('base64'), iv: iv.toString('base64'), tag: c.getAuthTag().toString('base64'), data: data.toString('base64') }));
console.log('Wrote private/admin.enc');
