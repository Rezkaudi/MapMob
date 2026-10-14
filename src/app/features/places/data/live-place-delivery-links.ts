import { LiveDeliveryPlatform } from '../../../shared/data/live-delivery-platform';
import { LiveStoreDeliveryLink } from '../../../shared/data/live-store-delivery-link';
import { toDeliveryPlatform } from '../../../shared/data/to-delivery-platform';
import { DeliveryLink } from '../../../shared/models/delivery-link';
import { listOfferedPlatforms } from './offered-delivery-platforms';

/**
 * One row per switched-on platform, so the form can add a link to any of them.
 * A link to a switched-off platform stays, so saving the place does not delete it.
 */
export function toPlaceDeliveryLinks(
  platforms: readonly LiveDeliveryPlatform[],
  links: readonly LiveStoreDeliveryLink[],
): DeliveryLink[] {
  const offered = listOfferedPlatforms(platforms);
  const offeredIds = new Set(offered.map((platform) => String(platform.id)));
  const retiredButLinked = platforms.filter(
    (platform) =>
      !offeredIds.has(String(platform.id)) &&
      links.some((link) => String(link.deliveryPlatformId) === String(platform.id)),
  );
  return [...offered, ...retiredButLinked].map((platform) => {
    const link = links.find(
      (candidate) => String(candidate.deliveryPlatformId) === String(platform.id),
    );
    return {
      platform: toDeliveryPlatform(platform),
      isEnabled: link?.isActive ?? false,
      storeUrl: link?.url ?? null,
    };
  });
}
