import { toStoryFormData } from './merchant-stories-form-data';

const PICTURE = new File(['x'], 'serum.jpg', { type: 'image/jpeg' });

describe('toStoryFormData', () => {
  it('sends the file and the text', () => {
    const data = toStoryFormData({ file: PICTURE, caption: 'وصول دفعة جديدة' });

    expect(data.get('file')).toBe(PICTURE);
    expect(data.get('caption')).toBe('وصول دفعة جديدة');
  });

  it('leaves out a text the owner did not write', () => {
    expect(toStoryFormData({ file: PICTURE, caption: null }).has('caption')).toBe(false);
  });

  it('leaves out the file when an edit keeps the saved one', () => {
    const data = toStoryFormData({ file: null, caption: 'نص جديد' });

    expect(data.has('file')).toBe(false);
    expect(data.get('caption')).toBe('نص جديد');
  });
});
