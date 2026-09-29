import { formatGroupedNumber } from '../../../shared/formatting/grouped-number';
import { DeliveryPlatformSummary } from '../models/delivery-platform-summary';

const NO_PLATFORM_LABEL = '—';

export interface DeliveryPlatformStatCard {
  readonly label: string;
  readonly value: string;
  readonly icon: string;
}

/** RTL puts the first card on the right, so the referrals lead. */
export function buildDeliveryPlatformStatCards(
  summary: DeliveryPlatformSummary | null,
): readonly DeliveryPlatformStatCard[] {
  return [
    {
      label: 'التحويلات إلى منصات التوصيل',
      value: formatGroupedNumber(summary?.referralCount ?? 0),
      icon: 'external-link-feather',
    },
    {
      label: 'المنصة الأكثر استخداماً',
      value: summary?.mostUsedPlatform?.latinName ?? NO_PLATFORM_LABEL,
      icon: 'trending-up-feather',
    },
    {
      label: 'المتاجر المرتبطة بمنصات طلبات',
      value: formatGroupedNumber(summary?.linkedStoreCount ?? 0),
      icon: 'building',
    },
    {
      label: 'عدد المنصات النشطة',
      value: formatGroupedNumber(summary?.activeCount ?? 0),
      icon: 'bell-feather',
    },
  ];
}
