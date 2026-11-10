const fs = require('fs');
const path = require('path');
const dir = __dirname;
const parts = ['index.part1.txt', 'index.part2.txt'];
for (const part of parts) if (!fs.existsSync(path.join(dir,part))) throw new Error('Missing '+part+' — upload both website parts before deploying');
const output = fs.createWriteStream(path.join(dir,'index.html'));
(async()=>{for (const part of parts){await new Promise((resolve,reject)=>{const input=fs.createReadStream(path.join(dir,part));input.on('error',reject);input.on('end',resolve);input.pipe(output,{end:false});});}output.end();})().catch(e=>{console.error(e);process.exitCode=1;});
