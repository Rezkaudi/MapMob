import { ArabicDatePipe } from './arabic-date.pipe';

describe('ArabicDatePipe', () => {
  const pipe = new ArabicDatePipe();

  it('formats an ISO date the way the design writes it', () => {
    expect(pipe.transform('2024-01-12T00:00:00.000Z')).toBe('١٢ يناير ٢٠٢٤');
  });

  it('returns an empty string when there is no date', () => {
    expect(pipe.transform(null)).toBe('');
  });
});
