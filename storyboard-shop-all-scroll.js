// THE VAULT: storyboard navigation only. No product, cart, or layout changes.
(function () {
  'use strict';
  function label(node) {
    return (node && node.textContent || '').replace(/\s+/g, ' ').trim().toUpperCase();
  }
  function shopTarget() {
    const matches = Array.from(document.querySelectorAll('h1,h2,h3,h4,h5,h6,a,button,[id]'))
      .filter(el => label(el) === 'SHOP ALL PIECES');
    return matches.find(el => /^H[1-6]$/.test(el.tagName)) || matches[0] || null;
  }
  function storyboardLink(node) {
    if (!node || !node.closest) return null;
    const direct = node.closest('a,button');
    if (direct && /^VIEW OUTFIT\s*&\s*PIECES\s*(?:↗|→|›)?$/i.test((direct.textContent || '').trim())) return direct;
    // Image/card taps count only when the containing board has this exact CTA.
    let parent = node;
    for (let i = 0; parent && i < 5; i++, parent = parent.parentElement) {
      if (parent.querySelector) {
        const links = Array.from(parent.querySelectorAll('a,button'));
        const match = links.find(el => /^VIEW OUTFIT\s*&\s*PIECES\s*(?:↗|→|›)?$/i.test((el.textContent || '').trim()));
        if (match && parent.querySelector('img') && label(parent).length < 260) return match;
      }
    }
    return null;
  }
  document.addEventListener('click', function (event) {
    const link = storyboardLink(event.target);
    if (!link) return;
    const target = shopTarget();
    if (!target) return; // Never hijack a click if the destination is absent.
    event.preventDefault();
    event.stopPropagation();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, true);
}());
