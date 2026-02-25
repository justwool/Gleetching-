export const ANSI = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',
  inverse: '\x1b[7m',
  fgWhite: '\x1b[37m',
  fgCyan: '\x1b[36m',
  fgGreen: '\x1b[32m',
  fgMagenta: '\x1b[35m',
  fgBlack: '\x1b[30m',
  bgCyan: '\x1b[46m',
};

export const color = (code: string, text: string) => `${code}${text}${ANSI.reset}`;

export const inverse = (text: string) => `${ANSI.inverse}${text}${ANSI.reset}`;

export const selected = (text: string) => `${ANSI.bgCyan}${ANSI.fgBlack}${text}${ANSI.reset}`;
