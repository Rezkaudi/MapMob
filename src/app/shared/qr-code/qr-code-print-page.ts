import { QrCodeMatrix } from './qr-code-matrix';

/** What the printed QR sheet shows, top to bottom. */
export interface QrCodePrintPage {
  readonly storeName: string;
  readonly caption: string;
  readonly matrix: QrCodeMatrix;
  readonly displayUrl: string;
}
