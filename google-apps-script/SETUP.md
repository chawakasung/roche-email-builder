# Google Apps Script setup — Roche Media Registration

This wires up a real, Roche-branded form that recipients can actually fill in.
Submissions go straight into a Google Sheet you own.

## One-time setup (~10 minutes)

### 1. Create the Sheet

1. Go to https://sheets.new
2. Rename the file (e.g. *Roche Media Registrations*)
3. Rename the tab at the bottom from `Sheet1` to `Submissions` (right-click → Rename)
4. In the first row, paste these column headers (one per cell):

   ```
   Timestamp	Name	Surname	Position	Organization	Email	Medical Technician ID	Receive info	Consent
   ```

   Tip: copy the line above (tab-separated) and paste into A1 — Sheets splits it across columns.

5. Copy the Sheet ID from the URL. It's the long string between `/d/` and `/edit`:
   ```
   https://docs.google.com/spreadsheets/d/THIS_LONG_STRING_IS_THE_ID/edit
   ```

### 2. Create the Apps Script project

1. Go to https://script.google.com
2. Click **New project** (top-left)
3. Rename it (top-left, click "Untitled project") to *Roche Media Form*
4. In the left sidebar, you'll see `Code.gs`. Replace its entire contents with the contents of this folder's [`Code.gs`](./Code.gs).
5. **Edit one line** in `Code.gs`:
   ```
   const SHEET_ID = 'PASTE_YOUR_SHEET_ID_HERE';
   ```
   Replace `PASTE_YOUR_SHEET_ID_HERE` with the ID you copied in step 1.5.
6. Click the **+** next to "Files" in the sidebar → **HTML**. Name it `Form` (no extension — Apps Script adds `.html` automatically).
7. Replace the new file's contents with the contents of this folder's [`Form.html`](./Form.html).
8. **Save** (Ctrl/Cmd + S).

### 3. Deploy as a web app

1. Top-right: **Deploy → New deployment**
2. Click the gear icon next to "Select type" → **Web app**
3. Fill in:
   - **Description:** *Media Registration v1*
   - **Execute as:** *Me*
   - **Who has access:** *Anyone*
4. Click **Deploy**
5. Google will ask for permission. Click **Authorize access**, pick your account, click **Advanced → Go to (unsafe)** → **Allow**. (It says "unsafe" because it's your own unverified script — that's normal.)
6. Copy the **Web app URL**. It looks like:
   ```
   https://script.google.com/macros/s/AKfycbx...../exec
   ```

### 4. Wire it up in the Email Builder

1. Open the Email Builder app
2. Click your Media Form block to select it
3. In the right panel, find the **Submit URL** field
4. Paste the web app URL there
5. Send a test email
6. Click "Submit" in the email — the form opens, fill it in, hit Submit, and a row appears in your Sheet.

## Updating the form later

If you change `Code.gs` or `Form.html`:

1. **Save**
2. **Deploy → Manage deployments**
3. Click ✏️ (pencil) next to your existing deployment
4. **Version: New version**
5. **Deploy**

The same URL will keep working — no need to update the Email Builder.

## Troubleshooting

- **"Sheet tab not found: Submissions"** — your tab name doesn't match. Rename it to exactly `Submissions`.
- **Permission denied** — re-deploy and re-authorize. Make sure "Who has access" is *Anyone*.
- **Submissions arrive but columns are misaligned** — your header row is in a different order. Match it to the order in `appendRow_` (Code.gs line ~30).
- **Want to change the form fields** — edit `Form.html`, then mirror the same fields in `appendRow_` and the Sheet's headers.
