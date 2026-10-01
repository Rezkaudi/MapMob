import { buildStoryPicture } from '../testing/story-view-fixture';
import { thumbnailOf } from './story-thumbnail';

describe('thumbnailOf', () => {
  it('shows a picture story as itself', () => {
    expect(thumbnailOf(buildStoryPicture())).toBe('https://cdn.example.com/story-1.jpg');
  });

  it('shows the still frame of a video, or nothing until the server has one', () => {
    const video = buildStoryPicture({ kind: 'video', url: 'https://cdn.example.com/s.mp4' });

    expect(thumbnailOf(video)).toBeNull();
    expect(thumbnailOf({ ...video, posterUrl: 'https://cdn.example.com/s.jpg' })).toBe(
      'https://cdn.example.com/s.jpg',
    );
  });
});
