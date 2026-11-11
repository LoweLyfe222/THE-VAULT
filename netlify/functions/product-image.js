// Resolve an exact published Fourthwall product's public preview image.
// Fixed store hostname prevents arbitrary URL fetching.
const STORE = 'https://the-vault-bit-shop.fourthwall.com';
exports.handler = async (event) => {
  const slug = (event.queryStringParameters || {}).slug || '';
  if (!/^[a-z0-9][a-z0-9-]{1,140}$/.test(slug)) return {statusCode:400,body:'{}'};
  try {
    const res = await fetch(STORE + '/products/' + slug, {
      headers:{'Accept':'text/html','User-Agent':'Mozilla/5.0 (compatible; VaultCatalogImage/1.0)'},
      redirect:'follow',signal:AbortSignal.timeout(7000)
    });
    if (!res.ok) return {statusCode:404,headers:{'Content-Type':'application/json'},body:'{}'};
    const html = await res.text();
    const tags = [...html.matchAll(/<meta\s+[^>]*>/gi)].map(x=>x[0]);
    let candidate='';
    for (const tag of tags) {
      if (!/(?:property|name)\s*=\s*["'](?:og:image|twitter:image)["']/i.test(tag)) continue;
      candidate = (tag.match(/content\s*=\s*["']([^"']+)["']/i)||[])[1]||'';
      if (candidate) break;
    }
    candidate=candidate.replace(/&amp;/g,'&');
    if (!candidate) return {statusCode:404,headers:{'Content-Type':'application/json'},body:'{}'};
    const image = new URL(candidate,STORE);
    if (image.protocol !== 'https:') return {statusCode:404,body:'{}'};
    return {statusCode:200,headers:{'Content-Type':'application/json','Cache-Control':'public, max-age=3600'},body:JSON.stringify({image:image.href})};
  } catch {
    return {statusCode:502,headers:{'Content-Type':'application/json'},body:'{}'};
  }
};
