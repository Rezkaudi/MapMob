import { buildOfferDetail } from '../testing/offer-fixture';
import { toOfferDraft, toOfferFormValue } from './offer-draft-mapping';

describe('toOfferFormValue', () => {
  it('fills the form from a saved offer, keeping "متوقف" and treating anything else as "نشط"', () => {
    const detail = buildOfferDetail();

    expect(toOfferFormValue(detail)).toEqual({
      title: 'خصم 30% على جميع الأزياء الشتوية',
      discountPercent: 30,
      placeId: 'place-7',
      categoryName: 'ألبسة',
      startsOn: '2026-09-01',
      endsOn: '2026-09-15',
      status: 'active',
      description: 'احصل على خصم فوري بنسبة 30 % على كامل تشكيلة الشتاء لعام 2026.',
      scope: 'selectedItems',
      itemIds: ['place-7-item-1', 'place-7-item-2'],
    });
    expect(
      toOfferFormValue({ ...detail, offer: { ...detail.offer, status: 'paused' } }).status,
    ).toBe('paused');
  });
});

describe('toOfferDraft', () => {
  const value = toOfferFormValue(buildOfferDetail());

  it('turns the form into a draft with the picked picture and the saved status', () => {
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
      toOfferDraft(
        { ...value, title: '  خصم  ' },
        { image, hadSavedImage: false, status: 'draft' },
      ),
    ).toMatchObject({ title: 'خصم', status: 'draft', image: file, isImageRemoved: false });
  });

  it('marks a saved picture as removed only when it was there and is gone now', () => {
    expect(
      toOfferDraft(value, { image: null, hadSavedImage: true, status: 'active' }).isImageRemoved,
    ).toBe(true);
    expect(
      toOfferDraft(value, { image: null, hadSavedImage: false, status: 'active' }).isImageRemoved,
    ).toBe(false);
  });
});
