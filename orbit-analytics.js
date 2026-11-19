/* Orbit analytics (PREPARED FOR TESTING, NOT ACTIVE).
   With every ID below left blank, this file loads nothing, sets no cookies and shows no banner.
   It only keeps attribution parameters (gclid, utm_*) in sessionStorage so forms can save them. */
(function () {
  var CFG = {
    ga4MeasurementId: '',            // e.g. 'G-XXXXXXXXXX'
    googleAdsId: '',                 // e.g. 'AW-123456789'
    adsEnquiryConversionLabel: '',   // conversion action: "Online CELTA course enquiry" (fires on generate_lead)
    adsApplicationConversionLabel: '', // OPTIONAL. Prefer offline import for completed applications (see checklist)
    requireConsent: true,            // true: analytics/ads stay off until the visitor accepts (recommended until privacy advice says otherwise)
    privacyUrl: 'privacy.html'
  };

  var qs = new URLSearchParams(location.search);
  var debug = qs.get('orbit_debug') === '1';
  window.__orbitEvents = [];
  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  window.gtag = window.gtag || gtag;

  var configured = !!(CFG.ga4MeasurementId || CFG.googleAdsId);
  var gpc = !!(navigator.globalPrivacyControl === true);
  var stored = null;
  try { stored = localStorage.getItem('orbit_consent'); } catch (e) {}
  if (gpc) stored = 'denied';

  function updateConsent(granted) {
    var v = granted ? 'granted' : 'denied';
    gtag('consent', 'update', { ad_storage: v, ad_user_data: v, ad_personalization: v, analytics_storage: v });
  }

  function load() {
    var id = CFG.ga4MeasurementId || CFG.googleAdsId;
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(id);
    document.head.appendChild(s);
    gtag('js', new Date());
    if (CFG.ga4MeasurementId) gtag('config', CFG.ga4MeasurementId, debug ? { debug_mode: true } : {});
    if (CFG.googleAdsId) gtag('config', CFG.googleAdsId);
  }

  function banner() {
    var b = document.createElement('div');
    b.setAttribute('role', 'dialog');
    b.setAttribute('aria-label', 'Cookie preferences');
    b.style.cssText = 'position:fixed;left:0;right:0;bottom:0;z-index:1000;background:#111E42;color:#fff;padding:1rem 5vw calc(1rem + env(safe-area-inset-bottom));display:flex;gap:1rem;flex-wrap:wrap;align-items:center;font:400 .9rem/1.5 Outfit,sans-serif;box-shadow:0 -4px 20px rgba(0,0,0,.3)';
    var t = document.createElement('span');
    t.style.flex = '1 1 280px';
    t.textContent = 'We use cookies to measure site use and the results of our advertising. ';
    var a = document.createElement('a');
    a.href = CFG.privacyUrl; a.textContent = 'Privacy Policy'; a.style.color = '#5BBFBF';
    t.appendChild(a);
    function btn(label, grant) {
      var x = document.createElement('button');
      x.type = 'button'; x.textContent = label;
      x.style.cssText = 'min-height:44px;padding:.6rem 1.3rem;border-radius:4px;font:600 .9rem Outfit,sans-serif;cursor:pointer;border:1.5px solid #C8922A;' + (grant ? 'background:#C8922A;color:#fff' : 'background:none;color:#fff');
      x.addEventListener('click', function () {
        try { localStorage.setItem('orbit_consent', grant ? 'granted' : 'denied'); } catch (e) {}
        updateConsent(grant);
        b.remove();
      });
      return x;
    }
    b.appendChild(t); b.appendChild(btn('Decline', false)); b.appendChild(btn('Accept', true));
    document.body.appendChild(b);
  }

  if (configured) {
    if (CFG.requireConsent) {
      var granted = stored === 'granted';
      var v = granted ? 'granted' : 'denied';
      gtag('consent', 'default', { ad_storage: v, ad_user_data: v, ad_personalization: v, analytics_storage: v });
      if (!stored) document.addEventListener('DOMContentLoaded', banner);
    }
    load();
  }

  // Remember ad click and campaign parameters for the session so forms can store them.
  window.orbitAttribution = function () {
    var keys = ['gclid', 'utm_source', 'utm_medium', 'utm_campaign', 'utm_term'], out = {};
    try {
      keys.forEach(function (k) {
        var v = qs.get(k);
        if (v) sessionStorage.setItem('orbit_' + k, v);
        var s = sessionStorage.getItem('orbit_' + k);
        if (s) out[k] = s;
      });
    } catch (e) {}
    return out;
  };

  /* Event plan
     select_content      schedule tab viewed                         (engagement, not a conversion)
     select_item         "Start Application" clicked on a course     (engagement)
     begin_application   application page opened                    (funnel step, NOT a conversion)
     generate_lead       course-information enquiry RECORDED by server (conversion: "course enquiry"; carries transaction_id)
     application_complete  genuine completed application             (conversion: recorded server-side / offline import;
                                                                      this file can fire it only from a page that proves completion) */
  window.orbitTrack = function (name, params) {
    params = params || {};
    window.__orbitEvents.push({ name: name, params: params });
    window.dataLayer.push({ event: name, orbit: params });
    if (debug && window.console) console.log('[orbit]', name, params);
    if (!configured) return;
    var p = debug ? Object.assign({ debug_mode: true }, params) : params;
    gtag('event', name, p);
    if (CFG.googleAdsId) {
      var label = name === 'generate_lead' ? CFG.adsEnquiryConversionLabel : (name === 'application_complete' ? CFG.adsApplicationConversionLabel : '');
      if (label) gtag('event', 'conversion', { send_to: CFG.googleAdsId + '/' + label, transaction_id: params.transaction_id });
    }
  };

  window.orbitAttribution();
})();
