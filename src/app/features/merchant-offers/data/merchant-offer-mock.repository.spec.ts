import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { CLOCK } from '../../../core/config/clock';
import { buildOfferDraftFields } from '../testing/merchant-offer-fixture';
import { MerchantOfferMockRepository } from './merchant-offer-mock.repository';

const NOW = new Date('2026-09-28T12:00:00.000Z');

function createRepository(): MerchantOfferMockRepository {
  TestBed.configureTestingModule({
    providers: [MerchantOfferMockRepository, { provide: CLOCK, useValue: () => NOW }],
  });
  return TestBed.inject(MerchantOfferMockRepository);
}

describe('MerchantOfferMockRepository', () => {
  it('serves the free plan with three running offers of five', async () => {
    const catalog = await firstValueFrom(createRepository().getCatalog());

    expect(catalog.plan.name).toBe('الباقة المجانية');
    expect(catalog.activeOfferLimit).toBe(5);
    expect(catalog.items.map((offer) => offer.status)).toEqual(['active', 'active', 'active']);
  });

  it("offers the place's products as items", async () => {
    const items = await firstValueFrom(createRepository().getItems());

    expect(items[0]).toEqual({ id: 'product-1', name: 'مرطب dove', price: 200, currency: 'SYP' });
  });

  it('works the status out from the days, the pause and the draft flag', async () => {
    const repository = createRepository();
    const status = async (overrides: Parameters<typeof buildOfferDraftFields>[0]) =>
      (await firstValueFrom(repository.createOffer(buildOfferDraftFields(overrides)))).status;

    expect(await status({ startsOn: '2026-10-01', endsOn: '2026-10-10' })).toBe('scheduled');
    expect(await status({ startsOn: '2026-09-01', endsOn: '2026-09-10' })).toBe('expired');
    expect(await status({ status: 'paused' })).toBe('paused');
    expect(await status({ status: 'draft' })).toBe('draft');
  });

  it('refuses a new live offer once the plan is full, but still takes a draft', async () => {
    const repository = createRepository();
    const running = buildOfferDraftFields({ startsOn: '2026-09-20', endsOn: '2026-10-20' });
    await firstValueFrom(repository.createOffer(running));
    await firstValueFrom(repository.createOffer(running));

    await expect(firstValueFrom(repository.createOffer(running))).rejects.toThrow(
      'وصلت للحد المتاح من العروض النشطة في باقتك الحالية.',
    );
    expect(
      (await firstValueFrom(repository.createOffer({ ...running, status: 'draft' }))).status,
    ).toBe('draft');
  });

  it('pauses, resumes, changes and deletes an offer for the next read', async () => {
    const repository = createRepository();

    expect((await firstValueFrom(repository.pauseOffer('offer-1'))).status).toBe('paused');
    expect((await firstValueFrom(repository.resumeOffer('offer-1'))).status).toBe('active');
    const changed = await firstValueFrom(
      repository.updateOffer('offer-2', buildOfferDraftFields({ title: 'عرض جديد' })),
    );
    expect(changed.title).toBe('عرض جديد');
    expect((await firstValueFrom(repository.getOffer('offer-2'))).title).toBe('عرض جديد');
    await firstValueFrom(repository.deleteOffer('offer-3'), { defaultValue: undefined });

    const ids = (await firstValueFrom(repository.getCatalog())).items.map((offer) => offer.id);
    expect(ids).toEqual(['offer-1', 'offer-2']);
  });

  it('stores a blank description as null', async () => {
    const offer = await firstValueFrom(
      createRepository().createOffer(buildOfferDraftFields({ description: '' })),
    );

    expect(offer.description).toBeNull();
  });

  it('keeps the saved picture unless it was removed', async () => {
    const repository = createRepository();

    const kept = await firstValueFrom(repository.updateOffer('offer-1', buildOfferDraftFields()));
    expect(kept.imageUrl).toBe('/assets/images/offer-winter-clothes.jpg');
    const removed = await firstValueFrom(
      repository.updateOffer('offer-1', buildOfferDraftFields({ isImageRemoved: true })),
    );
    expect(removed.imageUrl).toBeNull();
  });
});
