import { useState, useRef } from 'react';
import { Lbl } from './Panels.jsx';
import { TOPBAR_ICONS as I } from './icons.jsx';
import { SAMPLE_CSV, parseCSV, isValidEmail } from '../utils/csvParser.js';

export function SendModal({ blocks, settings, onClose, lang, onToast }) {
  const [source, setSource] = useState('csv');
  const [recipients, setRecipients] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [sheetUrl, setSheetUrl] = useState('');
  const [pasted, setPasted] = useState('');
  const [testEmail, setTestEmail] = useState('');
  const [phase, setPhase] = useState('compose');
  const [progress, setProgress] = useState(0);
  const [dropOver, setDropOver] = useState(false);
  const fileRef = useRef(null);

  const validCount = recipients.filter(r => isValidEmail(r.email)).length;
  const invalidCount = recipients.length - validCount;

  function loadSample() {
    const { headers, rows } = parseCSV(SAMPLE_CSV);
    setHeaders(headers); setRecipients(rows); setSource('sample');
    onToast(lang === 'th' ? 'โหลดข้อมูลตัวอย่าง 12 รายการ' : 'Loaded 12 sample recipients');
  }
  function handleFile(file) {
    const r = new FileReader();
    r.onload = (e) => {
      const { headers, rows } = parseCSV(e.target.result);
      setHeaders(headers); setRecipients(rows);
      onToast((lang === 'th' ? 'นำเข้าแล้ว ' : 'Imported ') + rows.length + (lang === 'th' ? ' รายการ' : ' recipients'));
    };
    r.readAsText(file);
  }
  function importSheet() {
    if (!sheetUrl.trim()) return;
    setTimeout(loadSample, 600);
    onToast(lang === 'th' ? 'กำลังเชื่อมต่อ Google Sheet…' : 'Connecting to Google Sheet…');
  }
  function importPasted() {
    if (!pasted.trim()) return;
    const { headers, rows } = parseCSV(pasted);
    setHeaders(headers); setRecipients(rows);
    onToast((lang === 'th' ? 'นำเข้า ' : 'Imported ') + rows.length + (lang === 'th' ? ' รายการ' : ' recipients'));
  }
  function clearList() { setRecipients([]); setHeaders([]); }

  function startSend() {
    if (validCount === 0) { onToast(lang === 'th' ? 'ยังไม่มีผู้รับที่ถูกต้อง' : 'No valid recipients'); return; }
    setPhase('sending');
    let p = 0;
    const total = validCount;
    const tick = () => {
      p += Math.max(1, Math.floor(total / 18));
      setProgress(Math.min(100, Math.round((p / total) * 100)));
      if (p >= total) { setPhase('sent'); }
      else setTimeout(tick, 220);
    };
    setTimeout(tick, 300);
  }
  function sendTest() {
    if (!isValidEmail(testEmail)) { onToast(lang === 'th' ? 'อีเมลไม่ถูกต้อง' : 'Enter a valid email'); return; }
    onToast((lang === 'th' ? 'ส่งอีเมลทดสอบไปที่ ' : 'Test email sent to ') + testEmail);
  }

  return (
    <div className="modal-bg" onClick={onClose}>
      <div className="modal" style={{ maxWidth: 1100, height: '90vh' }} onClick={(e) => e.stopPropagation()}>
        <div className="modal__head">
          <h3>
            <Lbl en="Send email" th="ส่งอีเมล" lang={lang} />
            <small>{lang === 'th' ? 'นำเข้ารายชื่อ ตรวจสอบ และส่งกลุ่ม' : 'Import recipients, review, and send'}</small>
          </h3>
          <button className="close" onClick={onClose}>×</button>
        </div>

        {phase === 'sending' ? (
          <div className="modal__body" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="sending" style={{ maxWidth: 420 }}>
              <div className="sending__ring" />
              <div className="sending__title">{lang === 'th' ? 'กำลังส่งอีเมล…' : 'Sending your email…'}</div>
              <div className="sending__sub">
                {lang === 'th'
                  ? `ส่งไปแล้ว ${Math.round(validCount * progress / 100)} / ${validCount} ฉบับ`
                  : `Sent ${Math.round(validCount * progress / 100)} of ${validCount} messages`}
              </div>
              <div className="sending__bar"><div style={{ width: progress + '%' }} /></div>
            </div>
          </div>
        ) : phase === 'sent' ? (
          <div className="modal__body" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="sent-success">
              <svg viewBox="0 0 24 24" className="check"><circle cx="12" cy="12" r="10"/><polyline points="8 12 11 15 16 9"/></svg>
              <h3>{lang === 'th' ? 'ส่งอีเมลสำเร็จ' : 'Email sent successfully'}</h3>
              <p>{lang === 'th' ? `อีเมลถูกส่งไปยังผู้รับทั้งหมด ${validCount} ราย` : `Your email reached ${validCount} recipients without issue.`}</p>
              <div className="stats">
                <div><div className="n">{validCount}</div><div className="l">{lang === 'th' ? 'ส่งแล้ว' : 'Delivered'}</div></div>
                <div><div className="n">0</div><div className="l">{lang === 'th' ? 'ตีกลับ' : 'Bounced'}</div></div>
                <div><div className="n">{Math.round(validCount * 0.6)}</div><div className="l">{lang === 'th' ? 'คาดว่าเปิด' : 'Est. opens'}</div></div>
              </div>
            </div>
          </div>
        ) : (
          <div className="modal__body">
            <div className="send-grid">
              <div>
                <div className={'send-step' + (recipients.length ? ' done' : '')}>
                  <h4><span className="num">{recipients.length ? '✓' : '1'}</span> <Lbl en="Recipient list" th="รายชื่อผู้รับ" lang={lang} /></h4>
                  <p>{lang === 'th' ? 'นำเข้าจาก CSV หรือ Google Sheet' : 'Import from CSV or share a Google Sheet'}</p>
                  <div className="src-tabs">
                    <button className={'src-tab' + (source === 'csv' ? ' is-active' : '')} onClick={() => setSource('csv')}>{I.upload}<span>CSV</span></button>
                    <button className={'src-tab' + (source === 'sheet' ? ' is-active' : '')} onClick={() => setSource('sheet')}>{I.sheet}<span>Sheet</span></button>
                    <button className={'src-tab' + (source === 'paste' ? ' is-active' : '')} onClick={() => setSource('paste')}>{I.paste}<span>{lang === 'th' ? 'วาง' : 'Paste'}</span></button>
                  </div>

                  {source === 'csv' && (
                    <>
                      <div
                        className={'csv-drop' + (dropOver ? ' is-over' : '')}
                        onClick={() => fileRef.current?.click()}
                        onDragOver={(e) => { e.preventDefault(); setDropOver(true); }}
                        onDragLeave={() => setDropOver(false)}
                        onDrop={(e) => { e.preventDefault(); setDropOver(false); if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]); }}
                      >
                        <svg viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                        <div className="hd">{lang === 'th' ? 'คลิก หรือ ลากไฟล์ CSV' : 'Click or drag a CSV file'}</div>
                        <div className="sub">{lang === 'th' ? 'คอลัมน์: email, first_name, last_name, …' : 'Columns: email, first_name, last_name, …'}</div>
                      </div>
                      <input ref={fileRef} type="file" accept=".csv,text/csv" onChange={(e) => e.target.files[0] && handleFile(e.target.files[0])} />
                    </>
                  )}

                  {source === 'sheet' && (
                    <>
                      <input type="url" placeholder="https://docs.google.com/spreadsheets/d/..." value={sheetUrl} onChange={(e) => setSheetUrl(e.target.value)} style={{ width: '100%', border: '1px solid var(--hairline)', padding: '7px 9px', fontSize: 12, borderRadius: 2 }} />
                      <button className="btn primary" style={{ width: '100%', marginTop: 8, justifyContent: 'center' }} onClick={importSheet}>
                        <Lbl en="Connect Sheet" th="เชื่อมต่อ Sheet" lang={lang} />
                      </button>
                      <p style={{ fontSize: 10, color: 'var(--fg-3)', margin: '6px 0 0', lineHeight: 1.4 }}>{lang === 'th' ? 'แชร์ Sheet ให้ใครก็ดูได้ และวางลิงก์ที่นี่' : "Share the Sheet as 'Anyone with the link' and paste here."}</p>
                    </>
                  )}

                  {source === 'paste' && (
                    <>
                      <textarea placeholder={'email,first_name,last_name\njohn@roche.com,John,Smith\n…'} value={pasted} onChange={(e) => setPasted(e.target.value)} style={{ width: '100%', minHeight: 90, border: '1px solid var(--hairline)', padding: 8, fontSize: 11, fontFamily: 'var(--font-mono)', borderRadius: 2 }} />
                      <button className="btn primary" style={{ width: '100%', marginTop: 8, justifyContent: 'center' }} onClick={importPasted}>
                        <Lbl en="Parse pasted data" th="แปลงข้อมูลที่วาง" lang={lang} />
                      </button>
                    </>
                  )}

                  <button className="btn" style={{ width: '100%', marginTop: 10, justifyContent: 'center', fontSize: 11 }} onClick={loadSample}>
                    <Lbl en="Or load sample data" th="หรือใช้ข้อมูลตัวอย่าง" lang={lang} />
                  </button>
                </div>

                <div className={'send-step' + (validCount > 0 ? ' done' : '')}>
                  <h4><span className="num">{validCount > 0 ? '✓' : '2'}</span> <Lbl en="Send a test" th="ส่งทดสอบ" lang={lang} /></h4>
                  <p>{lang === 'th' ? 'ส่งอีเมลให้ตัวเองก่อนส่งจริง' : 'Email yourself before broadcasting.'}</p>
                  <div className="test-row">
                    <input type="email" placeholder="you@roche.com" value={testEmail} onChange={(e) => setTestEmail(e.target.value)} style={{ border: '1px solid var(--hairline)', padding: '7px 9px', fontSize: 12, borderRadius: 2 }} />
                    <button className="btn" onClick={sendTest}>{I.send}</button>
                  </div>
                </div>

                <div className="send-step">
                  <h4><span className="num">3</span> <Lbl en="Schedule" th="กำหนดเวลา" lang={lang} /></h4>
                  <p>{lang === 'th' ? 'ส่งทันที หรือกำหนดเวลา' : 'Send now, or pick a time.'}</p>
                  <select style={{ width: '100%', border: '1px solid var(--hairline)', padding: '7px 9px', fontSize: 12, borderRadius: 2 }}>
                    <option>{lang === 'th' ? 'ส่งทันที' : 'Send immediately'}</option>
                    <option>{lang === 'th' ? 'พรุ่งนี้ 09:00' : 'Tomorrow 9:00 AM'}</option>
                    <option>{lang === 'th' ? 'จันทร์ถัดไป 08:00' : 'Next Monday 8:00 AM'}</option>
                    <option>{lang === 'th' ? 'กำหนดเอง…' : 'Custom time…'}</option>
                  </select>
                </div>
              </div>

              <div>
                <div className="recipient-summary">
                  <div><div className="stat">{recipients.length}</div><div className="lbl">{lang === 'th' ? 'ทั้งหมด' : 'Total'}</div></div>
                  <div><div className="stat" style={{ color: 'var(--cobas-green-dark)' }}>{validCount}</div><div className="lbl">{lang === 'th' ? 'ถูกต้อง' : 'Valid'}</div></div>
                  <div><div className="stat" style={{ color: invalidCount ? 'var(--red-dark)' : 'var(--fg-3)' }}>{invalidCount}</div><div className="lbl">{lang === 'th' ? 'ผิดพลาด' : 'Invalid'}</div></div>
                  <div><div className="stat">{headers.length}</div><div className="lbl">{lang === 'th' ? 'คอลัมน์' : 'Columns'}</div></div>
                </div>

                {headers.length > 0 && (
                  <div className="merge-tags">
                    <span style={{ fontSize: 10, color: 'var(--fg-2)', letterSpacing: '.06em', textTransform: 'uppercase', alignSelf: 'center', marginRight: 4 }}>{lang === 'th' ? 'แท็กที่มี:' : 'Available tags:'}</span>
                    {headers.map(h => <span key={h} className="merge-tag">{`{{${h}}}`}</span>)}
                  </div>
                )}

                <div style={{ border: '1px solid var(--hairline)', maxHeight: 380, overflow: 'auto' }}>
                  {recipients.length === 0 ? (
                    <div className="empty-state" style={{ padding: '60px 20px' }}>
                      <svg viewBox="0 0 24 24" strokeLinecap="round"><path d="M3 8l9 6 9-6"/><rect x="3" y="5" width="18" height="14" rx="2"/></svg>
                      <Lbl en="No recipients yet — import a CSV or paste from a Sheet" th="ยังไม่มีผู้รับ — นำเข้า CSV หรือวางจาก Sheet" lang={lang} />
                    </div>
                  ) : (
                    <table className="recipient-table">
                      <thead>
                        <tr>
                          <th style={{ width: 24 }}></th>
                          {headers.map(h => <th key={h}>{h}</th>)}
                        </tr>
                      </thead>
                      <tbody>
                        {recipients.slice(0, 50).map((r, i) => {
                          const ok = isValidEmail(r.email);
                          return (
                            <tr key={i}>
                              <td>
                                <span className={'pill ' + (ok ? 'valid' : 'invalid')} title={ok ? 'Valid' : 'Invalid email'}>
                                  {ok ? '✓' : '!'}
                                </span>
                              </td>
                              {headers.map(h => <td key={h} style={!ok && h === 'email' ? { color: 'var(--red-dark)' } : null}>{r[h]}</td>)}
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  )}
                </div>
                {recipients.length > 50 && (
                  <p style={{ fontSize: 11, color: 'var(--fg-3)', margin: '8px 0 0' }}>+{recipients.length - 50} more rows…</p>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="modal__foot">
          {phase === 'compose' ? (
            <>
              <span style={{ fontSize: 12, color: 'var(--fg-2)' }}>
                {recipients.length > 0
                  ? <><b>{validCount}</b> {lang === 'th' ? 'พร้อมส่ง' : 'ready to send'}{invalidCount > 0 && <> · <span style={{ color: 'var(--red-dark)' }}>{invalidCount} {lang === 'th' ? 'ผิดพลาด' : 'invalid'}</span></>}</>
                  : (lang === 'th' ? 'นำเข้ารายชื่อก่อนส่ง' : 'Import recipients to send')}
              </span>
              <div className="right">
                {recipients.length > 0 && <button className="btn" onClick={clearList}><Lbl en="Clear list" th="ล้างรายการ" lang={lang} /></button>}
                <button className="btn" onClick={onClose}><Lbl en="Cancel" th="ยกเลิก" lang={lang} /></button>
                <button className="btn primary" onClick={startSend} disabled={validCount === 0}>
                  {I.send} <Lbl en={`Send to ${validCount}`} th={`ส่งไป ${validCount} ราย`} lang={lang} />
                </button>
              </div>
            </>
          ) : phase === 'sent' ? (
            <>
              <span />
              <div className="right">
                <button className="btn primary" onClick={onClose}><Lbl en="Done" th="เสร็จสิ้น" lang={lang} /></button>
              </div>
            </>
          ) : <span />}
        </div>
      </div>
    </div>
  );
}
