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
const upperHatRecord = '{"name": "Make Gas $2.40 Again Dad Hat", "brand": null, "category": "extras", "price": 26.99, "image": "https://warm-medovik-b368bb.netlify.app/assets/make-gas-cap.png", "cap": true}';
if (html.split(upperHatRecord).length !== 2) throw new Error('Upper hat entry mismatch; refusing unsafe build');
const catalogHtml = html.replace(upperHatRecord, '');
console.log('Removed upper catalog Dad Hat record; featured hat and other listings unchanged');
const restored = catalogHtml
  .replaceAll('https://warm-medovik-b368bb.netlify.app/assets/74f7a5565d40943399281ec1.webp', '/assets/signature-angel-original.webp')
  .replaceAll('https://warm-medovik-b368bb.netlify.app/assets/make-gas-cap.png', '/assets/make-gas-original.png');
if (restored.includes('https://warm-medovik-b368bb.netlify.app/assets/74f7a5565d40943399281ec1.webp') || restored.includes('https://warm-medovik-b368bb.netlify.app/assets/make-gas-cap.png')) throw new Error('Unreplaced missing product photo URL');
const repaired = restored
  .replaceAll('https://warm-medovik-b368bb.netlify.app/assets/imperial-royal-dynasty.avif', '/assets/imperial-royal-dynasty.jpg')
  .replaceAll('https://warm-medovik-b368bb.netlify.app/assets/imperial-bad-boys.avif', '/assets/imperial-bad-boys.jpg');
fs.writeFileSync(output, repaired.replace('</body>', '<script defer src="/image-recovery.js"></script></body>'));
if (!fs.existsSync(path.join(assetsDir,'signature-angel-original.webp')) || !fs.existsSync(path.join(assetsDir,'make-gas-original.png'))) throw new Error('Original image files were not created');
console.log('V053 image fallback enabled; product catalog and checkout unchanged');

// Put the sharing metadata near the start of the head for social crawlers.
const siteUrl = 'https://thevaultempire.com/';
const previewPath = 'assets/vault-facebook-share.jpg';
if (!fs.existsSync(path.join(root, previewPath))) throw new Error('Approved social thumbnail missing');

const openGraph = [
  '<meta property="og:type" content="website">',
  '<meta property="og:title" content="THE VAULT — LoweLyfe Holdings LLC">',
  '<meta property="og:description" content="SURVYVAL • Meditating Monkey • Imperial Elephant • Imperial Meditation • I’m Dope. Shop the collections.">',
  `<meta property="og:url" content="${siteUrl}">`,
  `<meta property="og:image" content="${siteUrl}${previewPath}">`,
  `<meta property="og:image:secure_url" content="${siteUrl}${previewPath}">`,
  '<meta property="og:image:type" content="image/jpeg">',
  '<meta property="og:image:width" content="1200">',
  '<meta property="og:image:height" content="630">',
  '<meta property="og:image:alt" content="THE VAULT streetwear artwork featuring its five collections">',
].join('');

const page = fs.readFileSync(output, 'utf8');
if (!page.includes('</title>')) throw new Error('V053 page title closing tag missing');
fs.writeFileSync(output, page.replace('</title>', '</title>' + openGraph));
console.log('Approved THE VAULT social thumbnail installed');


// Search-engine metadata only; preserve original V053 source, catalog and checkout.
const seoTitle = 'THE VAULT | SURVYVAL Streetwear & Graphic Tees';
const seoDescription = 'Shop THE VAULT by LoweLyfe Holdings LLC. Discover SURVYVAL streetwear, graphic tees and original apparel collections including Meditating Monkey and Imperial Elephant.';
let seoPage = fs.readFileSync(output, 'utf8');
if (!/<title[^>]*>[\s\S]*?<\/title>/i.test(seoPage)) throw new Error('SEO title tag missing; refusing unsafe deploy');
seoPage = seoPage.replace(/<title[^>]*>[\s\S]*?<\/title>/i, '<title>' + seoTitle + '</title>');
seoPage = seoPage.replace(/<meta\s+[^>]*name=["']description["'][^>]*>/gi, '');
seoPage = seoPage.replace(/<meta\s+[^>]*content=["'][^"']*["'][^>]*name=["']description["'][^>]*>/gi, '');
seoPage = seoPage.replace('</title>', '</title><meta name="description" content="' + seoDescription + '">');
fs.writeFileSync(output, seoPage);
console.log('THE VAULT Google search title and description updated; V053 parts and checkout unchanged');
// Add one approved product card without changing the original catalog or checkout.
let finalHtml = fs.readFileSync(output, 'utf8');
if (!finalHtml.includes('</body>')) throw new Error('Missing closing body tag');
finalHtml = finalHtml.replace('</body>', '<script defer src="/estoy-long-sleeve.js"></script><script defer src="/construction-series-second.js"></script><script defer src="/meditating-monkey-royal-crown.js"></script><script defer src="/survyval-mad-max.js"></script><script defer src="/survyval-shottas-stairway.js"></script><script defer src="/survyval-shottas-final.js"></script><script defer src="/survyval-land-shark.js"></script><script defer src="/survyval-land-shark-overlook.js"></script><script defer src="/survyval-land-shark-sakura.js"></script><script defer src="/storyboard-shop-all-scroll.js"></script></body>');
fs.writeFileSync(output, finalHtml);

