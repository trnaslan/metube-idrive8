'use strict';

// The front page's screenshots (docs/media/b2-*.png): the built iDrive 8 app (python3 kit/tools/build.py --hmi ID8
// jap_ridetube) through the stubbed head unit on a 2880 x 960 renderer, against a stand-in for its service, with
// invented demo data. The pictures in them are drawn here (hills under a sky): no video, thumbnail or channel of
// anyone's. Each screen is written whole (kit/tools/surface.js); docs/readme_shots.py cuts the app area out of it.
//   node docs/readme_shots.js <folder>

const fs = require('fs');
const net = require('net');
const os = require('os');
const path = require('path');

process.env.MGU_RT_EASE_MS = '0';
const ROOT = path.join(__dirname, '..');
const stage = path.join(ROOT, 'dist', 'jap_ridetube8');
const OUT = process.argv[2];
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
async function until(fn, ms, what) {
    const end = Date.now() + (ms || 3000);
    while (!fn()) { if (Date.now() > end) throw new Error('timed out: ' + what); await sleep(10); }
}
const quiet = { info() {}, warn() {}, error(m, e) { throw e || new Error(m); }, debug() {} };

// a drawn picture: a sky of two colours, a sun, three ranges of hills, a road towards it - w x h RGBA
function scene(w, h, seed) {
    const buf = Buffer.alloc(w * h * 4);
    const hue = (seed * 67) % 360, rad = Math.PI / 180;
    const col = (hh, s, l) => {
        const a = s * Math.min(l, 1 - l), f = (n) => { const k = (n + hh / 30) % 12; return l - a * Math.max(-1, Math.min(k - 3, 9 - k, 1)); };
        return [f(0) * 255, f(8) * 255, f(4) * 255];
    };
    const top = col(hue, 0.55, 0.22), low = col((hue + 40) % 360, 0.75, 0.6), sun = col((hue + 55) % 360, 0.95, 0.82);
    const hills = [col((hue + 200) % 360, 0.35, 0.3), col((hue + 210) % 360, 0.4, 0.2), col((hue + 220) % 360, 0.45, 0.11)];
    const sx = w * (0.3 + 0.4 * ((seed * 37) % 10) / 10), sy = h * 0.5, sr = h * 0.13;
    const ridge = (k, x) => h * (0.56 + 0.1 * k) + h * 0.07 * Math.sin((x / w) * (5 + k * 3 + seed % 3) + seed + k * 2) + h * 0.03 * Math.sin((x / w) * (17 + k * 5) + seed * 3);
    for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
            const t = Math.min(1, y / (h * 0.75));
            let c = [top[0] + (low[0] - top[0]) * t, top[1] + (low[1] - top[1]) * t, top[2] + (low[2] - top[2]) * t];
            const d = Math.hypot(x - sx, y - sy);
            if (d < sr) c = sun; else if (d < sr * 2.6) { const g = Math.pow(1 - (d - sr) / (sr * 1.6), 2) * 0.55; c = [c[0] + (sun[0] - c[0]) * g, c[1] + (sun[1] - c[1]) * g, c[2] + (sun[2] - c[2]) * g]; }
            for (let k = 0; k < 3; k++) if (y > ridge(k, x)) c = hills[k];
            // the road: from the bottom's middle to the horizon under the sun
            const ry = (y - h * 0.8) / (h * 0.2);
            if (ry > 0) { const cx = sx + (w / 2 - sx) * ry, half = w * (0.012 + 0.16 * ry); if (Math.abs(x - cx) < half) { c = [26, 28, 34]; if (Math.abs(x - cx) < half * 0.05 && Math.floor(ry * 9) % 2 === 0) c = [230, 230, 220]; } }
            const i = (y * w + x) * 4;
            buf[i] = c[0]; buf[i + 1] = c[1]; buf[i + 2] = c[2]; buf[i + 3] = 255;
        }
    }
    void rad;
    return buf;
}

const TITLES = [
    ['Coast road at sunrise, no talking', 'Open Road Films'], ['How a turbocharger works, drawn by hand', 'Workshop Notes'],
    ['Mountain pass in the rain: full run', 'Open Road Films'], ['Lo-fi mix for a long night drive', 'Late Lane Radio'],
    ['Detailing a daily driver in one afternoon', 'Garage Hours'], ['Desert highway, golden hour', 'Open Road Films'],
    ['Track day basics: braking points', 'Apex Class'], ['Synthwave for the motorway, 1 hour', 'Late Lane Radio'],
    ['Rebuilding a gearbox on a bench', 'Workshop Notes'], ['Forest road, autumn colours', 'Open Road Films'],
    ['Five sounds your car should not make', 'Garage Hours'], ['City lights, midnight loop', 'Late Lane Radio'],
];
const ITEMS = TITLES.map((t, i) => ({ id: 'demo' + String(i).padStart(7, '0'), title: t[0], channel: t[1], duration_s: 222 + i * 137, meta: [(3 + i * 7) + 'K views', (i + 1) + ' days ago'] }));

