import { ANSI, color, inverse, selected } from './ansi';
import { CATALOG_ROWS, getRisk } from './data';
import {
  bar,
  box,
  clampNum,
  histogram,
  lineWithRight,
  padLeft,
  padRight,
  padToCols,
  safeInnerWidth,
  sep,
  tableRow,
  truncate,
} from './layout';

const wrapText = (text: string, width: number, maxLines: number): string[] => {
  const w = Math.max(8, width);
  const words = text.split(' ');
  const lines: string[] = [];
  let current = '';

  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (candidate.length <= w) {
      current = candidate;
    } else {
      if (current) lines.push(current);
      current = word;
      if (lines.length >= maxLines) break;
    }
  }
  if (current && lines.length < maxLines) lines.push(current);
  return lines.map((line, i) => (i === maxLines - 1 ? truncate(line, w) : line));
};

const statusSectionDesktop = (cols: number): string[] => {
  const top = `${ANSI.fgCyan}${ANSI.bold}SYS v0.4${ANSI.reset}  session: PRIV  view: CATALOG  node: INTERNAL-01  time: 01:11`;
  const barW = clampNum(Math.floor((safeInnerWidth(cols, 14)) * 0.35), 8, 20);
  const bars = [
    `integrity      ${color(ANSI.fgGreen, bar(92, 100, barW))}`,
    `classification ${color(ANSI.fgMagenta, bar(88, 100, barW))}`,
    `anomaly        ${color(ANSI.fgCyan, bar(61, 100, barW))}`,
    `visibility     ${color(ANSI.fgWhite, bar(74, 100, barW))}`,
  ];
  return box([top, ...bars], cols);
};

const tableWidthsFor = (cols: number): [number, number, number, number] => {
  const inner = safeInnerWidth(cols, 2);
  const code = 6;
  const date = 10;
  if (cols >= 105) {
    const name = clampNum(Math.floor(inner * 0.34), 30, 44);
    const contents = Math.max(20, inner - (name + date + code + 3));
    return [name, contents, date, code];
  }
  const name = clampNum(Math.floor(inner * 0.36), 28, 34);
  const contents = clampNum(inner - (name + date + code + 3), 22, 44);
  return [name, contents, date, code];
};

const catalogSectionDesktop = (selectedIndex: number, cols: number): string[] => {
  const selectedRow = CATALOG_ROWS[selectedIndex];
  const widths = tableWidthsFor(cols);
  const tableTotal = widths.reduce((a, b) => a + b, 0) + 5;
  const focusA = `focus: ${selectedRow.code}  files:${selectedRow.filesCount}  modified:${selectedRow.date}`;
  const focusB = `tag: ${selectedRow.tag}  risk: ${getRisk(selectedRow.filesCount)}`;

  const lines: string[] = [
    color(ANSI.fgCyan, 'INTERNAL SYSTEM - SENSITIVE INFORMATION'),
    color(ANSI.fgMagenta, 'RESTRICTED ACCESS | PRIVILEGED USERS ONLY'),
    '',
    'Catalog > Unexplained Phenomena',
    color(ANSI.fgCyan, 'Catalog: Unexplained Phenomena  /visible/images  523 Records'),
    'Privacy note: Internal trace logging active.',
    color(ANSI.fgCyan, 'VISUAL SIGNATURE CATALOG / DESCRIPTION'),
    'Internal reference only. Contact records@research-gov for record requests.',
    'Last Updated 04/19/2023 by jhansen',
    '',
    lineWithRight(color(ANSI.fgCyan, `+${sep(Math.max(1, tableTotal - 2))}+`), color(ANSI.fgGreen, '[ FOCUS ]'), safeInnerWidth(cols, 2)),
    color(ANSI.fgCyan, tableRow(['Collection Name', 'Contents', 'Modified', 'Code'], widths)),
    `+${sep(Math.max(1, tableTotal - 2))}+`,
  ];

  CATALOG_ROWS.forEach((row, idx) => {
    const base = tableRow([row.name, row.contents, row.date, row.code], widths);
    const padded = padRight(base, tableTotal);
    lines.push(idx === selectedIndex ? selected(padded) : padded);
  });

  lines.push(color(ANSI.fgCyan, `+${sep(Math.max(1, tableTotal - 2))}+`));
  lines.push(lineWithRight('', color(ANSI.fgGreen, truncate(focusA, safeInnerWidth(cols, 2))), safeInnerWidth(cols, 2)));
  lines.push(lineWithRight('', color(ANSI.fgMagenta, truncate(focusB, safeInnerWidth(cols, 2))), safeInnerWidth(cols, 2)));
  return box(lines, cols);
};

