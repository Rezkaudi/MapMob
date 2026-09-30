import { formatDisplayUrl } from './display-url';

describe('formatDisplayUrl', () => {
  it('drops the scheme and the last slash, as the store link field shows it', () => {
    expect(formatDisplayUrl('https://mapmob.app/store/alhayat-pharmacy/')).toBe(
      'mapmob.app/store/alhayat-pharmacy',
    );
  });

  it('keeps a link that has no scheme', () => {
    expect(formatDisplayUrl('mapmob.app/store/x')).toBe('mapmob.app/store/x');
  });
});
