import { buildAd } from '../testing/ad-fixture';
import { filterAds, queryAds } from './ad-mock-query';

const WINTER = buildAd({
  id: 'a1',
  title: 'خصم الشتاء',
  placeName: 'ألبسة الفاخر',
  startsOn: '2026-09-01',
  endsOn: '2026-09-15',
});
const PHARMACY = buildAd({
  id: 'a2',
  title: 'حملة الصيف',
  placeName: 'صيدلية الحياة',
  contentType: 'video',
  placement: 'searchResults',
  status: 'scheduled',
  startsOn: '2026-10-01',
  endsOn: '2026-10-20',
});
const PLATFORM = buildAd({
  id: 'a3',
  title: 'تطبيق جديد',
  advertiserType: 'admin',
  placeName: null,
  status: 'paused',
  startsOn: '2026-06-01',
  endsOn: null,
});
const ADS = [WINTER, PHARMACY, PLATFORM];
const FIRST_PAGE = { pageIndex: 0, pageSize: 4 };

describe('queryAds', () => {
  it('pages the ads', () => {
    expect(queryAds(ADS, { pageIndex: 1, pageSize: 2 })).toEqual({
      items: [PLATFORM],
      totalCount: 3,
    });
  });

  it('searches the ad title and the store name', () => {
    expect(queryAds(ADS, { ...FIRST_PAGE, search: 'الشتاء' }).items).toEqual([WINTER]);
    expect(queryAds(ADS, { ...FIRST_PAGE, search: ' الحياة ' }).items).toEqual([PHARMACY]);
  });

  it('filters by status, content type, advertiser and placement', () => {
    expect(queryAds(ADS, { ...FIRST_PAGE, status: 'paused' }).items).toEqual([PLATFORM]);
    expect(queryAds(ADS, { ...FIRST_PAGE, contentType: 'video' }).items).toEqual([PHARMACY]);
    expect(queryAds(ADS, { ...FIRST_PAGE, advertiserType: 'admin' }).items).toEqual([PLATFORM]);
    expect(queryAds(ADS, { ...FIRST_PAGE, placement: 'home' }).items).toEqual([WINTER, PLATFORM]);
  });

  it('keeps the ads that run on a day of the range, an ongoing ad for any day after it starts', () => {
    expect(
      queryAds(ADS, { ...FIRST_PAGE, runningFrom: '2026-09-10', runningTo: '2026-09-12' }).items,
    ).toEqual([WINTER, PLATFORM]);
    expect(queryAds(ADS, { ...FIRST_PAGE, runningTo: '2026-05-31' }).items).toEqual([]);
  });

  it('sorts by start day or by title', () => {
    const idsFor = (sort: 'newest' | 'name') =>
      queryAds(ADS, { ...FIRST_PAGE, sort }).items.map((ad) => ad.id);

    expect(idsFor('newest')).toEqual(['a2', 'a1', 'a3']);
    expect(idsFor('name')).toEqual(['a3', 'a2', 'a1']);
  });
});

describe('filterAds', () => {
  it('returns every match, not just one page', () => {
    expect(filterAds(ADS, { pageIndex: 0, pageSize: 1 })).toHaveLength(3);
  });
});
