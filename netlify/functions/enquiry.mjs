// Netlify Function (v2): same-origin proxy between the browser and the Google Apps Script.
// Why: avoids browser cross-origin (CORS) problems, keeps the Apps Script URL and shared secret out of the page,
// and gives us a place for origin checks, field allow-listing and rate limiting.
// Environment variables (Netlify: Site configuration > Environment variables). NEVER put these in HTML or JS files:
//   APPS_SCRIPT_URL           the Apps Script Web app URL
//   ENQUIRY_SHARED_SECRET     same value as the SHARED_SECRET script property
//   ALLOWED_ORIGINS           optional, comma separated; default https://orbitteachingacademy.com
//   ALLOW_NETLIFY_PREVIEWS    optional "true" to accept *.netlify.app origins while testing previews

const FIELDS = ['request_type','name','email','course_format','course_format_label','start_date','time_zone','question','consent',
  'client_request_id','form_age_ms','submitted_at','gclid','utm_source','utm_medium','utm_campaign','utm_term','website','test'];

const json = (obj, status = 200) => new Response(JSON.stringify(obj), {
  status, headers: { 'content-type': 'application/json', 'cache-control': 'no-store' }
});

function originAllowed(origin) {
  if (!origin) return true; // same-origin form posts may omit Origin; real protection is the rate limit and Apps Script checks
  const list = (Netlify.env.get('ALLOWED_ORIGINS') || 'https://orbitteachingacademy.com').split(',').map(s => s.trim());
  if (list.includes(origin)) return true;
  return Netlify.env.get('ALLOW_NETLIFY_PREVIEWS') === 'true' && /^https:\/\/[a-z0-9-]+(--[a-z0-9-]+)?\.netlify\.app$/.test(origin);
}

export default async (req) => {
  if (req.method !== 'POST') return json({ ok: false, error: 'method' }, 405);
  if (!originAllowed(req.headers.get('origin'))) return json({ ok: false, error: 'forbidden' }, 403);
  const url = Netlify.env.get('APPS_SCRIPT_URL'), secret = Netlify.env.get('ENQUIRY_SHARED_SECRET');
  if (!url || !secret) return json({ ok: false, error: 'server' }, 500);

  const text = await req.text();
  if (text.length > 10000) return json({ ok: false, error: 'invalid' }, 413);
  const incoming = new URLSearchParams(text), out = new URLSearchParams();
  for (const k of FIELDS) if (incoming.has(k)) out.set(k, incoming.get(k).slice(0, 2000)); // allow-list and cap every field
  out.set('secret', secret);

  const ctl = new AbortController(), timer = setTimeout(() => ctl.abort(), 15000);
  try {
    const res = await fetch(url, { method: 'POST', body: out, redirect: 'follow', signal: ctl.signal });
    const j = await res.json();
    // TEMPORARY DEBUG (remove before launch): only for connectivity tests (test=1)
    if (incoming.get('test') === '1') return json({ ok: j.ok === true, id: null, debug: { v: 'dbg-1', url_end: url.slice(-6), upstream: j } });
    // Return only what the page needs. Never echo upstream details.
    return json({ ok: j.ok === true, id: j.id || null, error: j.ok === true ? undefined : (j.error || 'server') });
  } catch (e) {
    if (incoming.get('test') === '1') return json({ ok: false, error: 'server', debug: { v: 'dbg-1', url_end: url.slice(-6), message: String(e && e.message) } }, 502);
    return json({ ok: false, error: 'server' }, 502);
  } finally { clearTimeout(timer); }
};

// Netlify's built-in rate limiting (verify it is available on your plan): max 8 requests/minute per IP.
export const config = { rateLimit: { windowLimit: 8, windowSize: 60, aggregateBy: ['ip', 'domain'] } };
