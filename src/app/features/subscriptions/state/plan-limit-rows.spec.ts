import { describe, expect, it } from 'vitest';
import { PlanLimits } from '../models/plan-limits';
import { buildPlanLimitRows } from './plan-limit-rows';

function limits(patch: Partial<PlanLimits> = {}): PlanLimits {
  return { adsPerMonth: 10, activeOffers: 20, galleryImages: 30, videos: 5, ...patch };
}

describe('buildPlanLimitRows', () => {
  it('lists the three rows the card shows, in the design order', () => {
    const rows = buildPlanLimitRows(limits());

    expect(rows.map((row) => row.label)).toEqual(['عدد الإعلانات:', 'عدد العروض:', 'معرض الصور:']);
  });

  it('writes an unlimited allowance as the design does', () => {
    const rows = buildPlanLimitRows(limits({ adsPerMonth: null, activeOffers: null }));

    expect(rows[0].value).toBe('غير محدود ⚡');
    expect(rows[1].value).toBe('غير محدود ⚡');
  });

  it('counts ads the way Arabic does', () => {
    expect(buildPlanLimitRows(limits({ adsPerMonth: 1 }))[0].value).toBe('1 إعلان شهرياً');
    expect(buildPlanLimitRows(limits({ adsPerMonth: 2 }))[0].value).toBe('2 إعلانين شهرياً');
    expect(buildPlanLimitRows(limits({ adsPerMonth: 10 }))[0].value).toBe('10 إعلانات شهرياً');
    expect(buildPlanLimitRows(limits({ adsPerMonth: 24 }))[0].value).toBe('24 إعلاناً شهرياً');
  });

  it('counts offers the way Arabic does', () => {
    expect(buildPlanLimitRows(limits({ activeOffers: 1 }))[1].value).toBe('1 عرض نشط');
    expect(buildPlanLimitRows(limits({ activeOffers: 2 }))[1].value).toBe('2 عروض نشطة');
    expect(buildPlanLimitRows(limits({ activeOffers: 20 }))[1].value).toBe('20 عرضاً نشطاً');
  });

  it('counts gallery images the way Arabic does', () => {
    expect(buildPlanLimitRows(limits({ galleryImages: 1 }))[2].value).toBe('صورة واحدة');
    expect(buildPlanLimitRows(limits({ galleryImages: 5 }))[2].value).toBe('5 صور');
    expect(buildPlanLimitRows(limits({ galleryImages: 100 }))[2].value).toBe('100 صورة');
  });
});
