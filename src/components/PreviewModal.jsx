import { useState } from 'react';
import { BlockBody, resolveMerge, resolveBlockProps } from './BlockBody.jsx';
import { Lbl } from './Panels.jsx';
import { TOPBAR_ICONS as I } from './icons.jsx';

export function PreviewModal({ blocks, settings, onClose, lang }) {
  const [device, setDevice] = useState('desktop');
  const sampleRow = { first_name: 'Somchai', last_name: 'Jaidee', email: 'somchai.j@roche.com', department: 'R&D Bangkok' };

  return (
    <div className="modal-bg" onClick={onClose}>
      <div className="modal" style={{ maxWidth: 1080, height: '90vh' }} onClick={(e) => e.stopPropagation()}>
        <div className="modal__head">
          <h3>
            <Lbl en="Preview" th="ดูตัวอย่าง" lang={lang} />
            <small>{lang === 'th' ? 'แสดงตัวอย่างพร้อมข้อมูลผู้รับ' : 'Rendered with sample recipient data'}</small>
          </h3>
          <div style={{ display: 'flex', gap: 4 }}>
            <button className={'btn sm' + (device === 'desktop' ? ' primary' : '')} onClick={() => setDevice('desktop')}>{I.desktop} Desktop</button>
            <button className={'btn sm' + (device === 'mobile' ? ' primary' : '')} onClick={() => setDevice('mobile')}>{I.mobile} Mobile</button>
            <button className="close" onClick={onClose}>×</button>
          </div>
        </div>
        <div className="modal__body" style={{ background: 'var(--grey-5)' }}>
          <div className={'device-shell' + (device === 'mobile' ? ' mobile' : '')} style={{ margin: '0 auto' }}>
            <div className="device">
              <div className="device__meta">
                <div className="row"><span className="lbl">From</span><span className="val">{settings.fromName}</span></div>
                <div className="row"><span className="lbl">To</span><span className="val">{sampleRow.first_name} {sampleRow.last_name} &lt;{sampleRow.email}&gt;</span></div>
                <div className="row"><span className="lbl">Subject</span><span className="val subj">{resolveMerge(settings.subject, sampleRow)}</span></div>
                {settings.preheader && <div className="row"><span className="lbl">Preview</span><span className="val pre">{resolveMerge(settings.preheader, sampleRow)}</span></div>}
              </div>
              <div className="email">
                {blocks.map(b => (
                  <div className="block" key={b.id} style={{ outline: 'none', cursor: 'default' }}>
                    <BlockBody kind={b.kind} props={resolveBlockProps(b.props, sampleRow)} brand={settings.brand} editing={false} onEdit={() => {}} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="modal__foot">
          <span style={{ fontSize: 11, color: 'var(--fg-3)' }}>
            {lang === 'th' ? 'แสดงผลด้วยข้อมูล: ' : 'Sample recipient: '}<b>{sampleRow.first_name} {sampleRow.last_name}</b> · {sampleRow.email}
          </span>
          <div className="right">
            <button className="btn" onClick={onClose}><Lbl en="Close" th="ปิด" lang={lang} /></button>
          </div>
        </div>
      </div>
    </div>
  );
}
