import { getNameInitials } from './name-initials';

describe('getNameInitials', () => {
  it('takes the first letter of the first two words, spaced as the design writes them', () => {
    expect(getNameInitials('أحمد  جمال')).toBe('أ ج');
    expect(getNameInitials('منى عبد الله')).toBe('م ع');
  });

  it('uses one letter for a one-word name and nothing for a blank one', () => {
    expect(getNameInitials('خالد')).toBe('خ');
    expect(getNameInitials('   ')).toBe('');
  });
});
