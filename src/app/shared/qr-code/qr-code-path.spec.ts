import { toQrCodePath } from './qr-code-path';

describe('toQrCodePath', () => {
  it('draws one box per run of dark cells, one row at a time', () => {
    const path = toQrCodePath([
      [true, true, false],
      [false, false, true],
      [true, false, true],
    ]);

    expect(path).toBe('M0 0h2v1h-2zM2 1h1v1h-1zM0 2h1v1h-1zM2 2h1v1h-1z');
  });

  it('draws nothing for an all-light grid', () => {
    expect(
      toQrCodePath([
        [false, false],
        [false, false],
      ]),
    ).toBe('');
  });
});
