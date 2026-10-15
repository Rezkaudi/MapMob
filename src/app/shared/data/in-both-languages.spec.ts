import { inBothLanguages } from './in-both-languages';

describe('inBothLanguages', () => {
  it('puts the same text under ar and en', () => {
    expect(inBothLanguages('تواصل معنا')).toEqual({ ar: 'تواصل معنا', en: 'تواصل معنا' });
  });
});
