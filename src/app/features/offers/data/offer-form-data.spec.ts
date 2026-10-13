import { buildOfferDraft } from '../testing/offer-fixture';
import { toOfferFormData } from './offer-form-data';

describe('toOfferFormData', () => {
  it('sends the fields under the server names, with the one title in both languages', () => {
    const image = new File(['x'], 'offer.png', { type: 'image/png' });
    const data = toOfferFormData(
      buildOfferDraft({ placeId: '4', itemIds: ['9'], image, description: 'خصم كبير' }),
    );

    expect(Object.fromEntries([...data.entries()].filter(([name]) => name !== 'image'))).toEqual({
      store_id: '4',
      product_id: '9',
      'title[ar]': 'خصم 30% على جميع المنتجات',
      'title[en]': 'خصم 30% على جميع المنتجات',
      'description[ar]': 'خصم كبير',
      'description[en]': 'خصم كبير',
      discount_percentage: '30',
      starts_at: '2026-09-01',
      ends_at: '2026-09-30',
      status: 'active',
    });
    expect((data.get('image') as File).name).toBe('offer.png');
  });

  it('sends the first picked item only, since the server keeps one product per offer', () => {
    const data = toOfferFormData(buildOfferDraft({ itemIds: ['9', '12'] }));

    expect(data.getAll('product_id')).toEqual(['9']);
  });

  it('sends an empty product when the offer covers everything, and no picture when none was picked', () => {
    const data = toOfferFormData(buildOfferDraft({ scope: 'allItems', itemIds: ['9'] }));

    expect(data.get('product_id')).toBe('');
    expect(data.has('image')).toBe(false);
  });

  it('saves a paused offer under the status the server keeps', () => {
    expect(toOfferFormData(buildOfferDraft({ status: 'paused' })).get('status')).toBe('inactive');
  });

  it('saves a draft as a stopped offer, since the server keeps no drafts', () => {
    expect(toOfferFormData(buildOfferDraft({ status: 'draft' })).get('status')).toBe('inactive');
  });
});
