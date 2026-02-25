const GLYPH_W = 8;
const GLYPH_H = 16;

export class FontAtlas {
  readonly glyphWidth = GLYPH_W;
  readonly glyphHeight = GLYPH_H;
  private readonly masks = new Map<string, Uint8Array>();
  private readonly tinted = new Map<string, ImageData>();
  private readonly rasterCtx: CanvasRenderingContext2D;

  constructor() {
    const canvas = document.createElement('canvas');
    canvas.width = GLYPH_W;
    canvas.height = GLYPH_H;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) throw new Error('2d context unavailable');
    ctx.font = '16px monospace';
    ctx.textBaseline = 'top';
    this.rasterCtx = ctx;
  }

  private maskFor(ch: string): Uint8Array {
    const c = ch.length > 0 ? ch[0] : ' ';
    const existing = this.masks.get(c);
    if (existing) return existing;

    const ctx = this.rasterCtx;
    ctx.clearRect(0, 0, GLYPH_W, GLYPH_H);
    ctx.fillStyle = '#fff';
    ctx.fillText(c, 0, -2);
    const image = ctx.getImageData(0, 0, GLYPH_W, GLYPH_H).data;
    const mask = new Uint8Array(GLYPH_W * GLYPH_H);
    for (let i = 0; i < mask.length; i += 1) {
      mask[i] = image[i * 4 + 3] > 90 ? 255 : 0;
    }
    this.masks.set(c, mask);
    return mask;
  }

  private tintedGlyph(ch: string, color: string): ImageData {
    const key = `${ch}:${color}`;
    const cached = this.tinted.get(key);
    if (cached) return cached;

    const mask = this.maskFor(ch);
    const [, r, g, b] = /^#?([\da-f]{2})([\da-f]{2})([\da-f]{2})$/i.exec(color) ?? ['', 'ff', 'ff', 'ff'];
    const image = new ImageData(GLYPH_W, GLYPH_H);
    for (let i = 0; i < mask.length; i += 1) {
      image.data[i * 4] = Number.parseInt(r, 16);
      image.data[i * 4 + 1] = Number.parseInt(g, 16);
      image.data[i * 4 + 2] = Number.parseInt(b, 16);
      image.data[i * 4 + 3] = mask[i];
    }
    this.tinted.set(key, image);
    return image;
  }

  drawGlyph(ctx: CanvasRenderingContext2D, ch: string, x: number, y: number, color: string) {
    const image = this.tintedGlyph(ch, color);
    ctx.putImageData(image, x, y);
  }
}
