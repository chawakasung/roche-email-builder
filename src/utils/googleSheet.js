// Google Sheets integration via Google Identity Services + Sheets API.
// Asks the user to authorise (popup), then creates / queries Sheets on their behalf.

const SCOPE = 'https://www.googleapis.com/auth/spreadsheets';
let cachedToken = null; // { access_token, expires_at }

function clientId() {
  return import.meta.env.VITE_GOOGLE_CLIENT_ID || '';
}

function ensureGisLoaded() {
  return new Promise((resolve, reject) => {
    if (window.google?.accounts?.oauth2) return resolve();
    const t0 = Date.now();
    const id = setInterval(() => {
      if (window.google?.accounts?.oauth2) { clearInterval(id); resolve(); }
      else if (Date.now() - t0 > 8000) { clearInterval(id); reject(new Error('Google Identity script failed to load')); }
    }, 100);
  });
}

// Returns a fresh access token, prompting the user via popup if needed.
export async function getAccessToken({ forcePrompt = false } = {}) {
  if (!clientId()) throw new Error('VITE_GOOGLE_CLIENT_ID is not set in .env');
  if (!forcePrompt && cachedToken && cachedToken.expires_at - 60_000 > Date.now()) {
    return cachedToken.access_token;
  }
  await ensureGisLoaded();
  return new Promise((resolve, reject) => {
    const tokenClient = window.google.accounts.oauth2.initTokenClient({
      client_id: clientId(),
      scope: SCOPE,
      prompt: forcePrompt ? 'consent' : '',
      callback: (resp) => {
        if (resp.error) return reject(new Error(resp.error_description || resp.error));
        cachedToken = {
          access_token: resp.access_token,
          expires_at: Date.now() + (Number(resp.expires_in) || 3600) * 1000,
        };
        resolve(resp.access_token);
      },
      error_callback: (err) => reject(new Error(err?.message || 'Auth cancelled')),
    });
    tokenClient.requestAccessToken();
  });
}

export function clearAccessToken() { cachedToken = null; }

async function api(token, url, body) {
  const r = await fetch(url, {
    method: body ? 'POST' : 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
  const data = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(data?.error?.message || `HTTP ${r.status}`);
  return data;
}

// Default header columns for the registration sheet.
export const DEFAULT_HEADERS = [
  'Timestamp', 'Name', 'Surname', 'Position', 'Organization',
  'Email', 'Medical Technician ID', 'Receive info', 'Consent',
];

// Create a new spreadsheet, set up the 'Submissions' tab, and seed the header row.
export async function createSheet({ title, headers = DEFAULT_HEADERS }) {
  const token = await getAccessToken();
  // Create
  const ss = await api(token, 'https://sheets.googleapis.com/v4/spreadsheets', {
    properties: { title },
    sheets: [{ properties: { title: 'Submissions' } }],
  });
  // Seed headers
  await api(
    token,
    `https://sheets.googleapis.com/v4/spreadsheets/${ss.spreadsheetId}/values/Submissions!A1?valueInputOption=RAW`,
    { values: [headers] },
  );
  // Bold the header row
  const sheetId = ss.sheets?.[0]?.properties?.sheetId ?? 0;
  await api(
    token,
    `https://sheets.googleapis.com/v4/spreadsheets/${ss.spreadsheetId}:batchUpdate`,
    {
      requests: [{
        repeatCell: {
          range: { sheetId, startRowIndex: 0, endRowIndex: 1 },
          cell: { userEnteredFormat: { textFormat: { bold: true } } },
          fields: 'userEnteredFormat.textFormat.bold',
        },
      }],
    },
  );
  return {
    id: ss.spreadsheetId,
    name: ss.properties.title,
    url: ss.spreadsheetUrl,
  };
}

// Look up an existing sheet by id (used to verify a manually-pasted ID).
export async function getSheet(spreadsheetId) {
  const token = await getAccessToken();
  const data = await api(token, `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}?fields=spreadsheetId,spreadsheetUrl,properties.title`);
  return { id: data.spreadsheetId, name: data.properties.title, url: data.spreadsheetUrl };
}

// Build the contents of a customised Code.gs the user can paste into Apps Script.
export function buildAppsScriptCode(spreadsheetId) {
  return `/**
 * Roche Media Registration — Apps Script web app
 * Auto-generated for spreadsheet: ${spreadsheetId}
 * Setup: see google-apps-script/SETUP.md in the repo
 */

const SHEET_ID = '${spreadsheetId}';
const SHEET_TAB = 'Submissions';

function doGet() {
  return HtmlService
    .createTemplateFromFile('Form')
    .evaluate()
    .setTitle('Roche · Media Registration')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function doPost(e) {
  try {
    const d = JSON.parse(e.postData.contents);
    SpreadsheetApp.openById(SHEET_ID).getSheetByName(SHEET_TAB).appendRow([
      new Date(),
      d.name || '', d.surname || '', d.position || '',
      d.org || d.organization || '',
      d.email || '', d.medid || '',
      d.chk1 ? 'Yes' : '', d.chk2 ? 'Yes' : '',
    ]);
    return ContentService.createTextOutput(JSON.stringify({ ok: true })).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ ok: false, error: String(err) })).setMimeType(ContentService.MimeType.JSON);
  }
}
`;
}

// Trigger a browser download of the customised Code.gs.
export function downloadCodeGs(spreadsheetId) {
  const blob = new Blob([buildAppsScriptCode(spreadsheetId)], { type: 'text/plain;charset=utf-8' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'Code.gs';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(a.href);
}
