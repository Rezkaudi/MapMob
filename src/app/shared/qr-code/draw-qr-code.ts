import { QrCodeMatrix } from './qr-code-matrix';

/** The blank border scanners need around a QR code, in modules. */
export const QUIET_ZONE_MODULES = 4;
const LIGHT_COLOR = '#ffffff';
const DARK_COLOR = '#000000';

export type QrCodePaintSurface = Pick<CanvasRenderingContext2D, 'fillStyle' | 'fillRect'>;

export function measureQrCodeImage(matrix: QrCodeMatrix, moduleSizePx: number): number {
  return (matrix.length + QUIET_ZONE_MODULES * 2) * moduleSizePx;
}

export function drawQrCode(
  surface: QrCodePaintSurface,
  matrix: QrCodeMatrix,
  moduleSizePx: number,
): void {
  const imageSize = measureQrCodeImage(matrix, moduleSizePx);
  const offset = QUIET_ZONE_MODULES * moduleSizePx;
  surface.fillStyle = LIGHT_COLOR;
  surface.fillRect(0, 0, imageSize, imageSize);
  surface.fillStyle = DARK_COLOR;
  matrix.forEach((row, rowIndex) =>
    row.forEach((isDark, columnIndex) => {
      if (isDark) {
        const x = offset + columnIndex * moduleSizePx;
        const y = offset + rowIndex * moduleSizePx;
        surface.fillRect(x, y, moduleSizePx, moduleSizePx);
      }
    }),
  );
}
