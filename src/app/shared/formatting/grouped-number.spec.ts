import { formatGroupedNumber } from './grouped-number';

describe('formatGroupedNumber', () => {
  it('groups thousands with Latin digits and commas', () => {
    expect(formatGroupedNumber(24150)).toBe('24,150');
    expect(formatGroupedNumber(1250000)).toBe('1,250,000');
  });

  it('leaves small numbers as they are', () => {
    expect(formatGroupedNumber(985)).toBe('985');
  });
});
