import { EMPTY_PRODUCT_DRAFT } from '../../../shared/models/empty-product-draft';
import { ProductDraft } from '../../../shared/models/product-draft';
import { toNewProductFormData, toProductUpdateFormData } from './merchant-product-form-data';

const DRAFT: ProductDraft = {
  ...EMPTY_PRODUCT_DRAFT,
  name: 'سيروم',
  price: 350,
  currency: 'USD',
  isAvailable: false,
};

describe('toNewProductFormData', () => {
  it('sends the fields as text, leaving out an empty order link and a missing picture', () => {
    const data = toNewProductFormData(DRAFT);

    expect(data.get('name')).toBe('سيروم');
    expect(data.get('price')).toBe('350');
    expect(data.get('currency')).toBe('USD');
    expect(data.get('isAvailable')).toBe('false');
    expect(data.has('orderUrl')).toBe(false);
    expect(data.has('image')).toBe(false);
    expect(data.has('isImageRemoved')).toBe(false);
  });

  it('sends the order link and the picked picture when there are some', () => {
    const picture = new File(['x'], 'serum.png', { type: 'image/png' });
    const data = toNewProductFormData({
      ...DRAFT,
      orderUrl: 'https://shop.example.com/serum',
      imageUrl: 'blob:serum',
      imageFile: picture,
    });

    expect(data.get('orderUrl')).toBe('https://shop.example.com/serum');
    expect((data.get('image') as File).name).toBe('serum.png');
  });
});

describe('toProductUpdateFormData', () => {
  it('asks to delete the saved picture when the dialog cleared it', () => {
    expect(toProductUpdateFormData(DRAFT).get('isImageRemoved')).toBe('true');
  });

  it('keeps the saved picture when the dialog still shows it', () => {
    const data = toProductUpdateFormData({ ...DRAFT, imageUrl: 'https://cdn.example.com/1.png' });

    expect(data.get('isImageRemoved')).toBe('false');
    expect(data.has('image')).toBe(false);
  });
});
