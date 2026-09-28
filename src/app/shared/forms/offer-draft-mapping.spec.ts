import { toOfferDraftFields, toOfferFieldsValue } from './offer-draft-mapping';

const SAVED = {
  title: 'خصم الخريف',
  discountPercent: 30,
  startsOn: '2026-09-01',
  endsOn: '2026-09-15',
  status: 'scheduled' as const,
  description: 'على كل شيء.',
  scope: 'selectedItems' as const,
  itemIds: ['a', 'b'],
};

describe('toOfferFieldsValue', () => {
  it('fills the form from a saved offer, keeping "متوقف" and treating anything else as "نشط"', () => {
    expect(toOfferFieldsValue(SAVED)).toEqual({ ...SAVED, status: 'active' });
    expect(toOfferFieldsValue({ ...SAVED, status: 'paused' }).status).toBe('paused');
  });

  it('shows a description saved as null as an empty box', () => {
    expect(toOfferFieldsValue({ ...SAVED, description: null }).description).toBe('');
  });
});

describe('toOfferDraftFields', () => {
  const value = toOfferFieldsValue(SAVED);

  it('trims the text and carries the picked picture and the saved status', () => {
    const file = new File(['x'], 'offer.png', { type: 'image/png' });
    const image = {
      file,
      name: 'offer.png',
      previewUrl: 'blob:1',
      sizeInBytes: 1,
      width: 1,
      height: 1,
    };

    expect(
      toOfferDraftFields(
        { ...value, title: '  خصم  ', description: ' نص ' },
        { image, hadSavedImage: false, status: 'draft' },
      ),
    ).toEqual({
      title: 'خصم',
      discountPercent: 30,
      startsOn: '2026-09-01',
      endsOn: '2026-09-15',
      status: 'draft',
      description: 'نص',
      scope: 'selectedItems',
      itemIds: ['a', 'b'],
      image: file,
      isImageRemoved: false,
    });
  });

  it('marks a saved picture as removed only when it was there and is gone now', () => {
    const removed = (hadSavedImage: boolean) =>
      toOfferDraftFields(value, { image: null, hadSavedImage, status: 'active' }).isImageRemoved;

    expect(removed(true)).toBe(true);
    expect(removed(false)).toBe(false);
  });
});
