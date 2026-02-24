import { ANSI, color, inverse, selected } from './ansi';
import { CATALOG_ROWS, getRisk } from './data';
import { bar, box, clampNum, histogram, lineWithRight, padLeft, padRight, safeInnerWidth, tableRow, truncate } from './layout';

const statusSection = (cols: number): string[] => {
  const metrics =
    cols >= 90
      ? 'session: PRIV  view: CATALOG  node: INTERNAL-01  time: 01:11'
      : cols >= 72
        ? 'session: PRIV  view: CATALOG  time: 01:11'
        : 'session: PRIV  time: 01:11';

  const top = `${ANSI.fgCyan}${ANSI.bold}SYS v0.4${ANSI.reset}  ${metrics}`;
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
  if (cols >= 105) {
    const inner = safeInnerWidth(cols, 2);
    const code = 6;
    const date = 10;
    const name = clampNum(Math.floor(inner * 0.34), 30, 44);
    const contents = Math.max(20, inner - (name + date + code + 3));
    return [name, contents, date, code];
  }

  const inner = safeInnerWidth(cols, 2);
  const code = 6;
  const date = 10;
  const name = clampNum(Math.floor(inner * 0.36), 28, 34);
  const contents = clampNum(inner - (name + date + code + 3), 22, 44);
  return [name, contents, date, code];
};

const catalogSectionWide = (selectedIndex: number, cols: number): string[] => {
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
    lineWithRight(color(ANSI.fgCyan, `+${'-'.repeat(Math.max(1, tableTotal - 2))}+`), color(ANSI.fgGreen, '[ FOCUS ]'), safeInnerWidth(cols, 2)),
    color(ANSI.fgCyan, tableRow(['Collection Name', 'Contents', 'Modified', 'Code'], widths)),
    `+${'-'.repeat(Math.max(1, tableTotal - 2))}+`,
  ];

  CATALOG_ROWS.forEach((row, idx) => {
    const base = tableRow([row.name, row.contents, row.date, row.code], widths);
    const padded = padRight(base, tableTotal);
    lines.push(idx === selectedIndex ? selected(padded) : padded);
  });

  lines.push(color(ANSI.fgCyan, `+${'-'.repeat(Math.max(1, tableTotal - 2))}+`));
  lines.push(lineWithRight('', color(ANSI.fgGreen, truncate(focusA, safeInnerWidth(cols, 2))), safeInnerWidth(cols, 2)));
  lines.push(lineWithRight('', color(ANSI.fgMagenta, truncate(focusB, safeInnerWidth(cols, 2))), safeInnerWidth(cols, 2)));

  return box(lines, cols);
};

const catalogSectionNarrow = (selectedIndex: number, cols: number): string[] => {
  const selectedRow = CATALOG_ROWS[selectedIndex];
  const focusA = `focus: ${selectedRow.code}  files:${selectedRow.filesCount}  modified:${selectedRow.date}`;
  const focusB = `tag: ${selectedRow.tag}  risk: ${getRisk(selectedRow.filesCount)}`;

  const lines: string[] = [
    color(ANSI.fgCyan, 'INTERNAL SYSTEM - SENSITIVE INFORMATION'),
    color(ANSI.fgMagenta, 'RESTRICTED ACCESS | PRIVILEGED USERS ONLY'),
    'Catalog > Unexplained Phenomena',
    color(ANSI.fgCyan, 'Catalog: Unexplained Phenomena  /visible/images  523 Records'),
    'Privacy note: Internal trace logging active.',
    color(ANSI.fgCyan, 'STACKED RECORDS'),
  ];

  CATALOG_ROWS.forEach((row, idx) => {
    const l1 = `> ${truncate(row.name, safeInnerWidth(cols, 6))}`;
    const l2 = `  ${truncate(row.contents, safeInnerWidth(cols, 6))}`;
    const l3 = `  modified:${row.date}  code:${row.code}  files:${row.filesCount}`;
    if (idx === selectedIndex) {
      lines.push(selected(l1), selected(l2), selected(truncate(l3, safeInnerWidth(cols, 2))));
    } else {
      lines.push(l1, l2, truncate(l3, safeInnerWidth(cols, 2)));
    }
  });

  lines.push(color(ANSI.fgGreen, truncate(focusA, safeInnerWidth(cols, 2))));
  lines.push(color(ANSI.fgMagenta, truncate(focusB, safeInnerWidth(cols, 2))));
  return box(lines, cols);
};

