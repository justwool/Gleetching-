export type CatalogRow = {
  name: string;
  contents: string;
  date: string;
  code: string;
  filesCount: number;
  tag: string;
};

export const CATALOG_ROWS: CatalogRow[] = [
  { name: 'Fractal Signal Events Series 17', contents: 'Anomalous visual artifacts / 94 files', date: '04/19/2023', code: 'ACTAAS', filesCount: 94, tag: 'FRACTAL' },
  { name: 'Chromatic Distortions Series 03', contents: 'Undocumented light patterns / 75 files', date: '02/27/2021', code: 'ACD023', filesCount: 75, tag: 'CHROMA' },
  { name: 'Grid Warp Phenomena Series 11', contents: 'Experimental grid recordings / 43 files', date: '09/03/2018', code: 'ACD0RS', filesCount: 43, tag: 'GRID' },
  { name: 'Particle Transition Series 04', contents: 'Particle alteration records / 38 files', date: '07/15/2022', code: 'ACE02S', filesCount: 38, tag: 'PARTICLE' },
  { name: 'Fluid Signatures Series 22', contents: 'Unidentified liquid signatures / 47 files', date: '11/08/2023', code: 'ACTA23', filesCount: 47, tag: 'FLUID' },
  { name: 'Dimensional Ruptures Series F48', contents: 'Space-time disturbances / 62 files', date: '10/05/2021', code: 'ACE023', filesCount: 62, tag: 'RUPTURE' },
  { name: 'Morphogenic Anomalies Series 07', contents: 'Shifting form signatures / 77 files', date: '04/12/2024', code: 'ACTQ2S', filesCount: 77, tag: 'MORPH' },
  { name: 'Signal Anomalies (Archived)', contents: 'Historical visual irregularities / 87 files', date: '05/09/2008', code: 'A6D023', filesCount: 87, tag: 'ARCHIVE' },
];

export const getRisk = (filesCount: number): string => {
  if (filesCount >= 85) return 'HIGH';
  if (filesCount >= 60) return 'ELEVATED';
  return 'MODERATE';
};
