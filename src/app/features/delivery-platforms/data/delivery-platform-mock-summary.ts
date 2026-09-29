import { DeliveryPlatformEntry } from '../models/delivery-platform-entry';
import { DeliveryPlatformSummary } from '../models/delivery-platform-summary';
import { LinkedStore } from '../models/linked-store';

export function summarizeDeliveryPlatforms(
  platforms: readonly DeliveryPlatformEntry[],
  linkedStores: readonly LinkedStore[],
): DeliveryPlatformSummary {
  const mostUsed = platforms.reduce<DeliveryPlatformEntry | null>(
    (best, platform) => (platform.referralCount > (best?.referralCount ?? 0) ? platform : best),
    null,
  );
  return {
    referralCount: platforms.reduce((total, platform) => total + platform.referralCount, 0),
    mostUsedPlatform: mostUsed
      ? { id: mostUsed.id, name: mostUsed.name, latinName: mostUsed.latinName }
      : null,
    linkedStoreCount: new Set(linkedStores.map((store) => store.id)).size,
    activeCount: platforms.filter((platform) => platform.status === 'active').length,
    platformCount: platforms.length,
  };
}
