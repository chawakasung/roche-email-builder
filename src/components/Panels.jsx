import { useState, useEffect, useRef } from 'react';
import { BLOCK_LIBRARY, BLOCK_GROUPS, FIELDS, blockLabel } from '../data/blocks.js';
import { BLOCK_ICONS } from './icons.jsx';

// ─── Bilingual label ───────
export function Lbl({ en, th, lang }) {
  if (lang === 'en') return <>{en}</>;
  if (lang === 'th') return <>{th}</>;
  return <><span className="en">{en}</span> <span className="th">{th}</span></>;
}

// ─── Image Field (file upload + URL) ───────
export function ImageField({ value, onChange }) {
  const ref = useRef(null);
  function handleFile(file) {
    if (!file) return;
    const r = new FileReader();
    r.onload = (e) => onChange(e.target.result);
    r.readAsDataURL(file);
  }
  return (
    <div className="img-field">
      <div className="img-field__preview">
        {value ? <img src={value} alt="" /> : <span className="ph">No image</span>}
      </div>
      <div className="img-field__row">
        <button type="button" className="img-field__upload" onClick={() => ref.current?.click()}>
          <svg viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
          Upload image
        </button>
        {value && <button type="button" className="img-field__clear" onClick={() => onChange('')}>Clear</button>}
        <input ref={ref} type="file" accept="image/*" onChange={(e) => handleFile(e.target.files[0])} />
      </div>
      <input type="text" placeholder="…or paste an image URL" value={value || ''} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}

// ─── Block Library (left panel) ───────
export function BlockLibrary({ lang, onAdd, onDragStart, onDragEnd }) {
  return (
    <aside className="panel" onClick={(e) => e.stopPropagation()}>
      <div className="panel__head">
        <h3><Lbl en="Content blocks" th="บล็อกเนื้อหา" lang={lang} /></h3>
        <p>{lang === 'th' ? 'ลากบล็อกไปยังอีเมล หรือคลิกเพื่อเพิ่ม' : 'Drag a block onto the email — or click to add'}</p>
      </div>
      {BLOCK_GROUPS.map(g => (
        <div className="bl-section" key={g.id}>
          <h4 className="bl-section__h"><Lbl en={g.label.en} th={g.label.th} lang={lang} /></h4>
          {BLOCK_LIBRARY.filter(b => b.group === g.id).map(b => (
            <button
              key={b.kind}
              className="bl-item"
              draggable
              onDragStart={(e) => onDragStart(e, b.kind)}
              onDragEnd={onDragEnd}
              onClick={() => onAdd(b.kind)}
              title={`Add ${b.label.en}`}
            >
              <div className="bl-item__icon">{BLOCK_ICONS[b.kind]}</div>
              <div className="bl-item__lbl">
                <span className="en">{b.label.en}</span>
                {lang !== 'en' && <span className="th">{b.label.th}</span>}
              </div>
            </button>
          ))}
        </div>
      ))}
      <div style={{ flex: 1 }} />
    </aside>
  );
}

// ─── Right Panel (Global + Inspector) ───────
export function RightPanel({ lang, selected, onUpdate, settings, onSettings }) {
  const [tab, setTab] = useState('global');
  useEffect(() => { if (selected) setTab('block'); else setTab('global'); }, [selected]);

  return (
    <aside className="panel panel--right" onClick={(e) => e.stopPropagation()}>
      <div className="tabs">
        <button className={tab === 'global' ? 'is-active' : ''} onClick={() => setTab('global')}>
          <Lbl en="Email settings" th="ตั้งค่าอีเมล" lang={lang} />
        </button>
        <button className={tab === 'block' ? 'is-active' : ''} onClick={() => setTab('block')} disabled={!selected}>
          <Lbl en="Block" th="บล็อก" lang={lang} />
        </button>
      </div>
      {tab === 'global'
        ? <GlobalSettings lang={lang} settings={settings} onSettings={onSettings} />
        : <Inspector lang={lang} block={selected} onChange={onUpdate} />}
    </aside>
  );
}

function GlobalSettings({ lang, settings, onSettings }) {
  const SWATCHES = ['#0B41CD', '#022366', '#1482FA', '#ED4A0D', '#00A17D', '#544F4F'];
  const HERO_BGS = ['#FFF7F5', '#FFE8DE', '#F5F5F2', '#FFFFFF', '#BDE3FF'];
  return (
    <div className="insp">
      <div className="insp__row">
        <label><Lbl en="Subject line" th="หัวเรื่องอีเมล" lang={lang} /></label>
        <input type="text" value={settings.subject} onChange={(e) => onSettings({ subject: e.target.value })} />
      </div>
      <div className="insp__row">
        <label><Lbl en="Preheader" th="ข้อความนำ" lang={lang} /></label>
        <input type="text" value={settings.preheader} onChange={(e) => onSettings({ preheader: e.target.value })} placeholder="Preview text shown after subject" />
      </div>
      <div className="insp__row">
        <label><Lbl en="From name" th="ชื่อผู้ส่ง" lang={lang} /></label>
        <input type="text" value={settings.fromName} onChange={(e) => onSettings({ fromName: e.target.value })} />
      </div>
      <div className="insp__row">
        <label><Lbl en="From email" th="อีเมลผู้ส่ง" lang={lang} /></label>
        <input type="email" value={settings.fromEmail} onChange={(e) => onSettings({ fromEmail: e.target.value })} />
      </div>
      <div className="insp__row">
        <label><Lbl en="Reply-to" th="ตอบกลับไปที่" lang={lang} /></label>
        <input type="email" value={settings.replyTo} onChange={(e) => onSettings({ replyTo: e.target.value })} />
      </div>
      <div className="insp__row">
        <label><Lbl en="Brand colour" th="สีหลัก" lang={lang} /></label>
        <div className="swatches">
          {SWATCHES.map(c => (
            <div key={c} className={'swatch' + (settings.brand.primary === c ? ' is-active' : '')}
              style={{ background: c }}
              onClick={() => onSettings({ brand: { ...settings.brand, primary: c } })} />
          ))}
        </div>
        <input type="text" value={settings.brand.primary}
          style={{ marginTop: 6, fontFamily: 'var(--font-mono)', fontSize: 11 }}
          onChange={(e) => onSettings({ brand: { ...settings.brand, primary: e.target.value } })} />
      </div>
      <div className="insp__row">
        <label><Lbl en="Hero background" th="พื้นหลังภาพหลัก" lang={lang} /></label>
        <div className="swatches">
          {HERO_BGS.map(c => (
            <div key={c} className={'swatch' + (settings.brand.heroBg === c ? ' is-active' : '')}
              style={{ background: c }}
              onClick={() => onSettings({ brand: { ...settings.brand, heroBg: c } })} />
          ))}
        </div>
      </div>
      <div className="insp__row" style={{ borderBottom: 0 }}>
        <label><Lbl en="Available merge tags" th="แท็กข้อมูลที่ใช้ได้" lang={lang} /></label>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginTop: 4 }}>
          {['first_name', 'last_name', 'email', 'department'].map(t => (
            <span key={t} style={{ fontSize: 10, padding: '3px 7px', background: 'var(--grey-5)', border: '1px solid var(--hairline)', fontFamily: 'var(--font-mono)', color: 'var(--roche-blue)' }}>{`{{${t}}}`}</span>
          ))}
        </div>
        <p style={{ fontSize: 11, color: 'var(--fg-3)', marginTop: 8, lineHeight: 1.45, marginBottom: 0 }}>
          {lang === 'th' ? 'พิมพ์แท็กในข้อความ ระบบจะแทนค่าตอนส่งจริง' : "Type tags in any text — they're replaced per recipient at send time."}
        </p>
      </div>
    </div>
  );
}

