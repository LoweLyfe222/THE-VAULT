// Rebuild the original V053 website from small GitHub-uploadable UTF-8 parts.
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const root = __dirname;
const parts = Array.from({length: 12}, (_, i) => 'index.part' + String(i + 1).padStart(2, '0') + '.txt');
for (const part of parts) {
  if (!fs.existsSync(path.join(root, part))) throw new Error('Missing '+part+' — upload all 12 V053 website parts');
}
const output = path.join(root, 'index.html');
const fd = fs.openSync(output, 'w');
try {
  for (const part of parts) fs.writeSync(fd, fs.readFileSync(path.join(root, part)));
} finally {
  fs.closeSync(fd);
}
const actual = crypto.createHash('sha256').update(fs.readFileSync(output)).digest('hex');
const expected = 'db101a702df0f19ced23cc6d59f5d54deb84903e62a2915c7265c9ab55574b34';
if (actual !== expected) throw new Error('V053 website checksum mismatch — aborting deploy');
console.log('V053 website assembled and SHA-256 verified');

// Inject the small recovery script after checksum verification, without editing the original V053 parts.
const html = fs.readFileSync(output, 'utf8');
if (!html.includes('</body>')) throw new Error('V053 HTML body closing tag missing');
// Restore the two exact product photos already embedded in the approved V053 HTML.
// Patch the source image URLs BEFORE the browser builds product cards or detail modals.
const angel = html.match(/class="vault-v009-main"\s+src="(data:image\/webp;base64,[^"]+)"/);
const hat = html.match(/id="vault-cap-detail"[\s\S]{0,600}?<img\s+src="(data:image\/(?:png|webp|jpeg);base64,[^"]+)"/);
if (!angel || !hat) throw new Error('Original Angel or Dad Hat artwork missing; refusing to deploy placeholders');
console.log('Restoring original approved photos to product card and detail URLs');
const restored = html
  .replaceAll('https://warm-medovik-b368bb.netlify.app/assets/74f7a5565d40943399281ec1.webp', angel[1])
  .replaceAll('https://warm-medovik-b368bb.netlify.app/assets/make-gas-cap.png', hat[1]);
const repaired = restored
  .replaceAll('https://warm-medovik-b368bb.netlify.app/assets/imperial-royal-dynasty.avif', '/assets/imperial-royal-dynasty.jpg')
  .replaceAll('https://warm-medovik-b368bb.netlify.app/assets/imperial-bad-boys.avif', '/assets/imperial-bad-boys.jpg');
fs.writeFileSync(output, repaired.replace('</body>', '<script defer src="/image-recovery.js"></script></body>'));
console.log('V053 image fallback enabled; product catalog and checkout unchanged');
