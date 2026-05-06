/**
 * Roche Media Registration — Google Apps Script web app
 *
 * Hosts a Roche-branded HTML form (Form.html) and writes each submission
 * as a row in a Google Sheet that you own.
 *
 * One-time setup:
 *   1. Edit `SHEET_ID` below to match your Sheet (the long ID from the URL).
 *   2. Make sure the Sheet has a tab named `Submissions` with this header row:
 *      Timestamp | Name | Surname | Position | Organization | Email | Medical Technician ID | Receive info | Consent
 *   3. Deploy → New deployment → Type: Web app
 *      - Execute as: Me
 *      - Who has access: Anyone
 *      - Click Deploy, copy the web app URL.
 *   4. Paste the URL into the Email Builder's "Submit URL" field on the Media
 *      Form block.
 *
 * Updates: edit and "Deploy → Manage deployments → ✏︎ → New version → Deploy".
 */

const SHEET_ID = 'PASTE_YOUR_SHEET_ID_HERE';
const SHEET_TAB = 'Submissions';

function doGet(e) {
  return HtmlService
    .createTemplateFromFile('Form')
    .evaluate()
    .setTitle('Roche · Media Registration')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    appendRow_(data);
    return jsonResponse_({ ok: true });
  } catch (err) {
    return jsonResponse_({ ok: false, error: String(err) });
  }
}

function appendRow_(d) {
  const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(SHEET_TAB);
  if (!sheet) throw new Error('Sheet tab not found: ' + SHEET_TAB);
  sheet.appendRow([
    new Date(),
    d.name || '',
    d.surname || '',
    d.position || '',
    organization_(d),
    d.email || '',
    d.medid || '',
    d.chk1 ? 'Yes' : '',
    d.chk2 ? 'Yes' : '',
  ]);
}

function organization_(d) {
  return d.org || d.organization || '';
}

function jsonResponse_(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
