import { firstValueFrom } from 'rxjs';
import { DashboardMockRepository } from './dashboard-mock.repository';

describe('DashboardMockRepository', () => {
  const repository = new DashboardMockRepository();

  it('labels the weekly series with the days of the week, as the design shows', async () => {
    const [companies] = await firstValueFrom(repository.getGrowthSeries('weekly'));

    expect(companies.points.map((point) => point.label)).toEqual([
      'Mon',
      'Tue',
      'Wed',
      'Thu',
      'Fri',
      'Sat',
      'Sun',
    ]);
  });

  it('labels the monthly series with the twelve months', async () => {
    const series = await firstValueFrom(repository.getRevenueSeries('monthly'));

    expect(series.points.length).toBe(12);
    expect(series.points[0].label).toBe('Jan');
    expect(series.points[11].label).toBe('Dec');
  });

  it('keeps the daily series distinct from the weekly one', async () => {
    const daily = await firstValueFrom(repository.getRevenueSeries('daily'));
    const weekly = await firstValueFrom(repository.getRevenueSeries('weekly'));

    expect(daily.points.map((point) => point.label)).not.toEqual(
      weekly.points.map((point) => point.label),
    );
  });
});
