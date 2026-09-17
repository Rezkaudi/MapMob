import { normalizeLinkUrl } from './link-url';

describe('normalizeLinkUrl', () => {
  it('keeps web, mail and phone links as typed', () => {
    expect(normalizeLinkUrl(' https://mapmob.app ')).toBe('https://mapmob.app');
    expect(normalizeLinkUrl('mailto:contact@mapmob.app')).toBe('mailto:contact@mapmob.app');
    expect(normalizeLinkUrl('tel:+963933123456')).toBe('tel:+963933123456');
  });

  it('adds https to a bare address and mailto to a bare email', () => {
    expect(normalizeLinkUrl('mapmob.app/help')).toBe('https://mapmob.app/help');
    expect(normalizeLinkUrl('contact@mapmob.app')).toBe('mailto:contact@mapmob.app');
  });

  it('refuses empty input and unsafe schemes', () => {
    expect(normalizeLinkUrl('   ')).toBeNull();
    expect(normalizeLinkUrl(null)).toBeNull();
    expect(normalizeLinkUrl('javascript:alert(1)')).toBeNull();
  });
});
