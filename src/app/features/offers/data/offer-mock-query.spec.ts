import { buildOffer } from '../testing/offer-fixture';
import { filterOffers, queryOffers } from './offer-mock-query';

const WINTER = buildOffer({
  id: 'o1',
  title: 'خصم 30% على جميع الأزياء الشتوية',
  placeName: 'ألبسة الفاخر',
  startsOn: '2026-09-01',
  endsOn: '2026-09-15',
  status: 'active',
});
const PHARMACY = buildOffer({
  id: 'o2',
  title: 'عرض الصيف على المستحضرات',
  placeName: 'صيدلية الحياة',
  startsOn: '2026-10-01',
  endsOn: '2026-10-20',
  status: 'scheduled',
});
const COFFEE = buildOffer({
  id: 'o3',
  title: 'قهوة مجانية مع كل وجبة',
  placeName: 'مقهى الزاوية',
  startsOn: '2026-06-01',
  endsOn: '2026-06-30',
  status: 'expired',
});
const GYM = buildOffer({
  id: 'o4',
  title: 'اشتراك شهر مجاني',
  placeName: 'نادي القوة',
  startsOn: '2026-08-20',
  endsOn: '2026-09-30',
  status: 'paused',
});
const OFFERS = [WINTER, PHARMACY, COFFEE, GYM];
const FIRST_PAGE = { pageIndex: 0, pageSize: 4 };

describe('queryOffers', () => {
  it('pages the offers', () => {
    expect(queryOffers(OFFERS, { pageIndex: 1, pageSize: 3 })).toEqual({
      items: [GYM],
      totalCount: 4,
    });
  });

  it('searches the offer title and the place name', () => {
    expect(queryOffers(OFFERS, { ...FIRST_PAGE, search: 'الشتوية' }).items).toEqual([WINTER]);
    expect(queryOffers(OFFERS, { ...FIRST_PAGE, search: ' الزاوية ' }).items).toEqual([COFFEE]);
  });

  it('filters by status', () => {
    expect(queryOffers(OFFERS, { ...FIRST_PAGE, status: 'paused' }).items).toEqual([GYM]);
  });

  it('keeps the offers that run on at least one day of the range', () => {
    const running = (runningFrom?: string, runningTo?: string) =>
      queryOffers(OFFERS, { ...FIRST_PAGE, runningFrom, runningTo }).items;

    expect(running('2026-09-10', '2026-09-12')).toEqual([WINTER, GYM]);
    expect(running('2026-09-16')).toEqual([PHARMACY, GYM]);
    expect(running(undefined, '2026-06-01')).toEqual([COFFEE]);
  });

  it('sorts by start day or by title', () => {
    const titlesFor = (sort: 'newest' | 'oldest' | 'name') =>
      queryOffers(OFFERS, { ...FIRST_PAGE, sort }).items.map((offer) => offer.id);

    expect(titlesFor('newest')).toEqual(['o2', 'o1', 'o4', 'o3']);
    expect(titlesFor('oldest')).toEqual(['o3', 'o4', 'o1', 'o2']);
    expect(titlesFor('name')).toEqual(['o4', 'o1', 'o2', 'o3']);
  });
});

describe('filterOffers', () => {
  it('returns every match, not just one page', () => {
    expect(filterOffers(OFFERS, { pageIndex: 0, pageSize: 1, search: 'خصم' })).toEqual([WINTER]);
    expect(filterOffers(OFFERS, { pageIndex: 0, pageSize: 1 })).toHaveLength(4);
  });
});
