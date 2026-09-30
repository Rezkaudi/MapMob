import { formatDisplayUrl } from '../formatting/display-url';
import { encodeQrCode } from './encode-qr-code';
import { toQrCodeFileName } from './qr-code-file-name';
import { QrCodeMatrix } from './qr-code-matrix';
import { toQrCodePath } from './qr-code-path';

/** Everything the QR card and the QR dialog draw for one store. */
export interface StoreQrCode {
  readonly url: string;
  readonly storeName: string;
  readonly matrix: QrCodeMatrix;
  readonly moduleCount: number;
  readonly path: string;
  readonly displayUrl: string;
  readonly fileName: string;
  readonly label: string;
}

export function describeStoreQrCode(url: string, storeName: string): StoreQrCode {
  const matrix = encodeQrCode(url);
  return {
    url,
    storeName,
    matrix,
    moduleCount: matrix.length,
    path: toQrCodePath(matrix),
    displayUrl: formatDisplayUrl(url),
    fileName: toQrCodeFileName(url),
    label: `رمز QR لصفحة ${storeName}`,
  };
}
