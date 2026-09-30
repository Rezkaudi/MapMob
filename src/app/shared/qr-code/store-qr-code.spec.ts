import { encodeQrCode } from './encode-qr-code';
import { toQrCodePath } from './qr-code-path';
import { describeStoreQrCode } from './store-qr-code';

const STORE_URL = 'https://mapmob.app/store/alhayat-pharmacy';

describe('describeStoreQrCode', () => {
  it('gathers everything a QR card or dialog draws for one store', () => {
    const matrix = encodeQrCode(STORE_URL);

    expect(describeStoreQrCode(STORE_URL, 'صيدلية الحياة')).toEqual({
      url: STORE_URL,
      storeName: 'صيدلية الحياة',
      matrix,
      moduleCount: matrix.length,
      path: toQrCodePath(matrix),
      displayUrl: 'mapmob.app/store/alhayat-pharmacy',
      fileName: 'alhayat-pharmacy-qr.png',
      label: 'رمز QR لصفحة صيدلية الحياة',
    });
  });
});
