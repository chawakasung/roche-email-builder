// Vite middleware that exposes POST /api/send
// Calls Resend with the per-recipient resolved HTML.

import { generateEmailHTML } from '../src/utils/emailExport.js';
import { resolveBlocks, resolveMerge } from '../src/utils/merge.js';

const RESEND_URL = 'https://api.resend.com/emails';

function readJson(req) {
  return new Promise((resolve, reject) => {
    let buf = '';
    req.on('data', c => { buf += c; if (buf.length > 5_000_000) reject(new Error('payload too large')); });
    req.on('end', () => { try { resolve(JSON.parse(buf || '{}')); } catch (e) { reject(e); } });
    req.on('error', reject);
  });
}

function send(res, code, body) {
  res.statusCode = code;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(body));
}

async function sendOne({ apiKey, from, to, subject, html, replyTo }) {
  const r = await fetch(RESEND_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from,
      to: [to],
      subject,
      html,
      ...(replyTo ? { reply_to: replyTo } : {}),
    }),
  });
  const data = await r.json().catch(() => ({}));
  return { ok: r.ok, status: r.status, data };
}

export function sendEmailPlugin() {
  return {
    name: 'send-email-plugin',
    configureServer(server) {
      server.middlewares.use('/api/send', async (req, res, next) => {
        if (req.method !== 'POST') { next(); return; }

        const apiKey = process.env.RESEND_API_KEY;
        if (!apiKey) {
          return send(res, 500, { error: 'RESEND_API_KEY not set in .env' });
        }

        let body;
        try { body = await readJson(req); }
        catch (e) { return send(res, 400, { error: 'invalid JSON: ' + e.message }); }

        const { blocks, settings, recipients, test } = body;
        if (!Array.isArray(blocks) || !settings || !Array.isArray(recipients)) {
          return send(res, 400, { error: 'expected { blocks, settings, recipients }' });
        }

        const from = settings.fromName
          ? `${settings.fromName} <${settings.fromEmail}>`
          : settings.fromEmail;

        const results = [];
        for (const r of recipients) {
          const personalizedBlocks = resolveBlocks(blocks, r);
          const html = generateEmailHTML(personalizedBlocks, settings);
          const subject = resolveMerge(settings.subject, r);
          try {
            const out = await sendOne({
              apiKey,
              from,
              to: r.email,
              subject,
              html,
              replyTo: settings.replyTo,
            });
            results.push({ email: r.email, ok: out.ok, status: out.status, error: out.ok ? null : (out.data?.message || `HTTP ${out.status}`) });
          } catch (e) {
            results.push({ email: r.email, ok: false, status: 0, error: e.message });
          }
        }

        const sent = results.filter(x => x.ok).length;
        return send(res, 200, { sent, total: results.length, results, test: !!test });
      });
    },
  };
}
