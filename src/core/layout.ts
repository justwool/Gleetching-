export const TERM_COLS = 120;
export const TERM_ROWS = 42;

export const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));

export const truncate = (text: string, width: number): string => {
  if (text.length <= width) return text;
  if (width <= 3) return '.'.repeat(width);
  return `${text.slice(0, width - 3)}...`;
};

export const padRight = (text: string, width: number): string => truncate(text, width).padEnd(width, ' ');

export const padLeft = (text: string, width: number): string => truncate(text, width).padStart(width, ' ');

export const hbar = (width: number, ch = '-') => ch.repeat(width);

export const box = (lines: string[], width: number): string[] => {
  const top = `+${hbar(width - 2, '-')}+`;
  const body = lines.map((line) => `|${padRight(line, width - 2)}|`);
  return [top, ...body, top];
};

export const tableRow = (cols: string[], widths: number[]): string =>
  `|${cols.map((c, i) => padRight(c, widths[i])).join('|')}|`;

export const lineWithRight = (left: string, right: string, width: number): string => {
  const gap = Math.max(1, width - left.length - right.length);
  return `${left}${' '.repeat(gap)}${right}`.slice(0, width);
};

export const bar = (value: number, max: number, width: number): string => {
  const fill = Math.round((value / Math.max(1, max)) * width);
  return `[${'#'.repeat(fill)}${'.'.repeat(width - fill)}]`;
};

export const histogram = (values: number[], width: number): string => {
  const chars = '.:-=+*#';
  const max = Math.max(...values, 1);
  let out = '';
  for (let i = 0; i < width; i += 1) {
    const idx = Math.floor((i / width) * values.length);
    const ratio = values[idx] / max;
    out += chars[Math.min(chars.length - 1, Math.floor(ratio * chars.length))];
  }
  return out;
};
