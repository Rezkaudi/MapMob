import { toQrCodeFileName } from './qr-code-file-name';

describe('toQrCodeFileName', () => {
  it('names the picture after the last part of the store link', () => {
    expect(toQrCodeFileName('https://mapmob.app/store/alhayat-pharmacy/')).toBe(
      'alhayat-pharmacy-qr.png',
    );
  });

  it('reads an encoded Arabic part back as Arabic', () => {
    expect(toQrCodeFileName('https://mapmob.app/store/%D8%B5%D9%8A%D8%AF%D9%84%D9%8A%D8%A9')).toBe(
      'صيدلية-qr.png',
    );
  });

  it('falls back to a plain name when the link has no path', () => {
    expect(toQrCodeFileName('https://mapmob.app')).toBe('mapmob-store-qr.png');
  });

  it('keeps a part whose percent sign is not a real escape', () => {
    expect(toQrCodeFileName('https://mapmob.app/store/100%-fresh')).toBe('100%-fresh-qr.png');
  });

  it('falls back to a plain name when the link cannot be read', () => {
    expect(toQrCodeFileName('not a link')).toBe('mapmob-store-qr.png');
  });
});
