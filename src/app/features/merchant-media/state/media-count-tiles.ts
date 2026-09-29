import { MediaCountTile } from '../models/media-count-tile';
import { MerchantMediaItem } from '../models/merchant-media-item';

/** Pictures first, so RTL lays them out on the right as the frame does. */
export function countMedia(items: readonly MerchantMediaItem[]): readonly MediaCountTile[] {
  const videos = items.filter((item) => item.kind === 'video').length;
  return [
    { kind: 'image', label: 'صور نشطة', count: items.length - videos },
    { kind: 'video', label: 'فيديو نشط', count: videos },
  ];
}
