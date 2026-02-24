import { FontAtlas } from './fontAtlas';
import { Framebuffer } from './framebuffer';
import { buildLayout } from './layout';
import { paletteColor } from './palette';
import { drawCrt } from './crtFx';
import { makeSpectrum, nextSpectrum } from './spectrum';

const COLS = 120;
const ROWS = 45;

export const startRenderer = (
  canvas: HTMLCanvasElement,
  options: { crtEnabled: () => boolean; showSpectrum: () => boolean },
) => {
  const font = new FontAtlas();
  const fb = new Framebuffer(COLS, ROWS);

  const native = document.createElement('canvas');
  native.width = COLS * font.glyphWidth;
  native.height = ROWS * font.glyphHeight;
  const nctx = native.getContext('2d');
  const dctx = canvas.getContext('2d');
  if (!nctx || !dctx) return () => undefined;

  let spectrum = makeSpectrum(COLS);
  let raf = 0;

  const resize = () => {
    const dpr = window.devicePixelRatio || 1;
    canvas.width = Math.floor(window.innerWidth * dpr);
    canvas.height = Math.floor(window.innerHeight * dpr);
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;
  };

  const drawFramebuffer = () => {
    nctx.fillStyle = paletteColor('bg');
    nctx.fillRect(0, 0, native.width, native.height);

    for (let y = 0; y < fb.rows; y += 1) {
      for (let x = 0; x < fb.cols; x += 1) {
        const cell = fb.cells[y * fb.cols + x];
        if (cell.bg !== 'bg') {
          nctx.fillStyle = paletteColor(cell.bg);
          nctx.fillRect(x * font.glyphWidth, y * font.glyphHeight, font.glyphWidth, font.glyphHeight);
        }
        if (cell.ch !== ' ') {
          font.drawGlyph(
            nctx,
            cell.ch,
            x * font.glyphWidth,
            y * font.glyphHeight,
            paletteColor(cell.fg),
          );
        }
      }
    }
  };

  const loop = (t: number) => {
    spectrum = nextSpectrum(spectrum, t);
    buildLayout(fb, options.showSpectrum(), spectrum);
    drawFramebuffer();
    drawCrt(native, dctx, t, options.crtEnabled());
    raf = requestAnimationFrame(loop);
  };

  resize();
  window.addEventListener('resize', resize);
  raf = requestAnimationFrame(loop);

  return () => {
    cancelAnimationFrame(raf);
    window.removeEventListener('resize', resize);
  };
};
