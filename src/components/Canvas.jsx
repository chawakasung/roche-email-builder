import { Fragment } from 'react';
import { BlockBody } from './BlockBody.jsx';
import { Lbl } from './Panels.jsx';
import { ICONS } from './icons.jsx';
import { blockLabel } from '../data/blocks.js';

function BlockWrap({
  block, selected, onSelect, onDelete, onDuplicate, onMove,
  brand, isFirst, isLast, index, onBlockDragOver, onBlockDrop,
  dragHandlers, onUpdateBlock, onDeselect,
}) {
  return (
    <div
      className={'block' + (selected ? ' is-selected' : '')}
      data-block-id={block.id}
      onClick={(e) => { e.stopPropagation(); onSelect(block.id); }}
      draggable
      {...dragHandlers}
      onDragOver={(e) => onBlockDragOver(e, index)}
      onDrop={(e) => onBlockDrop(e, index)}
    >
      <div className="block__grip" title="Drag to reorder" onClick={(e) => e.stopPropagation()}>
        <svg viewBox="0 0 16 16" fill="currentColor"><circle cx="5" cy="3" r="1.4"/><circle cx="11" cy="3" r="1.4"/><circle cx="5" cy="8" r="1.4"/><circle cx="11" cy="8" r="1.4"/><circle cx="5" cy="13" r="1.4"/><circle cx="11" cy="13" r="1.4"/></svg>
      </div>
      <div className="block__handle">
        <span style={{ display: 'flex', alignItems: 'center', padding: '0 4px' }}>{ICONS.drag}</span>
        <span className="lbl">{blockLabel(block.kind).en}</span>
        <span className="sep" />
        <button onClick={(e) => { e.stopPropagation(); onMove(block.id, -1); }} disabled={isFirst} title="Move up">{ICONS.up}</button>
        <button onClick={(e) => { e.stopPropagation(); onMove(block.id, 1); }} disabled={isLast} title="Move down">{ICONS.down}</button>
        <button onClick={(e) => { e.stopPropagation(); onDuplicate(block.id); }} title="Duplicate">{ICONS.copy}</button>
        <button onClick={(e) => { e.stopPropagation(); onDelete(block.id); }} title="Delete">{ICONS.trash}</button>
      </div>
      <BlockBody
        kind={block.kind}
        props={block.props}
        brand={brand}
        editing={selected}
        onEdit={(k, v) => onUpdateBlock(block.id, k, v)}
        onCloseLetter={onDeselect}
      />
    </div>
  );
}

export function Canvas({
  blocks, selectedId, settings, onSelect, onDelete, onDuplicate, onMove,
  onAddAt, dropIndex, setDropIndex, draggingKind, setDraggingKind,
  draggingId, setDraggingId, lang, onUpdateBlock,
}) {
  const handleAreaDragOver = (e, idx) => { e.preventDefault(); setDropIndex(idx); };
  const handleBlockDragOver = (e, idx) => {
    if (!draggingKind && !draggingId) return;
    e.preventDefault();
    const r = e.currentTarget.getBoundingClientRect();
    const insertAt = (e.clientY - r.top) < r.height / 2 ? idx : idx + 1;
    setDropIndex(insertAt);
  };
  const handleBlockDrop = (e, idx) => {
    if (!draggingKind && !draggingId) return;
    e.preventDefault();
    const r = e.currentTarget.getBoundingClientRect();
    const insertAt = (e.clientY - r.top) < r.height / 2 ? idx : idx + 1;
    handleDrop(e, insertAt);
  };
  const handleDrop = (e, idx) => {
    e.preventDefault();
    if (draggingKind) {
      onAddAt(draggingKind, idx);
    } else if (draggingId) {
      const from = blocks.findIndex(b => b.id === draggingId);
      if (from > -1 && from !== idx && from + 1 !== idx) {
        const target = idx > from ? idx - 1 : idx;
        onMove(draggingId, target - from);
      }
    }
    setDropIndex(null);
    setDraggingKind(null);
    setDraggingId(null);
  };

  return (
    <div className="canvas-wrap" onClick={() => onSelect(null)}>
      <div className="device-shell">
        <div className="device" onClick={(e) => e.stopPropagation()}>
          <div className="device__chrome">
            <span className="dot" /><span className="dot" /><span className="dot" />
            <span style={{ marginLeft: 8 }}>{lang === 'th' ? 'ตัวอย่างกล่องจดหมาย · 750px' : 'Inbox preview · 750px wide'}</span>
          </div>
          <div className="device__meta">
            <div className="row"><span className="lbl">From</span><span className="val">{settings.fromName} &lt;{settings.fromEmail}&gt;</span></div>
            <div className="row"><span className="lbl">Subject</span><span className="val subj">{settings.subject || <span style={{ color: 'var(--fg-3)' }}>{lang === 'th' ? '(ไม่มีหัวเรื่อง)' : '(no subject)'}</span>}</span></div>
            {settings.preheader && <div className="row"><span className="lbl">Preview</span><span className="val pre">{settings.preheader}</span></div>}
          </div>
          <div className="email">
            {blocks.length === 0 ? (
              <div
                className={'drop-zone-empty' + (dropIndex !== null ? ' is-over' : '')}
                onDragOver={(e) => handleAreaDragOver(e, 0)}
                onDragLeave={() => setDropIndex(null)}
                onDrop={(e) => handleDrop(e, 0)}
              >
                <svg viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16"/><path d="M8 12h8M12 8v8"/></svg>
                <div>
                  <Lbl en="Drag blocks here, or click them on the left" th="ลากบล็อกมาที่นี่ หรือคลิกที่บล็อกด้านซ้าย" lang={lang} />
                </div>
              </div>
            ) : (
              <>
                <div
                  className={'drop-line' + (dropIndex === 0 ? ' is-active' : '')}
                  onDragOver={(e) => handleAreaDragOver(e, 0)}
                  onDragLeave={() => setDropIndex(null)}
                  onDrop={(e) => handleDrop(e, 0)}
                  style={{ height: 24 }}
                />
                {blocks.map((b, i) => (
                  <Fragment key={b.id}>
                    <BlockWrap
                      block={b}
                      selected={selectedId === b.id}
                      onSelect={onSelect}
                      onDelete={onDelete}
                      onDuplicate={onDuplicate}
                      onMove={onMove}
                      brand={settings.brand}
                      isFirst={i === 0}
                      isLast={i === blocks.length - 1}
                      index={i}
                      onBlockDragOver={handleBlockDragOver}
                      onBlockDrop={handleBlockDrop}
                      onUpdateBlock={onUpdateBlock}
                      onDeselect={() => onSelect(null)}
                      dragHandlers={{
                        onDragStart: (e) => { setDraggingId(b.id); e.dataTransfer.effectAllowed = 'move'; },
                        onDragEnd: () => { setDraggingId(null); setDropIndex(null); },
                      }}
                    />
                    <div
                      className={'drop-line' + (dropIndex === i + 1 ? ' is-active' : '')}
                      onDragOver={(e) => handleAreaDragOver(e, i + 1)}
                      onDragLeave={() => setDropIndex(null)}
                      onDrop={(e) => handleDrop(e, i + 1)}
                      style={{ height: 16 }}
                    />
                  </Fragment>
                ))}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
