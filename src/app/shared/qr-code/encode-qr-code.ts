import qrcode from 'qrcode-generator';
import { QrCodeMatrix } from './qr-code-matrix';

/** 0 lets the encoder pick the smallest version that fits the text. */
const SMALLEST_FITTING_VERSION = 0;
/** "M" still scans with about 15% of the code smudged or covered. */
const ERROR_CORRECTION = 'M';

export function encodeQrCode(text: string): QrCodeMatrix {
  const code = qrcode(SMALLEST_FITTING_VERSION, ERROR_CORRECTION);
  code.addData(text);
  code.make();
  const size = code.getModuleCount();
  return Array.from({ length: size }, (_, row) =>
    Array.from({ length: size }, (_, column) => code.isDark(row, column)),
  );
}
