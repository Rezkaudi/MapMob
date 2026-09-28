import { firstValueFrom } from 'rxjs';
import { MerchantOverviewMockRepository } from './merchant-overview-mock.repository';

describe('MerchantOverviewMockRepository', () => {
  it('serves the overview drawn in the design', async () => {
    const overview = await firstValueFrom(new MerchantOverviewMockRepository().getOverview());

    expect(overview.placeName).toBe('مطعم الروابي');
    expect(overview.stats.viewCount).toBe(2300);
    expect(overview.activities.length).toBe(4);
    expect(overview.latestReviews.length).toBe(2);
    expect(overview.subscription?.plan.name).toBe('الباقة المميزة');
  });

  it('serves a wave per period tab, with one point per label', async () => {
    const repository = new MerchantOverviewMockRepository();

    const monthly = await firstValueFrom(repository.getPerformance('monthly'));
    const weekly = await firstValueFrom(repository.getPerformance('weekly'));

    expect(monthly.points.map((point) => point.label)[0]).toBe('Jan');
    expect(monthly.points.length).toBe(12);
    expect(weekly.points.length).toBe(7);
    expect(monthly.dailyAverageViewCount).toBe(42);
  });
});
