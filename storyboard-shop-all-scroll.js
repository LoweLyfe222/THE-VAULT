// THE VAULT — TEMPORARILY HIDE STORYBOARDS. Restore previous GitHub version to re-enable.
// This script is loaded by assemble-site.js. It does not edit product/catalog/checkout data.
(function () {
  'use strict';
  const normalize = value => String(value || '').replace(/\s+/g, ' ').trim().toUpperCase();
  const isStoryboardCTA = el => {
    const text = normalize(el.textContent);
    return text.includes('VIEW OUTFIT') && text.includes('PIECES') && text.length < 100;
  };
  function hideBoards() {
    // Scope exclusively to cards containing the known storyboard CTA.
    const links = document.querySelectorAll('a, button');
    for (const link of links) {
      if (!isStoryboardCTA(link)) continue;
      // Find the nearest containing storyboard card, never a whole collection or product grid.
      let card = null;
      for (let el = link.parentElement, depth = 0; el && depth < 6; el = el.parentElement, depth++) {
        if (el.matches('main,section,body,html')) break;
        if (!el.querySelector('img')) continue;
        if (normalize(el.textContent).length > 600) break;
        card = el;
        break;
      }
      if (card && !card.hasAttribute('data-vault-storyboard-hidden')) {
        card.setAttribute('data-vault-storyboard-hidden', 'true');
        card.style.setProperty('display', 'none', 'important');
      } else if (!card && !link.hasAttribute('data-vault-storyboard-hidden')) {
        // Safe fallback: hide only the broken storyboard link, not surrounding shopping content.
        link.setAttribute('data-vault-storyboard-hidden', 'true');
        link.style.setProperty('display', 'none', 'important');
      }
    }
  }
  function start() {
    hideBoards();
    const observer = new MutationObserver(() => hideBoards());
    observer.observe(document.body, {childList:true, subtree:true});
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, {once:true});
  else start();
}());
