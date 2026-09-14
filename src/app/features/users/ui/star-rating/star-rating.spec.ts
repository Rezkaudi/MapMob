import { TestBed } from '@angular/core/testing';
import { StarRating } from './star-rating';

describe('StarRating', () => {
  it('fills as many of the five stars as the rating and says the rating aloud', () => {
    const fixture = TestBed.createComponent(StarRating);
    fixture.componentRef.setInput('rating', 4);
    fixture.detectChanges();
    const element = fixture.nativeElement as HTMLElement;

    const stars = Array.from(element.querySelectorAll('app-icon'));
    expect(stars).toHaveLength(5);
    expect(stars.filter((star) => star.classList.contains('text-[#fea619]'))).toHaveLength(4);
    expect(element.querySelector('[role="img"]')?.getAttribute('aria-label')).toBe('4 من 5 نجوم');
  });
});
