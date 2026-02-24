export const PALETTE = {
  bg: '#050809',
  text: '#c4c9c7',
  dim: '#6e7473',
  cyan: '#4aa2a3',
  magenta: '#b05ca5',
  green: '#78b06f',
  black: '#000000',
} as const;

export type PaletteKey = keyof typeof PALETTE;

export const paletteColor = (key: PaletteKey): string => PALETTE[key];
