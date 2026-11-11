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
// Remove the single duplicate hat entry from the legacy liveCatalog array.
// The separate lower catalog listing and bottom featured hat remain untouched.
const legacyHatEntry = ' {"name": "Make Gas $2.40 Again Dad Hat", "brand": null, "category": "extras", "price": 26.99, "image": "https://warm-medovik-b368bb.netlify.app/assets/make-gas-cap.png", "cap": true}';
if (!restored.includes(legacyHatEntry)) throw new Error('Legacy top hat catalog entry not found — refusing to modify unrelated products');
const catalogWithoutUpperHat = restored.replace(legacyHatEntry, '');
const repaired = catalogWithoutUpperHat
  .replaceAll('https://warm-medovik-b368bb.netlify.app/assets/imperial-royal-dynasty.avif', '/assets/imperial-royal-dynasty.jpg')
  .replaceAll('https://warm-medovik-b368bb.netlify.app/assets/imperial-bad-boys.avif', '/assets/imperial-bad-boys.jpg');
fs.writeFileSync(output, repaired.replace('</body>', '<script defer src="/image-recovery.js"></script></body>'));
if (!fs.existsSync(path.join(assetsDir,'signature-angel-original.webp')) || !fs.existsSync(path.join(assetsDir,'make-gas-original.png'))) throw new Error('Original image files were not created');
console.log('V053 image fallback enabled; product catalog and checkout unchanged');


// Social-sharing thumbnail: reproduce the existing THEVAULT wordmark, without changing page UI.
const zlib = require('zlib');
const W=1200,H=630;
const pixels=Buffer.alloc(W*H*4);
for(let y=0;y<H;y++)for(let x=0;x<W;x++){const p=(y*W+x)*4;pixels[p]=8;pixels[p+1]=8;pixels[p+2]=8;pixels[p+3]=255;}
const glyphs={
'T':['11111','00100','00100','00100','00100','00100','00100'],
'H':['10001','10001','10001','11111','10001','10001','10001'],
'E':['11111','10000','10000','11110','10000','10000','11111'],
'V':['10001','10001','10001','10001','10001','01010','00100'],
'A':['01110','10001','10001','11111','10001','10001','10001'],
'U':['10001','10001','10001','10001','10001','10001','01110'],
'L':['10000','10000','10000','10000','10000','10000','11111']
};
function drawWord(word,x,y,scale,color){
for(const ch of word){const g=glyphs[ch];if(!g){x+=scale*3;continue;}
for(let row=0;row<7;row++)for(let col=0;col<5;col++)if(g[row][col]==='1')
for(let yy=y+row*scale;yy<y+(row+1)*scale;yy++)for(let xx=x+col*scale;xx<x+(col+1)*scale;xx++){const p=(yy*W+xx)*4;pixels[p]=color[0];pixels[p+1]=color[1];pixels[p+2]=color[2];}
x+=scale*6;
}}
const scale=23, total=8*6*scale-scale, start=Math.floor((W-total)/2);
drawWord('THE',start,235,scale,[246,246,242]);
drawWord('VAULT',start+3*6*scale,235,scale,[233,255,0]);
function crc(buf){let c=0xffffffff;for(const b of buf){c^=b;for(let i=0;i<8;i++)c=(c>>>1)^((c&1)?0xedb88320:0);}return (c^0xffffffff)>>>0;}
function chunk(type,data){const name=Buffer.from(type);const len=Buffer.alloc(4);len.writeUInt32BE(data.length);const check=Buffer.alloc(4);check.writeUInt32BE(crc(Buffer.concat([name,data])));return Buffer.concat([len,name,data,check]);}
const raw=Buffer.alloc(H*(W*4+1));for(let y=0;y<H;y++)pixels.copy(raw,y*(W*4+1)+1,y*W*4,(y+1)*W*4);
const ihdr=Buffer.alloc(13);ihdr.writeUInt32BE(W,0);ihdr.writeUInt32BE(H,4);ihdr[8]=8;ihdr[9]=6;
const png=Buffer.concat([Buffer.from([137,80,78,71,13,10,26,10]),chunk('IHDR',ihdr),chunk('IDAT',zlib.deflateSync(raw)),chunk('IEND',Buffer.alloc(0))]);
fs.writeFileSync(path.join(root,'vault-share-logo.png'),png);
const siteUrl='https://warm-medovik-b368bb.netlify.app/';
const socialMeta='<meta property="og:type" content="website"><meta property="og:title" content="THE VAULT — LoweLyfe Holdings LLC"><meta property="og:description" content="NOT MADE FOR EVERYONE."><meta property="og:url" content="'+siteUrl+'"><meta property="og:image" content="'+siteUrl+'vault-share-logo.png"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><meta name="twitter:card" content="summary_large_image"><meta name="twitter:image" content="'+siteUrl+'vault-share-logo.png">';
const finalHtml=fs.readFileSync(output,'utf8');
fs.writeFileSync(output,finalHtml.replace('</head>',socialMeta+'</head>'));
console.log('Social share preview image and metadata created');
