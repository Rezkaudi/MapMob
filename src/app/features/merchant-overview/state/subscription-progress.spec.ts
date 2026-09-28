import { describeSubscriptionProgress } from './subscription-progress';

const YEAR_PLAN = { startsOn: '2026-01-01', endsOn: '2026-12-31' };

describe('describeSubscriptionProgress', () => {
  it('matches the design on 26 July: 57% used, 158 days left', () => {
    const progress = describeSubscriptionProgress(YEAR_PLAN, '2026-07-26');

    expect(progress.consumedPercent).toBe(57);
    expect(progress.consumedText).toBe('تم استهلاك 57%');
    expect(progress.remainingText).toBe('متبقي 158 يوماً');
  });

  it('writes the window with Latin digits and Arabic months', () => {
    const progress = describeSubscriptionProgress(YEAR_PLAN, '2026-07-26');

    expect(progress.periodText).toBe('01 يناير 2026 — 31 ديسمبر 2026');
  });

  it('stays between 0 and 100 before the start and after the end', () => {
    expect(describeSubscriptionProgress(YEAR_PLAN, '2025-12-01').consumedPercent).toBe(0);
    const ended = describeSubscriptionProgress(YEAR_PLAN, '2027-02-01');
    expect(ended.consumedPercent).toBe(100);
    expect(ended.remainingDays).toBe(0);
  });
});
