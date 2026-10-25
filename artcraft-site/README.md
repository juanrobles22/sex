# ArtCraft site — self-hosted version

This is a small website + server (only Node.js 18+ is needed, nothing to install).
Everything you upload or edit is stored **on the server**, so it shows up for every visitor on every device.

## Run it
```
node server.js          # then open http://localhost:3000
```
Admin login: open the site and press **Ctrl+Shift+A** (or add **#admin** to the address) and enter your admin code.

## Put it online (important)
Host the whole folder on any Node.js host (a VPS, Railway, Render, Fly.io…). Two things matter:

1. **Persistent storage.** Uploads and edits are saved in the `data/` folder (or wherever `DATA_DIR` points).
   Hosts with a temporary disk (e.g. free tiers of Render/Heroku) erase it on restart — attach a persistent
   disk/volume and set `DATA_DIR` to it (e.g. `DATA_DIR=/var/data node server.js`).
2. **HTTPS** (all the hosts above provide it). Admin login cookies are marked Secure automatically.

Optional environment variables: `PORT`, `DATA_DIR`, `MAX_UPLOAD_MB` (default 4096), `TRUST_PROXY=1` (behind a proxy),
`ADMIN_CODE` (lets your admin session survive a server restart without logging in again).
Some proxies/CDNs cap upload size (Cloudflare's free plan: 100 MB per request) — upload big videos straight to the origin.

## What lives where
| Thing | Where |
|---|---|
| Text/link/logo edits, swirl settings, tube list, audio settings | `data/state.json` |
| Uploaded images, videos, audio | `data/uploads/` |
| Your two starter images | `public/media/` |
| The admin panel code | `private/admin.enc` (encrypted) |

**Back up the `data/` folder** — it is your whole site's content.

## Admin panel security
* The admin panel code is **AES-256 encrypted** with a key derived from your admin code (scrypt). The code is stored nowhere.
* It is never part of the public page. The server only decrypts and sends it after a correct code, and every
  save/upload/delete is verified on the server, so visitors cannot change anything even by tampering with the page.
* Login attempts are rate-limited. Sessions last 7 days.
* Change the code: `ADMIN_CODE='your-new-code-12+chars' node tools/encrypt-admin.js`, then restart the server.
* `tools/admin.src.js` is the readable source of the panel. It is not served to visitors, but delete it from your
  server (keep a private copy) if you want only the encrypted version online.

## Pages
* `/` home (swirl, streaks, background audio) · `/tube` the video tube (the "Launch App" buttons go here).
* Text/link edits are saved per page (home and tube each have their own).
