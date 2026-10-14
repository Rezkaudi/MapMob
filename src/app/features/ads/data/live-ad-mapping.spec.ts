import { LiveAd } from './live-ad';
import { toAd, toAdDetail, toAdSummary } from './live-ad-mapping';

const TODAY = '2026-10-14';
const IMAGE_MEDIA = { id: 1, type: 'image', url: 'https://api.test/storage/ads/1.jpg', sort_order: 1 };
const LIVE_AD: LiveAd = {
  id: 1,
  advertiser_type: 'store',
  store: { id: 1, name: 'متجر دمشق المركزي' },
  title: 'اعلان',
  description: 'نص الاعلان',
  placement: 'home',
  starts_at: '2026-09-22T00:00:00.000000Z',
  ends_at: '2026-12-22T00:00:00.000000Z',
  priority: 10,
  status: 'active',
  views_count: 120,
  clicks_count: 6,
  media: [IMAGE_MEDIA],
  created_at: '2026-09-22T19:03:07.000000Z',
  updated_at: '2026-10-13T17:11:03.000000Z',
};

describe('toAd', () => {
  it('turns a store ad into a table row', () => {
    expect(toAd(LIVE_AD, TODAY)).toEqual({
      id: '1',
      title: 'اعلان',
      advertiserType: 'place',
      placeName: 'متجر دمشق المركزي',
      contentType: 'image',
      placement: 'home',
      priority: 5,
      startsOn: '2026-09-22',
      endsOn: '2026-12-22',
      status: 'active',
    });
  });

  it('reads an ad with no store as the team own ad', () => {
    const ad = toAd({ ...LIVE_AD, advertiser_type: 'admin', store: null }, TODAY);

    expect(ad.advertiserType).toBe('admin');
    expect(ad.placeName).toBeNull();
  });

  it('reads the server placement words', () => {
    expect(toAd({ ...LIVE_AD, placement: 'search' }, TODAY).placement).toBe('searchResults');
    expect(toAd({ ...LIVE_AD, placement: 'category' }, TODAY).placement).toBe('categories');
    expect(toAd({ ...LIVE_AD, placement: 'store' }, TODAY).placement).toBe('placeDetails');
  });

  it('shows a placement the panel does not know as the home page', () => {
    expect(toAd({ ...LIVE_AD, placement: 'map' }, TODAY).placement).toBe('home');
  });

  it('reads a pause answer that leaves out the media and the counts', () => {
    const paused: LiveAd = {
      ...LIVE_AD,
      status: 'inactive',
      media: undefined,
      views_count: undefined,
    };

    expect(toAd(paused, TODAY).contentType).toBe('image');
    expect(toAdDetail(paused, TODAY).metrics.impressions).toBe(0);
  });

  it('keeps the priority inside 1 to 5', () => {
    expect(toAd({ ...LIVE_AD, priority: 0 }, TODAY).priority).toBe(1);
    expect(toAd({ ...LIVE_AD, priority: 3 }, TODAY).priority).toBe(3);
  });

  it('reads a video ad and an ad that never ends', () => {
    const ad = toAd(
      { ...LIVE_AD, ends_at: null, media: [{ ...IMAGE_MEDIA, type: 'video' }] },
      TODAY,
    );

    expect(ad.contentType).toBe('video');
    expect(ad.endsOn).toBeNull();
  });

  it('works out the status from the server status and the days', () => {
    expect(toAd({ ...LIVE_AD, status: 'inactive' }, TODAY).status).toBe('paused');
    expect(toAd({ ...LIVE_AD, status: 'expired' }, TODAY).status).toBe('expired');
    expect(toAd({ ...LIVE_AD, starts_at: '2026-11-01T00:00:00.000000Z' }, TODAY).status).toBe(
      'scheduled',
    );
    expect(toAd({ ...LIVE_AD, ends_at: '2026-10-01T00:00:00.000000Z' }, TODAY).status).toBe(
      'expired',
    );
  });
});

describe('toAdDetail', () => {
  it('adds the text, the media, the days and the counts', () => {
    expect(toAdDetail(LIVE_AD, TODAY)).toEqual({
      ad: toAd(LIVE_AD, TODAY),
      placeId: '1',
      position: 'topBanner',
      text: 'نص الاعلان',
      mediaUrl: 'https://api.test/storage/ads/1.jpg',
      createdOn: '2026-09-22',
      updatedOn: '2026-10-13',
      updatedBy: 'Admin',
      metrics: { impressions: 120, clicks: 6, uniqueUsers: 0 },
    });
  });

  it('reads an ad with no text and no media', () => {
    const detail = toAdDetail({ ...LIVE_AD, description: null, media: [], store: null }, TODAY);

    expect(detail.text).toBe('');
    expect(detail.mediaUrl).toBeNull();
    expect(detail.placeId).toBeNull();
  });
});

describe('toAdSummary', () => {
  it('maps the four counts', () => {
    expect(toAdSummary({ total: 9, active: 4, upcoming: 3, expired: 2 })).toEqual({
      totalCount: 9,
      activeCount: 4,
      scheduledCount: 3,
      endedCount: 2,
    });
  });
});
