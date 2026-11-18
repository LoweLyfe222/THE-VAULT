// Add only the newly approved Fourthwall long sleeve to THE VAULT.
(()=>{
 const href='https://the-vault-bit-shop.fourthwall.com/products/estoy-aqui-trabajando-construction-crew-long-sleeve';
 const name='ESTOY AQUÍ TRABAJANDO – Construction Crew Long Sleeve';
 function insert(){
  if(document.getElementById('vault-estoy-long-sleeve'))return;
  const grid=document.querySelector('#productGrid');
  if(!grid)return;
  const card=document.createElement('article');card.id='vault-estoy-long-sleeve';
  card.style.cssText='background:#151515;color:#fff;border:1px solid #b59a45;border-radius:12px;padding:12px;display:flex;flex-direction:column;gap:10px;max-width:360px';
  const link=document.createElement('a');link.href=href;link.target='_blank';link.rel='noopener noreferrer';link.style.cssText='color:inherit;text-decoration:none;display:flex;flex-direction:column;gap:10px';
  const img=document.createElement('img');img.alt=name;img.loading='lazy';img.style.cssText='width:100%;aspect-ratio:1;object-fit:contain;background:#262626;border-radius:8px';
  const label=document.createElement('strong');label.textContent=name;
  const price=document.createElement('span');price.textContent='$42.99';
  const shop=document.createElement('span');shop.textContent='View shirt & choose size';shop.style.cssText='color:#f0ce65;text-decoration:underline';
  link.append(img,label,price,shop);card.append(link);grid.append(card);
  fetch('/.netlify/functions/fourthwall?fwpath='+encodeURIComponent('/products/estoy-aqui-trabajando-construction-crew-long-sleeve')+'&currency=USD')
   .then(r=>r.ok?r.json():null).then(p=>{if(!p)return;const candidates=[p.images?.[0],p.image,p.imageUrl,p.thumbnailUrl,p.variants?.[0]?.images?.[0]];for(const c of candidates){const u=typeof c==='string'?c:c?.url||c?.src||c?.imageUrl;if(typeof u==='string'&&u.startsWith('https://')){img.src=u;break;}}}).catch(()=>{});
 }
 document.addEventListener('DOMContentLoaded',insert,{once:true});
 new MutationObserver(()=>{if(!document.getElementById('vault-estoy-long-sleeve'))insert()}).observe(document.documentElement,{childList:true,subtree:true});
})();
