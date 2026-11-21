'use strict';
/**
 * The app's logo as a picture for the start screen: 164 x 164 opaque RGBA (a rounded square with a play mark, drawn on the
 * start screen's background), gzipped, base64. MeTube's own mark; generated, not taken from any other app's artwork.
 */
const zlib = require('zlib');
const W = 164, H = 164;
const DATA = [
    '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',
].join('');
/** { w, h, buf }: the pixels (null when they do not unpack to w x h x 4 bytes). */
function logo() {
    try {
        const buf = zlib.gunzipSync(Buffer.from(DATA, 'base64'));
        return buf.length === W * H * 4 ? { w: W, h: H, buf } : null;
    } catch (e) { return null; }
}
module.exports = { logo };
