import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { GovernorateMockRepository } from './governorate-mock.repository';
import { RegionMockDatabase } from './region-mock-database';

const SEED = {
  governorates: [
    {
      id: 'gov-1',
      name: 'طرطوس',
      status: 'active' as const,
      updatedAt: '2024-01-12T00:00:00.000Z',
    },
    { id: 'gov-2', name: 'حمص', status: 'active' as const, updatedAt: '2024-01-12T00:00:00.000Z' },
  ],
  areas: [],
};

describe('GovernorateMockRepository', () => {
  let repository: GovernorateMockRepository;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        GovernorateMockRepository,
        { provide: RegionMockDatabase, useValue: new RegionMockDatabase(SEED) },
      ],
    });
    repository = TestBed.inject(GovernorateMockRepository);
  });

  it('pages and searches the governorates', async () => {
    const page = await firstValueFrom(
      repository.getGovernorates({ pageIndex: 0, pageSize: 5, search: 'حمص' }),
    );

    expect(page.totalCount).toBe(1);
    expect(page.items[0].name).toBe('حمص');
  });

  it('saves a new governorate, edits it, changes its status and deletes it', async () => {
    const created = await firstValueFrom(
      repository.createGovernorate({ name: 'حماة', status: 'active' }),
    );
    await firstValueFrom(
      repository.updateGovernorate(created.id, { name: 'حماه', status: 'active' }),
    );
    const suspended = await firstValueFrom(
      repository.setGovernorateStatus(created.id, 'suspended'),
    );

    expect(suspended).toMatchObject({ name: 'حماه', status: 'suspended' });

    await firstValueFrom(repository.deleteGovernorate(created.id));
    const page = await firstValueFrom(repository.getGovernorates({ pageIndex: 0, pageSize: 5 }));
    expect(page.totalCount).toBe(2);
  });

  it('fails for a governorate that does not exist', async () => {
    await expect(firstValueFrom(repository.getGovernorate('missing'))).rejects.toThrowError();
    await expect(
      firstValueFrom(repository.setGovernorateStatus('missing', 'active')),
    ).rejects.toThrowError();
  });
});
