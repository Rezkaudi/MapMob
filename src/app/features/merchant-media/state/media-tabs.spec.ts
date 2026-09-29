import { buildMediaItem, buildMediaVideo } from '../testing/merchant-media-fixture';
import { buildMediaTabs, filterMediaByTab } from './media-tabs';

const PICTURE = buildMediaItem({ id: 'picture' });
const MAIN = buildMediaItem({ id: 'main', isMain: true });
const VIDEO = buildMediaVideo({ id: 'video' });

describe('buildMediaTabs', () => {
  it('lists الكل, الصور and الفيديوهات with their counts, in the frame order', () => {
    expect(buildMediaTabs([PICTURE, MAIN, VIDEO])).toEqual([
      { value: 'all', label: 'الكل', icon: 'grid-four', count: 3 },
      { value: 'images', label: 'الصور', icon: 'media', count: 2 },
      { value: 'videos', label: 'الفيديوهات', icon: 'video', count: 1 },
    ]);
  });
});

describe('filterMediaByTab', () => {
  it('puts the main picture first and keeps the rest in their order', () => {
    expect(filterMediaByTab([PICTURE, VIDEO, MAIN], 'all').map((item) => item.id)).toEqual([
      'main',
      'picture',
      'video',
    ]);
  });

  it('keeps one kind for the الصور and الفيديوهات tabs', () => {
    expect(filterMediaByTab([PICTURE, VIDEO, MAIN], 'images').map((item) => item.id)).toEqual([
      'main',
      'picture',
    ]);
    expect(filterMediaByTab([PICTURE, VIDEO, MAIN], 'videos').map((item) => item.id)).toEqual([
      'video',
    ]);
  });
});
