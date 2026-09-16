import { buildAd, buildAdDetail, buildAdDraft } from '../testing/ad-fixture';
import { AdMockDatabase } from './ad-mock-database';

const FIRST = buildAdDetail();
const SECOND = buildAdDetail({ ad: buildAd({ id: 'a9' }) });

describe('AdMockDatabase', () => {
  it('lists the ads, finds one in detail and deletes one', () => {
    const database = new AdMockDatabase([FIRST, SECOND]);

    expect(database.listAds()).toEqual([FIRST.ad, SECOND.ad]);
    expect(database.find('a9')).toEqual(SECOND);
    database.remove('ad-2');
    expect(database.listAds()).toEqual([SECOND.ad]);
  });

  it('throws a readable error for an ad that is not there', () => {
    expect(() => new AdMockDatabase([]).find('missing')).toThrowError('لم يتم العثور على الإعلان');
  });

  it('adds an ad at the top with the status its days give it and its store name', () => {
    const database = new AdMockDatabase([FIRST]);

    const ad = database.create(buildAdDraft(), 'صيدلية الحياة', '2026-10-01');

    expect(database.listAds()[0]).toEqual(ad);
    expect(ad).toMatchObject({
      title: 'حملة الصيف لصيدلية الحياة',
      placeName: 'صيدلية الحياة',
      status: 'scheduled',
    });
    expect(database.find(ad.id)).toMatchObject({ placeId: 'place-3', position: 'topBanner' });
  });

  it('keeps an app ad without a store, and a paused ad or a draft as saved', () => {
    const database = new AdMockDatabase([]);

    const appAd = database.create(
      buildAdDraft({ advertiserType: 'admin', status: 'paused' }),
      null,
      '2026-10-20',
    );

    expect(appAd).toMatchObject({ placeName: null, status: 'paused' });
    expect(database.find(appAd.id).placeId).toBeNull();
  });

  it('updates an ad in place, keeping its media unless it was removed', () => {
    const database = new AdMockDatabase([{ ...FIRST, mediaUrl: 'https://cdn.test/ad.jpg' }]);

    const ad = database.update(
      'ad-2',
      buildAdDraft({ title: 'عنوان جديد', endsOn: null }),
      'صيدلية الحياة',
      '2026-10-20',
    );

    expect(ad).toMatchObject({ id: 'ad-2', title: 'عنوان جديد', endsOn: null, status: 'active' });
    expect(database.find('ad-2').mediaUrl).toBe('https://cdn.test/ad.jpg');
    database.update('ad-2', buildAdDraft({ isMediaRemoved: true }), 'صيدلية الحياة', '2026-10-20');
    expect(database.find('ad-2').mediaUrl).toBeNull();
  });
});
