import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { AreaMockRepository } from './area-mock.repository';
import { RegionMockDatabase } from './region-mock-database';

const SEED = {
  governorates: [
    {
      id: 'gov-1',
      name: 'طرطوس',
      status: 'active' as const,
      updatedAt: '2024-01-12T00:00:00.000Z',
    },
  ],
  areas: [
    {
      id: 'area-1',
      governorateId: 'gov-1',
      name: 'صافيتا',
      subAreaCount: 5,
      placeCount: 300,
      status: 'active' as const,
      updatedAt: '2024-01-12T00:00:00.000Z',
    },
  ],
};

describe('AreaMockRepository', () => {
  let repository: AreaMockRepository;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AreaMockRepository,
        { provide: RegionMockDatabase, useValue: new RegionMockDatabase(SEED) },
      ],
    });
    repository = TestBed.inject(AreaMockRepository);
  });

  it('pages the areas of one governorate', async () => {
    const page = await firstValueFrom(
      repository.getAreas({ governorateId: 'gov-1', pageIndex: 0, pageSize: 5 }),
    );

    expect(page.items.map((area) => area.name)).toEqual(['صافيتا']);
  });

  it('saves a new area, edits it, changes its status and deletes it', async () => {
    const created = await firstValueFrom(
      repository.createArea('gov-1', { name: 'بانياس', status: 'active' }),
    );
    await firstValueFrom(repository.updateArea(created.id, { name: 'بانياس', status: 'active' }));
    const suspended = await firstValueFrom(repository.setAreaStatus(created.id, 'suspended'));
    expect(suspended.status).toBe('suspended');

    await firstValueFrom(repository.deleteArea(created.id));
    const page = await firstValueFrom(
      repository.getAreas({ governorateId: 'gov-1', pageIndex: 0, pageSize: 5 }),
    );
    expect(page.totalCount).toBe(1);
  });

  it('fails for an area that does not exist', async () => {
    await expect(
      firstValueFrom(repository.setAreaStatus('missing', 'active')),
    ).rejects.toThrowError();
  });
});
