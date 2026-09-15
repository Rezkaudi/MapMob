import { describeDateRange, isDateRangeValid } from './date-range-summary';

describe('describeDateRange', () => {
  it('writes the length and the months, as the design does', () => {
    expect(describeDateRange({ from: '2026-08-01', to: '2026-09-02' })).toBe(
      'تم تحديد فترة 33 يوماً في شهر أغسطس وسبتمبر',
    );
  });

  it('names one month when the range stays inside it', () => {
    expect(describeDateRange({ from: '2026-09-01', to: '2026-09-07' })).toBe(
      'تم تحديد فترة 7 أيام في شهر سبتمبر',
    );
  });

  it('names the first and last month when the range spans more than two', () => {
    expect(describeDateRange({ from: '2026-06-10', to: '2026-09-02' })).toBe(
      'تم تحديد فترة 85 يوماً من شهر يونيو إلى شهر سبتمبر',
    );
  });

  it('says nothing until both ends are picked the right way round', () => {
    expect(describeDateRange({ from: '2026-08-01', to: null })).toBeNull();
    expect(describeDateRange({ from: '2026-09-02', to: '2026-08-01' })).toBeNull();
  });
});

describe('isDateRangeValid', () => {
  it('needs both ends, with the start on or before the end', () => {
    expect(isDateRangeValid({ from: '2026-08-01', to: '2026-08-01' })).toBe(true);
    expect(isDateRangeValid({ from: null, to: '2026-08-01' })).toBe(false);
    expect(isDateRangeValid({ from: '2026-09-02', to: '2026-08-01' })).toBe(false);
  });
});
