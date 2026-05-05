import { useRef } from 'react';

// Click image → re-upload; corner-drag → resize. Persists width%/height px to props.
export function EditableImage({
  src, alt, editing, onReplace, widthPct, heightPx, onResize,
  defaultHeight = 200, allowResize = true, className = '', style = {},
}) {
  const inputRef = useRef(null);
  const wrapRef = useRef(null);
  const w = widthPct || 100;
  const h = heightPx || defaultHeight;

  const onPick = () => { if (editing) inputRef.current?.click(); };
  const onFile = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const r = new FileReader();
    r.onload = () => onReplace(r.result);
    r.readAsDataURL(f);
    e.target.value = '';
  };

  const onResizeDown = (e) => {
    if (!editing || !allowResize) return;
    e.preventDefault();
    e.stopPropagation();
    const wrap = wrapRef.current;
    const parent = wrap.parentElement;
    const parentW = parent.clientWidth;
    const startPt = e.touches ? e.touches[0] : e;
    const startX = startPt.clientX, startY = startPt.clientY;
    const startW = wrap.offsetWidth, startH = wrap.offsetHeight;
    const move = (ev) => {
      const pt = ev.touches ? ev.touches[0] : ev;
      const dx = pt.clientX - startX;
      const dy = pt.clientY - startY;
      const newW = Math.max(40, Math.min(parentW, startW + dx));
      const newH = Math.max(40, Math.min(800, startH + dy));
      const newPct = Math.round((newW / parentW) * 100);
      wrap.style.width = newPct + '%';
      wrap.style.height = newH + 'px';
      wrap._w = newPct; wrap._h = newH;
      if (ev.preventDefault) ev.preventDefault();
    };
    const up = () => {
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseup', up);
      window.removeEventListener('touchmove', move);
      window.removeEventListener('touchend', up);
      if (wrap._w != null) onResize(wrap._w, wrap._h);
    };
    window.addEventListener('mousemove', move);
    window.addEventListener('mouseup', up);
    window.addEventListener('touchmove', move, { passive: false });
    window.addEventListener('touchend', up);
  };

  return (
    <div
      ref={wrapRef}
      className={'edit-img ' + className + (editing ? ' is-editing' : '') + (!src ? ' is-empty' : '')}
      style={{ ...style, width: w + '%', height: h + 'px' }}
    >
      {src ? (
        <img src={src} alt={alt || ''} onClick={onPick} />
      ) : (
        <div className="edit-img__ph" onClick={onPick}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="1"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>
          <span>Click to add image</span>
        </div>
      )}
      {editing && src && (
        <div className="edit-img__overlay" onClick={onPick}>
          <span className="edit-img__btn">⇄ Replace</span>
        </div>
      )}
      {editing && allowResize && src && (
        <div className="edit-img__resize" onMouseDown={onResizeDown} onTouchStart={onResizeDown} title="Drag to resize">
          <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M2 11 L11 2 M6 11 L11 6 M9 11 L11 9"/></svg>
        </div>
      )}
      <input ref={inputRef} type="file" accept="image/*" onChange={onFile} style={{ display: 'none' }} />
    </div>
  );
}
