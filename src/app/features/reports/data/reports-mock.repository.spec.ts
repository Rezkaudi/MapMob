import { firstValueFrom } from 'rxjs';
import { ReportsMockRepository } from './reports-mock.repository';

describe('ReportsMockRepository', () => {
  const repository = new ReportsMockRepository();

  it('shares the categories as the design’s pie does', async () => {
    const shares = await firstValueFrom(repository.getCategoryShares());

    expect(shares.map((share) => [share.categoryName, share.share])).toEqual([
      ['مطاعم', 29],
      ['كافيات', 22],
      ['صيدليات', 17],
      ['نوادي', 14],
      ['مكتبات', 9],
      ['متاجر ألبسة', 9],
    ]);
  });

  it('lists the five most active governorates', async () => {
    const activities = await firstValueFrom(repository.getGovernorateActivities());

    expect(activities[0]).toEqual({ governorateName: 'دمشق', visitCount: 16750, share: 32 });
    expect(activities.map((activity) => activity.governorateName)).toEqual([
      'دمشق',
      'طرطوس',
      'حمص',
      'اللاذقية',
      'حلب',
    ]);
  });

  it('draws active users over new users through the week', async () => {
    const [activeUsers, newUsers] = await firstValueFrom(repository.getGrowthSeries('weekly'));

    expect(activeUsers.name).toBe('المستخدمون النشطون');
    expect(newUsers.name).toBe('المستخدمون الجدد');
    expect(activeUsers.points.map((point) => point.label)).toEqual([
      'Mon',
      'Tue',
      'Wed',
      'Thu',
      'Fri',
      'Sat',
      'Sun',
    ]);
  });

  it('keeps the weekly usage numbers from the design', async () => {
    const metrics = await firstValueFrom(repository.getUsageMetrics('weekly'));

    expect(metrics[0]).toEqual({ label: 'عمليات البحث والاستكشاف', count: 24150, share: 42 });
    expect(metrics.length).toBe(4);
  });

  it('counts more usage over a longer period', async () => {
    const [weekly] = await firstValueFrom(repository.getUsageMetrics('weekly'));
    const [yearly] = await firstValueFrom(repository.getUsageMetrics('yearly'));

    expect(yearly.count).toBeGreaterThan(weekly.count);
  });

  it('labels the monthly revenue with all twelve months', async () => {
    const revenue = await firstValueFrom(repository.getRevenueSeries('monthly'));

    expect(revenue.points.length).toBe(12);
    expect(revenue.points.find((point) => point.label === 'Jul')?.value).toBe(48200);
  });
});
