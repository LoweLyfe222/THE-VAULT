// Add the owner's second construction-series shirt only when Fourthwall returns its real listing.
(()=>{
 const id='2e2459c8-0f0a-47f3-9d59-85b1da51add0';
 const host='https://the-vault-bit-shop.fourthwall.com';
 const key='vault-construction-'+id.slice(0,8);
 const photoOf=p=>{for(const c of [p.images?.[0],p.image,p.imageUrl,p.thumbnailUrl,p.variants?.[0]?.images?.[0]]){const u=typeof c==='string'?c:c?.url||c?.src||c?.imageUrl;if(typeof u==='string'&&/^https:\/\//.test(u))return u;}return '';};
 const make=(tag,css,text)=>{const e=document.createElement(tag);if(css)e.style.cssText=css;if(text)e.textContent=text;return e;};
 function mount(p){
  if(document.getElementById(key))return;
  const grid=document.querySelector('#productGrid');if(!grid)return;
  const name=String(p.name||p.title||'').trim(), slug=String(p.slug||p.handle||'');
  if(!name||!/^[a-z0-9-]+$/.test(slug))return;
  const priceValue=p.price?.amount??p.price?.value??p.price??p.variants?.[0]?.price?.amount??p.variants?.[0]?.price;
  const priceNumber=Number(priceValue);
  const price=Number.isFinite(priceNumber)&&priceNumber>0?'$'+priceNumber.toFixed(2):'See price at checkout';
  const photo=photoOf(p);
  const card=make('article','background:#151515;color:white;border:1px solid #b59a45;border-radius:12px;padding:12px;display:flex;flex-direction:column;gap:10px;max-width:360px;');card.id=key;
  const button=make('button','border:0;background:transparent;color:inherit;text-align:left;display:flex;flex-direction:column;gap:10px;cursor:pointer;padding:0;');
  const img=make('img','width:100%;aspect-ratio:1;object-fit:contain;background:#262626;border-radius:8px;');img.alt=name;img.loading='lazy';if(photo)img.src=photo;
  button.append(img,make('strong','',name),make('span','',price),make('span','color:#f0ce65;text-decoration:underline;','View shirt & details'));
  button.onclick=()=>{
   if(document.getElementById(key+'-detail'))return;
   const overlay=make('div','position:fixed;inset:0;z-index:2147483646;background:rgba(0,0,0,.9);display:flex;align-items:center;justify-content:center;padding:14px;box-sizing:border-box;');
   overlay.id=key+'-detail';overlay.setAttribute('role','dialog');overlay.setAttribute('aria-modal','true');
   const panel=make('section','position:relative;background:#141414;color:white;border:1px solid #b59a45;border-radius:14px;padding:20px;width:min(100%,520px);max-height:92vh;overflow-y:auto;box-sizing:border-box;font-family:system-ui,sans-serif;');
   const close=make('button','position:absolute;right:12px;top:8px;border:0;background:#303030;color:white;border-radius:50%;width:40px;height:40px;font-size:24px;','×');close.setAttribute('aria-label','Close');close.onclick=()=>overlay.remove();panel.append(close);
   const big=make('img','width:100%;max-height:350px;object-fit:contain;margin:25px auto 12px;');big.alt=name;if(photo)big.src=photo;panel.append(big);
   panel.append(make('h2','font-size:20px;margin:8px 0;',name),make('p','font-size:22px;color:#f0ce65;',price));
   panel.append(make('p','font-size:14px;margin:12px 0 8px;','Choose your size'));
   const sizes=make('div','display:flex;flex-wrap:wrap;gap:8px;margin-bottom:14px;');
   let selected='';
   const checkout=make('a','display:block;background:#d4af37;color:#111;text-align:center;text-decoration:none;font-weight:bold;border-radius:7px;padding:14px;margin-top:16px;opacity:.55;pointer-events:none;','Select a size to continue');
   for(const size of ['S','M','L','XL','2XL','3XL','4XL']){
    const option=make('button','border:1px solid #aaa;background:#262626;color:white;padding:10px 14px;border-radius:5px;cursor:pointer;',size);
    option.onclick=()=>{selected=size;for(const el of sizes.children){el.style.background='#262626';el.style.color='white';}option.style.background='#d4af37';option.style.color='#111';checkout.style.opacity='1';checkout.style.pointerEvents='auto';checkout.textContent='Continue to secure checkout — '+size;};
    sizes.append(option);
   }
   panel.append(sizes);
   checkout.href=host+'/products/'+slug;checkout.target='_blank';checkout.rel='noopener noreferrer';
   checkout.onclick=e=>{if(!selected)e.preventDefault();};
   panel.append(checkout);
   panel.append(make('p','font-size:12px;color:#aaa;','Product browsing and size preview stay in THE VAULT. Confirm the available size and complete secure payment at Fourthwall.'));
   overlay.append(panel);overlay.onclick=e=>{if(e.target===overlay)overlay.remove();};document.body.append(overlay);
  };
  card.append(button);grid.append(card);
 }
 function load(){
  fetch('/.netlify/functions/fourthwall?fwpath=%2Fproducts&currency=USD')
   .then(r=>r.ok?r.json():null).then(data=>{
    const roots=[data?.products,data?.results,data?.items,data?.data?.products,data?.data?.items,data?.data,data];
    const list=roots.find(Array.isArray)||roots.map(x=>x?.items||x?.results).find(Array.isArray)||[];
    const p=list.find(x=>String(x.id||x.productId||x.uuid||'')===id);
    if(p){mount(p);new MutationObserver(()=>{if(!document.getElementById(key))mount(p);}).observe(document.documentElement,{childList:true,subtree:true});}
   }).catch(()=>{});
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',load,{once:true});else load();
})();
