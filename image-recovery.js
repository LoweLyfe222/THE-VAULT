// THE VAULT — recover missing photos from the matching published Fourthwall product.
// No unrelated images, price changes, or checkout changes.
(() => {
  const cache = new Map();
  const productSlug = (img) => {
    try {
      const url = new URL(img.currentSrc || img.src, location.href);
      const file = url.pathname.split('/').pop() || '';
      return file.replace(/\.(webp|png|jpg|jpeg|avif)$/i, '');
    } catch { return ''; }
  };
  const imageUrl = (data) => {
    const candidates = [
      data?.images?.[0], data?.images?.[0]?.url, data?.images?.[0]?.src,
      data?.images?.[0]?.imageUrl, data?.images?.[0]?.originalUrl,
      data?.image, data?.imageUrl, data?.thumbnailUrl,
      data?.media?.[0], data?.media?.[0]?.url,
      data?.variants?.[0]?.images?.[0]
    ];
    for (const c of candidates) {
      const url = typeof c === 'string' ? c : (c?.url || c?.src || c?.imageUrl || c?.originalUrl);
      if (typeof url === 'string' && /^https:\/\//i.test(url)) return url;
    }
    return '';
  };
  const fetchImage = (slug) => {
    if (!cache.has(slug)) {
      const p = fetch('/.netlify/functions/fourthwall?fwpath=' +
        encodeURIComponent('/products/' + slug) + '&currency=USD')
        .then(r => r.ok ? r.json() : null).then(imageUrl).catch(() => '');
      cache.set(slug, p);
    }
    return cache.get(slug);
  };

  // User-supplied real hoodie mockups (embedded previews; no network dependency).
  const supplied = {
    'imperial-bad-boys': 'data:image/jpeg;base64,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',
    'imperial-royal-dynasty': 'data:image/jpeg;base64,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'
  };
  const installSupplied = (img) => {
    const key = productSlug(img);
    if (!supplied[key]) return false;
    img.onerror = null;
    img.src = supplied[key];
    return true;
  };
  const placeholder = (img) => {
    if (!img.isConnected) return;
    const wrap = document.createElement('div');
    wrap.setAttribute('role','img');
    wrap.setAttribute('aria-label',(img.alt || 'Product')+' — product photo unavailable');
    wrap.style.cssText='display:flex;flex-direction:column;justify-content:center;align-items:center;gap:10px;box-sizing:border-box;width:100%;min-height:170px;padding:18px;background:#191919;border:1px solid #635536;color:#e3cd83;text-align:center;overflow-wrap:anywhere;font:600 13px/1.5 system-ui,sans-serif';
    const heading=document.createElement('span');heading.textContent='PRODUCT PHOTO COMING SOON';
    const caption=document.createElement('span');caption.textContent=img.alt||'Product';
    caption.style.cssText='color:#eee;font-weight:400';
    wrap.append(heading,caption);
    img.replaceWith(wrap);
  };
  const repairing = new WeakSet();
  const repair = async (img) => {
    if (repairing.has(img) || !img.isConnected) return;
    repairing.add(img);
    if (installSupplied(img)) return;
    const slug = ({'imperial-royal-dynasty':'imperial-meditation-royal-dynasty-hoodie-black','imperial-bad-boys':'imperial-meditation-bad-boys-hoodie-black'}[productSlug(img)] || productSlug(img));
    if (!slug || !/\/assets\//.test(img.src)) { placeholder(img); return; }
    let url = await fetchImage(slug);
    if (!url) {
      try {
        const response = await fetch('/.netlify/functions/product-image?slug=' + encodeURIComponent(slug));
        if (response.ok) url = (await response.json()).image || '';
      } catch {}
    }
    if (!img.isConnected) return;
    if (!url || url === img.src) { placeholder(img); return; }
    img.onerror = () => placeholder(img);
    img.onload = () => { img.onerror = null; };
    img.src = url;
  };
  document.addEventListener('error', e => {
    if (e.target?.tagName === 'IMG') repair(e.target);
  }, true);
  const scan=()=>document.querySelectorAll('img').forEach(img=>{
    if (img.complete && img.naturalWidth===0) repair(img);
  });

  // Decode escaped Fourthwall rich-text descriptions as plain text, not executable HTML.
  const tidyDescriptions = () => {
    document.querySelectorAll('dialog, [role="dialog"]').forEach(dialog => {
      dialog.querySelectorAll('p, div').forEach(el => {
        if (el.children.length) return;
        const raw=el.textContent || '';
        if (!/^\s*<p[ >]/i.test(raw) || !/<\/p>/i.test(raw)) return;
        const parsed=new DOMParser().parseFromString(raw,'text/html');
        const lines=[...parsed.body.querySelectorAll('p')].map(p=>p.textContent.trim()).filter(Boolean);
        if (lines.length) el.textContent=lines.join('\n\n');
        el.style.whiteSpace='pre-line';
      });
    });
  };
  document.addEventListener('click',()=>setTimeout(tidyDescriptions,0),true);
  document.addEventListener('DOMContentLoaded',tidyDescriptions,{once:true});


  // Product detail image synchronization: use the exact corresponding catalog card image
  // whenever a detail modal has a missing or failed image. Never substitute other artwork.
  const normalizeTitle = value => (value || '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
  const productCards = () => [...document.querySelectorAll('#productGrid > *, .product-card, [class*="product-card"], [class*="vault-product"]')]
    .filter(el => el.querySelector('img') && el.querySelector('h2,h3,h4'));
  const syncDetails = () => {
    const cards = productCards();
    document.querySelectorAll('dialog, [role="dialog"], [class*="modal"]').forEach(modal => {
      if (modal.offsetWidth === 0 || modal.offsetHeight === 0) return;
      const heading = modal.querySelector('h1,h2,h3');
      if (!heading) return;
      const title = normalizeTitle(heading.textContent);
      if (!title) return;
      const card = cards.find(el => {
        const h=el.querySelector('h2,h3,h4');
        return h && normalizeTitle(h.textContent) === title;
      });
      if (!card) return;
      const source = card.querySelector('img');
      if (!source || !source.complete || !source.naturalWidth) return;
      const src = source.currentSrc || source.src;
      if (!src) return;
      const broken = [...modal.querySelectorAll('img')].filter(img => img.complete && !img.naturalWidth);
      broken.forEach(img => { img.onerror=null; img.src=src; });
      modal.querySelectorAll('[role="img"]').forEach(el => {
        if (!/PRODUCT PHOTO COMING SOON/i.test(el.textContent || '')) return;
        const img=document.createElement('img');
        img.alt=heading.textContent.trim();
        img.src=src;
        img.style.cssText='display:block;width:100%;height:auto;max-height:70vh;object-fit:contain';
        el.replaceWith(img);
      });
    });
  };
  let syncPending=false;
  const scheduleSync=()=>{
    if(syncPending)return;
    syncPending=true;
    setTimeout(()=>{syncPending=false;syncDetails();},80);
  };
  new MutationObserver(scheduleSync).observe(document.documentElement,{childList:true,subtree:true,attributes:true,attributeFilter:['src','open','class','style']});
  document.addEventListener('click',scheduleSync,true);
  document.addEventListener('DOMContentLoaded',scheduleSync,{once:true});


  // Fix the actual four outstanding missing catalog photos, not unrelated products.
  // The hat already has an authentic image embedded in its existing detail dialog.
  const exactMissing = {
    'imperial-meditation-saints-sinners-tee-red':'Saints & Sinners Tee — Red',
    'imperial-meditation-royale-with-gold-tee-white':'Royale With Gold Tee — White',
    '74f7a5565d40943399281ec1':'Signature Angel Heavyweight Hoodie'
  };
  const getRecords = data => {
    const roots=[data?.products,data?.results,data?.items,data?.data?.products,data?.data?.results,data?.data?.items,data?.data,data];
    for(const root of roots) {
      if(Array.isArray(root))return root;
      if(Array.isArray(root?.items))return root.items;
      if(Array.isArray(root?.results))return root.results;
    }
    return [];
  };
  const sameName = v => String(v||'').toLowerCase().replace(/&/g,'and').replace(/[^a-z0-9]/g,'');
  let publishedProducts;
  const findPublishedPhoto = async title => {
    if(!publishedProducts)publishedProducts=fetch('/.netlify/functions/fourthwall?fwpath=%2Fproducts&currency=USD')
      .then(r=>r.ok?r.json():null).then(getRecords).catch(()=>[]);
    const list=await publishedProducts;
    const match=list.find(p=>sameName(p.name||p.title)===sameName(title) ||
      sameName(p.name||p.title).endsWith(sameName(title)));
    if(!match)return '';
    let url=imageUrl(match);
    if(!url && (match.slug||match.handle))url=await fetchImage(match.slug||match.handle);
    return url;
  };
  const restoreHat = () => {
    const original=document.querySelector('#vault-cap-detail img[src^="data:image/"]');
    if(!original)return;
    document.querySelectorAll('img').forEach(img=>{
      if(/\/assets\/make-gas-cap\.png(?:\?|$)/.test(img.src)) {
        img.onerror=null;
        img.src=original.src;
      }
    });
    document.querySelectorAll('[role="img"]').forEach(el=>{
      if(!/PRODUCT PHOTO COMING SOON/i.test(el.textContent||'') ||
        !/Make Gas \$2\.40 Again Dad Hat/i.test(el.textContent||''))return;
      const img=document.createElement('img');
      img.src=original.src;img.alt='Make Gas $2.40 Again Dad Hat';
      img.style.cssText='display:block;width:100%;height:auto;object-fit:contain';
      el.replaceWith(img);
    });
  };
  const missingPhotoRecovery = async () => {
    restoreHat();
    const placeholders=[...document.querySelectorAll('[role="img"]')].filter(el=>
      /PRODUCT PHOTO COMING SOON/i.test(el.textContent||''));
    for(const el of placeholders){
      const title=Object.values(exactMissing).find(t=>sameName(el.textContent).includes(sameName(t)));
      if(!title || el.dataset.photoRecoveryAttempted)return;
      el.dataset.photoRecoveryAttempted='1';
      const photo=await findPublishedPhoto(title);
      if(!photo || !el.isConnected)return;
      const img=document.createElement('img');
      img.alt=title;img.src=photo;
      img.style.cssText='display:block;width:100%;height:auto;object-fit:contain';
      img.onerror=()=>img.replaceWith(el);
      el.replaceWith(img);
    }
  };
  document.addEventListener('DOMContentLoaded',missingPhotoRecovery,{once:true});
  document.addEventListener('click',()=>setTimeout(missingPhotoRecovery,120),true);


  // The original V053 page already contains the APPROVED Signature Angel hoodie
  // mockup as a data URI in its feature-gallery template. Reuse those exact bytes.
  const originalArtwork = {};
  const locateOriginalArtwork = () => {
    if(!originalArtwork.angel) {
      const gallery=document.querySelector('.vault-v009-main');
      if(gallery?.src?.startsWith('data:image/'))originalArtwork.angel=gallery.src;
      if(!originalArtwork.angel)for(const script of document.scripts){
        const source=script.textContent||'';
        const at=source.indexOf('class="vault-v009-main" src="data:image/');
        if(at<0)continue;
        const beginning=source.indexOf('src="',at)+5;
        const end=source.indexOf('"',beginning);
        if(end>beginning)originalArtwork.angel=source.slice(beginning,end);
        break;
      }
    }
    if(!originalArtwork.hat) {
      const hat=document.querySelector('#vault-cap-detail img[src^="data:image/"]');
      if(hat)originalArtwork.hat=hat.src;
    }
  };
  const restoreOriginalPhotos=()=>{
    locateOriginalArtwork();
    const replacements=[
      {title:'Signature Angel Heavyweight Hoodie',url:originalArtwork.angel,pattern:/74f7a5565d40943399281ec1/i},
      {title:'Make Gas $2.40 Again Dad Hat',url:originalArtwork.hat,pattern:/make-gas-cap/i}
    ];
    for(const item of replacements){
      if(!item.url)continue;
      document.querySelectorAll('img').forEach(img=>{
        if(item.pattern.test(img.getAttribute('src')||'') || item.pattern.test(img.alt||'')){
          if(img.src!==item.url){img.onerror=null;img.src=item.url;}
        }
      });
      document.querySelectorAll('[role="img"]').forEach(el=>{
        if(!/PRODUCT PHOTO COMING SOON/i.test(el.textContent||''))return;
        if(!sameName(el.textContent).includes(sameName(item.title)))return;
        const img=document.createElement('img');
        img.src=item.url;img.alt=item.title;
        img.style.cssText='display:block;width:100%;height:auto;object-fit:contain';
        el.replaceWith(img);
      });
    }
  };
  let originalPhotosPending=false;
  const queueOriginalPhotos=()=>{
    if(originalPhotosPending)return;
    originalPhotosPending=true;
    setTimeout(()=>{originalPhotosPending=false;restoreOriginalPhotos();},30);
  };
  new MutationObserver(queueOriginalPhotos).observe(document.documentElement,{childList:true,subtree:true});
  document.addEventListener('DOMContentLoaded',restoreOriginalPhotos,{once:true});
  document.addEventListener('click',queueOriginalPhotos,true);
  restoreOriginalPhotos();


  // Authoritative fix for the two original, approved product assets.
  // Apply directly to both product cards and detail dialogs, including already
  // replaced placeholders; do not depend on Fourthwall API or failed-image timing.
  const approvedPhotoPaths = [
    ['Signature Angel Heavyweight Hoodie','/assets/signature-angel-original.webp'],
    ['Make Gas $2.40 Again Dad Hat','/assets/make-gas-original.png']
  ];
  const approvedKey = x => String(x||'').toLowerCase().replace(/[^a-z0-9]+/g,'');
  const approvedPhotoRepair = () => {
    for(const [title,path] of approvedPhotoPaths) {
      const key=approvedKey(title);
      const nodes=document.querySelectorAll('[role="img"],img');
      for(const node of nodes){
        const isPlaceholder=node.getAttribute('role')==='img' &&
          /PRODUCT PHOTO COMING SOON/i.test(node.textContent||'');
        const alt=node.getAttribute('alt')||node.getAttribute('aria-label')||'';
        const matches=approvedKey(alt).includes(key) ||
          (isPlaceholder && approvedKey(node.textContent).includes(key));
        if(!matches)continue;
        if(node.tagName==='IMG') {
          if(!node.src.endsWith(path)){node.onerror=null;node.src=path;}
        } else if(isPlaceholder) {
          const img=document.createElement('img');
          img.src=path;img.alt=title;
          img.style.cssText='display:block;width:100%;height:auto;object-fit:contain';
          node.replaceWith(img);
        }
      }
    }
  };
  let approvedRepairQueued=false;
  const queueApprovedRepair=()=>{
    if(approvedRepairQueued)return;
    approvedRepairQueued=true;
    setTimeout(()=>{approvedRepairQueued=false;approvedPhotoRepair();},50);
  };
  new MutationObserver(queueApprovedRepair).observe(document.documentElement,{subtree:true,childList:true});
  document.addEventListener('DOMContentLoaded',approvedPhotoRepair,{once:true});
  document.addEventListener('click',queueApprovedRepair,true);
  approvedPhotoRepair();

  document.addEventListener('DOMContentLoaded',scan,{once:true});
  scan();
})();


// Hide ONLY the duplicate Signature Angel catalog tile with the missing-photo
// placeholder. Keep the approved featured hoodie/gallery and its checkout intact.
(() => {
  const removeDuplicateAngelTile = () => {
    const placeholders = [...document.querySelectorAll('[role="img"],div,span')]
      .filter(el => el.children.length < 4 &&
        /PRODUCT PHOTO COMING SOON/i.test(el.textContent || '') &&
        /Signature Angel Heavyweight Hoodie/i.test(el.textContent || ''));
    for (const placeholder of placeholders) {
      let card = placeholder;
      for (let i = 0; i < 7 && card; i++, card = card.parentElement) {
        const content = card.textContent || '';
        if (/Signature Angel Heavyweight Hoodie/i.test(content) &&
            /VIEW DETAILS/i.test(content) &&
            /69\\.99/.test(content) &&
            content.length < 1100) {
          card.style.setProperty('display', 'none', 'important');
          card.setAttribute('data-hidden-duplicate-angel', 'true');
          break;
        }
      }
    }
  };
  let pending = false;
  const queue = () => {
    if (pending) return;
    pending = true;
    setTimeout(() => { pending = false; removeDuplicateAngelTile(); }, 80);
  };
  new MutationObserver(queue).observe(document.documentElement, { childList: true, subtree: true });
  document.addEventListener('DOMContentLoaded',removeDuplicateAngelTile,{once:true});
  removeDuplicateAngelTile();
})();


// Owner-approved hat navigation: the large featured hat and yellow CTA jump
// to the existing small red hat catalog listing. No product data is changed.
(() => {
  const hatTitle = /Make Gas \$2\.40 Again Dad Hat/i;
  const findSmallHatCard = () => {
    const buttons = [...document.querySelectorAll('button,a,[role="button"]')];
    for (const button of buttons) {
      if (!/^VIEW DETAILS/i.test((button.textContent || '').trim())) continue;
      let node = button.parentElement;
      for (let i = 0; node && i < 7; i++, node = node.parentElement) {
        const text = node.textContent || '';
        if (hatTitle.test(text) && text.length < 800) return node;
      }
    }
    return null;
  };
  const findFeaturedPanel = () => {
    const cta = [...document.querySelectorAll('button,a,[role="button"]')]
      .find(el => /VIEW THE \$2\.40 HAT/i.test(el.textContent || ''));
    if (!cta) return null;
    let node = cta.parentElement;
    for (let i = 0; node && i < 6; i++, node = node.parentElement) {
      const text = node.textContent || '';
      if (hatTitle.test(text) && node.querySelector('img') && text.length < 1200) return node;
    }
    return cta.parentElement;
  };
  document.addEventListener('click', event => {
    const featured = findFeaturedPanel();
    if (!featured || !featured.contains(event.target)) return;
    const cta = event.target.closest('button,a,[role="button"]');
    const isCta = cta && /VIEW THE \$2\.40 HAT/i.test(cta.textContent || '');
    const isHatImage = !!event.target.closest('img') &&
      !!featured.querySelector('img') &&
      (event.target.closest('img') === featured.querySelector('img'));
    if (!isCta && !isHatImage) return;
    const target = findSmallHatCard();
    if (!target) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    const details = [...target.querySelectorAll('button,a,[role="button"]')]
      .find(el => /^VIEW DETAILS/i.test((el.textContent || '').trim()));
    if (details) details.click();
  }, true);
})();


// Owner correction: hide the small red hat tile in the product grid ONLY.
// Preserve the large featured/bottom hat, its details and the existing cart.
(() => {
  function hideSmallHatCatalogCard() {
    for (const el of document.querySelectorAll('button,a,[role="button"]')) {
      if (!/^VIEW DETAILS/i.test((el.textContent || '').trim())) continue;
      let card = el.parentElement;
      for (let depth=0; card && depth<7; depth++,card=card.parentElement) {
        const t=card.textContent || '';
        if (t.length < 850 && /Make Gas \$2\.40 Again Dad Hat/i.test(t) &&
            /VIEW DETAILS/i.test(t)) {
          card.style.setProperty('display','none','important');
          card.setAttribute('data-hidden-duplicate-hat','true');
          break;
        }
      }
    }
  }
  if (document.readyState==='loading') {
    document.addEventListener('DOMContentLoaded',()=>setTimeout(hideSmallHatCatalogCard,150),{once:true});
  } else setTimeout(hideSmallHatCatalogCard,150);
})();


// Mobile cart-only layout repair. No changes to cart data or checkout behavior.
(() => {
  const css = `
  @media(max-width:700px) {
    .vault-mobile-cart-repaired {
      box-sizing:border-box!important;
      width:calc(100vw - 28px)!important;
      max-width:calc(100vw - 28px)!important;
      max-height:calc(100dvh - 36px)!important;
      overflow-x:hidden!important;
      overflow-y:auto!important;
      padding:18px 14px!important;
    }
    .vault-mobile-cart-repaired, .vault-mobile-cart-repaired * {
      box-sizing:border-box!important;
      min-width:0!important;
      overflow-wrap:break-word!important;
      word-break:normal!important;
    }
    .vault-mobile-cart-repaired .vault-mobile-cart-item {
      display:flex!important;
      flex-direction:column!important;
      align-items:stretch!important;
      gap:12px!important;
      width:100%!important;
      max-width:100%!important;
      overflow:visible!important;
    }
    .vault-mobile-cart-repaired .vault-mobile-cart-item > * {
      width:100%!important;
      max-width:100%!important;
      min-width:0!important;
      flex:0 1 auto!important;
    }
    .vault-mobile-cart-repaired .vault-mobile-cart-item img,
    .vault-mobile-cart-repaired .vault-mobile-cart-item [role="img"] {
      display:block!important;
      width:100%!important;
      max-width:100%!important;
      height:auto!important;
      max-height:170px!important;
      object-fit:contain!important;
    }
    .vault-mobile-cart-repaired .vault-mobile-cart-item [role="img"] {
      overflow:hidden!important;
      font-size:13px!important;
    }
  }`;
  const style=document.createElement('style');
  style.textContent=css;
  document.head.appendChild(style);
  function repairCart() {
    if (window.innerWidth>700) return;
    const heading=[...document.querySelectorAll('h1,h2,h3,h4,[role="heading"]')]
      .find(el=>/THE VAULT\\s*[·•-]\\s*YOUR CART/i.test(el.textContent||''));
    if(!heading)return;
    let modal=heading.parentElement;
    for(let i=0;modal&&i<7;i++,modal=modal.parentElement){
      if(modal.querySelector('[role="img"],img') && /REMOVE/i.test(modal.textContent||''))break;
    }
    if(!modal)return;
    modal.classList.add('vault-mobile-cart-repaired');
    for(const remove of modal.querySelectorAll('button,a')) {
      if(!/^REMOVE$/i.test((remove.textContent||'').trim()))continue;
      let row=remove.parentElement;
      for(let i=0;row&&i<7;i++,row=row.parentElement){
        if(row===modal)break;
        const hasImage=!!row.querySelector('img,[role="img"]');
        const hasPrice=/\\$[0-9]/.test(row.textContent||'');
        if(hasImage&&hasPrice) {
          row.classList.add('vault-mobile-cart-item');
          break;
        }
      }
    }
  }
  document.addEventListener('click',()=>setTimeout(repairCart,100),true);
  document.addEventListener('DOMContentLoaded',repairCart,{once:true});
  repairCart();
})();