const gridSectionDesktop = (selectedIndex: number, cols: number): string[] => {
  const lines = [
    color(ANSI.fgCyan, 'GRID VIEW'),
    color(ANSI.fgCyan, '+-----+--------+-------+------------+----------+'),
    color(ANSI.fgCyan, '| IDX | CODE   | FILES | DATE       | SIG      |'),
    color(ANSI.fgCyan, '+-----+--------+-------+------------+----------+'),
  ];

  CATALOG_ROWS.forEach((row, idx) => {
    const cursor = idx === selectedIndex ? color(ANSI.fgMagenta, '>') : ' ';
    const sig = `${row.tag.slice(0, 3)}-${row.code.slice(0, 2)}`;
    const raw = `${cursor} ${padLeft(String(idx + 1), 2)} | ${padRight(row.code, 6)} | ${padLeft(String(row.filesCount), 5)} | ${padRight(row.date, 10)} | ${padRight(sig, 8)} `;
    lines.push(idx === selectedIndex ? inverse(raw) : raw);
  });

  lines.push(color(ANSI.fgCyan, '+-----+--------+-------+------------+----------+'));
  return box(lines, cols);
};

const mobileLayout = (selectedIndex: number, cols: number): string[] => {
  const selectedRow = CATALOG_ROWS[selectedIndex];
  const focusLine = `code:${selectedRow.code}  files:${selectedRow.filesCount}  date:${selectedRow.date}`;
  const contentLines = wrapText(selectedRow.contents, cols, 2);

  const lines: string[] = [
    color(ANSI.fgCyan, 'INTERNAL SYSTEM - SENSITIVE INFORMATION'),
    color(ANSI.fgMagenta, 'RESTRICTED ACCESS | PRIVILEGED USERS ONLY'),
    color(ANSI.dim, `Catalog > Unexplained Phenomena ${cols}c`),
    color(ANSI.dim, sep(cols, '-')),
  ];

  CATALOG_ROWS.forEach((row, idx) => {
    if (idx === selectedIndex) {
      lines.push(`${color(ANSI.fgMagenta, '> ')}${color(ANSI.fgCyan, truncate(row.name, Math.max(1, cols - 2)))}`);
    } else {
      lines.push(`${color(ANSI.dim, '  ')}${color(ANSI.fgWhite, truncate(row.name, Math.max(1, cols - 2)))}`);
    }
  });

  lines.push(
    color(ANSI.dim, sep(cols, '-')),
    color(ANSI.fgGreen, 'FOCUS'),
    color(ANSI.fgWhite, truncate(focusLine, cols)),
    color(ANSI.fgWhite, truncate(contentLines[0] ?? '', cols)),
  );

  if (contentLines[1]) lines.push(color(ANSI.fgWhite, truncate(contentLines[1], cols)));

  lines.push(
    color(ANSI.dim, `risk:${getRisk(selectedRow.filesCount)}  tag:${selectedRow.tag}`),
    color(ANSI.fgGreen, 'Use ↑/↓'),
  );

  return lines;
};

const desktopLayout = (selectedIndex: number, cols: number): string[] => {
  const histW = clampNum(cols - 20, 20, 48);
  const hist = histogram(CATALOG_ROWS.map((r) => r.filesCount), histW);

  return [
    ...statusSectionDesktop(cols),
    ...catalogSectionDesktop(selectedIndex, cols),
    color(ANSI.fgCyan, `distribution: |${hist}|`),
    ...gridSectionDesktop(selectedIndex, cols),
    lineWithRight(
      color(ANSI.fgGreen, truncate('REFm on Use | Signal Access Policy | System Summaries | Version 0.4', safeInnerWidth(cols, 2))),
      color(ANSI.fgGreen, truncate('Remote: Submitting a ticket', 30)),
      cols,
    ),
    color(ANSI.dim, 'Page 1 of 2'),
  ];
};

export const buildScreen = (selectedIndex: number, cols: number, rows: number): string => {
  const W = clampNum(cols, 32, 240);
  const isMobile = W < 95;

  const rawLines = isMobile ? mobileLayout(selectedIndex, W) : desktopLayout(selectedIndex, W);
  const normalized = rawLines.map((line) => padToCols(line, W));
  const clipped = normalized.slice(0, Math.max(6, rows));
  return `${ANSI.fgWhite}${clipped.join('\r\n')}${ANSI.reset}`;
};