const distributionSection = (cols: number): string[] => {
  const histW = clampNum(cols - 20, 20, 48);
  const hist = histogram(CATALOG_ROWS.map((r) => r.filesCount), histW);
  return [color(ANSI.fgCyan, `distribution: |${hist}|`)];
};

const gridSection = (selectedIndex: number, cols: number): string[] => {
  const lines = [color(ANSI.fgCyan, 'GRID VIEW')];

  if (cols >= 95) {
    lines.push(
      color(ANSI.fgCyan, '+-----+--------+-------+------------+----------+'),
      color(ANSI.fgCyan, '| IDX | CODE   | FILES | DATE       | SIG      |'),
      color(ANSI.fgCyan, '+-----+--------+-------+------------+----------+'),
    );

    CATALOG_ROWS.forEach((row, idx) => {
      const cursor = idx === selectedIndex ? color(ANSI.fgMagenta, '>') : ' ';
      const sig = `${row.tag.slice(0, 3)}-${row.code.slice(0, 2)}`;
      const raw = `${cursor} ${padLeft(String(idx + 1), 2)} | ${padRight(row.code, 6)} | ${padLeft(String(row.filesCount), 5)} | ${padRight(row.date, 10)} | ${padRight(sig, 8)} `;
      lines.push(idx === selectedIndex ? inverse(raw) : raw);
    });
    lines.push(color(ANSI.fgCyan, '+-----+--------+-------+------------+----------+'));
  } else if (cols >= 80) {
    lines.push(
      color(ANSI.fgCyan, '+-----+--------+-------+------------+'),
      color(ANSI.fgCyan, '| IDX | CODE   | FILES | DATE       |'),
      color(ANSI.fgCyan, '+-----+--------+-------+------------+'),
    );

    CATALOG_ROWS.forEach((row, idx) => {
      const cursor = idx === selectedIndex ? color(ANSI.fgMagenta, '>') : ' ';
      const raw = `${cursor} ${padLeft(String(idx + 1), 2)} | ${padRight(row.code, 6)} | ${padLeft(String(row.filesCount), 5)} | ${padRight(row.date, 10)} `;
      lines.push(idx === selectedIndex ? inverse(raw) : raw);
    });
    lines.push(color(ANSI.fgCyan, '+-----+--------+-------+------------+'));
  } else {
    CATALOG_ROWS.forEach((row, idx) => {
      const cursor = idx === selectedIndex ? color(ANSI.fgMagenta, '>') : ' ';
      const raw = `${cursor} ${padLeft(String(idx + 1), 2)}  ${padRight(row.code, 6)}  ${padLeft(String(row.filesCount), 3)}  ${row.date}`;
      lines.push(idx === selectedIndex ? selected(truncate(raw, safeInnerWidth(cols, 2))) : truncate(raw, safeInnerWidth(cols, 2)));
    });
  }

  return box(lines, cols);
};

export const buildScreen = (selectedIndex: number, cols: number, rows: number): string => {
  const W = clampNum(cols, 48, 240);
  const catalog = W < 90 ? catalogSectionNarrow(selectedIndex, W) : catalogSectionWide(selectedIndex, W);

  const all = [
    ...statusSection(W),
    ...catalog,
    ...distributionSection(W),
    ...gridSection(selectedIndex, W),
    lineWithRight(
      color(ANSI.fgGreen, truncate('REFm on Use | Signal Access Policy | System Summaries | Version 0.4', safeInnerWidth(W, 2))),
      color(ANSI.fgGreen, truncate('Remote: Submitting a ticket', 30)),
      W,
    ),
    color(ANSI.dim, 'Page 1 of 2'),
  ];

  const clipped = all.slice(0, Math.max(8, rows));
  return `${ANSI.fgWhite}${clipped.join('\r\n')}${ANSI.reset}`;
};
