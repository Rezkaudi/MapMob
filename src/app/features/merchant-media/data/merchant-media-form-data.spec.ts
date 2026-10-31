import { toMediaReplaceFormData, toNewMediaFormData } from './merchant-media-form-data';

const PICTURE = new File(['x'], 'front.jpg', { type: 'image/jpeg' });

describe('toNewMediaFormData', () => {
  it('sends the kind as type, and the file', () => {
    const data = toNewMediaFormData({ kind: 'image', file: PICTURE, isMain: true });

    expect(data.get('type')).toBe('image');
    expect(data.get('file')).toBe(PICTURE);
  });
});

describe('toMediaReplaceFormData', () => {
  it('goes as a PUT through POST with the new file and its kind', () => {
    const data = toMediaReplaceFormData(PICTURE);

    expect(data.get('_method')).toBe('PUT');
    expect(data.get('type')).toBe('image');
    expect(data.get('file')).toBe(PICTURE);
  });
});
