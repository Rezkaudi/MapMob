import { describeDailyAverage, describePeakDay } from './performance-highlights';

describe('performance highlights', () => {
  it('writes the daily average as the design does', () => {
    expect(describeDailyAverage(42)).toBe('42 مشاهدة / يوم');
  });

  // The frame's "الخميس 24 يوليو" is sample copy: 24 July 2026 is a Friday.
  it('writes the busiest day with its real weekday and views', () => {
    expect(describePeakDay({ on: '2026-07-23', viewCount: 142 })).toBe(
      'الخميس 23 يوليو (142 مشاهدة)',
    );
    expect(describePeakDay({ on: '2026-07-24', viewCount: 142 })).toBe(
      'الجمعة 24 يوليو (142 مشاهدة)',
    );
  });

  it('writes a dash when the period has no views yet', () => {
    expect(describePeakDay(null)).toBe('—');
  });
});
