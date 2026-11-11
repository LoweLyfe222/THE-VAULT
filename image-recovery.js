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
  document.addEventListener('DOMContentLoaded',scan,{once:true});
  scan();
})();
