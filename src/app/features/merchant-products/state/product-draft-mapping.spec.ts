import { buildMerchantProduct } from '../testing/merchant-product-fixture';
import { toProductDraft } from './product-draft-mapping';

describe('toProductDraft', () => {
  it('fills the dialog from a saved product, with empty text for missing links and pictures', () => {
    expect(toProductDraft(buildMerchantProduct())).toEqual({
      name: 'مرطب dove',
      price: 200,
      currency: 'SYP',
      isAvailable: true,
      imageUrl: '',
      imageFile: null,
      orderUrl: '',
    });
  });

  it('keeps the saved picture and link', () => {
    const draft = toProductDraft(
      buildMerchantProduct({ imageUrl: 'https://cdn.example.com/1.png', orderUrl: 'https://x.y' }),
    );

    expect(draft.imageUrl).toBe('https://cdn.example.com/1.png');
    expect(draft.orderUrl).toBe('https://x.y');
  });
});
