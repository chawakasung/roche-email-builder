import { useState, useEffect, useMemo, useCallback } from 'react';
import { newBlock, blockLabel } from './data/blocks.js';
import { BlockLibrary, RightPanel } from './components/Panels.jsx';
import { Canvas } from './components/Canvas.jsx';
import { PreviewModal } from './components/PreviewModal.jsx';
import { TestSendModal } from './components/TestSendModal.jsx';
import { TOPBAR_ICONS as I } from './components/icons.jsx';
import { downloadEmailHTML } from './utils/emailExport.js';
import { Lbl } from './components/Panels.jsx';

const seedBlocks = () => [
  newBlock('header'),
  newBlock('hero'),
  newBlock('text'),
  newBlock('twocol'),
  newBlock('quote'),
  newBlock('button'),
  newBlock('footer'),
];

function App() {
  const [blocks, setBlocks] = useState(seedBlocks);
  const [selectedId, setSelectedId] = useState(null);
  const [settings, setSettingsState] = useState({
    subject: "Q2 Town Hall — Hi {{first_name}}, here's the agenda",
    preheader: '12 min read · Pipeline updates, people stories, and a message from Thomas',
    fromName: 'Roche Internal Comms',
    fromEmail: 'onboarding@resend.dev',
    replyTo: 'no-reply@roche.com',
    brand: { primary: '#0B41CD', heroBg: '#FFF7F5' },
  });
  const [mode, setMode] = useState('edit');
  const [toast, setToast] = useState(null);
  const [draggingKind, setDraggingKind] = useState(null);
  const [draggingId, setDraggingId] = useState(null);
  const [dropIndex, setDropIndex] = useState(null);
  const [emailName, setEmailName] = useState('Q2 Town Hall — internal');
  const [lang] = useState('en');

  const onSettings = (patch) => setSettingsState(s => ({ ...s, ...patch }));

  function flash(msg) { setToast(msg); setTimeout(() => setToast(null), 2000); }

  const addBlock = useCallback((kind, atIndex) => {
    const b = newBlock(kind);
    setBlocks(bs => {
      if (atIndex == null) return [...bs, b];
      const copy = bs.slice(); copy.splice(atIndex, 0, b); return copy;
    });
    setSelectedId(b.id);
    flash((lang === 'th' ? 'เพิ่ม ' : 'Added ') + blockLabel(kind).en);
  }, [lang]);

  const deleteBlock = (id) => {
    setBlocks(bs => bs.filter(b => b.id !== id));
    if (selectedId === id) setSelectedId(null);
  };

  const duplicateBlock = (id) => setBlocks(bs => {
    const i = bs.findIndex(b => b.id === id);
    if (i < 0) return bs;
    const copy = bs.slice();
    const dup = newBlock(bs[i].kind);
    dup.props = structuredClone(bs[i].props);
    copy.splice(i + 1, 0, dup);
    return copy;
  });

  const moveBlock = (id, delta) => setBlocks(bs => {
    const i = bs.findIndex(b => b.id === id);
    const j = i + delta;
    if (i < 0 || j < 0 || j >= bs.length) return bs;
    const cp = bs.slice();
    [cp[i], cp[j]] = [cp[j], cp[i]];
    return cp;
  });

  const updateBlock = useCallback((id, key, value) => {
    setBlocks(bs => bs.map(b => b.id === id ? { ...b, props: { ...b.props, [key]: value } } : b));
  }, []);

  const selected = useMemo(() => blocks.find(b => b.id === selectedId), [blocks, selectedId]);

  const handleDownload = () => {
    try {
      downloadEmailHTML(blocks, settings, emailName);
      flash(lang === 'th' ? 'ดาวน์โหลด HTML แล้ว' : 'Downloaded HTML');
    } catch (e) {
      console.error(e);
      flash('Download failed');
    }
  };

  return (
    <div className="app">
      <div className="topbar">
        <img className="topbar__logo" src="/design-system/assets/roche-logo-blue.svg" alt="Roche" />
        <div className="topbar__divider" />
        <div className="topbar__title">Email Designer<small>{lang === 'th' ? 'เครื่องมือสร้างเทมเพลตอีเมล' : lang === 'en' ? 'Internal Comms Builder' : 'เครื่องมือสร้างเทมเพลตอีเมล · Internal Comms'}</small></div>
        <div className="topbar__divider" />
        <input className="topbar__name" value={emailName} onChange={(e) => setEmailName(e.target.value)} title="Email name" />

        <div className="topbar__spacer" />

        <div className="topbar__nav">
          <button className={mode === 'edit' ? 'is-active' : ''} onClick={() => setMode('edit')}>
            <Lbl en="Edit" th="แก้ไข" lang={lang} />
          </button>
          <button onClick={() => setMode('preview-modal')}>
            <Lbl en="Preview" th="ดูตัวอย่าง" lang={lang} />
          </button>
        </div>

        <button className="btn" onClick={() => { setBlocks(seedBlocks()); setSelectedId(null); flash(lang === 'th' ? 'รีเซ็ตเป็นเทมเพลต' : 'Reset to template'); }}>
          {I.reset} <Lbl en="Reset" th="รีเซ็ต" lang={lang} />
        </button>
        <button className="btn" onClick={handleDownload}>
          {I.download} HTML
        </button>
        <button className="btn primary" onClick={() => setMode('test-modal')}>
          {I.send} <Lbl en="Send test" th="ส่งทดสอบ" lang={lang} />
        </button>
      </div>

      <BlockLibrary
        lang={lang}
        onAdd={(k) => addBlock(k)}
        onDragStart={(e, k) => { setDraggingKind(k); e.dataTransfer.effectAllowed = 'copy'; }}
        onDragEnd={() => { setDraggingKind(null); setDropIndex(null); }}
      />

      <Canvas
        blocks={blocks}
        selectedId={selectedId}
        settings={settings}
        onSelect={setSelectedId}
        onDelete={deleteBlock}
        onDuplicate={duplicateBlock}
        onMove={moveBlock}
        onAddAt={(k, i) => addBlock(k, i)}
        dropIndex={dropIndex}
        setDropIndex={setDropIndex}
        draggingKind={draggingKind}
        setDraggingKind={setDraggingKind}
        draggingId={draggingId}
        setDraggingId={setDraggingId}
        lang={lang}
        onUpdateBlock={updateBlock}
      />

      <RightPanel
        lang={lang}
        selected={selected}
        onUpdate={updateBlock}
        settings={settings}
        onSettings={onSettings}
      />

      {mode === 'preview-modal' && <PreviewModal blocks={blocks} settings={settings} onClose={() => setMode('edit')} lang={lang} />}
      {mode === 'test-modal' && <TestSendModal blocks={blocks} settings={settings} onClose={() => setMode('edit')} lang={lang} />}

      {toast && <div className="toast">{I.check}{toast}</div>}
    </div>
  );
}

export default App;
