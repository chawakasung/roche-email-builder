export const SAMPLE_CSV = `email,first_name,last_name,department
somchai.j@roche.com,Somchai,Jaidee,R&D Bangkok
priya.s@roche.com,Priya,Sharma,Diagnostics
linh.tran@roche.com,Linh,Tran,Pharma APAC
marco.r@roche.com,Marco,Rossi,Medical Affairs
amelia.k@roche.com,Amelia,König,Communications
yuki.t@roche.com,Yuki,Tanaka,R&D Penzberg
hassan.a@roche.com,Hassan,Al-Farsi,Diagnostics
anna.l@roche.com,Anna,Lindqvist,People & Culture
diego.m@roche.com,Diego,Martinez,Pharma LATAM
zara.b@roche.com,Zara,Brown,Sustainability
kenji.o@roche.com,Kenji,Okada,Diagnostics
chloe.d@roche.com,Chloe,Dubois,Communications`;

export function parseCSV(text) {
  const lines = text.trim().split(/\r?\n/);
  if (!lines.length) return { headers: [], rows: [] };
  const split = (line) => {
    const out = []; let cur = ''; let inQ = false;
    for (const c of line) {
      if (c === '"') inQ = !inQ;
      else if (c === ',' && !inQ) { out.push(cur); cur = ''; }
      else cur += c;
    }
    out.push(cur);
    return out.map(s => s.trim());
  };
  const headers = split(lines[0]);
  const rows = lines.slice(1).filter(Boolean).map(line => {
    const cells = split(line);
    const r = {};
    headers.forEach((h, i) => { r[h] = cells[i] || ''; });
    return r;
  });
  return { headers, rows };
}

export function isValidEmail(e) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e || '');
}
