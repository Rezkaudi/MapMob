import { DistributionTile } from '../../../shared/models/distribution-tile';
import { MerchantMediaItem } from '../models/merchant-media-item';

/** Pictures first, so RTL lays them out on the right as the frame does. */
export function countMedia(items: readonly MerchantMediaItem[]): readonly DistributionTile[] {
  const videos = items.filter((item) => item.kind === 'video').length;
  return [
    {
      key: 'image',
      label: 'صور نشطة',
      count: items.length - videos,
      icon: 'media',
      tone: 'primary',
    },
    { key: 'video', label: 'فيديو نشط', count: videos, icon: 'video', tone: 'accent' },
  ];
}
