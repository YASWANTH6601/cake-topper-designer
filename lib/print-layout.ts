export const MILLIMETERS_PER_INCH = 25.4;
export const DESIGN_DPI = 300;
export const A4_WIDTH_MM = 210;
export const A4_HEIGHT_MM = 297;

export type PrintOrientation = "portrait" | "landscape";

export type A4PrintLayout = {
  orientation: PrintOrientation;
  pageWidthMm: number;
  pageHeightMm: number;
  pageWidthInches: number;
  pageHeightInches: number;
  pageWidthPixels: number;
  pageHeightPixels: number;
  topperWidthInches: number;
  topperHeightInches: number;
  topperWidthPixels: number;
  topperHeightPixels: number;
  offsetXInches: number;
  offsetYInches: number;
};

const inchesFromMm = (millimeters: number) => millimeters / MILLIMETERS_PER_INCH;
const pixelsFromMm = (millimeters: number) => Math.round(inchesFromMm(millimeters) * DESIGN_DPI);
const fits = (width: number, height: number, pageWidth: number, pageHeight: number) => width <= pageWidth + Number.EPSILON && height <= pageHeight + Number.EPSILON;

export function getA4PrintLayout(topperWidthInches: number, topperHeightInches: number): A4PrintLayout | null {
  if (!Number.isFinite(topperWidthInches) || !Number.isFinite(topperHeightInches) || topperWidthInches <= 0 || topperHeightInches <= 0) return null;

  const portraitWidth = inchesFromMm(A4_WIDTH_MM);
  const portraitHeight = inchesFromMm(A4_HEIGHT_MM);
  const fitsPortrait = fits(topperWidthInches, topperHeightInches, portraitWidth, portraitHeight);
  const fitsLandscape = fits(topperWidthInches, topperHeightInches, portraitHeight, portraitWidth);
  if (!fitsPortrait && !fitsLandscape) return null;

  // Portrait is the stable default for round/square designs that fit either
  // orientation. Rectangles naturally select the only orientation they fit.
  const orientation: PrintOrientation = fitsPortrait ? "portrait" : "landscape";
  const pageWidthMm = orientation === "portrait" ? A4_WIDTH_MM : A4_HEIGHT_MM;
  const pageHeightMm = orientation === "portrait" ? A4_HEIGHT_MM : A4_WIDTH_MM;
  const pageWidthInches = inchesFromMm(pageWidthMm);
  const pageHeightInches = inchesFromMm(pageHeightMm);

  return {
    orientation,
    pageWidthMm,
    pageHeightMm,
    pageWidthInches,
    pageHeightInches,
    pageWidthPixels: pixelsFromMm(pageWidthMm),
    pageHeightPixels: pixelsFromMm(pageHeightMm),
    topperWidthInches,
    topperHeightInches,
    topperWidthPixels: Math.round(topperWidthInches * DESIGN_DPI),
    topperHeightPixels: Math.round(topperHeightInches * DESIGN_DPI),
    offsetXInches: (pageWidthInches - topperWidthInches) / 2,
    offsetYInches: (pageHeightInches - topperHeightInches) / 2,
  };
}
