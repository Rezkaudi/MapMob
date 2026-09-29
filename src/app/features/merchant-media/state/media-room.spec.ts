import {
  buildMediaItem,
  buildMediaLibrary,
  buildMediaVideo,
} from '../testing/merchant-media-fixture';
import { describeMediaRoom } from './media-room';

describe('describeMediaRoom', () => {
  it('counts what is left of each limit on its own', () => {
    const library = buildMediaLibrary({
      imageLimit: 4,
      videoLimit: 1,
      items: [buildMediaItem({ id: '1' }), buildMediaItem({ id: '2' }), buildMediaVideo()],
    });

    expect(describeMediaRoom(library)).toEqual({
      remainingImages: 2,
      remainingVideos: 0,
      canAddImage: true,
      canAddVideo: false,
      isFull: false,
    });
  });

  it('is full once neither kind has room', () => {
    const library = buildMediaLibrary({ imageLimit: 1, videoLimit: 0, items: [buildMediaItem()] });

    expect(describeMediaRoom(library).isFull).toBe(true);
  });

  it('treats a null limit as no cap', () => {
    const library = buildMediaLibrary({ imageLimit: null, videoLimit: null });

    expect(describeMediaRoom(library)).toEqual({
      remainingImages: null,
      remainingVideos: null,
      canAddImage: true,
      canAddVideo: true,
      isFull: false,
    });
  });

  it('never counts below zero when a plan shrank under the files', () => {
    const library = buildMediaLibrary({
      imageLimit: 1,
      items: [buildMediaItem({ id: '1' }), buildMediaItem({ id: '2' })],
    });

    expect(describeMediaRoom(library).remainingImages).toBe(0);
  });
});
