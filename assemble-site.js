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
// Write the original approved artwork as real image files, rather than giant data URIs
// inside JavaScript product records. This also fixes product detail images.
const angel = html.match(/class="vault-v009-main"\s+src="(data:image\/webp;base64,[^"]+)"/);
const hat = html.match(/id="vault-cap-detail"[\s\S]{0,600}?<img\s+src="(data:image\/png;base64,[^"]+)"/);
if (!angel || !hat) throw new Error('Original Angel or Dad Hat artwork missing');
const assetsDir=path.join(root,'assets');
fs.mkdirSync(assetsDir,{recursive:true});
fs.writeFileSync(path.join(assetsDir,'signature-angel-original.webp'),Buffer.from(angel[1].split(',')[1],'base64'));
fs.writeFileSync(path.join(assetsDir,'make-gas-original.png'),Buffer.from(hat[1].split(',')[1],'base64'));
console.log('Original product images extracted into real /assets/ files');
// Remove only the exact upper duplicate Dad Hat entry from the original catalog array.
const upperHatRecord = ",\\n {\"name\": \"Make Gas $2.40 Again Dad Hat\", \"brand\": null, \"category\": \"extras\", \"price\": 26.99, \"image\": \"https://warm-medovik-b368bb.netlify.app/assets/make-gas-cap.png\", \"cap\": true}";
if (html.split(upperHatRecord).length !== 2) throw new Error('Upper hat entry mismatch; refusing unsafe build');
const catalogHtml = html.replace(upperHatRecord, '');
console.log('Removed upper catalog Dad Hat record; featured hat and other listings unchanged');
const restored = catalogHtml
  .replaceAll('https://warm-medovik-b368bb.netlify.app/assets/74f7a5565d40943399281ec1.webp', '/assets/signature-angel-original.webp')
  .replaceAll('https://warm-medovik-b368bb.netlify.app/assets/make-gas-cap.png', '/assets/make-gas-original.png');
if (restored.includes('https://warm-medovik-b368bb.netlify.app/assets/74f7a5565d40943399281ec1.webp') || restored.includes('https://warm-medovik-b368bb.netlify.app/assets/make-gas-cap.png')) throw new Error('Unreplaced missing product photo URL');
// Remove ONLY the first/top hat catalog listing from the liveCatalog array.
// The lower hat is an original owner product and remains untouched, as does
// the big bottom featured hat. Apply after the original checksum validation.
const upperHatRecord = ' {"name": "Make Gas $2.40 Again Dad Hat", "brand": null, "category": "extras", "price": 26.99, "image": "https://warm-medovik-b368bb.netlify.app/assets/make-gas-cap.png", "cap": true}';
if (!restored.includes(upperHatRecord)) throw new Error('Upper catalog hat record not found — abort rather than remove wrong product');
const withoutUpperHat = restored.replace(upperHatRecord, '');
console.log('Removed upper liveCatalog hat entry; lower original and featured hats preserved');
const repaired = withoutUpperHat
  .replaceAll('https://warm-medovik-b368bb.netlify.app/assets/imperial-royal-dynasty.avif', '/assets/imperial-royal-dynasty.jpg')
  .replaceAll('https://warm-medovik-b368bb.netlify.app/assets/imperial-bad-boys.avif', '/assets/imperial-bad-boys.jpg');
fs.writeFileSync(output, repaired.replace('</body>', '<script defer src="/image-recovery.js"></script></body>'));
if (!fs.existsSync(path.join(assetsDir,'signature-angel-original.webp')) || !fs.existsSync(path.join(assetsDir,'make-gas-original.png'))) throw new Error('Original image files were not created');
console.log('V053 image fallback enabled; product catalog and checkout unchanged');
