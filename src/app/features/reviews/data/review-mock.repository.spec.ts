import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { CLOCK } from '../../../core/config/clock';
import { buildReview, buildReviewDetail } from '../testing/review-fixture';
import { ReviewMockDatabase } from './review-mock-database';
import { ReviewMockRepository } from './review-mock.repository';

const PUBLISHED = buildReviewDetail({ review: buildReview({ id: 'r1' }), report: null });
const REPORTED = buildReviewDetail();

describe('ReviewMockRepository', () => {
  let repository: ReviewMockRepository;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ReviewMockRepository,
        { provide: ReviewMockDatabase, useValue: new ReviewMockDatabase([PUBLISHED, REPORTED]) },
        { provide: CLOCK, useValue: () => new Date(2026, 8, 15) },
      ],
    });
    repository = TestBed.inject(ReviewMockRepository);
  });

  it('pages, filters and counts the stored reviews', async () => {
    const page = await firstValueFrom(
      repository.getReviews({ pageIndex: 0, pageSize: 4, status: 'reported' }),
    );
    const summary = await firstValueFrom(repository.getSummary());

    expect(page).toEqual({ items: [REPORTED.review], totalCount: 1 });
    expect(summary.totalCount).toBe(2);
    expect(summary.reportedCount).toBe(1);
  });

  it('settles a report, hides a review, deletes one and reads one in detail', async () => {
    await firstValueFrom(repository.acceptReport('review-2'));
    await firstValueFrom(repository.setReviewStatus('r1', 'hidden'));
    const detail = await firstValueFrom(repository.getReviewDetail('review-2'));
    await firstValueFrom(repository.deleteReview('r1'), { defaultValue: undefined });

    expect(detail.review.status).toBe('hidden');
    expect(detail.report).toBeNull();
    expect((await firstValueFrom(repository.getSummary())).totalCount).toBe(1);
  });

  it('fails the request for a review that does not exist', async () => {
    await expect(firstValueFrom(repository.getReviewDetail('missing'))).rejects.toThrowError();
    await expect(firstValueFrom(repository.rejectReport('r1'))).rejects.toThrowError();
  });

  it('exports the filtered reviews as a CSV file', async () => {
    const file = await firstValueFrom(
      repository.exportReviews({ pageIndex: 0, pageSize: 4, status: 'reported' }),
    );

    expect(file.type).toContain('text/csv');
    const text = await file.text();
    expect(text).toContain('سارة محمد');
    expect(text).not.toContain('أحمد جمال');
  });
});
