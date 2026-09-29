import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { CLOCK } from '../../../core/config/clock';
import { OwnerReviewsMockRepository } from './owner-reviews-mock.repository';

const NOW = new Date('2026-09-20T12:00:00.000Z');

function createRepository(): OwnerReviewsMockRepository {
  TestBed.configureTestingModule({
    providers: [OwnerReviewsMockRepository, { provide: CLOCK, useValue: () => NOW }],
  });
  return TestBed.inject(OwnerReviewsMockRepository);
}

describe('OwnerReviewsMockRepository', () => {
  it('pages the seeded reviews and sums them up', async () => {
    const repository = createRepository();

    const page = await firstValueFrom(repository.getReviews({ pageIndex: 0, pageSize: 4 }));
    const summary = await firstValueFrom(repository.getSummary());

    expect(page.items).toHaveLength(4);
    expect(page.totalCount).toBe(128);
    expect(summary.ratedCount).toBe(128);
    expect(summary.thisMonthCount).toBe(18);
  });

  it('marks a reported review as waiting', async () => {
    const repository = createRepository();
    const page = await firstValueFrom(
      repository.getReviews({ pageIndex: 0, pageSize: 1, reportStatus: 'none' }),
    );
    const target = page.items[0];

    const reported = await firstValueFrom(
      repository.reportReview(target.id, { reason: 'abusive', notes: null }),
    );
    const waiting = await firstValueFrom(
      repository.getReviews({ pageIndex: 0, pageSize: 200, reportStatus: 'pending' }),
    );

    expect(reported).toEqual({ ...target, reportStatus: 'pending' });
    expect(waiting.items.map((review) => review.id)).toContain(target.id);
  });

  it('refuses a second report on the same review', async () => {
    const repository = createRepository();
    const page = await firstValueFrom(
      repository.getReviews({ pageIndex: 0, pageSize: 1, reportStatus: 'pending' }),
    );

    await expect(
      firstValueFrom(repository.reportReview(page.items[0].id, { reason: 'fake', notes: null })),
    ).rejects.toThrow('تم الإبلاغ عن هذه المراجعة من قبل.');
  });
});
