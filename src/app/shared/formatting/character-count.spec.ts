import { formatCharacterCount } from './character-count';

describe('formatCharacterCount', () => {
  it('writes the limit then the count, as the designs draw "60/0"', () => {
    expect(formatCharacterCount('', 60)).toBe('60/0');
    expect(formatCharacterCount('عروض', 60)).toBe('60/4');
  });
});
