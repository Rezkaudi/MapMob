import { buildReview, buildReviewDetail } from '../testing/review-fixture';
import { ReviewMockDatabase } from './review-mock-database';

const PUBLISHED = buildReviewDetail({ review: buildReview({ id: 'r1' }), report: null });
const REPORTED = buildReviewDetail();

function createDatabase(): ReviewMockDatabase {
  return new ReviewMockDatabase([PUBLISHED, REPORTED]);
}

describe('ReviewMockDatabase', () => {
  it('lists the reviews and finds one in detail', () => {
    const database = createDatabase();

    expect(database.listReviews()).toEqual([PUBLISHED.review, REPORTED.review]);
    expect(database.find('review-2')).toEqual(REPORTED);
  });

  it('hides a review once its report is accepted, and settles the report', () => {
    const database = createDatabase();

    const review = database.acceptReport('review-2');

    expect(review.status).toBe('hidden');
    expect(database.find('review-2').report).toBeNull();
  });

  it('publishes a review again once its report is rejected, and settles the report', () => {
    const database = createDatabase();

    const review = database.rejectReport('review-2');

    expect(review.status).toBe('published');
    expect(database.find('review-2').report).toBeNull();
  });

  it('refuses to settle a report that is not there', () => {
    expect(() => createDatabase().acceptReport('r1')).toThrowError(
      'لا يوجد بلاغ قيد المراجعة لهذا التقييم',
    );
  });

  it('hides or shows a review and deletes one', () => {
    const database = createDatabase();

    expect(database.setStatus('r1', 'hidden').status).toBe('hidden');
    database.remove('review-2');

    expect(database.listReviews().map((review) => review.id)).toEqual(['r1']);
  });

  it('throws a readable error for a review that is not there', () => {
    expect(() => createDatabase().find('missing')).toThrowError('لم يتم العثور على التقييم');
  });
});
