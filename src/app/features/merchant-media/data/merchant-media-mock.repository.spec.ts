import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { CLOCK } from '../../../core/config/clock';
import { MerchantMediaMockRepository } from './merchant-media-mock.repository';

const NOW = new Date('2026-09-29T12:00:00.000Z');
const PICTURE = new File(['x'], 'front.jpg', { type: 'image/jpeg' });
const VIDEO = new File(['x'], 'tour.mp4', { type: 'video/mp4' });

function createRepository(): MerchantMediaMockRepository {
  let blobNumber = 0;
  URL.createObjectURL = () => `blob:media-${++blobNumber}`;
  TestBed.configureTestingModule({
    providers: [MerchantMediaMockRepository, { provide: CLOCK, useValue: () => NOW }],
  });
  return TestBed.inject(MerchantMediaMockRepository);
}

describe('MerchantMediaMockRepository', () => {
  it("serves the frame's gallery: a main picture, a video and a picture of 5", async () => {
    const library = await firstValueFrom(createRepository().getLibrary());

    expect(library.plan.name).toBe('الباقة المجانية');
    expect(library.imageLimit! + library.videoLimit!).toBe(5);
    expect(library.items.map((item) => [item.kind, item.isMain])).toEqual([
      ['image', true],
      ['video', false],
      ['image', false],
    ]);
  });

  it('adds a main picture, taking the flag from the old one', async () => {
    const repository = createRepository();

    const added = await firstValueFrom(
      repository.addMedia({ kind: 'image', file: PICTURE, isMain: true }),
    );

    expect(added).toEqual(
      expect.objectContaining({ kind: 'image', mimeType: 'image/jpeg', isMain: true }),
    );
    expect(added.createdAt).toBe(NOW.toISOString());
    const library = await firstValueFrom(repository.getLibrary());
    expect(library.items.filter((item) => item.isMain).map((item) => item.id)).toEqual([added.id]);
  });

  it('replaces the file and keeps the rest, then deletes', async () => {
    const repository = createRepository();
    const [first] = (await firstValueFrom(repository.getLibrary())).items;

    const replaced = await firstValueFrom(repository.replaceMedia(first.id, PICTURE));
    expect(replaced).toEqual(expect.objectContaining({ id: first.id, isMain: true }));
    expect(replaced.url).not.toBe(first.url);

    await firstValueFrom(repository.deleteMedia(first.id), { defaultValue: undefined });
    const ids = (await firstValueFrom(repository.getLibrary())).items.map((item) => item.id);
    expect(ids).not.toContain(first.id);
  });

  it('refuses a video past the video limit, as the server will', async () => {
    const repository = createRepository();

    await expect(
      firstValueFrom(repository.addMedia({ kind: 'video', file: VIDEO, isMain: false })),
    ).rejects.toThrow('وصلت للحد المتاح من الفيديوهات في باقتك الحالية.');
  });
});
