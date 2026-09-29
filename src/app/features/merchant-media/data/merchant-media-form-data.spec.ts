import { toMediaReplaceFormData, toNewMediaFormData } from './merchant-media-form-data';

const PICTURE = new File(['x'], 'front.jpg', { type: 'image/jpeg' });

describe('toNewMediaFormData', () => {
  it('sends the kind, the file and the main flag', () => {
    const data = toNewMediaFormData({ kind: 'image', file: PICTURE, isMain: true });

    expect(data.get('kind')).toBe('image');
    expect(data.get('file')).toBe(PICTURE);
    expect(data.get('isMain')).toBe('true');
  });
});

describe('toMediaReplaceFormData', () => {
  it('sends only the new file', () => {
    const data = toMediaReplaceFormData(PICTURE);

    expect(data.get('file')).toBe(PICTURE);
    expect([...data.keys()]).toEqual(['file']);
  });
});
