import { firstValueFrom } from 'rxjs';
import { PlaceMockRepository } from './place-mock.repository';

describe('PlaceMockRepository', () => {
  const repository = new PlaceMockRepository();

  it('gives every place a code and a package', async () => {
    const page = await firstValueFrom(repository.getPlaces({ pageIndex: 0, pageSize: 8 }));

    for (const place of page.items) {
      expect(place.code).toMatch(/^\d+$/);
      expect(['free', 'basic', 'premium']).toContain(place.package);
    }
  });

  it('filters by package', async () => {
    const page = await firstValueFrom(
      repository.getPlaces({ pageIndex: 0, pageSize: 50, package: 'premium' }),
    );

    expect(page.items.length).toBeGreaterThan(0);
    expect(page.items.every((place) => place.package === 'premium')).toBe(true);
  });

  it('filters by category', async () => {
    const page = await firstValueFrom(
      repository.getPlaces({ pageIndex: 0, pageSize: 50, category: 'صيدلية' }),
    );

    expect(page.items.length).toBeGreaterThan(0);
    expect(page.items.every((place) => place.category === 'صيدلية')).toBe(true);
  });

  it('sorts by rating when asked', async () => {
    const page = await firstValueFrom(
      repository.getPlaces({ pageIndex: 0, pageSize: 8, sort: 'rating' }),
    );

    const ratings = page.items.map((place) => place.rating);
    expect(ratings).toEqual([...ratings].sort((a, b) => b - a));
  });

  it('counts places per status', async () => {
    const counts = await firstValueFrom(repository.getStatusCounts());

    expect(counts.all).toBe(counts.active + counts.pending + counts.suspended);
    expect(counts.all).toBeGreaterThan(0);
  });
});
