// Netlify same-origin proxy for Fourthwall's public Storefront API.
// Set FOURTHWALL_STOREFRONT_TOKEN in Netlify environment variables.
const BASE = 'https://storefront-api.fourthwall.com';
exports.handler = async (event) => {
  const method = event.httpMethod || 'GET';
  if (!['GET','POST'].includes(method)) return {statusCode:405,body:JSON.stringify({error:'Method not allowed'})};
  const tail = (event.queryStringParameters || {}).fwpath || '';
  if (!/^\/(products|collections|carts)(?:\/|\?|$)/.test(tail)) return {statusCode:404,body:JSON.stringify({error:'Unsupported storefront path'})};
  const token = process.env.FOURTHWALL_STOREFRONT_TOKEN;
  if (!token) return {statusCode:503,headers:{'Content-Type':'application/json'},body:JSON.stringify({error:'Fourthwall storefront token is not configured'})};
  const url = new URL(BASE + '/v1' + tail);
  for (const [k,v] of Object.entries(event.queryStringParameters || {})) if (!['storefront_token','fwpath'].includes(k)) url.searchParams.set(k,v);
  url.searchParams.set('storefront_token',token);
  if (!url.searchParams.has('currency')) url.searchParams.set('currency','USD');
  try {
    const res = await fetch(url,{method,headers:{'Content-Type':'application/json'},body:method==='POST'?event.body:undefined});
    return {statusCode:res.status,headers:{'Content-Type':'application/json','Cache-Control':'no-store'},body:await res.text()};
  } catch (e) {
    return {statusCode:502,headers:{'Content-Type':'application/json'},body:JSON.stringify({error:'Fourthwall service unreachable'})};
  }
};
