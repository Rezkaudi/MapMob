import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { PagedResult } from '../../../core/models/paged-result';
import { Review } from '../models/review';
import { ReviewSummary } from '../models/review-summary';
import { ReviewRepository } from '../data/review.repository';
import { ReviewsStore } from './reviews.store';

const REVIEW: Review = {
  id: 'review-1',
  userName: 'أحمد جمال',
  userAvatarUrl: null,
  placeName: 'صيدلية الحياة',
  rating: 5,
  comment: 'ممتاز',
  createdAt: '2024-01-12T00:00:00.000Z',
  status: 'published',
};

const SUMMARY: ReviewSummary = {
  reportedCount: 4,
  newCount: 14,
  averageRating: 4.3,
  totalCount: 3000,
};

function createStore(repository: Partial<ReviewRepository>) {
  TestBed.configureTestingModule({
    providers: [ReviewsStore, { provide: ReviewRepository, useValue: repository }],
  });
  return TestBed.inject(ReviewsStore);
}

describe('ReviewsStore', () => {
  it('starts empty and not loading', () => {
    const store = createStore({});

    expect(store.reviews()).toEqual([]);
    expect(store.isLoading()).toBe(false);
  });

  it('loadReviews populates the list, the total count and the summary', () => {
    const store = createStore({
      getReviews: () => of({ items: [REVIEW], totalCount: 1 } satisfies PagedResult<Review>),
      getSummary: () => of(SUMMARY),
    });

    store.loadReviews();

    expect(store.reviews()).toEqual([REVIEW]);
    expect(store.totalCount()).toBe(1);
    expect(store.summary()).toEqual(SUMMARY);
    expect(store.isLoading()).toBe(false);
  });

  it('sets an error message when loading fails', () => {
    const store = createStore({
      getReviews: () => throwError(() => new Error('Network down')),
      getSummary: () => of(SUMMARY),
    });

    store.loadReviews();

    expect(store.error()).toBe('Network down');
    expect(store.isLoading()).toBe(false);
  });

  it('changePage reloads with the new page index', () => {
    let requestedPageIndex = -1;
    const store = createStore({
      getReviews: (query) => {
        requestedPageIndex = query.pageIndex;
        return of({ items: [], totalCount: 100 });
      },
      getSummary: () => of(SUMMARY),
    });

    store.loadReviews();
    store.changePage(2);

    expect(requestedPageIndex).toBe(2);
  });
  it('reports no results only once the load has finished', () => {
    const store = createStore({
      getReviews: () => of({ items: [], totalCount: 0 } satisfies PagedResult<Review>),
      getSummary: () => of(SUMMARY),
    });

    store.loadReviews();

    expect(store.hasNoResults()).toBe(true);
  });
});
