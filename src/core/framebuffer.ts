import type { PaletteKey } from './palette';

export type Cell = {
  ch: string;
  fg: PaletteKey;
  bg: PaletteKey;
};

export class Framebuffer {
  readonly cols: number;
  readonly rows: number;
  readonly cells: Cell[];

  constructor(cols: number, rows: number) {
    this.cols = cols;
    this.rows = rows;
    this.cells = Array.from({ length: cols * rows }, () => ({ ch: ' ', fg: 'text', bg: 'bg' }));
  }

  clear(bg: PaletteKey = 'bg', fg: PaletteKey = 'text') {
    for (const cell of this.cells) {
      cell.ch = ' ';
      cell.fg = fg;
      cell.bg = bg;
    }
  }

  put(x: number, y: number, ch: string, fg: PaletteKey = 'text', bg: PaletteKey = 'bg') {
    if (x < 0 || x >= this.cols || y < 0 || y >= this.rows) return;
    const cell = this.cells[y * this.cols + x];
    cell.ch = ch[0] ?? ' ';
    cell.fg = fg;
    cell.bg = bg;
  }

  write(x: number, y: number, text: string, fg: PaletteKey = 'text', bg: PaletteKey = 'bg') {
    for (let i = 0; i < text.length; i += 1) this.put(x + i, y, text[i], fg, bg);
  }

  hline(x: number, y: number, w: number, ch = '-', fg: PaletteKey = 'dim') {
    for (let i = 0; i < w; i += 1) this.put(x + i, y, ch, fg);
  }

  vline(x: number, y: number, h: number, ch = '|', fg: PaletteKey = 'dim') {
    for (let i = 0; i < h; i += 1) this.put(x, y + i, ch, fg);
  }

  box(x: number, y: number, w: number, h: number, fg: PaletteKey = 'dim') {
    this.hline(x, y, w, '-', fg);
    this.hline(x, y + h - 1, w, '-', fg);
    this.vline(x, y, h, '|', fg);
    this.vline(x + w - 1, y, h, '|', fg);
    this.put(x, y, '.', fg);
    this.put(x + w - 1, y, '.', fg);
    this.put(x, y + h - 1, '.', fg);
    this.put(x + w - 1, y + h - 1, '.', fg);
  }
}

export const padRight = (input: string, width: number): string => {
  if (input.length <= width) return input.padEnd(width, ' ');
  if (width <= 1) return '…';
  return `${input.slice(0, width - 1)}…`;
};
