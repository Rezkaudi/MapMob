import { buildMediaItem, buildMediaVideo } from '../testing/merchant-media-fixture';
import { countMedia } from './media-count-tiles';

describe('countMedia', () => {
  it('counts pictures first, so RTL puts them on the right as the frame does', () => {
    const items = [buildMediaItem({ id: '1' }), buildMediaItem({ id: '2' }), buildMediaVideo()];

    expect(countMedia(items)).toEqual([
      { key: 'image', label: 'صور نشطة', count: 2, icon: 'media', tone: 'primary' },
      { key: 'video', label: 'فيديو نشط', count: 1, icon: 'video', tone: 'accent' },
    ]);
  });
});
