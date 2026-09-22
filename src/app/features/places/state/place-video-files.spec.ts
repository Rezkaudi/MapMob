import { toSavedVideoFiles } from './place-video-files';

const VIDEO = {
  id: 'video-1',
  url: 'assets/videos/place-tour.mp4',
  posterUrl: 'assets/images/place-cover.jpg',
  duration: '01:24',
};

describe('toSavedVideoFiles', () => {
  it('shows a saved video by its url, with its still frame as the poster', () => {
    expect(toSavedVideoFiles([VIDEO])).toEqual([
      {
        id: 'video-1',
        name: 'place-tour.mp4',
        sizeInBytes: 0,
        file: null,
        previewUrl: 'assets/videos/place-tour.mp4',
        posterUrl: 'assets/images/place-cover.jpg',
      },
    ]);
  });

  it('falls back to the still frame when the video has no url yet', () => {
    const [saved] = toSavedVideoFiles([{ ...VIDEO, url: '' }]);

    expect(saved.previewUrl).toBe('');
    expect(saved.posterUrl).toBe('assets/images/place-cover.jpg');
  });
});
