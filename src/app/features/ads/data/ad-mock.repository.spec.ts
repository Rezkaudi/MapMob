import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { CLOCK } from '../../../core/config/clock';
import { buildAd, buildAdDetail, buildAdDraft } from '../testing/ad-fixture';
import { AdMockDatabase } from './ad-mock-database';
import { AdMockRepository } from './ad-mock.repository';

const RUNNING = buildAdDetail();
const PAUSED = buildAdDetail({ ad: buildAd({ id: 'a3', title: 'إعلان متوقف', status: 'paused' }) });

describe('AdMockRepository', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AdMockRepository,
        { provide: AdMockDatabase, useValue: new AdMockDatabase([RUNNING, PAUSED]) },
        { provide: CLOCK, useValue: () => new Date(2026, 9, 20) },
      ],
    });
  });

  it('pages, filters, counts, exports and deletes the stored ads', async () => {
    const repository = TestBed.inject(AdMockRepository);

    expect(
      await firstValueFrom(repository.getAds({ pageIndex: 0, pageSize: 4, status: 'paused' })),
    ).toEqual({
      items: [PAUSED.ad],
      totalCount: 1,
    });
    expect(await firstValueFrom(repository.getSummary())).toEqual({
      totalCount: 2,
      activeCount: 1,
      scheduledCount: 0,
      endedCount: 1,
    });
    expect(
      await (
        await firstValueFrom(repository.exportAds({ pageIndex: 0, pageSize: 4, status: 'paused' }))
      ).text(),
    ).toContain('إعلان متوقف');
    await firstValueFrom(repository.deleteAd('a3'), { defaultValue: undefined });
    expect((await firstValueFrom(repository.getSummary())).totalCount).toBe(1);
  });

  it('lists the stores for the form, reads an ad in detail, and creates and updates one', async () => {
    const repository = TestBed.inject(AdMockRepository);

    expect((await firstValueFrom(repository.getFormOptions())).places).toContainEqual({
      id: 'place-3',
      name: 'صيدلية الحياة',
    });
    expect(await firstValueFrom(repository.getAdDetail('ad-2'))).toEqual(RUNNING);
    const created = await firstValueFrom(repository.createAd(buildAdDraft()));
    expect(created.placeName).toBe('صيدلية الحياة');
    expect(
      (await firstValueFrom(repository.updateAd(created.id, buildAdDraft({ title: 'معدل' }))))
        .title,
    ).toBe('معدل');
    await expect(
      firstValueFrom(repository.createAd(buildAdDraft({ placeId: 'missing' }))),
    ).rejects.toThrowError('لم يتم العثور على المتجر');
  });
});