function Inspector({ lang, block, onChange }) {
  if (!block) {
    return (
      <div className="empty-state">
        <svg viewBox="0 0 24 24" strokeLinecap="round"><circle cx="12" cy="12" r="9"/><path d="M9 12h6M12 9v6"/></svg>
        <Lbl en="Select a block to edit" th="เลือกบล็อกเพื่อแก้ไข" lang={lang} />
      </div>
    );
  }
  const fields = FIELDS[block.kind] || [];
  const lbl = blockLabel(block.kind);
  return (
    <div className="insp">
      <div className="insp__head">
        <div className="ttl"><span className="en">{lbl.en}</span>{lang !== 'en' && <span className="th">{lbl.th}</span>}</div>
        <span className="id">#{block.id}</span>
      </div>
      {fields.length === 0 && (
        <div className="empty-state">
          <Lbl en="This block has no editable content" th="บล็อกนี้ไม่มีเนื้อหาที่แก้ไขได้" lang={lang} />
        </div>
      )}
      {fields.map(([key, label, kind, opts]) => (
        <div className="insp__row" key={key}>
          <label>
            {label.en}
            {lang !== 'en' && <span className="th">/ {label.th}</span>}
          </label>
          {kind === 'textarea' ? (
            <textarea value={block.props[key] || ''} onChange={e => onChange(block.id, key, e.target.value)} />
          ) : kind === 'image' ? (
            <ImageField value={block.props[key] || ''} onChange={(v) => onChange(block.id, key, v)} />
          ) : kind === 'select' ? (
            <select value={block.props[key] || ''} onChange={e => onChange(block.id, key, e.target.value)}>
              {(opts?.options || opts || []).map(o => {
                const [val, lab] = Array.isArray(o) ? o : [o, o];
                return <option key={val} value={val}>{lab}</option>;
              })}
            </select>
          ) : kind === 'slider' ? (
            <div className="slider-field">
              <input type="range"
                min={opts?.min ?? 0} max={opts?.max ?? 100} step={opts?.step ?? 1}
                value={block.props[key] ?? opts?.min ?? 0}
                onChange={e => onChange(block.id, key, Number(e.target.value))} />
              <span className="slider-field__val">{block.props[key] ?? opts?.min ?? 0}{opts?.suffix || ''}</span>
            </div>
          ) : kind === 'swatches' ? (
            <div className="swatch-field">
              {opts.map(sw => (
                <button key={sw.value} type="button"
                  className={'swatch-field__sw' + (block.props[key] === sw.value ? ' is-active' : '')}
                  style={{ background: sw.value, borderColor: sw.value === '#FFFFFF' ? '#ddd' : 'transparent' }}
                  title={sw.label}
                  onClick={() => onChange(block.id, key, sw.value)} />
              ))}
            </div>
          ) : kind === 'toggle' ? (
            <div className="toggle-field" onClick={() => onChange(block.id, key, !block.props[key])}>
              <div className={'toggle-field__sw' + (block.props[key] ? ' is-on' : '')} />
              <span className="toggle-field__lbl">{block.props[key] ? 'On' : 'Off'}</span>
            </div>
          ) : (
            <input type={kind || 'text'} value={block.props[key] || ''} onChange={e => onChange(block.id, key, e.target.value)} />
          )}
        </div>
      ))}
    </div>
  );
}

