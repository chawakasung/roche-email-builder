import { useState, useRef, useEffect } from 'react';
import html2canvas from 'html2canvas';
import { Lbl } from './Panels.jsx';
import { TOPBAR_ICONS as I } from './icons.jsx';
import { isValidEmail } from '../utils/csvParser.js';

async function rasteriseBanners(blocks) {
  return Promise.all(blocks.map(async (b) => {
    if (b.kind !== 'header') return b;
    const live = document.querySelector(`[data-block-id="${b.id}"] .e-banner__wrap`);
    if (!live) return b;
    const stage = document.createElement('div');
    stage.style.cssText = 'position:fixed;left:-99999px;top:0;width:750px;height:205px;overflow:hidden;pointer-events:none;';
    const clone = live.cloneNode(true);
    clone.style.transform = 'none';
    clone.style.width = '750px';
    clone.style.height = '205px';
    stage.appendChild(clone);
    document.body.appendChild(stage);
    await new Promise(r => requestAnimationFrame(r));
    try {
      const canvas = await html2canvas(clone, { width: 750, height: 205, scale: 2, backgroundColor: null, useCORS: true, logging: false });
      return { ...b, props: { ...b.props, _renderedImg: canvas.toDataURL('image/png') } };
    } catch (e) {
      console.warn('Banner rasterise failed:', e);
      return b;
    } finally {
      document.body.removeChild(stage);
    }
  }));
}

export function TestSendModal({ blocks, settings, onClose, lang }) {
  const [testEmail, setTestEmail] = useState('');
  const [status, setStatus] = useState(null);
  const inputRef = useRef(null);

  useEffect(() => { inputRef.current?.focus(); }, []);

  async function send() {
    if (!isValidEmail(testEmail)) {
      setStatus({ kind: 'error', error: lang === 'th' ? 'อีเมลไม่ถูกต้อง' : 'Enter a valid email' });
      return;
    }
    setStatus({ kind: 'sending', email: testEmail });
    try {
      const rasterised = await rasteriseBanners(blocks);
      const target = { email: testEmail, first_name: 'Test', last_name: 'User', department: 'Test' };
      const r = await fetch('/api/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ blocks: rasterised, settings, recipients: [target], test: true }),
      });
      const data = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(data.error || `HTTP ${r.status}`);
      const failure = data.results?.find(x => !x.ok);
      if (failure) setStatus({ kind: 'error', email: testEmail, error: failure.error });
      else setStatus({ kind: 'success', email: testEmail });
    } catch (e) {
      setStatus({ kind: 'error', email: testEmail, error: e.message });
    }
  }

  function reset() { setStatus(null); }

  const sending = status?.kind === 'sending';

  return (
    <div className="modal-bg" onClick={() => !sending && onClose()}>
      <div className="test-popup test-popup--standalone" onClick={(e) => e.stopPropagation()}>
        {!status && (
          <>
            <div className="test-popup__head">
              <h3><Lbl en="Send a test" th="ส่งอีเมลทดสอบ" lang={lang} /></h3>
              <button className="close" onClick={onClose}>×</button>
            </div>
            <p className="test-popup__sub" style={{ marginBottom: 18 }}>
              <Lbl en="Email yourself before broadcasting." th="ส่งอีเมลให้ตัวเองก่อนส่งจริง" lang={lang} />
            </p>
            <div className="test-popup__row">
              <input ref={inputRef} type="email" placeholder="you@roche.com" value={testEmail}
                onChange={(e) => setTestEmail(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && send()} />
              <button className="btn primary" onClick={send} aria-label="Send test">{I.send}</button>
            </div>
          </>
        )}
        {status?.kind === 'sending' && (
          <>
            <div className="test-popup__ring" />
            <h3>{lang === 'th' ? 'กำลังส่งอีเมลทดสอบ…' : 'Sending test email…'}</h3>
            <p className="test-popup__sub">{status.email}</p>
          </>
        )}
        {status?.kind === 'success' && (
          <>
            <svg className="test-popup__check" viewBox="0 0 52 52"><circle cx="26" cy="26" r="24" /><polyline points="14 27 23 36 38 19" /></svg>
            <h3>{lang === 'th' ? 'ส่งอีเมลทดสอบสำเร็จ' : 'Test email sent'}</h3>
            <p className="test-popup__sub">{lang === 'th' ? 'ส่งไปที่ ' : 'Delivered to '}<b>{status.email}</b></p>
            <div className="test-popup__actions">
              <button className="btn" onClick={reset}><Lbl en="Send another" th="ส่งอีกครั้ง" lang={lang} /></button>
              <button className="btn primary" onClick={onClose}>OK</button>
            </div>
          </>
        )}
        {status?.kind === 'error' && (
          <>
            <svg className="test-popup__error" viewBox="0 0 52 52"><circle cx="26" cy="26" r="24" /><line x1="18" y1="18" x2="34" y2="34" /><line x1="34" y1="18" x2="18" y2="34" /></svg>
            <h3>{lang === 'th' ? 'ส่งทดสอบล้มเหลว' : 'Test failed'}</h3>
            <p className="test-popup__sub">{status.error}</p>
            <div className="test-popup__actions">
              <button className="btn" onClick={onClose}><Lbl en="Close" th="ปิด" lang={lang} /></button>
              <button className="btn primary" onClick={reset}><Lbl en="Try again" th="ลองอีกครั้ง" lang={lang} /></button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
