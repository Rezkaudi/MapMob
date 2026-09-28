import { toOfferDraftFormData } from './offer-draft-form-data';

const DRAFT = {
  title: 'خصم 30% على جميع المنتجات',
  discountPercent: 30,
  startsOn: '2026-09-01',
  endsOn: '2026-09-30',
  status: 'active' as const,
  description: '',
  scope: 'selectedItems' as const,
  itemIds: ['a', 'b'],
  image: null,
  isImageRemoved: false,
};

describe('toOfferDraftFormData', () => {
  it('sends every field, one entry per picked item, and the picture', () => {
    const image = new File(['x'], 'offer.png', { type: 'image/png' });
    const data = toOfferDraftFormData({ ...DRAFT, image });

    expect(data.get('title')).toBe('خصم 30% على جميع المنتجات');
    expect(data.get('discountPercent')).toBe('30');
    expect([data.get('startsOn'), data.get('endsOn')]).toEqual(['2026-09-01', '2026-09-30']);
    expect(data.get('status')).toBe('active');
    expect(data.get('description')).toBe('');
    expect(data.get('scope')).toBe('selectedItems');
    expect(data.getAll('itemIds')).toEqual(['a', 'b']);
    expect((data.get('image') as File).name).toBe('offer.png');
    expect(data.get('isImageRemoved')).toBe('false');
  });

  it('leaves the items out when the offer covers everything, and sends no picture when none was picked', () => {
    const data = toOfferDraftFormData({ ...DRAFT, scope: 'allItems' });

    expect(data.getAll('itemIds')).toEqual([]);
    expect(data.has('image')).toBe(false);
  });
});
