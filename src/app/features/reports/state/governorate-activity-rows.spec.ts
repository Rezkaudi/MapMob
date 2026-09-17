import { toGovernorateActivityRows } from './governorate-activity-rows';

describe('toGovernorateActivityRows', () => {
  it('writes the visits with the visit word and the share in brackets', () => {
    const [row] = toGovernorateActivityRows([
      { governorateName: 'دمشق', visitCount: 16750, share: 32 },
    ]);

    expect(row).toEqual({
      label: 'دمشق',
      valueText: '16,750 زيارة',
      shareText: '(32%)',
      share: 32,
      tone: 'violet',
    });
  });

  it('colours the rows violet, blue, green, amber, red in the design order', () => {
    const activities = Array.from({ length: 5 }, (_, index) => ({
      governorateName: `${index}`,
      visitCount: 1,
      share: 1,
    }));

    expect(toGovernorateActivityRows(activities).map((row) => row.tone)).toEqual([
      'violet',
      'blue',
      'green',
      'amber',
      'red',
    ]);
  });
});
