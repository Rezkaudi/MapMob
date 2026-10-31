import { arabicTextOf } from './arabic-text-of';

describe('arabicTextOf', () => {
  it('prefers the Arabic words', () => {
    expect(arabicTextOf({ ar: 'مرحبا', en: 'hello' })).toBe('مرحبا');
  });

  it('falls back to the English words', () => {
    expect(arabicTextOf({ en: 'hello' })).toBe('hello');
  });

  it('is null for an empty list, an empty text or nothing', () => {
    expect(arabicTextOf([])).toBeNull();
    expect(arabicTextOf({ ar: '' })).toBeNull();
    expect(arabicTextOf(null)).toBeNull();
  });
});
