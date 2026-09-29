import { CountWords, formatArabicCount } from '../../../shared/formatting/arabic-count';
import { formatGroupedNumber } from '../../../shared/formatting/grouped-number';
import { DeliveryPlatformEntry } from '../models/delivery-platform-entry';
import { DELIVERY_PLATFORM_STATUS_LABEL } from '../models/delivery-platform-status';

const STORE_WORDS: CountWords = { one: 'متجر واحد', two: 'متجران', few: 'متاجر', many: 'متجر' };

export interface DeliveryPlatformLabels {
  readonly storeCountLabel: string;
  readonly referralLabel: string;
  readonly statusLabel: string;
}

/** The words the table and the details dialog both put on a platform. */
export function describeDeliveryPlatform(platform: DeliveryPlatformEntry): DeliveryPlatformLabels {
  return {
    storeCountLabel: formatArabicCount(platform.linkedStoreCount, STORE_WORDS),
    referralLabel: formatGroupedNumber(platform.referralCount),
    statusLabel: DELIVERY_PLATFORM_STATUS_LABEL[platform.status],
  };
}
