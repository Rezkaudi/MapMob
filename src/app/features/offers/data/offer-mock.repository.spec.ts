import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { CLOCK } from '../../../core/config/clock';
import { buildOffer, buildOfferDetail, buildOfferDraft } from '../testing/offer-fixture';
import { OfferMockDatabase } from './offer-mock-database';
import { OfferMockRepository } from './offer-mock.repository';

const RUNNING = buildOfferDetail();
const PAUSED = buildOfferDetail({
  offer: buildOffer({
    id: 'o3',
    title: 'عرض متوقف',
    startsOn: '2026-09-01',
    endsOn: '2026-09-30',
    status: 'paused',
  }),
});

describe('OfferMockRepository', () => {
  let repository: OfferMockRepository;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        OfferMockRepository,
        { provide: OfferMockDatabase, useValue: new OfferMockDatabase([RUNNING, PAUSED]) },
        { provide: CLOCK, useValue: () => new Date(2026, 8, 15) },
      ],
    });
    repository = TestBed.inject(OfferMockRepository);
  });

  it('pages, filters and counts the stored offers', async () => {
    const page = await firstValueFrom(
      repository.getOffers({ pageIndex: 0, pageSize: 4, status: 'paused' }),
    );
    const summary = await firstValueFrom(repository.getSummary());

    expect(page).toEqual({ items: [PAUSED.offer], totalCount: 1 });
    expect(summary).toEqual({ totalCount: 2, activeCount: 1, scheduledCount: 0, endedCount: 1 });
  });

  it('pauses and resumes an offer, deletes one and reads one in detail', async () => {
    await firstValueFrom(repository.pauseOffer('offer-2'));
    const resumed = await firstValueFrom(repository.resumeOffer('o3'));
    const detail = await firstValueFrom(repository.getOfferDetail('offer-2'));
    await firstValueFrom(repository.deleteOffer('o3'), { defaultValue: undefined });

    expect(resumed.status).toBe('active');
    expect(detail.offer.status).toBe('paused');
    expect((await firstValueFrom(repository.getSummary())).totalCount).toBe(1);
  });

  it('fails the request for an offer that does not exist', async () => {
    await expect(firstValueFrom(repository.getOfferDetail('missing'))).rejects.toThrowError();
  });

  it('exports the filtered offers as a CSV file', async () => {
    const file = await firstValueFrom(
      repository.exportOffers({ pageIndex: 0, pageSize: 4, status: 'paused' }),
    );

    expect(file.type).toContain('text/csv');
    expect(await file.text()).toContain('عرض متوقف');
  });

  it('lists the stores and categories for the form, and the items of a store', async () => {
    const options = await firstValueFrom(repository.getFormOptions());
    const items = await firstValueFrom(repository.getPlaceItems('place-7'));

    expect(options.places.map((place) => place.id)).toContain('place-7');
    expect(options.categoryNames).toContain('ألبسة');
    expect(new Set(options.categoryNames).size).toBe(options.categoryNames.length);
    expect(items[0].id).toBe('place-7-item-1');
  });

  it('creates and updates an offer for a known store, and refuses an unknown one', async () => {
    const created = await firstValueFrom(repository.createOffer(buildOfferDraft()));
    const updated = await firstValueFrom(
      repository.updateOffer(created.id, buildOfferDraft({ title: 'عرض معدل' })),
    );

    expect(created.placeName).toBe('ألبسة الجمال');
    expect(updated.title).toBe('عرض معدل');
    await expect(
      firstValueFrom(repository.createOffer(buildOfferDraft({ placeId: 'missing' }))),
    ).rejects.toThrowError('لم يتم العثور على المتجر');
  });
});
