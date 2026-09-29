import { buildMediaItem, buildMediaVideo } from '../testing/merchant-media-fixture';
import { toMediaCard } from './media-card-view';

describe('toMediaCard', () => {
  it('writes a picture card as the frame does', () => {
    const item = buildMediaItem();

    expect(toMediaCard(item)).toEqual({
      item,
      kindLabel: 'صورة',
      isVideo: false,
      fileText: 'JPG · 2.4 MB',
      addedText: 'أضيف في 12 سبتمبر 2026',
      replaceLabel: 'استبدال الصورة',
      accept: 'image/jpeg,image/png',
    });
  });

  it('writes a video card', () => {
    const card = toMediaCard(buildMediaVideo());

    expect(card.kindLabel).toBe('فيديو');
    expect(card.isVideo).toBe(true);
    expect(card.fileText).toBe('MP4 · 18.5 MB');
    expect(card.replaceLabel).toBe('استبدال الفيديو');
    expect(card.accept).toBe('video/*');
  });
});
