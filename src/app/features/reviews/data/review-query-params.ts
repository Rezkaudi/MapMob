import { HttpParams } from '@angular/common/http';
import { LiveFilterValue, toLiveFilterParams } from '../../../core/http/live-filter-params';
import { toLiveSort } from '../../../core/http/live-list-sort';
import { ReviewQuery } from '../models/review-query';
import { ReviewRatingFilter } from '../models/review-rating-filter';
import { ReviewStatus } from '../models/review-status';

type LiveFilters = Readonly<Record<string, LiveFilterValue>>;

// Each star choice is an exact count; "no stars" has its own name.
const LIVE_RATING: Record<ReviewRatingFilter, LiveFilters> = {
  fiveStars: { rating: 5 },
  fourStars: { rating: 4 },
  threeStars: { rating: 3 },
  twoStars: { rating: 2 },
  oneStar: { rating: 1 },
  unrated: { is_rated: 0 },
};

// The server refuses "published" and "reported" as a status; a report is its own flag.
const LIVE_STATUS: Record<ReviewStatus, LiveFilters> = {
  published: { is_reported: 0 },
  reported: { is_reported: 1 },
  hidden: { status: 'hidden' },
};

/** Every filter the review list sends; the page walk adds the page itself. */
export function toReviewFilterParams(query: ReviewQuery): HttpParams {
  return toLiveFilterParams({
    search: query.search,
    sort_by: toLiveSort(query.sort),
    ...(query.rating ? LIVE_RATING[query.rating] : {}),
    ...(query.status ? LIVE_STATUS[query.status] : {}),
    store_name: query.placeName,
    date_from: query.submittedFrom,
    date_to: query.submittedTo,
  });
}
