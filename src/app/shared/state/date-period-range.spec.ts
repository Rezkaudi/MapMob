import { resolveDatePeriodRange } from './date-period-range';

const TODAY = new Date(2026, 8, 15, 10, 0);
const NO_RANGE = { from: null, to: null };

describe('resolveDatePeriodRange', () => {
  it('leaves both ends open for "الكل"', () => {
    expect(resolveDatePeriodRange('all', NO_RANGE, TODAY)).toEqual(NO_RANGE);
  });

  it('counts today in the preset periods', () => {
    expect(resolveDatePeriodRange('today', NO_RANGE, TODAY)).toEqual({
      from: '2026-09-15',
      to: '2026-09-15',
    });
    expect(resolveDatePeriodRange('last7Days', NO_RANGE, TODAY)).toEqual({
      from: '2026-09-09',
      to: '2026-09-15',
    });
    expect(resolveDatePeriodRange('last30Days', NO_RANGE, TODAY)).toEqual({
      from: '2026-08-17',
      to: '2026-09-15',
    });
  });

  it('uses the typed range for "نطاق مخصص"', () => {
    const customRange = { from: '2026-08-01', to: '2026-09-02' };

    expect(resolveDatePeriodRange('custom', customRange, TODAY)).toEqual(customRange);
  });
});
