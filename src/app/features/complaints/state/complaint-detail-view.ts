import { ComplaintDetail } from '../models/complaint-detail';
import { COMPLAINT_REASON_LABELS } from '../models/complaint-reason';
import { COMPLAINT_STATUS_LABELS } from '../models/complaint-status';

const RATING_DECIMALS = 1;

export interface ComplaintDetailView {
  readonly reasonLabel: string;
  readonly statusLabel: string;
  readonly ratingLabel: string;
  readonly reviewCountLabel: string;
  readonly reporterProfileLink: string;
  readonly placeLink: string;
}

export function buildComplaintDetailView(detail: ComplaintDetail): ComplaintDetailView {
  return {
    reasonLabel: COMPLAINT_REASON_LABELS[detail.reason],
    statusLabel: COMPLAINT_STATUS_LABELS[detail.status],
    ratingLabel: detail.place.rating.toFixed(RATING_DECIMALS),
    // The design keeps a space before the closing bracket.
    reviewCountLabel: `(${detail.place.reviewCount} تقييماً )`,
    reporterProfileLink: `/users/${detail.reporter.id}`,
    placeLink: `/places/${detail.place.id}`,
  };
}
