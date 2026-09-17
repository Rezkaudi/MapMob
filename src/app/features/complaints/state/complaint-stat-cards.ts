import { StatDotTone } from '../../../shared/ui/stat-card/stat-card';
import { COMPLAINT_STATUS_LABELS } from '../models/complaint-status';
import { ComplaintSummary } from '../models/complaint-summary';

export interface ComplaintStatCard {
  readonly label: string;
  readonly value: string;
  readonly icon: string;
  readonly dotTone: StatDotTone | null;
}

/** RTL puts the first card on the right, where the design leads with the total. */
export function buildComplaintStatCards(
  summary: ComplaintSummary | null,
): readonly ComplaintStatCard[] {
  const statusCard = (label: string, count: number | undefined, dotTone: StatDotTone) => ({
    label,
    value: `${count ?? 0}`,
    icon: '',
    dotTone,
  });
  return [
    {
      label: 'إجمالي البلاغات',
      value: `${summary?.totalCount ?? 0}`,
      icon: 'complaints',
      dotTone: null,
    },
    statusCard(COMPLAINT_STATUS_LABELS.new, summary?.newCount, 'primary'),
    statusCard(COMPLAINT_STATUS_LABELS.inReview, summary?.inReviewCount, 'warning'),
    statusCard(COMPLAINT_STATUS_LABELS.rejected, summary?.rejectedCount, 'error'),
    statusCard(COMPLAINT_STATUS_LABELS.resolved, summary?.resolvedCount, 'success'),
  ];
}
