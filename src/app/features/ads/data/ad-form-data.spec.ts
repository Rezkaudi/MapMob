import { buildAdDraft } from '../testing/ad-fixture';
import { toAdFormData } from './ad-form-data';

function textFieldsOf(data: FormData): Record<string, FormDataEntryValue> {
  return Object.fromEntries([...data.entries()].filter(([, value]) => typeof value === 'string'));
}

describe('toAdFormData', () => {
  it('sends the server field names and the picked media', () => {
    const media = new File(['x'], 'summer-promo-ad.jpg', { type: 'image/jpeg' });
    const data = toAdFormData(buildAdDraft({ media, placement: 'searchResults' }));

    expect(textFieldsOf(data)).toEqual({
      'title[ar]': 'حملة الصيف لصيدلية الحياة',
      'title[en]': 'حملة الصيف لصيدلية الحياة',
      'description[ar]': 'خصم 25% على جميع منتجات العناية بالبشرة.',
      'description[en]': 'خصم 25% على جميع منتجات العناية بالبشرة.',
      advertiser_type: 'store',
      store_id: 'place-3',
      placement: 'search',
      starts_at: '2026-10-15',
      ends_at: '2026-10-30',
      priority: '5',
      status: 'active',
      'media[0][type]': 'image',
      'media[0][sort_order]': '1',
    });
    expect((data.get('media[0][file]') as File).name).toBe('summer-promo-ad.jpg');
  });

  it('turns an ad into an app ad by sending an empty store', () => {
    const data = toAdFormData(buildAdDraft({ advertiserType: 'admin', placeId: 'place-3' }));

    expect(data.get('advertiser_type')).toBe('admin');
    expect(data.get('store_id')).toBe('');
  });

  it('leaves out the last day of an ongoing ad and media not picked', () => {
    const data = toAdFormData(buildAdDraft({ endsOn: null, text: '' }));

    expect(data.has('ends_at')).toBe(false);
    expect(data.has('description[ar]')).toBe(false);
    expect(data.has('media[0][file]')).toBe(false);
    expect(data.has('media[0][type]')).toBe(false);
  });

  it('saves a paused ad as inactive', () => {
    expect(toAdFormData(buildAdDraft({ status: 'paused' })).get('status')).toBe('inactive');
  });
});
