import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { CLOCK } from '../../../core/config/clock';
import { buildDeliveryPlatformDraft } from '../testing/delivery-platform-fixture';
import { DeliveryPlatformMockRepository } from './delivery-platform-mock.repository';

const NOW = new Date('2026-09-29T12:00:00.000Z');

function createRepository(): DeliveryPlatformMockRepository {
  TestBed.configureTestingModule({
    providers: [DeliveryPlatformMockRepository, { provide: CLOCK, useValue: () => NOW }],
  });
  return TestBed.inject(DeliveryPlatformMockRepository);
}

describe('DeliveryPlatformMockRepository', () => {
  it('serves the seeded platforms, six of them switched on, talabat used most', async () => {
    const repository = createRepository();

    const page = await firstValueFrom(repository.getPlatforms({ pageIndex: 0, pageSize: 4 }));
    const summary = await firstValueFrom(repository.getSummary());

    expect(page.items).toHaveLength(4);
    expect(page.totalCount).toBe(7);
    expect(summary.activeCount).toBe(6);
    expect(summary.mostUsedPlatform?.latinName).toBe('talabat');
  });

  it('keeps what is saved between calls', async () => {
    const repository = createRepository();

    const added = await firstValueFrom(
      repository.createPlatform(buildDeliveryPlatformDraft({ latinName: 'Lezzoo' })),
    );
    await firstValueFrom(repository.setPlatformStatus(added.id, 'suspended'));
    const page = await firstValueFrom(
      repository.getPlatforms({ pageIndex: 0, pageSize: 4, search: 'lezzoo' }),
    );

    expect(page.items.map((platform) => [platform.createdAt, platform.status])).toEqual([
      [NOW.toISOString(), 'suspended'],
    ]);
  });

  it('turns a refused save into an error event', async () => {
    const repository = createRepository();

    await expect(
      firstValueFrom(repository.createPlatform(buildDeliveryPlatformDraft())),
    ).rejects.toThrow('توجد منصة بهذا الاسم مسبقاً');
  });

  it('lists the stores linked to talabat and forgets a deleted platform', async () => {
    const repository = createRepository();

    const stores = await firstValueFrom(repository.getLinkedStores('3'));
    await firstValueFrom(repository.deletePlatform('3'), { defaultValue: undefined });
    const page = await firstValueFrom(repository.getPlatforms({ pageIndex: 0, pageSize: 10 }));

    expect(stores[0].name).toBe('مطعم المدينة');
    expect(page.items.some((platform) => platform.id === '3')).toBe(false);
  });
});
