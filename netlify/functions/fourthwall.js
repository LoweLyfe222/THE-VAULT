// Netlify Functions: proxy to Fourthwall Storefront API.
const BASE = 'https://storefront-api.fourthwall.com/v1';
exports.handler = async (event) => {
  const method = event.httpMethod || 'GET';
  if (!['GET', 'POST'].includes(method)) return {statusCode:405,body:JSON.stringify({error:'Method not allowed'})};
  const token = process.env.FOURTHWALL_STOREFRONT_TOKEN;
  if (!token) return {statusCode:503,headers:{'Content-Type':'application/json'},body:JSON.stringify({error:'Fourthwall Storefront token not configured for this deploy context'})};
  const tail = (event.queryStringParameters || {}).fwpath || '';
  if (!/^\/(?:products(?:\/[^/?]+)?|collections(?:\/[^/?]+(?:\/products)?)?|carts(?:\/[^/?]+(?:\/(?:add|remove|change))?)?|shop)(?:\?.*)?$/.test(tail))
    return {statusCode:404,headers:{'Content-Type':'application/json'},body:JSON.stringify({error:'Unsupported storefront path'})};
  const url = new URL(BASE + tail);
  for (const [k,v] of Object.entries(event.queryStringParameters || {}))
    if (!['storefront_token','fwpath'].includes(k) && v != null) url.searchParams.set(k,v);
  url.searchParams.set('storefront_token',token);
  if (!url.searchParams.has('currency')) url.searchParams.set('currency','USD');
  try {
    const res = await fetch(url,{method,headers:{'Content-Type':'application/json'},body:method==='POST'?(event.body||'{}'):undefined});
    const response = await res.text();
    return {statusCode:res.status,headers:{'Content-Type':res.headers.get('content-type')||'application/json','Cache-Control':'no-store'},body:response};
  } catch (e) {
    return {statusCode:502,headers:{'Content-Type':'application/json'},body:JSON.stringify({error:'Fourthwall service unreachable'})};
  }
};
