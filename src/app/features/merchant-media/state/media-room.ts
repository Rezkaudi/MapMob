import { MediaKind } from '../models/media-kind';
import { MediaRoom } from '../models/media-room';
import { MerchantMediaItem } from '../models/merchant-media-item';
import { MerchantMediaLibrary } from '../models/merchant-media-library';

function remainingOf(
  items: readonly MerchantMediaItem[],
  kind: MediaKind,
  limit: number | null,
): number | null {
  if (limit === null) {
    return null;
  }
  const used = items.filter((item) => item.kind === kind).length;
  return Math.max(0, limit - used);
}

function hasRoom(remaining: number | null): boolean {
  return remaining === null || remaining > 0;
}

/** The plan caps pictures and videos apart (plans.limit_gallery_images, plans.limit_videos). */
export function describeMediaRoom(library: MerchantMediaLibrary): MediaRoom {
  const remainingImages = remainingOf(library.items, 'image', library.imageLimit);
  const remainingVideos = remainingOf(library.items, 'video', library.videoLimit);
  const canAddImage = hasRoom(remainingImages);
  const canAddVideo = hasRoom(remainingVideos);
  return {
    remainingImages,
    remainingVideos,
    canAddImage,
    canAddVideo,
    isFull: !canAddImage && !canAddVideo,
  };
}
