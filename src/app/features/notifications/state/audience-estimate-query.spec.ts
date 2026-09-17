import { toAudienceEstimateQuery } from './audience-estimate-query';

describe('toAudienceEstimateQuery', () => {
  it('asks only when recipients are picked by place and a governorate is chosen', () => {
    const base = { audience: 'users' as const, governorateId: 'g1', areaId: 'a1' };

    expect(toAudienceEstimateQuery({ ...base, recipientMode: 'location' })).toEqual(base);
    expect(toAudienceEstimateQuery({ ...base, recipientMode: 'all' })).toBeNull();
    expect(
      toAudienceEstimateQuery({ ...base, recipientMode: 'location', governorateId: null }),
    ).toBeNull();
  });
});
