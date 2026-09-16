import { buildAd, buildAdDetail } from '../testing/ad-fixture';
import { toAdDraft, toAdFormValue } from './ad-draft-mapping';

describe('toAdFormValue', () => {
  it('fills the form from a saved ad, ticking "بدون تاريخ انتهاء" when it never ends', () => {
    expect(toAdFormValue(buildAdDetail())).toEqual({
      title: 'حملة الصيف لصيدلية الحياة',
      advertiserType: 'place',
      placeId: 'place-3',
      contentType: 'image',
      text: 'خصم 25% على جميع منتجات العناية بالبشرة والمستلزمات الصيفية طوال الشهر الحالي في جميع الفروع.',
      placement: 'home',
      position: 'topBanner',
      startsOn: '2024-01-12',
      endsOn: '2024-01-26',
      isOngoing: false,
      priority: 5,
      status: 'active',
    });

    const ongoing = buildAdDetail({
      ad: buildAd({ endsOn: null, status: 'paused' }),
      placeId: null,
    });
    expect(toAdFormValue(ongoing)).toMatchObject({
      endsOn: null,
      isOngoing: true,
      status: 'paused',
      placeId: '',
    });
  });
});

describe('toAdDraft', () => {
  const value = toAdFormValue(buildAdDetail());

  it('drops the last day of an ongoing ad and the store of an app ad', () => {
    const draft = toAdDraft(
      { ...value, title: '  حملة ', isOngoing: true, advertiserType: 'admin' },
      { media: null, hadSavedMedia: false, status: 'draft' },
    );

    expect(draft).toMatchObject({
      title: 'حملة',
      endsOn: null,
      placeId: null,
      status: 'draft',
      isMediaRemoved: false,
    });
  });

  it('sends the picked media, and marks saved media removed when it is gone', () => {
    const file = new File(['x'], 'ad.png', { type: 'image/png' });
    const media = {
      file,
      name: 'ad.png',
      previewUrl: 'blob:1',
      sizeInBytes: 1,
      width: null,
      height: null,
    };

    expect(toAdDraft(value, { media, hadSavedMedia: true, status: 'active' }).media).toBe(file);
    expect(
      toAdDraft(value, { media: null, hadSavedMedia: true, status: 'active' }).isMediaRemoved,
    ).toBe(true);
  });
});
