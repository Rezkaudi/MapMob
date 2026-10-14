import {
  toLiveDeliveryLinkBody,
  toLiveMediaForm,
  toLiveProductForm,
  toLiveWorkingHourBody,
} from './live-place-parts';

const PRODUCT = {
  id: 'a1b2c3d4-0000',
  name: 'بانادول',
  price: 2500,
  currency: 'SYP' as const,
  imageUrl: '',
  isAvailable: false,
  orderUrl: '',
  imageFile: null,
};

describe('live place parts', () => {
  it('numbers the week from Sunday, as the server does', () => {
    expect(
      toLiveWorkingHourBody({ day: 'الأحد', isOpen: true, opensAt: '09:00', closesAt: '18:00' }),
    ).toEqual({ day_of_week: 0, is_open: true, open_time: '09:00', close_time: '18:00' });
    expect(
      toLiveWorkingHourBody({ day: 'السبت', isOpen: false, opensAt: '09:00', closesAt: '18:00' })
        .day_of_week,
    ).toBe(6);
  });

  it('writes a new product with a slug of its own, under the place category', () => {
    const form = toLiveProductForm(PRODUCT, '52', '8', 'create');

    expect(form.get('store_id')).toBe('52');
    expect(form.get('category_id')).toBe('8');
    expect(form.get('name[ar]')).toBe('بانادول');
    expect(form.get('slug')).toBe('بانادول-52-a1b2c3d4');
    expect(form.get('price')).toBe('2500');
    expect(form.get('currency_code')).toBe('SYP');
    expect(form.get('status')).toBe('inactive');
    expect(form.has('image')).toBe(false);
  });

  it('updates a product with PUT inside a POST, keeping its slug, and sends a new picture', () => {
    const picture = new File(['x'], 'p.png', { type: 'image/png' });
    const form = toLiveProductForm({ ...PRODUCT, imageFile: picture }, '52', '8', 'update');

    expect(form.get('_method')).toBe('PUT');
    expect(form.has('slug')).toBe(false);
    expect(form.get('image')).toBe(picture);
  });

  it('writes one picture or video for the gallery', () => {
    const file = new File(['x'], 'v.mp4', { type: 'video/mp4' });
    const form = toLiveMediaForm(file, 'video', 2);

    expect(form.get('type')).toBe('video');
    expect(form.get('media')).toBe(file);
    expect(form.get('sort_order')).toBe('2');
  });

  it('writes a delivery link by the id of the admin platform', () => {
    expect(toLiveDeliveryLinkBody('3', 'https://talabat.com/x', 1)).toEqual({
      delivery_platform_id: '3',
      url: 'https://talabat.com/x',
      is_active: true,
      sort_order: 1,
    });
  });
});
