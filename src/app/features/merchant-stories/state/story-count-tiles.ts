import { DistributionTile } from '../../../shared/models/distribution-tile';
import { MerchantStory } from '../models/merchant-story';

/** Active first, so RTL lays it out on the right. The icons are the frame's own. */
export function countStories(items: readonly MerchantStory[]): readonly DistributionTile[] {
  const active = items.filter((story) => story.status === 'active').length;
  return [
    { key: 'active', label: 'قصة نشطة', count: active, icon: 'media', tone: 'primary' },
    {
      key: 'expired',
      label: 'قصة منتهية',
      count: items.length - active,
      icon: 'video',
      tone: 'accent',
    },
  ];
}
