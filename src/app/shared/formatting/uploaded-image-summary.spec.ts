import { describeUploadedImage } from './uploaded-image-summary';

describe('describeUploadedImage', () => {
  it('writes the size and the pixel size, as the ad form does', () => {
    expect(
      describeUploadedImage({ sizeInBytes: 1.4 * 1024 * 1024, width: 1200, height: 630 }),
    ).toBe('الحجم: 1.4 ميجابايت — الأبعاد: 1200 × 630 بكسل');
  });

  it('leaves out whatever is not known', () => {
    expect(describeUploadedImage({ sizeInBytes: 2048, width: null, height: null })).toBe(
      'الحجم: 2.0 كيلوبايت',
    );
    expect(describeUploadedImage({ sizeInBytes: null, width: null, height: null })).toBe('');
  });
});
