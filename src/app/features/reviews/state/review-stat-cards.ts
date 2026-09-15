import { ReviewSummary } from '../models/review-summary';

const STAT_ICON = 'star-rounded';
const NEEDS_ACTION_LABEL = 'تتطلب إجراء';
const RATING_DECIMALS = 1;
const NUMBER_FORMAT = new Intl.NumberFormat('en-US');

export interface ReviewStatCard {
  readonly label: string;
  readonly value: string;
  readonly icon: string;
  readonly alert: string | null;
}

function card(label: string, value: string, alert: string | null = null): ReviewStatCard {
  return { label, value, icon: STAT_ICON, alert };
}

/** RTL puts the first card on the right, so "إجمالي التقييمات" leads. */
export function buildReviewStatCards(summary: ReviewSummary | null): readonly ReviewStatCard[] {
  const reportedCount = summary?.reportedCount ?? 0;
  return [
    card('إجمالي التقييمات', NUMBER_FORMAT.format(summary?.totalCount ?? 0)),
    card('متوسط التقييم العام', (summary?.averageRating ?? 0).toFixed(RATING_DECIMALS)),
    card('التقييمات الجديدة', NUMBER_FORMAT.format(summary?.newCount ?? 0)),
    card(
      'مبلغ عنها',
      NUMBER_FORMAT.format(reportedCount),
      reportedCount > 0 ? NEEDS_ACTION_LABEL : null,
    ),
  ];
}
