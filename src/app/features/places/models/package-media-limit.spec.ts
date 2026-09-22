import { PACKAGE_MEDIA_LIMIT } from './package-media-limit';

describe('package media limits', () => {
  it('holds the free tier to the three pictures and one video the design states', () => {
    expect(PACKAGE_MEDIA_LIMIT.free).toEqual({ images: 3, videos: 1 });
  });

  it('gives every paid tier more of both than the one below it', () => {
    expect(PACKAGE_MEDIA_LIMIT.basic.images).toBeGreaterThan(PACKAGE_MEDIA_LIMIT.free.images);
    expect(PACKAGE_MEDIA_LIMIT.premium.images).toBeGreaterThan(PACKAGE_MEDIA_LIMIT.basic.images);
    expect(PACKAGE_MEDIA_LIMIT.basic.videos).toBeGreaterThan(PACKAGE_MEDIA_LIMIT.free.videos);
    expect(PACKAGE_MEDIA_LIMIT.premium.videos).toBeGreaterThan(PACKAGE_MEDIA_LIMIT.basic.videos);
  });
});
