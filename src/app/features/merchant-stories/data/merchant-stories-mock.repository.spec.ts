import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { CLOCK } from '../../../core/config/clock';
import { MerchantStoriesMockRepository } from './merchant-stories-mock.repository';

const HOUR_MS = 3_600_000;
const START = new Date(2026, 9, 1, 20, 30);
const PICTURE = new File(['x'], 'serum.jpg', { type: 'image/jpeg' });
const VIDEO = new File(['x'], 'tour.mp4', { type: 'video/mp4' });

function createRepository() {
  let now = START;
  let blobNumber = 0;
  URL.createObjectURL = () => `blob:story-${++blobNumber}`;
  TestBed.configureTestingModule({
    providers: [MerchantStoriesMockRepository, { provide: CLOCK, useValue: () => now }],
  });
  return {
    repository: TestBed.inject(MerchantStoriesMockRepository),
    moveClock: (hours: number) => (now = new Date(now.getTime() + hours * HOUR_MS)),
  };
}

const idsWith = (items: readonly { id: string; status: string }[], status: string) =>
  items.filter((item) => item.status === status).map((item) => item.id);

describe('MerchantStoriesMockRepository', () => {
  it("serves the frame's page: 3 active stories of 5 on the free plan, and the expired ones", async () => {
    const library = await firstValueFrom(createRepository().repository.getLibrary());

    expect(library.plan.name).toBe('الباقة المجانية');
    expect(library.place.name).toBe('صيدلية الشفاء');
    expect(library.activeStoryLimit).toBe(5);
    expect(idsWith(library.items, 'active')).toHaveLength(3);
    expect(idsWith(library.items, 'expired')).toHaveLength(3);
    expect(library.items[0]).toEqual(
      expect.objectContaining({
        caption: 'وصول دفعة سيرومات فيتامين C الجديدة',
        viewCount: 348,
        publishedAt: new Date(2026, 9, 1, 10, 30).toISOString(),
        expiresAt: new Date(2026, 9, 2, 10, 30).toISOString(),
      }),
    );
  });

  it('publishes a story that lasts 24 hours and has no views yet', async () => {
    const { repository } = createRepository();

    const added = await firstValueFrom(repository.addStory({ file: VIDEO, caption: null }));

    expect(added).toEqual(
      expect.objectContaining({
        kind: 'video',
        url: 'blob:story-1',
        posterUrl: null,
        caption: null,
        status: 'active',
        viewCount: 0,
        publishedAt: START.toISOString(),
        expiresAt: new Date(START.getTime() + 24 * HOUR_MS).toISOString(),
      }),
    );
    const library = await firstValueFrom(repository.getLibrary());
    expect(idsWith(library.items, 'active')).toContain(added.id);
  });

  it('refuses a story past the plan limit, as the server will', async () => {
    const { repository } = createRepository();
    await firstValueFrom(repository.addStory({ file: PICTURE, caption: null }));
    await firstValueFrom(repository.addStory({ file: PICTURE, caption: null }));

    await expect(
      firstValueFrom(repository.addStory({ file: PICTURE, caption: null })),
    ).rejects.toThrow('وصلت للحد المتاح من القصص النشطة في باقتك الحالية.');
  });

  it('moves a story to the expired ones once its 24 hours pass', async () => {
    const { repository, moveClock } = createRepository();
    const added = await firstValueFrom(repository.addStory({ file: PICTURE, caption: null }));

    moveClock(25);
    const library = await firstValueFrom(repository.getLibrary());

    expect(idsWith(library.items, 'expired')).toContain(added.id);
    expect(idsWith(library.items, 'active')).toEqual([]);
  });

  it('edits the text and keeps the file, or swaps the file too', async () => {
    const { repository } = createRepository();
    const [first] = (await firstValueFrom(repository.getLibrary())).items;

    const renamed = await firstValueFrom(
      repository.updateStory(first.id, { file: null, caption: 'نص جديد' }),
    );
    expect(renamed).toEqual({ ...first, caption: 'نص جديد' });

    const swapped = await firstValueFrom(
      repository.updateStory(first.id, { file: VIDEO, caption: null }),
    );
    expect(swapped).toEqual(
      expect.objectContaining({ id: first.id, kind: 'video', caption: null, viewCount: 348 }),
    );
    expect(swapped.publishedAt).toBe(first.publishedAt);
  });

  it('refuses to edit an expired story', async () => {
    const { repository } = createRepository();
    const library = await firstValueFrom(repository.getLibrary());
    const [expiredId] = idsWith(library.items, 'expired');

    await expect(
      firstValueFrom(repository.updateStory(expiredId, { file: null, caption: 'نص' })),
    ).rejects.toThrow('انتهت هذه القصة ولا يمكن تعديلها.');
  });

  it('deletes a story', async () => {
    const { repository } = createRepository();
    const [first] = (await firstValueFrom(repository.getLibrary())).items;

    await firstValueFrom(repository.deleteStory(first.id), { defaultValue: undefined });

    const ids = (await firstValueFrom(repository.getLibrary())).items.map((item) => item.id);
    expect(ids).not.toContain(first.id);
  });
});
