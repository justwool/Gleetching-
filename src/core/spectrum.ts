export const nextSpectrum = (bands: number[], t: number): number[] =>
  bands.map((_, i) => {
    const a = Math.sin(t * 0.003 + i * 0.37) * 0.5 + 0.5;
    const b = Math.sin(t * 0.0013 + i * 0.07) * 0.5 + 0.5;
    return Math.max(0.15, Math.min(1, a * 0.65 + b * 0.35));
  });

export const makeSpectrum = (size: number): number[] => Array.from({ length: size }, () => 0.2);
