import { toUploadedImage } from './uploaded-image-from-url';

describe('toUploadedImage', () => {
  it('describes a saved file by the last part of its address, or nothing without one', () => {
    expect(toUploadedImage('https://cdn.test/offers/summer-promo.jpg')).toEqual({
      file: null,
      name: 'summer-promo.jpg',
      previewUrl: 'https://cdn.test/offers/summer-promo.jpg',
      sizeInBytes: null,
      width: null,
      height: null,
    });
    expect(toUploadedImage(null)).toBeNull();
  });
});
