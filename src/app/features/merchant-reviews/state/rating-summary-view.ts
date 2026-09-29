import { formatArabicCount } from '../../../shared/formatting/arabic-count';
import { OwnerReviewSummary } from '../models/owner-review-summary';
import { NEW_RATING_WORDS, VERIFIED_RATING_WORDS } from './review-count-words';

const SCORE_DECIMALS = 1;
const FULL_SHARE = 100;
/** "66%", "7%", "3.1%": two digits say enough for a bar label. */
const SHARE_FORMAT = new Intl.NumberFormat('en', { maximumSignificantDigits: 2 });

export interface StarShareRow {
  readonly stars: number;
  /** "85 (66%)". */
  readonly countText: string;
  /** 0 to 100, for the bar. */
  readonly sharePercent: number;
}

export interface MonthChange {
  /** "+12%" or "-20%". */
  readonly text: string;
  readonly isRising: boolean;
}

export interface RatingSummaryView {
  readonly averageText: string;
  readonly filledStarCount: number;
  readonly basisText: string;
  readonly starRows: readonly StarShareRow[];
  readonly month: {
    readonly countText: string;
    /** `null` when last month had no reviews to compare with. */
    readonly change: MonthChange | null;
  };
}

export function buildRatingSummaryView(summary: OwnerReviewSummary): RatingSummaryView {
  return {
    averageText: summary.averageRating.toFixed(SCORE_DECIMALS),
    filledStarCount: Math.round(summary.averageRating),
    basisText: `بناءً على ${formatArabicCount(summary.ratedCount, VERIFIED_RATING_WORDS)}`,
    starRows: summary.starCounts.map(({ stars, count }) =>
      buildStarShareRow(stars, count, summary.ratedCount),
    ),
    month: {
      countText: formatArabicCount(summary.thisMonthCount, NEW_RATING_WORDS),
      change: buildMonthChange(summary.thisMonthCount, summary.lastMonthCount),
    },
  };
}

function buildStarShareRow(stars: number, count: number, ratedCount: number): StarShareRow {
  const sharePercent = ratedCount === 0 ? 0 : (count / ratedCount) * FULL_SHARE;
  return { stars, countText: `${count} (${SHARE_FORMAT.format(sharePercent)}%)`, sharePercent };
}

function buildMonthChange(thisMonthCount: number, lastMonthCount: number): MonthChange | null {
  if (lastMonthCount === 0) {
    return null;
  }
  const changePercent = Math.round(
    ((thisMonthCount - lastMonthCount) / lastMonthCount) * FULL_SHARE,
  );
  const isRising = changePercent >= 0;
  return { text: `${isRising ? '+' : ''}${changePercent}%`, isRising };
}
