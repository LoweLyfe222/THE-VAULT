// THE VAULT: show a clear, accessible fallback when a product photo URL is broken.
// This does not substitute an unapproved product photo or change checkout.
(() => {
  const fallback = (img) => {
    if (img.dataset.vaultImageFallback === '1') return;
    img.dataset.vaultImageFallback = '1';
    const name = (img.alt || 'Product').trim();
    const wrap = document.createElement('div');
    wrap.setAttribute('role','img');
    wrap.setAttribute('aria-label',name+' — product photo unavailable');
    wrap.style.cssText = 'display:flex;flex-direction:column;justify-content:center;align-items:center;gap:10px;box-sizing:border-box;width:100%;min-height:170px;padding:18px;background:#191919;border:1px solid #635536;color:#e3cd83;text-align:center;overflow-wrap:anywhere;font:600 13px/1.5 system-ui,sans-serif';
    const heading = document.createElement('span');
    heading.textContent = 'PRODUCT PHOTO COMING SOON';
    const caption = document.createElement('span');
    caption.textContent = name;
    caption.style.cssText = 'color:#eee;font-weight:400';
    wrap.append(heading,caption);
    img.replaceWith(wrap);
  };
  document.addEventListener('error', (event) => {
    const el = event.target;
    if (el && el.tagName === 'IMG') fallback(el);
  }, true);
  const scan = () => {
    document.querySelectorAll('img').forEach(img => {
      if (img.complete && img.naturalWidth === 0) fallback(img);
    });
  };
  scan();
  document.addEventListener('DOMContentLoaded',scan,{once:true});
})();
