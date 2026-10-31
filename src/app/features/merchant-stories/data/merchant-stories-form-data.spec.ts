import { toNewStoryFormData, toStoryUpdateFormData } from './merchant-stories-form-data';

const PICTURE = new File(['x'], 'serum.jpg', { type: 'image/jpeg' });
const VIDEO = new File(['x'], 'clip.mp4', { type: 'video/mp4' });

describe('toNewStoryFormData', () => {
  it('sends the file, its kind and the text', () => {
    const data = toNewStoryFormData({ file: PICTURE, caption: 'وصول دفعة جديدة' });

    expect(data.get('file')).toBe(PICTURE);
    expect(data.get('type')).toBe('image');
    expect(data.get('caption')).toBe('وصول دفعة جديدة');
  });

  it('names a video file as a video', () => {
    expect(toNewStoryFormData({ file: VIDEO, caption: null }).get('type')).toBe('video');
  });

  it('leaves out a text the owner did not write', () => {
    expect(toNewStoryFormData({ file: PICTURE, caption: null }).has('caption')).toBe(false);
  });
});

describe('toStoryUpdateFormData', () => {
  it('goes as a PUT through POST and leaves out the file when the edit keeps it', () => {
    const data = toStoryUpdateFormData({ file: null, caption: 'نص جديد' });

    expect(data.get('_method')).toBe('PUT');
    expect(data.has('file')).toBe(false);
    expect(data.has('type')).toBe(false);
    expect(data.get('caption')).toBe('نص جديد');
  });

  it('sends an empty text to clear a removed one', () => {
    expect(toStoryUpdateFormData({ file: PICTURE, caption: null }).get('caption')).toBe('');
  });
});
