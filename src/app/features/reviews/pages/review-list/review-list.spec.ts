import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { ReviewRepository } from '../../data/review.repository';
import { ReviewList } from './review-list';

describe('ReviewList', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: ReviewRepository,
          useValue: {
            getReviews: () =>
              of({
                items: [
                  {
                    id: 'review-1',
                    userName: 'أحمد جمال',
                    userAvatarUrl: null,
                    placeName: 'صيدلية الحياة',
                    rating: 5,
                    comment: 'ممتاز جداً',
                    createdAt: '2024-01-12T00:00:00.000Z',
                    status: 'published',
                  },
                ],
                totalCount: 1,
              }),
            getSummary: () =>
              of({ reportedCount: 4, newCount: 14, averageRating: 4.3, totalCount: 3000 }),
          },
        },
      ],
    });
  });

  it('loads and renders the review rows and summary cards', () => {
    const fixture = TestBed.createComponent(ReviewList);
    fixture.detectChanges();

    const text = fixture.nativeElement.textContent;
    expect(text).toContain('التقييمات والمراجعات');
    expect(text).toContain('أحمد جمال');
    expect(text).toContain('صيدلية الحياة');
    expect(text).toContain('3,000');
  });
});
