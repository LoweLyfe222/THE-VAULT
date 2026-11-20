// THE VAULT — in-site detail view for ESTOY long sleeve. Only this card is changed.
(()=>{
 const href='https://the-vault-bit-shop.fourthwall.com/products/estoy-aqui-trabajando-construction-crew-long-sleeve';
 const name='ESTOY AQUÍ TRABAJANDO – Construction Crew Long Sleeve';
 let imageUrl='';
 function make(tag,css,text){const e=document.createElement(tag);if(css)e.style.cssText=css;if(text)e.textContent=text;return e;}
 function openDetail(){
  if(document.getElementById('vault-estoy-detail'))return;
  const backdrop=make('div','position:fixed;inset:0;z-index:2147483646;background:rgba(0,0,0,.88);display:flex;align-items:center;justify-content:center;padding:14px;box-sizing:border-box;overflow-y:auto;');
  backdrop.id='vault-estoy-detail';backdrop.setAttribute('role','dialog');backdrop.setAttribute('aria-modal','true');backdrop.setAttribute('aria-label',name);
  const panel=make('section','position:relative;background:#141414;color:#fff;border:1px solid #b59a45;border-radius:14px;width:min(100%,520px);max-height:94vh;overflow-y:auto;padding:20px;box-sizing:border-box;font-family:system-ui,sans-serif;');
  const close=make('button','position:absolute;right:12px;top:10px;border:0;background:#303030;color:white;border-radius:50%;font-size:24px;width:40px;height:40px;cursor:pointer;','×');
  close.setAttribute('aria-label','Close product details');close.onclick=()=>backdrop.remove();panel.append(close);
  const img=make('img','display:block;width:100%;max-height:350px;object-fit:contain;background:#252525;border-radius:8px;margin:22px auto 14px;');
  img.alt=name;if(imageUrl)img.src=imageUrl;panel.append(img);
  panel.append(make('h2','font-size:20px;line-height:1.3;margin:8px 0;',name));
  panel.append(make('p','font-size:22px;color:#f0ce65;font-weight:700;margin:8px 0;','$42.99'));
  panel.append(make('p','font-size:14px;line-height:1.5;margin:12px 0;','Hard hats on. Safety vests up. Eyes on the job... well, most of the time! Construction-inspired blue-collar humor from THE VAULT.'));
  panel.append(make('p','font-size:14px;margin:12px 0 6px;','Choose your size'));
  const sizes=make('div','display:flex;flex-wrap:wrap;gap:8px;margin-bottom:16px;');
  let selected='';
  const buy=make('a','display:block;background:#d4af37;color:#111;font-weight:800;text-align:center;padding:14px;border-radius:7px;text-decoration:none;opacity:.55;pointer-events:none;','Select a size');
  for(const s of ['S','M','L','XL','2XL','3XL','4XL']){
   const b=make('button','border:1px solid #aaa;background:#262626;color:white;padding:10px 14px;border-radius:5px;cursor:pointer;',s);
   b.onclick=()=>{selected=s;for(const child of sizes.children){child.style.background='#262626';child.style.color='white';}b.style.background='#d4af37';b.style.color='#111';buy.style.opacity='1';buy.style.pointerEvents='auto';buy.textContent='Continue to secure checkout — '+s;};
   sizes.append(b);
  }
  panel.append(sizes);
  buy.href=href;buy.rel='noopener noreferrer';buy.target='_blank';
  buy.onclick=e=>{if(!selected)e.preventDefault();};
  panel.append(buy);
  panel.append(make('p','font-size:12px;color:#aaa;line-height:1.5;margin-top:10px;','Product details stay in THE VAULT. Secure checkout and final size confirmation are handled by Fourthwall.'));
  backdrop.append(panel);backdrop.onclick=e=>{if(e.target===backdrop)backdrop.remove();};document.body.append(backdrop);
  close.focus();
 }
 function insert(){
  if(document.getElementById('vault-estoy-long-sleeve'))return;
  const grid=document.querySelector('#productGrid');if(!grid)return;
  const card=make('article','background:#151515;color:#fff;border:1px solid #b59a45;border-radius:12px;padding:12px;display:flex;flex-direction:column;gap:10px;max-width:360px;');
  card.id='vault-estoy-long-sleeve';
  const button=make('button','border:0;background:transparent;color:inherit;text-align:left;display:flex;flex-direction:column;gap:10px;cursor:pointer;padding:0;');
  button.setAttribute('aria-label','View '+name+' inside THE VAULT');button.onclick=openDetail;
  const img=make('img','width:100%;aspect-ratio:1;object-fit:contain;background:#262626;border-radius:8px;');img.alt=name;img.loading='lazy';
  const label=make('strong','',name);const price=make('span','','$42.99');
  const shop=make('span','color:#f0ce65;text-decoration:underline;','View shirt & choose size');
  button.append(img,label,price,shop);card.append(button);grid.append(card);
  fetch('/.netlify/functions/fourthwall?fwpath='+encodeURIComponent('/products/estoy-aqui-trabajando-construction-crew-long-sleeve')+'&currency=USD')
   .then(r=>r.ok?r.json():null).then(p=>{if(!p)return;const candidates=[p.images?.[0],p.image,p.imageUrl,p.thumbnailUrl,p.variants?.[0]?.images?.[0]];for(const c of candidates){const u=typeof c==='string'?c:c?.url||c?.src||c?.imageUrl;if(typeof u==='string'&&u.startsWith('https://')){imageUrl=u;img.src=u;const detail=document.querySelector('#vault-estoy-detail img');if(detail)detail.src=u;break;}}}).catch(()=>{});
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',insert,{once:true});else insert();
 new MutationObserver(()=>{if(!document.getElementById('vault-estoy-long-sleeve'))insert()}).observe(document.documentElement,{childList:true,subtree:true});
})();
