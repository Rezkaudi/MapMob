import { encodeQrCode } from './encode-qr-code';

const STORE_URL = 'https://mapmob.app/store/alhayat-pharmacy';

describe('encodeQrCode', () => {
  it('makes a square grid with an odd side, as every QR version has', () => {
    const matrix = encodeQrCode(STORE_URL);

    expect(matrix.length % 2).toBe(1);
    expect(matrix.every((row) => row.length === matrix.length)).toBe(true);
  });

  it('draws the finder square in the top-left corner', () => {
    const matrix = encodeQrCode(STORE_URL);

    expect([matrix[0][0], matrix[0][6], matrix[6][0], matrix[6][6]]).toEqual([
      true,
      true,
      true,
      true,
    ]);
    expect(matrix[1][1]).toBe(false);
    expect(matrix[3][3]).toBe(true);
  });

  it('gives a different code to a different link', () => {
    const other = encodeQrCode('https://mapmob.app/store/another-store');

    expect(other).not.toEqual(encodeQrCode(STORE_URL));
  });
});
