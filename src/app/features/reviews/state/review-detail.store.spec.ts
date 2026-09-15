import { TestBed } from '@angular/core/testing';
import { NEVER, of, throwError } from 'rxjs';
import { ReviewRepository } from '../data/review.repository';
import { buildReviewDetail } from '../testing/review-fixture';
import { ReviewDetailStore } from './review-detail.store';

function createStore(repository: Partial<ReviewRepository>) {
  TestBed.configureTestingModule({
    providers: [ReviewDetailStore, { provide: ReviewRepository, useValue: repository }],
  });
  return TestBed.inject(ReviewDetailStore);
}

describe('ReviewDetailStore', () => {
  it('is closed until a review is opened', () => {
    const store = createStore({});

    expect(store.isOpen()).toBe(false);
    expect(store.view()).toBeNull();
  });

  it('opens a review, loads it and exposes the drawer view', () => {
    let requestedId = '';
    const store = createStore({
      getReviewDetail: (id) => {
        requestedId = id;
        return of(buildReviewDetail());
      },
    });

    store.open('review-2');

    expect(requestedId).toBe('review-2');
    expect(store.isOpen()).toBe(true);
    expect(store.isLoading()).toBe(false);
    expect(store.detail()?.review.id).toBe('review-2');
    expect(store.view()?.title).toBe('تفاصيل المراجعة والبلاغ');
  });

  it('is loading until the review arrives, and keeps no old review meanwhile', () => {
    const store = createStore({ getReviewDetail: () => NEVER });

    store.open('review-2');

    expect(store.isOpen()).toBe(true);
    expect(store.isLoading()).toBe(true);
    expect(store.detail()).toBeNull();
  });

  it('reports a failed load and tries again for the same review', () => {
    let attempts = 0;
    const store = createStore({
      getReviewDetail: () => {
        attempts += 1;
        return attempts === 1
          ? throwError(() => new Error('تعذر التحميل'))
          : of(buildReviewDetail());
      },
    });

    store.open('review-2');
    expect(store.error()).toBe('تعذر التحميل');
    store.reload();

    expect(attempts).toBe(2);
    expect(store.detail()).not.toBeNull();
  });

  it('forgets the review once closed', () => {
    const store = createStore({ getReviewDetail: () => of(buildReviewDetail()) });

    store.open('review-2');
    store.close();

    expect(store.isOpen()).toBe(false);
    expect(store.detail()).toBeNull();
  });
});
