// THE VAULT: storyboard boards -> SHOP ALL PIECES. Only storyboard navigation is changed.
(function () {
  'use strict';
  const norm = s => String(s || '').replace(/\s+/g, ' ').trim().toUpperCase();
  function shopAll() {
    // Search visible text rather than guessing an ID or heading tag.
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    let node;
    while ((node = walker.nextNode())) {
      if (norm(node.nodeValue) !== 'SHOP ALL PIECES') continue;
      const el = node.parentElement;
      if (!el || el.closest('script,style,template,[hidden]')) continue;
      return el.closest('section') || el.closest('header') || el;
    }
    // Common alternate label on the same storefront.
    for (const el of document.querySelectorAll('h1,h2,h3,h4,h5,h6,a,button')) {
      if (norm(el.textContent).includes('SHOP ALL PIECES')) return el;
    }
    return null;
  }
  function board(el) {
    if (!(el instanceof Element)) return false;
    // Don't intercept genuine product controls.
    if (el.closest('select,input,textarea,[data-product-id],[data-add-to-cart]')) return false;
    // Storyboard call-to-action or linked image/card.
    for (let p = el, depth = 0; p && depth < 9; p = p.parentElement, depth++) {
      const text = norm(p.textContent);
      if (text.includes('VIEW OUTFIT') && text.includes('PIECES') && text.length < 700) {
        if (el.closest('a,button') || p.querySelector('img')) return true;
      }
    }
    return false;
  }
  document.addEventListener('click', function (event) {
    if (!board(event.target)) return;
    // Stop broken board destinations even if the section is not found.
    event.preventDefault();
    event.stopImmediatePropagation();
    const target = shopAll();
    if (target) {
      target.scrollIntoView({behavior:'smooth',block:'start'});
    } else {
      // Shop heading may be dynamically rendered; do not send shopper to dead link.
      const possible = document.querySelector('[id*="shop" i], [id*="products" i], [class*="shop-all" i]');
      if (possible) possible.scrollIntoView({behavior:'smooth',block:'start'});
    }
  }, true);
}());
