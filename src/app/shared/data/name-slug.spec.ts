import { toNameSlug } from './name-slug';

describe('toNameSlug', () => {
  it('joins the words of an Arabic name with dashes', () => {
    expect(toNameSlug('  محافظة   طرطوس ')).toBe('محافظة-طرطوس');
  });

  it('lowers Latin letters and drops signs a link cannot hold', () => {
    expect(toNameSlug('Tartus City, (Old)!')).toBe('tartus-city-old');
  });
});
