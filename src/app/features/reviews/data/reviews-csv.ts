import { CsvRow, buildCsvFile } from '../../../shared/files/csv-file';
import { Review } from '../models/review';
import { REVIEW_STATUS_LABEL } from '../models/review-status';
import { formatReviewRating } from '../state/review-rating-label';

const HEADER: CsvRow = [
  'اسم المستخدم',
  'المكان',
  'التقييم',
  'نص المراجعة والتعليق',
  'التاريخ',
  'الحالة',
];
const ISO_DAY_LENGTH = 10;
const NO_RATING_CELL = '';

function toRow(review: Review): CsvRow {
  return [
    review.userName,
    review.placeName,
    formatReviewRating(review.rating) ?? NO_RATING_CELL,
    review.comment,
    review.createdAt.slice(0, ISO_DAY_LENGTH),
    REVIEW_STATUS_LABEL[review.status],
  ];
}

/** The export file has the same columns as the reviews table. */
export function buildReviewsCsvFile(reviews: readonly Review[]): Blob {
  return buildCsvFile([HEADER, ...reviews.map(toRow)]);
}