function fakeDaemon(sock) {
    const d = { got: [], conn: null };
    d.server = net.createServer((c) => {
        d.conn = c;
        let buf = '';
        c.setEncoding('utf8');
        c.on('data', (x) => { buf += x; let i; while ((i = buf.indexOf('\n')) >= 0) { d.got.push(JSON.parse(buf.slice(0, i))); buf = buf.slice(i + 1); } });
        c.on('error', () => {});
    });
    d.send = (o) => d.conn.write(JSON.stringify(o) + '\n');
    d.cmds = (cmd) => d.got.filter((m) => m.cmd === cmd);
    return new Promise((r) => d.server.listen(sock, () => r(d)));
}

async function main() {
    if (!OUT) throw new Error('node docs/readme_shots.js <folder>');
    if (!fs.existsSync(path.join(stage, 'source', 'javascript', 'app.js'))) throw new Error('python3 kit/tools/build.py --hmi ID8 jap_ridetube first');
    fs.mkdirSync(OUT, { recursive: true });
    const kitDir = path.join(stage, 'source', 'javascript', 'kit');
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'b2shots-'));
    const sock = path.join(dir, 'ctl.sock');
    const d = await fakeDaemon(sock);
    process.env.MGU_YT_SOCKET = sock;
    process.env.MGU_RENDERD_FILE = path.join(dir, 'stream.bin');
    const vfile = process.env.MGU_YT_VIDEO = path.join(dir, 'mgu-video-ridetube');
    const { headUnit } = require(path.join(ROOT, 'kit', 'tools', 'hu-stub'));
    const hu = headUnit(stage, { dataDir: dir, fresh: true, image: () => Promise.resolve(), log: quiet });
    const disp = hu.display;
    hu.ui.close = async () => {};
    let speed = 0, speedH = null;
    hu.ctx.signals = { watch: async (i, n, h) => { if (h && h.statusCarSpeed2) { speedH = h.statusCarSpeed2; speedH({ speedVehicleCentreOfGravity: speed }); } return {}; } };
    hu.ctx.hideButton = (id, hide) => disp.hideButton(id, hide);
    hu.ctx.onPageFocus = (fn) => { disp.onPageFocus = fn; };
    hu.ctx.focus = (k) => disp.focusPage(k);
    const drive = (kmh) => { speed = kmh; speedH({ speedVehicleCentreOfGravity: Math.round(kmh / 0.015625) }); };
    const parkedFor = async (ms) => { for (let t = 0; t < ms; t += 300) { drive(0); await sleep(300); } };
    hu.start();
    await until(() => d.cmds('auth_status').length, 3000, 'app connects');
    disp.gpu.screen = { w: 2880, h: 960 };
    disp.gpu.touch = true;
    disp.gpu.iterio = true;
    disp._place();
    await hu.ui.open('VIEW');
    await hu.loopFn();
    const pl = disp.place;

    // the screenshot tool draws a labelled box for the video: here the drawn picture instead, fitted as the renderer fits it
    const { Canvas } = require(path.join(kitDir, 'canvas.js'));
    const { surfaceCanvas } = require(path.join(ROOT, 'kit', 'tools', 'surface'));
    const VW = 1358, VH = 764, frame = scene(VW, VH, 3);
    const fill0 = Canvas.prototype.fillRect, text0 = Canvas.prototype.text;
    Canvas.prototype.fillRect = function (x, y, w, h, c) {
        if (c !== '#123456') return fill0.call(this, x, y, w, h, c);
        const k = Math.min(w / VW, h / VH), dw = VW * k, dh = VH * k;
        fill0.call(this, Math.max(0, x), Math.max(0, y), Math.min(w, 2880), Math.min(h, 960), '#000000');
        return this.drawImage(frame, VW, VH, x + (w - dw) / 2, y + (h - dh) / 2, dw, dh);
    };
    Canvas.prototype.text = function (str) { if (typeof str === 'string' && /^VIDEO \d+ x \d+$/.test(str)) return this; return text0.apply(this, arguments); };
    const snap = (name) => { fs.writeFileSync(path.join(OUT, name + '.png'), surfaceCanvas(disp.last.frame.words(), disp.place, disp.gpu.screen, kitDir).png()); console.log(name); };
    const tap = async (sx, sy) => { const x = (sx - pl.ox) / pl.scale, y = (sy - pl.oy) / pl.scale; disp._touch(1, x, y); disp._touch(3, x, y); await sleep(20); };
    const tapTarget = async (t) => { const k = disp.place.scale; await tap((t.x + t.w / 2) * k + disp.place.ox, (t.y + t.h / 2) * k + disp.place.oy); };
    const target = (key) => disp.pageTargets.find((t) => t.key === key);
    const thumbs = async (n) => {
        const from = thumbs.sent || 0;
        await until(() => d.cmds('thumb').length >= from + n, 2500, 'thumbs asked').catch(() => {});
        d.cmds('thumb').slice(from).forEach((t) => { const i = Math.max(0, ITEMS.findIndex((it) => it.id === t.id)); d.send({ ev: 'thumb', id: t.id, w: 320, h: 180, rgba: scene(320, 180, i + 1).toString('base64') }); });
        thumbs.sent = d.cmds('thumb').length;
        await sleep(200);
        await hu.loopFn();
    };

    // the start screen
    await sleep(400);
    await hu.loopFn();
    snap('start');
    await tapTarget(target('splash'));
    await hu.loopFn();

    // Home, signed in: shelves
    d.send({ ev: 'auth', state: 'signed_in' });
    await sleep(80);
    await hu.loopFn();
    await tapTarget(target('rail:home'));
    await sleep(80);
    d.send({ ev: 'feed', which: 'home', items: ITEMS, shelves: [{ title: 'Recommended', items: ITEMS }, { title: 'From your subscriptions', items: ITEMS.slice(5).concat(ITEMS.slice(0, 5)) }] });
    await sleep(150);
    await hu.loopFn();
    await thumbs(6);
    await thumbs(0);
    snap('home');

    // Search: the keyboard, then the results
    await tapTarget(target('rail:search'));
    disp._paintSheet();
    const keyAt = (k) => disp.sheet.places.findIndex((p) => p.key === k);
    for (const ch of 'night') await tapTarget(disp.sheetTargets[keyAt('k:' + ch)]);
    disp._paintSheet();
    snap('keyboard');
    await tapTarget(disp.sheetTargets[keyAt('ok')]);
    await until(() => d.cmds('search').length, 2000, 'search sent');
    await until(() => !disp.sheet, 1000, 'keyboard closed');
    d.send({ ev: 'results', q: 'night', items: [3, 7, 11, 0, 5, 2, 9, 4, 6, 1].map((i) => ITEMS[i]) });
    await sleep(150);
    await hu.loopFn();
    await thumbs(0);
    snap('search');

    // the player: the controls over the picture (Fit), then Fill with the controls away
    await tapTarget(disp.pageTargets.find((t) => /^r:0:demo/.test(t.key)));
    await until(() => d.cmds('play').length, 2000, 'play sent');
    const it = ITEMS[3];
    fs.writeFileSync(vfile, '');
    d.send({ ev: 'state', state: 'playing', id: it.id, title: it.title });
    d.send({ ev: 'time', elapsed: 64000, total: it.duration_s * 1000 });
    await parkedFor(600);
    await hu.loopFn();
    if (!target('ov:prev')) { await tapTarget(target('tap:l') || target('ov:back')); await sleep(250); await hu.loopFn(); }
    await sleep(200);
    await hu.loopFn();
    snap('player');
    hu.ctx.settings.set('zoom', 'z1');
    await parkedFor(4300);
    await hu.loopFn();
    snap('player-zoom');
    hu.ctx.settings.set('zoom', 'fill');
    await parkedFor(400);
    await hu.loopFn();
    snap('player-fill');
    // a double tap on the right
    await tapTarget(target('tap:r')); await hu.loopFn(); await tapTarget(target('tap:r'));
    await sleep(60);
    await hu.loopFn();
    snap('player-double-tap');
    hu.ctx.settings.set('zoom', 'fit');

    // driving: the sound plays on, no picture
    drive(60);
    await sleep(450);
    await hu.loopFn();
    snap('driving');
    drive(0);
    await parkedFor(500);

    // Settings: the list
    for (let n = 0; n < 6 && !target('rail:more'); n++) {
        const t = target('ov:prev') ? target('ov:back') : target('tap:l') || target('ov:back') || disp.pageTargets[0];
        if (!t) throw new Error('no way back from the player: ' + disp.pageTargets.map((q) => q.key).join(' '));
        await tapTarget(t);
        await parkedFor(300);
        await hu.loopFn();
    }
    await tapTarget(target('rail:more'));
    disp._paintSheet();
    snap('settings-card');
    const last = disp.sheetTargets.slice(1).sort((a, b) => a.x - b.x);
    await tapTarget(last[last.length - 1]);
    await sleep(100);
    if (disp.sheet) disp._paintSheet();
    snap('settings');
    process.exit(0);
}

main().catch((e) => { console.error('FAIL', e); process.exit(1); });
