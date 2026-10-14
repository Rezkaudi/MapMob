import { LiveDeliveryPlatform } from '../../../shared/data/live-delivery-platform';

const NO_SORT_ORDER = 0;

/** The switched-on platforms, in the display order the admins set. */
export function listOfferedPlatforms(
  platforms: readonly LiveDeliveryPlatform[],
): LiveDeliveryPlatform[] {
  return platforms
    .filter((platform) => platform.is_active)
    .sort(
      (left, right) => (left.sort_order ?? NO_SORT_ORDER) - (right.sort_order ?? NO_SORT_ORDER),
    );
}
