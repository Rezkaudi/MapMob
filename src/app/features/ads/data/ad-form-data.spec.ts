import { buildAdDraft } from '../testing/ad-fixture';
import { toAdFormData } from './ad-form-data';

describe('toAdFormData', () => {
  it('sends every field and the picked media', () => {
    const media = new File(['x'], 'summer-promo-ad.jpg', { type: 'image/jpeg' });
    const data = toAdFormData(buildAdDraft({ media }));

    expect(
      Object.fromEntries([...data.entries()].filter(([, value]) => typeof value === 'string')),
    ).toEqual({
      title: 'حملة الصيف لصيدلية الحياة',
      advertiserType: 'place',
      placeId: 'place-3',
      contentType: 'image',
      text: 'خصم 25% على جميع منتجات العناية بالبشرة.',
      placement: 'home',
      position: 'topBanner',
      startsOn: '2026-10-15',
      endsOn: '2026-10-30',
      priority: '5',
      status: 'active',
      isMediaRemoved: 'false',
    });
    expect((data.get('media') as File).name).toBe('summer-promo-ad.jpg');
  });

  it('leaves out the store of an app ad, the last day of an ongoing ad, and media not picked', () => {
    const data = toAdFormData(
      buildAdDraft({ advertiserType: 'admin', placeId: 'place-3', endsOn: null }),
    );

    expect(data.has('placeId')).toBe(false);
    expect(data.has('endsOn')).toBe(false);
    expect(data.has('media')).toBe(false);
  });
});
