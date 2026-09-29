import { buildOverview } from '../testing/merchant-subscription-fixture';
import { buildHistoryRows } from './history-rows';

describe('history rows', () => {
  const [current, free] = buildHistoryRows(buildOverview().history);

  it("writes each period in the table's words", () => {
    expect(current).toMatchObject({
      planName: 'الباقة الأساسية',
      termLabel: 'شهرية',
      amountText: '150,000 ل.س',
      startsOnText: '01 / 09 / 2026',
      endsOnText: '01 / 10 / 2026',
      status: { label: 'نشطة', tone: 'success' },
    });
  });

  it('writes a free period as 0 and an ended one as ended', () => {
    expect(free.amountText).toBe('0 ل.س');
    expect(free.status).toEqual({ label: 'منتهية', tone: 'muted' });
  });
});
