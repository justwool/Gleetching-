import { ANSI, color, inverse, selected } from './ansi';
import { CATALOG_ROWS, getRisk } from './data';
import { bar, box, histogram, lineWithRight, padLeft, padRight, tableRow } from './layout';

const tableWidths = [36, 46, 10, 6];
const tableTotal = tableWidths.reduce((a, b) => a + b, 0) + 5;

const statusSection = (): string[] => {
  const top = `${ANSI.fgCyan}${ANSI.bold}SYS v0.4${ANSI.reset}  session: PRIV  view: CATALOG  node: INTERNAL-01  time: 01:11`;
  const bars = [
    `integrity     ${color(ANSI.fgGreen, bar(92, 100, 20))}`,
    `classification ${color(ANSI.fgMagenta, bar(88, 100, 20))}`,
    `anomaly       ${color(ANSI.fgCyan, bar(61, 100, 20))}`,
    `visibility    ${color(ANSI.fgWhite, bar(74, 100, 20))}`,
  ];
  return box([top, ...bars], 120);
};

const catalogSection = (selectedIndex: number): string[] => {
  const selectedRow = CATALOG_ROWS[selectedIndex];
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
    lineWithRight(color(ANSI.fgCyan, `+${'-'.repeat(tableTotal - 2)}+`), color(ANSI.fgGreen, '[ FOCUS ]'), 116),
    color(ANSI.fgCyan, tableRow(['Collection Name', 'Contents', 'Modified', 'Code'], tableWidths)),
    `+${'-'.repeat(tableTotal - 2)}+`,
  ];

  CATALOG_ROWS.forEach((row, idx) => {
    const base = tableRow([row.name, row.contents, row.date, row.code], tableWidths);
    const padded = padRight(base, tableTotal);
    lines.push(idx === selectedIndex ? selected(padded) : padded);
  });

  lines.push(color(ANSI.fgCyan, `+${'-'.repeat(tableTotal - 2)}+`));
  lines.push(lineWithRight('', color(ANSI.fgGreen, focusA), 116));
  lines.push(lineWithRight('', color(ANSI.fgMagenta, focusB), 116));

  return box(lines, 120);
};

const distributionSection = (): string[] => {
  const hist = histogram(CATALOG_ROWS.map((r) => r.filesCount), 40);
  return [color(ANSI.fgCyan, `distribution: |${hist}|`)];
};

const gridSection = (selectedIndex: number): string[] => {
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
  return box(lines, 120);
};

export const buildScreen = (selectedIndex: number): string => {
  const all = [
    ...statusSection(),
    ...catalogSection(selectedIndex),
    ...distributionSection(),
    ...gridSection(selectedIndex),
    lineWithRight(
      color(ANSI.fgGreen, 'REFm on Use | Signal Access Policy | System Summaries | Version 0.4'),
      color(ANSI.fgGreen, 'Remote: Submitting a ticket'),
      120,
    ),
    color(ANSI.dim, 'Page 1 of 2'),
  ];

  return `${ANSI.fgWhite}${all.join('\r\n')}${ANSI.reset}`;
};
