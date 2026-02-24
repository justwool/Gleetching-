import { Framebuffer, padRight } from './framebuffer';
import type { PaletteKey } from './palette';

const rows = [
  ['Fractal Signal Events Series 17', 'Anomalous visual artifacts / 94 files', 'Modified 04/19/2023', 'ACTAAS'],
  ['Chromatic Distortions Series 03', 'Undocumented light patterns / 75 files', 'Modified 02/27/2021', 'ACD023'],
  ['Grid Warp Phenomena Series 11', 'Experimental grid recordings / 43 files', 'Modified 09/03/2018', 'ACD0RS'],
  ['Particle Transition Series 04', 'Particle alteration records / 38 files', 'Modified 07/15/2022', 'ACE02S'],
  ['Fluid Signatures Series 22', 'Unidentified liquid signatures / 47 files', 'Modified 11/08/2023', 'ACTA23'],
  ['Dimensional Ruptures Series F48', 'Space–time disturbances / 62 files', 'Modified 10/05/2021', 'ACE023'],
  ['Morphogenic Anomalies Series 07', 'Shifting form signatures / 77 files', 'Modified 04/12/2024', 'ACTQ2S'],
  ['Signal Anomalies (Archived)', 'Historical visual irregularities / 87 files', 'Modified 05/09/2008', 'A6D023'],
] as const;

const paintLine = (fb: Framebuffer, y: number, text: string, fg: PaletteKey = 'text') => fb.write(2, y, text, fg);

export const buildLayout = (fb: Framebuffer, showSpectrum: boolean, spectrum: number[]) => {
  fb.clear('bg', 'text');
  const contentW = fb.cols - 4;

  paintLine(fb, 1, 'INTERNAL SYSTEM - SENSITIVE INFORMATION', 'cyan');
  paintLine(fb, 2, 'RESTRICTED ACCESS | PRIVILEGED USERS ONLY', 'magenta');
  fb.hline(1, 3, fb.cols - 2, '=', 'cyan');

  paintLine(fb, 5, 'Catalog > Unexplained Phenomena', 'text');
  paintLine(fb, 6, 'Catalog: Unexplained Phenomena  /visible/images  523 Records', 'cyan');
  paintLine(fb, 7, 'Privacy note: Access logged and monitored.', 'dim');
  paintLine(fb, 8, 'VISUAL SIGNATURE CATALOG / DESCRIPTION', 'cyan');
  paintLine(fb, 9, 'Internal reference only. Contact records@research-gov for record requests.', 'dim');
  paintLine(fb, 10, 'Last Updated 04/19/2023 by jhansen', 'text');

  const tableX = 2;
  const tableY = 12;
  const widths = [34, 44, 22, 10];
  const tableW = widths.reduce((acc, w) => acc + w, 0) + 5;

  fb.hline(tableX, tableY, tableW, '=', 'cyan');
  fb.write(tableX, tableY + 1, `|${padRight('Collection Name', widths[0])}|${padRight('Contents', widths[1])}|${padRight('Last Modified', widths[2])}|${padRight('Code', widths[3])}|`, 'cyan');
  fb.hline(tableX, tableY + 2, tableW, '-', 'dim');

  rows.forEach((row, index) => {
    const y = tableY + 3 + index;
    const [a, b, c, d] = row;
    fb.write(
      tableX,
      y,
      `|${padRight(a, widths[0])}|${padRight(b, widths[1])}|${padRight(c, widths[2])}|${padRight(d, widths[3])}|`,
      'text',
    );
  });

  fb.hline(tableX, tableY + 3 + rows.length, tableW, '=', 'cyan');

  const statusY = 42;
  fb.hline(1, statusY - 1, fb.cols - 2, '-', 'dim');
  paintLine(fb, statusY, 'REFm on Use | Signal Access Policy | System Summaries | Version 0.4', 'green');
  const rightText = 'Remote: Submitting a ticket';
  fb.write(fb.cols - rightText.length - 2, statusY, rightText, 'green');
  paintLine(fb, statusY + 1, 'Page 1 of 2', 'dim');

  if (showSpectrum) {
    const y = fb.rows - 1;
    for (let x = 2; x < fb.cols - 2; x += 1) {
      const level = spectrum[x % spectrum.length];
      const ch = level > 0.8 ? '#' : level > 0.55 ? '=' : level > 0.35 ? '-' : '.';
      const color: PaletteKey = level > 0.7 ? 'green' : 'dim';
      fb.put(x, y, ch, color);
    }
  }

  fb.vline(1, 1, fb.rows - 2, '|', 'dim');
  fb.vline(fb.cols - 2, 1, fb.rows - 2, '|', 'dim');
  fb.hline(1, fb.rows - 2, fb.cols - 2, '.', 'dim');
  fb.hline(1, 0, fb.cols - 2, '.', 'dim');
  fb.put(1, 0, '.', 'cyan');
  fb.put(fb.cols - 2, 0, '.', 'cyan');
  fb.put(1, fb.rows - 2, '.', 'cyan');
  fb.put(fb.cols - 2, fb.rows - 2, '.', 'cyan');

  if (contentW < 70) {
    paintLine(fb, 4, 'Resize viewport for full catalog view.', 'magenta');
  }
};
