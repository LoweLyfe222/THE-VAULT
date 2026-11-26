// THE VAULT — storyboard clicks scroll to SHOP ALL PIECES. No catalog/checkout edits.
(function () {
  'use strict';
  function clean(s) { return String(s || '').replace(/\s+/g, ' ').trim().toUpperCase(); }
  function target() {
    const nodes = Array.from(document.querySelectorAll('h1,h2,h3,h4,h5,h6,a,button,[id],strong,span,div'));
    const exact = nodes.filter(el => clean(el.textContent) === 'SHOP ALL PIECES');
    const heading = exact.find(el => /^H[1-6]$/.test(el.tagName));
    if (heading) return heading;
    if (exact.length) return exact.sort((a,b) => a.textContent.length - b.textContent.length)[0];
    return nodes.find(el => /^H[1-6]$/.test(el.tagName) && clean(el.textContent).includes('SHOP ALL PIECES')) || null;
  }
  function isBoardClick(el) {
    if (!(el instanceof Element)) return false;
    // Only storyboard cards with a VIEW OUTFIT & PIECES action; never product cards.
    const cta = el.closest('a,button');
    if (cta && clean(cta.textContent).includes('VIEW OUTFIT') && clean(cta.textContent).includes('PIECES')) return true;
    for (let p=el, n=0; p && n<7; p=p.parentElement,n++) {
      if (!p.querySelectorAll) continue;
      const actions=Array.from(p.querySelectorAll('a,button'));
      if (actions.some(a => clean(a.textContent).includes('VIEW OUTFIT') && clean(a.textContent).includes('PIECES')) &&
          p.querySelector('img') && clean(p.textContent).length < 450) return true;
    }
    return false;
  }
  document.addEventListener('click', function (event) {
    if (!isBoardClick(event.target)) return;
    const section=target();
    if (!section) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    section.scrollIntoView({behavior:'smooth',block:'start'});
  }, true);
}());
