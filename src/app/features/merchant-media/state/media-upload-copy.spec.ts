import { MEDIA_UPLOAD_COPY } from './media-upload-copy';

describe('MEDIA_UPLOAD_COPY', () => {
  it("writes the frame's picture copy", () => {
    expect(MEDIA_UPLOAD_COPY.image).toEqual({
      fieldLabel: 'رفع الصور',
      prompt: 'اسحب وأفلت الصور هنا',
      hint: 'الحد الأقصى لحجم الصورة 5 ميجابايت (JPG, PNG)',
    });
  });

  it('writes the same lines for a video', () => {
    expect(MEDIA_UPLOAD_COPY.video).toEqual({
      fieldLabel: 'رفع الفيديو',
      prompt: 'اسحب وأفلت الفيديو هنا',
      hint: 'الحد الأقصى لحجم الفيديو 50 ميجابايت',
    });
  });
});
