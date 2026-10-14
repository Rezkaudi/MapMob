import { formatGroupedNumber } from '../../../shared/formatting/grouped-number';
import { DeliveryPlatformSummary } from '../models/delivery-platform-summary';

const NO_PLATFORM_LABEL = '—';
const UNKNOWN_COUNT_LABEL = '—';

/** Zero before the summary loads; a dash when the server does not count it. */
function formatCount(count: number | null | undefined): string {
  return count === null ? UNKNOWN_COUNT_LABEL : formatGroupedNumber(count ?? 0);
}

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
      value: formatCount(summary?.referralCount),
      icon: 'external-link-feather',
    },
    {
      label: 'المنصة الأكثر استخداماً',
      value: summary?.mostUsedPlatform?.latinName ?? NO_PLATFORM_LABEL,
      icon: 'trending-up-feather',
    },
    {
      label: 'المتاجر المرتبطة بمنصات طلبات',
      value: formatCount(summary?.linkedStoreCount),
      icon: 'building',
    },
    {
      label: 'عدد المنصات النشطة',
      value: formatCount(summary?.activeCount),
      icon: 'bell-feather',
    },
  ];
}
