import { summarizeCampaigns } from './summarize-campaigns';

describe('summarizeCampaigns', () => {
  it('counts all, active and scheduled campaigns, and ended ones with the paused', () => {
    const statuses = ['active', 'scheduled', 'expired', 'paused'] as const;

    expect(summarizeCampaigns(statuses.map((status) => ({ status })))).toEqual({
      totalCount: 4,
      activeCount: 1,
      scheduledCount: 1,
      endedCount: 2,
    });
  });
});
