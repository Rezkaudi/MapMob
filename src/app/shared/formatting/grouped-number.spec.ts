import { formatGroupedNumber, parseGroupedNumber } from './grouped-number';

describe('formatGroupedNumber', () => {
  it('groups thousands with Latin digits and commas', () => {
    expect(formatGroupedNumber(24150)).toBe('24,150');
    expect(formatGroupedNumber(1250000)).toBe('1,250,000');
  });

  it('leaves small numbers as they are', () => {
    expect(formatGroupedNumber(985)).toBe('985');
  });
});

describe('parseGroupedNumber', () => {
  it('reads a number typed with comma groups', () => {
    expect(parseGroupedNumber('300,000')).toBe(300000);
    expect(parseGroupedNumber('25.5')).toBe(25.5);
  });

  it('reads anything that is not a number as zero', () => {
    expect(parseGroupedNumber('')).toBe(0);
    expect(parseGroupedNumber('abc')).toBe(0);
  });
});
