import { buildOfferDraft } from '../testing/offer-fixture';
import { toOfferFormData } from './offer-form-data';

describe('toOfferFormData', () => {
  it('sends every field, one entry per picked item, and the picture', () => {
    const image = new File(['x'], 'offer.png', { type: 'image/png' });
    const data = toOfferFormData(buildOfferDraft({ itemIds: ['a', 'b'], image, description: '' }));

    expect(data.get('title')).toBe('خصم 30% على جميع المنتجات');
    expect(data.get('discountPercent')).toBe('30');
    expect(data.get('placeId')).toBe('place-7');
    expect(data.get('categoryName')).toBe('ألبسة');
    expect([data.get('startsOn'), data.get('endsOn')]).toEqual(['2026-09-01', '2026-09-30']);
    expect(data.get('status')).toBe('active');
    expect(data.get('description')).toBe('');
    expect(data.get('scope')).toBe('selectedItems');
    expect(data.getAll('itemIds')).toEqual(['a', 'b']);
    expect((data.get('image') as File).name).toBe('offer.png');
    expect(data.get('isImageRemoved')).toBe('false');
  });

  it('leaves the items out when the offer covers everything, and sends no picture when none was picked', () => {
    const data = toOfferFormData(buildOfferDraft({ scope: 'allItems', itemIds: ['a'] }));

    expect(data.getAll('itemIds')).toEqual([]);
    expect(data.has('image')).toBe(false);
  });
});
