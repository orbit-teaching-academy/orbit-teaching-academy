// Orbit: records a COMPLETED CELTA application as an offline-conversion row (for Google Ads import).
// SETUP: open the spreadsheet that receives the Google Form responses > Extensions > Apps Script > paste this.
//   Triggers (clock icon) > Add trigger > function onApplicationSubmit > event source: From spreadsheet > event type: On form submit.
// The Google Form needs two extra short-answer questions with EXACTLY these titles (prefilled by the apply page; applicants leave them as they are):
//   "Reference (leave unchanged)" -> Enquiry ID      "Click reference (leave unchanged)" -> gclid (capitals do not matter)
// This runs only when the form is genuinely submitted, so a conversion is never recorded for a page view or a click.
var CONVERSION_NAME = 'Online CELTA application submitted'; // must match the conversion action name in Google Ads
var Q = { enquiryId: 'Reference (leave unchanged)', gclid: 'Click reference (leave unchanged)', course: 'Which course are you most interested in?', start: 'Preferred start date' };
// Titles are matched ignoring capitals and extra text after the start, so "Click Reference (leave unchanged)" also works.
var SHEET = 'Offline Conversions';
var COLS = ['Google Click ID', 'Conversion Name', 'Conversion Time', 'Conversion Value', 'Conversion Currency', 'Order ID', 'Course', 'Start date', 'Enquiry ID'];

function onApplicationSubmit(e) {
  var nv = (e && e.namedValues) || {};
  function get(k) {
    var want = k.toLowerCase();
    for (var name in nv) {
      if (String(name).toLowerCase().trim().indexOf(want) === 0) return nv[name][0] ? String(nv[name][0]).trim() : '';
    }
    return '';
  }
  var gclid = get(Q.gclid);
  if (!gclid) return; // not from a Google ad click: nothing to import
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sh = ss.getSheetByName(SHEET) || ss.insertSheet(SHEET);
  if (sh.getLastRow() === 0) { sh.appendRow(COLS); sh.setFrozenRows(1); }
  var orderId = 'APP-' + (e.range ? e.range.getRow() : Utilities.getUuid().slice(0, 8)); // stable per form response: prevents double import
  var existing = sh.getRange(1, 6, Math.max(sh.getLastRow(), 1), 1).getValues().map(function (r) { return r[0]; });
  if (existing.indexOf(orderId) !== -1) return;
  sh.appendRow([gclid, CONVERSION_NAME, Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyy-MM-dd HH:mm:ssXXX'),
    '', '', orderId, get(Q.course), get(Q.start), get(Q.enquiryId)]);
}
// Upload: Google Ads > Goals > Uploads > upload this sheet as CSV (clicks must be under 90 days old).
