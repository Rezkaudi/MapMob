import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { MerchantReviewItem } from '../../models/merchant-review-item';
import { LatestReviewsCard } from './latest-reviews-card';

const REVIEWS: readonly MerchantReviewItem[] = [
  {
    id: 'r-1',
    authorName: 'سارة أحمد',
    rating: 4,
    comment: '"الخدمة ممتازة جداً"',
    createdAt: '2026-07-24T10:00:00Z',
    ageText: 'منذ يومين',
  },
];

function render(reviews: readonly MerchantReviewItem[]) {
  TestBed.configureTestingModule({ providers: [provideRouter([])] });
  const fixture = TestBed.createComponent(LatestReviewsCard);
  fixture.componentRef.setInput('reviews', reviews);
  fixture.detectChanges();
  return fixture.nativeElement as HTMLElement;
}

describe('LatestReviewsCard', () => {
  it('titles the card with the amber star and links to every review', () => {
    const element = render(REVIEWS);

    expect(element.querySelector('h2')!.textContent!.trim()).toBe('آخر التقييمات');
    expect(element.querySelector('.bg-accent app-icon')).toBeTruthy();
    expect(element.querySelector('a')!.getAttribute('href')).toBe('/merchant/reviews');
  });

  it('writes the reviewer before the stars, so RTL puts the name right and the stars left', () => {
    const element = render(REVIEWS);

    const top = element.querySelector('li')!.firstElementChild!;
    expect(top.children[0].textContent).toContain('سارة أحمد');
    expect(top.children[0].textContent).toContain('منذ يومين');
    expect(top.children[1].tagName).toBe('APP-STAR-RATING');
  });

  it('shows the comment under the name', () => {
    const element = render(REVIEWS);

    expect(element.querySelector('li p')!.textContent!.trim()).toBe('"الخدمة ممتازة جداً"');
  });
});
