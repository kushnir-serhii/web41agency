export type HrefKind = 'internal' | 'external' | 'mailto';

export type InlineNode =
  | { type: 'text'; text: string }
  | { type: 'bold'; text: string }
  | { type: 'link'; text: string; href: string; kind: HrefKind }
  | { type: 'br' };

export type BlockNode =
  | { type: 'paragraph'; children: InlineNode[] }
  | { type: 'list'; ordered: boolean; items: InlineNode[][] };

const LINK_RE = /^\[([^\]\n]+)\]\(([^)\s]+)\)/;
const LIST_ITEM_RE = /^\s*(?:[-*]\s+|\d+\.\s+)(.*)$/;
const ORDERED_RE = /^\s*\d+\.\s+/;
const UNSAFE_CHARS_RE = /[\s\\]/;

/** Returns how a link should be rendered, or null when the href is not allowed. */
export function classifyHref(href: string): HrefKind | null {
  const value = href.trim();
  if (!value || UNSAFE_CHARS_RE.test(value)) return null;
  if (/^https?:\/\/[^/]/i.test(value)) return 'external';
  if (/^mailto:./i.test(value)) return 'mailto';
  if ((value.startsWith('/') && !value.startsWith('//')) || value.startsWith('#'))
    return 'internal';
  return null;
}

export function isSafeHref(href: string): boolean {
  return classifyHref(href) !== null;
}

function pushText(nodes: InlineNode[], text: string): void {
  if (!text) return;
  const last = nodes[nodes.length - 1];
  if (last?.type === 'text') last.text += text;
  else nodes.push({ type: 'text', text });
}

/** Parses bold and links; unclosed markers are tolerated (open `**` bolds the rest, open link stays text). */
export function parseInline(src: string): InlineNode[] {
  const nodes: InlineNode[] = [];
  let i = 0;
  while (i < src.length) {
    if (src.startsWith('**', i)) {
      const end = src.indexOf('**', i + 2);
      const inner = src.slice(i + 2, end === -1 ? undefined : end);
      if (inner) nodes.push({ type: 'bold', text: inner });
      i = end === -1 ? src.length : end + 2;
    } else if (src[i] === '[') {
      const match = LINK_RE.exec(src.slice(i));
      if (match) {
        const kind = classifyHref(match[2]);
        if (kind) nodes.push({ type: 'link', text: match[1], href: match[2].trim(), kind });
        else pushText(nodes, match[1]);
        i += match[0].length;
      } else {
        pushText(nodes, '[');
        i += 1;
      }
    } else {
      const next = src.slice(i + 1).search(/\*\*|\[/);
      const stop = next === -1 ? src.length : i + 1 + next;
      pushText(nodes, src.slice(i, stop));
      i = stop;
    }
  }
  return nodes;
}

export function parseMarkdown(src: string): BlockNode[] {
  const blocks: BlockNode[] = [];
  let paragraph: string[] = [];
  let list: { ordered: boolean; items: InlineNode[][] } | null = null;

  const flushParagraph = (): void => {
    if (!paragraph.length) return;
    const children: InlineNode[] = [];
    paragraph.forEach((line, idx) => {
      if (idx > 0) children.push({ type: 'br' });
      children.push(...parseInline(line));
    });
    blocks.push({ type: 'paragraph', children });
    paragraph = [];
  };
  const flushList = (): void => {
    if (list) blocks.push({ type: 'list', ...list });
    list = null;
  };

  for (const line of src.replace(/\r\n?/g, '\n').split('\n')) {
    if (!line.trim()) {
      flushParagraph();
      flushList();
      continue;
    }
    const item = LIST_ITEM_RE.exec(line);
    if (item) {
      flushParagraph();
      list ??= { ordered: ORDERED_RE.test(line), items: [] };
      list.items.push(parseInline(item[1]));
    } else {
      flushList();
      paragraph.push(line.trim());
    }
  }
  flushParagraph();
  flushList();
  return blocks;
}
