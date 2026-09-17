import { estimateMockAudience, NOTIFICATION_MOCK_GOVERNORATES } from './notification-mock-audience';

describe('estimateMockAudience', () => {
  it('counts fewer devices for an area than for its whole governorate', () => {
    const [tartus] = NOTIFICATION_MOCK_GOVERNORATES;
    const whole = estimateMockAudience({
      audience: 'users',
      governorateId: tartus.id,
      areaId: null,
    });
    const area = estimateMockAudience({
      audience: 'users',
      governorateId: tartus.id,
      areaId: tartus.areas[0].id,
    });

    expect(tartus.name).toBe('طرطوس');
    expect(area.deviceCount).toBeLessThan(whole.deviceCount);
    expect(whole.sharePercent).toBeGreaterThan(area.sharePercent);
    expect(whole.sharePercent).toBeLessThanOrEqual(100);
  });

  it('gives the same answer each time', () => {
    const query = { audience: 'companies' as const, governorateId: 'governorate-2', areaId: null };
    expect(estimateMockAudience(query)).toEqual(estimateMockAudience(query));
  });
});
