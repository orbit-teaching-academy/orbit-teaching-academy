/* Orbit Online CELTA: shared configuration and course data (single source of truth).
   Used by online-celta.html, online-celta-apply.html and online-celta-thank-you.html.
   Annual update: add new rows to COURSES. Do not edit or delete past rows. */
(function () {
  var ORBIT = {
    tuition: 2400,
    // Recommended: same-origin Netlify Function (see netlify/functions/enquiry.mjs).
    // Alternative: paste the Apps Script Web app URL here to post directly (browser must be able to read its JSON reply; test first).
    enquiryEndpoint: '/.netlify/functions/enquiry',
    thankYouPage: 'online-celta-thank-you.html',
    applyPage: 'online-celta-apply.html',
    privacyPage: 'privacy.html',
    notifyEmail: 'passport@orbitteachingacademy.com',
    // Time zone is PROPOSED only. Conversions appear only when confirmed is true AND a format has hours.
    timeZone: { source: 'America/New_York', sourceLabel: 'Eastern Time', confirmed: true },
    convertTo: [['Eastern', 'America/New_York'], ['Central', 'America/Chicago'], ['Pacific', 'America/Los_Angeles']],
    // Existing full application (Google Form). Leave entry IDs blank until the form has matching questions.
    // Find an ID: in the form, menu > Get pre-filled link, fill each question, copy the link, read entry.NNNN.
    applicationForm: {
      viewUrl: 'https://docs.google.com/forms/d/e/1FAIpQLSeTGmczbDcSTE7fbNE2YymJ-uNZzyiI1OCuI-2x5IBR_JqRyQ/viewform',
      entryIds: { course: '', start: '', enquiryId: '1640447617', gclid: '1703170397', campaign: '' }
    }
  };
  var FORMATS = {
  "full": {
    "label": "Full-Time Online CELTA",
    "intro": "Four-week intensive courses for candidates who can commit their full day to training. Most courses run Monday to Friday.",
    "note": "The full daily timetable and teaching hours will be confirmed before enrolment."
  },
  "part": {
    "label": "Part-Time Online CELTA",
    "intro": "Ten-week courses for candidates who prefer a longer training period.",
    "note": "Teaching days and hours (including any evening timetable) are still being confirmed and will be published before enrolment."
  },
  "sat": {
    "label": "Saturday Online CELTA",
    "intro": "Sixteen-week courses built around Saturday sessions.",
    "note": "Saturday sessions are scheduled 9:00 AM to 4:00 PM. Saturday sessions alone do not meet the CELTA minimum of 120 contact hours, so additional supervised sessions will be included in the finalised timetable. The full timetable and time zone will be confirmed before enrolment.",
    "hours": {
      "start": "09:00",
      "end": "16:00"
    }
  }
};
  var COURSES = [
  {
    "id": "full-2027-01-18",
    "format": "full",
    "start": "2027-01-18",
    "end": "2027-02-12"
  },
  {
    "id": "full-2027-02-15",
    "format": "full",
    "start": "2027-02-15",
    "end": "2027-03-12"
  },
  {
    "id": "full-2027-03-22",
    "format": "full",
    "start": "2027-03-22",
    "end": "2027-04-16"
  },
  {
    "id": "full-2027-04-19",
    "format": "full",
    "start": "2027-04-19",
    "end": "2027-05-14"
  },
  {
    "id": "full-2027-05-17",
    "format": "full",
    "start": "2027-05-17",
    "end": "2027-06-11"
  },
  {
    "id": "full-2027-06-21",
    "format": "full",
    "start": "2027-06-21",
    "end": "2027-07-16"
  },
  {
    "id": "full-2027-07-19",
    "format": "full",
    "start": "2027-07-19",
    "end": "2027-08-13"
  },
  {
    "id": "full-2027-08-16",
    "format": "full",
    "start": "2027-08-16",
    "end": "2027-09-10"
  },
  {
    "id": "full-2027-09-20",
    "format": "full",
    "start": "2027-09-20",
    "end": "2027-10-15"
  },
  {
    "id": "full-2027-10-18",
    "format": "full",
    "start": "2027-10-18",
    "end": "2027-11-12"
  },
  {
    "id": "full-2027-11-15",
    "format": "full",
    "start": "2027-11-15",
    "end": "2027-12-17",
    "instructionalWeeks": 4,
    "note": "Four weeks of intensive training delivered across five calendar weeks, with a Thanksgiving break.",
    "breakNote": "Thanksgiving Break: No classes November 22\u201326, 2027. Classes resume November 29."
  },
  {
    "id": "part-2027-01-18",
    "format": "part",
    "start": "2027-01-18",
    "end": "2027-03-26"
  },
  {
    "id": "part-2027-04-05",
    "format": "part",
    "start": "2027-04-05",
    "end": "2027-06-11"
  },
  {
    "id": "part-2027-06-14",
    "format": "part",
    "start": "2027-06-14",
    "end": "2027-08-20"
  },
  {
    "id": "part-2027-09-13",
    "format": "part",
    "start": "2027-09-13",
    "end": "2027-11-19"
  },
  {
    "id": "sat-2027-01-30",
    "format": "sat",
    "start": "2027-01-30",
    "end": "2027-05-15"
  },
  {
    "id": "sat-2027-05-22",
    "format": "sat",
    "start": "2027-05-22",
    "end": "2027-09-04"
  },
  {
    "id": "sat-2027-09-04",
    "format": "sat",
    "start": "2027-09-04",
    "end": "2027-12-18"
  }
];

  function todayISO() {
    var p = new URLSearchParams(location.search).get('previewDate'); // testing hook, e.g. ?previewDate=2027-06-01
    if (p && /^\d{4}-\d{2}-\d{2}$/.test(p)) return p;
    var n = new Date();
    return n.getFullYear() + '-' + String(n.getMonth() + 1).padStart(2, '0') + '-' + String(n.getDate()).padStart(2, '0');
  }
  function fmtDate(iso, style) { // style: 'long' (weekday, full), 'short' (abbreviated weekday and month), or none
    var a = iso.split('-'), dt = new Date(Date.UTC(+a[0], +a[1] - 1, +a[2]));
    var o = { timeZone: 'UTC', month: style === 'short' ? 'short' : 'long', day: 'numeric', year: 'numeric' };
    if (style === 'long') o.weekday = 'long'; else if (style === 'short') o.weekday = 'short';
    return dt.toLocaleDateString('en-US', o);
  }
  function weeks(s, e) { var a = Date.parse(s + 'T00:00:00Z'), b = Date.parse(e + 'T00:00:00Z'); return Math.ceil(((b - a) / 86400000 + 1) / 7); }
  function status(c) { var t = todayISO(); return c.start >= t ? 'upcoming' : (c.end >= t ? 'in-progress' : 'past'); }
  function durationText(c) { return c.instructionalWeeks ? c.instructionalWeeks + ' instructional weeks' : weeks(c.start, c.end) + ' weeks'; }
  function find(format, start) { return COURSES.filter(function (c) { return c.format === format && c.start === start; })[0] || null; }

  window.ORBIT = ORBIT;
  window.ORBIT_DATA = { FORMATS: FORMATS, COURSES: COURSES };
  window.OrbitCourses = { today: todayISO, fmtDate: fmtDate, weeks: weeks, durationText: durationText, status: status, find: find };
})();
