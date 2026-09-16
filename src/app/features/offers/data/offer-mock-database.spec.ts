import { buildOffer, buildOfferDetail, buildOfferDraft } from '../testing/offer-fixture';
import { OfferMockDatabase } from './offer-mock-database';

const TODAY = '2026-09-10';
const RUNNING = buildOfferDetail();
const PAUSED = buildOfferDetail({
  offer: buildOffer({ id: 'o3', startsOn: '2026-10-01', endsOn: '2026-10-09', status: 'paused' }),
});

function createDatabase(): OfferMockDatabase {
  return new OfferMockDatabase([RUNNING, PAUSED]);
}

describe('OfferMockDatabase', () => {
  it('lists the offers and finds one in detail', () => {
    const database = createDatabase();

    expect(database.listOffers()).toEqual([RUNNING.offer, PAUSED.offer]);
    expect(database.find('o3')).toEqual(PAUSED);
  });

  it('pauses an offer', () => {
    expect(createDatabase().pause('offer-2').status).toBe('paused');
  });

  it('resumes an offer into the status its days give it today', () => {
    const database = createDatabase();

    expect(database.resume('o3', TODAY).status).toBe('scheduled');
    expect(database.find('o3').offer.status).toBe('scheduled');
  });

  it('deletes an offer', () => {
    const database = createDatabase();

    database.remove('offer-2');

    expect(database.listOffers().map((offer) => offer.id)).toEqual(['o3']);
  });

  it('throws a readable error for an offer that is not there', () => {
    expect(() => createDatabase().find('missing')).toThrowError('لم يتم العثور على العرض');
  });

  it('adds an offer at the top with the status its days give it, and the store it belongs to', () => {
    const database = createDatabase();

    const offer = database.create(
      buildOfferDraft({ startsOn: '2026-09-20' }),
      RUNNING.place,
      TODAY,
    );

    expect(database.listOffers()[0]).toEqual(offer);
    expect(offer).toMatchObject({
      title: 'خصم 30% على جميع المنتجات',
      placeName: 'ألبسة الجمال',
      categoryName: 'ألبسة',
      status: 'scheduled',
    });
    expect(database.find(offer.id)).toMatchObject({
      discountPercent: 30,
      itemIds: ['place-7-item-1'],
    });
    expect(database.create(buildOfferDraft(), RUNNING.place, TODAY).id).not.toBe(offer.id);
  });

  it('keeps a paused offer or a draft as saved, and drops the items of an offer on everything', () => {
    const database = createDatabase();

    expect(
      database.create(buildOfferDraft({ status: 'paused' }), RUNNING.place, TODAY).status,
    ).toBe('paused');
    const draft = database.create(
      buildOfferDraft({ status: 'draft', scope: 'allItems' }),
      RUNNING.place,
      TODAY,
    );
    expect(draft.status).toBe('draft');
    expect(database.find(draft.id).itemIds).toEqual([]);
  });

  it('updates an offer in place, keeping its picture unless it was removed', () => {
    const database = new OfferMockDatabase([{ ...RUNNING, imageUrl: 'https://cdn.test/a.png' }]);

    const offer = database.update(
      'offer-2',
      buildOfferDraft({ title: 'عنوان جديد' }),
      RUNNING.place,
      TODAY,
    );

    expect(offer).toMatchObject({ id: 'offer-2', title: 'عنوان جديد', status: 'active' });
    expect(database.find('offer-2').imageUrl).toBe('https://cdn.test/a.png');

    database.update('offer-2', buildOfferDraft({ isImageRemoved: true }), RUNNING.place, TODAY);
    expect(database.find('offer-2').imageUrl).toBeNull();
  });
});
