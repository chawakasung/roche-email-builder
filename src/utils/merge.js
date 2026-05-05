// Resolve {{merge_tags}} against a row
export function resolveMerge(text, row) {
  if (!text || !row) return text;
  return String(text).replace(/\{\{(\w+)\}\}/g, (_, k) => row[k] != null ? row[k] : `{{${k}}}`);
}

export function resolveBlockProps(props, row) {
  const out = {};
  for (const k in props) {
    out[k] = typeof props[k] === 'string' ? resolveMerge(props[k], row) : props[k];
  }
  return out;
}

export function resolveBlocks(blocks, row) {
  return blocks.map(b => ({ ...b, props: resolveBlockProps(b.props, row) }));
}
