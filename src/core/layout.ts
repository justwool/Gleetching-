export const TERM_COLS = 120;
export const TERM_ROWS = 42;

export const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));
export const clampNum = clamp;

export const safeInnerWidth = (cols: number, padding = 2) => Math.max(10, cols - padding);

export const truncate = (text: string, width: number): string => {
  if (width <= 0) return '';
  if (text.length <= width) return text;
  if (width <= 3) return '.'.repeat(width);
  return `${text.slice(0, width - 3)}...`;
};

export const padRight = (text: string, width: number): string => truncate(text, width).padEnd(Math.max(0, width), ' ');

export const padLeft = (text: string, width: number): string => truncate(text, width).padStart(Math.max(0, width), ' ');

export const padToCols = (line: string, cols: number): string => truncate(line, cols).padEnd(Math.max(0, cols), ' ');

export const sep = (cols: number, ch = '-'): string => ch.repeat(Math.max(0, cols));

export const hbar = (width: number, ch = '-') => ch.repeat(Math.max(0, width));

export const box = (lines: string[], width: number): string[] => {
  const w = Math.max(4, width);
  const inner = w - 2;
  const top = `+${hbar(inner, '-')}+`;
  const body = lines.map((line) => `|${padRight(line, inner)}|`);
  return [top, ...body, top];
};

export const tableRow = (cols: string[], widths: number[]): string =>
  `|${cols.map((c, i) => padRight(c, widths[i] ?? 0)).join('|')}|`;

export const lineWithRight = (left: string, right: string, width: number): string => {
  const w = Math.max(4, width);
  const total = left.length + right.length;
  if (total >= w) {
    return `${truncate(left, Math.max(1, w - right.length - 1))} ${truncate(right, Math.max(1, w - 1))}`.slice(0, w);
  }
  return `${left}${' '.repeat(w - total)}${right}`;
};

export const bar = (value: number, max: number, width: number): string => {
  const w = Math.max(1, width);
  const fill = Math.round((value / Math.max(1, max)) * w);
  return `[${'#'.repeat(clamp(fill, 0, w))}${'.'.repeat(clamp(w - fill, 0, w))}]`;
};

export const histogram = (values: number[], width: number): string => {
  const chars = '.:-=+*#';
  const max = Math.max(...values, 1);
  let out = '';
  for (let i = 0; i < width; i += 1) {
    const idx = Math.floor((i / Math.max(1, width)) * values.length);
    const ratio = values[idx] / max;
    out += chars[Math.min(chars.length - 1, Math.floor(ratio * chars.length))];
  }
  return out;
};
