export const drawCrt = (
  src: HTMLCanvasElement,
  dstCtx: CanvasRenderingContext2D,
  frame: number,
  enabled: boolean,
) => {
  const { canvas } = dstCtx;
  const w = canvas.width;
  const h = canvas.height;

  dstCtx.imageSmoothingEnabled = false;
  dstCtx.fillStyle = '#000';
  dstCtx.fillRect(0, 0, w, h);

  const scale = Math.min(w / src.width, h / src.height);
  const dw = src.width * scale;
  const dh = src.height * scale;
  const dx = (w - dw) * 0.5;
  const dy = (h - dh) * 0.5;

  if (!enabled) {
    dstCtx.drawImage(src, dx, dy, dw, dh);
    return;
  }

  const sliceH = Math.max(1, Math.floor(dh / src.height));
  for (let y = 0; y < src.height; y += 1) {
    const norm = (y / src.height - 0.5) * 2;
    const warp = norm * norm * norm * 10;
    const sy = y;
    const ty = dy + y * sliceH;
    dstCtx.drawImage(src, 0, sy, src.width, 1, dx + warp, ty, dw, sliceH + 1);
  }

  dstCtx.globalAlpha = 0.08;
  dstCtx.fillStyle = '#000';
  for (let y = 0; y < h; y += 2) dstCtx.fillRect(0, y, w, 1);
  dstCtx.globalAlpha = 1;

  const grad = dstCtx.createRadialGradient(w / 2, h / 2, w * 0.25, w / 2, h / 2, w * 0.65);
  grad.addColorStop(0, 'rgba(0,0,0,0)');
  grad.addColorStop(1, 'rgba(0,0,0,0.35)');
  dstCtx.fillStyle = grad;
  dstCtx.fillRect(0, 0, w, h);

  dstCtx.globalAlpha = 0.06;
  dstCtx.fillStyle = '#ffffff';
  for (let i = 0; i < 120; i += 1) {
    const x = ((i * 97 + frame * 0.4) % w) | 0;
    const y = ((i * 57 + frame * 0.8) % h) | 0;
    dstCtx.fillRect(x, y, 1, 1);
  }
  dstCtx.globalAlpha = 1;

  dstCtx.globalCompositeOperation = 'lighter';
  dstCtx.globalAlpha = 0.07;
  dstCtx.drawImage(src, dx + 1, dy, dw, dh);
  dstCtx.fillStyle = 'rgba(0,140,255,0.15)';
  dstCtx.fillRect(dx + 1, dy, dw, dh);
  dstCtx.globalCompositeOperation = 'source-over';
  dstCtx.globalAlpha = 1;
};
