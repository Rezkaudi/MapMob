import { toSavedMediaFiles } from './saved-media-files';

describe('toSavedMediaFiles', () => {
  it('shows a saved file by its url, with no file to upload', () => {
    const [saved] = toSavedMediaFiles(['assets/images/place-cover.jpg']);

    expect(saved).toEqual({
      id: 'assets/images/place-cover.jpg',
      name: 'place-cover.jpg',
      sizeInBytes: 0,
      file: null,
      previewUrl: 'assets/images/place-cover.jpg',
    });
  });

  it('skips urls that are empty', () => {
    expect(toSavedMediaFiles(['', 'assets/images/place-shelf.jpg'])).toHaveLength(1);
  });
});
