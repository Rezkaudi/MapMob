import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { PlaceMockDatabase } from './place-mock-database';
import { buildPlaceSeed } from './place-mock-seed';
import { PlaceMockRepository } from './place-mock.repository';

function createRepository(): PlaceMockRepository {
  TestBed.configureTestingModule({
    providers: [
      PlaceMockRepository,
      { provide: PlaceMockDatabase, useFactory: () => new PlaceMockDatabase(buildPlaceSeed()) },
    ],
  });
  return TestBed.inject(PlaceMockRepository);
}

describe('PlaceMockRepository', () => {
  let repository: PlaceMockRepository;

  beforeEach(() => {
    repository = createRepository();
  });

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

  it('keeps a status change, and counts it', async () => {
    const [place] = (await firstValueFrom(repository.getPlaces({ pageIndex: 0, pageSize: 1 })))
      .items;
    const before = await firstValueFrom(repository.getStatusCounts());

    await firstValueFrom(repository.setPlacesStatus([place.id], 'suspended'));

    const after = await firstValueFrom(repository.getStatusCounts());
    expect(after.suspended).toBe(before.suspended + (place.status === 'suspended' ? 0 : 1));
    expect(after.all).toBe(before.all);
  });

  it('keeps a delete', async () => {
    const page = await firstValueFrom(repository.getPlaces({ pageIndex: 0, pageSize: 2 }));
    const ids = page.items.map((place) => place.id);

    await firstValueFrom(repository.deletePlaces(ids));

    const after = await firstValueFrom(repository.getPlaces({ pageIndex: 0, pageSize: 2 }));
    expect(after.totalCount).toBe(page.totalCount - ids.length);
    expect(after.items.some((place) => ids.includes(place.id))).toBe(false);
  });

  it('exports every filtered place, or only the ticked rows', async () => {
    const all = await firstValueFrom(
      repository.exportPlaces({
        query: { pageIndex: 0, pageSize: 8, package: 'premium' },
        ids: [],
      }),
    );
    const one = await firstValueFrom(
      repository.exportPlaces({ query: { pageIndex: 0, pageSize: 8 }, ids: ['place-1'] }),
    );

    const allRows = (await all.text()).trim().split('\r\n');
    const oneRows = (await one.text()).trim().split('\r\n');
    expect(allRows.length).toBeGreaterThan(oneRows.length);
    expect(oneRows.length).toBe(2);
  });
});
